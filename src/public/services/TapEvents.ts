class TapEvents {
    public tapDown: string;
    public tapMove: string;
    public tapUp: string;
    public getTouchCount: (e: any) => any;
    public getTapPosition: (e: any) => { x: any; y: any; };

    constructor() {
        this.tapDown = this.deviceSupportsTouchEvents() ? "onTouchStart" : "onMouseDown";
        this.tapUp = this.deviceSupportsTouchEvents() ? "onTouchEnd" : "onMouseUp";
        this.tapMove = this.deviceSupportsTouchEvents() ? "onTouchMove" : "onMouseMove";

        if (this.deviceSupportsTouchEvents()) {
            this.getTapPosition = (e: any) => ({
                x: e.targetTouches[0].pageX,
                y: e.targetTouches[0].pageY
            });
            this.getTouchCount = (e: any) => e.touches.length;
        } else {
            this.getTapPosition = (e: any) => ({
                x: e.pageX, y: e.pageY
            });
            this.getTouchCount = (e: any) => 1;
        }
    }

    private deviceSupportsTouchEvents() {
        return "ontouchstart" in window;
    }

}

export const tapEvents = new TapEvents();
