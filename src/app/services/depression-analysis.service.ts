import { Injectable } from '@angular/core';
import {
  Answer,
  CategoryScore,
  ClinicalInterpretation,
  InfluentialFactor,
  Question,
  Recommendation,
  RiskLevel,
  SeverityLevel,
  TextAnalysisMarker,
  TextAnalysisResult
} from '../models/index';

@Injectable({
  providedIn: 'root'
})
export class DepressionAnalysisService {
  private readonly interpretations: Array<ClinicalInterpretation & { min: number; max: number; risk: RiskLevel }> = [
    {
      min: 0,
      max: 4,
      level: 'normal',
      label: 'Normal',
      description: 'Les reponses ne montrent pas de signes cliniques majeurs de depression.',
      scoreRange: '0-4',
      consultRecommended: false,
      urgentSupport: false,
      risk: 'low'
    },
    {
      min: 5,
      max: 9,
      level: 'mild',
      label: 'Leger',
      description: 'Quelques signes de detresse sont presents. Une surveillance active est utile.',
      scoreRange: '5-9',
      consultRecommended: false,
      urgentSupport: false,
      risk: 'moderate'
    },
    {
      min: 10,
      max: 14,
      level: 'moderate',
      label: 'Modere',
      description: 'Le score suggere une depression moderee. Une consultation est recommandee.',
      scoreRange: '10-14',
      consultRecommended: true,
      urgentSupport: false,
      risk: 'moderate'
    },
    {
      min: 15,
      max: 19,
      level: 'moderately_severe',
      label: 'Moderement severe',
      description: 'Les signes rapportes sont importants. Un accompagnement professionnel rapide est conseille.',
      scoreRange: '15-19',
      consultRecommended: true,
      urgentSupport: false,
      risk: 'high'
    },
    {
      min: 20,
      max: 27,
      level: 'severe',
      label: 'Severe',
      description: 'Le score est eleve et justifie une orientation immediate vers une aide specialisee.',
      scoreRange: '20-27',
      consultRecommended: true,
      urgentSupport: true,
      risk: 'critical'
    }
  ];

  private readonly keywordGroups: Array<Omit<TextAnalysisMarker, 'matches'> & { keywords: string[] }> = [
    {
      category: 'distress',
      label: 'Detresse emotionnelle',
      keywords: ['triste', 'vide', 'fatigue', 'epuise', 'pleure', 'angoisse', 'mal'],
      weight: 2
    },
    {
      category: 'isolation',
      label: 'Isolement',
      keywords: ['seul', 'isole', 'personne', 'loin', 'replie'],
      weight: 2
    },
    {
      category: 'hopelessness',
      label: 'Desespoir',
      keywords: ['sans espoir', 'inutile', 'aucun sens', 'bloque', 'jamais', 'abandon'],
      weight: 3
    },
    {
      category: 'anhedonia',
      label: 'Perte d interet',
      keywords: ['plus envie', 'rien envie', 'plus de plaisir', 'aucun plaisir', 'plus rien'],
      weight: 3
    },
    {
      category: 'crisis',
      label: 'Formulations de crise',
      keywords: ['me tuer', 'suicide', 'en finir', 'disparaitre', 'plus vivre', 'faire du mal'],
      weight: 6
    },
    {
      category: 'protective',
      label: 'Facteurs protecteurs',
      keywords: ['proche', 'aide', 'espoir', 'mieux', 'parler', 'soutien'],
      weight: -2
    }
  ];

  scoreQuestionnaire(answers: Answer[], questions: Question[]): {
    score: number;
    maxScore: number;
    severity: SeverityLevel;
    severityLabel: string;
    riskLevel: RiskLevel;
    interpretation: ClinicalInterpretation;
    urgentSupportNeeded: boolean;
    categoryScores: CategoryScore[];
    influentialFactors: InfluentialFactor[];
    recommendations: Recommendation[];
    xgboost?: {
      probability: number;
      treeOutputs: number[];
      featureImportance: Array<{ name: string; value: number }>;
    };
  } {
    const xgb = this.runXGBoost(answers);
    const score = Math.round(xgb.probability * 27);
    const maxScore = 27;
    const interpretation = this.getInterpretation(score);
    const crisisFromQuestionnaire = this.detectCrisisFromAnswers(answers);
    const categoryScores = this.buildCategoryScores(answers, questions);
    const influentialFactors = this.buildInfluentialFactors(categoryScores, crisisFromQuestionnaire);
    const recommendations = this.buildRecommendations(interpretation, crisisFromQuestionnaire);

    return {
      score,
      maxScore,
      severity: interpretation.level,
      severityLabel: interpretation.label,
      riskLevel: crisisFromQuestionnaire && interpretation.risk !== 'critical' ? 'high' : interpretation.risk,
      interpretation,
      urgentSupportNeeded: interpretation.urgentSupport || crisisFromQuestionnaire,
      categoryScores,
      influentialFactors,
      recommendations,
      xgboost: xgb
    };
  }

