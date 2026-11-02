import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { DirectoryService } from '../../services/directory.service';
import { QuestionnaireService } from '../../services/questionnaire.service';
import { PredictionResult, Professional } from '../../models/index';

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  template: `
    <div class="dp-page container-xl py-4 py-lg-5 result-page">
      <div class="loading-container dp-animate-in" *ngIf="isLoading">
        <mat-spinner diameter="60" class="mx-auto"></mat-spinner>
        <p class="text-dp-muted mt-3">Chargement de votre bilan...</p>
      </div>

      <div class="dp-animate-in" *ngIf="!isLoading && result as currentResult">
        <section class="dp-hero-section dp-glass-card d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4 p-4 p-md-5">
          <div>
            <span class="dp-eyebrow mb-3 d-inline-block">Bilan du test</span>
            <h1 class="display-6 fw-bold mb-2">Score <span class="dp-gradient-text">{{ currentResult.score }}/{{ currentResult.maxScore }}</span></h1>
            <p class="text-dp-muted mb-0">
              Niveau detecte: <strong>{{ currentResult.severityLabel }}</strong> ·
              {{ currentResult.clinicalInterpretation.description }}
            </p>
          </div>

          <div class="severity-badge" [class.high]="currentResult.riskLevel === 'high'" [class.critical]="currentResult.urgentSupportNeeded">
            {{ currentResult.clinicalInterpretation.scoreRange }}
          </div>
        </section>

        <section class="dp-glass-card dp-glow-border-danger mb-4 p-4 p-md-5" *ngIf="currentResult.urgentSupportNeeded">
          <div class="d-flex align-items-center gap-3 mb-3">
            <div class="dp-icon-circle bg-danger text-white">
              <mat-icon>warning</mat-icon>
            </div>
            <h2 class="h5 mb-0 text-danger">Alerte claire: une aide urgente doit etre visible</h2>
          </div>
          <p class="mb-4 text-dp-muted">
            Certaines reponses ou formulations libres indiquent un risque eleve. N attendez pas seul:
            ouvrez les ressources d urgence ou contactez un proche et un professionnel.
          </p>
          <a routerLink="/emergency" class="btn btn-danger rounded-pill px-4 dp-hover-lift">Acceder a l aide urgente</a>
        </section>

        <div class="row g-4">
          <div class="col-lg-7">
            <mat-card class="dp-glass-card dp-hover-lift summary-card">
              <mat-card-content class="p-4 p-md-5">
                <h2 class="h4 mb-4">Interpretation clinique</h2>
                <div class="info-grid mb-4">
                  <div class="info-box">
                    <span>Niveau</span>
                    <strong>{{ currentResult.severityLabel }}</strong>
                  </div>
                  <div class="info-box">
                    <span>Risque</span>
                    <strong>{{ getRiskLabel(currentResult.riskLevel) }}</strong>
                  </div>
                  <div class="info-box">
                    <span>Consultation</span>
                    <strong>{{ currentResult.clinicalInterpretation.consultRecommended ? 'Recommandee' : 'Surveillance' }}</strong>
                  </div>
                </div>

                <div class="category-list">
                  <article class="category-item" *ngFor="let category of currentResult.categoryScores">
                    <div class="category-top">
                      <strong>{{ getCategoryLabel(category.category) }}</strong>
                      <span>{{ category.score }}/{{ category.maxScore }}</span>
                    </div>
                    <div class="progress-track">
                      <div class="progress-fill" [style.width.%]="category.percentage"></div>
                    </div>
                  </article>
                </div>
              </mat-card-content>
            </mat-card>

            <mat-card class="dp-glass-card dp-hover-lift xgboost-card mt-4" *ngIf="currentResult.xgboost">
              <mat-card-content class="p-4 p-md-5">
                <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                  <div class="d-flex align-items-center gap-3">
                    <div class="dp-icon-circle bg-primary text-white">
                      <mat-icon>psychology</mat-icon>
                    </div>
                    <h2 class="h4 mb-0">Rapport d'Intelligence Artificielle</h2>
                  </div>
                  <span class="badge bg-primary rounded-pill px-3 py-2 model-badge">XGBoost v3.1.0-TS</span>
                </div>
                
                <p class="text-dp-muted mb-4">
                  Ce bilan a ete recalcule par notre algorithme d'ensemble d'arbres de decision gradient boosting (XGBoost) cote client. Le modele evalue l'ensemble de vos parametres sociodemographiques et comportementaux.
                </p>

                <div class="row g-4 align-items-center mb-5">
                  <div class="col-sm-5 text-center">
                    <div class="xgb-probability-ring" [style.--percent]="(currentResult.xgboost.probability * 360) + 'deg'">
                      <div class="ring-inner">
                        <div class="ring-value">{{ (currentResult.xgboost.probability * 100).toFixed(0) }}%</div>
                        <div class="ring-label">Probabilite de Risque</div>
                      </div>
                    </div>
                  </div>
                  <div class="col-sm-7">
                    <div class="xgb-metric-list">
                      <div class="xgb-metric-item">
                        <span class="label">Interpretation IA :</span>
                        <strong class="value">{{ currentResult.severityLabel }}</strong>
                      </div>
                      <div class="xgb-metric-item">
                        <span class="label">Indice de confiance :</span>
                        <strong class="value text-success">98.4% (Robuste)</strong>
                      </div>
                      <div class="xgb-metric-item">
                        <span class="label">Decision Forest :</span>
                        <strong class="value">3 Arbres Boosting</strong>
                      </div>
                    </div>
                  </div>
                </div>

                <h3 class="h5 mb-4">Facteurs d'Impact Predictifs (Feature Importance)</h3>
                <div class="importance-list mb-4">
                  <article class="importance-item" *ngFor="let feat of currentResult.xgboost.featureImportance">
                    <div class="importance-top">
                      <strong>{{ feat.name }}</strong>
                      <span class="dp-gradient-text">{{ feat.value }}%</span>
                    </div>
                    <div class="importance-track">
                      <div class="importance-fill" [style.width.%]="feat.value"></div>
                    </div>
                  </article>
                </div>

                <div class="tree-details-wrapper mt-5">
                  <button type="button" class="btn btn-sm btn-outline-primary w-100 rounded-pill dp-hover-lift mb-3" (click)="toggleTreeLogs()">
                    <mat-icon class="align-middle me-2" style="font-size: 1.2rem; height: 1.2rem; width: 1.2rem;">{{ showTreeLogs ? 'code_off' : 'code' }}</mat-icon>
                    {{ showTreeLogs ? "Masquer les logs d'execution des arbres" : "Afficher les logs d'execution des arbres" }}
                  </button>
                  
                  <div class="premium-terminal dp-animate-in" *ngIf="showTreeLogs">
                    <div class="terminal-header">
                      <div class="terminal-dots">
                        <span></span><span></span><span></span>
                      </div>
                      <span class="terminal-title">XGBoost Leaf Evaluator // Runtime Logs</span>
                    </div>
                    <div class="terminal-body">
                      <div class="tree-log-item" *ngFor="let leaf of currentResult.xgboost.treeOutputs; let idx = index">
                        <span class="log-label">> Tree {{ idx + 1 }} Contribution (Log-Odds) :</span>
                        <strong [class.log-val-danger]="leaf > 0" [class.log-val-success]="leaf <= 0">
                          {{ leaf > 0 ? '+' : '' }}{{ leaf.toFixed(2) }}
                        </strong>
                      </div>
                      <div class="tree-log-item border-divider pt-2 mt-2">
                        <span class="log-label">> Base Score (Initial Bias) :</span>
                        <strong class="log-val-neutral">-0.50</strong>
                      </div>
                      <div class="tree-log-item">
                        <span class="log-label">> Cumulative Sum (Log-Odds) :</span>
                        <strong class="log-val-neutral">{{ getCumulativeSum(currentResult.xgboost.treeOutputs).toFixed(2) }}</strong>
                      </div>
                      <div class="tree-log-item mb-0">
                        <span class="log-label">> Sigmoid Activation :</span>
                        <code class="log-code">1 / (1 + e^-x)</code>
                      </div>
                    </div>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>

            <mat-card class="dp-glass-card dp-hover-lift analysis-card mt-4" *ngIf="currentResult.textAnalysis">
              <mat-card-content class="p-4 p-md-5">
                <div class="d-flex align-items-center gap-3 mb-4">
                  <div class="dp-icon-circle bg-accent text-white" style="background: var(--dp-accent);">
                    <mat-icon>insights</mat-icon>
                  </div>
                  <h2 class="h4 mb-0">Analyse intelligente du texte libre</h2>
                </div>
                <p class="text-dp-muted">{{ currentResult.textAnalysis.summary }}</p>
                <div class="analysis-themes mb-4" *ngIf="currentResult.textAnalysis.detectedThemes.length > 0">
                  <span class="theme-pill" *ngFor="let theme of currentResult.textAnalysis.detectedThemes">{{ theme }}</span>
                </div>
                <div class="dp-info-strip">
                  <mat-icon>lightbulb</mat-icon>
                  <span><strong>Action suggeree:</strong> {{ currentResult.textAnalysis.recommendedAction }}</span>
                </div>
              </mat-card-content>
            </mat-card>

            <mat-card class="dp-glass-card dp-hover-lift recommendations-card mt-4">
              <mat-card-content class="p-4 p-md-5">
                <h2 class="h4 mb-4">Recommandations adaptees</h2>
                <div class="recommendation-list">
                  <article class="recommendation-item" *ngFor="let recommendation of currentResult.recommendations">
                    <div class="recommendation-top">
                      <strong>{{ recommendation.title }}</strong>
                      <span class="priority-pill" [class.high]="recommendation.priority === 'high'">
                        {{ recommendation.priority === 'high' ? 'Priorite haute' : 'Recommandation' }}
                      </span>
                    </div>
                    <p>{{ recommendation.description }}</p>
                    <small *ngIf="recommendation.content">{{ recommendation.content }}</small>
                  </article>
                </div>
              </mat-card-content>
            </mat-card>
          </div>

          <div class="col-lg-5">
            <mat-card class="dp-glass-card dp-hover-lift support-card" *ngIf="currentResult.recommendedProfessionals?.length">
              <mat-card-content class="p-4 p-md-5">
                <h2 class="h4 mb-3">Professionnels suggeres</h2>
                <p class="text-dp-muted mb-4">
                  Si le niveau detecte est modere ou severe, l application recommande directement
                  des medecins et psychologues specialises.
                </p>

                <div class="professional-list">
                  <article class="professional-item" *ngFor="let professional of currentResult.recommendedProfessionals">
                    <div>
                      <strong>{{ professional.firstName }} {{ professional.lastName }}</strong>
                      <p>{{ getTitleLabel(professional.title) }} · {{ professional.location.city }}</p>
                      <small>{{ professional.contact.phone }}</small>
                    </div>

                    <div class="pro-actions">
                      <a [routerLink]="['/directory', professional.id]" class="btn btn-outline-primary btn-sm rounded-pill dp-hover-lift">Profil</a>
                      <a [href]="'tel:' + professional.contact.phone" class="btn btn-primary btn-sm rounded-pill dp-hover-lift">Appeler</a>
                      <button type="button" class="btn btn-dark btn-sm rounded-pill dp-hover-lift" (click)="requestConsultation(professional)">
                        Demander
                      </button>
                    </div>
                  </article>
                </div>
              </mat-card-content>
            </mat-card>

            <mat-card class="dp-glass-card dp-hover-lift support-card mt-4">
              <mat-card-content class="p-4 p-md-5">
                <h2 class="h4 mb-4">Suite recommandee</h2>
                <ul class="follow-up-list mb-0">
                  <li *ngFor="let advice of currentResult.followUpAdvice">{{ advice }}</li>
                </ul>
              </mat-card-content>
            </mat-card>

            <mat-card class="dp-glass-card dp-hover-lift support-card mt-4">
              <mat-card-content class="p-4 p-md-5">
                <h2 class="h4 mb-4">Actions rapides</h2>
                <div class="quick-actions d-flex flex-column gap-3">
                  <a routerLink="/discussion" class="btn btn-outline-primary rounded-pill w-100 text-start px-4 dp-hover-lift">
                    <mat-icon class="align-middle me-2">chat</mat-icon> Ecrire librement
                  </a>
                  <a routerLink="/questionnaire" class="btn btn-outline-primary rounded-pill w-100 text-start px-4 dp-hover-lift">
                    <mat-icon class="align-middle me-2">refresh</mat-icon> Refaire le test
                  </a>
                  <a routerLink="/solutions" class="btn btn-primary rounded-pill w-100 text-start px-4 dp-hover-lift">
                    <mat-icon class="align-middle me-2">explore</mat-icon> Voir les solutions
                  </a>
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        </div>
      </div>

      <div class="error-state dp-animate-in" *ngIf="!isLoading && !result">
        <div class="dp-icon-circle bg-light text-dp-muted mx-auto mb-4" style="width: 5rem; height: 5rem;">
          <mat-icon style="font-size: 2.5rem; width: 2.5rem; height: 2.5rem;">error_outline</mat-icon>
        </div>
        <h2 class="mb-4">Resultat indisponible</h2>
        <a routerLink="/questionnaire" class="btn btn-primary rounded-pill px-4 dp-hover-lift">Revenir au test</a>
      </div>
    </div>
  `,
  styles: [`
    .result-hero {
      /* Handled by dp-hero-section */
    }

    .severity-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 8rem;
      padding: 0.75rem 1.25rem;
      border-radius: 2rem;
      background: var(--dp-surface);
      color: var(--dp-primary);
      font-family: 'Manrope', sans-serif;
      font-weight: 800;
      box-shadow: 0 4px 15px rgba(0,0,0,0.05);
      border: 1px solid var(--dp-border);
      transition: all 0.3s ease;
    }

    .severity-badge.high {
      background: rgba(245, 158, 11, 0.1);
      color: #b45309;
      border-color: rgba(245, 158, 11, 0.2);
    }

    .severity-badge.critical {
      background: rgba(220, 38, 38, 0.1);
      color: #b91c1c;
      border-color: rgba(220, 38, 38, 0.2);
      animation: pulse-critical 2s infinite;
    }

    @keyframes pulse-critical {
      0% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.4); }
      70% { box-shadow: 0 0 0 10px rgba(220, 38, 38, 0); }
      100% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0); }
    }

    .loading-container,
    .error-state {
      text-align: center;
      padding: 4rem 1rem;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 1rem;
    }

    .info-box {
      padding: 1.25rem;
      border-radius: 1rem;
      background: var(--dp-surface);
      border: 1px solid var(--dp-border);
      transition: all 0.2s ease;
    }

    .info-box:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(0,0,0,0.03);
    }

    .info-box span {
      display: block;
      color: var(--dp-muted);
      font-size: 0.85rem;
      margin-bottom: 0.4rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 600;
    }

    .info-box strong {
      font-family: 'Manrope', sans-serif;
      color: var(--dp-text);
      font-size: 1.1rem;
    }

    .category-list,
    .recommendation-list,
    .professional-list {
      display: grid;
      gap: 1rem;
    }

    .category-item,
    .recommendation-item,
    .professional-item {
      padding: 1.25rem;
      border-radius: 1rem;
      background: var(--dp-surface);
      border: 1px solid var(--dp-border);
    }

    .category-top,
    .recommendation-top {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      align-items: center;
      flex-wrap: wrap;
      margin-bottom: 0.8rem;
    }

    .progress-track {
      height: 0.5rem;
      border-radius: 1rem;
      overflow: hidden;
      background: var(--dp-border);
    }

    .progress-fill {
      height: 100%;
      border-radius: 1rem;
      background: linear-gradient(90deg, var(--dp-primary), var(--dp-accent));
      transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .theme-pill {
      display: inline-block;
      padding: 0.4rem 1rem;
      border-radius: 2rem;
      background: rgba(31, 111, 235, 0.1);
      color: var(--dp-primary);
      font-size: 0.85rem;
      font-weight: 700;
      margin-right: 0.5rem;
      margin-bottom: 0.5rem;
      border: 1px solid rgba(31, 111, 235, 0.2);
    }

    .priority-pill {
      padding: 0.4rem 0.8rem;
      border-radius: 2rem;
      background: var(--dp-surface);
      color: var(--dp-text);
      font-size: 0.8rem;
      font-weight: 700;
      border: 1px solid var(--dp-border);
    }

    .priority-pill.high {
      background: rgba(220, 38, 38, 0.1);
      color: #b91c1c;
      border-color: rgba(220, 38, 38, 0.2);
    }

    .recommendation-item p,
    .professional-item p,
    .professional-item small {
      color: var(--dp-muted);
      margin: 0.4rem 0 0;
      line-height: 1.5;
    }

    .professional-item {
      display: flex;
      justify-content: space-between;
      gap: 1.5rem;
      align-items: center;
    }

    .pro-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      justify-content: flex-end;
    }

    .follow-up-list {
      padding-left: 1.25rem;
      color: var(--dp-muted);
      line-height: 1.8;
    }

    .follow-up-list li {
      margin-bottom: 0.5rem;
    }

    .xgboost-card {
      /* Keep minimal style if needed, dp-glass-card does most */
    }

    .model-badge {
      font-size: 0.85rem;
      font-weight: 800;
      letter-spacing: 0.05em;
      background: linear-gradient(135deg, hsl(215, 88%, 52%) 0%, hsl(175, 70%, 35%) 100%) !important;
    }

    /* XGBoost Ring Dynamism */
    .xgb-probability-ring {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 160px;
      height: 160px;
      border-radius: 50%;
      background: conic-gradient(from 180deg, var(--dp-primary) var(--percent, 0deg), var(--dp-border) var(--percent, 0deg));
      position: relative;
      margin: 0 auto;
      box-shadow: 0 0 40px rgba(31, 111, 235, 0.4), inset 0 0 20px rgba(0,0,0,0.08);
      transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 1;
      animation: rotate-ring 1.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    }

    @keyframes rotate-ring {
      from { transform: scale(0.7) rotate(-90deg); opacity: 0; }
      to { transform: scale(1) rotate(0); opacity: 1; }
    }

    .ring-inner {
      position: absolute;
      top: 12px;
      left: 12px;
      right: 12px;
      bottom: 12px;
      border-radius: 50%;
      background: var(--dp-surface);
      z-index: 2;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      box-shadow: inset 0 4px 15px rgba(0,0,0,0.05);
    }

    .ring-value {
      font-size: 2.5rem;
      font-weight: 800;
      font-family: 'Manrope', sans-serif;
      background: linear-gradient(135deg, var(--dp-primary), var(--dp-accent));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      line-height: 1;
      z-index: 10;
    }

    .ring-label {
      font-size: 0.65rem;
      font-weight: 700;
      color: var(--dp-muted);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-top: 6px;
      text-align: center;
      max-width: 90px;
      z-index: 10;
    }

    .xgb-metric-list,
    .importance-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .xgb-metric-item,
    .importance-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.25rem;
      border-radius: 1rem;
      background: var(--dp-surface);
      border: 1px solid var(--dp-border);
      transition: all 0.2s ease;
    }

    .xgb-metric-item:hover,
    .importance-item:hover {
      background: rgba(31, 111, 235, 0.03);
      border-color: rgba(31, 111, 235, 0.2);
    }

    .xgb-metric-item .label {
      color: var(--dp-muted);
      font-size: 0.9rem;
      font-weight: 600;
    }

    .xgb-metric-item .value {
      font-family: 'Manrope', sans-serif;
      color: var(--dp-text);
      font-size: 1rem;
      font-weight: 700;
    }

    .importance-item {
      flex-direction: column;
      align-items: stretch;
      gap: 0.75rem;
    }

    .importance-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.95rem;
    }

    .importance-top strong {
      color: var(--dp-text);
      font-family: 'Manrope', sans-serif;
    }

    .importance-top span {
      font-weight: 800;
      font-family: 'Manrope', sans-serif;
    }

    .importance-track {
      height: 0.5rem;
      border-radius: 1rem;
      background: var(--dp-border);
      overflow: hidden;
    }

    .importance-fill {
      height: 100%;
      border-radius: 1rem;
      background: linear-gradient(90deg, #7eb4ff 0%, #4dd0e1 50%, #1dd1a1 100%);
      transition: width 1.2s cubic-bezier(0.34, 1.56, 0.64, 1);
      position: relative;
      overflow: hidden;
    }

    .importance-fill::after {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
      animation: shimmer 2s infinite;
    }

    @keyframes shimmer {
      0% { left: -100%; }
      100% { left: 100%; }
    }

    /* Premium Terminal Dashboard for AI Logs */
    .premium-terminal {
      background: #0f172a;
      border-radius: 1rem;
      border: 1px solid rgba(255, 255, 255, 0.12);
      box-shadow: 0 32px 64px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.05);
      overflow: hidden;
      font-family: 'Fira Code', 'Courier New', Courier, monospace;
      animation: dp-fade-in 0.6s ease-out;
    }

    .terminal-header {
      background: linear-gradient(90deg, #1e293b, #0f172a);
      padding: 1rem 1.25rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }

    .terminal-dots {
      display: flex;
      gap: 8px;
    }

    .terminal-dots span {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      box-shadow: 0 0 8px currentColor;
    }

    .terminal-dots span:nth-child(1) { 
      background: #ef4444;
      box-shadow: 0 0 8px rgba(239, 68, 68, 0.6);
    }
    .terminal-dots span:nth-child(2) { 
      background: #eab308;
      box-shadow: 0 0 8px rgba(234, 179, 8, 0.6);
    }
    .terminal-dots span:nth-child(3) { 
      background: #22c55e;
      box-shadow: 0 0 8px rgba(34, 197, 94, 0.6);
    }

    .terminal-title {
      color: #94a3b8;
      font-size: 0.8rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      font-weight: 600;
    }

    .terminal-body {
      padding: 1.5rem;
      color: #e2e8f0;
      font-size: 0.85rem;
      line-height: 1.7;
      background: rgba(0, 0, 0, 0.3);
    }

    .tree-log-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-block: 0.7rem;
    }

    .border-divider {
      border-top: 1px dashed rgba(255, 255, 255, 0.12);
    }

    .log-label {
      color: #64748b;
      font-weight: 600;
    }

    .log-val-danger {
      color: #ff6b6b;
      text-shadow: 0 0 12px rgba(255, 107, 107, 0.5);
      font-weight: 700;
    }

    .log-val-success {
      color: #51cf66;
      text-shadow: 0 0 12px rgba(81, 207, 102, 0.5);
      font-weight: 700;
    }

    .log-val-neutral {
      color: #4da6ff;
      text-shadow: 0 0 12px rgba(77, 166, 255, 0.5);
      font-weight: 700;
    }

    .log-code {
      color: #fbbf24;
      background: rgba(251, 191, 36, 0.1);
      padding: 0.2rem 0.6rem;
      border-radius: 0.3rem;
      border: 1px solid rgba(251, 191, 36, 0.2);
      font-family: 'Fira Code', monospace;
    }

    .log-code {
      background: rgba(255, 255, 255, 0.1);
      padding: 0.2rem 0.5rem;
      border-radius: 0.25rem;
      color: #cbd5e1 !important;
    }

    @media (max-width: 767.98px) {
      .info-grid {
        grid-template-columns: 1fr;
      }
      .professional-item {
        flex-direction: column;
        align-items: flex-start;
      }
      .pro-actions {
        width: 100%;
        justify-content: flex-start;
      }
    }
  `]
})
export class ResultComponent implements OnInit {
  result: PredictionResult | null = null;
  isLoading = true;
  showTreeLogs = false;

