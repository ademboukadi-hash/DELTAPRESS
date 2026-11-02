import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatSliderModule } from '@angular/material/slider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DirectoryService } from '../../services/directory.service';
import { Professional, FilterOptions, PaginatedResponse } from '../../models/index';

@Component({
  selector: 'app-directory',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatChipsModule,
    MatSliderModule,
    MatExpansionModule,
    MatPaginatorModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="container-xl py-4 py-lg-5 directory-page">
      <section class="directory-hero">
        <div class="row g-4 align-items-center">
          <div class="col-lg-7">
            <span class="dp-eyebrow mb-3">Annuaire</span>
            <h1 class="display-6 fw-bold mb-2">Trouvez rapidement le bon professionnel.</h1>
            <p class="text-dp-muted mb-0">
              Filtrez par ville, specialite, experience et disponibilite dans une interface
              plus lisible et plus orientee action.
            </p>
          </div>

          <div class="col-lg-5">
            <div class="hero-summary">
              <div>
                <strong>{{ professionalsResponse?.total || 0 }}</strong>
                <span>professionnel(s) trouves</span>
              </div>
              <div>
                <strong>{{ specialties.length }}</strong>
                <span>specialites disponibles</span>
              </div>
              <div>
                <strong>{{ cities.length }}</strong>
                <span>villes referencees</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div class="view-toggle" role="tablist" aria-label="Modes d'affichage">
        <button type="button" class="toggle-btn" [class.active]="viewMode === 'list'" (click)="toggleView('list')">
          <mat-icon>view_list</mat-icon>
          Liste
        </button>
        <button type="button" class="toggle-btn" [class.active]="viewMode === 'map'" (click)="toggleView('map')">
          <mat-icon>map</mat-icon>
          Carte
        </button>
      </div>

      <mat-card class="filters-card">
        <mat-card-content class="filters-shell">
          <div class="filters-header">
            <div class="filters-heading">
              <span class="filters-kicker">Recherche guidee</span>
              <h2>Affinez votre recherche</h2>
              <p>
                Combinez ville, specialite et criteres pratiques pour trouver plus vite
                le professionnel qui vous correspond.
              </p>
            </div>

            <div class="filters-status">
              <div class="status-pill">
                <strong>{{ professionalsResponse?.total || 0 }}</strong>
                <span>resultats</span>
              </div>
              <div class="status-pill active" *ngIf="activeFilterCount > 0">
                <strong>{{ activeFilterCount }}</strong>
                <span>filtre(s) actif(s)</span>
              </div>
            </div>
          </div>

          <div class="row g-3 align-items-stretch">
            <div class="col-md-6 col-xl-3">
              <mat-form-field appearance="outline">
                <mat-label>Ville</mat-label>
                <mat-select [(ngModel)]="filters.city" (selectionChange)="applyFilters()">
                  <mat-option value="">Toutes les villes</mat-option>
                  <mat-option *ngFor="let city of cities" [value]="city">{{ city }}</mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            <div class="col-md-6 col-xl-3">
              <mat-form-field appearance="outline">
                <mat-label>Specialite</mat-label>
                <mat-select [(ngModel)]="filters.specialty" (selectionChange)="applyFilters()">
                  <mat-option value="">Toutes les specialites</mat-option>
                  <mat-option *ngFor="let specialty of specialties" [value]="specialty">{{ specialty }}</mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            <div class="col-md-6 col-xl-4">
              <mat-form-field appearance="outline">
                <mat-label>Recherche</mat-label>
                <input matInput [(ngModel)]="filters.searchTerm" placeholder="Nom, specialite..." />
              </mat-form-field>
            </div>

            <div class="col-md-6 col-xl-2">
              <div class="filter-actions">
                <button type="button" class="btn btn-primary search-btn" (click)="applyFilters()">
                  <mat-icon>search</mat-icon>
                  Rechercher
                </button>
                <button type="button" class="btn btn-outline-primary reset-btn" (click)="resetFilters()">
                  <mat-icon>refresh</mat-icon>
                  Reinitialiser
                </button>
              </div>
            </div>
          </div>

          <div class="filter-toggles">
            <span class="toggles-label">Raccourcis utiles</span>

            <div class="toggle-pills">
              <button
                type="button"
                class="toggle-pill"
                [class.active]="filters.onlineOnly"
                (click)="toggleFilter('onlineOnly')"
              >
                <span class="toggle-icon">
                  <mat-icon>computer</mat-icon>
                </span>
                <span class="toggle-copy">
                  <strong>Consultation en ligne</strong>
                  <small>Afficher les profils disponibles a distance</small>
                </span>
              </button>

              <button
                type="button"
                class="toggle-pill"
                [class.active]="filters.acceptsNewPatients"
                (click)="toggleFilter('acceptsNewPatients')"
              >
                <span class="toggle-icon">
                  <mat-icon>person_add</mat-icon>
                </span>
                <span class="toggle-copy">
                  <strong>Nouveaux patients</strong>
                  <small>Mettre en avant les profils ouverts actuellement</small>
                </span>
              </button>
            </div>
          </div>

          <mat-expansion-panel class="advanced-filters">
            <mat-expansion-panel-header>
              <mat-panel-title>
                <span class="advanced-title-wrap">
                  <span class="advanced-title-icon">
                    <mat-icon>tune</mat-icon>
                  </span>
                  <span>
                    <strong>Filtres avances</strong>
                    <small>Affinez par tarif, experience, langues et disponibilite</small>
                  </span>
                </span>
              </mat-panel-title>
            </mat-expansion-panel-header>

            <div class="row g-4 pt-3">
              <div class="col-lg-6">
                <div class="advanced-field">
                  <label>Prix max: {{ advancedFilters.maxPrice }} EUR</label>
                  <mat-slider min="50" max="300" step="10" discrete>
                    <input matSliderThumb [(ngModel)]="advancedFilters.maxPrice" (change)="applyFilters()" />
                  </mat-slider>
                </div>
              </div>

              <div class="col-lg-6">
                <div class="advanced-field">
                  <label>Experience min: {{ advancedFilters.minExperience }} ans</label>
                  <mat-slider min="0" max="30" step="1" discrete>
                    <input matSliderThumb [(ngModel)]="advancedFilters.minExperience" (change)="applyFilters()" />
                  </mat-slider>
                </div>
              </div>

              <div class="col-lg-6">
                <mat-form-field appearance="outline">
                  <mat-label>Langues</mat-label>
                  <mat-select [(ngModel)]="advancedFilters.languages" multiple (selectionChange)="applyFilters()">
                    <mat-option *ngFor="let lang of languages" [value]="lang">{{ lang }}</mat-option>
                  </mat-select>
                </mat-form-field>
              </div>

              <div class="col-lg-6">
                <mat-form-field appearance="outline">
                  <mat-label>Disponibilite</mat-label>
                  <mat-select [(ngModel)]="advancedFilters.availability" (selectionChange)="applyFilters()">
                    <mat-option value="any">Toutes</mat-option>
                    <mat-option value="today">Aujourd'hui</mat-option>
                    <mat-option value="this_week">Cette semaine</mat-option>
                  </mat-select>
                </mat-form-field>
              </div>
            </div>
          </mat-expansion-panel>
        </mat-card-content>
      </mat-card>

      <div class="loading-container" *ngIf="isLoading">
        <mat-spinner diameter="50"></mat-spinner>
        <p>Chargement des professionnels...</p>
      </div>

      <section class="map-panel" *ngIf="!isLoading && viewMode === 'map'">
        <mat-icon>map</mat-icon>
        <h2>Vue carte</h2>
        <p>L'integration cartographique pourra etre ajoutee sans changer ce nouveau layout.</p>
        <span>{{ professionalsResponse?.total || 0 }} professionnels affiches</span>
      </section>

      <section class="results-panel" *ngIf="!isLoading && viewMode === 'list'">
        <div class="results-header">
          <p>{{ professionalsResponse?.total || 0 }} professionnel(s) trouves</p>
        </div>

        <div class="row g-4">
          <div class="col-md-6 col-xl-4" *ngFor="let pro of professionalsResponse?.data">
            <mat-card class="professional-card h-100">
              <mat-card-content class="p-4 d-flex flex-column h-100">
                <div class="professional-top">
                  <div class="professional-avatar">
                    <mat-icon>person</mat-icon>
                  </div>
                  <div>
                    <h3>{{ pro.firstName }} {{ pro.lastName }}</h3>
                    <p class="professional-title">{{ getTitleLabel(pro.title) }}</p>
                  </div>
                </div>

                <div class="professional-badges">
                  <mat-chip-set>
                    <mat-chip *ngIf="pro.verified" color="primary" selected>
                      <mat-icon>verified</mat-icon>
                      Verifie
                    </mat-chip>
                    <mat-chip *ngIf="pro.onlineConsultation">
                      <mat-icon>computer</mat-icon>
                      En ligne
                    </mat-chip>
                  </mat-chip-set>
                </div>

                <div class="professional-info">
                  <p><mat-icon>location_on</mat-icon>{{ pro.location.city }}</p>
                  <p *ngIf="pro.experience"><mat-icon>work</mat-icon>{{ pro.experience }} ans d'experience</p>
                  <p *ngIf="pro.pricing"><mat-icon>euro</mat-icon>{{ pro.pricing.consultation }} EUR la consultation</p>
                </div>

                <div class="specialties">
                  <mat-chip-set>
                    <mat-chip *ngFor="let specialty of pro.specialties.slice(0, 3)">
                      {{ specialty }}
                    </mat-chip>
                  </mat-chip-set>
                </div>

                <div class="card-actions mt-auto">
                  <a [routerLink]="['/directory', pro.id]" class="btn btn-primary rounded-pill">
                    Voir le profil
                  </a>
                  <a [href]="'tel:' + pro.contact.phone" class="btn btn-outline-primary rounded-pill">
                    Appeler
                  </a>
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        </div>

        <mat-paginator
          *ngIf="professionalsResponse && professionalsResponse.totalPages > 1"
          [length]="professionalsResponse.total"
          [pageSize]="pagination.limit"
          [pageIndex]="pagination.page - 1"
          [pageSizeOptions]="[10, 20, 50]"
          (page)="onPageChange($event)"
        ></mat-paginator>
      </section>

      <section class="no-results" *ngIf="!isLoading && professionalsResponse?.data?.length === 0">
        <mat-icon>search_off</mat-icon>
        <h2>Aucun professionnel trouve</h2>
        <p>Essayez d'ajuster vos criteres de recherche pour elargir les resultats.</p>
        <button type="button" class="btn btn-primary rounded-pill px-4" (click)="resetFilters()">
          Reinitialiser les filtres
        </button>
      </section>
    </div>
  `,
  styles: [`
    .directory-hero {
      margin-bottom: 1.5rem;
      padding: 1.6rem;
      border-radius: 2rem;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.96), rgba(243, 249, 255, 0.94));
      border: 1px solid rgba(17, 79, 186, 0.08);
      box-shadow: 0 24px 55px rgba(21, 48, 74, 0.08);
    }

    .hero-summary {
      display: grid;
      gap: 1rem;
      grid-template-columns: repeat(3, 1fr);
    }

    .hero-summary div {
      padding: 1rem;
      border-radius: 1.35rem;
      background: rgba(31, 111, 235, 0.06);
      text-align: center;
    }

    .hero-summary strong {
      display: block;
      font-family: 'Manrope', sans-serif;
      font-size: 1.45rem;
      font-weight: 800;
      color: var(--dp-primary-dark);
    }

    .hero-summary span {
      color: var(--dp-muted);
      font-size: 0.9rem;
    }

    .view-toggle {
      display: inline-flex;
      gap: 0.65rem;
      padding: 0.45rem;
      margin-bottom: 1.5rem;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.88);
      border: 1px solid rgba(17, 79, 186, 0.08);
      box-shadow: 0 14px 30px rgba(21, 48, 74, 0.06);
    }

    .toggle-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      padding: 0.7rem 1rem;
      border: 0;
      border-radius: 999px;
      background: transparent;
      color: var(--dp-muted);
      font-weight: 700;
    }

    .toggle-btn.active {
      background: var(--dp-primary);
      color: white;
      box-shadow: 0 14px 24px rgba(31, 111, 235, 0.25);
    }

    .filters-card {
      overflow: hidden;
      margin-bottom: 1.75rem;
    }

    .filters-shell {
      padding: clamp(1.2rem, 1vw + 1rem, 1.75rem);
    }

    .filters-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1.25rem;
      margin-bottom: 1.35rem;
    }

    .filters-heading {
      max-width: 42rem;
    }

    .filters-kicker {
      display: inline-block;
      margin-bottom: 0.6rem;
      color: var(--dp-primary-dark);
      font-size: 0.78rem;
      font-weight: 800;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    .filters-heading h2 {
      margin: 0 0 0.35rem;
      font-size: clamp(1.35rem, 0.8vw + 1.1rem, 1.8rem);
    }

    .filters-heading p {
      margin: 0;
      color: var(--dp-muted);
      line-height: 1.65;
    }

    .filters-status {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
      gap: 0.75rem;
    }

    .status-pill {
      min-width: 8rem;
      padding: 0.9rem 1rem;
      border-radius: 1.2rem;
      background: rgba(31, 111, 235, 0.06);
      border: 1px solid rgba(17, 79, 186, 0.08);
      text-align: center;
    }

    .status-pill.active {
      background: rgba(15, 139, 141, 0.08);
      border-color: rgba(15, 139, 141, 0.14);
    }

    .status-pill strong {
      display: block;
      font-family: 'Manrope', sans-serif;
      font-size: 1.15rem;
      font-weight: 800;
      color: var(--dp-primary-dark);
    }

    .status-pill.active strong {
      color: #0b7274;
    }

    .status-pill span {
      color: var(--dp-muted);
      font-size: 0.86rem;
      font-weight: 700;
    }

    :host ::ng-deep .filters-card .mat-mdc-text-field-wrapper {
      background: linear-gradient(180deg, rgba(250, 252, 255, 0.98), rgba(246, 249, 255, 0.98));
      border-radius: 1rem !important;
    }

    :host ::ng-deep .filters-card .mat-mdc-form-field-infix {
      min-height: 3.7rem;
      padding-top: 1rem !important;
      padding-bottom: 0.7rem !important;
    }

    .filter-actions {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      height: 100%;
      justify-content: center;
    }

    .filter-actions .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.55rem;
      min-height: 3.5rem;
      border-radius: 1rem;
      font-weight: 700;
    }

    .search-btn {
      box-shadow: 0 16px 30px rgba(31, 111, 235, 0.18);
    }

    .filter-actions mat-icon {
      font-size: 1.15rem;
      width: 1.15rem;
      height: 1.15rem;
    }

    .filter-toggles {
      margin: 1rem 0 0.35rem;
    }

    .toggles-label {
      display: block;
      margin-bottom: 0.8rem;
      color: var(--dp-muted);
      font-size: 0.82rem;
      font-weight: 800;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }

    .toggle-pills {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0.9rem;
    }

    .toggle-pill {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 0.9rem;
      padding: 0.95rem 1rem;
      border-radius: 1.1rem;
      border: 1px solid rgba(17, 79, 186, 0.12);
      background: rgba(255, 255, 255, 0.9);
      text-align: left;
      transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
    }

    .toggle-pill:hover {
      transform: translateY(-2px);
      border-color: rgba(31, 111, 235, 0.3);
      box-shadow: 0 18px 28px rgba(21, 48, 74, 0.08);
    }

    .toggle-pill.active {
      background: linear-gradient(135deg, rgba(31, 111, 235, 0.1), rgba(15, 139, 141, 0.08));
      border-color: rgba(31, 111, 235, 0.3);
      box-shadow: 0 18px 28px rgba(31, 111, 235, 0.12);
    }

    .toggle-icon {
      width: 2.8rem;
      height: 2.8rem;
      border-radius: 0.95rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: rgba(31, 111, 235, 0.1);
      color: var(--dp-primary);
      flex-shrink: 0;
    }

    .toggle-pill.active .toggle-icon {
      background: rgba(255, 255, 255, 0.7);
      color: var(--dp-primary-dark);
    }

    .toggle-copy {
      display: flex;
      flex-direction: column;
      gap: 0.1rem;
    }

    .toggle-copy strong {
      font-size: 0.98rem;
      color: var(--dp-text);
    }

    .toggle-copy small {
      color: var(--dp-muted);
      line-height: 1.4;
    }

    .advanced-filters {
      margin-top: 1rem;
      border-radius: 1.25rem !important;
      overflow: hidden;
      border: 1px solid rgba(17, 79, 186, 0.08);
      background: linear-gradient(180deg, rgba(247, 249, 255, 0.94), rgba(255, 255, 255, 0.96));
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.7);
    }

    :host ::ng-deep .advanced-filters .mat-expansion-panel-header {
      min-height: 4.6rem;
      padding-inline: 1.15rem;
    }

    :host ::ng-deep .advanced-filters .mat-expansion-panel-header.mat-expanded {
      height: auto;
    }

    :host ::ng-deep .advanced-filters .mat-content {
      align-items: center;
    }

    .advanced-title-wrap {
      display: inline-flex;
      align-items: center;
      gap: 0.9rem;
    }

    .advanced-title-icon {
      width: 2.6rem;
      height: 2.6rem;
      border-radius: 0.9rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: rgba(31, 111, 235, 0.08);
      color: var(--dp-primary);
      flex-shrink: 0;
    }

    .advanced-title-wrap strong {
      display: block;
      color: var(--dp-text);
      font-size: 1rem;
    }

    .advanced-title-wrap small {
      display: block;
      margin-top: 0.1rem;
      color: var(--dp-muted);
      font-size: 0.88rem;
    }

    .advanced-field label {
      display: block;
      margin-bottom: 0.6rem;
      color: var(--dp-muted);
      font-weight: 700;
    }

    .loading-container {
      text-align: center;
      padding: 3rem 1rem;
    }

    .loading-container p {
      margin-top: 1rem;
      color: var(--dp-muted);
    }

    .map-panel,
    .no-results {
      padding: 2.5rem 1.5rem;
      border-radius: 2rem;
      background: rgba(255, 255, 255, 0.92);
      border: 1px solid rgba(17, 79, 186, 0.08);
      box-shadow: 0 24px 55px rgba(21, 48, 74, 0.08);
      text-align: center;
    }

    .map-panel mat-icon,
    .no-results mat-icon {
      font-size: 3rem;
      width: 3rem;
      height: 3rem;
      color: var(--dp-primary);
      margin-bottom: 0.75rem;
    }

    .map-panel span {
      display: inline-block;
      margin-top: 0.75rem;
      color: var(--dp-muted);
      font-weight: 700;
    }

    .results-header {
      margin-bottom: 1rem;
      color: var(--dp-muted);
      font-weight: 700;
    }

    .professional-card {
      transition: transform 0.22s ease, box-shadow 0.22s ease;
    }

    .professional-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 26px 45px rgba(21, 48, 74, 0.14) !important;
    }

    .professional-top {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .professional-top h3 {
      margin: 0 0 0.25rem;
      font-size: 1.1rem;
    }

    .professional-title {
      margin: 0;
      color: var(--dp-muted);
    }

    .professional-avatar {
      width: 3.5rem;
      height: 3.5rem;
      border-radius: 1.2rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: rgba(31, 111, 235, 0.1);
      color: var(--dp-primary);
      flex-shrink: 0;
    }

    .professional-badges {
      margin-bottom: 1rem;
    }

    .professional-info {
      display: grid;
      gap: 0.55rem;
      margin-bottom: 1rem;
    }

    .professional-info p {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      margin: 0;
      color: var(--dp-muted);
    }

    .professional-info mat-icon {
      color: var(--dp-primary);
      font-size: 1.1rem;
      width: 1.1rem;
      height: 1.1rem;
    }

    .specialties {
      margin-bottom: 1.25rem;
    }

    .card-actions {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    @media (max-width: 991.98px) {
      .hero-summary {
        grid-template-columns: 1fr 1fr;
      }

      .filters-header {
        flex-direction: column;
      }

      .filters-status {
        justify-content: flex-start;
      }
    }

    @media (max-width: 575.98px) {
      .hero-summary {
        grid-template-columns: 1fr;
      }

      .toggle-pills {
        grid-template-columns: 1fr;
      }

      .filter-actions,
      .card-actions {
        flex-direction: column;
      }

      .filter-actions .btn,
      .card-actions .btn {
        width: 100%;
      }
    }
  `]
})
export class DirectoryComponent implements OnInit {
  professionalsResponse: PaginatedResponse<Professional> | null = null;
  isLoading = true;
  viewMode: 'list' | 'map' = 'list';

  filters: FilterOptions = {
    city: '',
    specialty: '',
    searchTerm: '',
    onlineOnly: false,
    acceptsNewPatients: false
  };

  advancedFilters = {
    maxPrice: 200,
    minExperience: 0,
    languages: [] as string[],
    availability: 'any' as 'any' | 'today' | 'this_week'
  };

  pagination = {
    page: 1,
    limit: 10
  };

  cities: string[] = [];
  specialties: string[] = [];
  languages: string[] = ['Francais', 'Anglais', 'Espagnol', 'Arabe'];

  constructor(private directoryService: DirectoryService) {}

  get activeFilterCount(): number {
    let count = 0;

    if (this.filters.city) count++;
    if (this.filters.specialty) count++;
    if (this.filters.searchTerm?.trim()) count++;
    if (this.filters.onlineOnly) count++;
    if (this.filters.acceptsNewPatients) count++;
    if (this.advancedFilters.maxPrice !== 200) count++;
    if (this.advancedFilters.minExperience > 0) count++;
    if (this.advancedFilters.languages.length > 0) count++;
    if (this.advancedFilters.availability !== 'any') count++;

    return count;
  }

  ngOnInit(): void {
    this.loadFiltersData();
    this.loadProfessionals();
  }

  toggleView(mode: 'list' | 'map'): void {
    this.viewMode = mode;
  }

  private loadFiltersData(): void {
    this.directoryService.getCities().subscribe(cities => this.cities = cities);
    this.directoryService.getSpecialties().subscribe(specialties => this.specialties = specialties);
  }

  private loadProfessionals(): void {
    this.isLoading = true;
    this.directoryService.searchProfessionals(this.filters, this.pagination).subscribe({
      next: (response) => {
        this.professionalsResponse = response;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    this.pagination.page = 1;
    this.loadProfessionals();
  }

  resetFilters(): void {
    this.filters = {
      city: '',
      specialty: '',
      searchTerm: '',
      onlineOnly: false,
      acceptsNewPatients: false
    };
    this.advancedFilters = {
      maxPrice: 200,
      minExperience: 0,
      languages: [],
      availability: 'any'
    };
    this.pagination.page = 1;
    this.loadProfessionals();
  }

  toggleFilter(filterName: keyof FilterOptions): void {
    (this.filters[filterName] as boolean) = !this.filters[filterName] as boolean;
    this.applyFilters();
  }

  onPageChange(event: PageEvent): void {
    this.pagination.page = event.pageIndex + 1;
    this.pagination.limit = event.pageSize;
    this.loadProfessionals();
  }

  getTitleLabel(title: string): string {
    const labels: { [key: string]: string } = {
      psychiatrist: 'Psychiatre',
      psychologist: 'Psychologue',
      therapist: 'Therapeute',
      counselor: 'Conseiller'
    };
    return labels[title] || title;
  }
}