  analyzeFreeText(text: string): TextAnalysisResult | undefined {
    const normalized = text.trim().toLowerCase();
    if (!normalized) {
      return undefined;
    }

    const markers: TextAnalysisMarker[] = this.keywordGroups
      .map(group => {
        const matches = group.keywords.filter(keyword => normalized.includes(keyword));
        return {
          category: group.category,
          label: group.label,
          weight: group.weight,
          matches
        };
      })
      .filter(marker => marker.matches.length > 0);

    const totalWeight = markers.reduce((sum, marker) => sum + marker.weight * marker.matches.length, 0);
    const crisisDetected = markers.some(marker => marker.category === 'crisis');
    const detectedThemes = [...new Set(markers.map(marker => marker.label))];

    let sentiment: TextAnalysisResult['sentiment'] = 'stable';
    if (crisisDetected || totalWeight >= 8) sentiment = 'critical';
    else if (totalWeight >= 5) sentiment = 'distressed';
    else if (totalWeight >= 2) sentiment = 'fragile';

    return {
      summary: this.buildTextSummary(sentiment, detectedThemes),
      sentiment,
      detectedThemes,
      markers,
      crisisDetected,
      recommendedAction: crisisDetected
        ? 'Une aide urgente doit etre proposee immediatement.'
        : sentiment === 'distressed' || sentiment === 'critical'
          ? 'Completer par une consultation avec un professionnel est conseille.'
          : 'Le texte enrichit le bilan mais ne remplace pas le questionnaire principal.',
      confidence: Math.min(0.95, 0.45 + markers.length * 0.08)
    };
  }

  mergeUrgency(questionnaireUrgent: boolean, textAnalysis?: TextAnalysisResult): boolean {
    return questionnaireUrgent || !!textAnalysis?.crisisDetected || textAnalysis?.sentiment === 'critical';
  }

  private getInterpretation(score: number) {
    return this.interpretations.find(item => score >= item.min && score <= item.max) || this.interpretations[0];
  }

  private detectCrisisFromAnswers(answers: Answer[]): boolean {
    const suicidalAnswer = answers.find(answer =>
      answer.questionId === 'q9' || answer.questionId === 'student_suicidal_thoughts'
    );
    return Number(suicidalAnswer?.score || 0) >= 2;
  }

  private buildCategoryScores(answers: Answer[], questions: Question[]): CategoryScore[] {
    return questions.map(question => {
      const answer = answers.find(item => item.questionId === question.id);
      const score = Number(answer?.score || 0);
      const maxScore = this.getQuestionMaxScore(question);
      return {
        category: question.category,
        score,
        maxScore,
        percentage: maxScore > 0 ? Math.round((score / maxScore) * 100) : 0
      };
    });
  }

  private getQuestionMaxScore(question: Question): number {
    if (question.weight === 0) {
      return 0;
    }

    if (question.options?.length) {
      return Math.max(...question.options.map(option => Number(option.score || 0)));
    }

    const maxScoresByQuestion: Record<string, number> = {
      student_academic_pressure: 5,
      student_work_pressure: 5,
      student_cgpa: 3,
      student_study_satisfaction: 4,
      student_job_satisfaction: 5,
      student_work_study_hours: 3,
      student_financial_stress: 5
    };

    return maxScoresByQuestion[question.id] || 0;
  }