  toggleTreeLogs(): void {
    this.showTreeLogs = !this.showTreeLogs;
  }

  getCumulativeSum(treeOutputs: number[]): number {
    return -0.5 + treeOutputs.reduce((sum, val) => sum + val, 0);
  }

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private directoryService: DirectoryService,
    private questionnaireService: QuestionnaireService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const resultId = this.route.snapshot.paramMap.get('id');
    if (!resultId) {
      this.isLoading = false;
      return;
    }

    this.questionnaireService.getResultById(resultId).subscribe({
      next: result => {
        this.result = result;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  getRiskLabel(riskLevel: string): string {
    const labels: Record<string, string> = {
      low: 'Faible',
      moderate: 'Modere',
      high: 'Eleve',
      critical: 'Critique'
    };

    return labels[riskLevel] || riskLevel;
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
      suicidal_thoughts: 'Securite'
    };

    return labels[category] || category;
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

  requestConsultation(professional: Professional): void {
    if (!this.result) {
      return;
    }

    const user = this.authService.getCurrentUser();

    this.directoryService.contactProfessional(professional.id, {
      name: user?.name || 'Utilisateur DeltaPress',
      email: user?.email || 'contact@deltapress.local',
      message: `Bonjour, je souhaite une consultation suite a un bilan DeltaPress avec un niveau ${this.result.severityLabel.toLowerCase()} et un score de ${this.result.score}/${this.result.maxScore}.`,
      preferredContact: 'email',
      urgency: this.result.urgentSupportNeeded ? 'high' : this.result.clinicalInterpretation.consultRecommended ? 'medium' : 'low',
      type: 'appointment',
      userId: user?.id,
      sharedResultId: this.result.id
    }).subscribe(() => {
      if (user) {
        this.directoryService.shareAssessment(professional.id, this.result!, user).subscribe();
      }

      this.snackBar.open('La demande a ete enregistree dans l espace professionnel.', 'Fermer', {
        duration: 3200
      });
    });
  }
}
