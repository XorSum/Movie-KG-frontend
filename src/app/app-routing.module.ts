import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {SearchComponent} from './search/search.component';
import {GraphComponent} from './graph/graph.component';

const routes: Routes = [
  {path: 'search', component: SearchComponent},
  {path: 'graph', component: GraphComponent},
  {path: '', redirectTo: '/search', pathMatch: 'full'},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
