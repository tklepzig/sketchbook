import * as React from "react";
import observer from "../services/Observer";
import ColorButton from "./ColorButton";
import Popup from "./Popup";
import StrokeWidthButton from "./StrokeWidthButton";

export interface PenChooserState {
    color: string;
    strokeWidth: string;
}

export default class PenChooser extends React.Component<any, PenChooserState> {
    constructor() {
        super();
        this.showPopup = this.showPopup.bind(this);
        this.state = { color: "black", strokeWidth: "s" };

        observer.subscribe("color", (color) => this.setState({ color }));
        observer.subscribe("strokeWidth", (strokeWidth) => this.setState({ strokeWidth }));
    }
    public render() {
        return [
            (
                <button
                    key="button"
                    onClick={this.showPopup}
                    className={`btn-pen ${this.state.color} ${this.state.strokeWidth}`}
                />
            ),
            (
                <Popup key="popup">
                    <h5>Color</h5>
                    <ColorButton color="black" />
                    <ColorButton color="grey" />
                    <ColorButton color="blue" />
                    <ColorButton color="orange" />
                    <h5>Stroke Width</h5>
                    <StrokeWidthButton strokeWidth="s" />
                    <StrokeWidthButton strokeWidth="m" />
                    <StrokeWidthButton strokeWidth="l" />
                </Popup>
            )
        ];
    }

    private showPopup() {
        observer.publish("popupVisible", true);
    }
}
