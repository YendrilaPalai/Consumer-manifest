import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CallbackComponent } from './callback/callback.component';
import { TestComponent } from './test/test.component';

const routes: Routes = [
  // {path:'',component:FirstStepComponent},
  {path:'callback',component:CallbackComponent},
    
]


@NgModule({
  imports: [RouterModule.forRoot(routes),
  RouterModule.forChild([
    
    {path:'page',component:TestComponent, children:[
     
    ]}
  ])
],
  exports: [RouterModule]
})
export class AppRoutingModule { }
