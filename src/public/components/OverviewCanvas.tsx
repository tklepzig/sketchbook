import * as React from "react";
import { NavLink } from "react-router-dom";
import { Line, PageElement, Point } from "../models/RootState";
import { CanvasContext } from "../services/CanvasContext";
import { CanvasDrawing } from "../services/CanvasDrawing";
import canvasHelper from "../services/CanvasHelper";
import pageElementHelper from "../services/PageElementHelper";
import { tapEvents } from "../services/TapEvents";

interface OverviewCanvasProps {
    elements: PageElement[];
    onClick: (position: Point) => void;
    onNavigateBack: () => void;
}

interface OverviewCanvasState {
    translation: { dx: number, dy: number };
    scale: number;
}

export class OverviewCanvas extends React.Component<OverviewCanvasProps, OverviewCanvasState> {
    private canvas: HTMLCanvasElement | null = null;

    private canvasContext: CanvasContext;
    private canvasDrawing: CanvasDrawing;

    constructor(props: OverviewCanvasProps) {
        super(props);
        this.tapUp = this.tapUp.bind(this);
        this.resize = this.resize.bind(this);

        this.state = { scale: 1, translation: { dx: 0, dy: 0 } };
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
            <React.Fragment>
                <canvas
                    className="overview"
                    style={{ cursor: "default" }}
                    ref={(canvas) => { this.canvas = canvas; }}
                    {...{ [tapEvents.tapUp]: this.tapUp }}
                />
                <div className="menu">
                    <button onClick={this.props.onNavigateBack}>Back</button>
                </div>
            </React.Fragment>);
    }

    private tapUp(e: any) {
        const tapDownPoint = this.canvasContext.getTransformedPoint(tapEvents.getTapPosition(e));
        // add offset since canvas is not at position 0, 0
        tapDownPoint.x -= 15;
        tapDownPoint.y -= 75;
        this.props.onClick(tapDownPoint);
    }

    private resize() {
        canvasHelper.setCanvasSize(this.canvasContext, window.innerWidth - 30, window.innerHeight - 90);
        this.generateOverview();
    }

    // TODO: refactoring
    private generateOverview() {
        const spacingFactor = 0.01;

        let min: Point | undefined;
        let max: Point | undefined;

        // calc min and max
        this.props.elements.forEach((element) => {
            if (pageElementHelper.elementIsLine(element)) {
                element.segments.forEach((segment) => {
                    const minMax = this.expandMinMax(min, max, segment.start, segment.end);
                    min = minMax.min;
                    max = minMax.max;
                });
            } else if (pageElementHelper.elementIsText(element)) {
                const textStart = element.position;
                const textEnd = {
                    x: element.position.x + element.measurement.width,
                    y: element.position.y + element.measurement.height
                };

                const minMax = this.expandMinMax(min, max, textStart, textEnd);
                min = minMax.min;
                max = minMax.max;
            }
        });

        this.canvasContext.doCanvasAction((context) => {
            if (!min || !max) {
                return;
            }

            let canvasWidth = Math.abs(min.x) + Math.abs(max.x);
            let canvasHeight = Math.abs(min.y) + Math.abs(max.y);

            canvasWidth += canvasWidth * spacingFactor * 2;
            canvasHeight += canvasHeight * spacingFactor * 2;

            const scaleX = context.canvas.width / canvasWidth;
            const scaleY = context.canvas.height / canvasHeight;
            let scale = 1;

            scale = scaleX < scaleY ? scaleX : scaleY;

            if (scale > 1) {
                scale = 1;
            }

            const translation: { dx: number, dy: number } = { dx: 0, dy: 0 };

            translation.dx = Math.abs(min.x) + (canvasWidth * spacingFactor);
            translation.dy = Math.abs(min.y) + (canvasHeight * spacingFactor);

            context.lineCap = "round";
            context.textBaseline = "top";
            this.canvasContext.scale(scale, scale);
            this.canvasContext.translate(translation.dx, translation.dy);

            this.setState({ scale, translation }, () => {
                this.canvasDrawing.repaint(this.canvasContext, this.props.elements, false);

                // if (min && max) {
                //     context.strokeStyle = "red";
                //     context.strokeRect(min.x, min.y, max.x - min.x, max.y - min.y);
                // }
            });
        });

    }

    private expandMinMax(min: Point | undefined, max: Point | undefined, elementStart: Point, elementEnd: Point) {
        if (!min) {
            const { x, y } = elementStart;
            min = { x, y };
        }
        if (!max) {
            const { x, y } = elementEnd;
            max = { x, y };
        }

        if (elementStart.x < min.x) {
            min.x = elementStart.x;
        }
        if (elementStart.y < min.y) {
            min.y = elementStart.y;
        }
        if (elementEnd.x > max.x) {
            max.x = elementEnd.x;
        }
        if (elementEnd.y > max.y) {
            max.y = elementEnd.y;
        }

        return { min, max };
    }
}
