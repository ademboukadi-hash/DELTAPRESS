import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-solutions',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    MatListModule,
    MatTabsModule
  ],
  template: `
    <div class="dp-page dp-animate-in solutions-container">
      <div class="dp-hero-section text-center mb-5">
        <span class="dp-eyebrow mb-3 d-inline-block">Bibliothèque de ressources</span>
        <h1 class="dp-gradient-text mb-3" style="font-family: 'Manrope', sans-serif;">Exercices, vidéos et motivation</h1>
        <p class="subtitle lead" style="color: var(--dp-muted); font-family: 'Source Sans 3', sans-serif;">
          Des outils simples pour le sommeil, la respiration, la méditation et la gestion du stress.
        </p>
      </div>

      <mat-tab-group class="modern-tabs" animationDuration="500ms">
        <mat-tab label="Exercices">
          <div class="tab-content pt-4 pb-2">
            <div class="row g-4">
              <div class="col-md-6 col-lg-3" *ngFor="let exercise of exercises">
                <mat-card class="resource-card dp-glass-card dp-hover-lift h-100">
                  <mat-card-content class="p-4 d-flex flex-column h-100">
                    <div class="dp-icon-circle bg-primary-subtle text-primary mb-3">
                      <mat-icon>{{ exercise.icon }}</mat-icon>
                    </div>
                    <h2 class="h5 mb-2" style="font-family: 'Manrope', sans-serif; color: var(--dp-text);">{{ exercise.title }}</h2>
                    <small class="d-block mb-3 fw-bold" style="color: var(--dp-accent);">{{ exercise.duration }}</small>
                    <p class="mb-4 text-muted">{{ exercise.description }}</p>
                    <ul class="list-unstyled mb-0 mt-auto">
                      <li class="d-flex align-items-start mb-2" *ngFor="let step of exercise.steps; let i = index">
                        <span class="dp-step-number me-2 mt-1">{{ i + 1 }}</span>
                        <span class="text-muted small">{{ step }}</span>
                      </li>
                    </ul>
                  </mat-card-content>
                </mat-card>
              </div>
            </div>
          </div>
        </mat-tab>

        <mat-tab label="Conseils">
          <div class="tab-content pt-4 pb-2">
            <mat-accordion class="modern-accordion">
              <mat-expansion-panel *ngFor="let advice of adviceSections" class="dp-glass-card mb-3 border-0 shadow-sm">
                <mat-expansion-panel-header class="p-3">
                  <mat-panel-title class="d-flex align-items-center m-0" style="font-family: 'Manrope', sans-serif; font-size: 1.1rem; color: var(--dp-text);">
                    <div class="dp-icon-circle bg-primary-subtle text-primary me-3" style="width: 40px; height: 40px;">
                      <mat-icon>{{ advice.icon }}</mat-icon>
                    </div>
                    {{ advice.title }}
                  </mat-panel-title>
                </mat-expansion-panel-header>
                <ul class="advice-list list-unstyled p-3 pt-1 mb-0 ms-5">
                  <li class="d-flex align-items-center mb-3 text-muted" *ngFor="let item of advice.items">
                    <mat-icon class="me-3 text-success" style="font-size: 20px; width: 20px; height: 20px;">check_circle</mat-icon>
                    {{ item }}
                  </li>
                </ul>
              </mat-expansion-panel>
            </mat-accordion>
          </div>
        </mat-tab>

        <mat-tab label="Vidéos">
          <div class="tab-content pt-4 pb-2">
            <div class="row g-4">
              <div class="col-md-6 col-lg-4" *ngFor="let video of videos">
                <mat-card class="resource-card dp-glass-card dp-hover-lift h-100">
                  <mat-card-content class="p-4 d-flex flex-column h-100">
                    <div class="dp-icon-circle bg-danger-subtle text-danger mb-3">
                      <mat-icon>play_circle</mat-icon>
                    </div>
                    <h2 class="h5 mb-2" style="font-family: 'Manrope', sans-serif; color: var(--dp-text);">{{ video.title }}</h2>
                    <small class="d-block mb-3 fw-bold" style="color: var(--dp-accent);">{{ video.duration }}</small>
                    <p class="mb-4 text-muted flex-grow-1">{{ video.description }}</p>
                    <button mat-stroked-button color="primary" class="w-100 rounded-pill mt-auto py-1 dp-hover-lift" type="button">Ouvrir la vidéo</button>
                  </mat-card-content>
                </mat-card>
              </div>
            </div>
          </div>
        </mat-tab>

        <mat-tab label="Programme">
          <div class="tab-content pt-4 pb-2">
            <div class="row g-4">
              <div class="col-md-6 col-lg-3" *ngFor="let day of wellbeingProgram">
                <mat-card class="resource-card dp-glass-card dp-hover-lift h-100 dp-glow-border-success">
                  <mat-card-content class="p-4 text-center d-flex flex-column h-100">
                    <div class="dp-icon-circle bg-success-subtle text-success mb-3 mx-auto">
                      <mat-icon>task_alt</mat-icon>
                    </div>
                    <h2 class="h5 mb-3" style="font-family: 'Manrope', sans-serif; color: var(--dp-text);">{{ day.title }}</h2>
                    <p class="mb-4 text-muted flex-grow-1">{{ day.description }}</p>
                    <div class="dp-info-strip bg-success-subtle text-success rounded p-2 mt-auto">
                      <strong class="small">{{ day.goal }}</strong>
                    </div>
                  </mat-card-content>
                </mat-card>
              </div>
            </div>
          </div>
        </mat-tab>

        <mat-tab label="Motivation">
          <div class="tab-content pt-4 pb-2">
            <div class="row g-4">
              <div class="col-md-6" *ngFor="let slide of motivationSlides">
                <mat-card class="motivation-card dp-glass-card dp-hover-lift h-100">
                  <mat-card-content class="p-4 d-flex align-items-start">
                    <div class="dp-icon-circle bg-accent-subtle text-accent me-4 flex-shrink-0">
                      <mat-icon>{{ slide.icon }}</mat-icon>
                    </div>
                    <div>
                      <h2 class="h5 mb-2" style="font-family: 'Manrope', sans-serif; color: var(--dp-text);">{{ slide.title }}</h2>
                      <p class="mb-0 text-muted" style="line-height: 1.6;">{{ slide.text }}</p>
                    </div>
                  </mat-card-content>
                </mat-card>
              </div>
            </div>
          </div>
        </mat-tab>
      </mat-tab-group>

      <mat-card class="professional-cta dp-glass-card mt-5 border-0 position-relative overflow-hidden dp-hover-lift">
        <div class="cta-bg-gradient position-absolute top-0 start-0 w-100 h-100" style="background: linear-gradient(135deg, rgba(25,118,210,0.05) 0%, rgba(15,139,141,0.1) 100%); z-index: 0;"></div>
        <mat-card-content class="p-4 p-md-5 position-relative" style="z-index: 1;">
          <div class="cta-content d-flex flex-column flex-md-row align-items-center justify-content-between gap-4">
            <div class="d-flex align-items-center gap-4 flex-column flex-md-row text-center text-md-start">
              <div class="dp-icon-circle bg-primary text-white flex-shrink-0" style="width: 64px; height: 64px; box-shadow: var(--dp-shadow-premium);">
                <mat-icon style="font-size: 32px; width: 32px; height: 32px;">medical_services</mat-icon>
              </div>
              <div class="cta-text">
                <h3 class="h4 mb-2" style="font-family: 'Manrope', sans-serif; color: var(--dp-text);">Besoin d'aide personnalisée ?</h3>
                <p class="mb-0 text-muted" style="font-family: 'Source Sans 3', sans-serif; font-size: 1.05rem;">Les professionnels de l'annuaire peuvent vous accompagner de manière adaptée.</p>
              </div>
            </div>
            <a mat-raised-button color="primary" class="rounded-pill px-4 py-2" routerLink="/directory" style="font-family: 'Manrope', sans-serif;">Consulter l'annuaire</a>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .solutions-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem 1.5rem;
    }

    .dp-step-number {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--dp-primary), var(--dp-accent));
      color: white;
      font-size: 0.8rem;
      font-weight: 800;
      box-shadow: 0 4px 12px rgba(31, 120, 255, 0.25);
      flex-shrink: 0;
      transition: transform 0.2s ease;
    }

    .dp-step-number:hover {
      transform: scale(1.15);
    }

    .bg-primary-subtle { background-color: rgba(25, 118, 210, 0.1); }
    .text-primary { color: var(--dp-primary, #1976d2) !important; }

    .bg-danger-subtle { background-color: rgba(220, 53, 69, 0.1); }
    .text-danger { color: var(--dp-danger, #dc3545) !important; }

    .bg-success-subtle { background-color: rgba(40, 167, 69, 0.1); }
    .text-success { color: #28a745 !important; }

    .bg-accent-subtle { background-color: rgba(15, 139, 141, 0.1); }
    .text-accent { color: var(--dp-accent, #0f8b8d) !important; }

    .modern-tabs {
      font-family: 'Manrope', sans-serif;
    }
    
    ::ng-deep .modern-tabs .mdc-tab__text-label {
      font-family: 'Manrope', sans-serif;
      font-weight: 700;
      letter-spacing: 0.5px;
      transition: all 0.3s ease;
    }

    ::ng-deep .modern-tabs .mdc-tab--active .mdc-tab__text-label {
      color: var(--dp-primary);
    }

    ::ng-deep .modern-tabs .mdc-tab-bar__content {
      border-bottom: 2px solid var(--dp-border);
    }

    ::ng-deep .modern-tabs .mdc-tab-indicator__content {
      border-bottom: 3px solid var(--dp-primary) !important;
    }

    ::ng-deep .modern-tabs .mat-mdc-tab-body-content {
      overflow-x: hidden;
    }

    .modern-accordion {
      border-radius: 16px;
    }

    /* Resource card improvements */
    .resource-card {
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .resource-card:hover {
      transform: translateY(-8px);
      border-color: rgba(31, 120, 255, 0.3);
    }

    .tab-content {
      animation: dp-fade-in 0.5s ease-out;
    }

    .dp-glass-card {
      background: var(--dp-surface, #ffffff);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid var(--dp-border, rgba(0, 0, 0, 0.08));
      border-radius: 16px;
      transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
      box-shadow: var(--dp-shadow, 0 4px 12px rgba(0,0,0,0.05));
    }

    .dp-hover-lift {
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .dp-hover-lift:hover {
      transform: translateY(-6px);
      box-shadow: var(--dp-shadow-premium, 0 12px 24px rgba(0,0,0,0.1));
    }

    .dp-glow-border-success:hover {
      border-color: rgba(40, 167, 69, 0.4);
      box-shadow: 0 8px 24px rgba(40, 167, 69, 0.15);
    }

    .dp-icon-circle {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      border-radius: 50%;
    }
  `]
})
export class SolutionsComponent {
  exercises = [
    {
      icon: 'air',
      title: 'Respiration 4-7-8',
      duration: '3-5 minutes',
      description: 'Un exercice court pour calmer l anxiete rapidement.',
      steps: ['Inspirer 4 secondes', 'Retenir 7 secondes', 'Expirer 8 secondes', 'Repeter 3 cycles']
    },
    {
      icon: 'spa',
      title: 'Meditation guidee',
      duration: '5 minutes',
      description: 'Une pause simple pour revenir au corps et au souffle.',
      steps: ['S asseoir confortablement', 'Observer la respiration', 'Revenir doucement si l esprit part']
    },
    {
      icon: 'edit_note',
      title: 'Journal des emotions',
      duration: '10 minutes',
      description: 'Identifier emotions, peurs et pensees du jour.',
      steps: ['Nommer 3 emotions', 'Noter le declencheur', 'Choisir une petite action']
    },
    {
      icon: 'directions_walk',
      title: 'Marche consciente',
      duration: '10-20 minutes',
      description: 'Associer mouvement doux et attention au present.',
      steps: ['Marcher lentement', 'Sentir les appuis', 'Observer autour de soi']
    }
  ];

