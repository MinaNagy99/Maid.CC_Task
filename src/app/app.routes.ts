import { Routes } from '@angular/router';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { UserComponent } from './user/user.component';
import { UserDetailsComponent } from './user-details/user-details.component';

export const routes: Routes = [
    {path: '', component:UserComponent},
    {path: 'user/:id', component:UserDetailsComponent}
];
