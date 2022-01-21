import { AfterViewInit, Component } from "@angular/core";
import { MdbModalRef } from "mdb-angular-ui-kit/modal";
import Keyboard from "simple-keyboard";

@Component({
    selector: "app-numpad-popup",
    templateUrl: "./numpad-popup.component.html",
    styleUrls: ["./numpad-popup.component.scss"],
})
export class NumpadPopupComponent implements AfterViewInit {

    private readonly max = 23040
    private readonly min = 16

    value = "";
    keyboard: Keyboard;

    constructor(public modalRef: MdbModalRef<NumpadPopupComponent>) { }

    //On view init create the keyboard and set its input according to the dosage inputs data
    ngAfterViewInit() {
        this.keyboard = new Keyboard({
            onChange: input => this.onChange(input),
            onKeyPress: (button) => this.onKeyPress(button),
            layout: {
                default: ["1 2 3", "4 5 6", "7 8 9", " 0 {bksp}", "Done"],
            },
            theme: "hg-theme-default hg-layout-numeric numeric-theme",
        });
        this.keyboard.setInput(this.value);
    }

    //If the keyboard changes so should the popup field
    onChange = (input: string) => {
        if (input.includes("Done")) return;

        if (this.parseNumber(input) > this.max){ // max
            this.keyboard.setInput(this.max.toString());
            this.value = this.max.toString();
        }else{
            this.value = input;
        }
    };

    //If popup field changes so should the keyboard
    onInputChange = (event: any) => {
        this.keyboard.setInput(event.target.value);
    };

    //If you press the done button the popup closes and the value is sent to the input
    onKeyPress = (button: string) => {
        if (button === "Done") {
            if(!(this.value === "" || this.value === "0"))
                if(this.parseNumber(this.value) < this.min) { // min
                    this.keyboard.setInput(this.min.toString());
                    this.value = this.min.toString();
                }

            this.modalRef.close(this.value);
        }
    };

    private parseNumber(x) {
        const parsed = Number.parseInt(x);
        return Number.isNaN(parsed) ? 0 : parsed;
    }

}
