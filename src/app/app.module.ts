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
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { FilterComponent } from './components/filter/filter.component';
import { MatDialogModule } from '@angular/material/dialog';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { JoinPageComponent } from './components/join-page/join-page.component';
import {ClipboardModule} from '@angular/cdk/clipboard';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {PortalModule} from '@angular/cdk/portal';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {CdkStepperModule} from '@angular/cdk/stepper';
import {CdkTableModule} from '@angular/cdk/table';
import {CdkTreeModule} from '@angular/cdk/tree';
import { PublishPageComponent } from './components/publish-page/publish-page.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { SuccessPopupComponent } from './common/success-popup/success-popup.component';
import { SchedulePageComponent } from './components/schedule-page/schedule-page.component';
import {MatTabsModule} from '@angular/material/tabs';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SnackbarComponent } from './common/snackbar/snackbar.component';
import { ProgressBarComponent } from './common/progress-bar/progress-bar.component';
import {MatTooltipModule} from '@angular/material/tooltip'
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
    CardComponentComponent,
    FilterComponent,
    JoinPageComponent,
    PublishPageComponent,
    SuccessPopupComponent,
    SchedulePageComponent,
    SnackbarComponent,
    ProgressBarComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatExpansionModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    FormsModule, 
    ReactiveFormsModule,
    MatSelectModule,
    MatTableModule,
    MatDialogModule,
    MatButtonToggleModule,
    ClipboardModule,
    CdkStepperModule,
    CdkTableModule,
    CdkTreeModule,
    DragDropModule,
    PortalModule,
    ScrollingModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  providers: [{ provide: Requestor, useValue: new FetchRequestor()},
    { provide: 'AuthorizationConfig', useValue: environment},AuthorizationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
