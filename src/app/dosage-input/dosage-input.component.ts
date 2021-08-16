import { Component, Output, EventEmitter } from '@angular/core';
import { NumpadPopupComponent } from '../numpad-popup/numpad-popup.component';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';

@Component({
    selector: 'app-dosage-input',
    templateUrl: './dosage-input.component.html',
    styleUrls: ['./dosage-input.component.scss'],
})
export class DosageInputComponent {
    @Output() doseChangeEvent = new EventEmitter<number>();
    value: string = "";
    modalRef: MdbModalRef<NumpadPopupComponent>;

    constructor(private modalService: MdbModalService) { }

    openModal() {
        this.modalRef = this.modalService.open(NumpadPopupComponent, { data: { value: this.value } });

        // when the popup closes set value and throw event
        this.modalRef.onClose.subscribe((message: any) => {
            this.value = message;
            this.doseChangeEvent.emit(this.parseNumber(this.value))
        });
    }

    onInputChange = (event: any) => {
        this.value = event.target.value;
    };

    private parseNumber(x) {
        const parsed = Number.parseInt(x);
        return Number.isNaN(parsed) ? 0 : parsed;
    }
}
