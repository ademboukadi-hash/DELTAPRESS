import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/layout/navbar/navbar.component';
import { FooterComponent } from './components/layout/footer/footer.component';
import { EmergencyButtonComponent } from './components/layout/emergency-button/emergency-button.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent, EmergencyButtonComponent],
  template: `
    <div class="app-shell">
      <app-navbar></app-navbar>
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
      <app-footer></app-footer>
      <app-emergency-button></app-emergency-button>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
    }

    .app-shell {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .main-content {
      flex: 1;
      padding-top: 88px;
      position: relative;
    }

    @media (max-width: 991.98px) {
      .main-content {
        padding-top: 80px;
      }
    }
  `]
})
export class App {
}
