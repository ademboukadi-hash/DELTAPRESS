import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { EmergencyService } from '../../services/emergency.service';
import { EmergencyResource } from '../../models/index';

@Component({
  selector: 'app-emergency',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule
  ],
  template: `
    <div class="dp-page emergency-page">
      <!-- Hero Section -->
      <div class="dp-hero-section text-center emergency-hero">
        <div class="dp-icon-circle lg emergency-pulse mx-auto mb-4">
          <mat-icon>emergency</mat-icon>
        </div>
        <h1 class="display-4 text-danger fw-bold mb-3">Aide d'urgence</h1>
        <p class="lead text-muted mx-auto" style="max-width: 600px;">
          Si vous êtes en crise ou avez des pensées suicidaires, 
          des ressources d'aide sont disponibles immédiatement.
        </p>
      </div>

      <div class="container py-4">
        <!-- Crisis Advice -->
        <div class="dp-glass-card dp-hover-lift mb-5">
          <div class="d-flex align-items-center mb-4">
            <div class="dp-icon-circle bg-surface-variant text-primary me-3">
              <mat-icon>security</mat-icon>
            </div>
            <h2 class="h4 mb-0">Conseils immédiats</h2>
          </div>
          <mat-list>
            <mat-list-item *ngFor="let advice of crisisAdvice">
              <mat-icon matListItemIcon class="text-primary">check_circle</mat-icon>
              <div matListItemTitle class="fs-6 text-wrap lh-base py-2">{{ advice }}</div>
            </mat-list-item>
          </mat-list>
        </div>

        <!-- Emergency Numbers -->
        <div class="mb-5">
          <h2 class="h3 mb-4 d-flex align-items-center">
            <span class="dp-eyebrow text-danger me-3">Urgence</span>
            Numéros d'urgence
          </h2>
          
          <div class="row g-4">
            <div class="col-md-6 col-lg-6" *ngFor="let resource of emergencyNumbers">
              <div class="dp-glass-card dp-hover-lift h-100 d-flex flex-column emergency-number-card">
                <div class="d-flex justify-content-between align-items-start mb-3">
                  <div class="d-flex align-items-center">
                    <div class="dp-icon-circle emergency-danger-icon me-3">
                      <mat-icon>phone_in_talk</mat-icon>
                    </div>
                    <div>
                      <h3 class="h5 mb-1">{{ resource.name }}</h3>
                      <span class="badge bg-success-subtle text-success d-inline-flex align-items-center" *ngIf="resource.available24_7">
                        <mat-icon class="fs-6 me-1" style="width:16px;height:16px;line-height:16px;">schedule</mat-icon>
                        24h/24 - 7j/7
                      </span>
                    </div>
                  </div>
                </div>
                
                <div class="flex-grow-1">
                  <a [href]="'tel:' + resource.phoneNumber" class="emergency-number text-danger text-decoration-none fw-bold mb-3 d-inline-flex align-items-center emergency-call-link">
                    <mat-icon class="me-2">phone</mat-icon>
                    {{ resource.phoneNumber }}
                  </a>
                  <p class="text-muted">{{ resource.description }}</p>
                  
                  <div class="d-flex align-items-center text-muted small mt-2" *ngIf="resource.languages.length > 0">
                    <mat-icon class="fs-6 me-1" style="width:16px;height:16px;line-height:16px;">language</mat-icon>
                    <span>{{ resource.languages.join(', ') }}</span>
                  </div>
                </div>
                
                <div class="mt-4 pt-4 border-top">
                  <a mat-flat-button color="warn" [href]="'tel:' + resource.phoneNumber" class="w-100 py-3 rounded-pill emergency-call-btn shadow-sm">
                    <mat-icon>phone</mat-icon>
                    Appeler maintenant
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Chat Resources -->
        <div class="mb-5" *ngIf="chatResources.length > 0">
          <h2 class="h3 mb-4 d-flex align-items-center">
            <span class="dp-eyebrow text-primary me-3">En ligne</span>
            Aide par chat / message
          </h2>
          
          <div class="row g-4">
            <div class="col-md-6" *ngFor="let resource of chatResources">
              <div class="dp-glass-card dp-hover-lift dp-glow-border-primary h-100 d-flex flex-column">
                <div class="d-flex align-items-center mb-3">
                  <div class="dp-icon-circle bg-primary-subtle text-primary me-3">
                    <mat-icon>chat</mat-icon>
                  </div>
                  <h3 class="h5 mb-0">{{ resource.name }}</h3>
                </div>
                <div class="flex-grow-1">
                  <p class="text-muted">{{ resource.description }}</p>
                </div>
                <div class="mt-3" *ngIf="resource.website">
                  <a [href]="resource.website" target="_blank" rel="noopener" mat-stroked-button color="primary" class="rounded-pill w-100">
                    <mat-icon>open_in_new</mat-icon>
                    Accéder au service
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Professional Help CTA -->
        <div class="dp-glass-card bg-primary-subtle border-0 mb-5 text-center p-5 dp-hover-lift">
          <div class="dp-icon-circle lg bg-white text-primary mx-auto mb-4 shadow-sm">
            <mat-icon>medical_services</mat-icon>
          </div>
          <h3 class="h2 mb-3 fw-bold">Vous n'êtes pas seul(e)</h3>
          <p class="lead text-muted mb-4">Des professionnels sont disponibles pour vous accompagner.</p>
          <a mat-flat-button color="primary" routerLink="/directory" class="px-5 py-3 rounded-pill fs-5 shadow">
            Trouver un professionnel
          </a>
        </div>

        <!-- Return Button -->
        <div class="text-center">
          <a mat-button routerLink="/" class="text-muted">
            <mat-icon class="me-2">arrow_back</mat-icon>
            Retour à l'accueil
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .emergency-page {
      padding-bottom: 4rem;
    }

    .emergency-hero {
      padding: 4rem 1.5rem;
      background: linear-gradient(135deg, rgba(220, 53, 69, 0.06) 0%, rgba(220, 53, 69, 0.03) 100%);
      border-bottom: 1px solid rgba(220, 53, 69, 0.1);
      margin-bottom: 3rem;
    }

    /* Pulsing emergency icon */
    .emergency-pulse {
      background: linear-gradient(135deg, rgba(220, 53, 69, 0.12), rgba(220, 53, 69, 0.08));
      color: #dc3545;
      border: 2px solid rgba(220, 53, 69, 0.25);
      animation: dp-heartbeat 1.2s infinite;
    }

    /* Emergency number cards with glowing borders */
    .emergency-number-card {
      border: 2px solid rgba(220, 53, 69, 0.15);
      position: relative;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .emergency-number-card:hover {
      border-color: rgba(220, 53, 69, 0.35);
      box-shadow: 0 0 24px rgba(220, 53, 69, 0.15), inset 0 0 0 1px rgba(255, 255, 255, 0.6) !important;
    }

    .emergency-danger-icon {
      background: linear-gradient(135deg, rgba(220, 53, 69, 0.18), rgba(220, 53, 69, 0.08));
      color: #dc3545;
      border: 1px solid rgba(220, 53, 69, 0.25);
    }

    /* Call link styling */
    .emergency-call-link {
      transition: all 0.2s ease;
      padding: 0.5rem 0;
    }

    .emergency-call-link:hover {
      color: #c82333;
      transform: translateX(4px);
    }

    /* Call button with enhanced styling */
    .emergency-call-btn {
      background: linear-gradient(135deg, #dc3545, #c82333) !important;
      box-shadow: 0 8px 24px rgba(220, 53, 69, 0.3) !important;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
      font-weight: 700;
    }

    .emergency-call-btn:hover {
      transform: translateY(-2px) !important;
      box-shadow: 0 12px 32px rgba(220, 53, 69, 0.4) !important;
    }

    mat-list-item {
      margin-bottom: 0.5rem;
    }
    
    .emergency-number {
      font-size: 2.5rem;
      line-height: 1.2;
    }
    
    .emergency-number mat-icon {
      font-size: 2.5rem;
      width: 2.5rem;
      height: 2.5rem;
      line-height: 2.5rem;
    }

    .bg-danger-subtle {
      background-color: rgba(220, 53, 69, 0.1);
    }
    
    .border-danger-subtle {
      border-color: rgba(220, 53, 69, 0.2) !important;
    }

    .bg-primary-subtle {
      background-color: rgba(13, 110, 253, 0.1);
    }

    .bg-success-subtle {
      background-color: rgba(25, 135, 84, 0.1);
    }

    .bg-surface-variant {
      background-color: var(--dp-surface);
      border: 1px solid var(--dp-border);
    }

    @media (max-width: 768px) {
      .emergency-number {
        font-size: 2rem;
      }
      .emergency-number mat-icon {
        font-size: 2rem;
        width: 2rem;
        height: 2rem;
        line-height: 2rem;
      }
      .emergency-hero {
        padding: 3rem 1rem;
      }
    }
  `]
})
export class EmergencyComponent {
  emergencyNumbers: EmergencyResource[] = [];
  chatResources: EmergencyResource[] = [];
  crisisAdvice: string[] = [];

  constructor(private emergencyService: EmergencyService) {
    this.loadEmergencyResources();
    this.loadCrisisAdvice();
  }

  private loadEmergencyResources(): void {
    this.emergencyService.getEmergencyResources('France').subscribe(resources => {
      this.emergencyNumbers = resources.filter(r => r.type === 'hotline' || r.type === 'sms');
      this.chatResources = resources.filter(r => r.type === 'chat');
    });
  }

  private loadCrisisAdvice(): void {
    this.emergencyService.getCrisisAdvice().subscribe(advice => {
      this.crisisAdvice = advice;
    });
  }
}
