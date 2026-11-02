import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatExpansionModule,
    MatListModule
  ],
  template: `
    <div class="dp-page container py-4 py-md-5">
      <div class="dp-hero-section text-center dp-animate-in">
        <span class="dp-eyebrow">À propos</span>
        <h1 class="display-4 fw-bold mb-3">
          Découvrez <span class="dp-gradient-text">DeltaPress</span>
        </h1>
        <p class="lead text-muted max-w-700 mx-auto">
          Comprendre notre mission, notre méthode et nos engagements pour votre santé mentale.
        </p>
      </div>

      <!-- Mission Section -->
      <section class="mission-section mb-5 dp-animate-in" style="--stagger: 1">
        <mat-card class="dp-glass-card dp-hover-lift border-0">
          <mat-card-header class="d-flex align-items-center mb-3">
            <div class="dp-icon-circle me-3">
              <mat-icon>favorite</mat-icon>
            </div>
            <mat-card-title class="m-0 fs-4 fw-bold">Notre mission</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p class="fs-5 mb-0 text-muted">
              DeltaPress a pour objectif de démocratiser l'accès au dépistage des troubles de la santé mentale 
              et d'orienter les personnes vers des ressources d'aide adaptées. Nous croyons que la prévention 
              et l'écoute précoce sont essentielles pour le bien-être de chacun.
            </p>
          </mat-card-content>
        </mat-card>
      </section>

      <!-- How it Works -->
      <section class="how-it-works mb-5 dp-animate-in" style="--stagger: 2">
        <h2 class="h3 fw-bold mb-4">Comment fonctionne l'évaluation</h2>
        <div class="row g-4">
          <div class="col-md-6 col-lg-3">
            <div class="dp-glass-card p-4 h-100 dp-hover-lift text-center">
              <div class="dp-step-number mb-3 mx-auto">1</div>
              <h3 class="h5 fw-bold mb-2">Collecte anonyme</h3>
              <p class="text-muted small mb-0">Vos réponses sont collectées de manière anonyme et sécurisée. Aucune donnée personnelle n'est requise.</p>
            </div>
          </div>
          <div class="col-md-6 col-lg-3">
            <div class="dp-glass-card p-4 h-100 dp-hover-lift text-center">
              <div class="dp-step-number mb-3 mx-auto">2</div>
              <h3 class="h5 fw-bold mb-2">Analyse algorithmique</h3>
              <p class="text-muted small mb-0">Notre système analyse vos réponses avec des algorithmes validés par des professionnels de santé.</p>
            </div>
          </div>
          <div class="col-md-6 col-lg-3">
            <div class="dp-glass-card p-4 h-100 dp-hover-lift text-center">
              <div class="dp-step-number mb-3 mx-auto">3</div>
              <h3 class="h5 fw-bold mb-2">Score & interprétation</h3>
              <p class="text-muted small mb-0">Vous recevez un score indicatif avec une explication claire de ce qu'il signifie.</p>
            </div>
          </div>
          <div class="col-md-6 col-lg-3">
            <div class="dp-glass-card p-4 h-100 dp-hover-lift text-center">
              <div class="dp-step-number mb-3 mx-auto">4</div>
              <h3 class="h5 fw-bold mb-2">Recommandations</h3>
              <p class="text-muted small mb-0">Des conseils et ressources adaptés à votre situation vous sont proposés.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Score Explanation -->
      <section class="score-explanation mb-5 dp-animate-in" style="--stagger: 3">
        <h2 class="h3 fw-bold mb-4">Comprendre le score</h2>
        <div class="row g-4">
          <div class="col-md-6 col-lg-3">
            <mat-card class="dp-glass-card dp-hover-lift h-100 score-card score-card-success">
              <mat-card-header class="mb-3">
                <div class="dp-icon-circle success-icon lg">
                  <mat-icon>sentiment_satisfied</mat-icon>
                </div>
              </mat-card-header>
              <mat-card-content>
                <h3 class="h5 fw-bold mb-2">Risque faible</h3>
                <p class="text-muted small mb-0">Vos réponses ne montrent pas de signes significatifs de dépression. Continuez à prendre soin de vous.</p>
              </mat-card-content>
            </mat-card>
          </div>

          <div class="col-md-6 col-lg-3">
            <mat-card class="dp-glass-card dp-hover-lift h-100 score-card score-card-warning">
              <mat-card-header class="mb-3">
                <div class="dp-icon-circle warning-icon lg">
                  <mat-icon>sentiment_neutral</mat-icon>
                </div>
              </mat-card-header>
              <mat-card-content>
                <h3 class="h5 fw-bold mb-2">Risque modéré</h3>
                <p class="text-muted small mb-0">Certains signes suggèrent une possible détresse. Explorez nos ressources d'aide.</p>
              </mat-card-content>
            </mat-card>
          </div>

          <div class="col-md-6 col-lg-3">
            <mat-card class="dp-glass-card dp-hover-lift h-100 score-card score-card-danger">
              <mat-card-header class="mb-3">
                <div class="dp-icon-circle danger-icon lg">
                  <mat-icon>sentiment_dissatisfied</mat-icon>
                </div>
              </mat-card-header>
              <mat-card-content>
                <h3 class="h5 fw-bold mb-2">Risque élevé</h3>
                <p class="text-muted small mb-0">Des signes compatibles avec dépression détectés. Consultation recommandée.</p>
              </mat-card-content>
            </mat-card>
          </div>

          <div class="col-md-6 col-lg-3">
            <mat-card class="dp-glass-card dp-hover-lift h-100 score-card score-card-critical">
              <mat-card-header class="mb-3">
                <div class="dp-icon-circle critical-icon lg">
                  <mat-icon>warning</mat-icon>
                </div>
              </mat-card-header>
              <mat-card-content>
                <h3 class="h5 fw-bold mb-2">Critique</h3>
                <p class="text-muted small mb-0">Signes graves détectés. Consultez immédiatement et utilisez nos ressources d'urgence.</p>
              </mat-card-content>
            </mat-card>
          </div>
        </div>
      </section>

      <!-- Limitations & Privacy (Grid) -->
      <div class="row g-4 mb-5 dp-animate-in" style="--stagger: 4">
        <!-- Limitations -->
        <div class="col-lg-6">
          <section class="limitations h-100">
            <h2 class="h3 fw-bold mb-4">Limites et précautions</h2>
            <mat-accordion class="dp-accordion">
              <mat-expansion-panel class="dp-glass-card mb-3">
                <mat-expansion-panel-header>
                  <mat-panel-title class="fw-bold align-items-center">
                    <mat-icon class="me-2" style="color: var(--dp-primary)">info</mat-icon>
                    Pas un diagnostic
                  </mat-panel-title>
                </mat-expansion-panel-header>
                <p class="text-muted pt-2 mb-0">
                  DeltaPress est un outil de <strong>dépistage et d'orientation</strong>, pas un outil de diagnostic. 
                  Seul un professionnel de santé qualifié peut poser un diagnostic et proposer un traitement adapté.
                </p>
              </mat-expansion-panel>

              <mat-expansion-panel class="dp-glass-card mb-3">
                <mat-expansion-panel-header>
                  <mat-panel-title class="fw-bold align-items-center">
                    <mat-icon class="me-2" style="color: var(--dp-primary)">science</mat-icon>
                    Validité scientifique
                  </mat-panel-title>
                </mat-expansion-panel-header>
                <p class="text-muted pt-2 mb-0">
                  Notre questionnaire est basé sur des échelles reconnues (PHQ-9, GAD-7) 
                  et validées. L'auto-évaluation comporte des limites liées à la subjectivité.
                </p>
              </mat-expansion-panel>

              <mat-expansion-panel class="dp-glass-card">
                <mat-expansion-panel-header>
                  <mat-panel-title class="fw-bold align-items-center">
                    <mat-icon class="me-2" style="color: var(--dp-primary)">person_off</mat-icon>
                    Consultez en cas de doute
                  </mat-panel-title>
                </mat-expansion-panel-header>
                <p class="text-muted pt-2 mb-0">
                  En cas de symptômes persistants, n'hésitez jamais à consulter un professionnel 
                  de santé, même si votre score est faible.
                </p>
              </mat-expansion-panel>
            </mat-accordion>
          </section>
        </div>

        <!-- Privacy -->
        <div class="col-lg-6">
          <section class="privacy h-100">
            <h2 class="h3 fw-bold mb-4">Confidentialité et sécurité</h2>
            <mat-card class="dp-glass-card h-100">
              <mat-card-content class="p-3">
                <mat-list class="bg-transparent p-0">
                  <mat-list-item class="mb-3 privacy-item">
                    <mat-icon matListItemIcon style="color: var(--dp-primary)">lock</mat-icon>
                    <div matListItemTitle class="fw-bold">Chiffrement des données</div>
                    <div matListItemLine class="text-muted text-wrap">Vos données sont chiffrées et stockées de manière sécurisée</div>
                  </mat-list-item>
                  <mat-list-item class="mb-3 privacy-item">
                    <mat-icon matListItemIcon style="color: var(--dp-primary)">visibility_off</mat-icon>
                    <div matListItemTitle class="fw-bold">Anonymat possible</div>
                    <div matListItemLine class="text-muted text-wrap">Vous pouvez utiliser l'outil sans créer de compte</div>
                  </mat-list-item>
                  <mat-list-item class="mb-3 privacy-item">
                    <mat-icon matListItemIcon style="color: var(--dp-primary)">delete</mat-icon>
                    <div matListItemTitle class="fw-bold">Droit à l'oubli</div>
                    <div matListItemLine class="text-muted text-wrap">Demandez la suppression de vos données à tout moment</div>
                  </mat-list-item>
                  <mat-list-item class="privacy-item">
                    <mat-icon matListItemIcon style="color: var(--dp-primary)">verified_user</mat-icon>
                    <div matListItemTitle class="fw-bold">Consentement éclairé</div>
                    <div matListItemLine class="text-muted text-wrap">Nous vous informons clairement de l'utilisation de vos données</div>
                  </mat-list-item>
                </mat-list>
              </mat-card-content>
            </mat-card>
          </section>
        </div>
      </div>

      <!-- Team/Ethics -->
      <section class="ethics dp-animate-in" style="--stagger: 5">
        <div class="dp-info-strip d-flex flex-column flex-md-row p-4 rounded-4" style="background: linear-gradient(135deg, rgba(25, 118, 210, 0.03), rgba(25, 118, 210, 0.08)); border: 1px solid var(--dp-border)">
          <div class="me-md-5 mb-4 mb-md-0 d-flex flex-column justify-content-center">
            <h2 class="h3 fw-bold mb-2">Notre engagement éthique</h2>
            <p class="text-muted mb-0 max-w-600">
              DeltaPress est développé en collaboration avec des professionnels de santé mentale.
            </p>
          </div>
          <ul class="ethics-list m-0 flex-grow-1">
            <li>Ne jamais exploiter la vulnérabilité des utilisateurs</li>
            <li>Fournir des informations exactes et à jour</li>
            <li>Orienter systématiquement vers l'aide professionnelle</li>
            <li>Maintenir la plus grande transparence sur nos méthodes</li>
            <li>Améliorer continuellement notre outil grâce aux experts</li>
          </ul>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .max-w-700 { max-width: 700px; }
    .max-w-600 { max-width: 600px; }

    /* Mission Card Extra Styling */
    .mission-section mat-card {
      background: linear-gradient(135deg, rgba(25,118,210,0.05) 0%, rgba(25,118,210,0.02) 100%);
      border: 1px solid rgba(25,118,210,0.1);
    }

    /* Modernized Score Cards */
    .score-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      border: none;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      position: relative;
      overflow: hidden;
    }

    .score-card mat-card-header {
      width: 100%;
      margin-bottom: 0;
      padding-bottom: 1rem;
      border-bottom: 2px solid rgba(0, 0, 0, 0.05);
    }

    .score-card mat-card-content {
      padding-top: 1.5rem;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .score-card h3 {
      margin-bottom: 0.75rem;
    }

    /* Colored borders for score levels */
    .score-card-success { 
      border-top: 3px solid #4caf50;
    }
    
    .score-card-warning { 
      border-top: 3px solid #ff9800;
    }
    
    .score-card-danger { 
      border-top: 3px solid #f44336;
    }
    
    .score-card-critical { 
      border-top: 3px solid #b71c1c;
    }

    /* Icon circle variants */
    .success-icon { 
      background: linear-gradient(135deg, rgba(76, 175, 80, 0.15), rgba(76, 175, 80, 0.08));
      color: #4caf50;
      border: 1px solid rgba(76, 175, 80, 0.2);
    }
    
    .warning-icon { 
      background: linear-gradient(135deg, rgba(255, 152, 0, 0.15), rgba(255, 152, 0, 0.08));
      color: #ff9800;
      border: 1px solid rgba(255, 152, 0, 0.2);
    }
    
    .danger-icon { 
      background: linear-gradient(135deg, rgba(244, 67, 54, 0.15), rgba(244, 67, 54, 0.08));
      color: #f44336;
      border: 1px solid rgba(244, 67, 54, 0.2);
    }
    
    .critical-icon { 
      background: linear-gradient(135deg, rgba(183, 28, 28, 0.15), rgba(183, 28, 28, 0.08));
      color: #b71c1c;
      border: 1px solid rgba(183, 28, 28, 0.2);
    }

    /* Accordion override */
    .dp-accordion .mat-expansion-panel {
      background: transparent !important;
      box-shadow: none !important;
      border: 1px solid var(--dp-border);
      border-radius: 1rem !important;
      margin-bottom: 0.75rem;
      transition: all 0.3s ease;
    }

    .dp-accordion .mat-expansion-panel:hover {
      border-color: rgba(31, 120, 255, 0.2);
      box-shadow: 0 8px 24px rgba(31, 120, 255, 0.06);
    }

    .dp-accordion .mat-expansion-panel-header {
      transition: all 0.3s ease;
    }

    .privacy-item {
      height: auto !important;
      min-height: 48px;
    }
    
    .privacy-item ::ng-deep .mdc-list-item__content {
      overflow: visible !important;
    }

    .ethics-list {
      list-style: none;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .ethics-list li {
      position: relative;
      padding-left: 36px;
      color: var(--dp-text);
      font-size: 0.95rem;
      line-height: 1.5;
    }

    .ethics-list li::before {
      content: 'check_circle';
      font-family: 'Material Icons';
      position: absolute;
      left: 0;
      top: 0;
      color: var(--dp-primary);
      font-size: 22px;
    }
  `]
})
export class AboutComponent {}
