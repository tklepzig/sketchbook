import { CanvasContext } from "@services/CanvasContext";
import { Point } from "@shared/RootState";

export class CanvasTranslate {
    private startPoint: Point;

    public startTranslate(tapDownPoint: Point) {
        this.startPoint = tapDownPoint;
    }

    public translate(canvasContext: CanvasContext, tapDownPoint: Point) {
        canvasContext.translate(tapDownPoint.x - this.startPoint.x, tapDownPoint.y - this.startPoint.y);
    }
}
