export type UserRole = 'user' | 'doctor' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  professionalProfileId?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  location?: string;
  language: string;
  preferences?: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  notifications: boolean;
  newsletter: boolean;
  dataSharing: boolean;
  theme: 'light' | 'dark';
  crisisAlerts: boolean;
}

export interface Question {
  id: string;
  category: QuestionCategory;
  text: string;
  type: 'single_choice' | 'multiple_choice' | 'likert_scale' | 'text' | 'select' | 'number' | 'slider';
  options?: QuestionOption[];
  min?: number;
  max?: number;
  step?: number;
  modelVariable?: string;
  required: boolean;
  weight: number;
  order: number;
}

export type QuestionCategory =
  | 'mood'
  | 'sleep'
  | 'energy'
  | 'anxiety'
  | 'appetite'
  | 'self_worth'
  | 'concentration'
  | 'isolation'
  | 'interest'
  | 'suicidal_thoughts'
  | 'sociodemographic'
  | 'academic'
  | 'professional'
  | 'physical_health'
  | 'psychological';

export interface QuestionOption {
  value: number | string;
  label: string;
  score: number;
}

export interface QuestionnaireResponse {
  id: string;
  userId?: string;
  answers: Answer[];
  freeTextResponse?: string;
  completedAt: Date;
  duration: number;
  ipAddress?: string;
}

export interface Answer {
  questionId: string;
  value: number | string | string[];
  score: number;
}

export type RiskLevel = 'low' | 'moderate' | 'high' | 'critical';
export type SeverityLevel =
  | 'normal'
  | 'mild'
  | 'moderate'
  | 'moderately_severe'
  | 'severe';

export interface ClinicalInterpretation {
  level: SeverityLevel;
  label: string;
  description: string;
  scoreRange: string;
  consultRecommended: boolean;
  urgentSupport: boolean;
}

export interface TextAnalysisMarker {
  category: 'distress' | 'isolation' | 'hopelessness' | 'anhedonia' | 'crisis' | 'protective';
  label: string;
  matches: string[];
  weight: number;
}

export interface TextAnalysisResult {
  summary: string;
  sentiment: 'stable' | 'fragile' | 'distressed' | 'critical';
  detectedThemes: string[];
  markers: TextAnalysisMarker[];
  crisisDetected: boolean;
  recommendedAction: string;
  confidence: number;
}

export interface PredictionResult {
  id: string;
  questionnaireId: string;
  userId?: string;
  riskLevel: RiskLevel;
  severity: SeverityLevel;
  severityLabel: string;
  clinicalInterpretation: ClinicalInterpretation;
  probability: number;
  score: number;
  maxScore: number;
  categoryScores: CategoryScore[];
  influentialFactors: InfluentialFactor[];
  recommendations: Recommendation[];
  recommendedProfessionals?: Professional[];
  textAnalysis?: TextAnalysisResult;
  freeTextResponse?: string;
  urgentSupportNeeded: boolean;
  followUpAdvice?: string[];
  createdAt: Date;
  xgboost?: {
    probability: number;
    treeOutputs: number[];
    featureImportance: Array<{ name: string; value: number }>;
  };
  modelVersion: string;
}

export interface CategoryScore {
  category: QuestionCategory;
  score: number;
  maxScore: number;
  percentage: number;
}

export interface InfluentialFactor {
  factor: string;
  impact: 'high' | 'medium' | 'low';
  direction: 'positive' | 'negative';
  description: string;
}

export interface Recommendation {
  id: string;
  type: RecommendationType;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  content?: string;
  resources?: Resource[];
}

export type RecommendationType =
  | 'sleep'
  | 'stress_management'
  | 'physical_activity'
  | 'breathing'
  | 'journaling'
  | 'meditation'
  | 'social_connection'
  | 'professional_help'
  | 'crisis_support'
  | 'discussion';

export interface Resource {
  title: string;
  url?: string;
  type: 'article' | 'video' | 'app' | 'exercise' | 'contact';
  description?: string;
}

export interface Professional {
  id: string;
  firstName: string;
  lastName: string;
  title: 'psychiatrist' | 'psychologist' | 'therapist' | 'counselor';
  specialties: string[];
  languages: string[];
  location: Location;
  contact: ContactInfo;
  availability: Availability;
  pricing?: Pricing;
  experience: number;
  education: string[];
  certifications: string[];
  photoUrl?: string;
  bio?: string;
  verified: boolean;
  status?: 'pending' | 'approved' | 'blocked';
  acceptsNewPatients: boolean;
  onlineConsultation: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Location {
  address: string;
  city: string;
  postalCode: string;
  country: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface ContactInfo {
  phone: string;
  email: string;
  website?: string;
  whatsapp?: string;
  bookingUrl?: string;
}

export interface Availability {
  monday?: TimeSlot[];
  tuesday?: TimeSlot[];
  wednesday?: TimeSlot[];
  thursday?: TimeSlot[];
  friday?: TimeSlot[];
  saturday?: TimeSlot[];
  sunday?: TimeSlot[];
}

export interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
}

export interface Pricing {
  consultation: number;
  currency: string;
  insuranceAccepted?: string[];
}

export interface EmergencyResource {
  id: string;
  name: string;
  type: 'hotline' | 'chat' | 'sms' | 'in_person';
  phoneNumber?: string;
  website?: string;
  description: string;
  available24_7: boolean;
  languages: string[];
  country: string;
  priority: number;
}

export interface HelpContent {
  id: string;
  type: HelpContentType;
  title: string;
  description: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  published: boolean;
}

export type HelpContentType =
  | 'article'
  | 'exercise'
  | 'tip'
  | 'video'
  | 'podcast';

export interface TestHistory {
  id: string;
  userId: string;
  results: PredictionResult[];
  trend: 'improving' | 'stable' | 'declining' | 'fluctuating';
  lastTestDate: Date;
  totalTests: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role?: UserRole;
  dateOfBirth?: Date;
  gender?: User['gender'];
  consentPrivacy: boolean;
  consentData?: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
  expiresAt: Date;
}

export interface FilterOptions {
  city?: string;
  specialty?: string;
  language?: string;
  onlineOnly?: boolean;
  availableNow?: boolean;
  acceptsNewPatients?: boolean;
  maxPrice?: number;
  searchTerm?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DiscussionMessage {
  id: string;
  author: 'user' | 'assistant' | 'doctor';
  content: string;
  createdAt: Date;
}

export interface DiscussionThread {
  id: string;
  userId: string;
  title: string;
  moodTag: 'stable' | 'fragile' | 'distressed' | 'critical';
  createdAt: Date;
  updatedAt: Date;
  messages: DiscussionMessage[];
  textAnalysis?: TextAnalysisResult;
}

export interface SupportRequest {
  id: string;
  professionalId: string;
  userId?: string;
  userName: string;
  userEmail: string;
  message: string;
  preferredContact: 'email' | 'phone' | 'whatsapp';
  type: 'message' | 'appointment';
  urgency: 'low' | 'medium' | 'high';
  status: 'new' | 'accepted' | 'scheduled' | 'closed';
  createdAt: Date;
  sharedResultId?: string;
}

export interface SharedAssessment {
  id: string;
  professionalId: string;
  userId: string;
  userName: string;
  resultId: string;
  severityLabel: string;
  score: number;
  urgentSupportNeeded: boolean;
  createdAt: Date;
}
