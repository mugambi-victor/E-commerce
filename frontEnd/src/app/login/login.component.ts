import { Component} from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { AuthService } from '../services/auth.service';
import { HttpClientModule } from '@angular/common/http';
interface LoginResponse {
  result: string;
  'Access Token': string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, HeaderComponent, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers:[AuthService]
})

export class LoginComponent {
  loginForm: FormGroup;
  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
    this.loginForm = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
  
    
  }
 
  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password)
        .subscribe({
          next: (response) => {
            if (response.result === 'ok') {
              const accessToken = response['Access Token'];
              localStorage.setItem('authToken', accessToken); // Store the token
  
              // Assuming the role information is part of the response
              const userRole = response['role'];
  
              if (userRole === false) { // Check if the role is 'false' indicating admin
                console.log('Redirecting to admin dashboard');
                this.router.navigate(['admindashboard']).then(success => {
                  if (success) {
                    console.log('Navigation successful');
                  } else {
                    console.log('Navigation failed');
                  }
                });
              } else {
                console.log('User is not an admin');
                // Handle non-admin user, e.g., redirect to a different page
                this.router.navigate(['userdashboard']);
              }
            } else {
              // Authentication failed, handle the error
              console.log(response.result);
            }
          },
          error: (error) => {
            // Handle the error from the login request
            console.error('Login error', error);
          }
        });
    } else {
      // Form is invalid, display error or take appropriate action
      console.log(this.loginForm.value);
    }
  }
  
  
  
  
}