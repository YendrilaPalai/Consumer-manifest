import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FetchRequestor, Requestor } from '@openid/appauth';
import { environment } from 'src/environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthorizationService } from './authorization.service';
import { CallbackComponent } from './callback/callback.component';
import { TestComponent } from './test/test.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatIconModule} from '@angular/material/icon';
import { FirstpageComponent } from './firstpage/firstpage.component';
import {MatSelectModule} from '@angular/material/select';
import {MatTableModule} from '@angular/material/table';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HeaderComponent } from './common/header/header.component';
import { FilterpipePipe } from './common/filterpipe.pipe';
import { HomePageComponent } from './components/home-page/home-page.component';
import { CardComponentComponent } from './components/card-component/card-component.component';
import { SplitWindowComponent } from './components/split-window/split-window.component';

@NgModule({
  declarations: [
    AppComponent,
    CallbackComponent,
    TestComponent,
    FirstpageComponent,
    SplitWindowComponent,
    HeaderComponent,
    FilterpipePipe,
    HomePageComponent,
    CardComponentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatExpansionModule,
    MatIconModule,
    FormsModule, 
    ReactiveFormsModule,
    MatSelectModule,
    MatTableModule
  ],
  providers: [{ provide: Requestor, useValue: new FetchRequestor()},
    { provide: 'AuthorizationConfig', useValue: environment},AuthorizationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
