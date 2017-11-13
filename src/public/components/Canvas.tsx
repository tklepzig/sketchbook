import * as React from "react";

export interface CanvasProps {
}

export default class Canvas extends React.Component<CanvasProps, any> {
    private canvas: HTMLCanvasElement | null;
    private canvasContext: CanvasRenderingContext2D | null;

    constructor() {
        super();
        this.resize = this.resize.bind(this);

        // tslint:disable-next-line:no-null-keyword
        if (this.canvas != null) {
            this.canvasContext = this.canvas.getContext("2d");
            // TODO: initialize canvas
        }
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

    private resize() {
        // tslint:disable-next-line:no-null-keyword
        if (this.canvas != null) {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }
    }

}
