import { CanvasContext } from "@services/CanvasContext";
import { CanvasDrawing } from "@services/CanvasDrawing";
import canvasHelper from "@services/CanvasHelper";
import { CanvasTranslate } from "@services/CanvasTranslate";
import pageElementHelper from "@services/PageElementHelper";
import { tapEvents } from "@services/TapEvents";
import { Line, PageElement, Point } from "@shared/models";
import * as React from "react";
import { NavLink } from "react-router-dom";
import { bind } from "react.ex";

interface OverviewCanvasProps {
    elements: PageElement[];
    onClick: (position: Point) => void;
}

interface OverviewCanvasState {
    translation: { dx: number, dy: number };
    scale: number;
}

export class OverviewCanvas extends React.Component<OverviewCanvasProps, OverviewCanvasState> {
    private canvas: HTMLCanvasElement | null = null;

    private canvasContext: CanvasContext;
    private canvasDrawing: CanvasDrawing;
    private canvasTranslate: CanvasTranslate;
    private tapIsDown = false;
    private isTranslateZoomMode = false;
    private lastDistance = 0;

    constructor(props: OverviewCanvasProps) {
        super(props);
        this.tapUp = this.tapUp.bind(this);
        this.resize = this.resize.bind(this);

        this.state = { scale: 1, translation: { dx: 0, dy: 0 } };
        this.canvasContext = new CanvasContext(() => this.canvas == null ? null : this.canvas.getContext("2d"));
        this.canvasDrawing = new CanvasDrawing();
        this.canvasTranslate = new CanvasTranslate();
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

    public componentWillReceiveProps() {
        this.generateOverview();
    }

    public render() {
        return (
            <canvas
                className="overview"
                style={{ cursor: "default" }}
                ref={(canvas) => { this.canvas = canvas; }}
                {...{ [tapEvents.tapUp]: this.tapUp }}
                {...{ [tapEvents.tapDown]: this.tapDown }}
                {...{ [tapEvents.tapMove]: this.tapMove }}
            />);
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
            // add offset since canvas is not at position 0, 0
            const { x, y } = this.canvasContext.getPosition();
            downPoint.x -= x;
            downPoint.y -= y;
            const pt = this.canvasContext.getTransformedPoint(downPoint);
            this.canvasContext.translate(pt.x, pt.y);
            this.canvasContext.scale(factor, factor);
            this.canvasContext.translate(-pt.x, -pt.y);
            this.canvasDrawing.repaint(this.canvasContext, this.props.elements, false);
        }

        e.preventDefault();
        return false;
    }

    @bind
    private tapDown(e: any) {
        this.tapIsDown = true;
        const touchCount = tapEvents.getTouchCount(e);
        this.isTranslateZoomMode = touchCount === 2 || e.ctrlKey;
        const originalTapDownPoint = tapEvents.getTapPosition(e);
        const tapDownPoint = this.canvasContext.getTransformedPoint(originalTapDownPoint);

        if (this.isTranslateZoomMode) {
            this.canvasTranslate.startTranslate(tapDownPoint);
        }
    }

    @bind
    private tapMove(e: any) {
        if (!this.tapIsDown) {
            return;
        }
        if (this.isTranslateZoomMode) {

            const translate = (point: Point) => {
                // add offset since canvas is not at position 0, 0
                const { x, y } = this.canvasContext.getPosition();
                point.x -= x;
                point.y -= y;
                const pt = this.canvasContext.getTransformedPoint(point);
                this.canvasTranslate.translate(this.canvasContext, pt);
                this.canvasDrawing.repaint(this.canvasContext, this.props.elements, false);
            };

            const center = tapEvents.getPinchZoomCenter(e);
            if (!center) {
                return;
            }

            const distance = tapEvents.getPinchZoomDistance(e);
            if (distance) {

                if (this.lastDistance === 0) {
                    this.lastDistance = distance;
                } else if (Math.abs(this.lastDistance - distance) > 20) {

                    const scaleFactor = 1.1;
                    const factor = Math.pow(scaleFactor, -(this.lastDistance - distance) / 20);

                    // add offset since canvas is not at position 0, 0
                    const { x, y } = this.canvasContext.getPosition();
                    center.x -= x;
                    center.y -= y;
                    const pt = this.canvasContext.getTransformedPoint(center);
                    this.canvasContext.translate(pt.x, pt.y);
                    this.canvasContext.scale(factor, factor);
                    this.canvasContext.translate(-pt.x, -pt.y);
                    this.canvasDrawing.repaint(this.canvasContext, this.props.elements, false);
                    this.lastDistance = distance;
                } else {
                    translate(center);
                }
            } else {
                translate(center);
            }
        }
    }

    private tapUp(e: any) {
        if (!this.tapIsDown) {
            return;
        }
        this.tapIsDown = false;
        this.lastDistance = 0;

        if (this.isTranslateZoomMode) {
            return;
        }
        const downPoint = tapEvents.getTapPosition(e);
        // add offset since canvas is not at position 0, 0
        const { x, y } = this.canvasContext.getPosition();
        downPoint.x -= x;
        downPoint.y -= y;

        const tapDownPoint = this.canvasContext.getTransformedPoint(downPoint);
        this.props.onClick(tapDownPoint);
    }

    private resize() {
        canvasHelper.setCanvasSize(this.canvasContext, window.innerWidth - (15 * 2), window.innerHeight - (63 + 15));
        this.generateOverview();
    }

    private generateOverview() {
        const spacingFactor = 0.01;
        const { min, max } = this.calculateMinMax(this.props.elements);

        this.canvasContext.doCanvasAction((context) => {
            if (!min || !max) {
                return;
            }

            this.canvasContext.setTransform(1, 0, 0, 1, 0, 0);
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
