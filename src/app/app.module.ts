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
import { TimeframeDisplayComponent } from './timeframe-display/timeframe-display.component';
import { ListComponent } from './list/list.component';
import { DosingListItemComponent } from './dosing-list-item/dosing-list-item.component';
import { TimingListItemComponent } from './timing-list-item/timing-list-item.component';

// Time Picker
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { DosageInputComponent } from './dosage-input/dosage-input.component';
import { NumpadPopupComponent } from './numpad-popup/numpad-popup.component';
import { QuickDoseButtonComponent } from './quick-dose-button/quick-dose-button.component';

@NgModule({
  declarations: [
    AppComponent,
    TimeframeDisplayComponent,
    ListComponent,
    DosingListItemComponent,
    TimingListItemComponent,
    DosageInputComponent,
    NumpadPopupComponent,
    QuickDoseButtonComponent,
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