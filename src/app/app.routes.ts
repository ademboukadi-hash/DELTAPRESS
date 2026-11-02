import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { QuestionnaireComponent } from './components/questionnaire/questionnaire.component';
import { ResultComponent } from './components/result/result.component';
import { SolutionsComponent } from './components/solutions/solutions.component';
import { DirectoryComponent } from './components/directory/directory.component';
import { EmergencyComponent } from './components/emergency/emergency.component';
import { DiscussionComponent } from './components/discussion/discussion.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AdminComponent } from './components/admin/admin.component';
import { DoctorComponent } from './components/doctor/doctor.component';
import { ProfessionalDetailComponent } from './components/directory/professional-detail/professional-detail.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'questionnaire', component: QuestionnaireComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['user'] } },
  { path: 'result/:id', component: ResultComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['user'] } },
  { path: 'solutions', component: SolutionsComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['user'] } },
  { path: 'discussion', component: DiscussionComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['user'] } },
  { path: 'directory', component: DirectoryComponent },
  { path: 'directory/:id', component: ProfessionalDetailComponent },
  { path: 'emergency', component: EmergencyComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', redirectTo: 'user' },
  { path: 'user', component: ProfileComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['user'] } },
  { path: 'doctor', component: DoctorComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['doctor'] } },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['admin'] } },
  { path: '**', redirectTo: '' }
];
