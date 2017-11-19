import * as React from "react";
import observer from "../services/Observer";

export interface ColorButtonProps {
    color: string;
}

export default class ColorButton extends React.Component<ColorButtonProps, any> {
    constructor() {
        super();
        this.setColor = this.setColor.bind(this);
    }
    public render() {
        return <button onClick={this.setColor}>{this.props.color}</button>;
    }

    private setColor() {
        observer.publish("popupVisible", false);
        observer.publish("color", this.props.color);

        // TODO: this is definitely the wrong place for that
        if (this.props.color !== "black") {
            observer.publish("strokeWidth", "m");
            observer.publish("drawMode", "below");
        } else {
            observer.publish("strokeWidth", "s");
            observer.publish("drawMode", "above");
        }
    }
}
