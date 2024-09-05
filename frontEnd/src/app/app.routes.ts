import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { CategoriesComponent } from './categories/categories.component';
import { IndexPageComponent } from './admindahboard/index-page/index-page.component';
import { ManageCategoriesComponent } from './admindahboard/manage-categories/manage-categories.component';
import { DashcardsComponent } from './admindahboard/dashcards/dashcards.component';
import { EditCategoryComponent } from './admindahboard/edit-category/edit-category.component';
import { ManageProductsComponent } from './admindahboard/products/manage-products/manage-products.component';
import { AuthGuard } from './auth.guard'; // Adjust the path as necessary
import { EditProductComponent } from './admindahboard/products/edit-product/edit-product.component';

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
        component: CategoriesComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'admindashboard',
        component: IndexPageComponent,
        canActivate: [AuthGuard], // Apply AuthGuard here to protect the parent route
        children: [
            { path: 'manage_categories', component: ManageCategoriesComponent },
            { path: '', component: DashcardsComponent }, // Default child route
            { path: 'edit-category/:id', component: EditCategoryComponent },
            { path: 'manage-products', component: ManageProductsComponent },
            {path: 'edit-product/:id', component: EditProductComponent },
            // Add more child routes here
          ]
    }
];
