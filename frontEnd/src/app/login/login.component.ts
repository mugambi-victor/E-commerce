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
    console.log(this.loginForm.value);
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password)
        .subscribe((response: LoginResponse) => { // Specify the type of 'response' as LoginResponse
          if (response.result === 'ok') {
            const accessToken = response['Access Token'];
            // Redirect or perform other actions
            this.router.navigate(['admindashboard']); // Navigate to home page after successful login
           
            console.log(accessToken);
          } else {
            // Authentication failed, handle the error
            console.log(response.result);
          }
        });
    } else {
      // Form is invalid, display error or take appropriate action
      console.log(this.loginForm.value);
    }
  }
  
}