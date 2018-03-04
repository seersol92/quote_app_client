import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HttpModule } from '@angular/http';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ContactComponent } from './contact/contact.component';
import { AboutComponent } from './about/about.component';
import { AuthService } from './services/auth.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { AuthGuard } from './guards/auth.guard';
import { NotAuthGuard } from './guards/notAuth.guard';
import { SidebarComponent } from './sidebar/sidebar.component';
import { CargoQuotesComponent } from './cargo-quotes/cargo-quotes.component';
import { CargoRegisterComponent } from './cargo-register/cargo-register.component';
import { CompanyRegisterComponent } from './company-register/company-register.component';
import { VesselRegisterComponent } from './vessel-register/vessel-register.component';
import {ModalModule} from 'ngx-bootstrap';
const APP_ROUTES: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [NotAuthGuard]
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [NotAuthGuard]
  },
  {
    path: 'contact_us',
    component: ContactComponent,
    canActivate: [NotAuthGuard]
  },
  {
    path: 'about_us',
    component: AboutComponent,
    canActivate: [NotAuthGuard]
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'cargo_quotes',
    component: CargoQuotesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'cargo_register',
    component: CargoRegisterComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'comapany_register',
    component: CompanyRegisterComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'vessel_register',
    component: VesselRegisterComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '' }
];
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    ContactComponent,
    AboutComponent,
    DashboardComponent,
    ProfileComponent,
    SidebarComponent,
    CargoQuotesComponent,
    CargoRegisterComponent,
    CompanyRegisterComponent,
    VesselRegisterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    FlashMessagesModule,
    ReactiveFormsModule,
    RouterModule.forRoot(APP_ROUTES),
    ModalModule.forRoot()
  ],
  providers: [AuthService, AuthGuard, NotAuthGuard],
  bootstrap: [AppComponent],
  exports: [ RouterModule ],

})
export class AppModule { }
