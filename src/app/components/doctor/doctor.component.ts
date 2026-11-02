import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { AuthService } from '../../services/auth.service';
import { DirectoryService } from '../../services/directory.service';
import { Professional, SharedAssessment, SupportRequest, User } from '../../models/index';

@Component({
  selector: 'app-doctor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSnackBarModule,
    MatTabsModule
  ],
  template: `
    <div class="container-xl py-4 py-lg-5 doctor-page" *ngIf="user as currentUser; else noAccess">
      <!-- Premium Hero Card -->
      <section class="dp-glass-card p-4 p-lg-5 mb-5 doctor-hero-card">
        <div class="row align-items-center g-4">
          <div class="col-lg-7">
            <span class="dp-eyebrow mb-3 animate-fade-in">
              <mat-icon class="align-middle me-1">health_and_safety</mat-icon> Espace Médecin
            </span>
            <h1 class="display-5 fw-bold mb-3 header-gradient animate-slide-up">Tableau de Bord Professionnel</h1>
            <p class="text-dp-muted mb-0 lead-text animate-slide-up">
              Gérez votre profil public de clinicien, suivez les demandes d'accompagnement de vos patients et visualisez les bilans partagés en toute sécurité.
            </p>
          </div>

          <div class="col-lg-5">
            <div class="stats-premium-grid">
              <div class="stat-premium-card card-glow-primary">
                <div class="stat-icon-wrapper">
                  <mat-icon>mail_outline</mat-icon>
                </div>
                <div class="stat-content">
                  <strong>{{ requests.length }}</strong>
                  <span>Demandes</span>
                </div>
              </div>

              <div class="stat-premium-card card-glow-accent">
                <div class="stat-icon-wrapper">
                  <mat-icon>assignment_turned_in</mat-icon>
                </div>
                <div class="stat-content">
                  <strong>{{ sharedAssessments.length }}</strong>
                  <span>Bilans</span>
                </div>
              </div>

              <div class="stat-premium-card card-glow-success">
                <div class="stat-icon-wrapper">
                  <mat-icon>{{ professional?.acceptsNewPatients ? 'check_circle_outline' : 'highlight_off' }}</mat-icon>
                </div>
                <div class="stat-content">
                  <strong>{{ professional?.acceptsNewPatients ? 'Oui' : 'Non' }}</strong>
                  <span>Nouveaux Patients</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Custom Designed Premium Tab Bar -->
      <div class="dp-tabs-container mb-5">
        <button class="dp-tab-pill" [class.active]="selectedTabIndex === 0" (click)="selectedTabIndex = 0">
          <mat-icon class="align-middle me-2">account_box</mat-icon>
          <span>Profil professionnel</span>
        </button>
        <button class="dp-tab-pill" [class.active]="selectedTabIndex === 1" (click)="selectedTabIndex = 1">
          <mat-icon class="align-middle me-2">mail</mat-icon>
          <span>Demandes utilisateurs</span>
          <span class="badge-count ms-2" *ngIf="requests.length > 0">{{ requests.length }}</span>
        </button>
        <button class="dp-tab-pill" [class.active]="selectedTabIndex === 2" (click)="selectedTabIndex = 2">
          <mat-icon class="align-middle me-2">folder_shared</mat-icon>
          <span>Bilans partagés</span>
          <span class="badge-count ms-2" *ngIf="sharedAssessments.length > 0">{{ sharedAssessments.length }}</span>
        </button>
      </div>

      <div *ngIf="professional" class="tab-viewport">
        <!-- Tab 0: Professional Profile -->
        <div class="tab-content-fade" *ngIf="selectedTabIndex === 0">
          <div class="row g-4">
            <!-- General Info Card -->
            <div class="col-lg-8">
              <div class="dp-glass-card p-4 p-lg-5 h-100">
                <div class="d-flex align-items-center gap-3 mb-4">
                  <div class="step-badge">1</div>
                  <h2 class="h4 mb-0">Informations Générales</h2>
                </div>

                <div class="row g-4">
                  <div class="col-md-6">
                    <div class="dp-input-group">
                      <label class="dp-input-label">Prénom</label>
                      <div class="dp-input-wrapper">
                        <mat-icon class="dp-input-icon">person</mat-icon>
                        <input type="text" class="dp-input-control" [(ngModel)]="form.firstName" placeholder="Ex: Jean" />
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="dp-input-group">
                      <label class="dp-input-label">Nom de famille</label>
                      <div class="dp-input-wrapper">
                        <mat-icon class="dp-input-icon">person</mat-icon>
                        <input type="text" class="dp-input-control" [(ngModel)]="form.lastName" placeholder="Ex: Martin" />
                      </div>
                    </div>
                  </div>
                  <div class="col-12">
                    <div class="dp-input-group">
                      <label class="dp-input-label">Spécialités cliniques</label>
                      <div class="dp-input-wrapper">
                        <mat-icon class="dp-input-icon">psychology</mat-icon>
                        <input type="text" class="dp-input-control" [(ngModel)]="form.specialties" placeholder="Dépression, Burn-out, TCC, Anxiété..." />
                      </div>
                      <div class="dp-tags-preview mt-2" *ngIf="form.specialties">
                        <span class="badge dp-tag-badge bg-primary-soft me-2 mb-2" *ngFor="let spec of splitCsv(form.specialties)">
                          {{ spec }}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="dp-input-group">
                      <label class="dp-input-label">Langues parlées</label>
                      <div class="dp-input-wrapper">
                        <mat-icon class="dp-input-icon">translate</mat-icon>
                        <input type="text" class="dp-input-control" [(ngModel)]="form.languages" placeholder="Français, Anglais, Arabe..." />
                      </div>
                      <div class="dp-tags-preview mt-2" *ngIf="form.languages">
                        <span class="badge dp-tag-badge bg-accent-soft me-2 mb-2" *ngFor="let lang of splitCsv(form.languages)">
                          {{ lang }}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="dp-input-group">
                      <label class="dp-input-label">Ville d'exercice</label>
                      <div class="dp-input-wrapper">
                        <mat-icon class="dp-input-icon">location_on</mat-icon>
                        <input type="text" class="dp-input-control" [(ngModel)]="form.city" placeholder="Ex: Tunis, Paris..." />
                      </div>
                    </div>
                  </div>
                </div>

                <div class="d-flex align-items-center gap-3 mt-5 mb-4">
                  <div class="step-badge">2</div>
                  <h2 class="h4 mb-0">Présentation Clinique</h2>
                </div>

                <div class="dp-input-group mb-0">
                  <label class="dp-input-label">Biographie et approche thérapeutique</label>
                  <div class="dp-input-wrapper">
                    <mat-icon class="dp-input-icon" style="top: 1.5rem; transform: none;">edit_note</mat-icon>
                    <textarea class="dp-input-control pt-3" style="padding-left: 3.2rem;" rows="6" [(ngModel)]="form.bio" placeholder="Présentez brièvement votre parcours, vos méthodes cliniques de soin, etc..."></textarea>
                  </div>
                </div>
              </div>
            </div>

            <!-- Practical Info Sidebar -->
            <div class="col-lg-4">
              <div class="dp-glass-card p-4 p-lg-5 h-100 d-flex flex-column justify-content-between">
                <div>
                  <div class="d-flex align-items-center gap-3 mb-4">
                    <div class="step-badge">3</div>
                    <h2 class="h4 mb-0">Paramètres Pratiques</h2>
                  </div>

                  <div class="row g-3">
                    <div class="col-12">
                      <div class="dp-input-group">
                        <label class="dp-input-label">Tarif consultation (TND / EUR)</label>
                        <div class="dp-input-wrapper">
                          <mat-icon class="dp-input-icon">payments</mat-icon>
                          <input type="number" class="dp-input-control" [(ngModel)]="form.consultationPrice" />
                        </div>
                      </div>
                    </div>
                    <div class="col-12">
                      <div class="dp-input-group">
                        <label class="dp-input-label">Horaires de disponibilité</label>
                        <div class="dp-input-wrapper">
                          <mat-icon class="dp-input-icon">schedule</mat-icon>
                          <input type="text" class="dp-input-control" [(ngModel)]="form.schedule" placeholder="Ex: Lun-Ven 09:00-18:00" />
                        </div>
                      </div>
                    </div>
                    <div class="col-12">
                      <div class="dp-input-group">
                        <label class="dp-input-label">Téléphone de contact</label>
                        <div class="dp-input-wrapper">
                          <mat-icon class="dp-input-icon">phone</mat-icon>
                          <input type="text" class="dp-input-control" [(ngModel)]="form.phone" placeholder="Ex: +33 1 43 59 00 00" />
                        </div>
                      </div>
                    </div>
                    <div class="col-12">
                      <div class="dp-input-group">
                        <label class="dp-input-label">Lien de réservation en ligne</label>
                        <div class="dp-input-wrapper">
                          <mat-icon class="dp-input-icon">link</mat-icon>
                          <input type="text" class="dp-input-control" [(ngModel)]="form.bookingUrl" placeholder="https://calendly.com/..." />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="action-stack mt-5 pt-4 border-top">
                  <button type="button" class="btn btn-primary btn-lg w-100 rounded-pill shadow-sm mb-3" (click)="saveProfessionalProfile()">
                    <span class="d-flex align-items-center justify-content-center gap-2">
                      <mat-icon>save</mat-icon> Enregistrer le profil
                    </span>
                  </button>
                  <a routerLink="/directory" class="btn btn-outline-primary w-100 rounded-pill">
                    <span class="d-flex align-items-center justify-content-center gap-2">
                      <mat-icon>visibility</mat-icon> Aperçu public
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab 1: User Requests -->
        <div class="tab-content-fade" *ngIf="selectedTabIndex === 1">
          <div class="empty-state-premium py-5 text-center" *ngIf="requests.length === 0">
            <div class="empty-icon-shell mb-3">
              <mat-icon>inbox</mat-icon>
            </div>
            <h3 class="h4">Aucune demande reçue</h3>
            <p class="text-dp-muted mb-0">Dès qu'un patient formulera une demande d'aide ou de consultation, elle apparaîtra ici.</p>
          </div>

          <div class="request-premium-list" *ngIf="requests.length > 0">
            <div class="row g-4">
              <div class="col-xl-6" *ngFor="let request of requests">
                <article class="dp-glass-card p-4 h-100 d-flex flex-column justify-content-between request-premium-card" [class.border-high-urgency]="request.urgency === 'high'">
                  <div>
                    <div class="request-header-premium mb-3">
                      <div class="d-flex align-items-center gap-3">
                        <div class="patient-avatar">
                          {{ request.userName.substring(0, 2).toUpperCase() }}
                        </div>
                        <div>
                          <h3 class="h5 mb-0 font-manrope fw-bold text-dp-primary-dark">{{ request.userName }}</h3>
                          <span class="text-dp-muted small">{{ request.userEmail }}</span>
                        </div>
                      </div>

                      <div class="request-badges d-flex gap-2">
                        <span class="badge-custom badge-type">
                          {{ request.type === 'appointment' ? 'Rdv Proposé' : 'Message' }}
                        </span>
                        <span class="badge-custom" [class.badge-danger]="request.urgency === 'high'" [class.badge-warning]="request.urgency === 'medium'" [class.badge-info]="request.urgency === 'low'">
                          Priorité : {{ request.urgency }}
                        </span>
                      </div>
                    </div>

                    <div class="patient-message-shell p-3 mb-4">
                      <p class="mb-0 text-dp-text italic-quote">" {{ request.message }} "</p>
                    </div>

                    <!-- Doctor's Response text area -->
                    <div class="dp-input-group mt-3">
                      <label class="dp-input-label">Rédiger votre réponse au patient</label>
                      <div class="dp-input-wrapper">
                        <mat-icon class="dp-input-icon" style="top: 1.5rem; transform: none;">reply</mat-icon>
                        <textarea class="dp-input-control pt-3" style="padding-left: 3.2rem;" rows="3" [(ngModel)]="doctorReplies[request.id]" placeholder="Saisissez vos conseils ou proposition d'horaire..."></textarea>
                      </div>
                    </div>
                  </div>

                  <div class="request-footer mt-4 pt-3 border-top">
                    <div class="request-actions-row d-flex flex-wrap gap-2">
                      <button
                        type="button"
                        class="btn btn-outline-primary btn-sm rounded-pill px-3"
                        (click)="updateRequestStatus(request.id, 'accepted')"
                        [disabled]="request.status === 'accepted' || request.status === 'scheduled'"
                      >
                        <span class="d-flex align-items-center gap-1"><mat-icon style="font-size: 1.15rem; width: 1.15rem; height: 1.15rem;">check</mat-icon> Accepter & Répondre</span>
                      </button>
                      <button
                        type="button"
                        class="btn btn-primary btn-sm rounded-pill px-3"
                        (click)="updateRequestStatus(request.id, 'scheduled')"
                        [disabled]="request.status === 'scheduled'"
                      >
                        <span class="d-flex align-items-center gap-1"><mat-icon style="font-size: 1.15rem; width: 1.15rem; height: 1.15rem;">event</mat-icon> Planifier RDV</span>
                      </button>
                      <button
                        type="button"
                        class="btn btn-outline-secondary btn-sm rounded-pill px-3"
                        (click)="updateRequestStatus(request.id, 'closed')"
                        [disabled]="request.status === 'closed'"
                      >
                        <span class="d-flex align-items-center gap-1"><mat-icon style="font-size: 1.15rem; width: 1.15rem; height: 1.15rem;">close</mat-icon> Fermer</span>
                      </button>
                    </div>
                    <div class="d-flex justify-content-between align-items-center mt-3 text-dp-muted small">
                      <span>Canal favori : <strong class="text-primary">{{ request.preferredContact }}</strong></span>
                      <span>Reçu le : {{ request.createdAt | date:'short' }}</span>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab 2: Shared Assessments -->
        <div class="tab-content-fade" *ngIf="selectedTabIndex === 2">
          <div class="empty-state-premium py-5 text-center" *ngIf="sharedAssessments.length === 0">
            <div class="empty-icon-shell mb-3">
              <mat-icon>folder_open</mat-icon>
            </div>
            <h3 class="h4">Aucun bilan partagé</h3>
            <p class="text-dp-muted mb-0">Les patients peuvent choisir de partager leurs scores de tests ou résumés XGBoost pour préparer une consultation.</p>
          </div>

          <div class="shared-premium-list" *ngIf="sharedAssessments.length > 0">
            <div class="row g-4">
              <div class="col-md-6 col-lg-4" *ngFor="let shared of sharedAssessments">
                <article class="dp-glass-card p-4 shared-premium-card h-100 d-flex flex-column justify-content-between" [class.border-urgent]="shared.urgentSupportNeeded">
                  <div>
                    <div class="shared-top d-flex align-items-center gap-3 mb-4">
                      <div class="shared-avatar-wrapper">
                        <div class="shared-avatar">
                          <mat-icon>assignment_ind</mat-icon>
                        </div>
                      </div>
                      <div class="text-start">
                        <h3 class="h5 mb-0 fw-bold font-manrope text-dp-primary-dark">{{ shared.userName }}</h3>
                        <span class="text-dp-muted small">{{ shared.createdAt | date:'medium' }}</span>
                      </div>
                    </div>

                    <div class="score-summary-shell p-4 mb-3 text-center d-flex flex-column align-items-center justify-content-center">
                      <div class="score-circle-mini mb-3" [class.score-high]="shared.score >= 15" [class.score-medium]="shared.score >= 10 && shared.score < 15" [class.score-low]="shared.score < 10">
                        <strong>{{ shared.score }}</strong>
                        <small>/ 27</small>
                      </div>
                      <span class="badge-custom px-3 py-1.5" [class.badge-danger]="shared.urgentSupportNeeded" [class.badge-info]="!shared.urgentSupportNeeded">
                        {{ shared.severityLabel }}
                      </span>
                    </div>
                  </div>

                  <div class="alert alert-danger-custom d-flex gap-2 align-items-center mt-3 mb-0 text-start" *ngIf="shared.urgentSupportNeeded">
                    <mat-icon class="pulsating-red-icon">error_outline</mat-icon>
                    <span>Priorité d'accompagnement urgente détectée.</span>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- No Access Template -->
    <ng-template #noAccess>
      <div class="container-xl py-5 text-center">
        <div class="dp-glass-card max-width-auth mx-auto p-4 p-lg-5 animate-slide-up">
          <div class="lock-icon-shell mb-4 mx-auto">
            <mat-icon>lock</mat-icon>
          </div>
          <h2 class="h3 fw-bold mb-3 text-dp-primary-dark">Accès réservé aux professionnels</h2>
          <p class="text-dp-muted mb-4">
            Ce tableau de bord requiert des privilèges de clinicien. Veuillez vous connecter avec votre compte professionnel habilité.
          </p>
          <a routerLink="/login" class="btn btn-primary btn-lg rounded-pill px-5 shadow-sm">
            Se connecter
          </a>
        </div>
      </div>
    </ng-template>
  `,
  styles: [`
    /* Doctor Dashboard Header Customizations */
    .doctor-hero-card {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.88) 0%, rgba(240, 246, 255, 0.8) 100%) !important;
      border: 1px solid rgba(255, 255, 255, 0.65) !important;
      box-shadow: var(--dp-shadow-premium) !important;
      border-radius: 2rem !important;
    }

    .header-gradient {
      background: linear-gradient(135deg, hsl(218, 55%, 18%) 0%, hsl(215, 88%, 52%) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .lead-text {
      font-size: 1.05rem;
      line-height: 1.6;
    }

    /* Stats Section Grid */
    .stats-premium-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
      gap: 1.25rem;
    }

    .stat-premium-card {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1.25rem;
      border-radius: 1.75rem;
      background: rgba(255, 255, 255, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.65);
      box-shadow: 0 8px 30px rgba(17, 79, 186, 0.04);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .stat-premium-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 35px rgba(17, 79, 186, 0.08);
    }

    .card-glow-primary {
      border-left: 4px solid var(--dp-primary);
    }

    .card-glow-accent {
      border-left: 4px solid var(--dp-accent);
    }

    .card-glow-success {
      border-left: 4px solid #1c8f57;
    }

    .stat-icon-wrapper {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 2.75rem;
      height: 2.75rem;
      border-radius: 50%;
      background: rgba(31, 120, 255, 0.08);
      color: var(--dp-primary);
    }

    .card-glow-accent .stat-icon-wrapper {
      background: rgba(27, 151, 143, 0.08);
      color: var(--dp-accent);
    }

    .card-glow-success .stat-icon-wrapper {
      background: rgba(28, 143, 87, 0.08);
      color: #1c8f57;
    }

    .stat-content {
      display: flex;
      flex-direction: column;
    }

    .stat-content strong {
      font-size: 1.45rem;
      font-family: 'Manrope', sans-serif;
      line-height: 1.2;
      color: var(--dp-primary-dark);
      font-weight: 800;
    }

    .stat-content span {
      font-size: 0.72rem;
      color: var(--dp-muted);
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    /* Custom Modern Tab System */
    .dp-tabs-container {
      display: flex;
      background: rgba(255, 255, 255, 0.55);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.5);
      border-radius: 999px;
      padding: 0.4rem;
      box-shadow: 0 8px 32px rgba(17, 79, 186, 0.03);
      gap: 0.35rem;
      max-width: fit-content;
    }

    @media (max-width: 767.98px) {
      .dp-tabs-container {
        flex-direction: column;
        border-radius: 2rem;
        max-width: 100%;
        padding: 0.6rem;
      }
    }

    .dp-tab-pill {
      border: none;
      outline: none;
      background: transparent;
      padding: 0.75rem 1.75rem;
      border-radius: 999px;
      color: var(--dp-muted);
      font-weight: 700;
      font-size: 0.95rem;
      font-family: 'Manrope', sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .dp-tab-pill:hover {
      color: var(--dp-primary-dark);
      background: rgba(31, 120, 255, 0.05);
    }

    .dp-tab-pill.active {
      color: white;
      background: linear-gradient(135deg, var(--dp-primary) 0%, #0d6efd 100%);
      box-shadow: 0 8px 20px rgba(31, 120, 255, 0.25);
    }

    .badge-count {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: var(--dp-danger);
      color: white;
      font-size: 0.75rem;
      font-weight: 800;
      height: 1.25rem;
      min-width: 1.25rem;
      padding: 0 0.35rem;
      border-radius: 999px;
      box-shadow: 0 2px 6px rgba(220, 53, 69, 0.3);
    }

    /* Custom Modern Inputs */
    .dp-input-group {
      position: relative;
      margin-bottom: 1.25rem;
    }

    .dp-input-label {
      display: block;
      font-size: 0.8rem;
      font-weight: 800;
      color: var(--dp-primary-dark);
      margin-bottom: 0.45rem;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }

    .dp-input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .dp-input-icon {
      position: absolute;
      left: 1.2rem;
      color: var(--dp-primary);
      opacity: 0.8;
      font-size: 1.35rem;
      width: 1.35rem;
      height: 1.35rem;
      pointer-events: none;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .dp-input-control {
      width: 100%;
      background: rgba(255, 255, 255, 0.6);
      border: 2px solid rgba(31, 120, 255, 0.08);
      border-radius: 1.25rem;
      padding: 0.85rem 1.2rem 0.85rem 3.2rem; /* space for icon */
      font-family: 'Source Sans 3', sans-serif;
      font-size: 1rem;
      color: var(--dp-text);
      font-weight: 600;
      backdrop-filter: blur(8px);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .dp-input-control::placeholder {
      color: var(--dp-muted);
      opacity: 0.6;
    }

    .dp-input-control:hover {
      border-color: rgba(31, 120, 255, 0.18);
      background: rgba(255, 255, 255, 0.85);
    }

    .dp-input-control:focus {
      outline: none;
      background: #ffffff;
      border-color: var(--dp-primary);
      box-shadow: 0 0 0 4px rgba(31, 120, 255, 0.12);
    }

    textarea.dp-input-control {
      padding-top: 1rem;
    }

    /* Tags Preview */
    .dp-tag-badge {
      font-size: 0.82rem;
      padding: 0.45rem 0.85rem;
      border-radius: 0.75rem;
      font-weight: 700;
      letter-spacing: -0.01em;
    }

    .bg-primary-soft {
      background: rgba(31, 120, 255, 0.08) !important;
      color: var(--dp-primary) !important;
      border: 1px solid rgba(31, 120, 255, 0.15);
    }

    .bg-accent-soft {
      background: rgba(27, 151, 143, 0.08) !important;
      color: var(--dp-accent) !important;
      border: 1px solid rgba(27, 151, 143, 0.15);
    }

    /* Step Badges */
    .step-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 2.25rem;
      height: 2.25rem;
      border-radius: 50%;
      background: linear-gradient(135deg, rgba(31, 120, 255, 0.15) 0%, rgba(31, 120, 255, 0.05) 100%);
      color: var(--dp-primary);
      font-weight: 800;
      font-size: 1rem;
      border: 1px solid rgba(31, 120, 255, 0.2);
    }

    /* Empty states */
    .empty-state-premium {
      padding: 5rem 2rem;
      background: rgba(255, 255, 255, 0.45);
      border-radius: 2rem;
      border: 2px dashed rgba(31, 120, 255, 0.12);
      backdrop-filter: blur(10px);
    }

    .empty-icon-shell {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 5rem;
      height: 5rem;
      border-radius: 2rem;
      background: rgba(31, 120, 255, 0.06);
      color: var(--dp-primary);
      box-shadow: 0 8px 24px rgba(31, 120, 255, 0.05);
    }

    .empty-icon-shell mat-icon {
      font-size: 2.5rem;
      width: 2.5rem;
      height: 2.5rem;
    }

    /* Patient request cards */
    .request-premium-card {
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      border-radius: 2rem !important;
    }

    .border-high-urgency {
      border: 1px solid rgba(220, 53, 69, 0.25) !important;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.85) 0%, rgba(255, 240, 240, 0.8) 100%) !important;
      box-shadow: 0 16px 40px rgba(220, 53, 69, 0.06) !important;
    }

    .patient-avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 3.25rem;
      height: 3.25rem;
      border-radius: 1.15rem;
      background: linear-gradient(135deg, var(--dp-primary) 0%, #3a7bd5 100%);
      color: white;
      font-weight: 800;
      font-size: 1.15rem;
      font-family: 'Manrope', sans-serif;
      box-shadow: 0 4px 12px rgba(31, 120, 255, 0.15);
    }

    .request-header-premium {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .badge-custom {
      display: inline-block;
      padding: 0.4rem 0.95rem;
      border-radius: 999px;
      font-size: 0.72rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      box-shadow: 0 2px 8px rgba(17, 79, 186, 0.03);
    }

    .badge-type {
      background: rgba(31, 120, 255, 0.08);
      color: var(--dp-primary);
      border: 1px solid rgba(31, 120, 255, 0.15);
    }

    .badge-danger {
      background: rgba(220, 53, 69, 0.08);
      color: var(--dp-danger);
      border: 1px solid rgba(220, 53, 69, 0.15);
    }

    .badge-warning {
      background: rgba(253, 126, 20, 0.08);
      color: var(--dp-warning);
      border: 1px solid rgba(253, 126, 20, 0.15);
    }

    .badge-info {
      background: rgba(27, 151, 143, 0.08);
      color: var(--dp-accent);
      border: 1px solid rgba(27, 151, 143, 0.15);
    }

    .patient-message-shell {
      background: rgba(255, 255, 255, 0.65);
      border-radius: 1.5rem;
      border-left: 4px solid var(--dp-primary);
      box-shadow: inset 0 2px 6px rgba(17, 79, 186, 0.02);
    }

    .italic-quote {
      font-style: italic;
      color: var(--dp-primary-dark);
      font-weight: 550;
      line-height: 1.5;
    }

    /* Shared files and dossiers */
    .shared-premium-card {
      transition: all 0.3s ease;
      border-radius: 2rem !important;
    }

    .shared-avatar-wrapper {
      position: relative;
    }

    .shared-avatar {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
      background: rgba(31, 120, 255, 0.08);
      color: var(--dp-primary);
      border: 1px solid rgba(31, 120, 255, 0.15);
    }

    .border-urgent {
      border: 1px solid rgba(220, 53, 69, 0.3) !important;
      box-shadow: 0 16px 40px rgba(220, 53, 69, 0.08), inset 0 0 0 1px rgba(255, 255, 255, 0.6) !important;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.85) 0%, rgba(255, 242, 242, 0.8) 100%) !important;
    }

    .score-summary-shell {
      background: rgba(255, 255, 255, 0.55);
      border-radius: 1.75rem;
      border: 1px solid rgba(31, 120, 255, 0.04);
      box-shadow: inset 0 2px 8px rgba(17, 79, 186, 0.01);
    }

    .score-circle-mini {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 4.5rem;
      height: 4.5rem;
      border-radius: 50%;
      background: white;
      border: 3.5px solid rgba(31, 120, 255, 0.15);
      box-shadow: 0 6px 16px rgba(17, 79, 186, 0.06);
    }

    .score-circle-mini strong {
      font-size: 1.5rem;
      color: var(--dp-primary-dark);
      font-family: 'Manrope', sans-serif;
      line-height: 1;
      font-weight: 800;
    }

    .score-circle-mini small {
      font-size: 0.68rem;
      color: var(--dp-muted);
      font-weight: 800;
    }

    .score-high {
      border-color: rgba(220, 53, 69, 0.3) !important;
      box-shadow: 0 6px 16px rgba(220, 53, 69, 0.1);
    }
    .score-medium {
      border-color: rgba(253, 126, 20, 0.3) !important;
      box-shadow: 0 6px 16px rgba(253, 126, 20, 0.1);
    }
    .score-low {
      border-color: rgba(27, 151, 143, 0.3) !important;
      box-shadow: 0 6px 16px rgba(27, 151, 143, 0.1);
    }

    .alert-danger-custom {
      background: rgba(220, 53, 69, 0.08);
      border: 1px solid rgba(220, 53, 69, 0.15);
      border-radius: 1.25rem;
      padding: 0.85rem 1.25rem;
      color: var(--dp-danger);
      font-size: 0.85rem;
      font-weight: 800;
    }

    .pulsating-red-icon {
      animation: pulsate-red 1.5s infinite alternate;
    }

    @keyframes pulsate-red {
      0% { transform: scale(1); opacity: 0.8; }
      100% { transform: scale(1.15); opacity: 1; }
    }

    /* Auth lock icons */
    .lock-icon-shell {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 5.5rem;
      height: 5.5rem;
      border-radius: 2rem;
      background: rgba(220, 53, 69, 0.08);
      color: var(--dp-danger);
      border: 1px solid rgba(220, 53, 69, 0.15);
    }

    .lock-icon-shell mat-icon {
      font-size: 2.75rem;
      width: 2.75rem;
      height: 2.75rem;
    }

    .max-width-auth {
      max-width: 520px;
    }

    /* Tab content animations and general fades */
    .tab-content-fade {
      animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .animate-fade-in {
      animation: fadeIn 0.5s ease-out;
    }

    .animate-slide-up {
      animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideUp {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 991.98px) {
      .request-header-premium {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  `]
})
export class DoctorComponent implements OnInit {
  user: User | null = null;
  professional: Professional | null = null;
  requests: SupportRequest[] = [];
  sharedAssessments: SharedAssessment[] = [];
  selectedTabIndex = 0;

