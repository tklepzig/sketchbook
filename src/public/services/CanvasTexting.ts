import { Point, Text } from "../models/RootState";
import { CanvasContext } from "./CanvasContext";

export class CanvasTexting {
    public addText(canvasContext: CanvasContext, text: string, position: Point, fontSize: number): Text {
        canvasContext.doCanvasAction((context) => {
            let top = position.y;
            for (const line of text.split("\n")) {
                context.fillText(line, position.x, top);
                top += (20 + 6) * 1.2;
            }
        });

        return { kind: "text", fontSize, position, text };
    }
}
