import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

// MDB Modules
import { MdbCarouselModule } from 'mdb-angular-ui-kit/carousel';
import { MdbCheckboxModule } from 'mdb-angular-ui-kit/checkbox';
import { MdbCollapseModule } from 'mdb-angular-ui-kit/collapse';
import { MdbDropdownModule } from 'mdb-angular-ui-kit/dropdown';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { MdbModalModule } from 'mdb-angular-ui-kit/modal';
import { MdbPopoverModule } from 'mdb-angular-ui-kit/popover';
import { MdbRadioModule } from 'mdb-angular-ui-kit/radio';
import { MdbRangeModule } from 'mdb-angular-ui-kit/range';
import { MdbRippleModule } from 'mdb-angular-ui-kit/ripple';
import { MdbScrollspyModule } from 'mdb-angular-ui-kit/scrollspy';
import { MdbTabsModule } from 'mdb-angular-ui-kit/tabs';
import { MdbTooltipModule } from 'mdb-angular-ui-kit/tooltip';
import { MdbValidationModule } from 'mdb-angular-ui-kit/validation';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SchduleDisplayComponent } from './schedule-display/schedule-display.component';
import { ListComponent } from './timing-lists/list/list.component';
import { DosingListItemComponent } from './timing-lists/dosing-list-item/dosing-list-item.component';
import { TimingListItemComponent } from './timing-lists/timing-list-item/timing-list-item.component';

// Time Picker
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { DosageInputComponent } from './dosage-input/dosage-input.component';
import { NumpadPopupComponent } from './numpad-popup/numpad-popup.component';
import { QuickDoseButtonComponent } from './quick-dose-button/quick-dose-button.component';
import { SchedulerIndicatorComponent } from './overview/scheduler-indicator/scheduler-indicator.component';
import { ChlorineButtonComponent } from './overview/chlorine-button/chlorine-button.component';
import { HeaterButtonComponent } from './overview/heater-button/heater-button.component';
import { FilterButtonComponent } from './overview/filter-button/filter-button.component';
import { InfoTextComponent } from './overview/info-text/info-text.component';
import { SchedulerToggleButtonComponent } from './scheduler-toggle-button/scheduler-toggle-button.component';

@NgModule({
  declarations: [
    AppComponent,
    SchduleDisplayComponent,
    ListComponent,
    DosingListItemComponent,
    TimingListItemComponent,
    DosageInputComponent,
    NumpadPopupComponent,
    QuickDoseButtonComponent,
    SchedulerIndicatorComponent,
    ChlorineButtonComponent,
    HeaterButtonComponent,
    FilterButtonComponent,
    InfoTextComponent,
    SchedulerToggleButtonComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MdbCarouselModule,
    MdbCheckboxModule,
    MdbCollapseModule,
    MdbDropdownModule,
    MdbFormsModule,
    MdbModalModule,
    MdbPopoverModule,
    MdbRadioModule,
    MdbRangeModule,
    MdbRippleModule,
    MdbScrollspyModule,
    MdbTabsModule,
    MdbTooltipModule,
    MdbValidationModule,
    NgxMaterialTimepickerModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
