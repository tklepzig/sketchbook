import { Point } from "@shared/models";

class TapEvents {
    public tapDown: string;
    public tapMove: string;
    public tapUp: string;
    public getTouchCount: (e: any) => number;
    public getTapPosition: (e: any) => Point;

    constructor() {
        this.tapDown = this.deviceSupportsTouchEvents() ? "onTouchStart" : "onMouseDown";
        this.tapUp = this.deviceSupportsTouchEvents() ? "onTouchEnd" : "onMouseUp";
        this.tapMove = this.deviceSupportsTouchEvents() ? "onTouchMove" : "onMouseMove";

        if (this.deviceSupportsTouchEvents()) {
            this.initForTouchDevice();
        } else {
            this.initForDesktop();
        }
    }

    private deviceSupportsTouchEvents() {
        return "ontouchstart" in window;
    }

    private initForDesktop() {
        this.getTapPosition = (e: any) => ({
            x: e.pageX, y: e.pageY
        });
        this.getTouchCount = (e: any) => 1;
    }

    private initForTouchDevice() {
        this.getTapPosition = (e: any) => {
            const touches = e.targetTouches.length > 0
                ? e.targetTouches[0]
                : e.changedTouches[0];

            const { pageX: x, pageY: y } = touches;
            return { x, y };
        };
        this.getTouchCount = (e: any) => e.touches.length;
    }
}

export const tapEvents = new TapEvents();
