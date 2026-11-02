import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { Professional } from '../../models/index';
import { DirectoryService } from '../../services/directory.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatSnackBarModule, MatTabsModule],
  template: `
    <div class="container-xl py-4 py-lg-5 dp-page">
      <section class="dp-hero-section mb-5 dp-animate-in">
        <div class="row g-4 align-items-center">
          <div class="col-lg-7">
            <span class="dp-eyebrow mb-3">Administration</span>
            <h1 class="display-6 fw-bold mb-3">Pilotage global de DeltaPress</h1>
            <p class="text-dp-muted mb-0 fs-5">
              Validation des medecins, moderation, gestion des contenus d aide
              et supervision des statistiques d usage.
            </p>
          </div>

          <div class="col-lg-5">
            <div class="admin-stats">
              <div *ngFor="let stat of stats.slice(0, 3)" class="dp-glass-card dp-hover-lift p-3 text-center border-0">
                <strong class="d-block fs-3 text-primary fw-bold">{{ stat.value }}</strong>
                <span class="text-dp-muted small">{{ stat.label }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <mat-tab-group [selectedIndex]="selectedTabIndex" class="dp-animate-in" style="animation-delay: 0.1s">
        <mat-tab label="Medecins">
          <div class="row g-4 mt-3">
            <div class="col-12" *ngIf="pendingDoctors.length === 0">
              <mat-card class="dp-glass-card border-0">
                <mat-card-content class="p-5 text-center">
                  <div class="dp-icon-circle bg-primary bg-opacity-10 text-primary mx-auto mb-4" style="width: 80px; height: 80px;">
                    <mat-icon style="font-size: 40px; width: 40px; height: 40px; line-height: 40px;">verified_user</mat-icon>
                  </div>
                  <h3 class="h4 mb-2">Tout est a jour</h3>
                  <p class="text-dp-muted mb-0">Aucun compte medecin en attente de validation.</p>
                </mat-card-content>
              </mat-card>
            </div>

            <div class="col-lg-6" *ngFor="let doctor of pendingDoctors">
              <mat-card class="dp-glass-card h-100 border-0 dp-hover-lift dp-glow-border-warning">
                <mat-card-content class="p-4">
                  <div class="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
                    <div class="d-flex align-items-center gap-3">
                      <div class="dp-icon-circle bg-warning bg-opacity-10 text-warning">
                        <mat-icon>person</mat-icon>
                      </div>
                      <div>
                        <h2 class="h5 mb-1 fw-bold">{{ doctor.firstName }} {{ doctor.lastName }}</h2>
                        <p class="text-dp-muted mb-0">{{ getTitleLabel(doctor.title) }} - {{ doctor.location.city }}</p>
                      </div>
                    </div>
                    <span class="badge bg-warning bg-opacity-10 text-warning px-3 py-2 rounded-pill">En attente</span>
                  </div>

                  <div class="dp-info-strip mb-4">
                    <mat-icon class="text-primary me-2">medical_services</mat-icon>
                    <span>Specialites : {{ getDoctorSummary(doctor) }}</span>
                  </div>

                  <div class="d-flex flex-wrap gap-3">
                    <button
                      type="button"
                      class="btn btn-primary rounded-pill px-4 dp-hover-lift"
                      (click)="validateDoctor(doctor.id)"
                    >
                      Valider le profil
                    </button>
                    <button
                      type="button"
                      class="btn btn-outline-danger rounded-pill px-4 dp-hover-lift"
                      (click)="blockDoctor(doctor.id)"
                    >
                      Bloquer
                    </button>
                  </div>
                </mat-card-content>
              </mat-card>
            </div>

            <div class="col-12 mt-5">
              <mat-card class="dp-glass-card border-0">
                <mat-card-content class="p-4">
                  <div class="d-flex align-items-center gap-3 mb-4">
                    <div class="dp-icon-circle bg-primary bg-opacity-10 text-primary">
                      <mat-icon>manage_accounts</mat-icon>
                    </div>
                    <h2 class="h5 mb-0 fw-bold">Gestion des utilisateurs</h2>
                  </div>
                  
                  <div class="d-grid gap-3">
                    <article class="dp-glass-card p-3 d-flex justify-content-between align-items-center flex-wrap gap-3 dp-hover-lift" *ngFor="let user of managedUsers">
                      <div>
                        <strong class="d-block mb-1">{{ user.name }}</strong>
                        <div class="d-flex align-items-center gap-2">
                          <span class="text-dp-muted small">{{ user.email }}</span>
                          <span class="badge rounded-pill" [ngClass]="user.status === 'actif' ? 'bg-success bg-opacity-10 text-success' : 'bg-danger bg-opacity-10 text-danger'">{{ user.status }}</span>
                        </div>
                      </div>
                      <div class="d-flex flex-wrap gap-2">
                        <button type="button" class="btn btn-sm rounded-pill px-3" [ngClass]="user.status === 'actif' ? 'btn-outline-danger' : 'btn-outline-success'" (click)="toggleUserStatus(user.id)">
                          {{ user.status === 'actif' ? 'Bloquer' : 'Reactiver' }}
                        </button>
                        <button type="button" class="btn btn-sm btn-outline-primary rounded-pill px-3" (click)="openUserFolder(user.id)">
                          Consulter le dossier
                        </button>
                      </div>
                    </article>
                  </div>
                </mat-card-content>
              </mat-card>
            </div>
          </div>
        </mat-tab>

        <mat-tab label="Moderation">
          <div class="row g-4 mt-3">
            <div class="col-lg-6">
              <mat-card class="dp-glass-card h-100 border-0">
                <mat-card-content class="p-4">
                  <div class="d-flex align-items-center gap-3 mb-4">
                    <div class="dp-icon-circle bg-danger bg-opacity-10 text-danger">
                      <mat-icon>report_problem</mat-icon>
                    </div>
                    <h2 class="h5 mb-0 fw-bold">Messages et signalements</h2>
                  </div>
                  
                  <div class="d-grid gap-3">
                    <article class="dp-glass-card p-3 dp-hover-lift border-start border-4 border-danger" *ngFor="let item of moderationItems">
                      <strong class="d-block mb-2">{{ item.title }}</strong>
                      <p class="text-dp-muted mb-2 small">{{ item.description }}</p>
                      <span class="badge bg-secondary bg-opacity-10 text-secondary">{{ item.type }}</span>
                    </article>
                  </div>
                </mat-card-content>
              </mat-card>
            </div>

            <div class="col-lg-6">
              <mat-card class="dp-glass-card h-100 border-0">
                <mat-card-content class="p-4">
                  <div class="d-flex align-items-center gap-3 mb-4">
                    <div class="dp-icon-circle bg-warning bg-opacity-10 text-warning">
                      <mat-icon>priority_high</mat-icon>
                    </div>
                    <h2 class="h5 mb-0 fw-bold">Actions prioritaires</h2>
                  </div>
                  
                  <ul class="list-unstyled d-grid gap-3 mb-0">
                    <li class="d-flex align-items-start gap-3">
                      <mat-icon class="text-warning mt-1 fs-5">chevron_right</mat-icon>
                      <span class="text-dp-muted">Revoir les messages signales comme anxiogenes.</span>
                    </li>
                    <li class="d-flex align-items-start gap-3">
                      <mat-icon class="text-warning mt-1 fs-5">chevron_right</mat-icon>
                      <span class="text-dp-muted">Mettre a jour les ressources de crise les plus visibles.</span>
                    </li>
                    <li class="d-flex align-items-start gap-3">
                      <mat-icon class="text-warning mt-1 fs-5">chevron_right</mat-icon>
                      <span class="text-dp-muted">Verifier la conformite des profils professionnels nouvellement ajoutes.</span>
                    </li>
                    <li class="d-flex align-items-start gap-3">
                      <mat-icon class="text-warning mt-1 fs-5">chevron_right</mat-icon>
                      <span class="text-dp-muted">Supprimer les contenus d aide obsoletes ou trop vagues.</span>
                    </li>
                  </ul>
                </mat-card-content>
              </mat-card>
            </div>
          </div>
        </mat-tab>

        <mat-tab label="Contenus">
          <div class="row g-4 mt-3">
            <div class="col-lg-6">
              <mat-card class="dp-glass-card h-100 border-0">
                <mat-card-content class="p-4">
                  <div class="d-flex align-items-center gap-3 mb-4">
                    <div class="dp-icon-circle bg-primary bg-opacity-10 text-primary">
                      <mat-icon>article</mat-icon>
                    </div>
                    <h2 class="h5 mb-0 fw-bold">Textes d aide et slides</h2>
                  </div>
                  
                  <div class="d-grid gap-3">
                    <article class="dp-glass-card p-3 dp-hover-lift" *ngFor="let content of contentItems">
                      <div class="d-flex justify-content-between align-items-start mb-2">
                        <strong class="d-block">{{ content.title }}</strong>
                        <span class="badge rounded-pill" [ngClass]="content.status === 'Publie' ? 'bg-success bg-opacity-10 text-success' : (content.status === 'Archive' ? 'bg-secondary bg-opacity-10 text-secondary' : 'bg-warning bg-opacity-10 text-warning')">{{ content.status }}</span>
                      </div>
                      <p class="text-dp-muted mb-3 small">{{ content.description }}</p>
                      <div class="d-flex flex-wrap gap-2">
                        <button type="button" class="btn btn-sm btn-primary rounded-pill px-3" *ngIf="content.status !== 'Publie'" (click)="publishContent(content.title)">Publier</button>
                        <button type="button" class="btn btn-sm btn-outline-danger rounded-pill px-3" *ngIf="content.status !== 'Archive'" (click)="archiveContent(content.title)">Archiver</button>
                      </div>
                    </article>
                  </div>
                </mat-card-content>
              </mat-card>
            </div>

            <div class="col-lg-6">
              <mat-card class="dp-glass-card h-100 border-0">
                <mat-card-content class="p-4">
                  <div class="d-flex align-items-center gap-3 mb-4">
                    <div class="dp-icon-circle bg-info bg-opacity-10 text-info">
                      <mat-icon>category</mat-icon>
                    </div>
                    <h2 class="h5 mb-0 fw-bold">Categories et ressources de crise</h2>
                  </div>
                  
                  <div class="d-flex flex-wrap gap-2 mb-4">
                    <span class="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill fw-medium" *ngFor="let category of contentCategories">{{ category }}</span>
                  </div>
                  
                  <div class="dp-info-strip bg-info bg-opacity-10 text-info mb-4 border-0">
                    <mat-icon class="me-2">info</mat-icon>
                    <span>Lignes directrices de publication</span>
                  </div>
                  
                  <ul class="list-unstyled d-grid gap-3 mb-0">
                    <li class="d-flex align-items-start gap-3">
                      <div class="dp-step-number mt-1 bg-primary text-white">1</div>
                      <span class="text-dp-muted pt-1">Numero d urgence et ligne de crise toujours en tete.</span>
                    </li>
                    <li class="d-flex align-items-start gap-3">
                      <div class="dp-step-number mt-1 bg-primary text-white">2</div>
                      <span class="text-dp-muted pt-1">Guides de respiration et ancrage emotionnel mis a jour.</span>
                    </li>
                    <li class="d-flex align-items-start gap-3">
                      <div class="dp-step-number mt-1 bg-primary text-white">3</div>
                      <span class="text-dp-muted pt-1">Citations et messages d apaisement moderes avant publication.</span>
                    </li>
                    <li class="d-flex align-items-start gap-3">
                      <div class="dp-step-number mt-1 bg-primary text-white">4</div>
                      <span class="text-dp-muted pt-1">Categories d aide organisees par niveau de priorite.</span>
                    </li>
                  </ul>
                </mat-card-content>
              </mat-card>
            </div>
          </div>
        </mat-tab>

        <mat-tab label="Statistiques">
          <div class="row g-4 mt-3">
            <div class="col-md-6 col-xl-3" *ngFor="let stat of stats; let i = index">
              <mat-card class="dp-glass-card h-100 border-0 dp-hover-lift dp-animate-in" [ngStyle]="{'animation-delay': (i * 0.1) + 's'}">
                <mat-card-content class="p-4 text-center">
                  <div class="dp-icon-circle bg-primary bg-opacity-10 text-primary mx-auto mb-3" style="width: 64px; height: 64px;">
                    <mat-icon style="font-size: 32px; width: 32px; height: 32px; line-height: 32px;">{{ stat.icon }}</mat-icon>
                  </div>
                  <h2 class="display-5 fw-bold text-primary mb-2">{{ stat.value }}</h2>
                  <p class="text-dp-muted mb-0 fw-medium">{{ stat.label }}</p>
                </mat-card-content>
              </mat-card>
            </div>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .admin-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1.5rem;
    }

    /* Modernized stat card indicators */
    :host ::ng-deep .admin-stats .dp-glass-card {
      background: linear-gradient(135deg, var(--dp-surface) 0%, rgba(255, 255, 255, 0.5) 100%);
      border: 1px solid rgba(31, 120, 255, 0.15);
      position: relative;
      overflow: hidden;
    }

    :host ::ng-deep .admin-stats .dp-glass-card mat-card-content {
      position: relative;
      z-index: 1;
    }

    :host ::ng-deep .admin-stats .dp-glass-card::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -50%;
      width: 150px;
      height: 150px;
      background: radial-gradient(circle, rgba(31, 120, 255, 0.08) 0%, transparent 70%);
      border-radius: 50%;
      pointer-events: none;
    }

    @media (max-width: 767.98px) {
      .admin-stats {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `]
})
export class AdminComponent implements OnInit {
  pendingDoctors: Professional[] = [];
  selectedTabIndex = 0;
  managedUsers = [
    { id: 'user_demo', name: 'Lea Garnier', email: 'lea@example.com', status: 'actif' },
    { id: 'user_2', name: 'Nassim Ali', email: 'nassim@example.com', status: 'actif' },
    { id: 'user_3', name: 'Mina Roy', email: 'mina@example.com', status: 'bloque' }
  ];

