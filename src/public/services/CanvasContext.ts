import { Point } from "@shared/RootState";

export class CanvasContext {
    private getContext: () => CanvasRenderingContext2D | null;
    private svgPoint: SVGPoint;
    private savedTransforms: any[] = [];
    private transformMatrix: SVGMatrix;
    private svg: SVGSVGElement;

    constructor(getContext: () => CanvasRenderingContext2D | null) {
        this.getContext = getContext;

        this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.transformMatrix = this.svg.createSVGMatrix();
        this.svgPoint = this.svg.createSVGPoint();

    }

    public save() {
        const context = this.getContext();
        if (context == null) {
            return;
        }

        this.savedTransforms.push(this.transformMatrix.translate(0, 0));
        return context.save();
    }

    public restore() {
        const context = this.getContext();
        if (context == null) {
            return;
        }

        this.transformMatrix = this.savedTransforms.pop();
        return context.restore();
    }

    public scale(sx: number, sy: number) {
        const context = this.getContext();
        if (context == null) {
            return;
        }

        this.transformMatrix = this.transformMatrix.scaleNonUniform(sx, sy);
        return context.scale(sx, sy);
    }

    public rotate(angle: number) {
        const context = this.getContext();
        if (context == null) {
            return;
        }

        this.transformMatrix = this.transformMatrix.rotate(angle);
        return context.rotate(angle * Math.PI / 180);
    }

    public translate(dx: number, dy: number) {
        const context = this.getContext();
        if (context == null) {
            return;
        }

        this.transformMatrix = this.transformMatrix.translate(dx, dy);
        return context.translate(dx, dy);
    }

    public transform(
        a: number, b: number, c: number,
        d: number, e: number, f: number) {
        const context = this.getContext();
        if (context == null) {
            return;
        }
        const svgMatrix = this.svg.createSVGMatrix();
        svgMatrix.a = a;
        svgMatrix.b = b;
        svgMatrix.c = c;
        svgMatrix.d = d;
        svgMatrix.e = e;
        svgMatrix.f = f;

        this.transformMatrix = this.transformMatrix.multiply(svgMatrix);
        return context.transform(a, b, c, d, e, f);
    }

    public getTransform() {
        return this.transformMatrix;
    }

    public setTransform(
        a: number, b: number, c: number,
        d: number, e: number, f: number) {
        const context = this.getContext();
        if (context == null) {
            return;
        }

        this.transformMatrix.a = a;
        this.transformMatrix.b = b;
        this.transformMatrix.c = c;
        this.transformMatrix.d = d;
        this.transformMatrix.e = e;
        this.transformMatrix.f = f;

        return context.setTransform(a, b, c, d, e, f);
    }

    public getTransformedPoint(point: Point): Point {
        this.svgPoint.x = point.x;
        this.svgPoint.y = point.y;

        const { x, y } = this.svgPoint.matrixTransform(this.transformMatrix.inverse());
        return { x, y };
    }

    public getTranslateX() {
        return this.transformMatrix.e;
    }

    public getTranslateY() {
        return this.transformMatrix.f;
    }

    public getScaleX() {
        return this.transformMatrix.a;
    }

    public getScaleY() {
        return this.transformMatrix.d;
    }

    public doCanvasAction(action: (context: CanvasRenderingContext2D) => void) {
        const context = this.getContext();
        if (context == null) {
            return;
        }

        action(context);
    }
}
