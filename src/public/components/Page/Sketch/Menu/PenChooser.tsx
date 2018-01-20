import { Button } from "@components/Button";
import { ColorButton } from "@components/Page/Sketch/Menu/ColorButton";
import { StrokeWidthButton } from "@components/Page/Sketch/Menu/StrokeWidthButton";
import { Popup } from "@components/Popup";
import { RootState } from "@models/RootState";
import { setColor, SetColorAction, setStrokeWidth, SetStrokeWidthAction } from "actions";
import * as React from "react";
import { connect, Dispatch } from "react-redux";

export interface PenChooserProps {
    color: string;
    strokeWidth: string;
    onColorSelected: (color: string) => void;
    onStrokeWidthSelected: (strokeWidth: string) => void;
}

interface PenChooserState {
    popupVisible: boolean;
}

export class PenChooser extends React.Component<PenChooserProps, PenChooserState> {
    constructor(props: PenChooserProps) {
        super(props);
        this.openPopup = this.openPopup.bind(this);
        this.closePopup = this.closePopup.bind(this);
        this.colorSelected = this.colorSelected.bind(this);
        this.strokeWidthSelected = this.strokeWidthSelected.bind(this);

        this.state = { popupVisible: false };
    }
    public render() {
        // tslint:disable:max-line-length
        return (
            <>
                <Button
                    onClick={this.openPopup}
                    className={`btn-pen ${this.props.color} ${this.props.strokeWidth}`}
                />
                <Popup visible={this.state.popupVisible} onOutsideClick={this.closePopup}>
                    <header>Color</header>
                    <div>
                        <ColorButton onClick={this.colorSelected} color="black" />
                        <ColorButton onClick={this.colorSelected} color="grey" />
                        <ColorButton onClick={this.colorSelected} color="blue" />
                        <ColorButton onClick={this.colorSelected} color="orange" />
                    </div>
                    <div>
                        <ColorButton onClick={this.colorSelected} color="red" />
                        <ColorButton onClick={this.colorSelected} color="green" />
                        <ColorButton onClick={this.colorSelected} color="yellow" />
                    </div>
                    <header>Stroke Width</header>
                    <div>
                        <StrokeWidthButton color={this.props.color} onClick={this.strokeWidthSelected} strokeWidth="s" />
                        <StrokeWidthButton color={this.props.color} onClick={this.strokeWidthSelected} strokeWidth="m" />
                        <StrokeWidthButton color={this.props.color} onClick={this.strokeWidthSelected} strokeWidth="l" />
                    </div>

                </Popup>
            </>
        );
        // tslint:enable:object-literal-sort-keys
    }

    private colorSelected(color: string) {
        this.closePopup();
        this.props.onColorSelected(color);
    }

    private strokeWidthSelected(strokeWidth: string) {
        this.closePopup();
        this.props.onStrokeWidthSelected(strokeWidth);
    }

    private openPopup() {
        this.setState({ popupVisible: true });
    }

    private closePopup() {
        this.setState({ popupVisible: false });
    }
}
