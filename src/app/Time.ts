class Time {
    //This should be in minutes since 00:00
    private time: number = 0;

    public get minutes() {
        return this.time;
    }

    public get text() {
        var hours = this.time / 60;
        var minutes = this.time % 60;
        return hours + ':' + minutes;
    }

    public set minutes(minutes: number) {
        if (minutes < 0 || minutes > 1440) {
            throw new Error('Invalid amount of minutes');
        }
        this.time = minutes;
    }

    public set text(time: string) {
        var hours: number = parseInt(time.split(':')[0]);
        var minutes: number = parseInt(time.split(':')[1]);

        this.time = minutes + hours * 60;
    }

    constructor(minutes?: number, time?: string) {
        if (minutes) this.minutes = minutes;
        if (time) this.text = time;
    }
}
