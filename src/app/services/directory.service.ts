import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  FilterOptions,
  PaginationParams,
  PaginatedResponse,
  PredictionResult,
  Professional,
  SeverityLevel,
  SharedAssessment,
  SupportRequest,
  User
} from '../models/index';

@Injectable({
  providedIn: 'root'
})
export class DirectoryService {
  private readonly API_URL = 'http://localhost:3000/api';
  private readonly PROFESSIONALS_KEY = 'deltapress_professionals';
  private readonly SUPPORT_REQUESTS_KEY = 'deltapress_support_requests';
  private readonly SHARED_RESULTS_KEY = 'deltapress_shared_results';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  searchProfessionals(
    filters: FilterOptions,
    pagination: PaginationParams = { page: 1, limit: 10 }
  ): Observable<PaginatedResponse<Professional>> {
    const params = this.buildFilterParams(filters, pagination);

    return this.http.get<PaginatedResponse<Professional>>(
      `${this.API_URL}/professionals`,
      { params }
    ).pipe(
      catchError(() => of(this.getMockProfessionalsResponse(filters, pagination)))
    );
  }

  getAllProfessionals(): Observable<Professional[]> {
    return of(
      [...this.getAllMockProfessionals()].sort((a, b) =>
        a.lastName.localeCompare(b.lastName)
      )
    );
  }

  getProfessionalById(id: string): Observable<Professional> {
    return this.http.get<Professional>(`${this.API_URL}/professionals/${id}`)
      .pipe(catchError(() => of(this.getAllMockProfessionals().find(item => item.id === id) || this.getAllMockProfessionals()[0])));
  }

  getSpecialties(): Observable<string[]> {
    return this.http.get<string[]>(`${this.API_URL}/professionals/specialties`)
      .pipe(catchError(() => of([
        'Depression',
        'Anxiete',
        'Troubles du sommeil',
        'Stress',
        'Burn-out',
        'Therapie cognitive',
        'Suivi de crise',
        'Psychiatrie adulte'
      ])));
  }

  getCities(): Observable<string[]> {
    return this.http.get<string[]>(`${this.API_URL}/professionals/cities`)
      .pipe(catchError(() => of([
        'Paris',
        'Lyon',
        'Marseille',
        'Bordeaux',
        'Toulouse',
        'Nantes',
        'Strasbourg',
        'Lille'
      ])));
  }

  getRecommendedProfessionals(severity: SeverityLevel, urgentSupport = false): Observable<Professional[]> {
    const list = this.getAllMockProfessionals()
      .filter(item => item.verified && item.acceptsNewPatients)
      .sort((a, b) => this.getPriorityScore(b, severity, urgentSupport) - this.getPriorityScore(a, severity, urgentSupport))
      .slice(0, urgentSupport ? 2 : 3);

    return of(list);
  }

  getProfessionalForUser(user: User): Observable<Professional | null> {
    const professional = this.getAllMockProfessionals().find(item => item.id === user.professionalProfileId) || null;
    return of(professional);
  }

  updateProfessionalProfile(professionalId: string, updates: Partial<Professional>): Observable<Professional> {
    const professionals = this.getAllMockProfessionals();
    const index = professionals.findIndex(item => item.id === professionalId);

    if (index < 0) {
      return of(this.getAllMockProfessionals()[0]);
    }

    const mergedPricing = professionals[index].pricing || updates.pricing
      ? {
          consultation: updates.pricing?.consultation ?? professionals[index].pricing?.consultation ?? 0,
          currency: updates.pricing?.currency ?? professionals[index].pricing?.currency ?? 'EUR',
          insuranceAccepted: updates.pricing?.insuranceAccepted ?? professionals[index].pricing?.insuranceAccepted
        }
      : undefined;

    const updatedProfessional: Professional = {
      ...professionals[index],
      ...updates,
      contact: {
        ...professionals[index].contact,
        ...(updates.contact || {})
      },
      location: {
        ...professionals[index].location,
        ...(updates.location || {})
      },
      pricing: mergedPricing,
      updatedAt: new Date()
    };

    professionals[index] = updatedProfessional;
    this.persist(this.PROFESSIONALS_KEY, professionals);

    return of(updatedProfessional);
  }

  contactProfessional(professionalId: string, message: ContactMessage): Observable<void> {
    const request: SupportRequest = {
      id: `req_${Date.now()}`,
      professionalId,
      userId: message.userId,
      userName: message.name,
      userEmail: message.email,
      message: message.message,
      preferredContact: message.preferredContact,
      type: message.type || 'message',
      urgency: message.urgency,
      status: 'new',
      createdAt: new Date(),
      sharedResultId: message.sharedResultId
    };

    this.saveSupportRequest(request);

    return this.http.post<void>(
      `${this.API_URL}/professionals/${professionalId}/contact`,
      message
    ).pipe(catchError(() => of(undefined)));
  }

