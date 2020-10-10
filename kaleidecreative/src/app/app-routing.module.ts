import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
  { path: "", redirectTo: '/user/home', pathMatch: 'full' },
  {
    path: 'user',
    loadChildren: () => import('./front-end/front-end.module').then(m =>
      m.FrontEndModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m =>
      m.AdminModule)
  },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '/404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    onSameUrlNavigation: 'ignore',
    scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
