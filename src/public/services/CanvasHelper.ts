import { CanvasContext } from "./CanvasContext";

class CanvasHelper {

    public setCanvasSize(
        canvasContext: CanvasContext,
        width: number,
        height: number) {
        const currentTransform = canvasContext.getTransform();
        canvasContext.doCanvasAction((context) => {
            context.canvas.width = width;
            context.canvas.height = height;
        });

        const { a, b, c, d, e, f } = currentTransform;
        canvasContext.setTransform(a, b, c, d, e, f);
    }
}

export default new CanvasHelper();
