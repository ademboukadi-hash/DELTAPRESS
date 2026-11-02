import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../services/auth.service';
import { RegisterData } from '../../../models/index';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSnackBarModule
  ],
  template: `
    <div class="auth-shell">
      <div class="container-xl py-4 py-lg-5">
        <div class="row g-4 justify-content-center align-items-stretch">
          <div class="col-lg-5 d-none d-lg-block">
            <section class="register-panel h-100">
              <span class="dp-eyebrow mb-3">Demarrage rapide</span>
              <h1>Créez un espace serein pour suivre votre progression.</h1>
              <p>
                En quelques informations, vous obtenez un acces simple a vos evaluations,
                votre historique et les ressources les plus utiles selon votre profil.
              </p>

              <div class="steps">
                <div class="step-item">
                  <span>1</span>
                  <div>
                    <strong>Créer votre compte</strong>
                    <p>Renseignez les informations essentielles et vos preferences.</p>
                  </div>
                </div>

                <div class="step-item">
                  <span>2</span>
                  <div>
                    <strong>Faire votre evaluation</strong>
                    <p>Suivez le questionnaire avec une progression claire et lisible.</p>
                  </div>
                </div>

                <div class="step-item">
                  <span>3</span>
                  <div>
                    <strong>Recevoir des recommandations</strong>
                    <p>Accedez a un resultat interprete et aux aides adaptees.</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div class="col-lg-6 col-xl-5">
            <mat-card class="auth-card">
              <div class="card-body p-4 p-lg-5">
                <div class="text-center mb-4">
                  <span class="dp-eyebrow mb-3">Inscription</span>
                  <h2 class="mb-2">Creer un compte DeltaPress</h2>
                  <p class="text-dp-muted mb-0">
                    Rejoignez une interface plus fluide pour suivre votre bien-etre mental.
                  </p>
                </div>

                <form #registerForm="ngForm" (ngSubmit)="onSubmit()" novalidate>
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Nom complet</mat-label>
                    <input
                      matInput
                      type="text"
                      [(ngModel)]="registerData.name"
                      name="name"
                      required
                      placeholder="Jean Dupont"
                    />
                    <mat-icon matSuffix>person</mat-icon>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Email</mat-label>
                    <input
                      matInput
                      type="email"
                      [(ngModel)]="registerData.email"
                      name="email"
                      required
                      email
                      placeholder="vous@exemple.com"
                    />
                    <mat-icon matSuffix>email</mat-icon>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Mot de passe</mat-label>
                    <input
                      matInput
                      [type]="hidePassword ? 'password' : 'text'"
                      [(ngModel)]="registerData.password"
                      name="password"
                      required
                      minlength="8"
                      placeholder="8 caracteres minimum"
                    />
                    <button mat-icon-button matSuffix type="button" (click)="hidePassword = !hidePassword">
                      <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
                    </button>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Confirmer le mot de passe</mat-label>
                    <input
                      matInput
                      [type]="hidePassword ? 'password' : 'text'"
                      [(ngModel)]="confirmPassword"
                      name="confirmPassword"
                      required
                      placeholder="Confirmez votre mot de passe"
                    />
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Genre</mat-label>
                    <mat-select [(ngModel)]="registerData.gender" name="gender">
                      <mat-option value="">Non specifie</mat-option>
                      <mat-option value="male">Homme</mat-option>
                      <mat-option value="female">Femme</mat-option>
                      <mat-option value="other">Autre</mat-option>
                      <mat-option value="prefer_not_to_say">Je prefere ne pas repondre</mat-option>
                    </mat-select>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Type de compte</mat-label>
                    <mat-select [(ngModel)]="registerData.role" name="role">
                      <mat-option value="user">Utilisateur</mat-option>
                      <mat-option value="doctor">Medecin</mat-option>
                      <mat-option value="admin">Administrateur</mat-option>
                    </mat-select>
                  </mat-form-field>

                  <div class="role-hint">
                    <mat-icon>info</mat-icon>
                    <span>
                      Les espaces medecin et administrateur debloquent des permissions dediees
                      pour les demandes, les bilans partages et la moderation.
                    </span>
                  </div>

                  <div class="consent-box">
                    <mat-checkbox
                      [(ngModel)]="registerData.consentPrivacy"
                      name="consentPrivacy"
                      required
                    >
                      J'accepte la politique de confidentialite et les conditions d'utilisation
                    </mat-checkbox>

                    <mat-checkbox
                      [(ngModel)]="registerData.consentData"
                      name="consentData"
                    >
                      J'autorise l'utilisation anonyme de mes donnees pour ameliorer le service
                    </mat-checkbox>
                  </div>

                  <div class="alert alert-danger d-flex align-items-start gap-2" *ngIf="error">
                    <mat-icon>error</mat-icon>
                    <span>{{ error }}</span>
                  </div>

                  <button
                    type="submit"
                    class="btn btn-primary btn-lg w-100 rounded-pill submit-btn"
                    [disabled]="isLoading || !registerData.consentPrivacy"
                  >
                    <span class="d-inline-flex align-items-center justify-content-center gap-2">
                      <mat-spinner diameter="20" *ngIf="isLoading"></mat-spinner>
                      <span>{{ isLoading ? 'Creation du compte...' : 'Creer mon compte' }}</span>
                    </span>
                  </button>
                </form>

                <p class="auth-footer mb-0">
                  Deja un compte ?
                  <a routerLink="/login">Se connecter</a>
                </p>
              </div>
            </mat-card>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-shell {
      padding-bottom: 2rem;
    }

    .register-panel {
      padding: 3rem;
      border-radius: 2rem;
      background: linear-gradient(135deg, hsl(218, 55%, 18%) 0%, hsl(175, 70%, 35%) 100%);
      color: white;
      box-shadow: 0 24px 60px rgba(12, 44, 80, 0.16);
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .register-panel h1 {
      margin-bottom: 1.25rem;
      font-family: 'Manrope', sans-serif;
      font-size: clamp(2rem, 2vw + 1.25rem, 2.6rem);
      line-height: 1.1;
      font-weight: 800;
      color: white;
    }

    .register-panel p {
      color: rgba(255, 255, 255, 0.76);
      line-height: 1.7;
      font-size: 1.05rem;
    }

    .steps {
      display: grid;
      gap: 1.2rem;
      margin-top: 2.5rem;
    }

    .step-item {
      display: flex;
      gap: 1rem;
      padding: 1rem 1.25rem;
      border-radius: 1.25rem;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.08);
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .step-item:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: translateX(4px);
    }

    .step-item span {
      width: 2rem;
      height: 2rem;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      background: rgba(255, 255, 255, 0.16);
      flex-shrink: 0;
    }

    .step-item strong {
      display: block;
      margin-bottom: 0.2rem;
      font-family: 'Manrope', sans-serif;
      font-size: 1rem;
    }

    .step-item p {
      margin: 0;
      font-size: 0.88rem;
      color: rgba(255, 255, 255, 0.7);
    }

    .auth-card {
      background: rgba(255, 255, 255, 0.72) !important;
      backdrop-filter: blur(24px) saturate(180%);
      -webkit-backdrop-filter: blur(24px) saturate(180%);
      border: 1px solid rgba(255, 255, 255, 0.45) !important;
      border-radius: 2rem !important;
      box-shadow: var(--dp-shadow-premium) !important;
      overflow: hidden;
    }

    .full-width {
      width: 100%;
      margin-bottom: 1rem;
    }

    .consent-box {
      margin: 1rem 0;
      padding: 1rem 1.25rem;
      border-radius: 1.25rem;
      background: rgba(31, 120, 255, 0.04);
      border: 1px solid rgba(31, 120, 255, 0.08);
      display: grid;
      gap: 0.85rem;
    }

    .role-hint {
      display: flex;
      gap: 0.75rem;
      align-items: flex-start;
      margin-bottom: 1rem;
      padding: 0.95rem 1.25rem;
      border-radius: 1.25rem;
      background: rgba(31, 120, 255, 0.04);
      color: var(--dp-muted);
      border: 1px solid rgba(31, 120, 255, 0.06);
      font-size: 0.92rem;
    }

    .role-hint mat-icon {
      font-size: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
      color: hsl(215, 88%, 52%);
      flex-shrink: 0;
      margin-top: 0.1rem;
    }

    .alert {
      margin-top: 0.5rem;
      margin-bottom: 1rem;
      border: 0;
      border-radius: 1rem;
      background: rgba(220, 53, 69, 0.08);
      color: hsl(5, 75%, 40%);
      font-weight: 600;
    }

    .alert mat-icon {
      font-size: 1.1rem;
      width: 1.1rem;
      height: 1.1rem;
      margin-top: 0.15rem;
    }

    .submit-btn {
      padding-block: 0.85rem;
      font-weight: 700;
      box-shadow: 0 8px 24px rgba(31, 120, 255, 0.2);
    }

    .auth-footer {
      margin-top: 1.5rem;
      text-align: center;
      color: var(--dp-muted);
      font-weight: 700;
      font-size: 0.92rem;
    }

    .auth-footer a {
      color: hsl(215, 88%, 46%);
      text-decoration: none;
      font-weight: 800;
    }

    .auth-footer a:hover {
      text-decoration: underline;
    }
  `]
})
export class RegisterComponent {
  registerData: RegisterData = {
    email: '',
    password: '',
    name: '',
    role: 'user',
    consentPrivacy: false,
    consentData: false
  };
  confirmPassword = '';
  hidePassword = true;
  isLoading = false;
  error: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  validateEmail(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.registerData.email);
  }

  validatePassword(): boolean {
    return this.registerData.password.length >= 6;
  }

  validateForm(): boolean {
    return this.validateEmail() &&
      this.validatePassword() &&
      this.registerData.name.length >= 2 &&
      this.registerData.password === this.confirmPassword &&
      this.registerData.consentPrivacy;
  }

  onSubmit(): void {
    if (!this.validateForm()) {
      if (!this.validateEmail()) {
        this.snackBar.open('Veuillez entrer un email valide', 'Fermer', { duration: 3000 });
      } else if (!this.validatePassword()) {
        this.snackBar.open('Le mot de passe doit contenir au moins 6 caracteres', 'Fermer', { duration: 3000 });
      } else if (this.registerData.password !== this.confirmPassword) {
        this.snackBar.open('Les mots de passe ne correspondent pas', 'Fermer', { duration: 3000 });
      } else if (!this.registerData.consentPrivacy) {
        this.snackBar.open('Vous devez accepter la politique de confidentialite', 'Fermer', { duration: 3000 });
      }
      return;
    }

    this.isLoading = true;
    this.error = null;

    this.authService.register(this.registerData).subscribe({
      next: user => {
        this.isLoading = false;
        this.snackBar.open('Inscription reussie !', 'Fermer', {
          duration: 3000,
          panelClass: 'success-snackbar'
        });
        this.router.navigate([this.authService.getDashboardRoute(user)]);
      },
      error: (err: { message: string }) => {
        this.isLoading = false;
        this.error = err.message || 'Une erreur est survenue';
        this.snackBar.open(this.error, 'Fermer', {
          duration: 5000,
          panelClass: 'error-snackbar'
        });
      }
    });
  }
}
