import {
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
  NgModule,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SpinnerComponent } from './Components/spinner/spinner.component';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MenuLeftComponent } from './Components/menu-left/menu-left.component';
import {
  NgIf,
  NgFor,
  CommonModule,
  HashLocationStrategy,
  LocationStrategy,
} from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LoadingInterceptor } from './interceptors/loading.interceptor';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CdkMenu, CdkMenuItem } from '@angular/cdk/menu';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DialogConfirmComponent } from './Components/dialog-confirm/dialog-confirm.component';
import { MatDialogModule } from '@angular/material/dialog';
import { PrintersComponent } from './Components/printers/printers.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IpcService } from './services/ipc.service';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { BaseApiUrl } from './general';
import { environment } from './environment';

const config: SocketIoConfig = { url: environment.url, options: {} };
@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent,
    MenuLeftComponent,
    DialogConfirmComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatSelectModule,
    MatSidenavModule,
    MatButtonModule,
    MatToolbarModule,
    MatButtonToggleModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatListModule,
    NgIf,
    NgFor,
    CdkMenu,
    CdkMenuItem,
    ReactiveFormsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule,
    MatRippleModule,
    MatCardModule,
    MatButtonModule,
    FormsModule,
    MatListModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTabsModule,
    NgFor,
    NgIf,
    MatCheckboxModule,
    MatSnackBarModule,
    MatTabsModule,
    MatDialogModule,
    PrintersComponent,
    NgApexchartsModule,
    MatChipsModule,
    MatInputModule,
    MatTooltipModule,
    SocketIoModule.forRoot(config),
  ],
  providers: [
    MatDatepickerModule,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true,
    },
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy,
    },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class AppModule {}
