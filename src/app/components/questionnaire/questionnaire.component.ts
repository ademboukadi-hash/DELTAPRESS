import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../services/auth.service';
import { QuestionnaireService } from '../../services/questionnaire.service';
import { Answer, Question, QuestionOption, TextAnalysisResult } from '../../models/index';

@Component({
  selector: 'app-questionnaire',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressBarModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="container-xl py-4 py-lg-5 assessment-page">
      <div class="assessment-header text-center">
        <span class="dp-eyebrow mb-3">Test rapide</span>
        <h1 class="display-6 fw-bold mb-2">Depistage guide en une question par ecran</h1>
        <p class="text-dp-muted col-lg-7 mx-auto mb-0">
          Le score final est calcule sur 27 points, avec interpretation clinique, recommandations adaptees
          et orientation urgente si certaines reponses l exigent.
        </p>
      </div>

      <mat-card class="intro-panel" *ngIf="!started">
        <mat-card-content class="p-4 p-lg-5">
          <div class="row g-4 align-items-center">
            <div class="col-lg-7">
              <h2 class="h3 mb-3">Avant de commencer</h2>
              <ul class="intro-list mb-0">
                <li>Le questionnaire reprend les grands reperes du depistage clinique de type PHQ-9.</li>
                <li>Une seule question s affiche a la fois pour limiter la charge mentale.</li>
                <li>Une zone de texte libre est proposee a la fin pour enrichir l evaluation.</li>
                <li>Un signal de crise declenche une orientation visible vers l aide urgente.</li>
              </ul>
            </div>
            <div class="col-lg-5">
              <div class="intro-side">
                <span class="intro-side-title">Parcours utilisateur</span>
                <p>Accueil, test rapide ou discussion libre, puis bilan clair et contacts de professionnels si necessaire.</p>
                <button type="button" class="btn btn-light rounded-pill px-4" (click)="startQuestionnaire()">
                  Demarrer le test
                </button>
              </div>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <div class="progress-shell" *ngIf="started && !isLoading">
        <div class="progress-meta">
          <span>Etape {{ currentStepIndex + 1 }} sur {{ totalSteps }}</span>
          <span>Score final sur 27</span>
        </div>
        <mat-progress-bar mode="determinate" [value]="getProgressPercentage()"></mat-progress-bar>
      </div>

      <section class="assessment-stage" *ngIf="started && !isLoading && !showResults">
        <div class="stage-shell" *ngIf="!isReflectionStep && currentQuestion as question">
          <div class="stage-topline">
            <span class="stage-chip">{{ getCategoryLabel(question.category) }}</span>
            <span class="stage-counter">Question {{ currentQuestionIndex + 1 }}</span>
          </div>

          <h2 class="question-title">{{ question.text }}</h2>

          <div class="option-stack" *ngIf="hasOptions(question)">
            <button
              type="button"
              class="answer-option"
              [class.selected]="isOptionSelected(option)"
              *ngFor="let option of question.options"
              (click)="selectOption(option)"
            >
              <span class="answer-radio">
                <mat-icon>{{ isOptionSelected(option) ? 'check_circle' : 'radio_button_unchecked' }}</mat-icon>
              </span>
              <span class="answer-copy">
                <strong>{{ option.label }}</strong>
                <small>{{ getOptionHelper(option.score) }}</small>
              </span>
            </button>
          </div>

          <mat-form-field appearance="outline" class="w-100 dark-field" *ngIf="question.type === 'select'">
            <mat-label>Votre reponse</mat-label>
            <select
              matNativeControl
              [ngModel]="getAnswerValue(question)"
              (ngModelChange)="selectValue(question, $event)"
            >
              <option value="" disabled>Choisir une option</option>
              <option *ngFor="let option of question.options" [ngValue]="option.value">
                {{ option.label }}
              </option>
            </select>
          </mat-form-field>

          <div class="numeric-answer" *ngIf="question.type === 'number'">
            <mat-form-field appearance="outline" class="w-100 dark-field">
              <mat-label>Votre reponse</mat-label>
              <input
                matInput
                type="number"
                [min]="question.min ?? null"
                [max]="question.max ?? null"
                [step]="question.step || 1"
                [ngModel]="getAnswerValue(question)"
                (ngModelChange)="selectValue(question, $event)"
              />
            </mat-form-field>
            <small *ngIf="question.min !== undefined && question.max !== undefined">
              Valeur attendue entre {{ question.min }} et {{ question.max }}
            </small>
          </div>

          <div class="slider-answer" *ngIf="question.type === 'slider'">
            <div class="slider-scale">
              <span>{{ question.min }}</span>
              <strong>{{ getAnswerValue(question) || question.min }}</strong>
              <span>{{ question.max }}</span>
            </div>
            <input
              class="range-control"
              type="range"
              [min]="question.min ?? 0"
              [max]="question.max ?? 5"
              [step]="question.step || 1"
              [ngModel]="getAnswerValue(question) ?? question.min"
              (ngModelChange)="selectValue(question, $event)"
            />
          </div>
        </div>

        <div class="stage-shell" *ngIf="isReflectionStep">
          <div class="stage-topline">
            <span class="stage-chip">Texte libre</span>
            <span class="stage-counter">Etape complementaire</span>
          </div>

          <h2 class="question-title">Ecrivez librement ce que vous ressentez</h2>
          <p class="stage-description">
            Cette zone n influence pas directement le score principal. Elle complete l evaluation
            en detectant des themes comme la detresse, l isolement, le desespoir ou la crise.
          </p>

          <mat-form-field appearance="outline" class="w-100 dark-field">
            <mat-label>Mon ressenti en ce moment</mat-label>
            <textarea
              matInput
              rows="7"
              [(ngModel)]="freeTextResponse"
              (ngModelChange)="onFreeTextChange()"
              placeholder="Decrivez vos pensees, peurs, difficultes, manque d envie, fatigue..."
            ></textarea>
          </mat-form-field>

          <div class="text-analysis-preview" *ngIf="textAnalysisPreview">
            <div class="preview-top">
              <strong>{{ getSentimentLabel(textAnalysisPreview.sentiment) }}</strong>
              <span *ngIf="textAnalysisPreview.crisisDetected">Signal de crise detecte</span>
            </div>
            <p>{{ textAnalysisPreview.summary }}</p>
          </div>
        </div>

        <div class="stage-actions">
          <button
            type="button"
            class="btn btn-outline-light rounded-pill px-4"
            (click)="previousStep()"
            [disabled]="currentStepIndex === 0"
          >
            Precedent
          </button>

          <button
            type="button"
            class="btn btn-light rounded-pill px-4"
            (click)="nextStep()"
            [disabled]="!canProceed()"
          >
            {{ isLastStep ? 'Obtenir mon bilan' : 'Suivant' }}
          </button>
        </div>
      </section>

      <div class="loading-container" *ngIf="isLoading">
        <mat-spinner diameter="64"></mat-spinner>
        <p>Analyse de vos reponses et du texte libre...</p>
        <span>Nous preparons le score, le bilan clinique et les conseils adaptes.</span>
      </div>

      <div class="draft-toast" *ngIf="draftSaved">
        <mat-icon>save</mat-icon>
        <span>Brouillon sauvegarde automatiquement</span>
      </div>
    </div>
  `,
  styles: [`
    .assessment-header {
      margin-bottom: 2rem;
    }

    .intro-panel {
      overflow: hidden;
      margin-bottom: 1.5rem;
    }

    .intro-list {
      display: grid;
      gap: 0.8rem;
      padding-left: 1.2rem;
      color: var(--dp-muted);
      line-height: 1.65;
    }

    .intro-side {
      padding: 1.4rem;
      height: 100%;
      border-radius: 1.5rem;
      background: linear-gradient(135deg, rgba(13, 15, 22, 0.94), rgba(28, 32, 46, 0.92));
      color: white;
      box-shadow: 0 24px 44px rgba(10, 12, 18, 0.25);
    }

    .intro-side p {
      color: rgba(255, 255, 255, 0.78);
      line-height: 1.65;
    }

    .intro-side-title {
      display: inline-block;
      margin-bottom: 0.75rem;
      color: rgba(255, 255, 255, 0.78);
      font-size: 0.78rem;
      font-weight: 800;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    .progress-shell {
      margin-bottom: 1.5rem;
      padding: 1rem 1.2rem;
      border-radius: 1.25rem;
      background: rgba(255, 255, 255, 0.88);
      border: 1px solid rgba(17, 79, 186, 0.08);
      box-shadow: 0 14px 30px rgba(21, 48, 74, 0.08);
    }

    .progress-meta {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 0.75rem;
      color: var(--dp-muted);
      font-weight: 700;
      flex-wrap: wrap;
    }

    /* Enhanced progress bar height and styling */
    :host ::ng-deep .progress-shell mat-progress-bar {
      height: 8px !important;
      border-radius: 999px;
    }

    .assessment-stage {
      padding: clamp(1.5rem, 2vw + 1rem, 2.3rem);
      border-radius: 2rem;
      background: linear-gradient(160deg, rgba(9, 12, 19, 0.98), rgba(21, 26, 37, 0.98));
      color: white;
      box-shadow: 0 34px 70px rgba(9, 12, 19, 0.35);
    }

    .stage-topline {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      flex-wrap: wrap;
      margin-bottom: 1.2rem;
    }

    .stage-chip,
    .stage-counter {
      display: inline-flex;
      align-items: center;
      padding: 0.45rem 0.85rem;
      border-radius: 999px;
      font-size: 0.78rem;
      font-weight: 800;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }

    .stage-chip {
      background: rgba(255, 255, 255, 0.08);
      color: rgba(255, 255, 255, 0.88);
    }

    .stage-counter {
      background: rgba(31, 111, 235, 0.18);
      color: #b9d5ff;
    }

    .question-title {
      margin-bottom: 1.4rem;
      font-family: 'Manrope', sans-serif;
      font-size: clamp(1.6rem, 1vw + 1.15rem, 2.35rem);
      line-height: 1.2;
      color: white;
    }

    .stage-description {
      color: rgba(255, 255, 255, 0.72);
      max-width: 48rem;
      line-height: 1.7;
      margin-bottom: 1.2rem;
    }

    .option-stack {
      display: grid;
      gap: 0.9rem;
    }

    .answer-option {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.1rem 1.3rem;
      border-radius: 1.4rem;
      border: 2px solid rgba(255, 255, 255, 0.12);
      background: rgba(255, 255, 255, 0.04);
      color: white;
      text-align: left;
      cursor: pointer;
      transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
      position: relative;
    }

    .answer-option:hover {
      transform: translateY(-3px);
      border-color: rgba(123, 177, 255, 0.45);
      background: rgba(31, 111, 235, 0.1);
      box-shadow: 0 0 24px rgba(31, 111, 235, 0.2), 0 18px 36px rgba(0, 0, 0, 0.3);
    }

    .answer-option.selected {
      border-color: rgba(123, 177, 255, 0.7);
      background: rgba(31, 111, 235, 0.18);
      box-shadow: 0 0 32px rgba(31, 111, 235, 0.35), inset 0 0 0 1px rgba(255, 255, 255, 0.15);
    }

    .answer-radio {
      color: #7eb4ff;
      flex-shrink: 0;
      font-size: 1.4rem;
    }

    .answer-copy {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
      flex-grow: 1;
    }

    .answer-copy strong {
      font-size: 1rem;
      font-weight: 700;
    }

    .answer-copy small {
      color: rgba(255, 255, 255, 0.65);
      font-size: 0.875rem;
    }

    .dark-field {
      margin-top: 1rem;
    }

    .numeric-answer small {
      display: block;
      margin-top: 0.4rem;
      color: rgba(255, 255, 255, 0.62);
    }

    .slider-answer {
      display: grid;
      gap: 1rem;
      max-width: 42rem;
    }

    .slider-scale {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      color: rgba(255, 255, 255, 0.72);
      font-weight: 700;
    }

    .slider-scale strong {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 3.6rem;
      height: 3.6rem;
      border-radius: 50%;
      background: linear-gradient(135deg, rgba(31, 111, 235, 0.3), rgba(31, 111, 235, 0.18));
      color: #b9d5ff;
      font-size: 1.4rem;
      border: 2px solid rgba(123, 177, 255, 0.25);
    }

    .range-control {
      width: 100%;
      height: 8px;
      border-radius: 999px;
      accent-color: #7eb4ff;
      cursor: pointer;
    }

    :host ::ng-deep .dark-field .mat-mdc-text-field-wrapper {
      background: rgba(255, 255, 255, 0.04);
    }

    :host ::ng-deep .dark-field .mdc-notched-outline__leading,
    :host ::ng-deep .dark-field .mdc-notched-outline__notch,
    :host ::ng-deep .dark-field .mdc-notched-outline__trailing {
      border-color: rgba(255, 255, 255, 0.14) !important;
    }

    :host ::ng-deep .dark-field textarea,
    :host ::ng-deep .dark-field .mdc-floating-label,
    :host ::ng-deep .dark-field .mat-mdc-form-field-input-control {
      color: white !important;
    }

    .text-analysis-preview {
      margin-top: 1rem;
      padding: 1rem 1.1rem;
      border-radius: 1.2rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.12);
    }

    .preview-top {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 0.45rem;
      flex-wrap: wrap;
    }

    .preview-top strong {
      color: #b9d5ff;
    }

    .preview-top span,
    .text-analysis-preview p {
      color: rgba(255, 255, 255, 0.72);
      margin: 0;
    }

    .stage-actions {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      margin-top: 1.6rem;
      flex-wrap: wrap;
    }

    .loading-container {
      text-align: center;
      padding: 3rem 1rem;
    }

    .loading-container p {
      margin: 1.5rem 0 0.35rem;
      font-weight: 700;
    }

    .loading-container span {
      color: var(--dp-muted);
    }

    .draft-toast {
      position: fixed;
      left: 50%;
      bottom: 5rem;
      transform: translateX(-50%);
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.85rem 1.2rem;
      border-radius: 999px;
      background: #1c8f57;
      color: white;
      box-shadow: 0 20px 35px rgba(28, 143, 87, 0.3);
      z-index: 1002;
    }

    @media (max-width: 767.98px) {
      .stage-actions {
        flex-direction: column;
      }

      .stage-actions .btn {
        width: 100%;
      }
    }
  `]
})
export class QuestionnaireComponent implements OnInit {
  questions: Question[] = [];
  private allQuestions: Question[] = [];
  answers: Answer[] = [];
  freeTextResponse = '';
  textAnalysisPreview?: TextAnalysisResult;
  currentQuestionIndex = 0;
  started = false;
  isLoading = false;
  showResults = false;
  draftSaved = false;

  constructor(
    private authService: AuthService,
    private questionnaireService: QuestionnaireService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadQuestions();
    this.loadDraft();
  }

  get totalSteps(): number {
    return this.questions.length + 1;
  }

  get currentStepIndex(): number {
    return this.isReflectionStep ? this.questions.length : this.currentQuestionIndex;
  }

  get currentQuestion(): Question | null {
    return this.questions[this.currentQuestionIndex] || null;
  }

  get isReflectionStep(): boolean {
    return this.started && this.currentQuestionIndex >= this.questions.length;
  }

  get isLastStep(): boolean {
    return this.isReflectionStep;
  }

  startQuestionnaire(): void {
    this.started = true;
    if (this.currentQuestionIndex >= this.questions.length) {
      this.currentQuestionIndex = 0;
    }
  }

  getProgressPercentage(): number {
    if (this.totalSteps === 0) {
      return 0;
    }

    return Math.round(((this.currentStepIndex + 1) / this.totalSteps) * 100);
  }

  getCategoryLabel(category: string): string {
    const labels: Record<string, string> = {
      mood: 'Humeur',
      sleep: 'Sommeil',
      energy: 'Energie',
      anxiety: 'Anxiete',
      appetite: 'Appetit',
      self_worth: 'Estime de soi',
      concentration: 'Concentration',
      isolation: 'Isolement',
      interest: 'Interet',
      suicidal_thoughts: 'Securite',
      sociodemographic: 'Profil',
      academic: 'Academique',
      professional: 'Professionnel',
      physical_health: 'Mode de vie',
      psychological: 'Facteurs psychologiques'
    };

    return labels[category] || category;
  }

  getSentimentLabel(sentiment: string): string {
    const labels: Record<string, string> = {
      stable: 'Texte plutot stable',
      fragile: 'Fragilite detectee',
      distressed: 'Detresse detectee',
      critical: 'Critique'
    };

    return labels[sentiment] || sentiment;
  }

  getOptionHelper(score: number): string {
    const helpers: Record<number, string> = {
      0: 'Le symptome n est pas present',
      1: 'Present de facon occasionnelle',
      2: 'Present frequemment',
      3: 'Tres present ou quasi quotidien'
    };

    return helpers[score] || '';
  }

  isOptionSelected(option: QuestionOption): boolean {
    const currentAnswer = this.answers.find(answer => answer.questionId === this.currentQuestion?.id);
    return currentAnswer?.value === option.value;
  }

  hasOptions(question: Question): boolean {
    return ['single_choice', 'multiple_choice', 'likert_scale'].includes(question.type);
  }

  getAnswerValue(question: Question): number | string | string[] | null {
    return this.answers.find(answer => answer.questionId === question.id)?.value ?? null;
  }

  selectOption(option: QuestionOption): void {
    const question = this.currentQuestion;
    if (!question) {
      return;
    }

    const answer: Answer = {
      questionId: question.id,
      value: option.value,
      score: option.score
    };

    const existingIndex = this.answers.findIndex(item => item.questionId === question.id);
    if (existingIndex >= 0) {
      this.answers[existingIndex] = answer;
    } else {
      this.answers.push(answer);
    }

    this.applyAdaptiveQuestionFlow(question.id, option.value);
    this.saveDraft();
  }

  selectValue(question: Question, value: number | string): void {
    const numericValue = question.type === 'number' || question.type === 'slider'
      ? Number(value)
      : value;

    if (question.type === 'number' && !this.isNumberInRange(question, numericValue)) {
      this.removeAnswer(question.id);
      this.saveDraft();
      return;
    }

    const option = question.options?.find(item => item.value === numericValue || item.value === value);
    const answer: Answer = {
      questionId: question.id,
      value: numericValue,
      score: option?.score ?? this.getNumericScore(question, Number(numericValue))
    };

    const existingIndex = this.answers.findIndex(item => item.questionId === question.id);
    if (existingIndex >= 0) {
      this.answers[existingIndex] = answer;
    } else {
      this.answers.push(answer);
    }

    this.applyAdaptiveQuestionFlow(question.id, numericValue);
    this.saveDraft();
  }

  canProceed(): boolean {
    if (this.isReflectionStep) {
      return true;
    }

    if (this.currentQuestion?.type === 'slider') {
      return true;
    }

    return this.answers.some(answer => answer.questionId === this.currentQuestion?.id);
  }

  private isNumberInRange(question: Question, value: number | string): boolean {
    if (value === '' || Number.isNaN(Number(value))) {
      return false;
    }

    const numericValue = Number(value);
    const min = question.min ?? Number.NEGATIVE_INFINITY;
    const max = question.max ?? Number.POSITIVE_INFINITY;
    return numericValue >= min && numericValue <= max;
  }

  private getNumericScore(question: Question, value: number): number {
    if (Number.isNaN(value)) {
      return 0;
    }

    if (question.id === 'student_cgpa') {
      if (value < 5) return 3;
      if (value < 6.5) return 2;
      if (value < 8) return 1;
      return 0;
    }

    if (question.id === 'student_work_study_hours') {
      if (value >= 12) return 3;
      if (value >= 9) return 2;
      if (value >= 6) return 1;
      return 0;
    }

    if (question.id === 'student_study_satisfaction') {
      return Math.max(0, 5 - value);
    }

    if (question.id === 'student_job_satisfaction') {
      return Math.max(0, 5 - value);
    }

    if (
      question.id === 'student_academic_pressure' ||
      question.id === 'student_work_pressure' ||
      question.id === 'student_financial_stress'
    ) {
      return value;
    }

    return 0;
  }

  private removeAnswer(questionId: string): void {
    this.answers = this.answers.filter(answer => answer.questionId !== questionId);
  }

  nextStep(): void {
    if (!this.canProceed()) {
      return;
    }

    if (this.isReflectionStep) {
      this.submitQuestionnaire();
      return;
    }

    if (this.currentQuestion?.type === 'slider' && !this.getAnswerValue(this.currentQuestion)) {
      this.selectValue(this.currentQuestion, this.currentQuestion.min ?? 0);
    }

    this.currentQuestionIndex++;
  }

  previousStep(): void {
    if (this.isReflectionStep) {
      this.currentQuestionIndex = this.questions.length - 1;
      return;
    }

    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  onFreeTextChange(): void {
    this.textAnalysisPreview = this.questionnaireService.analyzeFreeTextOnly(this.freeTextResponse);
    this.saveDraft();
  }

  private submitQuestionnaire(): void {
    this.isLoading = true;
    const userId = this.authService.getCurrentUser()?.id;

    this.questionnaireService.submitQuestionnaire(this.answers, this.freeTextResponse, userId).subscribe({
      next: result => {
        this.isLoading = false;
        this.showResults = true;
        this.questionnaireService.clearDraftAnswers();
        this.router.navigate(['/result', result.id]);
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  private loadQuestions(): void {
    this.questionnaireService.getQuestions().subscribe({
      next: questions => {
        this.allQuestions = questions.sort((a, b) => a.order - b.order);
        this.questions = [...this.allQuestions];
        const professionAnswer = this.answers.find(answer => answer.questionId === 'student_profession');
        if (professionAnswer) {
          this.applyAdaptiveQuestionFlow('student_profession', professionAnswer.value);
        }
      },
      error: () => {
        this.questions = [];
      }
    });
  }

  private loadDraft(): void {
    const draft = this.questionnaireService.loadDraftState();
    if (!draft) {
      return;
    }

    this.answers = draft.answers;
    this.freeTextResponse = draft.freeTextResponse;
    this.textAnalysisPreview = this.questionnaireService.analyzeFreeTextOnly(this.freeTextResponse);
  }

  private saveDraft(): void {
    this.questionnaireService.saveDraftState({
      answers: this.answers,
      freeTextResponse: this.freeTextResponse
    });

    this.draftSaved = true;
    setTimeout(() => this.draftSaved = false, 1800);
  }

  private applyAdaptiveQuestionFlow(questionId: string, value: number | string | string[]): void {
    if (questionId !== 'student_profession' || this.allQuestions.length === 0) {
      return;
    }

    const fullTimeStudent = value === 'Etudiant a temps plein';
    const skippedForFullTime = ['student_work_pressure', 'student_job_satisfaction'];

    this.questions = this.allQuestions.filter(question =>
      !fullTimeStudent || !skippedForFullTime.includes(question.id)
    );

    if (fullTimeStudent) {
      this.answers = this.answers.filter(answer => !skippedForFullTime.includes(answer.questionId));
    }

    if (this.currentQuestionIndex >= this.questions.length) {
      this.currentQuestionIndex = Math.max(0, this.questions.length - 1);
    }
  }
}