  getRequestsForProfessional(professionalId: string): Observable<SupportRequest[]> {
    return of(
      this.loadSupportRequests()
        .filter(request => request.professionalId === professionalId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    );
  }

  getRequestsByUser(userId: string): Observable<SupportRequest[]> {
    return of(
      this.loadSupportRequests()
        .filter(request => request.userId === userId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    );
  }

  shareAssessment(professionalId: string, result: PredictionResult, user: User): Observable<SharedAssessment> {
    const shared: SharedAssessment = {
      id: `shared_${Date.now()}`,
      professionalId,
      userId: user.id,
      userName: user.name,
      resultId: result.id,
      severityLabel: result.severityLabel,
      score: result.score,
      urgentSupportNeeded: result.urgentSupportNeeded,
      createdAt: new Date()
    };

    const stored = this.loadSharedAssessments();
    stored.unshift(shared);
    this.persist(this.SHARED_RESULTS_KEY, stored);

    return of(shared);
  }

  getSharedAssessmentsForProfessional(professionalId: string): Observable<SharedAssessment[]> {
    return of(
      this.loadSharedAssessments()
        .filter(item => item.professionalId === professionalId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    );
  }

  updateSupportRequestStatus(
    requestId: string,
    status: SupportRequest['status']
  ): Observable<SupportRequest | null> {
    const requests = this.loadSupportRequests();
    const index = requests.findIndex(item => item.id === requestId);

    if (index < 0) {
      return of(null);
    }

    const updatedRequest: SupportRequest = {
      ...requests[index],
      status
    };

    requests[index] = updatedRequest;
    this.persist(this.SUPPORT_REQUESTS_KEY, requests);

    return of(updatedRequest);
  }

  updateProfessionalStatus(
    professionalId: string,
    status: NonNullable<Professional['status']>
  ): Observable<Professional | null> {
    const professionals = this.getAllMockProfessionals();
    const index = professionals.findIndex(item => item.id === professionalId);

    if (index < 0) {
      return of(null);
    }

    const updatedProfessional: Professional = {
      ...professionals[index],
      status,
      verified: status === 'approved' ? true : professionals[index].verified,
      updatedAt: new Date()
    };

    professionals[index] = updatedProfessional;
    this.persist(this.PROFESSIONALS_KEY, professionals);

    return of(updatedProfessional);
  }

  getAdminStats(): Observable<{
    totalProfessionals: number;
    approvedProfessionals: number;
    pendingProfessionals: number;
    blockedProfessionals: number;
    supportRequests: number;
    sharedAssessments: number;
  }> {
    const professionals = this.getAllMockProfessionals();
    const requests = this.loadSupportRequests();
    const sharedAssessments = this.loadSharedAssessments();

    return of({
      totalProfessionals: professionals.length,
      approvedProfessionals: professionals.filter(item => item.status === 'approved').length,
      pendingProfessionals: professionals.filter(item => item.status === 'pending').length,
      blockedProfessionals: professionals.filter(item => item.status === 'blocked').length,
      supportRequests: requests.length,
      sharedAssessments: sharedAssessments.length
    });
  }

  private buildFilterParams(filters: FilterOptions, pagination: PaginationParams): Record<string, string> {
    const params: Record<string, string> = {
      page: pagination.page.toString(),
      limit: pagination.limit.toString()
    };

    if (filters.city) params['city'] = filters.city;
    if (filters.specialty) params['specialty'] = filters.specialty;
    if (filters.language) params['language'] = filters.language;
    if (filters.onlineOnly) params['onlineOnly'] = 'true';
    if (filters.availableNow) params['availableNow'] = 'true';
    if (filters.acceptsNewPatients) params['acceptsNewPatients'] = 'true';
    if (filters.maxPrice) params['maxPrice'] = filters.maxPrice.toString();
    if (filters.searchTerm) params['search'] = filters.searchTerm;

    return params;
  }

  private getMockProfessionalsResponse(
    filters: FilterOptions,
    pagination: PaginationParams
  ): PaginatedResponse<Professional> {
    let data = [...this.getAllMockProfessionals()];

    if (filters.city) {
      data = data.filter(item => item.location.city === filters.city);
    }

    if (filters.specialty) {
      data = data.filter(item => item.specialties.includes(filters.specialty!));
    }

    if (filters.onlineOnly) {
      data = data.filter(item => item.onlineConsultation);
    }

    if (filters.acceptsNewPatients) {
      data = data.filter(item => item.acceptsNewPatients);
    }

    if (filters.maxPrice) {
      data = data.filter(item => (item.pricing?.consultation || 0) <= filters.maxPrice!);
    }

    if (filters.searchTerm?.trim()) {
      const search = filters.searchTerm.trim().toLowerCase();
      data = data.filter(item =>
        `${item.firstName} ${item.lastName}`.toLowerCase().includes(search) ||
        item.specialties.some(specialty => specialty.toLowerCase().includes(search)) ||
        item.location.city.toLowerCase().includes(search)
      );
    }

    const start = (pagination.page - 1) * pagination.limit;
    const end = start + pagination.limit;
    const paginated = data.slice(start, end);

    return {
      data: paginated,
      total: data.length,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: Math.max(1, Math.ceil(data.length / pagination.limit))
    };
  }

  private getPriorityScore(pro: Professional, severity: SeverityLevel, urgentSupport: boolean): number {
    let score = 0;

    if (pro.title === 'psychiatrist') score += 4;
    if (pro.specialties.includes('Depression')) score += 3;
    if (pro.specialties.includes('Suivi de crise')) score += 5;
    if (pro.onlineConsultation) score += 2;
    if (pro.acceptsNewPatients) score += 2;
    if (pro.verified) score += 2;

    if (severity === 'normal' || severity === 'mild') {
      score += pro.title === 'psychologist' ? 2 : 0;
    }

    if (severity === 'moderately_severe' || severity === 'severe' || urgentSupport) {
      score += pro.title === 'psychiatrist' ? 3 : 0;
    }

    return score;
  }

  private saveSupportRequest(request: SupportRequest): void {
    const requests = this.loadSupportRequests();
    requests.unshift(request);
    this.persist(this.SUPPORT_REQUESTS_KEY, requests);
  }

  private loadSupportRequests(): SupportRequest[] {
    const stored = this.read<SupportRequest>(this.SUPPORT_REQUESTS_KEY);
    if (stored.length > 0) {
      return stored;
    }

    const seeded: SupportRequest[] = [
      {
        id: 'req_seed_1',
        professionalId: 'prof_2',
        userId: 'user_demo',
        userName: 'Lea Garnier',
        userEmail: 'lea@example.com',
        message: 'Je souhaite une consultation apres un score modere et des problemes de sommeil persistants.',
        preferredContact: 'email',
        type: 'appointment',
        urgency: 'medium',
        status: 'scheduled',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18),
        sharedResultId: 'seed_result_1'
      }
    ];

    this.persist(this.SUPPORT_REQUESTS_KEY, seeded);
    return seeded;
  }

  private loadSharedAssessments(): SharedAssessment[] {
    return this.read<SharedAssessment>(this.SHARED_RESULTS_KEY);
  }

  private read<T>(key: string): T[] {
    if (!isPlatformBrowser(this.platformId)) {
      return [];
    }

    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) as T[] : [];
  }

  private persist<T>(key: string, data: T[]): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    localStorage.setItem(key, JSON.stringify(data));
  }

