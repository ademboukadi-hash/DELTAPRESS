import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
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
    MatSnackBarModule
  ],
  template: `
    <div class="auth-shell">
      <div class="container-xl py-4 py-lg-5">
        <div class="row g-4 justify-content-center align-items-stretch">
          <div class="col-lg-5 d-none d-lg-block">
            <section class="info-panel h-100">
              <span class="dp-eyebrow mb-3">Espace personnel</span>
              <h1>Retrouvez vos evaluations dans un espace plus clair.</h1>
              <p>
                Connectez-vous pour suivre votre progression, revoir vos resultats et garder
                un acces simple aux ressources adaptees a votre situation.
              </p>

              <div class="info-list">
                <article class="info-item">
                  <mat-icon>history</mat-icon>
                  <div>
                    <strong>Historique centralise</strong>
                    <p>Retrouvez vos precedentes evaluations sans repartir de zero.</p>
                  </div>
                </article>

                <article class="info-item">
                  <mat-icon>shield</mat-icon>
                  <div>
                    <strong>Acces rapide et rassurant</strong>
                    <p>Des interfaces lisibles avec les actions importantes toujours visibles.</p>
                  </div>
                </article>

                <article class="info-item">
                  <mat-icon>support_agent</mat-icon>
                  <div>
                    <strong>Orientation en continu</strong>
                    <p>Des conseils, des professionnels et l'aide d'urgence au meme endroit.</p>
                  </div>
                </article>
              </div>
            </section>
          </div>

          <div class="col-lg-6 col-xl-5">
            <mat-card class="auth-card">
              <div class="card-body p-4 p-lg-5">
                <div class="text-center mb-4">
                  <span class="dp-eyebrow mb-3">Connexion</span>
                  <h2 class="mb-2">Heureux de vous revoir</h2>
                  <p class="text-dp-muted mb-0">
                    Accedez a votre espace personnel et a vos resultats en quelques secondes.
                  </p>
                </div>

                <form #loginForm="ngForm" (ngSubmit)="onSubmit(loginForm)" novalidate>
                  <mat-form-field
                    appearance="outline"
                    class="full-width"
                    [class.mat-form-field-invalid]="!emailValid && credentials.email"
                  >
                    <mat-label>Email</mat-label>
                    <input
                      matInput
                      type="email"
                      [(ngModel)]="credentials.email"
                      name="email"
                      required
                      email
                      placeholder="vous@exemple.com"
                      (blur)="validateEmail()"
                    />
                    <mat-icon matSuffix>email</mat-icon>
                    <mat-error *ngIf="!emailValid">
                      Veuillez entrer un email valide
                    </mat-error>
                  </mat-form-field>

                  <mat-form-field
                    appearance="outline"
                    class="full-width"
                    [class.mat-form-field-invalid]="!passwordValid && credentials.password"
                  >
                    <mat-label>Mot de passe</mat-label>
                    <input
                      matInput
                      [type]="hidePassword ? 'password' : 'text'"
                      [(ngModel)]="credentials.password"
                      name="password"
                      required
                      minlength="6"
                      placeholder="Votre mot de passe"
                      (blur)="validatePassword()"
                    />
                    <button mat-icon-button matSuffix type="button" (click)="hidePassword = !hidePassword">
                      <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
                    </button>
                    <mat-error *ngIf="!passwordValid">
                      Le mot de passe doit contenir au moins 6 caracteres
                    </mat-error>
                  </mat-form-field>

                  <div class="form-meta">
                    <mat-checkbox [(ngModel)]="credentials.rememberMe" name="rememberMe">
                      Se souvenir de moi
                    </mat-checkbox>
                    <span class="helper-text">Mode demonstration disponible</span>
                  </div>

                  <div class="alert alert-danger d-flex align-items-start gap-2" *ngIf="error">
                    <mat-icon>error</mat-icon>
                    <span>{{ error }}</span>
                  </div>

                  <button
                    type="submit"
                    class="btn btn-primary btn-lg w-100 rounded-pill submit-btn"
                    [disabled]="isLoading"
                  >
                    <span class="d-inline-flex align-items-center justify-content-center gap-2">
                      <mat-spinner diameter="20" *ngIf="isLoading"></mat-spinner>
                      <span>{{ isLoading ? 'Connexion en cours...' : 'Se connecter' }}</span>
                    </span>
                  </button>
                </form>

                <div class="separator">
                  <span>ou</span>
                </div>

                <button type="button" class="btn btn-outline-dark w-100 rounded-pill social-btn">
                  Continuer avec Google
                </button>

                <p class="auth-footer mb-0">
                  Pas encore de compte ?
                  <a routerLink="/register">Creer un compte</a>
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

    .info-panel {
      padding: 3rem;
      border-radius: 2rem;
      background: linear-gradient(135deg, hsl(218, 55%, 18%) 0%, hsl(175, 70%, 35%) 100%);
      color: white;
      box-shadow: 0 24px 60px rgba(17, 79, 186, 0.16);
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .info-panel h1 {
      margin-bottom: 1.25rem;
      font-family: 'Manrope', sans-serif;
      font-size: clamp(2rem, 2vw + 1.25rem, 2.6rem);
      line-height: 1.1;
      font-weight: 800;
      color: white;
    }

    .info-panel p {
      color: rgba(255, 255, 255, 0.76);
      line-height: 1.7;
      font-size: 1.05rem;
    }

    .info-list {
      display: grid;
      gap: 1.2rem;
      margin-top: 2.5rem;
    }

    .info-item {
      display: flex;
      gap: 1rem;
      padding: 1rem 1.25rem;
      border-radius: 1.25rem;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.08);
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .info-item:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: translateX(4px);
    }

    .info-item mat-icon {
      color: white;
      font-size: 1.5rem;
      width: 1.5rem;
      height: 1.5rem;
    }

    .info-item strong {
      display: block;
      margin-bottom: 0.2rem;
      font-family: 'Manrope', sans-serif;
      font-size: 1rem;
    }

    .info-item p {
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

    .form-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
      margin-bottom: 1.25rem;
    }

    .helper-text {
      color: var(--dp-muted);
      font-size: 0.88rem;
      font-weight: 700;
    }

    .alert {
      margin-top: 0.4rem;
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
      margin-top: 0.5rem;
      padding-block: 0.85rem;
      font-weight: 700;
      box-shadow: 0 8px 24px rgba(31, 120, 255, 0.2);
    }

    .separator {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin: 1.5rem 0 1.2rem;
      color: var(--dp-muted);
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-size: 0.72rem;
    }

    .separator::before,
    .separator::after {
      content: '';
      flex: 1;
      height: 1px;
      background: rgba(31, 120, 255, 0.08);
    }

    .social-btn {
      padding-block: 0.85rem;
      font-weight: 700;
      border: 2px solid rgba(31, 120, 255, 0.08);
      background: transparent;
      color: var(--dp-primary-dark);
      transition: all 0.2s ease;
    }

    .social-btn:hover {
      background: rgba(31, 120, 255, 0.04);
      border-color: rgba(31, 120, 255, 0.15);
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
export class LoginComponent {
  credentials = {
    email: '',
    password: '',
    rememberMe: false
  };
  hidePassword = true;
  isLoading = false;
  error: string | null = null;

  emailValid = true;
  passwordValid = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  validateEmail(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.emailValid = emailRegex.test(this.credentials.email);
    return this.emailValid;
  }

  validatePassword(): boolean {
    this.passwordValid = this.credentials.password.length >= 6;
    return this.passwordValid;
  }

  validateForm(): boolean {
    return this.validateEmail() && this.validatePassword();
  }

  onSubmit(form: NgForm): void {
    if (!this.validateForm()) {
      this.snackBar.open('Veuillez corriger les erreurs du formulaire', 'Fermer', {
        duration: 3000,
        panelClass: 'error-snackbar'
      });
      return;
    }

    this.isLoading = true;
    this.error = null;

    this.authService.login(this.credentials).subscribe({
      next: user => {
        this.isLoading = false;
        this.snackBar.open('Connexion reussie !', 'Fermer', {
          duration: 3000,
          panelClass: 'success-snackbar'
        });
        this.router.navigate([this.authService.getDashboardRoute(user)]);
      },
      error: (err) => {
        this.isLoading = false;
        this.error = err.message || 'Une erreur est survenue';
        this.snackBar.open(this.error || 'Erreur de connexion', 'Fermer', {
          duration: 5000,
          panelClass: 'error-snackbar'
        });
      }
    });
  }
}
