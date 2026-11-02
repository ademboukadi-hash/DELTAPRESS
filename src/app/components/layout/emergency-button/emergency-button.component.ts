import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'app-emergency-button',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatBadgeModule
  ],
  template: `
    <button 
      mat-fab 
      color="warn" 
      class="emergency-fab"
      matTooltip="Mode Urgence - Cliquez si vous êtes en crise"
      matTooltipPosition="left"
      (click)="navigateToEmergency()">
      <mat-icon>emergency</mat-icon>
    </button>
  `,
  styles: [`
    .emergency-fab {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 1001;
      background: linear-gradient(135deg, hsl(5, 75%, 52%) 0%, hsl(5, 82%, 46%) 100%) !important;
      color: white !important;
      box-shadow: 0 8px 30px rgba(220, 53, 69, 0.3) !important;
      animation: dp-heartbeat 2.2s cubic-bezier(0.25, 0.8, 0.25, 1) infinite;
      transition: all 0.3s ease !important;
      border: 1px solid rgba(255, 255, 255, 0.15) !important;
    }

    .emergency-fab:hover {
      transform: scale(1.08) rotate(15deg);
      box-shadow: 0 12px 35px rgba(220, 53, 69, 0.5) !important;
    }
    
    @keyframes dp-heartbeat {
      0% {
        box-shadow: 0 0 0 0 rgba(220, 53, 69, 0.6);
        transform: scale(1);
      }
      25% {
        box-shadow: 0 0 0 15px rgba(220, 53, 69, 0);
        transform: scale(1.06);
      }
      40% {
        box-shadow: 0 0 0 0 rgba(220, 53, 69, 0.6);
        transform: scale(1);
      }
      55% {
        box-shadow: 0 0 0 10px rgba(220, 53, 69, 0);
        transform: scale(1.04);
      }
      100% {
        box-shadow: 0 0 0 0 rgba(220, 53, 69, 0);
        transform: scale(1);
      }
    }
    
    @media (max-width: 600px) {
      .emergency-fab {
        bottom: 16px;
        right: 16px;
      }
    }
  `]
})
export class EmergencyButtonComponent {
  constructor(private router: Router) {}

  navigateToEmergency(): void {
    this.router.navigate(['/emergency']);
  }
}