  private getAllMockProfessionals(): Professional[] {
    const stored = this.read<Professional>(this.PROFESSIONALS_KEY);
    if (stored.length > 0) {
      return stored;
    }

    const seeded: Professional[] = [
      {
        id: 'prof_1',
        firstName: 'Marie',
        lastName: 'Dubois',
        title: 'psychologist',
        specialties: ['Depression', 'Anxiete', 'Troubles du sommeil'],
        languages: ['Francais', 'Anglais'],
        location: {
          address: '15 Rue de la Paix',
          city: 'Paris',
          postalCode: '75002',
          country: 'France'
        },
        contact: {
          phone: '+33 1 42 60 00 00',
          email: 'marie.dubois@example.com',
          website: 'https://mariedubois-psychologue.fr',
          bookingUrl: 'https://mariedubois-psychologue.fr/rendez-vous'
        },
        availability: {
          monday: [{ start: '09:00', end: '18:00', available: true }],
          tuesday: [{ start: '09:00', end: '18:00', available: true }],
          wednesday: [{ start: '09:00', end: '18:00', available: true }],
          thursday: [{ start: '09:00', end: '18:00', available: true }],
          friday: [{ start: '09:00', end: '17:00', available: true }]
        },
        pricing: {
          consultation: 70,
          currency: 'EUR'
        },
        experience: 12,
        education: ['Doctorat en Psychologie - Universite Paris Cite'],
        certifications: ['Psychologue clinicienne', 'TCC'],
        bio: 'Specialisee dans l accompagnement de la depression et de l anxiete avec une approche clinique et bienveillante.',
        verified: true,
        status: 'approved',
        acceptsNewPatients: true,
        onlineConsultation: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'prof_2',
        firstName: 'Jean',
        lastName: 'Martin',
        title: 'psychiatrist',
        specialties: ['Depression', 'Burn-out', 'Suivi de crise', 'Psychiatrie adulte'],
        languages: ['Francais'],
        location: {
          address: '42 Avenue des Champs-Elysees',
          city: 'Paris',
          postalCode: '75008',
          country: 'France'
        },
        contact: {
          phone: '+33 1 43 59 00 00',
          email: 'dr.martin@example.com',
          bookingUrl: 'https://docteurmartin.fr/rendez-vous'
        },
        availability: {
          monday: [{ start: '10:00', end: '19:00', available: true }],
          tuesday: [{ start: '10:00', end: '19:00', available: true }],
          wednesday: [{ start: '10:00', end: '19:00', available: true }],
          thursday: [{ start: '10:00', end: '19:00', available: true }],
          friday: [{ start: '10:00', end: '16:00', available: true }]
        },
        pricing: {
          consultation: 120,
          currency: 'EUR',
          insuranceAccepted: ['CPAM', 'MGEN']
        },
        experience: 20,
        education: ['Doctorat en Medecine - Universite Lyon 1', 'Specialisation en Psychiatrie'],
        certifications: ['Psychiatre', 'Gestion des situations de crise'],
        bio: 'Psychiatre experimente, disponible pour les situations de depression moderee a severe et la coordination d urgence.',
        verified: true,
        status: 'approved',
        acceptsNewPatients: true,
        onlineConsultation: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'prof_3',
        firstName: 'Sophie',
        lastName: 'Bernard',
        title: 'psychologist',
        specialties: ['Stress', 'Therapie cognitive', 'Anxiete'],
        languages: ['Francais', 'Espagnol'],
        location: {
          address: '8 Place Bellecour',
          city: 'Lyon',
          postalCode: '69002',
          country: 'France'
        },
        contact: {
          phone: '+33 4 72 40 00 00',
          email: 'sophie.bernard@example.com',
          whatsapp: '+33 6 12 34 56 78'
        },
        availability: {
          monday: [{ start: '08:00', end: '17:00', available: true }],
          tuesday: [{ start: '08:00', end: '17:00', available: true }],
          thursday: [{ start: '08:00', end: '17:00', available: true }],
          friday: [{ start: '08:00', end: '16:00', available: true }]
        },
        pricing: {
          consultation: 60,
          currency: 'EUR'
        },
        experience: 8,
        education: ['Master en Psychologie - Universite Lyon 2'],
        certifications: ['Therapie cognitive comportementale', 'Mindfulness'],
        bio: 'Accompagnement des personnes anxieuses ou epuisees avec une approche progressive et orientee solutions.',
        verified: true,
        status: 'approved',
        acceptsNewPatients: true,
        onlineConsultation: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'prof_4',
        firstName: 'Nadia',
        lastName: 'Rahmani',
        title: 'therapist',
        specialties: ['Isolement', 'Perte d interet', 'Soutien emotionnel'],
        languages: ['Francais', 'Arabe'],
        location: {
          address: '12 Rue Faidherbe',
          city: 'Lille',
          postalCode: '59000',
          country: 'France'
        },
        contact: {
          phone: '+33 3 20 10 00 00',
          email: 'nadia.rahmani@example.com'
        },
        availability: {
          monday: [{ start: '09:00', end: '18:00', available: true }],
          wednesday: [{ start: '09:00', end: '18:00', available: true }],
          saturday: [{ start: '10:00', end: '13:00', available: true }]
        },
        pricing: {
          consultation: 55,
          currency: 'EUR'
        },
        experience: 6,
        education: ['Certification en relation d aide'],
        certifications: ['Therapie de soutien'],
        bio: 'Therapeute de soutien specialisee dans l accompagnement des personnes qui se sentent bloquees ou isolees.',
        verified: false,
        status: 'pending',
        acceptsNewPatients: true,
        onlineConsultation: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    this.persist(this.PROFESSIONALS_KEY, seeded);
    return seeded;
  }
}

export interface ContactMessage {
  name: string;
  email: string;
  phone?: string;
  message: string;
  preferredContact: 'email' | 'phone' | 'whatsapp';
  urgency: 'low' | 'medium' | 'high';
  type?: 'message' | 'appointment';
  userId?: string;
  sharedResultId?: string;
}
