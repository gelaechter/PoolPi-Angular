import { Component } from '@angular/core';
import { NumpadPopupComponent } from '../numpad-popup/numpad-popup.component';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import Keyboard from 'simple-keyboard';

@Component({
    selector: 'app-dosage-input',
    templateUrl: './dosage-input.component.html',
    styleUrls: ['./dosage-input.component.scss'],
})
export class DosageInputComponent {
    value = "";
    modalRef: MdbModalRef<NumpadPopupComponent>;

    constructor(private modalService: MdbModalService) {}

    openModal() {
        this.modalRef = this.modalService.open(NumpadPopupComponent, { data: { value: this.value }});

        this.modalRef.onClose.subscribe((message: any) => {
            this.value = message;
        });
    }

    onInputChange = (event: any) => {
        this.value = event.target.value;
    };
}
