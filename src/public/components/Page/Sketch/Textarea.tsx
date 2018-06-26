import { FontSize, Point } from "@shared/models";
import * as React from "react";
import { bind } from "react.ex";

interface TextareaProps {
    text: string;
    fontSize: number;
    position: Point;
    onTextChanged: (text: string) => void;
}


export class Textarea extends React.Component<TextareaProps> {
    private textarea: HTMLTextAreaElement | null = null;

    constructor(props: TextareaProps) {
        super(props);
        this.onTextChanged = this.onTextChanged.bind(this);
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

        return (
            <div className="blubb" style={{ top, left }}>
                <textarea
                    ref={(ta) => { this.textarea = ta; }}
                    value={this.props.text}
                    onChange={this.onTextChanged}
                    className={`fs-${this.props.fontSize.toString()}`}
                    onKeyUp={this.onKeyUp}
                />
            </div>);
    }

    @bind
    private onKeyUp(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        const keyEscape = 27;
        const keyReturn = 13;

        if (e.keyCode === keyEscape || e.keyCode === keyReturn && e.ctrlKey) {
            console.log("todo: close textarea");
        }
    }

    private onTextChanged(e: React.ChangeEvent<HTMLTextAreaElement>) {
        this.props.onTextChanged(e.target.value);
    }
}
