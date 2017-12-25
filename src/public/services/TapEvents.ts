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
            this.getTapPosition = (e: any) => {
                if (e.targetTouches.length > 0) {
                    return {
                        x: e.targetTouches[0].pageX,
                        y: e.targetTouches[0].pageY
                    };
                }

                return {
                    x: e.changedTouches[0].pageX,
                    y: e.changedTouches[0].pageY
                };
            };
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
