import Canvas from "@components/Canvas";
import { CanvasContext } from "@services/CanvasContext";
import { CanvasDrawing } from "@services/CanvasDrawing";
import canvasHelper from "@services/CanvasHelper";
import pageElementHelper from "@services/PageElementHelper";
import { tapEvents } from "@services/TapEvents";
import { PageElement, Point } from "@shared/models";
import * as React from "react";
import { bind } from "react.ex";

interface OverviewCanvasProps {
    elements: PageElement[];
    onClick: (position: Point) => void;
}

export class OverviewCanvas extends React.Component<OverviewCanvasProps> {
    private canvas: Canvas | null = null;
    private canvasDrawing: CanvasDrawing;

    constructor(props: OverviewCanvasProps) {
        super(props);
        this.tapUp = this.tapUp.bind(this);
        this.resize = this.resize.bind(this);
        this.canvasDrawing = new CanvasDrawing();
    }

    public componentWillReceiveProps() {

        if (this.canvas) {
            this.generateOverview(this.canvas.getContext());
        }
    }

    public render() {
        return (
            <Canvas
                className="overview"
                translate={true}
                zoom={true}
                ref={(canvas) => { this.canvas = canvas; }}
                onRepaint={this.repaint}
                onTapUp={this.tapUp}
                onResize={this.resize}
            />);
    }

    @bind
    private repaint(canvasContext: CanvasContext) {
        this.canvasDrawing.repaint(canvasContext, this.props.elements, false);
    }

    private tapUp(canvasContext: CanvasContext, e: any) {
        const downPoint = tapEvents.getTapPosition(e);
        // add offset since canvas is not at position 0, 0
        const { x, y } = canvasContext.getPosition();
        downPoint.x -= x;
        downPoint.y -= y;

        const tapDownPoint = canvasContext.getTransformedPoint(downPoint);
        this.props.onClick(tapDownPoint);
    }

    private resize(canvasContext: CanvasContext) {
        canvasHelper.setCanvasSize(canvasContext, window.innerWidth - (15 * 2), window.innerHeight - (63 + 15));
        this.generateOverview(canvasContext);
    }

    private generateOverview(canvasContext: CanvasContext) {
        const spacingFactor = 0.01;
        const { min, max } = this.calculateMinMax(this.props.elements);

        canvasContext.doCanvasAction((context) => {
            if (!min || !max) {
                return;
            }

            canvasContext.setTransform(1, 0, 0, 1, 0, 0);
            context.clearRect(0, 0, context.canvas.width, context.canvas.height);

            let canvasWidth = Math.abs(min.x) + Math.abs(max.x);
            let canvasHeight = Math.abs(min.y) + Math.abs(max.y);

            canvasWidth += canvasWidth * spacingFactor * 2;
            canvasHeight += canvasHeight * spacingFactor * 2;

            const scaleX = context.canvas.width / canvasWidth;
            const scaleY = context.canvas.height / canvasHeight;
            let scale = scaleX < scaleY ? scaleX : scaleY;

            if (scale > 1) {
                scale = 1;
            }

            const translation = {
                dx: Math.abs(min.x) + (canvasWidth * spacingFactor),
                dy: Math.abs(min.y) + (canvasHeight * spacingFactor)
            };

            context.lineCap = "round";
            canvasContext.scale(scale, scale);
            canvasContext.translate(translation.dx, translation.dy);

            this.setState({ scale, translation }, () => {
                this.repaint(canvasContext);

                // if (min && max) {
                //     context.strokeStyle = "red";
                //     context.strokeRect(min.x, min.y, max.x - min.x, max.y - min.y);
                // }
            });
        });
    }

    private calculateMinMax(elements: PageElement[]) {
        let min: Point | undefined;
        let max: Point | undefined;

        for (const element of elements) {
            if (pageElementHelper.elementIsLine(element)) {
                for (const segment of element.segments) {
                    const minMax = this.expandMinMax(min, max, segment.start, segment.end);
                    min = minMax.min;
                    max = minMax.max;
                }
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
        }

        return { min, max };
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
