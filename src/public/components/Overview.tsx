import * as React from "react";
import { NavLink } from "react-router-dom";
import { Line, PageElement, Point } from "../models/RootState";
import { CanvasContext } from "../services/CanvasContext";
import { CanvasDrawing } from "../services/CanvasDrawing";
import canvasHelper from "../services/CanvasHelper";
import pageElementHelper from "../services/PageElementHelper";
import { tapEvents } from "../services/TapEvents";

interface OverviewProps {
    elements: PageElement[];
    onClick: (position: Point) => void;
}

interface OverviewState {
    translation: { dx: number, dy: number };
    scale: number;
}

export class Overview extends React.Component<OverviewProps, OverviewState> {
    private canvas: HTMLCanvasElement | null = null;

    private canvasContext: CanvasContext;
    private canvasDrawing: CanvasDrawing;

    constructor(props: OverviewProps) {
        super(props);
        this.tapDown = this.tapDown.bind(this);
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
            <canvas
                style={{ cursor: "default" }}
                ref={(canvas) => { this.canvas = canvas; }}
                {...{ [tapEvents.tapDown]: this.tapDown }}
            />);
    }

    private tapDown(e: any) {
        const tapDownPoint = this.canvasContext.getTransformedPoint(tapEvents.getTapPosition(e));
        this.props.onClick(tapDownPoint);
    }

    private resize() {
        canvasHelper.setCanvasSize(this.canvasContext, window.innerWidth, window.innerHeight);
        this.generateOverview();
    }

    private generateOverview() {
        this.canvasContext.doCanvasAction((context) => {
            const spacingFactor = 0.01;

            let min: Point | undefined;
            let max: Point | undefined;

            // calc min and max
            this.props.elements.forEach((element) => {
                if (pageElementHelper.elementIsLine(element)) {
                    element.segments.forEach((segment) => {

                        // TODO: DRY
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
                    // TODO: extract
                    context.font = `bold ${element.fontSize}pt Handlee`;
                    const { width: textWidth } = context.measureText(element.text);
                    let textHeight = 0;
                    for (const line of element.text.split("\n")) {
                        textHeight += (element.fontSize + 6) * 1.2;
                    }

                    const textStart = element.position;
                    const textEnd = { x: element.position.x + textWidth, y: element.position.y + textHeight };

                    // TODO: DRY
                    if (!min) {
                        const { x, y } = textStart;
                        min = { x, y };
                    }
                    if (!max) {
                        const { x, y } = textEnd;
                        max = { x, y };
                    }

                    if (textStart.x < min.x) {
                        min.x = textStart.x;
                    }
                    if (textStart.y < min.y) {
                        min.y = textStart.y;
                    }
                    if (textEnd.x > max.x) {
                        max.x = textEnd.x;
                    }
                    if (textEnd.y > max.y) {
                        max.y = textEnd.y;
                    }
                }
            });

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
            });

            // context.strokeStyle = "red";
            // context.strokeRect(min.x, min.y, max.x - min.x, max.y - min.y);
        });

    }
}
