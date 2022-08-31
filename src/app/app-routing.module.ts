import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CallbackComponent } from './callback/callback.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { SplitWindowComponent } from './components/split-window/split-window.component';
import { TestComponent } from './test/test.component';
import { JoinPageComponent } from './components/join-page/join-page.component';
import { PublishPageComponent } from './components/publish-page/publish-page.component';
import { SchedulePageComponent } from './components/schedule-page/schedule-page.component';

const routes: Routes = [
  // {path:'',component:FirstStepComponent},
  {path:'home-page',component:HomePageComponent},
  { path: '',   redirectTo: '/home-page', pathMatch: 'full' },
  {path:'callback',component:CallbackComponent},
  {path:'createManifest',component:SplitWindowComponent},
  {path:'join-page',component:JoinPageComponent },
  {path:'publish',component:PublishPageComponent},
  {path:'schedule',component:SchedulePageComponent}
    
]


@NgModule({
  imports: [RouterModule.forRoot(routes),
  // RouterModule.forChild([
    
  //   {path:'page',component:TestComponent, children:[
     
  //   ]}
  // ])
],
  exports: [RouterModule]
})
export class AppRoutingModule { }
