import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthserviceService } from 'src/app/services/authservice.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {

  
  constructor(private router: Router,public authServices : AuthserviceService) { }
  
  isLoggedIn():boolean{
    console.log("is logged in method call :");
    const flag = this.authServices.isLoggedIn();
    console.log("isloggedIn -> "+flag);
    return flag;
  }


  logout() {
    this.authServices.logout();
    this.router.navigate(['']); // redirect to login page
  }

}
