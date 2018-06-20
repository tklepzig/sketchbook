import { CanvasContext } from "@services/CanvasContext";
import { CanvasDrawing } from "@services/CanvasDrawing";
import canvasHelper from "@services/CanvasHelper";
import { CanvasTranslate } from "@services/CanvasTranslate";
import { tapEvents } from "@services/TapEvents";
import * as React from "react";
import { bind } from "react.ex";

interface CanvasProps {
    onRepaint?: () => void;
    onResize?: () => void;
    onTapDown?: (e: any) => void;
    onTapMove?: (e: any) => void;
    onTapUp?: (e: any) => void;

}

interface CanvasState {
}

export default class Canvas extends React.Component<CanvasProps, CanvasState> {
    private canvas: HTMLCanvasElement | null = null;
    private isTranslateMode = false;
    private tapIsDown: boolean = false;
    private canvasContext: CanvasContext;
    private canvasTranslate: CanvasTranslate;
    private canvasDrawing: CanvasDrawing;

    constructor(props: CanvasProps) {
        super(props);

        this.canvasContext = new CanvasContext(() => this.canvas == null ? null : this.canvas.getContext("2d"));

        // TODO: maybe singletons (so use export default new ...())
        this.canvasTranslate = new CanvasTranslate();
        this.canvasDrawing = new CanvasDrawing();
    }

    public getRawCanvas() {
        return this.canvas;
    }

    public componentDidMount() {
        this.resize();
        window.addEventListener("resize", this.resize);
        window.addEventListener("mousewheel", this.onMouseWheel);
    }

    public componentWillUnmount() {
        window.removeEventListener("resize", this.resize);
        window.removeEventListener("mousewheel", this.onMouseWheel);
    }

    public render() {
        return (
            <canvas
                className="overview"
                ref={(canvas) => { this.canvas = canvas; }}
                {...{ [tapEvents.tapDown]: this.tapDown }}
                {...{ [tapEvents.tapUp]: this.tapUp }}
                {...{ [tapEvents.tapMove]: this.tapMove }}
            />);
    }

    @bind
    private tapDown(e: any) {
        // TODO: use pinchzoomcenter
        this.tapIsDown = true;
        const touchCount = tapEvents.getTouchCount(e);
        this.isTranslateMode = touchCount === 2 || e.ctrlKey;
        const originalTapDownPoint = tapEvents.getTapPosition(e);
        const tapDownPoint = this.canvasContext.getTransformedPoint(originalTapDownPoint);

        if (this.isTranslateMode) {
            this.canvasTranslate.startTranslate(tapDownPoint);
        } else if (this.props.onTapDown) {
            this.props.onTapDown(e);
        }
    }

    @bind
    private tapMove(e: any) {
        if (!this.tapIsDown) {
            return;
        }

        const tapDownPoint = this.canvasContext.getTransformedPoint(tapEvents.getTapPosition(e));

        if (this.isTranslateMode) {
            this.canvasTranslate.translate(this.canvasContext, tapDownPoint);
            if (this.props.onRepaint) {
                this.props.onRepaint();
            }
        } else if (this.props.onTapMove) {
            this.props.onTapMove(e);
        }
    }

    @bind
    private tapUp(e: any) {
        if (!this.tapIsDown) {
            return;
        }
        this.tapIsDown = false;

        if (this.isTranslateMode) {
            return;
        }

        if (this.props.onTapUp) {
            this.props.onTapUp(e);
        }
    }

    @bind
    private resize() {
        canvasHelper.setCanvasSize(this.canvasContext, window.innerWidth, window.innerHeight);
        if (this.props.onResize) {
            this.props.onResize();
        }
        if (this.props.onRepaint) {
            this.props.onRepaint();
        }
    }

    @bind
    private onMouseWheel(e: any) {
        if (!e.ctrlKey) {
            return true;
        }

        const delta = e.wheelDelta ? e.wheelDelta / 40 : e.detail ? -e.detail : 0;

        if (delta) {
            const scaleFactor = 1.1;
            const factor = Math.pow(scaleFactor, delta);

            const downPoint = tapEvents.getTapPosition(e);
            console.dir(downPoint);
            // add offset since canvas is not at position 0, 0
            const { x, y } = this.canvasContext.getPosition();
            console.dir(x + ", " + y);
            downPoint.x -= x;
            downPoint.y -= y;
            console.dir(downPoint);
            const pt = this.canvasContext.getTransformedPoint(downPoint);
            console.dir(pt);
            this.canvasContext.translate(pt.x, pt.y);
            this.canvasContext.scale(factor, factor);
            this.canvasContext.translate(-pt.x, -pt.y);

            if (this.props.onRepaint) {
                this.props.onRepaint();
            }
        }

        e.preventDefault();
        return false;
    }

}
