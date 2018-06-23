import { CanvasContext } from "@services/CanvasContext";
import { tapEvents } from "@services/TapEvents";
import { Point } from "@shared/models";

export class CanvasTranslate {
    private startPoint?: Point;
    private isTranslateMode = false;

    public tapDown(canvasContext: CanvasContext, e: any) {
        const touchCount = tapEvents.getTouchCount(e);
        this.isTranslateMode = touchCount === 2 || e.ctrlKey;
        this.startPoint = canvasContext.getTransformedPoint(tapEvents.getTapPosition(e));
    }

    public tapMove(canvasContext: CanvasContext, e: any) {
        if (!this.startPoint) {
            return false;
        }

        if (!this.isTranslateMode) {
            return false;
        }

        const pt = canvasContext.getTransformedPoint(tapEvents.getTapPosition(e));
        canvasContext.translate(pt.x - this.startPoint.x, pt.y - this.startPoint.y);

        return true;
    }

    public tapUp() {
        return this.isTranslateMode;
    }
}
