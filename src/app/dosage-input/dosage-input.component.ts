import { Component, Output, EventEmitter, Input } from '@angular/core';
import { NumpadPopupComponent } from '../numpad-popup/numpad-popup.component';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';

@Component({
    selector: 'app-dosage-input',
    templateUrl: './dosage-input.component.html',
    styleUrls: ['./dosage-input.component.scss'],
})
export class DosageInputComponent {

    @Output() doseChangeEvent = new EventEmitter<number>();
    @Input() value: string = "";
    @Input() disabled: boolean = false;

    modalRef: MdbModalRef<NumpadPopupComponent>;

    constructor(private modalService: MdbModalService) { }

    openModal() {
        console.log(this.value);
        if(this.value === "undefined") this.value = "";
        this.modalRef = this.modalService.open(NumpadPopupComponent, { data: { value: this.value }, ignoreBackdropClick: true });

        // when the popup closes set value and throw event
        this.modalRef.onClose.subscribe((message: any) => {
            if(message === "") message = 0;
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
