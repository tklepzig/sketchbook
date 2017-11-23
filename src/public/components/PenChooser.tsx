import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { setColor, SetColorAction, setStrokeWidth, SetStrokeWidthAction } from "../actions";
import { RootState } from "../models/RootState";
import { ColorButton } from "./ColorButton";
import { Popup } from "./Popup";
import { StrokeWidthButton } from "./StrokeWidthButton";

export interface PenChooserProps {
    color: string;
    strokeWidth: string;
}

interface PenChooserDispatchProps {
    onColorSelected: (color: string) => SetColorAction;
    onStrokeWidthSelected: (strokeWidth: string) => SetStrokeWidthAction;
}

interface PenChooserState {
    popupVisible: boolean;
}

class PenChooser extends React.Component<PenChooserProps & PenChooserDispatchProps, PenChooserState> {
    constructor() {
        super();
        this.openPopup = this.openPopup.bind(this);
        this.closePopup = this.closePopup.bind(this);
        this.colorSelected = this.colorSelected.bind(this);
        this.strokeWidthSelected = this.strokeWidthSelected.bind(this);

        this.state = { popupVisible: false };
    }
    public render() {
        return [
            (
                <button
                    key="button"
                    onClick={this.openPopup}
                    className={`btn-pen ${this.props.color} ${this.props.strokeWidth}`}
                />
            ),
            (
                <Popup visible={this.state.popupVisible} onOutsideClick={this.closePopup} key="popup">
                    <h5>Color</h5>
                    <ColorButton onClick={this.colorSelected} color="black" />
                    <ColorButton onClick={this.colorSelected} color="grey" />
                    <ColorButton onClick={this.colorSelected} color="blue" />
                    <ColorButton onClick={this.colorSelected} color="orange" />
                    <h5>Stroke Width</h5>
                    <StrokeWidthButton onClick={this.strokeWidthSelected} strokeWidth="s" />
                    <StrokeWidthButton onClick={this.strokeWidthSelected} strokeWidth="m" />
                    <StrokeWidthButton onClick={this.strokeWidthSelected} strokeWidth="l" />
                </Popup>
            )
        ];
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

function mapStateToProps(state: RootState) {
    const { color, strokeWidth } = state.pen;
    return { color, strokeWidth };
}

function mapDispatchToProps(dispatch: Dispatch<RootState>) {
    return {
        onColorSelected: (color: string) => dispatch(setColor(color)),
        onStrokeWidthSelected: (strokeWidth: string) => dispatch(setStrokeWidth(strokeWidth)),
    };
}

export default connect<PenChooserProps, PenChooserDispatchProps, {}, RootState>(
    mapStateToProps,
    mapDispatchToProps
)(PenChooser);
