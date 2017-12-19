import * as React from "react";
import { NavLink } from "react-router-dom";
import { Line, PageElement, Point } from "../models/RootState";
import { CanvasContext } from "../services/CanvasContext";
import { CanvasDrawing } from "../services/CanvasDrawing";
import canvasHelper from "../services/CanvasHelper";
import pageElementHelper from "../services/PageElementHelper";
import { tapEvents } from "../services/TapEvents";

export interface OverviewProps {
    elements: PageElement[];
    onClick: (position: Point) => void;
}

export class Overview extends React.Component<OverviewProps> {
    private canvas: HTMLCanvasElement | null = null;

    private canvasContext: CanvasContext;
    private canvasDrawing: CanvasDrawing;

    constructor(props: OverviewProps) {
        super(props);
        this.tapDown = this.tapDown.bind(this);
        this.resize = this.resize.bind(this);

        this.canvasContext = new CanvasContext(() => this.canvas == null ? null : this.canvas.getContext("2d"));
        this.canvasDrawing = new CanvasDrawing();
    }

    public componentDidMount() {
        this.resize();
        window.addEventListener("resize", this.resize);
    }

    public componentWillUnmount() {
        window.removeEventListener("resize", this.resize);
    }

    public render() {
        return (
            <canvas
                style={{ cursor: "default" }}
                ref={(canvas) => { this.canvas = canvas; }}
                {...{ [tapEvents.tapDown]: this.tapDown }}
            />);
    }

    private tapDown(e: any) {
        const tapDownPoint = tapEvents.getTapPosition(e);
        this.props.onClick(tapDownPoint);
    }

    private resize() {
        canvasHelper.setCanvasSize(this.canvasContext, window.innerWidth, window.innerHeight);
        this.generateOverview(window.innerWidth, window.innerHeight);
    }

    private generateOverview(width: number, height: number) {

        const spacingFactor = 0.01;

        let min: Point | undefined;
        let max: Point | undefined;

        // calc min and max
        this.props.elements.forEach((element) => {
            if (pageElementHelper.elementIsLine(element)) {
                element.segments.forEach((segment) => {

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
            } else if (pageElementHelper.elementIsText(element)) {
                // TODO: add text elements
            }
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

        this.canvasContext.doCanvasAction((context) => {
            context.canvas.width = width;
            context.canvas.height = height;
            context.lineCap = "round";
            context.scale(newscale, newscale);
            context.translate(translation.x, translation.y);

            this.canvasDrawing.repaint(this.canvasContext, this.props.elements, false);
        });

    }
}
