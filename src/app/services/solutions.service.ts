import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HelpContent, HelpContentType, Recommendation } from '../models/index';

@Injectable({
  providedIn: 'root'
})
export class SolutionsService {
  private readonly API_URL = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getHelpContents(type?: HelpContentType): Observable<HelpContent[]> {
    const params = type ? { params: { type } } : {};
    return this.http.get<HelpContent[]>(`${this.API_URL}/help-contents`, params)
      .pipe(catchError(() => of(this.getMockHelpContents(type))));
  }

  getHelpContentById(id: string): Observable<HelpContent> {
    return this.http.get<HelpContent>(`${this.API_URL}/help-contents/${id}`)
      .pipe(catchError(() => {
        const contents = this.getMockHelpContents();
        return of(contents[0]);
      }));
  }

  getRecommendationsByRiskLevel(riskLevel: string): Observable<Recommendation[]> {
    return this.http.get<Recommendation[]>(
      `${this.API_URL}/recommendations`,
      { params: { riskLevel } }
    ).pipe(catchError(() => of(this.getMockRecommendations(riskLevel))));
  }

  private getMockHelpContents(type?: HelpContentType): HelpContent[] {
    const allContents: HelpContent[] = [
      {
        id: 'content_1',
        type: 'exercise',
        title: 'Respiration 4-7-8',
        description: 'Une technique de respiration simple pour réduire l\'anxiété rapidement.',
        content: `
          <h3>La technique 4-7-8</h3>
          <p>Cette technique de respiration, développée par le Dr. Andrew Weil, est un outil puissant pour calmer le système nerveux.</p>
          <ol>
            <li>Asseyez-vous confortablement et placez la pointe de votre langue contre le palais derrière vos dents du haut.</li>
            <li>Expirez complètement par la bouche en faisant un bruit de « souffle ».</li>
            <li>Fermez la bouche et inspirez silencieusement par le nez en comptant jusqu'à 4.</li>
            <li>Retenez votre souffle en comptant jusqu'à 7.</li>
            <li>Expirez complètement par la bouche en comptant jusqu'à 8.</li>
            <li>Répétez ce cycle 3 à 4 fois.</li>
          </ol>
          <p>Pratiquez cette exercice deux fois par jour pour en ressentir les bénéfices complets.</p>
        `,
        tags: ['respiration', 'anxiété', 'stress', 'relaxation'],
        createdAt: new Date(),
        updatedAt: new Date(),
        published: true
      },
      {
        id: 'content_2',
        type: 'article',
        title: 'Améliorer son sommeil naturellement',
        description: 'Conseils pratiques pour retrouver un sommeil réparateur.',
        content: `
          <h3>Hygiène du sommeil</h3>
          <p>Un bon sommeil est essentiel pour la santé mentale. Voici des stratégies éprouvées :</p>
          <ul>
            <li><strong>Régularité :</strong> Couchez-vous et levez-vous à la même heure chaque jour.</li>
            <li><strong>Environnement :</strong> Gardez votre chambre fraîche, sombre et silencieuse.</li>
            <li><strong>Limitation des écrans :</strong> Évitez les écrans 1 heure avant le coucher.</li>
            <li><strong>Routine :</strong> Créez un rituel du coucher relaxant (lecture, méditation, bain chaud).</li>
            <li><strong>Activité physique :</strong> Faites de l'exercice régulièrement, mais pas trop tard.</li>
            <li><strong>Alimentation :</strong> Évitez les repas lourds et la caféine le soir.</li>
          </ul>
        `,
        tags: ['sommeil', 'routine', 'bien-être'],
        createdAt: new Date(),
        updatedAt: new Date(),
        published: true
      },
      {
        id: 'content_3',
        type: 'exercise',
        title: 'Journal des pensées',
        description: 'Apprenez à identifier et à réévaluer vos pensées négatives automatiques.',
        content: `
          <h3>Technique du journal cognitif</h3>
          <p>Les pensées négatives automatiques peuvent entretenir la dépression et l'anxiété. Cet exercice vous aide à les identifier et à les challenger.</p>
          <p><strong>Colonne 1 :</strong> La situation - Décrivez ce qui s'est passé</p>
          <p><strong>Colonne 2 :</strong> L'émotion - Qu'avez-vous ressenti ? Notez l'intensité (0-100%)</p>
          <p><strong>Colonne 3 :</strong> La pensée automatique - Qu'est-ce qui vous a traversé l'esprit ?</p>
          <p><strong>Colonne 4 :</strong> Preuves pour - Y a-t-il des faits qui soutiennent cette pensée ?</p>
          <p><strong>Colonne 5 :</strong> Preuves contre - Y a-t-il des faits qui contredisent cette pensée ?</p>
          <p><strong>Colonne 6 :</strong> Pensée alternative - Quelle pensée plus équilibrée pourriez-vous avoir ?</p>
          <p><strong>Colonne 7 :</strong> Réévaluez l'émotion - Quelle est maintenant l'intensité (0-100%) ?</p>
        `,
        tags: ['journaling', 'tcc', 'pensées', 'cognition'],
        createdAt: new Date(),
        updatedAt: new Date(),
        published: true
      },
      {
        id: 'content_4',
        type: 'article',
        title: 'Parler de sa dépression à ses proches',
        description: 'Comment aborder le sujet de votre santé mentale avec famille et amis.',
        content: `
          <h3>Ouvrir le dialogue</h3>
          <p>Parler de sa dépression peut être difficile, mais le soutien de vos proches est précieux.</p>
          <h4>Conseils pour la conversation :</h4>
          <ul>
            <li><strong>Choisissez le bon moment :</strong> Un moment calme où vous ne serez pas interrompus.</li>
            <li><strong>Soyez honnête :</strong> Expliquez simplement ce que vous ressentez.</li>
            <li><strong>Donnez des exemples :</strong> « Je me sens épuisé même après une nuit de sommeil ».</li>
            <li><strong>Exprimez vos besoins :</strong> Dites ce qui vous aiderait (écoute, accompagnement aux RDV...).</li>
            <li><strong>Soyez patient :</strong> Vos proches peuvent avoir besoin de temps pour comprendre.</li>
          </ul>
        `,
        tags: ['communication', 'proches', 'soutien', 'parler'],
        createdAt: new Date(),
        updatedAt: new Date(),
        published: true
      },
      {
        id: 'content_5',
        type: 'exercise',
        title: 'Marche méditative',
        description: 'Alliez activité physique et pleine conscience pour un double bénéfice.',
        content: `
          <h3>La marche en pleine conscience</h3>
          <p>Cette pratique combine les bienfaits de l'exercice physique et de la méditation.</p>
          <ol>
            <li>Trouvez un endroit calme pour marcher (parc, jardin, ou même votre couloir).</li>
            <li>Marchez à un rythme naturel et confortable.</li>
            <li>Portez votre attention sur la sensation de vos pieds touchant le sol.</li>
            <li>Notez le mouvement de vos jambes, le balancement de vos bras.</li>
            <li>Observez votre environnement sans jugement : les couleurs, les sons, les odeurs.</li>
            <li>Quand votre esprit s'égare, ramenez doucement votre attention à la marche.</li>
            <li>Commencez par 10 minutes et augmentez progressivement.</li>
          </ol>
        `,
        tags: ['méditation', 'marche', 'exercice', 'mindfulness'],
        createdAt: new Date(),
        updatedAt: new Date(),
        published: true
      }
    ];

    if (type) {
      return allContents.filter(c => c.type === type);
    }
    return allContents;
  }

