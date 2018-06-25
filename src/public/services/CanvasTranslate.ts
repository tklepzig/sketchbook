import { CanvasContext } from "@services/CanvasContext";
import { tapEvents } from "@services/TapEvents";
import { Point } from "@shared/models";

export class CanvasTranslate {
    private startPoint?: Point;
    private isTranslateMode = false;

    public tapDown(e: any, canvasContext: CanvasContext) {
        const touchCount = tapEvents.getTouchCount(e);
        this.isTranslateMode = touchCount === 2 || e.ctrlKey;


        const downPoint = tapEvents.getTapPosition(e);

        // add offset since canvas is not at position 0, 0
        const { x, y } = canvasContext.getPosition();
        downPoint.x -= x;
        downPoint.y -= y;

        this.startPoint = canvasContext.getTransformedPoint(downPoint);
    }

    public tapMove(e: any, canvasContext: CanvasContext) {
        if (!this.startPoint) {
            return false;
        }

        if (!this.isTranslateMode) {
            return false;
        }

        const downPoint = tapEvents.getTapPosition(e);

        // add offset since canvas is not at position 0, 0
        const { x, y } = canvasContext.getPosition();
        downPoint.x -= x;
        downPoint.y -= y;

        const pt = canvasContext.getTransformedPoint(downPoint);
        canvasContext.translate(pt.x - this.startPoint.x, pt.y - this.startPoint.y);
        
        return true;
    }

    public tapUp() {
        return this.isTranslateMode;
    }
}
