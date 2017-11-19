import * as React from "react";
import observer from "../services/Observer";

export interface StrokeWidthButtonProps {
    strokeWidth: string;
}

export default class StrokeWidthButton extends React.Component<StrokeWidthButtonProps, any> {
    constructor() {
        super();
        this.setStrokeWidth = this.setStrokeWidth.bind(this);
    }
    public render() {
        return <button onClick={this.setStrokeWidth}>{this.props.strokeWidth}</button>;
    }

    private setStrokeWidth() {
        observer.publish("popupVisible", false);
        observer.publish("strokeWidth", this.props.strokeWidth);
    }
}
