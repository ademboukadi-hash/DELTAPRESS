import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { EmergencyResource, HelpContent, HelpContentType } from '../models/index';

@Injectable({
  providedIn: 'root'
})
export class EmergencyService {
  private readonly API_URL = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getEmergencyResources(country: string = 'France'): Observable<EmergencyResource[]> {
    return this.http.get<EmergencyResource[]>(
      `${this.API_URL}/emergency/resources`,
      { params: { country } }
    ).pipe(catchError(() => of(this.getMockEmergencyResources())));
  }

  getCrisisAdvice(): Observable<string[]> {
    return of([
      'Respirez profondément : inspirez pendant 4 secondes, retenez pendant 4 secondes, expirez pendant 4 secondes.',
      'Contactez immédiatement un proche de confiance - un ami, un membre de la famille.',
      'Éloignez-vous de tout objet qui pourrait vous faire du mal.',
      'Rappelez-vous que cette crise est temporaire et qu\'elle passera.',
      'Vous n\'êtes pas seul(e). Des personnes sont là pour vous aider.',
      'Essayez de vous concentrer sur le moment présent, ici et maintenant.',
      'Si vous ne vous sentez pas en sécurité, appelez les secours ou rendez-vous aux urgences.'
    ]);
  }

  private getMockEmergencyResources(): EmergencyResource[] {
    return [
      {
        id: 'emergency_1',
        name: 'SOS Suicide Phénix',
        type: 'hotline',
        phoneNumber: '01 40 09 15 22',
        description: 'Ligne d\'écoute pour les personnes en détresse psychologique et leurs proches. Appel gratuit et anonyme.',
        available24_7: true,
        languages: ['Français'],
        country: 'France',
        priority: 1
      },
      {
        id: 'emergency_2',
        name: 'SOS Amitié',
        type: 'hotline',
        phoneNumber: '09 72 39 40 50',
        description: 'Écoute anonyme et gratuite pour ceux qui souffrent dans leur vie privée ou professionnelle.',
        available24_7: true,
        languages: ['Français'],
        country: 'France',
        priority: 2
      },
      {
        id: 'emergency_3',
        name: 'Fil Santé Jeunes',
        type: 'hotline',
        phoneNumber: '0800 235 236',
        description: 'Numéro gratuit et anonyme pour les jeunes de 12 à 25 ans. Écoute, conseil, orientation.',
        available24_7: true,
        languages: ['Français'],
        country: 'France',
        priority: 3
      },
      {
        id: 'emergency_4',
        name: 'CNAPE - Contre le Harcèlement',
        type: 'hotline',
        phoneNumber: '3020',
        description: 'Numéro vert gratuit pour signaler le harcèlement scolaire et obtenir de l\'aide.',
        available24_7: true,
        languages: ['Français'],
        country: 'France',
        priority: 4
      },
      {
        id: 'emergency_5',
        name: 'Samu / Urgences médicales',
        type: 'hotline',
        phoneNumber: '15',
        description: 'Service d\'aide médicale urgente. En cas de danger immédiat pour votre santé.',
        available24_7: true,
        languages: ['Français'],
        country: 'France',
        priority: 0
      },
      {
        id: 'emergency_6',
        name: 'Police / Gendarmerie',
        type: 'hotline',
        phoneNumber: '17',
        description: 'Numéro d\'urgence police secours. En cas de danger immédiat ou menace.',
        available24_7: true,
        languages: ['Français'],
        country: 'France',
        priority: 0
      },
      {
        id: 'emergency_7',
        name: 'Numéro d\'urgence européen',
        type: 'hotline',
        phoneNumber: '112',
        description: 'Numéro d\'appel unique pour toutes les urgences dans l\'Union Européenne.',
        available24_7: true,
        languages: ['Français', 'Anglais', 'Allemand', 'Espagnol', 'Italien'],
        country: 'France',
        priority: 0
      },
      {
        id: 'emergency_8',
        name: 'Chat SOS Suicide',
        type: 'chat',
        website: 'https://www.sos-suicide-phenix.org/chat',
        description: 'Discutez en ligne avec un bénévole formé de manière anonyme et gratuite.',
        available24_7: false,
        languages: ['Français'],
        country: 'France',
        priority: 5
      }
    ];
  }
}