  adviceSections = [
    { icon: 'bedtime', title: 'Sommeil', items: ['Horaires reguliers', 'Moins d ecrans le soir', 'Chambre fraiche et sombre', 'Routine calme avant coucher'] },
    { icon: 'psychology', title: 'Stress', items: ['Identifier les sources', 'Fractionner les taches', 'Respirer avant de reagir', 'Prevoir une pause courte'] },
    { icon: 'groups', title: 'Isolement', items: ['Contacter un proche', 'Planifier une sortie simple', 'Demander de l aide', 'Rejoindre une activite de groupe'] }
  ];

  videos = [
    { title: 'Respiration anti-stress', duration: '3 minutes', description: 'Une video guidee pour ralentir le rythme.' },
    { title: 'Comprendre les pensees automatiques', duration: '6 minutes', description: 'Un support simple pour prendre du recul.' },
    { title: 'Meditation du soir', duration: '8 minutes', description: 'Une pratique douce pour preparer le sommeil.' }
  ];

  wellbeingProgram = [
    { title: 'Jour 1', description: 'Respirer, boire de l eau, noter son humeur.', goal: 'Objectif: 5 minutes pour soi' },
    { title: 'Jour 2', description: 'Marcher quelques minutes et noter une pensee utile.', goal: 'Objectif: mouvement doux' },
    { title: 'Jour 3', description: 'Contacter une personne de confiance.', goal: 'Objectif: rompre l isolement' },
    { title: 'Jour 4', description: 'Preparer une routine de sommeil simple.', goal: 'Objectif: recuperation' }
  ];

  motivationSlides = [
    { icon: 'wb_sunny', title: 'Un pas suffit', text: 'Une petite action compte deja: respirer, boire de l eau, envoyer un message.' },
    { icon: 'favorite', title: 'Vous meritez du soutien', text: 'Demander de l aide est une facon de se proteger.' },
    { icon: 'trending_up', title: 'La progression fluctue', text: 'Regardez la tendance, pas seulement une journee difficile.' },
    { icon: 'shield', title: 'Priorite securite', text: 'Si le danger est immediat, utilisez le plan de securite.' }
  ];
}
