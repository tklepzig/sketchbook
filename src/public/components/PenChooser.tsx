import * as React from "react";
import { ColorButton } from "./ColorButton";
import { Popup } from "./Popup";
import { StrokeWidthButton } from "./StrokeWidthButton";

export interface PenChooserProps {
    color: string;
    strokeWidth: string;
    onColorSelected: (color: string) => void;
    onStrokeWidthSelected: (strokeWidth: string) => void;
    popupVisible: boolean;
    onOpen: () => void;
    onCancel: () => void;
}

export default class PenChooser extends React.Component<PenChooserProps> {
    public render() {
        return [
            (
                <button
                    key="button"
                    onClick={this.props.onOpen}
                    className={`btn-pen ${this.props.color} ${this.props.strokeWidth}`}
                />
            ),
            (
                <Popup visible={this.props.popupVisible} onOutsideClick={this.props.onCancel} key="popup">
                    <h5>Color</h5>
                    <ColorButton onClick={this.props.onColorSelected} color="black" />
                    <ColorButton onClick={this.props.onColorSelected} color="grey" />
                    <ColorButton onClick={this.props.onColorSelected} color="blue" />
                    <ColorButton onClick={this.props.onColorSelected} color="orange" />
                    <h5>Stroke Width</h5>
                    <StrokeWidthButton onClick={this.props.onStrokeWidthSelected} strokeWidth="s" />
                    <StrokeWidthButton onClick={this.props.onStrokeWidthSelected} strokeWidth="m" />
                    <StrokeWidthButton onClick={this.props.onStrokeWidthSelected} strokeWidth="l" />
                </Popup>
            )
        ];
    }
}

// TODO: add map functions, connect-call, etc.