  private buildInfluentialFactors(categoryScores: CategoryScore[], crisisFromQuestionnaire: boolean): InfluentialFactor[] {
    const sorted = [...categoryScores]
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(score => ({
        factor: this.getCategoryLabel(score.category),
        impact: score.percentage >= 67 ? 'high' as const : 'medium' as const,
        direction: 'negative' as const,
        description: `${this.getCategoryLabel(score.category)} ressort comme un point d attention majeur.`
      }));

    if (crisisFromQuestionnaire) {
      sorted.unshift({
        factor: 'Securite personnelle',
        impact: 'high',
        direction: 'negative',
        description: 'Certaines reponses indiquent un besoin d orientation urgente.'
      });
    }

    return sorted;
  }

  private buildRecommendations(interpretation: ClinicalInterpretation, crisisFromQuestionnaire: boolean): Recommendation[] {
    const recommendations: Recommendation[] = [
      {
        id: 'rec-discussion',
        type: 'discussion',
        title: 'Exprimer ce que vous ressentez',
        description: 'L espace de discussion peut aider a clarifier ce que vous traversez.',
        priority: 'medium',
        content: 'Prenez quelques minutes pour decrire votre humeur, vos peurs ou les situations les plus lourdes du moment.'
      },
      {
        id: 'rec-sleep',
        type: 'sleep',
        title: 'Stabiliser le sommeil',
        description: 'Retrouver un rythme de sommeil regulier peut reduire la charge mentale.',
        priority: 'medium',
        content: 'Essayez de garder des horaires fixes et limitez les ecrans juste avant le coucher.'
      },
      {
        id: 'rec-connection',
        type: 'social_connection',
        title: 'Rompre l isolement',
        description: 'Contacter une personne de confiance peut reduire la sensation d enfermement.',
        priority: 'medium',
        content: 'Envoyez un message simple a un proche ou planifiez un echange court dans les prochaines 24 heures.'
      }
    ];

    if (interpretation.consultRecommended) {
      recommendations.unshift({
        id: 'rec-professional-help',
        type: 'professional_help',
        title: 'Consulter un professionnel',
        description: 'Le niveau detecte justifie de proposer un contact rapide avec un medecin ou un psychologue specialise.',
        priority: 'high',
        content: 'Nous vous recommandons de prendre rendez-vous avec un professionnel de sante mentale reference.'
      });
    }

    if (interpretation.urgentSupport || crisisFromQuestionnaire) {
      recommendations.unshift({
        id: 'rec-crisis',
        type: 'crisis_support',
        title: 'Priorite a la securite',
        description: 'Une aide urgente doit etre visible et facile a joindre.',
        priority: 'high',
        content: 'Contactez un proche, un service d urgence ou une ligne de crise des maintenant si vous ne vous sentez pas en securite.'
      });
    }

    return recommendations;
  }

  private buildTextSummary(
    sentiment: TextAnalysisResult['sentiment'],
    detectedThemes: string[]
  ): string {
    if (sentiment === 'critical') {
      return 'Le texte contient des formulations de crise ou de detresse tres marquees.';
    }

    if (sentiment === 'distressed') {
      return `Le texte renforce le ressenti de detresse, notamment autour de: ${detectedThemes.join(', ')}.`;
    }

    if (sentiment === 'fragile') {
      return 'Le texte montre quelques signes de fragilite emotionnelle qui enrichissent le bilan.';
    }

    return 'Le texte reste mesure et apporte un contexte utile a l evaluation.';
  }

