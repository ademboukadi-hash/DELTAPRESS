import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  template: `
    <div class="container-xl py-4 py-lg-5 home-page">
      <section class="hero-card">
        <div class="row align-items-center g-4 g-lg-5">
          <div class="col-lg-6">
            <span class="dp-eyebrow mb-3">Plateforme de soutien mental</span>
            <h1 class="display-5 fw-bold mb-3">
              Prenez une longueur d'avance sur votre bien-etre mental.
            </h1>
            <p class="lead text-dp-muted mb-4">
              DeltaPress vous aide a evaluer votre situation, comprendre les signaux
              importants et trouver les bonnes ressources sans vous perdre dans des
              interfaces froides ou techniques.
            </p>

            <div class="d-flex flex-wrap gap-3">
              <a routerLink="/questionnaire" class="btn btn-primary btn-lg rounded-pill px-4">
                Faire le test rapide
              </a>
              <a routerLink="/discussion" class="btn btn-outline-primary btn-lg rounded-pill px-4">
                Ouvrir l'espace de discussion
              </a>
              <a routerLink="/directory" class="btn btn-light btn-lg rounded-pill px-4 soft-cta">
                Trouver un specialiste
              </a>
            </div>

            <div class="row g-3 mt-4">
              <div class="col-sm-4">
                <div class="mini-stat">
                  <span class="mini-stat-value">5 min</span>
                  <span class="mini-stat-label">pour faire le point</span>
                </div>
              </div>
              <div class="col-sm-4">
                <div class="mini-stat">
                  <span class="mini-stat-value">500+</span>
                  <span class="mini-stat-label">professionnels references</span>
                </div>
              </div>
              <div class="col-sm-4">
                <div class="mini-stat">
                  <span class="mini-stat-value">24/7</span>
                  <span class="mini-stat-label">ressources d'urgence</span>
                </div>
              </div>
            </div>
          </div>

          <div class="col-lg-6">
            <div class="hero-visual">
              <div class="hero-orb orb-one"></div>
              <div class="hero-orb orb-two"></div>
              <img
                src="https://i.pinimg.com/736x/9d/af/45/9daf4564d7dea36c7935749b00049162.jpg"
                alt="Illustration principale de bien-etre mental"
                class="hero-img img-fluid"
                fetchpriority="high"
                referrerpolicy="no-referrer"
              />

              <figure class="supporting-image-card">
                <img
                  src="https://i.pinimg.com/736x/44/c0/b8/44c0b870015be94cc36f46b870061db4.jpg"
                  alt="Illustration de soutien et d'apaisement"
                  class="supporting-img"
                  loading="lazy"
                  referrerpolicy="no-referrer"
                />
              </figure>

              <div class="floating-note">
                <span class="floating-kicker">Suivi simplifie</span>
                <strong>Des recommandations claires, pas seulement un score.</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="row g-4 my-4 my-lg-5">
        <div class="col-lg-8">
          <div class="alert-card warning-card h-100">
            <div class="alert-icon">
              <mat-icon>warning</mat-icon>
            </div>
            <div>
              <h2 class="h4 mb-2">Important avant de commencer</h2>
              <p class="mb-0 text-dp-muted">
                DeltaPress est un outil d'orientation et de prevention. Il ne remplace pas un
                diagnostic medical professionnel. En cas de doute ou de situation urgente,
                consultez rapidement un professionnel de sante ou les ressources d'urgence.
              </p>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="alert-card emergency-card h-100">
            <span class="dp-eyebrow mb-3">Besoin immediat</span>
            <h2 class="h4 mb-2">Acces rapide a l'aide d'urgence</h2>
            <p class="mb-4">
              Un bouton d'urgence reste visible a tout moment pour orienter les personnes en
              crise vers les bons contacts.
            </p>
            <a routerLink="/emergency" class="btn btn-light rounded-pill px-4 align-self-start">
              Voir les ressources
            </a>
          </div>
        </div>
      </section>

      <section class="mb-4 mb-lg-5">
        <div class="section-heading text-center mb-4 mb-lg-5">
          <span class="dp-eyebrow mb-3">A propos de la depression</span>
          <h2 class="display-6 fw-bold mb-2">Quelques repères simples avant d'agir</h2>
          <p class="text-dp-muted col-lg-7 mx-auto mb-0">
            La depression peut se manifester par une tristesse persistante, une perte d interet,
            des troubles du sommeil, de la fatigue, un isolement ou des idees tres sombres.
          </p>
        </div>

        <div class="row g-4 mb-4 mb-lg-5">
          <div class="col-md-6 col-xl-4">
            <article class="feature-card h-100">
              <span class="feature-icon">
                <mat-icon>mood_bad</mat-icon>
              </span>
              <h3>Des signes qui durent</h3>
              <p>
                Quand la tristesse, la fatigue ou la perte d elan durent plusieurs jours
                ou semaines, un bilan structure peut aider a mieux comprendre la situation.
              </p>
            </article>
          </div>

          <div class="col-md-6 col-xl-4">
            <article class="feature-card h-100">
              <span class="feature-icon teal">
                <mat-icon>chat</mat-icon>
              </span>
              <h3>Parler peut aider</h3>
              <p>
                L espace de discussion permet d ecrire librement ce que vous ressentez avant
                ou apres le test rapide, pour enrichir le bilan.
              </p>
            </article>
          </div>

          <div class="col-md-6 col-xl-4">
            <article class="feature-card h-100">
              <span class="feature-icon gold">
                <mat-icon>emergency</mat-icon>
              </span>
              <h3>Un risque eleve doit etre visible</h3>
              <p>
                Si certaines reponses ou formulations suggerent une crise, l application met
                en avant l aide urgente sans attendre.
              </p>
            </article>
          </div>
        </div>

        <div class="section-heading text-center mb-4 mb-lg-5">
          <span class="dp-eyebrow mb-3">Comment ca marche</span>
          <h2 class="display-6 fw-bold mb-2">Une experience plus claire et plus rassurante</h2>
          <p class="text-dp-muted col-lg-7 mx-auto mb-0">
            Chaque etape est pensee pour reduire la charge mentale et vous donner des
            informations actionnables.
          </p>
        </div>

        <div class="row g-4">
          <div class="col-md-6 col-xl-4">
            <article class="feature-card h-100">
              <span class="feature-icon">
                <mat-icon>fact_check</mat-icon>
              </span>
              <h3>Questionnaire guide</h3>
              <p>
                Des questions simples, progressives et compréhensibles pour prendre
                rapidement la temperature de votre bien-etre.
              </p>
            </article>
          </div>

          <div class="col-md-6 col-xl-4">
            <article class="feature-card h-100">
              <span class="feature-icon teal">
                <mat-icon>analytics</mat-icon>
              </span>
              <h3>Lecture immediate du resultat</h3>
              <p>
                Un score explicite, des categories detaillees et des priorites claires pour
                savoir quoi faire ensuite.
              </p>
            </article>
          </div>

          <div class="col-md-6 col-xl-4">
            <article class="feature-card h-100">
              <span class="feature-icon gold">
                <mat-icon>support_agent</mat-icon>
              </span>
              <h3>Orientation vers l'aide adaptee</h3>
              <p>
                Exercices, ressources, professionnels et numeros d'urgence regroupes au meme
                endroit.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section class="results-strip">
        <div class="row g-4 align-items-center">
          <div class="col-lg-7">
            <span class="dp-eyebrow mb-3">Fiabilite et confiance</span>
            <h2 class="display-6 fw-bold mb-3">Un parcours pense pour rassurer et orienter.</h2>
            <p class="text-dp-muted mb-0">
              Les interfaces mettent l'accent sur la lisibilite, les priorites d'action et la
              disponibilite de ressources concretes selon votre situation.
            </p>
          </div>

          <div class="col-lg-5">
            <div class="row g-3">
              <div class="col-6">
                <div class="trust-card">
                  <strong>10 000+</strong>
                  <span>evaluations realisees</span>
                </div>
              </div>
              <div class="col-6">
                <div class="trust-card">
                  <strong>100%</strong>
                  <span>interface responsive</span>
                </div>
              </div>
              <div class="col-6">
                <div class="trust-card">
                  <strong>3 etapes</strong>
                  <span>pour obtenir un resultat</span>
                </div>
              </div>
              <div class="col-6">
                <div class="trust-card">
                  <strong>1 clic</strong>
                  <span>vers le mode urgence</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .home-page {
      position: relative;
    }

    .hero-card {
      position: relative;
      overflow: hidden;
      padding: clamp(1.5rem, 2vw + 1rem, 3rem);
      border-radius: 2rem;
      background:
        radial-gradient(circle at top left, rgba(31, 111, 235, 0.18), transparent 32%),
        linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(244, 249, 255, 0.94));
      border: 1px solid rgba(17, 79, 186, 0.1);
      box-shadow: 0 28px 60px rgba(21, 48, 74, 0.12);
    }

    .hero-visual {
      position: relative;
      min-height: 26rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .hero-img {
      position: relative;
      z-index: 2;
      max-width: min(100%, 31rem);
      border-radius: 1.75rem;
      box-shadow: 0 30px 60px rgba(21, 48, 74, 0.18);
      border: 10px solid rgba(255, 255, 255, 0.78);
    }

    .supporting-image-card {
      position: absolute;
      top: 1rem;
      right: 0.5rem;
      z-index: 4;
      width: min(38%, 13rem);
      margin: 0;
      padding: 0.55rem;
      border-radius: 1.5rem;
      background: rgba(255, 255, 255, 0.94);
      border: 1px solid rgba(17, 79, 186, 0.12);
      box-shadow: 0 24px 38px rgba(21, 48, 74, 0.16);
      transform: rotate(7deg);
    }

    .supporting-img {
      display: block;
      width: 100%;
      aspect-ratio: 4 / 5;
      object-fit: cover;
      border-radius: 1.15rem;
    }

    .hero-orb {
      position: absolute;
      border-radius: 999px;
      filter: blur(2px);
    }

    .orb-one {
      top: 0.5rem;
      left: 0;
      width: 10rem;
      height: 10rem;
      background: rgba(31, 111, 235, 0.12);
    }

    .orb-two {
      right: 0.5rem;
      bottom: 1rem;
      width: 7rem;
      height: 7rem;
      background: rgba(15, 139, 141, 0.18);
    }

    .floating-note {
      position: absolute;
      left: 1rem;
      bottom: 1rem;
      z-index: 3;
      max-width: 16rem;
      padding: 1rem 1.1rem;
      border-radius: 1.25rem;
      background: rgba(255, 255, 255, 0.92);
      border: 1px solid rgba(17, 79, 186, 0.12);
      box-shadow: 0 18px 30px rgba(21, 48, 74, 0.14);
    }

    .floating-kicker {
      display: block;
      margin-bottom: 0.3rem;
      color: var(--dp-primary-dark);
      font-size: 0.78rem;
      font-weight: 800;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    .mini-stat {
      height: 100%;
      padding: 1rem 1.1rem;
      border-radius: 1.2rem;
      background: rgba(255, 255, 255, 0.88);
      border: 1px solid rgba(17, 79, 186, 0.12);
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }

    .mini-stat-value {
      font-family: 'Manrope', sans-serif;
      font-size: 1.4rem;
      font-weight: 800;
      color: var(--dp-primary-dark);
    }

    .mini-stat-label {
      color: var(--dp-muted);
      font-size: 0.95rem;
    }

    .soft-cta {
      background: rgba(255, 255, 255, 0.9);
      border: 1px solid rgba(17, 79, 186, 0.12);
      color: var(--dp-primary-dark);
    }

    .alert-card {
      display: flex;
      gap: 1rem;
      padding: 1.5rem;
      border-radius: 1.5rem;
      border: 1px solid rgba(17, 79, 186, 0.1);
      box-shadow: 0 16px 35px rgba(21, 48, 74, 0.08);
    }

    .warning-card {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.96), rgba(246, 249, 255, 0.95));
    }

    .alert-icon {
      width: 3rem;
      height: 3rem;
      border-radius: 1rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: rgba(31, 111, 235, 0.1);
      color: var(--dp-primary-dark);
      flex-shrink: 0;
    }

    .emergency-card {
      flex-direction: column;
      justify-content: center;
      background: linear-gradient(135deg, rgba(20, 90, 156, 0.96), rgba(54, 138, 186, 0.92));
      color: white;
    }

    .emergency-card p {
      color: rgba(255, 255, 255, 0.82);
    }

    .emergency-card .dp-eyebrow {
      background: rgba(255, 255, 255, 0.12);
      color: rgba(255, 255, 255, 0.92);
    }

    .emergency-card .btn-light {
      color: var(--dp-primary-dark);
      font-weight: 700;
      border: none;
      box-shadow: 0 16px 30px rgba(12, 44, 80, 0.16);
    }

    .section-heading {
      max-width: 54rem;
      margin-inline: auto;
    }

    .feature-card {
      padding: 1.6rem;
      border-radius: 1.6rem;
      background: rgba(255, 255, 255, 0.94);
      border: 1px solid rgba(17, 79, 186, 0.1);
      box-shadow: 0 18px 40px rgba(21, 48, 74, 0.08);
      transition: transform 0.25s ease, box-shadow 0.25s ease;
    }

    .feature-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 24px 48px rgba(21, 48, 74, 0.12);
    }

    .feature-card h3 {
      margin: 1rem 0 0.65rem;
      font-size: 1.2rem;
    }

    .feature-card p {
      margin: 0;
      color: var(--dp-muted);
      line-height: 1.65;
    }

    .feature-icon {
      width: 3.2rem;
      height: 3.2rem;
      border-radius: 1rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: rgba(31, 111, 235, 0.12);
      color: var(--dp-primary-dark);
    }

    .feature-icon.teal {
      background: rgba(15, 139, 141, 0.12);
      color: #0b7274;
    }

    .feature-icon.gold {
      background: rgba(245, 158, 11, 0.16);
      color: #b86a00;
    }

    .results-strip {
      padding: clamp(1.5rem, 2vw + 1rem, 2.5rem);
      border-radius: 2rem;
      background: linear-gradient(135deg, rgba(17, 79, 186, 0.95), rgba(31, 111, 235, 0.88));
      color: white;
      box-shadow: 0 28px 55px rgba(17, 79, 186, 0.2);
    }

    .results-strip .text-dp-muted {
      color: rgba(255, 255, 255, 0.82) !important;
    }

    .trust-card {
      height: 100%;
      padding: 1rem;
      border-radius: 1.3rem;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.14);
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .trust-card strong {
      font-family: 'Manrope', sans-serif;
      font-size: 1.35rem;
      font-weight: 800;
    }

    .trust-card span {
      color: rgba(255, 255, 255, 0.8);
    }

    @media (max-width: 991.98px) {
      .hero-visual {
        min-height: auto;
      }

      .supporting-image-card {
        top: 0.5rem;
        right: 0;
        width: min(34%, 10rem);
      }

      .floating-note {
        position: static;
        margin-top: 1rem;
      }
    }

    @media (max-width: 575.98px) {
      .hero-card,
      .results-strip {
        border-radius: 1.5rem;
      }

      .supporting-image-card {
        position: static;
        width: min(100%, 15rem);
        margin: 1rem auto 0;
        transform: none;
      }

      .alert-card {
        flex-direction: column;
      }
    }
  `]
})
export class HomeComponent {}
