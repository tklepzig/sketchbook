export class CanvasTransform {
    private svgPoint: SVGPoint;
    private savedTransforms: any[] = [];
    private transformMatrix: SVGMatrix;
    private svg: SVGSVGElement;

    constructor() {
        this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.transformMatrix = this.svg.createSVGMatrix();
        this.svgPoint = this.svg.createSVGPoint();

    }

    public save(canvasContext: CanvasRenderingContext2D | null) {
        if (canvasContext == null) {
            return;
        }

        this.savedTransforms.push(this.transformMatrix.translate(0, 0));
        return canvasContext.save();
    }

    public restore(canvasContext: CanvasRenderingContext2D | null) {
        if (canvasContext == null) {
            return;
        }

        this.transformMatrix = this.savedTransforms.pop();
        return canvasContext.restore();
    }

    public scale(canvasContext: CanvasRenderingContext2D | null, sx: number, sy: number) {
        if (canvasContext == null) {
            return;
        }

        this.transformMatrix = this.transformMatrix.scaleNonUniform(sx, sy);
        return canvasContext.scale(sx, sy);
    }

    public rotate(canvasContext: CanvasRenderingContext2D | null, angle: number) {
        if (canvasContext == null) {
            return;
        }

        this.transformMatrix = this.transformMatrix.rotate(angle);
        return canvasContext.rotate(angle * Math.PI / 180);
    }

    public translate(canvasContext: CanvasRenderingContext2D | null, dx: number, dy: number) {
        if (canvasContext == null) {
            return;
        }

        this.transformMatrix = this.transformMatrix.translate(dx, dy);
        return canvasContext.translate(dx, dy);
    }

    public transform(
        canvasContext: CanvasRenderingContext2D | null,
        a: number, b: number, c: number,
        d: number, e: number, f: number) {
        if (canvasContext == null) {
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
        return canvasContext.transform(a, b, c, d, e, f);
    }

    public getTransform() {
        return this.transformMatrix;
    }

    public setTransform(
        canvasContext: CanvasRenderingContext2D | null,
        a: number, b: number, c: number,
        d: number, e: number, f: number) {
        if (canvasContext == null) {
            return;
        }

        this.transformMatrix.a = a;
        this.transformMatrix.b = b;
        this.transformMatrix.c = c;
        this.transformMatrix.d = d;
        this.transformMatrix.e = e;
        this.transformMatrix.f = f;

        return canvasContext.setTransform(a, b, c, d, e, f);
    }

    public getTransformedPoint(canvasContext: CanvasRenderingContext2D | null, x: number, y: number) {
        this.svgPoint.x = x;
        this.svgPoint.y = y;

        return this.svgPoint.matrixTransform(this.transformMatrix.inverse());
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
}