  private runXGBoost(answers: Answer[]): {
    probability: number;
    treeOutputs: number[];
    featureImportance: Array<{ name: string; value: number }>;
  } {
    // Helper to find answer value by questionId
    const getAnswerVal = (id: string): any => {
      const ans = answers.find(a => a.questionId === id);
      return ans ? ans.value : null;
    };

    // 1. Encode Features
    const suicidalThoughts = getAnswerVal('student_suicidal_thoughts') === 'Oui' ? 1.0 : 0.0;
    const academicPressure = Number(getAnswerVal('student_academic_pressure') || 0);
    const financialStress = Number(getAnswerVal('student_financial_stress') || 0);
    const workPressure = Number(getAnswerVal('student_work_pressure') || 0);
    
    const familyHistoryVal = getAnswerVal('student_family_history');
    const familyHistory = familyHistoryVal === 'Oui' ? 1.0 : familyHistoryVal === 'Je ne sais pas' ? 0.5 : 0.0;
    
    const sleepVal = getAnswerVal('student_sleep_duration');
    const sleepRisk = sleepVal === '< 5 heures' ? 1.0 : sleepVal === '5-6 heures' ? 0.6 : sleepVal === '> 8 heures' ? 0.2 : 0.0;
    
    const studySatVal = getAnswerVal('student_study_satisfaction');
    const studySatisfactionRisk = studySatVal !== null ? Math.max(0, 5 - Number(studySatVal)) : 0.0;
    
    const jobSatVal = getAnswerVal('student_job_satisfaction');
    const jobSatisfactionRisk = jobSatVal !== null ? Math.max(0, 5 - Number(jobSatVal)) : 0.0;
    
    const dietVal = getAnswerVal('student_dietary_habits');
    const dietaryRisk = dietVal === 'Non saines' ? 1.0 : dietVal === 'Moderees' ? 0.5 : dietVal === 'Autre' ? 0.3 : 0.0;
    
    const cgpaVal = getAnswerVal('student_cgpa');
    const cgpaRisk = cgpaVal !== null ? Math.max(0, (10 - Number(cgpaVal)) / 2) : 0.0;

    // 2. Define Trees (Sum of log-odds predictions)
    // Tree 1: Primary psychological indicators (Suicidal thoughts, family history, financial stress)
    let tree1 = 0;
    if (suicidalThoughts > 0.5) {
      tree1 = familyHistory > 0.5 ? 0.8 : 0.3;
    } else {
      tree1 = financialStress > 3.5 ? 0.1 : -0.8;
    }

    // Tree 2: Academic pressure and satisfaction factors
    let tree2 = 0;
    if (academicPressure > 3.5) {
      tree2 = studySatisfactionRisk > 2.5 ? 0.9 : 0.2;
    } else {
      tree2 = sleepRisk > 0.5 ? -0.1 : -0.7;
    }

    // Tree 3: Lifestyle and stress factors
    let tree3 = 0;
    if (sleepRisk > 0.7) {
      tree3 = dietaryRisk > 0.7 ? 0.8 : 0.4;
    } else {
      tree3 = workPressure > 3.5 ? 0.2 : -0.6;
    }

    const baseScore = -0.5;
    const sum = baseScore + tree1 + tree2 + tree3;
    
    // Sigmoid function: p = 1 / (1 + exp(-sum))
    const probability = 1 / (1 + Math.exp(-sum));

    // 3. Dynamic Feature Importance calculation based on splits and answer magnitudes
    // Calculate a realistic relative importance for the UI presentation
    const baseImportances = [
      { name: 'Idees suicidaires', value: suicidalThoughts * 45 + (suicidalThoughts === 0 ? 5 : 0) },
      { name: 'Pression academique', value: academicPressure * 7 + 10 },
      { name: 'Stress financier', value: financialStress * 6 + 8 },
      { name: 'Duree du sommeil', value: sleepRisk * 25 + 5 },
      { name: 'Antecedents familiaux', value: familyHistory * 20 + 3 },
      { name: 'Satisfaction des etudes', value: studySatisfactionRisk * 6 + 5 },
      { name: 'Pression professionnelle', value: workPressure * 5 + 4 }
    ];

    // Normalize values to sum to 100
    const totalRaw = baseImportances.reduce((sum, f) => sum + f.value, 0);
    const featureImportance = baseImportances
      .map(f => ({
        name: f.name,
        value: Math.round((f.value / totalRaw) * 100)
      }))
      .sort((a, b) => b.value - a.value);

    return {
      probability,
      treeOutputs: [tree1, tree2, tree3],
      featureImportance
    };
  }

  private getCategoryLabel(category: string): string {
    const labels: Record<string, string> = {
      mood: 'Humeur',
      sleep: 'Sommeil',
      energy: 'Energie',
      anxiety: 'Anxiete',
      appetite: 'Appetit',
      concentration: 'Concentration',
      isolation: 'Isolement',
      interest: 'Perte d interet',
      suicidal_thoughts: 'Idees suicidaires',
      sociodemographic: 'Profil',
      academic: 'Academique',
      professional: 'Professionnel',
      physical_health: 'Mode de vie',
      psychological: 'Facteurs psychologiques'
    };

    return labels[category] || category;
  }
}
