import { FontSize, Point } from "@shared/models";
import * as React from "react";

interface TextareaProps {
    text: string;
    fontSize: number;
    position: Point;
    onTextChanged: (text: string) => void;
}

interface TextareaState {
    width: number;
    height: number;
}

export class Textarea extends React.Component<TextareaProps, TextareaState> {
    private textarea: HTMLTextAreaElement | null;
    private canvas: HTMLCanvasElement | null;

    constructor(props: TextareaProps) {
        super(props);
        this.onTextChanged = this.onTextChanged.bind(this);

        this.state = { width: 20, height: (this.props.fontSize + 6) * 1.2 };
    }

    public focus() {
        setTimeout(() => {
            if (this.textarea !== null) {
                this.textarea.focus();
            }
        });
    }
    public render() {
        const { x: left, y: top } = this.props.position;
        const { width, height } = this.state;

        return (
            <>
                <textarea
                    style={{ top, left, width, height }}
                    ref={(ta) => { this.textarea = ta; }}
                    value={this.props.text}
                    onChange={this.onTextChanged}
                    className={`fs-${this.props.fontSize.toString()}`}
                />
                <canvas style={{ display: "none" }} ref={(c) => this.canvas = c} />
            </>);
    }

    private onTextChanged(e: React.ChangeEvent<HTMLTextAreaElement>) {
        const text = e.target.value;

        if (this.canvas !== null) {
            const context = this.canvas.getContext("2d");
            if (context !== null) {
                context.font = `400 ${this.props.fontSize}px OpenSans`;
                let height = 0;
                let longestLineWidth = 0;
                for (const line of text.split("\n")) {
                    const { width } = context.measureText(line);
                    if (width > longestLineWidth) {
                        longestLineWidth = width;
                    }
                    height += (this.props.fontSize + 6) * 1.2;
                }

                this.setState({ width: longestLineWidth, height });
            }
        }

        this.props.onTextChanged(text);
    }
}
