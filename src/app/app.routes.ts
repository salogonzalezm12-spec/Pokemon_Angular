import { Routes, RouterModule } from '@angular/router';
import { BuscadorComponent } from './componentes/buscador/buscador.component';
import { NgModule } from '@angular/core';

export const routes: Routes = [
  { path: '', component: BuscadorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
