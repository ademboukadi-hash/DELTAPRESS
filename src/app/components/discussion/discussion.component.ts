import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../services/auth.service';
import { DirectoryService } from '../../services/directory.service';
import { DiscussionService } from '../../services/discussion.service';
import { Professional, DiscussionThread, TextAnalysisResult } from '../../models/index';

@Component({
  selector: 'app-discussion',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="dp-page container-xl py-4 py-lg-5">
      <section class="dp-hero-section dp-animate-in mb-5">
        <div class="row g-4 align-items-center">
          <div class="col-lg-7">
            <span class="dp-eyebrow mb-3">Espace de discussion</span>
            <h1 class="display-6 fw-bold mb-3">Mettez des mots sur ce que vous traversez.</h1>
            <p class="text-dp-muted mb-0">
              Cet espace permet d ecrire librement vos pensees, vos peurs, votre fatigue ou
              votre perte d elan. Le module d analyse semantique enrichit ensuite le bilan.
            </p>
          </div>

          <div class="col-lg-5">
            <div class="hero-points">
              <div class="dp-hover-lift">
                <strong>Texte libre</strong>
                <span>Exprimez votre ressenti sans formulaire rigide.</span>
              </div>
              <div class="dp-hover-lift">
                <strong>Analyse complementaire</strong>
                <span>Le ton et les themes enrichissent l evaluation principale.</span>
              </div>
              <div class="dp-hover-lift">
                <strong>Alerte visible</strong>
                <span>Les formulations de crise declenchent une orientation urgente.</span>
              </div>
              <div class="dp-hover-lift">
                <strong>Chat anonyme</strong>
                <span>Echangez sans afficher votre identite complete.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div class="row g-4">
        <div class="col-lg-7">
          <mat-card class="dp-glass-card">
            <mat-card-content class="p-4 p-lg-5">
              <div class="prompts mb-4">
                <span class="dp-eyebrow d-block mb-2">Vous pouvez parler de:</span>
                <div class="d-flex flex-wrap gap-2">
                  <button type="button" class="prompt-chip dp-hover-lift" (click)="usePrompt('Je me sens fatigue et je n ai plus envie de rien ces derniers jours.')">
                    Fatigue et perte d envie
                  </button>
                  <button type="button" class="prompt-chip dp-hover-lift" (click)="usePrompt('Je me sens tres seul et j ai peur que la situation ne s ameliore jamais.')">
                    Solitude et peur
                  </button>
                  <button type="button" class="prompt-chip dp-hover-lift" (click)="usePrompt('J ai du mal a dormir et je n arrive plus a me concentrer au travail.')">
                    Sommeil et concentration
                  </button>
                </div>
              </div>

              <mat-form-field appearance="outline" class="w-100 mb-3">
                <mat-label>Decrivez librement ce que vous ressentez</mat-label>
                <textarea
                  matInput
                  [(ngModel)]="reflectionText"
                  rows="8"
                  placeholder="Par exemple: je me sens vide, je m isole, j ai peur de rester comme ca..."
                ></textarea>
              </mat-form-field>

              <div class="actions">
                <button type="button" class="btn btn-primary rounded-pill px-4 dp-hover-lift" (click)="analyzeText()" [disabled]="isAnalyzing || !reflectionText.trim()">
                  <mat-spinner diameter="18" *ngIf="isAnalyzing" class="me-2"></mat-spinner>
                  <span>{{ isAnalyzing ? 'Analyse en cours...' : 'Analyser mon ressenti' }}</span>
                </button>
                <a routerLink="/questionnaire" class="btn btn-outline-primary rounded-pill px-4 dp-hover-lift">
                  Faire le test rapide
                </a>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="dp-glass-card mt-4">
            <mat-card-content class="p-4">
              <span class="dp-eyebrow mb-2 d-inline-block">Soutien anonyme</span>
              <h2 class="h4 mb-4">Chat securise</h2>
              <div class="chat-container mb-4">
                <div class="chat-message" *ngFor="let message of anonymousMessages" [ngClass]="{'chat-user': message.author === 'Utilisateur anonyme', 'chat-moderator': message.author !== 'Utilisateur anonyme'}">
                  <div class="chat-avatar" *ngIf="message.author !== 'Utilisateur anonyme'">
                    <mat-icon>support_agent</mat-icon>
                  </div>
                  <div class="chat-bubble">
                    <div class="chat-author">{{ message.author }}</div>
                    <div class="chat-text">{{ message.text }}</div>
                  </div>
                </div>
              </div>
              <mat-form-field appearance="outline" class="w-100 mb-2">
                <mat-label>Message anonyme</mat-label>
                <textarea matInput rows="2" [(ngModel)]="anonymousText" (keydown.enter)="sendAnonymousMessage(); $event.preventDefault()"></textarea>
              </mat-form-field>
              <div class="d-flex justify-content-end">
                <button type="button" class="btn btn-primary rounded-pill px-4 dp-hover-lift" (click)="sendAnonymousMessage()" [disabled]="!anonymousText.trim()">
                  <span class="d-flex align-items-center">Envoyer anonymement <mat-icon class="ms-2" style="font-size: 18px; width: 18px; height: 18px;">send</mat-icon></span>
                </button>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="dp-glass-card mt-4 dp-glow-border-primary" *ngIf="analysis">
            <mat-card-content class="p-4">
              <div class="analysis-header mb-4">
                <div>
                  <span class="dp-eyebrow mb-2 d-inline-block">Analyse semantique</span>
                  <h2 class="h4 mb-2 dp-gradient-text">Avis enrichi sur le texte libre</h2>
                  <p class="text-dp-muted mb-0">{{ analysis.summary }}</p>
                </div>
                <span class="sentiment-pill" [class.critical]="analysis.sentiment === 'critical'" [class.distressed]="analysis.sentiment === 'distressed'">
                  {{ getSentimentLabel(analysis.sentiment) }}
                </span>
              </div>

              <div class="dp-info-strip mt-4" *ngIf="analysis.crisisDetected" style="border-left: 4px solid var(--dp-danger); background: rgba(220, 53, 69, 0.05);">
                <mat-icon class="text-danger me-2">warning</mat-icon>
                <span class="text-danger fw-bold">Une formulation de crise a ete detectee. Utilisez immediatement les ressources d urgence ou contactez un proche.</span>
              </div>

              <div class="themes-grid mt-4" *ngIf="analysis.detectedThemes.length > 0">
                <div class="theme-item dp-hover-lift" *ngFor="let theme of analysis.detectedThemes">
                  {{ theme }}
                </div>
              </div>

              <div class="marker-list mt-4" *ngIf="analysis.markers.length > 0">
                <div class="marker-item dp-hover-lift" *ngFor="let marker of analysis.markers">
                  <div class="marker-icon"><mat-icon>check_circle_outline</mat-icon></div>
                  <div class="marker-content">
                    <strong>{{ marker.label }}</strong>
                    <span>{{ marker.matches.join(', ') }}</span>
                  </div>
                </div>
              </div>

              <div class="next-steps mt-4">
                <h3 class="h6 fw-bold mb-2">Action suggeree</h3>
                <p class="mb-0 text-dp-muted">{{ analysis.recommendedAction }}</p>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <div class="col-lg-5">
          <mat-card class="dp-glass-card dp-glow-border-danger mb-4" *ngIf="analysis?.crisisDetected">
            <mat-card-content class="p-4 text-center">
              <mat-icon class="text-danger mb-3" style="font-size: 3rem; width: 3rem; height: 3rem;">emergency</mat-icon>
              <h2 class="h4 mb-2 fw-bold text-danger">Une aide urgente est recommandee.</h2>
              <p class="text-dp-muted mb-4">
                Si vous vous sentez en danger ou si les pensees deviennent envahissantes,
                accedez tout de suite aux ressources de crise.
              </p>
              <a routerLink="/emergency" class="btn btn-danger rounded-pill px-4 py-2 w-100 dp-hover-lift fw-bold">
                Ouvrir l'aide urgente
              </a>
            </mat-card-content>
          </mat-card>

          <mat-card class="dp-glass-card mb-4" *ngIf="recommendedProfessionals.length > 0">
            <mat-card-content class="p-4">
              <span class="dp-eyebrow mb-2 d-inline-block">Professionnels conseilles</span>
              <h2 class="h5 mb-4">Contacts a envisager rapidement</h2>
              <div class="pro-list">
                <article class="pro-item dp-hover-lift" *ngFor="let professional of recommendedProfessionals">
                  <div class="dp-icon-circle me-3"><mat-icon>person</mat-icon></div>
                  <div class="flex-grow-1">
                    <strong class="d-block">{{ professional.firstName }} {{ professional.lastName }}</strong>
                    <span class="text-dp-muted small">{{ getTitleLabel(professional.title) }} · {{ professional.location.city }}</span>
                  </div>
                  <a [routerLink]="['/directory', professional.id]" class="btn btn-sm btn-outline-primary rounded-pill">
                    Voir
                  </a>
                </article>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="dp-glass-card" *ngIf="threads.length > 0">
            <mat-card-content class="p-4">
              <span class="dp-eyebrow mb-2 d-inline-block">Historique recent</span>
              <h2 class="h5 mb-4">Vos derniers partages</h2>
              <div class="thread-list">
                <article class="thread-item dp-hover-lift" *ngFor="let thread of threads.slice(0, 3)">
                  <div class="d-flex justify-content-between align-items-start mb-2">
                    <strong class="text-truncate me-2">{{ thread.title }}</strong>
                    <span class="sentiment-pill mini" [class.distressed]="thread.moodTag === 'distressed'" [class.critical]="thread.moodTag === 'critical'">{{ getSentimentLabel(thread.moodTag) }}</span>
                  </div>
                  <p class="text-dp-muted small mb-0">{{ thread.updatedAt | date:'mediumDate' }}</p>
                </article>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .hero-points {
      display: grid;
      gap: 1rem;
    }

    .hero-points div {
      padding: 1.2rem;
      border-radius: 1.2rem;
      background: var(--dp-surface);
      border: 1px solid var(--dp-border);
      transition: all 0.3s ease;
    }

    .hero-points strong {
      display: block;
      margin-bottom: 0.25rem;
      color: var(--dp-text);
    }

    .hero-points span {
      color: var(--dp-muted);
      line-height: 1.5;
      font-size: 0.95rem;
    }

    .prompt-chip {
      padding: 0.75rem 1.2rem;
      border-radius: 999px;
      border: 2px solid var(--dp-primary);
      background: linear-gradient(135deg, rgba(31, 111, 235, 0.08), rgba(31, 120, 255, 0.04));
      color: var(--dp-primary);
      font-size: 0.9rem;
      font-weight: 700;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      cursor: pointer;
    }
    
    .prompt-chip:hover {
      background: linear-gradient(135deg, var(--dp-primary), rgba(31, 120, 255, 0.9));
      color: #fff;
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(31, 120, 255, 0.3);
      border-color: var(--dp-primary);
    }

    .actions {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .actions .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }

    .analysis-header {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      align-items: flex-start;
      flex-wrap: wrap;
    }

    .sentiment-pill {
      padding: 0.5rem 1rem;
      border-radius: 999px;
      background: rgba(31, 111, 235, 0.1);
      color: var(--dp-primary);
      font-size: 0.85rem;
      font-weight: 700;
      white-space: nowrap;
      border: 1px solid rgba(31, 111, 235, 0.2);
    }

    .sentiment-pill.mini {
      padding: 0.2rem 0.6rem;
      font-size: 0.75rem;
    }

    .sentiment-pill.distressed {
      background: rgba(245, 158, 11, 0.1);
      color: var(--dp-accent);
      border-color: rgba(245, 158, 11, 0.2);
    }

    .sentiment-pill.critical {
      background: rgba(220, 53, 69, 0.1);
      color: var(--dp-danger);
      border-color: rgba(220, 53, 69, 0.2);
    }

    .themes-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 0.6rem;
    }

    .theme-item {
      padding: 0.65rem 1.25rem;
      border-radius: 999px;
      background: linear-gradient(135deg, rgba(31, 111, 235, 0.12), rgba(31, 111, 235, 0.06));
      color: var(--dp-primary);
      font-weight: 700;
      font-size: 0.95rem;
      border: 1.5px solid rgba(31, 111, 235, 0.25);
      transition: all 0.3s ease;
    }

    .theme-item:hover {
      background: linear-gradient(135deg, rgba(31, 111, 235, 0.2), rgba(31, 111, 235, 0.12));
      border-color: rgba(31, 111, 235, 0.4);
      transform: translateY(-1px);
    }

    .marker-list {
      display: grid;
      gap: 0.8rem;
    }

    .marker-item {
      display: flex;
      gap: 1rem;
      padding: 1rem;
      border-radius: 1rem;
      background: var(--dp-surface);
      border: 1px solid var(--dp-border);
      align-items: flex-start;
    }

    .marker-icon {
      color: var(--dp-primary);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .marker-content strong {
      display: block;
      color: var(--dp-text);
      margin-bottom: 0.2rem;
    }

    .marker-content span {
      color: var(--dp-muted);
      font-size: 0.9rem;
    }

    .next-steps {
      padding: 1.2rem;
      border-radius: 1rem;
      background: linear-gradient(to right, rgba(31, 111, 235, 0.05), transparent);
      border-left: 3px solid var(--dp-primary);
    }

    /* Chat Bubbles Styling */
    .chat-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      max-height: 400px;
      overflow-y: auto;
      padding-right: 0.5rem;
    }
    
    .chat-container::-webkit-scrollbar {
      width: 6px;
    }
    .chat-container::-webkit-scrollbar-thumb {
      background: var(--dp-border);
      border-radius: 10px;
    }

    .chat-message {
      display: flex;
      gap: 0.8rem;
      align-items: flex-end;
      max-width: 85%;
    }

    .chat-user {
      align-self: flex-end;
      flex-direction: row-reverse;
    }

    .chat-moderator {
      align-self: flex-start;
    }

    .chat-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--dp-primary), rgba(31, 111, 235, 0.8));
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    
    .chat-avatar mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .chat-bubble {
      padding: 0.8rem 1.2rem;
      border-radius: 1.2rem;
      position: relative;
    }

    .chat-user .chat-bubble {
      background: linear-gradient(135deg, var(--dp-primary), rgba(31, 120, 255, 0.85));
      color: white;
      border-bottom-right-radius: 0.2rem;
      box-shadow: 0 8px 20px rgba(31, 120, 255, 0.35);
    }

    .chat-moderator .chat-bubble {
      background: linear-gradient(135deg, var(--dp-surface), rgba(255, 255, 255, 0.95));
      border: 1px solid var(--dp-border);
      color: var(--dp-text);
      border-bottom-left-radius: 0.2rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }

    .chat-author {
      font-size: 0.75rem;
      margin-bottom: 0.2rem;
      opacity: 0.8;
      font-weight: 600;
    }
    
    .chat-user .chat-author {
      text-align: right;
    }

    .chat-text {
      font-size: 0.95rem;
      line-height: 1.4;
    }

    /* Lists */
    .pro-list,
    .thread-list {
      display: grid;
      gap: 0.8rem;
    }

    .pro-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      border-radius: 1rem;
      background: var(--dp-surface);
      border: 1px solid var(--dp-border);
    }

    .thread-item {
      padding: 1rem;
      border-radius: 1rem;
      background: var(--dp-surface);
      border: 1px solid var(--dp-border);
    }

    @media (max-width: 575.98px) {
      .actions {
        flex-direction: column;
      }

      .actions .btn,
      .pro-item .btn {
        width: 100%;
        justify-content: center;
      }

      .pro-item {
        flex-direction: column;
        align-items: stretch;
        text-align: center;
      }
      
      .pro-item .dp-icon-circle {
        margin: 0 auto 1rem auto !important;
      }
      
      .chat-message {
        max-width: 95%;
      }
    }
  `]
})
export class DiscussionComponent implements OnInit {
  reflectionText = '';
  analysis?: TextAnalysisResult;
  recommendedProfessionals: Professional[] = [];
  threads: DiscussionThread[] = [];
  isAnalyzing = false;
  anonymousText = '';
  anonymousMessages = [
    { author: 'Moderateur', text: 'Bienvenue. Vous pouvez parler ici sans afficher votre identite complete.' },
    { author: 'Conseiller', text: 'Si vous vous sentez en danger, utilisez en priorite les ressources d urgence.' }
  ];

  constructor(
    private authService: AuthService,
    private discussionService: DiscussionService,
    private directoryService: DirectoryService
  ) {}

  ngOnInit(): void {
    this.loadThreads();
  }

  usePrompt(text: string): void {
    this.reflectionText = text;
  }

  analyzeText(): void {
    if (!this.reflectionText.trim()) {
      return;
    }

    this.isAnalyzing = true;
    const user = this.authService.getCurrentUser();
    const userId = user?.id || 'guest_reflection';

    this.discussionService.createReflection(userId, this.reflectionText).subscribe({
      next: thread => {
        this.analysis = thread.textAnalysis;
        this.threads = [thread, ...this.threads].slice(0, 5);
        this.loadRecommendedProfessionals();
        this.isAnalyzing = false;
      },
      error: () => {
        this.isAnalyzing = false;
      }
    });
  }

  getSentimentLabel(sentiment: string): string {
    const labels: Record<string, string> = {
      stable: 'Stable',
      fragile: 'Fragile',
      distressed: 'Detresse',
      critical: 'Critique'
    };

    return labels[sentiment] || sentiment;
  }

  getTitleLabel(title: string): string {
    const labels: Record<string, string> = {
      psychiatrist: 'Psychiatre',
      psychologist: 'Psychologue',
      therapist: 'Therapeute',
      counselor: 'Conseiller'
    };

    return labels[title] || title;
  }

  sendAnonymousMessage(): void {
    const text = this.anonymousText.trim();
    if (!text) return;

    this.anonymousMessages = [
      ...this.anonymousMessages,
      { author: 'Utilisateur anonyme', text },
      { author: 'Conseiller', text: 'Merci pour votre message. Essayez de nommer l emotion principale et une action simple pour les prochaines minutes.' }
    ];
    this.anonymousText = '';
  }

  private loadRecommendedProfessionals(): void {
    if (!this.analysis) {
      this.recommendedProfessionals = [];
      return;
    }

    const severity = this.analysis.crisisDetected || this.analysis.sentiment === 'critical'
      ? 'severe'
      : this.analysis.sentiment === 'distressed'
        ? 'moderately_severe'
        : 'moderate';

    this.directoryService.getRecommendedProfessionals(severity, this.analysis.crisisDetected).subscribe(list => {
      this.recommendedProfessionals = list;
    });
  }

  private loadThreads(): void {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.threads = [];
      return;
    }

    this.discussionService.getThreadsForUser(user.id).subscribe(threads => {
      this.threads = threads;
    });
  }
}
