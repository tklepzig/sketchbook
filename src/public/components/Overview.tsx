import * as React from "react";
import { Line } from "../models/Line";
import { Point } from "../models/Point";
import { CanvasTransform } from "../services/CanvasTransform";
import { DrawingHandler } from "../services/DrawingHandler";

export interface OverviewProps {
    lines: Line[];
}

export default class Overview extends React.Component<OverviewProps> {
    private drawingHandler: DrawingHandler;
    private canvas: HTMLCanvasElement | null;

    private canvasTransform: CanvasTransform;

    constructor(props: OverviewProps) {
        super(props);
        this.canvasTransform = new CanvasTransform();
        this.drawingHandler = new DrawingHandler();

        this.resize = this.resize.bind(this);
    }

    public render() {
        return <canvas ref={(canvas) => { this.canvas = canvas; }} />;
    }

    public componentDidMount() {
        this.resize();
        window.addEventListener("resize", this.resize);
    }

    public componentWillUnmount() {
        window.removeEventListener("resize", this.resize);
    }

    public componentWillReceiveProps(newProps: OverviewProps) {
        this.updateCanvasConfig(newProps);
    }

    private getCanvasContext() {
        if (this.canvas == null) {
            return null;
        }
        const context = this.canvas.getContext("2d");
        return context;
    }

    private resize() {
        if (this.canvas == null) {
            return;
        }

        const canvasContext = this.getCanvasContext();

        if (canvasContext === null) {
            return;
        }

        this.setCanvasSize(window.innerWidth, window.innerHeight);
        this.updateCanvasConfig(this.props);
        this.repaint();
    }

    private updateCanvasConfig(props: OverviewProps) {
        const context = this.getCanvasContext();
        if (context == null) {
            return;
        }

        context.lineCap = "round";
    }
    private setCanvasSize(width: number, height: number) {
        if (this.canvas == null) {
            return;
        }

        const context = this.getCanvasContext();
        if (context == null) {
            return;
        }

        const currentTransform = this.canvasTransform.getTransform();

        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        const { a, b, c, d, e, f } = currentTransform;
        this.canvasTransform.setTransform(context, a, b, c, d, e, f);
    }
    private repaint() {
        if (this.canvas == null) {
            return null;
        }

        const context = this.getCanvasContext();
        if (context == null) {
            return;
        }

        this.canvasTransform.save(context);
        this.canvasTransform.setTransform(context, 1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.canvasTransform.restore(context);

        // limit redrawing area to increase performance
        let left = -this.canvasTransform.getTranslateX();
        let top = -this.canvasTransform.getTranslateY();
        let right = left + this.canvas.width;
        let bottom = top + this.canvas.height;

        // offset
        left -= 40;
        top -= 40;
        right += 40;
        bottom += 40;

        // if (this.props.lines.length > 4) {
        // faster, bot wrong detail (lines are not in the right order)
        // this.drawLinesSortedAndGrouped(context, { left, top, right, bottom });
        // } else {
        this.drawingHandler.drawLines(
            context,
            this.props.lines,
            { left, top, right, bottom });
        // }
    }

    private generateOverview(width: number, height: number) {
        if (this.canvas == null) {
            return null;
        }

        const context = this.getCanvasContext();
        if (context == null) {
            return;
        }

        const spacingFactor = 0.01;

        let min: Point | undefined;
        let max: Point | undefined;

        // calc min and max
        this.props.lines.forEach((line) => {
            line.segments.forEach((segment) => {

                if (!min) {
                    const { x, y } = segment.start;
                    min = { x, y };
                }
                if (!max) {
                    const { x, y } = segment.end;
                    max = { x, y };
                }

                if (segment.start.x < min.x) {
                    min.x = segment.start.x;
                }
                if (segment.start.y < min.y) {
                    min.y = segment.start.y;
                }
                if (segment.end.x > max.x) {
                    max.x = segment.end.x;
                }
                if (segment.end.y > max.y) {
                    max.y = segment.end.y;
                }
            });
        });

        if (!min || !max) {
            return;
        }

        let canvasWidth = Math.abs(min.x) + Math.abs(max.x);
        let canvasHeight = Math.abs(min.y) + Math.abs(max.y);

        canvasWidth += canvasWidth * spacingFactor * 2;
        canvasHeight += canvasHeight * spacingFactor * 2;

        const scale = { x: width / canvasWidth, y: height / canvasHeight };
        let newscale = 1;

        newscale = scale.x < scale.y ? scale.x : scale.y;

        if (newscale > 1) {
            newscale = 1;
        }

        const translation: { x: number, y: number } = { x: 0, y: 0 };

        translation.x = Math.abs(min.x) + (canvasWidth * spacingFactor);
        translation.y = Math.abs(min.y) + (canvasHeight * spacingFactor);

        context.canvas.width = width;
        context.canvas.height = height;
        context.lineCap = "round";
        context.scale(newscale, newscale);
        context.translate(translation.x, translation.y);

        this.drawingHandler.drawLines(context, this.props.lines);
    }
}
