import { CanvasContext } from "@services/CanvasContext";
import { CanvasDrawing } from "@services/CanvasDrawing";
import canvasHelper from "@services/CanvasHelper";
import { CanvasTranslate } from "@services/CanvasTranslate";
import { CanvasZoom } from "@services/CanvasZoom";
import { tapEvents } from "@services/TapEvents";
import * as React from "react";
import { bind } from "react.ex";

interface CanvasProps {
    onRepaint?: (context: CanvasContext) => void;
    onResize?: (context: CanvasContext) => void;
    onTapDown?: (context: CanvasContext, e: any) => void;
    onTapMove?: (context: CanvasContext, e: any) => void;
    onTapUp?: (context: CanvasContext, e: any) => void;
    zoom: boolean;
    translate: boolean;
    className?: string;
}

export default class Canvas extends React.Component<CanvasProps> {
    private canvas: HTMLCanvasElement | null = null;
    private canvasContext: CanvasContext;
    private tapIsDown = false;

    private canvasTranslate: CanvasTranslate;
    private canvasZoom: CanvasZoom;

    constructor(props: CanvasProps) {
        super(props);

        this.canvasContext = new CanvasContext(() => this.canvas == null ? null : this.canvas.getContext("2d"));
        this.canvasTranslate = new CanvasTranslate();
        this.canvasZoom = new CanvasZoom();
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
                className={this.props.className}
                ref={(canvas) => { this.canvas = canvas; }}
                {...{ [tapEvents.tapDown]: this.tapDown }}
                {...{ [tapEvents.tapUp]: this.tapUp }}
                {...{ [tapEvents.tapMove]: this.tapMove }}
            />);
    }

    @bind
    private tapDown(e: any) {
        this.tapIsDown = true;

        if (this.props.translate) {
            this.canvasTranslate.tapDown(e, this.canvasContext);
        }

        if (this.props.zoom) {
            this.canvasZoom.tapDown(e);
        }

        if (this.props.onTapDown) {
            this.props.onTapDown(this.canvasContext, e);
        }
    }

    @bind
    private tapMove(e: any) {
        if (!this.tapIsDown) {
            return;
        }

        let handled = false;

        if (this.props.translate) {
            if (this.canvasTranslate.tapMove(e, this.canvasContext)) {
                handled = true;
            }
        }

        if (this.props.zoom) {
            if (this.canvasZoom.tapMove(e, this.canvasContext)) {
                handled = true;
            }
        }

        if (handled) {
            if (this.props.onRepaint) {
                this.props.onRepaint(this.canvasContext);
            }
            return;
        }

        if (this.props.onTapMove) {
            this.props.onTapMove(this.canvasContext, e);
        }
    }

    @bind
    private tapUp(e: any) {
        if (!this.tapIsDown) {
            return;
        }
        this.tapIsDown = false;
        let handled = false;

        if (this.props.translate) {
            if (this.canvasTranslate.tapUp()) {
                handled = true;
            }
        }

        if (this.props.zoom) {
            if (this.canvasZoom.tapUp()) {
                handled = true;
            }
        }

        if (handled) {
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
        if (this.props.zoom) {
            if (this.canvasZoom.mouseWheel(e, this.canvasContext)) {
                if (this.props.onRepaint) {
                    this.props.onRepaint(this.canvasContext);
                }
            }
        }
    }
}