  form = {
    firstName: '',
    lastName: '',
    specialties: '',
    languages: '',
    city: '',
    consultationPrice: 0,
    phone: '',
    bookingUrl: '',
    bio: '',
    schedule: ''
  };
  doctorReplies: Record<string, string> = {};

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private directoryService: DirectoryService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.selectedTabIndex = Number(params.get('tab') || 0);
    });

    this.user = this.authService.getCurrentUser();
    if (!this.user) {
      return;
    }

    this.directoryService.getProfessionalForUser(this.user).subscribe(professional => {
      this.professional = professional;
      if (professional) {
        this.hydrateForm(professional);
        this.loadDoctorData(professional.id);
      }
    });
  }

  saveProfessionalProfile(): void {
    if (!this.professional) {
      return;
    }

    this.directoryService.updateProfessionalProfile(this.professional.id, {
      firstName: this.form.firstName,
      lastName: this.form.lastName,
      specialties: this.splitCsv(this.form.specialties),
      languages: this.splitCsv(this.form.languages),
      bio: this.form.bio,
      location: {
        ...this.professional.location,
        city: this.form.city
      },
      contact: {
        ...this.professional.contact,
        phone: this.form.phone,
        bookingUrl: this.form.bookingUrl
      },
      pricing: {
        ...(this.professional.pricing || { consultation: this.form.consultationPrice, currency: 'EUR' }),
        consultation: Number(this.form.consultationPrice || 0)
      },
      availability: this.buildAvailabilityFromSchedule(this.form.schedule)
    }).subscribe(updated => {
      this.professional = updated;
      this.snackBar.open('Profil professionnel mis a jour.', 'Fermer', { duration: 2500 });
    });
  }

  private buildAvailabilityFromSchedule(schedule: string): Professional['availability'] {
    if (!schedule.trim()) {
      return this.professional?.availability || {};
    }

    const match = schedule.match(/(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})/);
    const start = match?.[1] || '09:00';
    const end = match?.[2] || '18:00';

    return {
      monday: [{ start, end, available: true }],
      tuesday: [{ start, end, available: true }],
      wednesday: [{ start, end, available: true }],
      thursday: [{ start, end, available: true }],
      friday: [{ start, end, available: true }]
    };
  }

  updateRequestStatus(requestId: string, status: SupportRequest['status']): void {
    this.directoryService.updateSupportRequestStatus(requestId, status).subscribe(updated => {
      if (!updated) {
        return;
      }

      this.requests = this.requests.map(request =>
        request.id === requestId ? updated : request
      );

      const messageByStatus: Record<SupportRequest['status'], string> = {
        new: 'Demande remise en statut nouveau.',
        accepted: this.doctorReplies[requestId] ? 'Reponse envoyee et demande acceptee.' : 'Demande acceptee.',
        scheduled: this.doctorReplies[requestId] ? 'Reponse envoyee et consultation proposee.' : 'Consultation proposee au patient.',
        closed: 'Demande cloturee.'
      };

      this.snackBar.open(messageByStatus[status], 'Fermer', { duration: 2400 });
    });
  }

  private loadDoctorData(professionalId: string): void {
    this.directoryService.getRequestsForProfessional(professionalId).subscribe(requests => {
      this.requests = requests;
    });

    this.directoryService.getSharedAssessmentsForProfessional(professionalId).subscribe(shared => {
      this.sharedAssessments = shared;
    });
  }

  private hydrateForm(professional: Professional): void {
    this.form = {
      firstName: professional.firstName,
      lastName: professional.lastName,
      specialties: professional.specialties.join(', '),
      languages: professional.languages.join(', '),
      city: professional.location.city,
      consultationPrice: professional.pricing?.consultation || 0,
      phone: professional.contact.phone,
      bookingUrl: professional.contact.bookingUrl || professional.contact.website || '',
      bio: professional.bio || '',
      schedule: this.formatSchedule(professional)
    };
  }

  private formatSchedule(professional: Professional): string {
    const monday = professional.availability.monday?.[0];
    return monday ? `Lun-Ven ${monday.start}-${monday.end}` : '';
  }

  splitCsv(value: string): string[] {
    return value.split(',').map(item => item.trim()).filter(Boolean);
  }
}
