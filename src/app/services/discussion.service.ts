import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { DepressionAnalysisService } from './depression-analysis.service';
import { DiscussionMessage, DiscussionThread } from '../models/index';

@Injectable({
  providedIn: 'root'
})
export class DiscussionService {
  private readonly STORAGE_KEY = 'deltapress_discussion_threads';

  constructor(
    private analysisService: DepressionAnalysisService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  getThreadsForUser(userId: string): Observable<DiscussionThread[]> {
    return of(
      this.loadThreads()
        .filter(thread => thread.userId === userId)
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    );
  }

  createReflection(userId: string, text: string): Observable<DiscussionThread> {
    const analysis = this.analysisService.analyzeFreeText(text);
    const userMessage: DiscussionMessage = {
      id: `msg_user_${Date.now()}`,
      author: 'user',
      content: text,
      createdAt: new Date()
    };

    const assistantMessage: DiscussionMessage = {
      id: `msg_assistant_${Date.now()}`,
      author: 'assistant',
      content: this.buildAssistantReply(analysis),
      createdAt: new Date()
    };

    const thread: DiscussionThread = {
      id: `thread_${Date.now()}`,
      userId,
      title: this.buildTitle(text),
      moodTag: analysis?.sentiment || 'stable',
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: [userMessage, assistantMessage],
      textAnalysis: analysis
    };

    const threads = this.loadThreads();
    threads.unshift(thread);
    this.persistThreads(threads.slice(0, 20));

    return of(thread).pipe(delay(300));
  }

  private buildAssistantReply(analysis: ReturnType<DepressionAnalysisService['analyzeFreeText']>): string {
    if (!analysis) {
      return 'Merci pour ce partage. Ecrire ce que vous ressentez est deja une premiere etape utile.';
    }

    if (analysis.crisisDetected) {
      return 'Votre message contient des formulations de crise. Je vous recommande de contacter immediatement une aide urgente ou une personne de confiance.';
    }

    if (analysis.sentiment === 'distressed') {
      return 'Ce que vous decrivez traduit une detresse importante. Il peut etre utile de completer le test et de consulter un professionnel rapidement.';
    }

    if (analysis.sentiment === 'fragile') {
      return 'On ressent plusieurs signes de fragilite dans votre message. Continuer a mettre des mots dessus peut aider a clarifier la suite.';
    }

    return 'Votre message apporte un contexte utile. Vous pouvez poursuivre dans cet espace ou lancer le test rapide pour obtenir un bilan structure.';
  }

  private buildTitle(text: string): string {
    return text.trim().split(/\s+/).slice(0, 6).join(' ') || 'Nouvelle discussion';
  }

  private loadThreads(): DiscussionThread[] {
    if (!isPlatformBrowser(this.platformId)) {
      return [];
    }

    const raw = localStorage.getItem(this.STORAGE_KEY);
    return raw ? JSON.parse(raw) as DiscussionThread[] : [];
  }

  private persistThreads(threads: DiscussionThread[]): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(threads));
  }
}