  private getMockRecommendations(riskLevel: string): Recommendation[] {
    const allRecommendations: Recommendation[] = [
      {
        id: 'rec_sleep',
        type: 'sleep',
        title: 'Améliorer votre sommeil',
        description: 'Établissez une routine de sommeil régulière pour améliorer votre qualité de repos.',
        priority: 'high',
        content: 'Couchez-vous et levez-vous à des heures fixes. Évitez les écrans 1 heure avant le coucher.'
      },
      {
        id: 'rec_activity',
        type: 'physical_activity',
        title: 'Activité physique régulière',
        description: 'L\'exercice aide à libérer des endorphines et améliore l\'humeur.',
        priority: 'medium',
        content: 'Commencez par 20-30 minutes de marche rapide par jour.'
      },
      {
        id: 'rec_journal',
        type: 'journaling',
        title: 'Journal des émotions',
        description: 'Écrire vos pensées peut vous aider à mieux comprendre vos émotions.',
        priority: 'medium',
        content: 'Prenez 10 minutes chaque jour pour noter vos pensées sans jugement.'
      },
      {
        id: 'rec_breathing',
        type: 'breathing',
        title: 'Exercices de respiration',
        description: 'La respiration profonde active le système nerveux parasympathique.',
        priority: 'high',
        content: 'Pratiquez la respiration 4-7-8 : inspirez 4s, retenez 7s, expirez 8s.'
      },
      {
        id: 'rec_stress',
        type: 'stress_management',
        title: 'Gestion du stress',
        description: 'Apprenez à identifier et gérer vos sources de stress.',
        priority: 'medium',
        content: 'Identifiez les stressors et élaborez des stratégies d\'adaptation.'
      },
      {
        id: 'rec_meditation',
        type: 'meditation',
        title: 'Méditation guidée',
        description: 'La méditation régulière réduit l\'anxiété et améliore la concentration.',
        priority: 'low',
        content: 'Commencez avec 5 minutes de méditation guidée par jour.'
      },
      {
        id: 'rec_social',
        type: 'social_connection',
        title: 'Maintenir le lien social',
        description: 'L\'isolement social aggrave la dépression. Restez connecté(e).',
        priority: 'high',
        content: 'Prenez contact avec un proche au moins une fois par semaine.'
      },
      {
        id: 'rec_pro',
        type: 'professional_help',
        title: 'Consulter un professionnel',
        description: 'Un accompagnement professionnel peut faire une grande différence.',
        priority: 'high',
        content: 'N\'hésitez pas à consulter un psychologue ou un psychiatre.'
      }
    ];

    if (riskLevel === 'high' || riskLevel === 'critical') {
      return allRecommendations.filter(r => 
        r.priority === 'high' || r.type === 'professional_help'
      );
    } else if (riskLevel === 'moderate') {
      return allRecommendations.filter(r => 
        r.priority !== 'low' || r.type === 'sleep' || r.type === 'stress_management'
      );
    }
    
    return allRecommendations.filter(r => r.priority === 'low' || r.priority === 'medium');
  }
}
