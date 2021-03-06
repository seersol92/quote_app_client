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
import { FileUtilService } from './services/file.util.service';
import { LoggedInService } from './services/logged-in.service';
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
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { OrderModule } from 'ngx-order-pipe';
import { UserComponent } from './user/user.component';
import { Constants } from './common/file.constants';
import { ChatService } from './services/chat.service';
import { ActiveListComponent } from './chat/active-list/active-list.component';
import { ChatRoomComponent } from './chat/chat-room/chat-room.component';
import { MessageComponent } from './chat/message/message.component';
import { ChatAppComponent } from './chat-app/chat-app.component';


const APP_ROUTES: Routes = [
  {
    path: '',
    component: LoginComponent,
    canActivate: [NotAuthGuard]
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
  { path: 'chat', canActivate: [AuthGuard], children: [
    { path: ':chatWith', component: ChatRoomComponent },
    { path: '**', redirectTo: '/chat/chat-room', pathMatch: 'full' }
  ] },
  {
    path: 'cargo_register',
    component: CargoRegisterComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'company_register',
    component: CompanyRegisterComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'vessel_register',
    component: VesselRegisterComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'user-management',
    component: UserComponent,
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
    VesselRegisterComponent,
    UserComponent,
    ActiveListComponent,
    ChatRoomComponent,
    MessageComponent,
    ChatAppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    OrderModule,
    Ng2SearchPipeModule,
    FlashMessagesModule,
    ReactiveFormsModule,
    RouterModule.forRoot(APP_ROUTES),
    ModalModule.forRoot(),
  ],
  providers: [AuthService, AuthGuard, NotAuthGuard, LoggedInService, FileUtilService, ChatService],
  bootstrap: [AppComponent],
  exports: [ RouterModule ],

})
export class AppModule { }
