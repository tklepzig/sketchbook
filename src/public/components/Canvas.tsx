import { CanvasContext } from "@services/CanvasContext";
import { CanvasDrawing } from "@services/CanvasDrawing";
import canvasHelper from "@services/CanvasHelper";
import { CanvasTranslate } from "@services/CanvasTranslate";
import { tapEvents } from "@services/TapEvents";
import * as React from "react";
import { bind } from "react.ex";

interface CanvasProps {
    onRepaint?: (context: CanvasContext) => void;
    onResize?: (context: CanvasContext) => void;
    onTapDown?: (context: CanvasContext, e: any) => void;
    onTapMove?: (context: CanvasContext, e: any) => void;
    onTapUp?: (context: CanvasContext, e: any) => void;

}

interface CanvasState {
}

export default class Canvas extends React.Component<CanvasProps, CanvasState> {
    private canvas: HTMLCanvasElement | null = null;
    private isTranslateMode = false;
    private tapIsDown: boolean = false;
    private canvasContext: CanvasContext;
    private canvasTranslate: CanvasTranslate;

    constructor(props: CanvasProps) {
        super(props);

        this.canvasContext = new CanvasContext(() => this.canvas == null ? null : this.canvas.getContext("2d"));

        // TODO: maybe singletons (so use export default new ...())
        this.canvasTranslate = new CanvasTranslate();
    }

    public getContext() {
        return this.canvasContext;
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
            this.props.onTapDown(this.canvasContext, e);
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
                this.props.onRepaint(this.canvasContext);
            }
        } else if (this.props.onTapMove) {
            this.props.onTapMove(this.canvasContext, e);
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
            this.props.onTapUp(this.canvasContext, e);
        }
    }

    @bind
    private resize() {
        canvasHelper.setCanvasSize(this.canvasContext, window.innerWidth, window.innerHeight);
        if (this.props.onResize) {
            this.props.onResize(this.canvasContext);
        }
        if (this.props.onRepaint) {
            this.props.onRepaint(this.canvasContext);
        }
    }

    @bind
    private onMouseWheel(e: any) {
        if (!e.ctrlKey) {
            return true;
        }


        e.preventDefault();
        return false;
    }

}
