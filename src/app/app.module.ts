import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { UserdashboardComponent } from './components/userdashboard/userdashboard.component';
import { AdmindashboardComponent } from './components/admindashboard/admindashboard.component';
import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { ForgotpasswordComponent } from './components/auth/forgotpassword/forgotpassword.component';
import { GenerateotpComponent } from './components/auth/generateotp/generateotp.component';
import { ResetpasswordComponent } from './components/auth/resetpassword/resetpassword.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FooterComponent } from './components/footer/footer.component';
import { ContactComponent } from './components/contact/contact.component';
import { ServicesComponent } from './components/services/services.component';
import { BookingappointmentComponent } from './components/bookingappointment/bookingappointment.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AppointmentlistComponent } from './components/appointmentlist/appointmentlist.component';
import { OverviewComponent } from './components/overview/overview.component';
import { ManageAppointmentComponent } from './components/manage-appointment/manage-appointment.component';
import { RevenueComponent } from './components/revenue/revenue.component';
import { NgChartsModule } from 'ng2-charts';
import { PaymentComponent } from './components/payment/payment.component';
import { SharedModuleComponent } from './components/shared-module/shared-module.component';
import { ServiceImageComponent } from './components/service-image/service-image.component';
import { NavbarComponent } from './components/navbar/navbar.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    UserdashboardComponent,
    AdmindashboardComponent,
    LoginComponent,
    SignupComponent,
    ForgotpasswordComponent,
    GenerateotpComponent,
    ResetpasswordComponent,
    ContactComponent,
    ServicesComponent,
    BookingappointmentComponent,
    AppointmentlistComponent,
    OverviewComponent,
    ManageAppointmentComponent,
    RevenueComponent,
    PaymentComponent,
    FooterComponent,
    SharedModuleComponent,
    ServiceImageComponent,
    NavbarComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    NgChartsModule,
    BrowserModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
