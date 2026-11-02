import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable, of } from 'rxjs';
import { catchError, delay, map, switchMap } from 'rxjs/operators';
import {
  Answer,
  PredictionResult,
  Question,
  QuestionnaireResponse,
  Recommendation
} from '../models/index';
import { DepressionAnalysisService } from './depression-analysis.service';
import { DirectoryService } from './directory.service';

export interface QuestionnaireDraftState {
  answers: Answer[];
  freeTextResponse: string;
}

@Injectable({
  providedIn: 'root'
})
export class QuestionnaireService {
  private readonly API_URL = 'http://localhost:3000/api';
  private readonly DRAFT_KEY = 'deltapress_questionnaire_draft';
  private readonly RESULTS_KEY = 'deltapress_saved_results';

  constructor(
    private http: HttpClient,
    private analysisService: DepressionAnalysisService,
    private directoryService: DirectoryService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  getQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.API_URL}/questions`)
      .pipe(catchError(() => of(this.getMockQuestions())));
  }

  saveDraftState(state: QuestionnaireDraftState): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    sessionStorage.setItem(this.DRAFT_KEY, JSON.stringify({
      ...state,
      timestamp: new Date().toISOString()
    }));
  }

  loadDraftState(): QuestionnaireDraftState | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    const draft = sessionStorage.getItem(this.DRAFT_KEY);
    if (!draft) {
      return null;
    }

    const data = JSON.parse(draft) as QuestionnaireDraftState & { timestamp: string };
    const ageInHours = (Date.now() - new Date(data.timestamp).getTime()) / (1000 * 60 * 60);

    if (ageInHours >= 24) {
      return null;
    }

    return {
      answers: data.answers || [],
      freeTextResponse: data.freeTextResponse || ''
    };
  }

  saveDraftAnswers(answers: Answer[]): void {
    const existing = this.loadDraftState();
    this.saveDraftState({
      answers,
      freeTextResponse: existing?.freeTextResponse || ''
    });
  }

  loadDraftAnswers(): Answer[] | null {
    return this.loadDraftState()?.answers || null;
  }

  clearDraftAnswers(): void {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.removeItem(this.DRAFT_KEY);
    }
  }

  submitQuestionnaire(
    answers: Answer[],
    freeTextResponse = '',
    userId?: string
  ): Observable<PredictionResult> {
    const response: Partial<QuestionnaireResponse> = {
      userId,
      answers,
      freeTextResponse,
      completedAt: new Date(),
      duration: this.calculateDuration(answers)
    };

    return this.http.post<PredictionResult>(`${this.API_URL}/predictions`, response).pipe(
      catchError(() => this.buildPredictionResult(answers, freeTextResponse, userId))
    );
  }

  getResultById(id: string): Observable<PredictionResult> {
    const localResult = this.getStoredResults().find(result => result.id === id);
    if (localResult) {
      return of(localResult);
    }

    return this.http.get<PredictionResult>(`${this.API_URL}/predictions/${id}`)
      .pipe(catchError(() => of(this.getStoredResults()[0] as PredictionResult)));
  }

  getTestHistory(userId?: string): Observable<PredictionResult[]> {
    const localResults = this.getStoredResults()
      .filter(result => !userId || result.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    if (localResults.length > 0) {
      return of(localResults);
    }

    const url = userId
      ? `${this.API_URL}/users/${userId}/history`
      : `${this.API_URL}/predictions/history`;

    return this.http.get<PredictionResult[]>(url).pipe(catchError(() => of([])));
  }

  getLatestResultForUser(userId: string): Observable<PredictionResult | null> {
    return this.getTestHistory(userId).pipe(
      map(history => history[0] || null)
    );
  }

  analyzeFreeTextOnly(text: string) {
    return this.analysisService.analyzeFreeText(text);
  }

  private calculateDuration(answers: Answer[]): number {
    return Math.max(180, answers.length * 45);
  }

  private buildPredictionResult(
    answers: Answer[],
    freeTextResponse: string,
    userId?: string
  ): Observable<PredictionResult> {
    const questions = this.getMockQuestions();
    const scored = this.analysisService.scoreQuestionnaire(answers, questions);
    const textAnalysis = this.analysisService.analyzeFreeText(freeTextResponse);
    const urgentSupportNeeded = this.analysisService.mergeUrgency(
      scored.urgentSupportNeeded,
      textAnalysis
    );

    const riskLevel = urgentSupportNeeded && scored.riskLevel === 'moderate'
      ? 'high'
      : urgentSupportNeeded && scored.riskLevel === 'low'
        ? 'moderate'
        : scored.riskLevel;

    const recommendations = this.mergeTextRecommendations(scored.recommendations, textAnalysis, urgentSupportNeeded);

    return this.directoryService.getRecommendedProfessionals(scored.severity, urgentSupportNeeded).pipe(
      map(recommendedProfessionals => {
        const result: PredictionResult = {
          id: `result_${Date.now()}`,
          questionnaireId: `questionnaire_${Date.now()}`,
          userId,
          riskLevel,
          severity: scored.severity,
          severityLabel: scored.severityLabel,
          clinicalInterpretation: {
            ...scored.interpretation,
            urgentSupport: urgentSupportNeeded
          },
          probability: scored.xgboost ? Number(scored.xgboost.probability.toFixed(2)) : Number((scored.score / scored.maxScore).toFixed(2)),
          score: scored.score,
          maxScore: scored.maxScore,
          categoryScores: scored.categoryScores,
          influentialFactors: scored.influentialFactors,
          recommendations,
          recommendedProfessionals,
          textAnalysis,
          freeTextResponse,
          urgentSupportNeeded,
          followUpAdvice: this.buildFollowUpAdvice(scored.severity, urgentSupportNeeded),
          createdAt: new Date(),
          xgboost: scored.xgboost,
          modelVersion: scored.xgboost ? '3.1.0-xgboost' : '2.0.0-local'
        };

        this.persistResult(result);
        return result;
      }),
      delay(800)
    );
  }

  private mergeTextRecommendations(
    recommendations: Recommendation[],
    textAnalysis: ReturnType<DepressionAnalysisService['analyzeFreeText']>,
    urgentSupportNeeded: boolean
  ): Recommendation[] {
    const merged = [...recommendations];

    if (textAnalysis && textAnalysis.detectedThemes.length > 0) {
      merged.push({
        id: 'rec-text-analysis',
        type: 'journaling',
        title: 'Le texte libre confirme certains themes',
        description: textAnalysis.summary,
        priority: textAnalysis.sentiment === 'distressed' || textAnalysis.sentiment === 'critical' ? 'high' : 'medium',
        content: `Themes identifies: ${textAnalysis.detectedThemes.join(', ')}. ${textAnalysis.recommendedAction}`
      });
    }

    if (urgentSupportNeeded && !merged.some(item => item.type === 'crisis_support')) {
      merged.unshift({
        id: 'rec-urgent-text',
        type: 'crisis_support',
        title: 'Aide urgente visible',
        description: 'Le bilan complet suggere un risque eleve ou une formulation de crise.',
        priority: 'high',
        content: 'Ouvrez immediatement les ressources d urgence ou contactez un proche et un professionnel.'
      });
    }

    return merged;
  }

  private buildFollowUpAdvice(severity: string, urgentSupportNeeded: boolean): string[] {
    const advice = [
      'Refaites le test dans quelques jours si votre ressenti evolue rapidement.',
      'Gardez une trace de vos symptomes, de votre sommeil et de votre niveau d energie.'
    ];

    if (severity === 'moderate' || severity === 'moderately_severe' || severity === 'severe') {
      advice.unshift('Prenez rendez-vous avec un professionnel de sante mentale reference.');
    }

    if (urgentSupportNeeded) {
      advice.unshift('Ne restez pas seul si vous vous sentez en danger. Utilisez les ressources d urgence des maintenant.');
    }

    return advice;
  }

  private getStoredResults(): PredictionResult[] {
    if (!isPlatformBrowser(this.platformId)) {
      return [];
    }

    const raw = localStorage.getItem(this.RESULTS_KEY);
    return raw ? JSON.parse(raw) as PredictionResult[] : [];
  }

  private persistResult(result: PredictionResult): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const results = this.getStoredResults();
    results.unshift(result);
    localStorage.setItem(this.RESULTS_KEY, JSON.stringify(results.slice(0, 20)));
  }

  private getMockQuestions(): Question[] {
    return [
      {
        id: 'student_gender',
        category: 'sociodemographic',
        text: 'Quel est votre genre ?',
        type: 'single_choice',
        required: true,
        weight: 0,
        order: 1,
        modelVariable: 'Gender',
        options: [
          { value: 'Homme', label: 'Homme', score: 0 },
          { value: 'Femme', label: 'Femme', score: 0 },
          { value: 'Autre', label: 'Autre', score: 0 },
          { value: 'Prefere ne pas dire', label: 'Prefere ne pas dire', score: 0 }
        ]
      },
      {
        id: 'student_age',
        category: 'sociodemographic',
        text: 'Quel est votre age ?',
        type: 'number',
        required: true,
        weight: 0,
        order: 2,
        min: 17,
        max: 30,
        step: 1,
        modelVariable: 'Age'
      },
      {
        id: 'student_city',
        category: 'sociodemographic',
        text: 'Dans quelle ville etudiez-vous ?',
        type: 'select',
        required: true,
        weight: 0,
        order: 3,
        modelVariable: 'City',
        options: this.toNeutralOptions(['Tunis', 'Sfax', 'Sousse', 'Kairouan', 'Bizerte', 'Gabes', 'Ariana', 'Gafsa', 'Monastir', 'Kasserine', 'Autre'])
      },
      {
        id: 'student_degree',
        category: 'sociodemographic',
        text: 'Quelle est votre formation actuelle ?',
        type: 'select',
        required: true,
        weight: 0,
        order: 4,
        modelVariable: 'Degree',
        options: this.toNeutralOptions(['Licence', 'Mastere', "Cycle d'Ingenieur", 'Doctorat', 'Classes Preparatoires', 'Sante (Medecine, Pharmacie, Dentaire)', 'BTS / ISET', 'Autre'])
      },
      {
        id: 'student_profession',
        category: 'professional',
        text: 'Quelle est votre profession actuelle ?',
        type: 'single_choice',
        required: true,
        weight: 0,
        order: 5,
        modelVariable: 'Profession',
        options: this.toNeutralOptions(['Etudiant a temps plein', 'Etudiant travailleur', 'Stagiaire', 'Autre'])
      },
      {
        id: 'student_academic_pressure',
        category: 'academic',
        text: 'Sur une echelle de 0 a 5, quel niveau de pression academique ressentez-vous actuellement ?',
        type: 'slider',
        required: true,
        weight: 1,
        order: 6,
        min: 0,
        max: 5,
        step: 1,
        modelVariable: 'Academic Pressure'
      },
      {
        id: 'student_work_pressure',
        category: 'professional',
        text: 'Sur une echelle de 0 a 5, quel niveau de pression professionnelle ressentez-vous ?',
        type: 'slider',
        required: true,
        weight: 1,
        order: 7,
        min: 0,
        max: 5,
        step: 1,
        modelVariable: 'Work Pressure'
      },
      {
        id: 'student_cgpa',
        category: 'academic',
        text: 'Quelle est votre moyenne cumulative (CGPA) sur 10 ?',
        type: 'number',
        required: true,
        weight: 1,
        order: 8,
        min: 0,
        max: 10,
        step: 0.1,
        modelVariable: 'CGPA'
      },
      {
        id: 'student_study_satisfaction',
        category: 'academic',
        text: 'Sur une echelle de 1 a 5, a quel point etes-vous satisfait(e) de vos etudes ?',
        type: 'slider',
        required: true,
        weight: 1,
        order: 9,
        min: 1,
        max: 5,
        step: 1,
        modelVariable: 'Study Satisfaction'
      },
      {
        id: 'student_job_satisfaction',
        category: 'professional',
        text: 'Sur une echelle de 0 a 5, a quel point etes-vous satisfait(e) de votre travail/stage ?',
        type: 'slider',
        required: true,
        weight: 1,
        order: 10,
        min: 0,
        max: 5,
        step: 1,
        modelVariable: 'Job Satisfaction'
      },
      {
        id: 'student_work_study_hours',
        category: 'academic',
        text: 'Combien d heures par jour consacrez-vous a vos etudes/travail ?',
        type: 'number',
        required: true,
        weight: 1,
        order: 11,
        min: 0,
        max: 16,
        step: 1,
        modelVariable: 'Work/Study Hours'
      },
      {
        id: 'student_sleep_duration',
        category: 'physical_health',
        text: 'En moyenne, combien d heures dormez-vous par nuit ?',
        type: 'single_choice',
        required: true,
        weight: 1,
        order: 12,
        modelVariable: 'Sleep Duration',
        options: [
          { value: '< 5 heures', label: '< 5 heures', score: 3 },
          { value: '5-6 heures', label: '5-6 heures', score: 2 },
          { value: '7-8 heures', label: '7-8 heures', score: 0 },
          { value: '> 8 heures', label: '> 8 heures', score: 1 }
        ]
      },
      {
        id: 'student_dietary_habits',
        category: 'physical_health',
        text: 'Comment qualifieriez-vous vos habitudes alimentaires ?',
        type: 'single_choice',
        required: true,
        weight: 1,
        order: 13,
        modelVariable: 'Dietary Habits',
        options: [
          { value: 'Saines', label: 'Saines', score: 0 },
          { value: 'Moderees', label: 'Moderees', score: 1 },
          { value: 'Non saines', label: 'Non saines', score: 3 },
          { value: 'Autre', label: 'Autre', score: 1 }
        ]
      },
      {
        id: 'student_suicidal_thoughts',
        category: 'suicidal_thoughts',
        text: 'Avez-vous deja eu des pensees suicidaires ?',
        type: 'single_choice',
        required: true,
        weight: 1,
        order: 14,
        modelVariable: 'Have you ever had suicidal thoughts ?',
        options: [
          { value: 'Oui', label: 'Oui', score: 5 },
          { value: 'Non', label: 'Non', score: 0 }
        ]
      },
      {
        id: 'student_financial_stress',
        category: 'psychological',
        text: 'Sur une echelle de 0 a 5, quel niveau de stress financier ressentez-vous ?',
        type: 'slider',
        required: true,
        weight: 1,
        order: 15,
        min: 0,
        max: 5,
        step: 1,
        modelVariable: 'Financial Stress'
      },
      {
        id: 'student_family_history',
        category: 'psychological',
        text: 'Y a-t-il des antecedents de troubles mentaux dans votre famille ?',
        type: 'single_choice',
        required: true,
        weight: 1,
        order: 16,
        modelVariable: 'Family History of Mental Illness',
        options: [
          { value: 'Oui', label: 'Oui', score: 1 },
          { value: 'Non', label: 'Non', score: 0 },
          { value: 'Je ne sais pas', label: 'Je ne sais pas', score: 0 }
        ]
      }
    ];
  }

  private toNeutralOptions(labels: string[]) {
    return labels.map(label => ({ value: label, label, score: 0 }));
  }
}
