import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatIconModule],
  template: `
    <nav class="navbar navbar-expand-lg fixed-top dp-navbar">
      <div class="container-xl">
        <a routerLink="/" class="navbar-brand" (click)="closeMobileMenu()">
          <span class="brand-icon">
            <mat-icon>psychology</mat-icon>
          </span>
          <span class="brand-copy">
            <span class="brand-title">DeltaPress</span>
            <span class="brand-tagline">Evaluation, orientation et prevention</span>
          </span>
        </a>

        <button
          class="navbar-toggler border-0 shadow-none"
          type="button"
          [attr.aria-expanded]="mobileMenuOpen"
          aria-label="Afficher le menu"
          (click)="toggleMobileMenu()"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" [class.show]="mobileMenuOpen">
          <ul class="navbar-nav mx-auto mb-3 mb-lg-0 gap-lg-2">
            <li class="nav-item">
              <a
                class="nav-link"
                routerLink="/"
                routerLinkActive="active"
                [routerLinkActiveOptions]="{ exact: true }"
                (click)="closeMobileMenu()"
              >
                Accueil
              </a>
            </li>

            <ng-container *ngIf="authService.currentUser$ | async as navUser; else publicNav">
              <ng-container *ngIf="navUser.role === 'user'">
                <li class="nav-item"><a class="nav-link" routerLink="/questionnaire" routerLinkActive="active" (click)="closeMobileMenu()">Test</a></li>
                <li class="nav-item"><a class="nav-link" routerLink="/discussion" routerLinkActive="active" (click)="closeMobileMenu()">Discussion</a></li>
                <li class="nav-item"><a class="nav-link" routerLink="/user" [queryParams]="{ tab: 1 }" routerLinkActive="active" (click)="closeMobileMenu()">Mes bilans</a></li>
                <li class="nav-item"><a class="nav-link" routerLink="/user" [queryParams]="{ tab: 2 }" routerLinkActive="active" (click)="closeMobileMenu()">Mes demandes</a></li>
                <li class="nav-item"><a class="nav-link" routerLink="/user" [queryParams]="{ tab: 4 }" routerLinkActive="active" (click)="closeMobileMenu()">Journal</a></li>
                <li class="nav-item"><a class="nav-link" routerLink="/directory" routerLinkActive="active" (click)="closeMobileMenu()">Annuaire</a></li>
              </ng-container>

              <ng-container *ngIf="navUser.role === 'doctor'">
                <li class="nav-item"><a class="nav-link" routerLink="/doctor" [queryParams]="{ tab: 1 }" routerLinkActive="active" (click)="closeMobileMenu()">Demandes</a></li>
                <li class="nav-item"><a class="nav-link" routerLink="/doctor" [queryParams]="{ tab: 2 }" routerLinkActive="active" (click)="closeMobileMenu()">Bilans partages</a></li>
                <li class="nav-item"><a class="nav-link" routerLink="/doctor" [queryParams]="{ tab: 0 }" routerLinkActive="active" (click)="closeMobileMenu()">Profil pro</a></li>
                <li class="nav-item"><a class="nav-link" routerLink="/directory" routerLinkActive="active" (click)="closeMobileMenu()">Annuaire</a></li>
              </ng-container>

              <ng-container *ngIf="navUser.role === 'admin'">
                <li class="nav-item"><a class="nav-link" routerLink="/admin" [queryParams]="{ tab: 0 }" routerLinkActive="active" (click)="closeMobileMenu()">Medecins</a></li>
                <li class="nav-item"><a class="nav-link" routerLink="/admin" [queryParams]="{ tab: 1 }" routerLinkActive="active" (click)="closeMobileMenu()">Moderation</a></li>
                <li class="nav-item"><a class="nav-link" routerLink="/admin" [queryParams]="{ tab: 2 }" routerLinkActive="active" (click)="closeMobileMenu()">Contenus</a></li>
                <li class="nav-item"><a class="nav-link" routerLink="/admin" [queryParams]="{ tab: 3 }" routerLinkActive="active" (click)="closeMobileMenu()">Stats</a></li>
              </ng-container>
            </ng-container>

            <ng-template #publicNav>
              <li class="nav-item"><a class="nav-link" routerLink="/directory" routerLinkActive="active" (click)="closeMobileMenu()">Annuaire</a></li>
              <li class="nav-item"><a class="nav-link" routerLink="/emergency" routerLinkActive="active" (click)="closeMobileMenu()">Urgence</a></li>
              <li class="nav-item"><a class="nav-link" routerLink="/about" routerLinkActive="active" (click)="closeMobileMenu()">A propos</a></li>
            </ng-template>
          </ul>

          <div class="auth-actions d-flex flex-column flex-lg-row align-items-stretch align-items-lg-center gap-2">
            <ng-container *ngIf="authService.currentUser$ | async as user; else guestActions">
              <div class="user-pill">
                <mat-icon>account_circle</mat-icon>
                <div>
                  <div class="user-pill-label">Connecte</div>
                  <div class="user-pill-name">{{ user.name }}</div>
                </div>
              </div>
              <a
                [routerLink]="authService.getDashboardRoute(user)"
                class="btn btn-outline-primary rounded-pill px-3"
                (click)="closeMobileMenu()"
              >
                {{ getDashboardLabel(user.role) }}
              </a>
              <button type="button" class="btn btn-dark rounded-pill px-3" (click)="logout()">
                Deconnexion
              </button>
            </ng-container>

            <ng-template #guestActions>
              <a
                routerLink="/login"
                class="btn btn-outline-primary rounded-pill px-3"
                (click)="closeMobileMenu()"
              >
                Connexion
              </a>
              <a
                routerLink="/register"
                class="btn btn-primary rounded-pill px-4"
                (click)="closeMobileMenu()"
              >
                Commencer
              </a>
            </ng-template>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .dp-navbar {
      background: #ffffff !important;
      border-bottom: 1px solid rgba(31, 120, 255, 0.08) !important;
      backdrop-filter: blur(24px) saturate(180%);
      -webkit-backdrop-filter: blur(24px) saturate(180%);
      box-shadow: 0 8px 30px rgba(17, 79, 186, 0.04) !important;
      padding: 0.8rem 0;
      transition: all 0.3s ease;
    }

    .navbar-brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
      color: var(--dp-primary-dark);
    }

    .brand-icon {
      width: 2.8rem;
      height: 2.8rem;
      border-radius: 0.95rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, hsl(215, 88%, 52%) 0%, hsl(175, 70%, 35%) 100%);
      color: white;
      box-shadow: 0 10px 24px rgba(31, 120, 255, 0.22);
      transition: transform 0.3s ease;
    }

    .navbar-brand:hover .brand-icon {
      transform: rotate(5deg) scale(1.05);
    }

    .brand-copy {
      display: flex;
      flex-direction: column;
    }

    .brand-title {
      font-family: 'Manrope', sans-serif;
      font-size: 1.15rem;
      font-weight: 800;
      line-height: 1.1;
      letter-spacing: -0.02em;
    }

    .brand-tagline {
      font-size: 0.68rem;
      font-weight: 700;
      color: var(--dp-muted);
      letter-spacing: 0.06em;
      text-transform: uppercase;
      margin-top: 0.1rem;
    }

    .navbar-toggler {
      padding: 0.5rem 0.7rem;
      border-radius: 0.75rem;
      background: rgba(31, 120, 255, 0.06);
      transition: all 0.2s ease;
    }

    .navbar-toggler:hover {
      background: rgba(31, 120, 255, 0.1);
    }

    .navbar-toggler:focus {
      box-shadow: none;
    }

    .nav-link {
      color: hsl(215, 88%, 46%) !important;
      font-family: 'Manrope', sans-serif;
      font-weight: 700;
      font-size: 0.92rem;
      padding: 0.55rem 1rem !important;
      border-radius: 999px;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      border: 1px solid transparent;
    }

    .nav-link:hover {
      color: hsl(215, 88%, 46%) !important;
      background: rgba(31, 120, 255, 0.04);
      transform: translateY(-1px);
    }

    .nav-link.active {
      color: hsl(215, 88%, 46%) !important;
      background: rgba(31, 120, 255, 0.06) !important;
      border: 1px solid rgba(31, 120, 255, 0.08) !important;
    }

    .user-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.65rem;
      padding: 0.45rem 0.85rem;
      border-radius: 1rem;
      border: 1px solid rgba(31, 120, 255, 0.08);
      background: rgba(255, 255, 255, 0.9);
      box-shadow: 0 4px 12px rgba(17, 79, 186, 0.02);
    }

    .user-pill mat-icon {
      color: hsl(215, 88%, 52%);
      font-size: 1.5rem;
      width: 1.5rem;
      height: 1.5rem;
    }

    .user-pill-label {
      font-size: 0.65rem;
      font-weight: 800;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: var(--dp-muted);
    }

    .user-pill-name {
      font-weight: 700;
      font-size: 0.88rem;
      line-height: 1.1;
      color: var(--dp-primary-dark);
    }

    @media (max-width: 991.98px) {
      .brand-tagline {
        display: none;
      }

      .collapse.navbar-collapse {
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid rgba(31, 120, 255, 0.08);
      }

      .nav-link {
        padding-inline: 1rem !important;
        margin-bottom: 0.25rem;
      }

      .auth-actions {
        padding-top: 0.75rem;
        gap: 0.5rem;
      }
    }
  `]
})
export class NavbarComponent {
  mobileMenuOpen = false;
  authService = inject(AuthService);

  logout(): void {
    this.closeMobileMenu();
    this.authService.logout();
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  getDashboardLabel(role: string): string {
    if (role === 'admin') return 'Admin';
    if (role === 'doctor') return 'Espace medecin';
    return 'Mon profil';
  }
}
