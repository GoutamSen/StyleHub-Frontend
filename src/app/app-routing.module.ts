import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { UserdashboardComponent } from './components/userdashboard/userdashboard.component';
import { AdmindashboardComponent } from './components/admindashboard/admindashboard.component';
import { ForgotpasswordComponent } from './components/auth/forgotpassword/forgotpassword.component';
import { GenerateotpComponent } from './components/auth/generateotp/generateotp.component';
import { ResetpasswordComponent } from './components/auth/resetpassword/resetpassword.component';
import { ContactComponent } from './components/contact/contact.component';
import { ServicesComponent } from './components/services/services.component';
import { BookingappointmentComponent } from './components/bookingappointment/bookingappointment.component';
import { AppointmentlistComponent } from './components/appointmentlist/appointmentlist.component';
import { OverviewComponent } from './components/overview/overview.component';
import { ManageUserComponent } from './components/manage-user/manage-user.component';
import { ManageAppointmentComponent } from './components/manage-appointment/manage-appointment.component';
import { RevenueComponent } from './components/revenue/revenue.component';
import { PaymentComponent } from './components/payment/payment.component';
import { ServiceImageComponent } from './components/service-image/service-image.component';
import { ProfilecomponentComponent } from './components/profile/profilecomponent.component';

const routes: Routes = [
  { path: '', component: HomeComponent },      // default home
  { path: 'login', component: LoginComponent }, // login page 
  { path: 'signup', component: SignupComponent}, // signup page
  { path: 'userdashboard', component : UserdashboardComponent,
     children : [
      {path : 'profile',component : ProfilecomponentComponent },
      {path : 'appointmentlist',component : AppointmentlistComponent},
      {path : '',component : ProfilecomponentComponent},
      {path : 'bookingappointment' , component : BookingappointmentComponent},
     ]
  }, // userdashboard
  { path: 'admindashboard', component : AdmindashboardComponent,
    children : [
      {path : 'overview',component : OverviewComponent},
      {path : '',component : OverviewComponent},
      {path : 'manageuser',component : ManageUserComponent},
      {path : 'manageappointment',component : ManageAppointmentComponent},
      {path : 'revenue',component : RevenueComponent},
    ]
  }, // admindashboard
  { path: 'forgotpassword', component : ForgotpasswordComponent}, // forgotpassword
  { path: 'generateotp',component : GenerateotpComponent}, // generateotp
  { path: 'resetpassword', component : ResetpasswordComponent}, //resetpassword
  { path: 'contact', component : ContactComponent}, // contact
  { path: 'services', component : ServicesComponent}, // services
  { path: 'bookingappointment' , component : BookingappointmentComponent }, // bookingappointment
  { path: '', redirectTo: '/services', pathMatch: 'full' },
  { path: 'payment/:id' , component : PaymentComponent},
  { path: 'serviceimage/:type',component : ServiceImageComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
