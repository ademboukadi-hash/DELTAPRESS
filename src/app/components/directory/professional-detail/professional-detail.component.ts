import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../services/auth.service';
import { DirectoryService, ContactMessage } from '../../../services/directory.service';
import { Professional } from '../../../models/index';

@Component({
  selector: 'app-professional-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatListModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule
  ],
  template: `
    <div class="professional-detail-container">
      <div class="loading-container" *ngIf="isLoading">
        <mat-spinner diameter="50"></mat-spinner>
        <p>Chargement...</p>
      </div>

      <div class="professional-content" *ngIf="!isLoading && professional">
        <!-- Back Button -->
        <a mat-button routerLink="/directory" class="back-button">
          <mat-icon>arrow_back</mat-icon>
          Retour à l'annuaire
        </a>

        <!-- Header Card -->
        <mat-card class="header-card">
          <div class="header-content">
            <div class="profile-avatar">
              <mat-icon>person</mat-icon>
            </div>
            <div class="profile-info">
              <h1>{{ professional.firstName }} {{ professional.lastName }}</h1>
              <p class="title">{{ getTitleLabel(professional.title) }}</p>
              <mat-chip-set>
                <mat-chip *ngIf="professional.verified" color="primary" selected>
                  <mat-icon>verified</mat-icon>
                  Profil vérifié
                </mat-chip>
                <mat-chip *ngIf="professional.onlineConsultation">
                  <mat-icon>computer</mat-icon>
                  Consultation en ligne
                </mat-chip>
                <mat-chip *ngIf="professional.acceptsNewPatients">
                  <mat-icon>person_add</mat-icon>
                  Accepte nouveaux patients
                </mat-chip>
              </mat-chip-set>
            </div>
            <div class="quick-actions">
              <a mat-raised-button color="primary" [href]="'tel:' + professional.contact.phone">
                <mat-icon>phone</mat-icon>
                Appeler
              </a>
              <a mat-stroked-button [href]="'mailto:' + professional.contact.email">
                <mat-icon>email</mat-icon>
                Email
              </a>
              <button mat-stroked-button type="button" (click)="toggleFavorite()">
                <mat-icon>{{ isFavorite ? 'favorite' : 'favorite_border' }}</mat-icon>
                {{ isFavorite ? 'Favori' : 'Ajouter favori' }}
              </button>
            </div>
          </div>
        </mat-card>

        <div class="detail-grid">
          <!-- Left Column -->
          <div class="detail-column">
            <!-- About Card -->
            <mat-card class="detail-card">
              <mat-card-header>
                <mat-card-title>À propos</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <p *ngIf="professional.bio">{{ professional.bio }}</p>
                <p *ngIf="!professional.bio">
                  Aucune biographie disponible pour ce professionnel.
                </p>

                <mat-divider class="section-divider"></mat-divider>

                <h3>Spécialités</h3>
                <mat-chip-set>
                  <mat-chip *ngFor="let specialty of professional.specialties">
                    {{ specialty }}
                  </mat-chip>
                </mat-chip-set>

                <h3>Langues</h3>
                <mat-chip-set>
                  <mat-chip *ngFor="let language of professional.languages" color="accent">
                    {{ language }}
                  </mat-chip>
                </mat-chip-set>
              </mat-card-content>
            </mat-card>

            <!-- Education Card -->
            <mat-card class="detail-card">
              <mat-card-header>
                <mat-card-title>Formation & Expérience</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <p *ngIf="professional.experience">
                  <strong>{{ professional.experience }} ans</strong> d'expérience
                </p>

                <h3>Diplômes</h3>
                <mat-list>
                  <mat-list-item *ngFor="let edu of professional.education">
                    <mat-icon matListItemIcon>school</mat-icon>
                    <div matListItemTitle>{{ edu }}</div>
                  </mat-list-item>
                </mat-list>

                <h3>Certifications</h3>
                <mat-list>
                  <mat-list-item *ngFor="let cert of professional.certifications">
                    <mat-icon matListItemIcon>verified</mat-icon>
                    <div matListItemTitle>{{ cert }}</div>
                  </mat-list-item>
                </mat-list>
              </mat-card-content>
            </mat-card>
          </div>

          <!-- Right Column -->
          <div class="detail-column">
            <!-- Contact Card -->
            <mat-card class="detail-card">
              <mat-card-header>
                <mat-card-title>Contact</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <mat-list>
                  <mat-list-item>
                    <mat-icon matListItemIcon>phone</mat-icon>
                    <div matListItemTitle>
                      <a [href]="'tel:' + professional.contact.phone">{{ professional.contact.phone }}</a>
                    </div>
                  </mat-list-item>
                  <mat-list-item>
                    <mat-icon matListItemIcon>email</mat-icon>
                    <div matListItemTitle>
                      <a [href]="'mailto:' + professional.contact.email">{{ professional.contact.email }}</a>
                    </div>
                  </mat-list-item>
                  <mat-list-item *ngIf="professional.contact.website">
                    <mat-icon matListItemIcon>language</mat-icon>
                    <div matListItemTitle>
                      <a [href]="professional.contact.website" target="_blank">Site web</a>
                    </div>
                  </mat-list-item>
                  <mat-list-item *ngIf="professional.contact.whatsapp">
                    <mat-icon matListItemIcon>chat</mat-icon>
                    <div matListItemTitle>WhatsApp disponible</div>
                  </mat-list-item>
                </mat-list>

                <mat-divider class="section-divider"></mat-divider>

                <h3>Adresse</h3>
                <p>
                  {{ professional.location.address }}<br>
                  {{ professional.location.postalCode }} {{ professional.location.city }}<br>
                  {{ professional.location.country }}
                </p>
              </mat-card-content>
            </mat-card>

            <mat-card class="detail-card">
              <mat-card-header>
                <mat-card-title>Message ou rendez-vous</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <div class="contact-form">
                  <mat-form-field appearance="outline">
                    <mat-label>Nom</mat-label>
                    <input matInput [(ngModel)]="contactForm.name" />
                  </mat-form-field>
                  <mat-form-field appearance="outline">
                    <mat-label>Email</mat-label>
                    <input matInput type="email" [(ngModel)]="contactForm.email" />
                  </mat-form-field>
                  <label class="field-label">Type de demande</label>
                  <select class="form-select" [(ngModel)]="contactForm.type">
                    <option value="message">Message</option>
                    <option value="appointment">Prise de rendez-vous</option>
                  </select>
                  <div class="appointment-grid" *ngIf="contactForm.type === 'appointment'">
                    <mat-form-field appearance="outline">
                      <mat-label>Date souhaitee</mat-label>
                      <input matInput type="date" [(ngModel)]="appointment.date" />
                    </mat-form-field>
                    <mat-form-field appearance="outline">
                      <mat-label>Heure souhaitee</mat-label>
                      <input matInput type="time" [(ngModel)]="appointment.time" />
                    </mat-form-field>
                  </div>
                  <label class="field-label">Contact prefere</label>
                  <select class="form-select" [(ngModel)]="contactForm.preferredContact">
                    <option value="email">Email</option>
                    <option value="phone">Telephone</option>
                    <option value="whatsapp">WhatsApp</option>
                  </select>
                  <label class="field-label">Urgence</label>
                  <select class="form-select" [(ngModel)]="contactForm.urgency">
                    <option value="low">Faible</option>
                    <option value="medium">Moyenne</option>
                    <option value="high">Haute</option>
                  </select>
                  <mat-form-field appearance="outline">
                    <mat-label>Message</mat-label>
                    <textarea matInput rows="5" [(ngModel)]="contactForm.message"></textarea>
                  </mat-form-field>
                  <button mat-raised-button color="primary" type="button" (click)="sendContactRequest()">
                    <mat-icon>send</mat-icon>
                    Envoyer
                  </button>
                  <button mat-stroked-button type="button" (click)="startTeleconsultation()" *ngIf="professional.onlineConsultation">
                    <mat-icon>videocam</mat-icon>
                    Teleconsultation audio/video
                  </button>
                </div>
              </mat-card-content>
            </mat-card>

            <!-- Pricing Card -->
            <mat-card class="detail-card" *ngIf="professional.pricing">
              <mat-card-header>
                <mat-card-title>Tarifs</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <p class="price">
                  <mat-icon>euro</mat-icon>
                  <strong>{{ professional.pricing.consultation }}€</strong> la consultation
                </p>
                <p *ngIf="professional.pricing.insuranceAccepted?.length">
                  <mat-icon>health_and_safety</mat-icon>
                  Remboursement : {{ professional.pricing.insuranceAccepted?.join(', ') }}
                </p>
              </mat-card-content>
            </mat-card>

            <!-- Availability Card -->
            <mat-card class="detail-card">
              <mat-card-header>
                <mat-card-title>Disponibilité</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <mat-list>
                  <mat-list-item *ngIf="professional.availability.monday">
                    <div matListItemTitle>Lundi</div>
                    <div matListItemLine>{{ formatAvailability(professional.availability.monday) }}</div>
                  </mat-list-item>
                  <mat-list-item *ngIf="professional.availability.tuesday">
                    <div matListItemTitle>Mardi</div>
                    <div matListItemLine>{{ formatAvailability(professional.availability.tuesday) }}</div>
                  </mat-list-item>
                  <mat-list-item *ngIf="professional.availability.wednesday">
                    <div matListItemTitle>Mercredi</div>
                    <div matListItemLine>{{ formatAvailability(professional.availability.wednesday) }}</div>
                  </mat-list-item>
                  <mat-list-item *ngIf="professional.availability.thursday">
                    <div matListItemTitle>Jeudi</div>
                    <div matListItemLine>{{ formatAvailability(professional.availability.thursday) }}</div>
                  </mat-list-item>
                  <mat-list-item *ngIf="professional.availability.friday">
                    <div matListItemTitle>Vendredi</div>
                    <div matListItemLine>{{ formatAvailability(professional.availability.friday) }}</div>
                  </mat-list-item>
                </mat-list>
              </mat-card-content>
            </mat-card>
          </div>
        </div>
      </div>

      <!-- Not Found -->
      <div class="not-found" *ngIf="!isLoading && !professional">
        <mat-icon>search_off</mat-icon>
        <h2>Professionnel non trouvé</h2>
        <a mat-raised-button color="primary" routerLink="/directory">
          Retour à l'annuaire
        </a>
      </div>
    </div>
  `,
  styles: [`
    .professional-detail-container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 24px;
    }

    .loading-container {
      text-align: center;
      padding: 48px;
    }

    .loading-container p {
      margin-top: 16px;
      color: #666;
    }

    .back-button {
      margin-bottom: 16px;
    }

    .header-card {
      margin-bottom: 24px;
    }

    .header-content {
      display: flex;
      align-items: center;
      gap: 24px;
      padding: 16px;
      flex-wrap: wrap;
    }

    .profile-avatar {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background-color: #e3f2fd;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .profile-avatar mat-icon {
      font-size: 60px;
      width: 60px;
      height: 60px;
      color: #1976d2;
    }

    .profile-info {
      flex: 1;
    }

    .profile-info h1 {
      margin: 0 0 8px 0;
      font-size: 1.75rem;
      color: #333;
    }

    .title {
      font-size: 1.1rem;
      color: #666;
      margin: 0 0 12px 0;
    }

    .quick-actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    .detail-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 24px;
    }

    .detail-column {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .detail-card {
      height: fit-content;
    }

    .detail-card h3 {
      margin: 16px 0 8px 0;
      color: #333;
      font-size: 1rem;
    }

    .section-divider {
      margin: 24px 0;
    }

    .price {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 1.25rem;
      margin-bottom: 12px;
    }

    .price mat-icon {
      color: #4caf50;
    }

    .contact-form {
      display: grid;
      gap: 12px;
    }

    .appointment-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
    }

    .field-label {
      font-weight: 700;
      color: #333;
      margin-bottom: -6px;
    }

    .not-found {
      text-align: center;
      padding: 64px;
    }

    .not-found mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #9e9e9e;
      margin-bottom: 16px;
    }

    .not-found h2 {
      color: #333;
      margin-bottom: 24px;
    }

    @media (max-width: 600px) {
      .header-content {
        flex-direction: column;
        text-align: center;
      }

      .detail-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ProfessionalDetailComponent implements OnInit {
  professional: Professional | null = null;
  isLoading = true;
  isFavorite = false;
  appointment = {
    date: '',
    time: ''
  };
  contactForm: ContactMessage = {
    name: '',
    email: '',
    message: '',
    preferredContact: 'email',
    urgency: 'medium',
    type: 'message'
  };

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private directoryService: DirectoryService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.contactForm.name = user.name;
      this.contactForm.email = user.email;
      this.contactForm.userId = user.id;
    }

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProfessional(id);
    } else {
      this.isLoading = false;
    }
  }

  private loadProfessional(id: string): void {
    this.directoryService.getProfessionalById(id).subscribe({
      next: (professional) => {
        this.professional = professional;
        this.isFavorite = this.getFavorites().some(item => item.id === professional.id);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  getTitleLabel(title: string): string {
    const labels: { [key: string]: string } = {
      'psychiatrist': 'Psychiatre',
      'psychologist': 'Psychologue',
      'therapist': 'Thérapeute',
      'counselor': 'Conseiller'
    };
    return labels[title] || title;
  }

  formatAvailability(slots: any[]): string {
    if (!slots || slots.length === 0) return 'Non disponible';
    return slots.map(s => `${s.start} - ${s.end}`).join(', ');
  }

  sendContactRequest(): void {
    if (!this.professional || !this.contactForm.name || !this.contactForm.email || !this.contactForm.message) {
      this.snackBar.open('Completez le nom, email et message.', 'Fermer', { duration: 2800 });
      return;
    }

    const message: ContactMessage = {
      ...this.contactForm,
      message: this.contactForm.type === 'appointment' && (this.appointment.date || this.appointment.time)
        ? `${this.contactForm.message}\nSouhait rendez-vous: ${this.appointment.date || 'date a definir'} ${this.appointment.time || ''}`.trim()
        : this.contactForm.message
    };

    this.directoryService.contactProfessional(this.professional.id, message).subscribe(() => {
      this.snackBar.open('Demande envoyee au professionnel.', 'Fermer', { duration: 2800 });
      this.contactForm.message = '';
      this.contactForm.type = 'message';
    });
  }

  toggleFavorite(): void {
    if (!this.professional) return;

    const favorite = {
      id: this.professional.id,
      name: `${this.professional.firstName} ${this.professional.lastName}`,
      specialty: this.professional.specialties[0] || this.getTitleLabel(this.professional.title),
      city: this.professional.location.city
    };

    const favorites = this.getFavorites();
    const next = this.isFavorite
      ? favorites.filter(item => item.id !== favorite.id)
      : [favorite, ...favorites.filter(item => item.id !== favorite.id)];

    localStorage.setItem('deltapress_favorite_doctors', JSON.stringify(next));
    this.isFavorite = !this.isFavorite;
    this.snackBar.open(this.isFavorite ? 'Medecin ajoute aux favoris.' : 'Medecin retire des favoris.', 'Fermer', { duration: 2400 });
  }

  startTeleconsultation(): void {
    if (!this.professional) return;
    this.snackBar.open('Salle de teleconsultation audio/video preparee. Un lien securise serait genere cote serveur.', 'Fermer', { duration: 3600 });
  }

  private getFavorites(): Array<{ id: string; name: string; specialty: string; city: string }> {
    const raw = localStorage.getItem('deltapress_favorite_doctors');
    return raw ? JSON.parse(raw) : [];
  }
}
