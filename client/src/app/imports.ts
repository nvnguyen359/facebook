import { CdkMenu, CdkMenuItem } from '@angular/cdk/menu';
import { NgIf, NgFor, NgOptimizedImage } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { InputCustomComponent } from './components/input-custom/input-custom.component';
import { AutocompleteComponent } from './Components/autocomplete/autocomplete.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatRadioModule } from '@angular/material/radio';
import { ExpansionTableComponent } from './components/expansion-table/expansion-table.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { DisplayHtmlComponent } from './components/display-html/display-html.component';
import { RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
@NgModule({
  imports: [MatRadioModule,MatProgressBarModule,
    MatExpansionModule,
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
    MatChipsModule,
    MatInputModule,
    MatTooltipModule,
    InputCustomComponent,AutocompleteComponent,ExpansionTableComponent,DisplayHtmlComponent,NgOptimizedImage,RouterModule,MatMenuModule
  ],
  exports: [MatRadioModule,MatProgressBarModule,NgOptimizedImage,
    MatExpansionModule,
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
    MatChipsModule,
    MatInputModule,
    MatTooltipModule,
    InputCustomComponent,AutocompleteComponent,ExpansionTableComponent,DisplayHtmlComponent,RouterModule,MatMenuModule
  ],
  providers:[]
})
export class ImportsModule {}
