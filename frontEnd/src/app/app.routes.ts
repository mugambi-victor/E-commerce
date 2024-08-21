import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { CategoriesComponent } from './categories/categories.component';
import { IndexPageComponent } from './admindahboard/index-page/index-page.component';
import { ManageCategoriesComponent } from './admindahboard/manage-categories/manage-categories.component';
import { DashcardsComponent } from './admindahboard/dashcards/dashcards.component';
import { EditCategoryComponent } from './admindahboard/edit-category/edit-category.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    { 
        path: 'login', 
        component: LoginComponent
    },
    {
        path: 'categories',
        component: CategoriesComponent
    },
    {
        path: 'admindashboard',
        component: IndexPageComponent,
        children: [
            { path: 'manage_categories', component: ManageCategoriesComponent },
            { path: '', component: DashcardsComponent },
            { path: 'edit-category/:id', component: EditCategoryComponent },
            // Add more child routes here
          ]
    }
  
    
    
];
