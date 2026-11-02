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
import { DiscussionService } from '../../services/discussion.service';
import { QuestionnaireService } from '../../services/questionnaire.service';
import { SolutionsService } from '../../services/solutions.service';
import { DiscussionThread, HelpContent, PredictionResult, SupportRequest, User } from '../../models/index';

interface JournalEntry {
  id: string;
  date: string;
  mood: number;
  energy: number;
  sleep: number;
  fears: string;
  thoughts: string;
}

@Component({
  selector: 'app-profile',
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
    <div class="container-xl py-4 py-lg-5 dp-page dp-animate-in" [class.accessibility-mode]="accessibilityMode">
      <div class="loading-container text-center py-5" *ngIf="isLoading">
        <div class="dp-icon-circle mx-auto mb-3" style="width: 80px; height: 80px;">
          <mat-icon style="font-size: 2.5rem; width: 2.5rem; height: 2.5rem;">hourglass_top</mat-icon>
        </div>
        <p class="text-dp-muted fs-5">Chargement de votre espace personnel...</p>
      </div>

      <div *ngIf="!isLoading && user as currentUser; else notLoggedIn">
        <section class="dp-hero-section mb-5 rounded-4 p-4 p-md-5 position-relative overflow-hidden shadow-sm">
          <div class="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-4 position-relative" style="z-index: 1;">
            <div class="d-flex align-items-center gap-4">
              <div class="dp-icon-circle bg-white text-primary flex-shrink-0 shadow-sm" style="width: 80px; height: 80px; font-size: 2.5rem;">
                <mat-icon style="font-size: 3rem; width: 3rem; height: 3rem; margin-top: 10px;">account_circle</mat-icon>
              </div>
              <div>
                <span class="dp-eyebrow mb-2 d-block eyebrow-color-primary">Espace Utilisateur</span>
                <h1 class="display-5 fw-bold mb-2 user-name-color-primary">{{ currentUser.name }}</h1>                <p class="mb-0 d-flex align-items-center gap-3 flex-wrap">
                  <span class="d-flex align-items-center gap-1" style="color: var(--dp-primary);"><mat-icon class="fs-6" style="width:16px;height:16px;">email</mat-icon> {{ currentUser.email }}</span>
                  <span class="d-flex align-items-center gap-1" style="color: var(--dp-primary);"><mat-icon class="fs-6" style="width:16px;height:16px;">location_on</mat-icon> {{ currentUser.location || 'Localisation non renseignée' }}</span>
                </p>
              </div>
            </div>

            <div class="d-flex flex-wrap gap-3">
              <div class="text-center px-4 py-3 rounded-4" style="background: rgba(255,255,255,0.15); backdrop-filter: blur(10px); min-width: 120px;">
                <strong class="d-block text-white fs-2 font-manrope mb-1">{{ latestResult?.score ?? '--' }}</strong>
                <span class="small text-uppercase tracking-wider fw-bold stats-label-color-primary">Dernier Score</span>
              </div>
              <div class="text-center px-4 py-3 rounded-4" style="background: rgba(255,255,255,0.15); backdrop-filter: blur(10px); min-width: 120px;">
                <strong class="d-block text-white fs-2 font-manrope mb-1">{{ journalEntries.length }}</strong>
                <span class="small text-uppercase tracking-wider fw-bold stats-label-color-primary">Entrées Journal</span>
              </div>
              <div class="text-center px-4 py-3 rounded-4" style="background: rgba(255,255,255,0.15); backdrop-filter: blur(10px); min-width: 120px;">
                <strong class="d-block text-white fs-2 font-manrope mb-1">{{ supportRequests.length }}</strong>
                <span class="small text-uppercase tracking-wider fw-bold stats-label-color-primary">Demandes</span>
              </div>
            </div>
          </div>
        </section>

        <mat-tab-group [selectedIndex]="selectedTabIndex" class="premium-tabs" animationDuration="500ms">
          <mat-tab label="Profil">
            <mat-card class="dp-glass-card mt-4 dp-animate-in">
              <mat-card-content class="p-4 p-md-5">
                <h2 class="h3 font-manrope mb-4 dp-gradient-text">Compléter mon profil</h2>
                <div class="row g-4">
                  <div class="col-md-6">
                    <mat-form-field appearance="outline" class="w-100 premium-input"><mat-label>Nom complet</mat-label><input matInput [(ngModel)]="currentUser.name" /></mat-form-field>
                  </div>
                  <div class="col-md-6">
                    <mat-form-field appearance="outline" class="w-100 premium-input"><mat-label>Email</mat-label><input matInput [(ngModel)]="currentUser.email" /></mat-form-field>
                  </div>
                  <div class="col-md-6">
                    <mat-form-field appearance="outline" class="w-100 premium-input"><mat-label>Localisation</mat-label><input matInput [(ngModel)]="currentUser.location" /></mat-form-field>
                  </div>
                  <div class="col-md-6">
                    <mat-form-field appearance="outline" class="w-100 premium-input"><mat-label>Langue</mat-label><input matInput [(ngModel)]="currentUser.language" /></mat-form-field>
                  </div>
                </div>

                <div class="d-flex flex-wrap gap-3 mt-4 pt-2">
                  <button type="button" class="btn btn-primary btn-lg rounded-pill px-5 shadow-sm dp-hover-lift" (click)="updateProfile()">Enregistrer les modifications</button>
                  <a routerLink="/questionnaire" class="btn btn-outline-primary btn-lg rounded-pill px-4 dp-hover-lift">Faire le test</a>
                  <a routerLink="/discussion" class="btn btn-outline-primary btn-lg rounded-pill px-4 dp-hover-lift">Écrire mon ressenti</a>
                  <a routerLink="/directory" class="btn btn-outline-primary btn-lg rounded-pill px-4 dp-hover-lift">Rechercher un médecin</a>
                </div>
              </mat-card-content>
            </mat-card>
          </mat-tab>

          <mat-tab label="Bilan">
            <div class="row g-4 mt-2">
              <div class="col-lg-5">
                <mat-card class="dp-glass-card h-100 dp-animate-in" style="animation-delay: 0.1s;">
                  <mat-card-content class="p-4 p-md-5">
                    <div class="d-flex align-items-center gap-3 mb-4">
                      <div class="dp-icon-circle bg-primary bg-opacity-10 text-primary" style="width: 48px; height: 48px;">
                        <mat-icon>analytics</mat-icon>
                      </div>
                      <h2 class="h4 font-manrope mb-0 bilan-title">Score et recommandations</h2>
                    </div>
                    
                    <div *ngIf="latestResult; else noLatestResult">
                      <div class="p-4 rounded-4 mb-4" style="background: var(--dp-surface); border: 1px solid var(--dp-border);">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                          <span class="text-dp-muted fw-medium">Dernier résultat</span>
                          <span class="badge bg-primary rounded-pill px-3 py-2 fs-6">{{ latestResult.score }}/{{ latestResult.maxScore }}</span>
                        </div>
                        <h3 class="h5 mb-2 dp-gradient-text">{{ latestResult.severityLabel }}</h3>
                        <p class="text-dp-muted mb-0 small lh-lg">{{ latestResult.clinicalInterpretation.description }}</p>
                      </div>
                      
                      <h4 class="h6 fw-bold mb-3 text-uppercase tracking-wider text-dp-muted">Recommandations clés</h4>
                      <div class="d-flex flex-column gap-3 mb-4">
                        <article *ngFor="let recommendation of latestResult.recommendations.slice(0, 3)" class="dp-info-strip dp-hover-lift p-3 rounded-4 d-flex gap-3 align-items-start">
                          <mat-icon class="text-primary mt-1">lightbulb</mat-icon>
                          <div>
                            <strong class="d-block mb-1" style="color: var(--dp-primary);">{{ recommendation.title }}</strong>
                            <p class="mb-0 text-dp-muted small lh-base">{{ recommendation.description }}</p>
                          </div>
                        </article>
                      </div>
                      <div class="d-flex flex-wrap gap-3">
                        <a [routerLink]="['/result', latestResult.id]" class="btn btn-primary rounded-pill px-4 dp-hover-lift flex-grow-1">Voir le bilan détaillé</a>
                        <button type="button" class="btn btn-outline-secondary rounded-pill px-4 dp-hover-lift" (click)="exportUserFolder()"><mat-icon class="align-middle me-1">picture_as_pdf</mat-icon> Exporter PDF</button>
                      </div>
                    </div>
                    <ng-template #noLatestResult>
                      <div class="text-center py-5">
                        <mat-icon class="text-dp-muted mb-3" style="font-size: 3rem; width: 3rem; height: 3rem;">assignment</mat-icon>
                        <p class="text-dp-muted mb-4 fs-5">Aucun bilan pour le moment.</p>
                        <a routerLink="/questionnaire" class="btn btn-primary btn-lg rounded-pill px-5 dp-hover-lift">Faire mon premier test</a>
                      </div>
                    </ng-template>
                  </mat-card-content>
                </mat-card>
              </div>

              <div class="col-lg-7">
                <mat-card class="dp-glass-card h-100 dp-animate-in" style="animation-delay: 0.2s;">
                  <mat-card-content class="p-4 p-md-5">
                    <div class="d-flex align-items-center gap-3 mb-4">
                      <div class="dp-icon-circle bg-success bg-opacity-10 text-success" style="width: 48px; height: 48px;">
                        <mat-icon>trending_up</mat-icon>
                      </div>
                      <h2 class="h4 font-manrope mb-0">Historique et évolution</h2>
                    </div>
                    
                    <div class="chart-strip d-flex align-items-end justify-content-between gap-2 gap-md-3 pt-4" *ngIf="emotionalTrend.length > 0; else noTrend" style="min-height: 250px;">
                      <div class="trend-bar flex-grow-1 d-flex flex-column align-items-center gap-2" *ngFor="let point of emotionalTrend">
                        <div class="w-100 rounded-pill position-relative overflow-hidden dp-hover-lift" style="background: var(--dp-surface); min-height: 150px; display: flex; flex-direction: column; justify-content: flex-end;">
                          <div class="w-100 rounded-pill" [style.height.%]="point.score" style="background: linear-gradient(180deg, var(--dp-primary), var(--dp-accent)); transition: height 1s cubic-bezier(0.4, 0, 0.2, 1); min-height: 20px;"></div>
                          <span class="position-absolute w-100 text-center text-white fw-bold" style="bottom: 8px; font-size: 0.8rem; text-shadow: 0 1px 2px rgba(0,0,0,0.3);">{{ point.score }}</span>
                        </div>
                        <small class="text-dp-muted fw-medium text-center" style="font-size: 0.75rem;">{{ point.label }}</small>
                      </div>
                    </div>
                    <ng-template #noTrend>
                      <div class="text-center py-5 mt-4 rounded-4" style="background: var(--dp-surface); border: 1px dashed var(--dp-border);">
                        <mat-icon class="text-dp-muted mb-3" style="font-size: 2.5rem; width: 2.5rem; height: 2.5rem;">show_chart</mat-icon>
                        <p class="text-dp-muted mb-0">Les statistiques apparaîtront après vos premiers tests ou entrées de journal.</p>
                      </div>
                    </ng-template>
                  </mat-card-content>
                </mat-card>
              </div>

              <div class="col-12">
                <mat-card class="dp-glass-card dp-animate-in" style="animation-delay: 0.3s;">
                  <mat-card-content class="p-4 p-md-5">
                    <h2 class="h4 font-manrope mb-4">Historique des tests</h2>
                    <div class="d-flex flex-column gap-3" *ngIf="testHistory.length > 0; else noHistory">
                      <article class="dp-info-strip dp-hover-lift p-4 rounded-4 d-flex justify-content-between align-items-center flex-wrap gap-3" *ngFor="let test of testHistory">
                        <div class="d-flex align-items-center gap-4">
                          <div class="dp-icon-circle bg-light text-primary" style="width: 50px; height: 50px;">
                            <mat-icon>assignment_turned_in</mat-icon>
                          </div>
                          <div>
                            <strong class="d-block fs-5 mb-1" style="color: var(--dp-primary);">{{ test.severityLabel }}</strong>
                            <p class="text-dp-muted mb-0 small"><mat-icon class="align-middle me-1" style="font-size: 1rem; width: 1rem; height: 1rem;">calendar_today</mat-icon> {{ test.createdAt | date:'longDate':'':'fr-FR' }} &nbsp;&bull;&nbsp; Score: {{ test.score }}/{{ test.maxScore }}</p>
                          </div>
                        </div>
                        <a [routerLink]="['/result', test.id]" class="btn btn-outline-primary rounded-pill px-4 shadow-sm">Ouvrir le détail</a>
                      </article>
                    </div>
                    <ng-template #noHistory>
                      <p class="text-dp-muted mb-0 py-3 text-center bg-light rounded-4">Aucun historique pour le moment.</p>
                    </ng-template>
                  </mat-card-content>
                </mat-card>
              </div>
            </div>
          </mat-tab>

          <mat-tab label="Journal">
            <div class="row g-4 mt-2">
              <div class="col-lg-5">
                <mat-card class="dp-glass-card h-100 dp-animate-in" style="animation-delay: 0.1s;">
                  <mat-card-content class="p-4 p-md-5">
                    <div class="d-flex align-items-center gap-3 mb-4">
                      <div class="dp-icon-circle bg-primary bg-opacity-10 text-primary" style="width: 48px; height: 48px;">
                        <mat-icon>edit_note</mat-icon>
                      </div>
                      <h2 class="h4 font-manrope mb-0">Journal quotidien</h2>
                    </div>
                    
                    <div class="row g-4">
                      <div class="col-12">
                        <mat-form-field appearance="outline" class="w-100 premium-input"><mat-label>Date</mat-label><input matInput type="date" [(ngModel)]="journalForm.date" /></mat-form-field>
                      </div>
                      <div class="col-md-4">
                        <mat-form-field appearance="outline" class="w-100 premium-input"><mat-label>Humeur</mat-label><input matInput type="number" min="0" max="10" [(ngModel)]="journalForm.mood" /><mat-hint align="end">/10</mat-hint></mat-form-field>
                      </div>
                      <div class="col-md-4">
                        <mat-form-field appearance="outline" class="w-100 premium-input"><mat-label>Énergie</mat-label><input matInput type="number" min="0" max="10" [(ngModel)]="journalForm.energy" /><mat-hint align="end">/10</mat-hint></mat-form-field>
                      </div>
                      <div class="col-md-4">
                        <mat-form-field appearance="outline" class="w-100 premium-input"><mat-label>Sommeil</mat-label><input matInput type="number" min="0" max="12" [(ngModel)]="journalForm.sleep" /><mat-hint align="end">heures</mat-hint></mat-form-field>
                      </div>
                      <div class="col-12">
                        <mat-form-field appearance="outline" class="w-100 premium-input"><mat-label>Peurs ou angoisses du jour</mat-label><textarea matInput rows="2" [(ngModel)]="journalForm.fears" placeholder="Qu'est-ce qui vous a inquiété aujourd'hui ?"></textarea></mat-form-field>
                      </div>
                      <div class="col-12">
                        <mat-form-field appearance="outline" class="w-100 premium-input"><mat-label>Pensées et réflexions</mat-label><textarea matInput rows="4" [(ngModel)]="journalForm.thoughts" placeholder="Écrivez ce qui vous passe par la tête..."></textarea></mat-form-field>
                      </div>
                    </div>
                    <button type="button" class="btn btn-primary btn-lg w-100 rounded-pill mt-4 shadow-sm dp-hover-lift" (click)="saveJournalEntry()"><mat-icon class="align-middle me-2">save</mat-icon> Enregistrer l'entrée</button>
                  </mat-card-content>
                </mat-card>
              </div>

              <div class="col-lg-7">
                <mat-card class="dp-glass-card h-100 dp-animate-in" style="animation-delay: 0.2s;">
                  <mat-card-content class="p-4 p-md-5">
                    <div class="d-flex align-items-center gap-3 mb-4">
                      <div class="dp-icon-circle bg-success bg-opacity-10 text-success" style="width: 48px; height: 48px;">
                        <mat-icon>history_edu</mat-icon>
                      </div>
                      <h2 class="h4 font-manrope mb-0">Vos dernières entrées</h2>
                    </div>

                    <div class="d-flex flex-column gap-4" *ngIf="journalEntries.length > 0; else noJournal">
                      <article class="dp-info-strip dp-hover-lift p-4 rounded-4" *ngFor="let entry of journalEntries">
                        <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3 pb-3 border-bottom border-light">
                          <strong class="text-primary fs-5"><mat-icon class="align-middle me-2">event</mat-icon>{{ entry.date | date:'longDate':'':'fr-FR' }}</strong>
                          <div class="d-flex gap-2 flex-wrap">
                            <span class="badge bg-light text-dark rounded-pill px-3 py-2"><mat-icon class="align-middle me-1" style="font-size:14px;width:14px;height:14px;">mood</mat-icon> {{ entry.mood }}/10</span>
                            <span class="badge bg-light text-dark rounded-pill px-3 py-2"><mat-icon class="align-middle me-1" style="font-size:14px;width:14px;height:14px;">bolt</mat-icon> {{ entry.energy }}/10</span>
                            <span class="badge bg-light text-dark rounded-pill px-3 py-2"><mat-icon class="align-middle me-1" style="font-size:14px;width:14px;height:14px;">bedtime</mat-icon> {{ entry.sleep }}h</span>
                          </div>
                        </div>
                        <div class="mb-3" *ngIf="entry.fears">
                          <strong class="d-block text-dp-muted text-uppercase tracking-wider small mb-1">Peurs ressenties</strong>
                          <p class="mb-0 lh-base">{{ entry.fears }}</p>
                        </div>
                        <div>
                          <strong class="d-block text-dp-muted text-uppercase tracking-wider small mb-1">Pensées</strong>
                          <p class="mb-0 lh-base fst-italic" style="color: var(--dp-primary);">"{{ entry.thoughts }}"</p>
                        </div>
                      </article>
                    </div>
                    <ng-template #noJournal>
                      <div class="text-center py-5 mt-4 rounded-4" style="background: var(--dp-surface); border: 1px dashed var(--dp-border);">
                        <mat-icon class="text-dp-muted mb-3" style="font-size: 2.5rem; width: 2.5rem; height: 2.5rem;">auto_stories</mat-icon>
                        <p class="text-dp-muted mb-0">Aucune entrée dans votre journal pour le moment.</p>
                      </div>
                    </ng-template>
                  </mat-card-content>
                </mat-card>
              </div>
            </div>
          </mat-tab>

          <mat-tab label="Ressources & Messages">
            <div class="row g-4 mt-2">
              <div class="col-md-6 col-xl-3 dp-animate-in" *ngFor="let resource of resourceCards; let i = index" [style.animation-delay]="(i * 0.1) + 's'">
                <mat-card class="dp-glass-card h-100 dp-hover-lift resource-card text-center overflow-hidden border-0 shadow-sm">
                  <mat-card-content class="p-4 d-flex flex-column h-100">
                    <div class="dp-icon-circle mx-auto mb-4 bg-primary bg-opacity-10 text-primary" style="width: 70px; height: 70px;">
                      <mat-icon style="font-size: 2.5rem; width: 2.5rem; height: 2.5rem; margin-top:8px;">{{ resource.icon }}</mat-icon>
                    </div>
                    <h3 class="h5 font-manrope mb-3">{{ resource.title }}</h3>
                    <p class="text-dp-muted small lh-base mb-4 flex-grow-1">{{ resource.description }}</p>
                    <a [routerLink]="resource.link" class="btn btn-light rounded-pill w-100">Explorer <mat-icon class="align-middle ms-1" style="font-size:18px;">arrow_forward</mat-icon></a>
                  </mat-card-content>
                </mat-card>
              </div>

              <div class="col-lg-6 dp-animate-in" style="animation-delay: 0.4s;">
                <mat-card class="dp-glass-card h-100">
                  <mat-card-content class="p-4 p-md-5">
                    <h2 class="h4 font-manrope mb-4">Discussions libres</h2>
                    <div class="d-flex flex-column gap-3" *ngIf="threads.length > 0; else noThreads">
                      <article class="dp-info-strip p-3 rounded-4 d-flex justify-content-between align-items-center dp-hover-lift" *ngFor="let thread of threads">
                        <div>
                          <strong class="d-block mb-1 text-dark">{{ thread.title }}</strong>
                          <p class="text-dp-muted mb-0 small"><mat-icon class="align-middle me-1" style="font-size: 14px; width: 14px; height: 14px;">schedule</mat-icon> {{ thread.updatedAt | date:'mediumDate':'':'fr-FR' }} &nbsp;&bull;&nbsp; {{ getSentimentLabel(thread.moodTag) }}</p>
                        </div>
                        <a routerLink="/discussion" class="btn btn-icon btn-sm btn-light rounded-circle"><mat-icon>chevron_right</mat-icon></a>
                      </article>
                    </div>
                    <ng-template #noThreads>
                      <div class="text-center p-4 bg-light rounded-4">
                        <p class="text-dp-muted mb-3">Aucune discussion libre pour le moment.</p>
                        <a routerLink="/discussion" class="btn btn-outline-primary rounded-pill px-4">Commencer à écrire</a>
                      </div>
                    </ng-template>
                  </mat-card-content>
                </mat-card>
              </div>

              <div class="col-lg-6 dp-animate-in" style="animation-delay: 0.5s;">
                <mat-card class="dp-glass-card h-100">
                  <mat-card-content class="p-4 p-md-5">
                    <h2 class="h4 font-manrope mb-4">Demandes d'accompagnement</h2>
                    <div class="d-flex flex-column gap-3" *ngIf="supportRequests.length > 0; else noRequests">
                      <article class="dp-info-strip p-3 rounded-4 dp-hover-lift" *ngFor="let request of supportRequests">
                        <div class="d-flex justify-content-between align-items-start mb-2 flex-wrap gap-2">
                          <strong class="d-block text-primary"><mat-icon class="align-middle me-1">forum</mat-icon> {{ request.type === 'appointment' ? 'Demande de Rendez-vous' : 'Message direct' }}</strong>
                          <span class="badge" [ngClass]="{'bg-success': request.status === 'closed', 'bg-warning text-dark': request.status === 'new', 'bg-info': request.status === 'accepted' || request.status === 'scheduled'}">{{ request.status }}</span>
                        </div>
                        <p class="text-dark mb-2 lh-sm fst-italic">"{{ request.message }}"</p>
                        <small class="text-dp-muted d-block"><mat-icon class="align-middle me-1" style="font-size: 14px; width: 14px; height: 14px;">schedule</mat-icon> {{ request.createdAt | date:'medium':'':'fr-FR' }}</small>
                      </article>
                    </div>
                    <ng-template #noRequests>
                      <div class="text-center p-4 bg-light rounded-4">
                        <p class="text-dp-muted mb-3">Aucune demande envoyée pour le moment.</p>
                        <a routerLink="/directory" class="btn btn-outline-primary rounded-pill px-4">Contacter un médecin</a>
                      </div>
                    </ng-template>
                  </mat-card-content>
                </mat-card>
              </div>
            </div>
          </mat-tab>

          <mat-tab label="Sécurité & Suivi">
            <div class="row g-4 mt-2">
              <div class="col-lg-6 dp-animate-in" style="animation-delay: 0.1s;">
                <mat-card class="dp-glass-card h-100 border-top border-danger border-4">
                  <mat-card-content class="p-4 p-md-5">
                    <div class="d-flex align-items-center gap-3 mb-3">
                      <div class="dp-icon-circle bg-danger bg-opacity-10 text-danger" style="width: 48px; height: 48px;">
                        <mat-icon>shield</mat-icon>
                      </div>
                      <h2 class="h4 font-manrope mb-0 text-danger">Plan de sécurité</h2>
                    </div>
                    <p class="text-dp-muted mb-4">À utiliser si vous vous sentez en danger ou si les pensées deviennent difficiles à contenir. Suivez ces étapes.</p>
                    
                    <div class="d-flex flex-column gap-3 mb-4">
                      <article *ngFor="let step of safetyPlan; let i = index" class="dp-info-strip p-3 rounded-4 d-flex gap-3 align-items-start dp-hover-lift">
                        <div class="dp-step-number bg-danger text-white flex-shrink-0" style="width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 50%; font-weight: bold;">{{ i + 1 }}</div>
                        <div>
                          <strong class="d-block mb-1 text-dark">{{ step.title }}</strong>
                          <p class="mb-0 text-dp-muted small lh-sm">{{ step.text }}</p>
                        </div>
                      </article>
                    </div>
                    <a routerLink="/emergency" class="btn btn-danger btn-lg w-100 rounded-pill shadow-sm dp-hover-lift"><mat-icon class="align-middle me-2">sos</mat-icon> Aide prioritaire immédiate</a>
                  </mat-card-content>
                </mat-card>
              </div>

              <div class="col-lg-6 dp-animate-in" style="animation-delay: 0.2s;">
                <mat-card class="dp-glass-card h-100">
                  <mat-card-content class="p-4 p-md-5">
                    <div class="d-flex align-items-center gap-3 mb-4">
                      <div class="dp-icon-circle bg-primary bg-opacity-10 text-primary" style="width: 48px; height: 48px;">
                        <mat-icon>diversity_1</mat-icon>
                      </div>
                      <h2 class="h4 font-manrope mb-0">Contacts de confiance</h2>
                    </div>
                    
                    <div class="row g-4 mb-4">
                      <div class="col-md-6"><mat-form-field appearance="outline" class="w-100 premium-input"><mat-label>Proche (Nom)</mat-label><input matInput [(ngModel)]="trustedContact.name" /></mat-form-field></div>
                      <div class="col-md-6"><mat-form-field appearance="outline" class="w-100 premium-input"><mat-label>Téléphone du proche</mat-label><input matInput [(ngModel)]="trustedContact.phone" /></mat-form-field></div>
                      <div class="col-md-6"><mat-form-field appearance="outline" class="w-100 premium-input"><mat-label>Médecin traitant/Psy</mat-label><input matInput [(ngModel)]="trustedContact.doctor" /></mat-form-field></div>
                      <div class="col-md-6"><mat-form-field appearance="outline" class="w-100 premium-input"><mat-label>Ligne d'aide d'urgence</mat-label><input matInput [(ngModel)]="trustedContact.hotline" /></mat-form-field></div>
                    </div>
                    <button type="button" class="btn btn-primary btn-lg w-100 rounded-pill shadow-sm dp-hover-lift" (click)="saveTrustedContact()"><mat-icon class="align-middle me-2">save</mat-icon> Enregistrer les contacts</button>
                    
                    <hr class="my-5 border-light">
                    
                    <h2 class="h5 font-manrope mb-4">Programme de bien-être quotidien</h2>
                    <div class="d-flex flex-column gap-3 mb-4">
                      <article *ngFor="let task of wellbeingTasks" 
                               class="dp-info-strip p-3 rounded-4 d-flex align-items-center gap-3 cursor-pointer dp-hover-lift transition-all" 
                               [class.bg-success]="task.done" [class.bg-opacity-10]="task.done"
                               (click)="toggleWellbeingTask(task.id)">
                        <mat-icon [class.text-success]="task.done" [class.text-dp-muted]="!task.done">{{ task.done ? 'check_circle' : 'radio_button_unchecked' }}</mat-icon>
                        <span class="fw-medium" [class.text-success]="task.done" [class.text-dark]="!task.done" [class.text-decoration-line-through]="task.done">{{ task.label }}</span>
                      </article>
                    </div>
                    
                    <div class="mt-4">
                      <div class="d-flex justify-content-between mb-2">
                        <span class="text-dp-muted small fw-bold text-uppercase tracking-wider">Progression quotidienne</span>
                        <span class="text-primary fw-bold">{{ wellbeingProgress }}%</span>
                      </div>
                      <div class="progress" style="height: 10px; border-radius: 5px; background-color: var(--dp-surface);">
                        <div class="progress-bar bg-success rounded-pill" role="progressbar" [style.width.%]="wellbeingProgress" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                      </div>
                    </div>
                  </mat-card-content>
                </mat-card>
              </div>
            </div>
          </mat-tab>
          
          <mat-tab label="Paramètres">
            <div class="row g-4 mt-2">
              <div class="col-lg-6 dp-animate-in" style="animation-delay: 0.1s;">
                <mat-card class="dp-glass-card h-100">
                  <mat-card-content class="p-4 p-md-5">
                    <h2 class="h4 font-manrope mb-4">Préférences & Rappels</h2>
                    <div class="d-flex flex-column gap-3">
                      <label class="dp-info-strip p-3 rounded-4 d-flex align-items-center gap-3 cursor-pointer dp-hover-lift m-0">
                        <input type="checkbox" class="form-check-input mt-0" style="width: 1.5em; height: 1.5em;" [(ngModel)]="reminders.test" /> 
                        <span class="fw-medium text-dark">Refaire un test chaque semaine</span>
                      </label>
                      <label class="dp-info-strip p-3 rounded-4 d-flex align-items-center gap-3 cursor-pointer dp-hover-lift m-0">
                        <input type="checkbox" class="form-check-input mt-0" style="width: 1.5em; height: 1.5em;" [(ngModel)]="reminders.journal" /> 
                        <span class="fw-medium text-dark">Écrire dans le journal chaque soir</span>
                      </label>
                      <label class="dp-info-strip p-3 rounded-4 d-flex align-items-center gap-3 cursor-pointer dp-hover-lift m-0">
                        <input type="checkbox" class="form-check-input mt-0" style="width: 1.5em; height: 1.5em;" [(ngModel)]="reminders.appointment" /> 
                        <span class="fw-medium text-dark">Recevoir un rappel avant un rendez-vous</span>
                      </label>
                    </div>
                    <button type="button" class="btn btn-primary rounded-pill px-5 mt-4 dp-hover-lift" (click)="saveReminders()">Sauvegarder les préférences</button>
                  </mat-card-content>
                </mat-card>
              </div>
              
              <div class="col-lg-6 dp-animate-in" style="animation-delay: 0.2s;">
                <mat-card class="dp-glass-card h-100">
                  <mat-card-content class="p-4 p-md-5">
                    <h2 class="h4 font-manrope mb-4">Confidentialité & Accessibilité</h2>
                    
                    <div class="d-flex flex-column gap-3 mb-4">
                      <label class="dp-info-strip p-3 rounded-4 d-flex align-items-center gap-3 cursor-pointer dp-hover-lift m-0">
                        <input type="checkbox" class="form-check-input mt-0" style="width: 1.5em; height: 1.5em;" [(ngModel)]="privacy.encryption" /> 
                        <span class="fw-medium text-dark">Chiffrement local des données sensibles</span>
                      </label>
                      <label class="dp-info-strip p-3 rounded-4 d-flex align-items-center gap-3 cursor-pointer dp-hover-lift m-0">
                        <input type="checkbox" class="form-check-input mt-0" style="width: 1.5em; height: 1.5em;" [(ngModel)]="privacy.hideIdentity" /> 
                        <span class="fw-medium text-dark">Masquer l'identité dans les échanges</span>
                      </label>
                    </div>
                    <button type="button" class="btn btn-primary rounded-pill px-4 mb-4 dp-hover-lift" (click)="savePrivacy()">Enregistrer la confidentialité</button>
                    
                    <hr class="my-4 border-light">
                    
                    <h3 class="h5 font-manrope mb-3">Accessibilité visuelle</h3>
                    <p class="text-dp-muted small mb-3">Activez une interface avec gros boutons, contraste renforcé et navigation simplifiée.</p>
                    <button type="button" class="btn rounded-pill px-4 dp-hover-lift" [ngClass]="accessibilityMode ? 'btn-warning text-dark' : 'btn-outline-primary'" (click)="toggleAccessibility()">
                      <mat-icon class="align-middle me-2">{{ accessibilityMode ? 'visibility_off' : 'visibility' }}</mat-icon>
                      {{ accessibilityMode ? 'Désactiver' : 'Activer' }} le mode accessibilité
                    </button>
                  </mat-card-content>
                </mat-card>
              </div>
              
              <div class="col-12 dp-animate-in" style="animation-delay: 0.3s;">
                <mat-card class="dp-glass-card">
                  <mat-card-content class="p-4 p-md-5">
                    <div class="d-flex align-items-center gap-3 mb-4">
                      <div class="dp-icon-circle bg-secondary bg-opacity-10 text-secondary" style="width: 48px; height: 48px;">
                        <mat-icon>folder_zip</mat-icon>
                      </div>
                      <div>
                        <h2 class="h4 font-manrope mb-1">Dossier Médical Numérique</h2>
                        <p class="text-dp-muted mb-0 small">Import / export complet de vos données</p>
                      </div>
                    </div>
                    
                    <p class="text-dp-muted mb-4">Exportez une version PDF imprimable pour votre médecin, ou un fichier JSON complet pour sauvegarder votre dossier. L'import restaure vos données de journal.</p>
                    <div class="d-flex flex-wrap gap-3">
                      <button type="button" class="btn btn-outline-secondary btn-lg rounded-pill px-4 dp-hover-lift" (click)="exportUserFolder()"><mat-icon class="align-middle me-1">picture_as_pdf</mat-icon> Exporter PDF</button>
                      <button type="button" class="btn btn-outline-primary btn-lg rounded-pill px-4 dp-hover-lift" (click)="exportUserFolderJson()"><mat-icon class="align-middle me-1">download</mat-icon> Sauvegarder (JSON)</button>
                      <label class="btn btn-primary btn-lg rounded-pill px-4 mb-0 dp-hover-lift cursor-pointer">
                        <mat-icon class="align-middle me-1">upload</mat-icon> Restaurer (JSON)
                        <input type="file" accept="application/json" hidden (change)="importUserFolder($event)" />
                      </label>
                    </div>
                  </mat-card-content>
                </mat-card>
              </div>
            </div>
          </mat-tab>

        </mat-tab-group>
      </div>

      <ng-template #notLoggedIn>
        <mat-card class="dp-glass-card mt-5 dp-animate-in mx-auto" style="max-width: 500px;">
          <mat-card-content class="p-5 text-center">
            <div class="dp-icon-circle bg-primary bg-opacity-10 text-primary mx-auto mb-4" style="width: 80px; height: 80px;">
              <mat-icon style="font-size: 2.5rem; width: 2.5rem; height: 2.5rem; margin-top: 5px;">lock</mat-icon>
            </div>
            <h2 class="h3 font-manrope mb-3">Connexion requise</h2>
            <p class="text-dp-muted mb-4 fs-5">Connectez-vous pour accéder à votre espace personnel sécurisé.</p>
            <a routerLink="/login" class="btn btn-primary btn-lg rounded-pill px-5 shadow-sm dp-hover-lift">Se connecter</a>
          </mat-card-content>
        </mat-card>
      </ng-template>
    </div>
  `,
  styles: [`
    .tracking-wider { letter-spacing: 0.05em; }
    .cursor-pointer { cursor: pointer; }
    .transition-all { transition: all 0.3s ease; }
    
    ::ng-deep .premium-tabs .mat-mdc-tab-header {
      border-bottom: 2px solid var(--dp-border);
      margin-bottom: 1.5rem;
    }
    ::ng-deep .premium-tabs .mdc-tab__text-label {
      font-family: 'Manrope', sans-serif;
      font-weight: 700;
      font-size: 1rem;
      color: var(--dp-muted);
      transition: color 0.3s ease;
      letter-spacing: 0.3px;
    }
    ::ng-deep .premium-tabs .mdc-tab--active .mdc-tab__text-label {
      color: var(--dp-primary);
    }
    ::ng-deep .premium-tabs .mdc-tab-indicator__active-indicator {
      border-color: var(--dp-primary) !important;
      border-width: 4px !important;
      border-radius: 4px 4px 0 0;
    }
    
    ::ng-deep .premium-input .mdc-text-field--outlined {
      --mdc-outlined-text-field-container-shape: 12px;
      background-color: var(--dp-surface);
    }
    
    .accessibility-mode {
      filter: contrast(1.15);
    }

    .accessibility-mode .btn,
    .accessibility-mode .dp-info-strip,
    .accessibility-mode mat-card-content {
      font-size: 1.1rem;
    }
    
    .mat-mdc-tab-body-content {
      padding-top: 0.5rem;
    }
    
    @media (max-width: 767.98px) {
      .dp-hero-section {
        padding: 2rem !important;
      }
      .dp-icon-circle {
        width: 60px !important;
        height: 60px !important;
      }
      .dp-icon-circle mat-icon {
        font-size: 2rem !important;
        width: 2rem !important;
        height: 2rem !important;
      }
    }
    .bilan-title {
      color: var(--dp-primary);
    }
    .eyebrow-color-primary {
      color: var(--dp-primary);
    }
    .user-name-color-primary {
      color: var(--dp-primary);
    }
    .stats-label-color-primary {
      color: var(--dp-primary);
    }
  `]
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  latestResult: PredictionResult | null = null;
  testHistory: PredictionResult[] = [];
  threads: DiscussionThread[] = [];
  supportRequests: SupportRequest[] = [];
  helpContents: HelpContent[] = [];
  journalEntries: JournalEntry[] = [];
  favoriteDoctors: Array<{ id: string; name: string; specialty: string; city: string }> = [];
  isLoading = true;
  selectedTabIndex = 0;
  journalForm: JournalEntry = this.createEmptyJournalEntry();
  emotionalTrend: Array<{ label: string; score: number }> = [];
  resourceCards = [
    { icon: 'bedtime', title: 'Sommeil', description: 'Routines, hygiene du sommeil et recuperation.', link: '/solutions' },
    { icon: 'air', title: 'Respiration', description: 'Exercices courts pour apaiser le stress.', link: '/solutions' },
    { icon: 'self_improvement', title: 'Gestion du stress', description: 'Outils pratiques pour reguler la tension.', link: '/solutions' },
    { icon: 'support_agent', title: 'Lignes d aide', description: 'Contacts et ressources en cas d urgence.', link: '/emergency' }
  ];
  trustedContact = { name: '', phone: '', doctor: '', hotline: '3114 / urgences locales' };
  reminders = { test: true, journal: true, appointment: true };
  privacy = { encryption: true, hideIdentity: true, roleAccess: true };
  accessibilityMode = false;
  wellbeingTasks = [
    { id: 'breathing', label: 'Faire 3 minutes de respiration', done: false },
    { id: 'walk', label: 'Marcher ou bouger 10 minutes', done: false },
    { id: 'journal', label: 'Noter une emotion et une pensee', done: false },
    { id: 'contact', label: 'Envoyer un message a une personne de confiance', done: false }
  ];
  safetyPlan = [
    { icon: 'warning', title: 'Reconnaitre le signal', text: 'Nommer ce qui se passe: pensees envahissantes, danger, impulsion ou isolement.' },
    { icon: 'phone', title: 'Contacter quelqu un', text: 'Appeler un proche, votre medecin ou une ligne d aide sans attendre.' },
    { icon: 'place', title: 'Changer de lieu', text: 'Aller dans un endroit plus sur, visible, ou rejoindre une personne de confiance.' },
    { icon: 'medical_services', title: 'Demander une aide urgente', text: 'Si le danger est immediat, contacter les urgences ou ouvrir les ressources de crise.' }
  ];

  get wellbeingProgress(): number {
    const done = this.wellbeingTasks.filter(task => task.done).length;
    return Math.round((done / this.wellbeingTasks.length) * 100);
  }

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private directoryService: DirectoryService,
    private discussionService: DiscussionService,
    private questionnaireService: QuestionnaireService,
    private solutionsService: SolutionsService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.selectedTabIndex = Number(params.get('tab') || 0);
    });

    this.authService.currentUser$.subscribe(user => {
      this.user = user;
      if (!user) {
        this.isLoading = false;
        return;
      }

      this.loadUserData(user);
      this.loadJournalEntries(user.id);
      this.loadPreferenceData(user.id);
      this.loadResources();
    });
  }

  updateProfile(): void {
    if (!this.user) return;

    this.authService.updateProfile(this.user).subscribe({
      next: updated => {
        this.user = updated;
        this.snackBar.open('Profil mis a jour.', 'Fermer', { duration: 2500 });
      }
    });
  }

  saveJournalEntry(): void {
    if (!this.user) return;

    const entry: JournalEntry = {
      ...this.journalForm,
      id: this.journalForm.id || `journal_${Date.now()}`,
      mood: Number(this.journalForm.mood || 0),
      energy: Number(this.journalForm.energy || 0),
      sleep: Number(this.journalForm.sleep || 0)
    };

    this.journalEntries = [entry, ...this.journalEntries.filter(item => item.date !== entry.date)]
      .sort((a, b) => b.date.localeCompare(a.date));
    localStorage.setItem(this.getJournalKey(this.user.id), JSON.stringify(this.journalEntries));
    this.journalForm = this.createEmptyJournalEntry();
    this.buildEmotionalTrend();
    this.snackBar.open('Journal emotionnel enregistre.', 'Fermer', { duration: 2400 });
  }

  exportUserFolder(): void {
    if (!this.user) return;

    const dossier = this.buildUserFolder();
    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (!printWindow) {
      this.snackBar.open('Impossible d ouvrir la fenetre PDF.', 'Fermer', { duration: 2500 });
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Dossier DeltaPress - ${dossier.user?.name}</title>
          <style>
            body { font-family: Arial, sans-serif; color: #1f2937; padding: 32px; line-height: 1.5; }
            h1, h2 { color: #114fba; }
            section { margin-bottom: 24px; }
            table { width: 100%; border-collapse: collapse; margin-top: 8px; }
            th, td { border: 1px solid #d8e2f0; padding: 8px; text-align: left; }
            th { background: #eef5ff; }
          </style>
        </head>
        <body>
          <h1>Dossier utilisateur DeltaPress</h1>
          <section><h2>Profil</h2><p>${dossier.user?.name} - ${dossier.user?.email}</p></section>
          <section><h2>Dernier bilan</h2><p>${dossier.latestResult ? `${dossier.latestResult.score}/${dossier.latestResult.maxScore} - ${dossier.latestResult.severityLabel}` : 'Aucun bilan'}</p></section>
          <section><h2>Historique</h2>${this.renderResultTable(dossier.testHistory)}</section>
          <section><h2>Demandes</h2>${this.renderRequestTable(dossier.supportRequests)}</section>
          <section><h2>Journal emotionnel</h2>${this.renderJournalTable(dossier.journalEntries)}</section>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  }

  exportUserFolderJson(): void {
    const blob = new Blob([JSON.stringify(this.buildUserFolder(), null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dossier-deltapress-${this.user?.id || 'utilisateur'}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  importUserFolder(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file || !this.user) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result || '{}')) as { journalEntries?: JournalEntry[] };
        this.journalEntries = data.journalEntries || [];
        localStorage.setItem(this.getJournalKey(this.user!.id), JSON.stringify(this.journalEntries));
        this.buildEmotionalTrend();
        this.snackBar.open('Dossier importe.', 'Fermer', { duration: 2400 });
      } catch {
        this.snackBar.open('Fichier de dossier invalide.', 'Fermer', { duration: 3000 });
      }
    };
    reader.readAsText(file);
    input.value = '';
  }

  saveTrustedContact(): void {
    if (!this.user) return;
    localStorage.setItem(`deltapress_trusted_${this.user.id}`, JSON.stringify(this.trustedContact));
    this.snackBar.open('Plan de securite mis a jour.', 'Fermer', { duration: 2400 });
  }

  saveReminders(): void {
    if (!this.user) return;
    localStorage.setItem(`deltapress_reminders_${this.user.id}`, JSON.stringify(this.reminders));
    this.snackBar.open('Rappels enregistres.', 'Fermer', { duration: 2400 });
  }

  savePrivacy(): void {
    if (!this.user) return;
    localStorage.setItem(`deltapress_privacy_${this.user.id}`, JSON.stringify(this.privacy));
    this.snackBar.open('Confidentialite mise a jour.', 'Fermer', { duration: 2400 });
  }

  toggleAccessibility(): void {
    this.accessibilityMode = !this.accessibilityMode;
    if (this.user) {
      localStorage.setItem(`deltapress_accessibility_${this.user.id}`, JSON.stringify(this.accessibilityMode));
    }
  }

  toggleWellbeingTask(taskId: string): void {
    this.wellbeingTasks = this.wellbeingTasks.map(task =>
      task.id === taskId ? { ...task, done: !task.done } : task
    );
    if (this.user) {
      localStorage.setItem(`deltapress_wellbeing_${this.user.id}`, JSON.stringify(this.wellbeingTasks));
    }
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

  private loadUserData(user: User): void {
    this.questionnaireService.getLatestResultForUser(user.id).subscribe(result => {
      this.latestResult = result;
    });

    this.questionnaireService.getTestHistory(user.id).subscribe(history => {
      this.testHistory = history;
      this.buildEmotionalTrend();
    });

    this.discussionService.getThreadsForUser(user.id).subscribe(threads => {
      this.threads = threads;
    });

    this.directoryService.getRequestsByUser(user.id).subscribe(requests => {
      this.supportRequests = requests;
      this.isLoading = false;
    });
  }

  private loadResources(): void {
    this.solutionsService.getHelpContents().subscribe(contents => {
      this.helpContents = contents;
    });
  }

  private loadJournalEntries(userId: string): void {
    const raw = localStorage.getItem(this.getJournalKey(userId));
    this.journalEntries = raw ? JSON.parse(raw) as JournalEntry[] : [];
    this.buildEmotionalTrend();
  }

  private loadPreferenceData(userId: string): void {
    this.trustedContact = this.readStored(`deltapress_trusted_${userId}`, this.trustedContact);
    this.reminders = this.readStored(`deltapress_reminders_${userId}`, this.reminders);
    this.privacy = this.readStored(`deltapress_privacy_${userId}`, this.privacy);
    this.accessibilityMode = this.readStored(`deltapress_accessibility_${userId}`, false);
    this.wellbeingTasks = this.readStored(`deltapress_wellbeing_${userId}`, this.wellbeingTasks);
    this.favoriteDoctors = this.readStored('deltapress_favorite_doctors', []);
  }

  private readStored<T>(key: string, fallback: T): T {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) as T : fallback;
  }

  private buildEmotionalTrend(): void {
    const journalPoints = this.journalEntries.slice(0, 7).reverse().map(entry => ({
      label: entry.date.slice(5),
      score: Math.max(5, Math.round(((entry.mood + entry.energy) / 20) * 100))
    }));

    const resultPoints = this.testHistory.slice(0, 7).reverse().map(result => ({
      label: new Date(result.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
      score: Math.max(5, Math.round(100 - (result.score / result.maxScore) * 100))
    }));

    this.emotionalTrend = journalPoints.length > 0 ? journalPoints : resultPoints;
  }

  private buildUserFolder() {
    return {
      exportedAt: new Date().toISOString(),
      user: this.user,
      latestResult: this.latestResult,
      testHistory: this.testHistory,
      supportRequests: this.supportRequests,
      threads: this.threads,
      journalEntries: this.journalEntries
    };
  }

  private renderResultTable(results: PredictionResult[]): string {
    if (results.length === 0) return '<p>Aucun test.</p>';
    return `<table><tr><th>Date</th><th>Score</th><th>Niveau</th></tr>${results.map(result =>
      `<tr><td>${new Date(result.createdAt).toLocaleDateString('fr-FR')}</td><td>${result.score}/${result.maxScore}</td><td>${result.severityLabel}</td></tr>`
    ).join('')}</table>`;
  }

  private renderRequestTable(requests: SupportRequest[]): string {
    if (requests.length === 0) return '<p>Aucune demande.</p>';
    return `<table><tr><th>Date</th><th>Type</th><th>Statut</th><th>Message</th></tr>${requests.map(request =>
      `<tr><td>${new Date(request.createdAt).toLocaleDateString('fr-FR')}</td><td>${request.type}</td><td>${request.status}</td><td>${request.message}</td></tr>`
    ).join('')}</table>`;
  }

  private renderJournalTable(entries: JournalEntry[]): string {
    if (entries.length === 0) return '<p>Aucune entree.</p>';
    return `<table><tr><th>Date</th><th>Humeur</th><th>Energie</th><th>Sommeil</th><th>Pensees</th></tr>${entries.map(entry =>
      `<tr><td>${entry.date}</td><td>${entry.mood}/10</td><td>${entry.energy}/10</td><td>${entry.sleep}h</td><td>${entry.fears ? `Peurs: ${entry.fears}. ` : ''}${entry.thoughts}</td></tr>`
    ).join('')}</table>`;
  }

  private createEmptyJournalEntry(): JournalEntry {
    return {
      id: '',
      date: new Date().toISOString().slice(0, 10),
      mood: 5,
      energy: 5,
      sleep: 7,
      fears: '',
      thoughts: ''
    };
  }

  private getJournalKey(userId: string): string {
    return `deltapress_journal_${userId}`;
  }
}
