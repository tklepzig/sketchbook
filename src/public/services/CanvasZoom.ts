import { CanvasContext } from "@services/CanvasContext";
import { tapEvents } from "@services/TapEvents";
import { Point } from "@shared/models";

export class CanvasZoom {
    private startDistance?: number;
    private isZoomMode = false;

    public tapDown(e: any) {
        const touchCount = tapEvents.getTouchCount(e);
        this.isZoomMode = touchCount === 2;
        this.startDistance = tapEvents.getPinchZoomDistance(e) || 0;
    }

    public tapMove(e: any, canvasContext: CanvasContext) {
        if (!this.startDistance) {
            return false;
        }

        if (!this.isZoomMode) {
            return false;
        }

        const center = tapEvents.getPinchZoomCenter(e);
        if (!center) {
            return false;
        }

        const distance = tapEvents.getPinchZoomDistance(e);
        if (!distance) {
            return false;
        }

        if (this.startDistance === 0) {
            this.startDistance = distance;
        } else if (Math.abs(this.startDistance - distance) > 10) {
            const scaleFactor = 1.1;
            const factor = Math.pow(scaleFactor, -(this.startDistance - distance) / 20);

            // add offset since canvas is not at position 0, 0
            const { x, y } = canvasContext.getPosition();
            center.x -= x;
            center.y -= y;

            const pt = canvasContext.getTransformedPoint(center);
            canvasContext.translate(pt.x, pt.y);
            canvasContext.scale(factor, factor);
            canvasContext.translate(-pt.x, -pt.y);
            this.startDistance = distance;

            return true;
        }
        return false;
    }

    public tapUp() {
        return this.isZoomMode;
    }

    public mouseWheel(e: MouseWheelEvent, canvasContext: CanvasContext) {
        if (!e.ctrlKey) {
            return false;
        }

        e.preventDefault();
        const delta = e.wheelDelta ? e.wheelDelta / 40 : e.detail ? -e.detail : 0;

        if (delta) {
            const scaleFactor = 1.1;
            const factor = Math.pow(scaleFactor, delta);

            const downPoint = tapEvents.getTapPosition(e);

            // add offset since canvas is not at position 0, 0
            const { x, y } = canvasContext.getPosition();
            downPoint.x -= x;
            downPoint.y -= y;

            const pt = canvasContext.getTransformedPoint(downPoint);
            canvasContext.translate(pt.x, pt.y);
            canvasContext.scale(factor, factor);
            canvasContext.translate(-pt.x, -pt.y);
            return true;
        }

        return false;
    }
}