  moderationItems = [
    {
      title: 'Signalement sur un message de detresse',
      description: 'Un utilisateur a signale une conversation contenant des formulations de crise.',
      type: 'Message'
    },
    {
      title: 'Contenu de citation a revoir',
      description: 'Une citation de page d accueil semble minimiser la souffrance psychique.',
      type: 'Contenu'
    }
  ];

  contentItems = [
    {
      title: 'Slide Accueil - Test rapide',
      description: 'Texte introductif sur la depression et choix entre test et discussion.',
      status: 'Publie'
    },
    {
      title: 'Bloc aide urgente',
      description: 'Ressources de crise et message d orientation visible.',
      status: 'A valider'
    }
  ];

  contentCategories = ['Sommeil', 'Respiration', 'Stress', 'Crise', 'Citations', 'Slides accueil'];

  stats = [
    { icon: 'groups', value: '0', label: 'Professionnels references' },
    { icon: 'pending_actions', value: '0', label: 'Medecins a valider' },
    { icon: 'assessment', value: '0', label: 'Bilans partages' },
    { icon: 'medical_services', value: '0', label: 'Prises de contact medecin' }
  ];

  constructor(
    private route: ActivatedRoute,
    private directoryService: DirectoryService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.selectedTabIndex = Number(params.get('tab') || 0);
    });
    this.loadAdminData();
  }

  validateDoctor(doctorId: string): void {
    this.directoryService.updateProfessionalStatus(doctorId, 'approved').subscribe(updated => {
      if (!updated) {
        return;
      }

      this.loadAdminData();
      this.snackBar.open('Compte medecin valide.', 'Fermer', { duration: 2500 });
    });
  }

  blockDoctor(doctorId: string): void {
    this.directoryService.updateProfessionalStatus(doctorId, 'blocked').subscribe(updated => {
      if (!updated) {
        return;
      }

      this.loadAdminData();
      this.snackBar.open('Compte medecin bloque.', 'Fermer', { duration: 2500 });
    });
  }

  toggleUserStatus(userId: string): void {
    this.managedUsers = this.managedUsers.map(user =>
      user.id === userId
        ? { ...user, status: user.status === 'actif' ? 'bloque' : 'actif' }
        : user
    );
    this.snackBar.open('Statut utilisateur mis a jour.', 'Fermer', { duration: 2200 });
  }

  openUserFolder(userId: string): void {
    this.snackBar.open(`Dossier ${userId} pret pour consultation admin.`, 'Fermer', { duration: 2200 });
  }

  publishContent(title: string): void {
    this.contentItems = this.contentItems.map(content =>
      content.title === title ? { ...content, status: 'Publie' } : content
    );
    this.snackBar.open('Contenu publie.', 'Fermer', { duration: 2200 });
  }

  archiveContent(title: string): void {
    this.contentItems = this.contentItems.map(content =>
      content.title === title ? { ...content, status: 'Archive' } : content
    );
    this.snackBar.open('Contenu archive.', 'Fermer', { duration: 2200 });
  }

  getDoctorSummary(doctor: Professional): string {
    return doctor.specialties.slice(0, 3).join(', ');
  }

  getTitleLabel(title: Professional['title']): string {
    const labels: Record<Professional['title'], string> = {
      psychiatrist: 'Psychiatre',
      psychologist: 'Psychologue',
      therapist: 'Therapeute',
      counselor: 'Conseiller'
    };

    return labels[title];
  }

  private loadAdminData(): void {
    this.directoryService.getAllProfessionals().subscribe(professionals => {
      this.pendingDoctors = professionals.filter(item => item.status === 'pending');
    });

    this.directoryService.getAdminStats().subscribe(stats => {
      this.stats = [
        { icon: 'groups', value: stats.totalProfessionals.toString(), label: 'Professionnels references' },
        { icon: 'pending_actions', value: stats.pendingProfessionals.toString(), label: 'Medecins a valider' },
        { icon: 'assessment', value: stats.sharedAssessments.toString(), label: 'Bilans partages' },
        { icon: 'medical_services', value: stats.supportRequests.toString(), label: 'Prises de contact medecin' }
      ];
    });
  }
}
