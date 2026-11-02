import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  template: `
    <footer class="dp-footer">
      <div class="container-xl py-5">
        <div class="row g-4">
          <div class="col-lg-4">
            <div class="footer-brand">
              <span class="footer-brand-icon">
                <mat-icon>psychology</mat-icon>
              </span>
              <div>
                <h3>DeltaPress</h3>
                <p class="mb-0">Un parcours plus clair pour evaluer, comprendre et agir.</p>
              </div>
            </div>

            <p class="footer-copy">
              Une plateforme d'accompagnement qui combine auto-evaluation, orientation vers
              les bonnes ressources et acces rapide a l'aide d'urgence.
            </p>

            <div class="footer-tags">
              <span>Questionnaire guide</span>
              <span>Professionnels verifies</span>
              <span>Ressources immediates</span>
            </div>
          </div>

          <div class="col-6 col-lg-2">
            <h4>Naviguer</h4>
            <ul class="footer-links">
              <li><a routerLink="/">Accueil</a></li>
              <li><a routerLink="/questionnaire">Evaluation</a></li>
              <li><a routerLink="/directory">Annuaire</a></li>
              <li><a routerLink="/about">A propos</a></li>
            </ul>
          </div>

          <div class="col-6 col-lg-2">
            <h4>Ressources</h4>
            <ul class="footer-links">
              <li><a routerLink="/solutions">Conseils et exercices</a></li>
              <li><a routerLink="/emergency">Aide d'urgence</a></li>
              <li><a routerLink="/profile">Mon espace</a></li>
              <li><a routerLink="/register">Creer un compte</a></li>
            </ul>
          </div>

          <div class="col-lg-4">
            <div class="footer-cta">
              <span class="cta-eyebrow">Priorite</span>
              <h4>Besoin d'une aide immediate ?</h4>
              <p>
                L'acces aux ressources de crise reste disponible en permanence pour orienter
                rapidement les utilisateurs en difficulte.
              </p>
              <a routerLink="/emergency" class="btn btn-light rounded-pill px-4">
                Ouvrir le mode urgence
              </a>
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <p>&copy; {{ currentYear }} DeltaPress. Tous droits reserves.</p>
          <p class="disclaimer">
            <mat-icon>warning</mat-icon>
            Cet outil ne remplace pas un diagnostic medical professionnel.
          </p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .dp-footer {
      margin-top: auto;
      background: linear-gradient(135deg, hsl(218, 55%, 12%) 0%, hsl(218, 55%, 18%) 100%);
      color: rgba(255, 255, 255, 0.9);
      border-top: 1px solid rgba(255, 255, 255, 0.05);
    }

    .footer-brand {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      margin-bottom: 1.25rem;
    }

    .footer-brand h3 {
      color: white;
      font-size: 1.5rem;
      margin: 0 0 0.35rem;
      font-weight: 800;
      letter-spacing: -0.02em;
    }

    .footer-brand-icon {
      width: 3rem;
      height: 3rem;
      border-radius: 1rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, hsl(215, 88%, 52%) 0%, hsl(175, 70%, 35%) 100%);
      color: white;
      box-shadow: 0 8px 24px rgba(31, 120, 255, 0.2);
    }

    .footer-copy {
      max-width: 30rem;
      color: rgba(255, 255, 255, 0.65);
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }

    .footer-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.6rem;
    }

    .footer-tags span {
      padding: 0.45rem 0.9rem;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.06);
      font-size: 0.82rem;
      font-weight: 700;
      color: rgba(255, 255, 255, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.05);
    }

    h4 {
      margin-bottom: 1.2rem;
      color: white;
      font-size: 0.92rem;
      font-weight: 800;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    .footer-links {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .footer-links li + li {
      margin-top: 0.75rem;
    }

    .footer-links a {
      color: rgba(255, 255, 255, 0.65);
      text-decoration: none;
      display: inline-block;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .footer-links a:hover {
      color: white;
      transform: translateX(3px);
    }

    .footer-cta {
      padding: 1.75rem;
      border-radius: 1.5rem;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      box-shadow: inset 0 0 20px rgba(255, 255, 255, 0.02);
    }

    .cta-eyebrow {
      display: inline-block;
      margin-bottom: 0.75rem;
      color: hsl(215, 88%, 70%);
      font-size: 0.75rem;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .footer-cta p {
      color: rgba(255, 255, 255, 0.65);
      margin-bottom: 1.25rem;
      font-size: 0.95rem;
    }

    .footer-cta h4 {
      margin-bottom: 0.5rem;
    }

    .footer-bottom {
      margin-top: 3rem;
      padding-top: 1.75rem;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
    }

    .footer-bottom p {
      color: rgba(255, 255, 255, 0.5);
      margin: 0;
      font-size: 0.88rem;
    }

    .disclaimer {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.88rem;
      color: hsl(38, 92%, 60%) !important;
    }

    .disclaimer mat-icon {
      font-size: 1.1rem;
      width: 1.1rem;
      height: 1.1rem;
    }

    @media (max-width: 767.98px) {
      .footer-cta {
        padding: 1.35rem;
      }
    }
  `]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
