import * as React from "react";
import { connect, Dispatch } from "react-redux";
import {
    setColor,
    SetColorAction,
    setFontSize,
    SetFontSizeAction,
    setInputMode,
    SetInputModeAction,
    setStrokeWidth,
    SetStrokeWidthAction
} from "../actions";
import { FontSize, InputMode, RootState } from "../models/RootState";
import { FontSizeChooser } from "./FontSizeChooser";
import { InputModeToggle } from "./InputModeToggle";
import { PenChooser } from "./PenChooser";

export interface MenuProps {
    inputMode: InputMode;
    color: string;
    strokeWidth: string;
    fontSize: FontSize;

}

interface MenuDispatchProps {
    onColorSelected: (color: string) => SetColorAction;
    onStrokeWidthSelected: (strokeWidth: string) => SetStrokeWidthAction;
    onFontSizeSelected: (fontSize: FontSize) => SetFontSizeAction;
    onInputModeSelected: (inputMode: InputMode) => SetInputModeAction;
}

const Menu: React.SFC<MenuProps & MenuDispatchProps> = (props) => {
    const content = props.inputMode === "pen"
        ? (
            <PenChooser
                color={props.color}
                strokeWidth={props.strokeWidth}
                onColorSelected={props.onColorSelected}
                onStrokeWidthSelected={props.onStrokeWidthSelected}
            />)
        : (
            <FontSizeChooser
                fontSize={props.fontSize}
                onFontSizeSelected={props.onFontSizeSelected}
            />);

    return (
        <div className="menu">
            <InputModeToggle inputMode={props.inputMode} inputModeChanged={props.onInputModeSelected} />
            <div style={{ flex: 1 }} />
            {content}
            <div style={{ flex: 1 }} />
        </div>);
};

function mapStateToProps(state: RootState) {
    const { inputMode, fontSize, pen: { color, strokeWidth } } = state;
    return { color, strokeWidth, fontSize, inputMode };
}

function mapDispatchToProps(dispatch: Dispatch<RootState>) {
    return {
        onColorSelected: (color: string) => dispatch(setColor(color)),
        onFontSizeSelected: (fontSize: FontSize) => dispatch(setFontSize(fontSize)),
        onStrokeWidthSelected: (strokeWidth: string) => dispatch(setStrokeWidth(strokeWidth)),
        onInputModeSelected: (inputMode: InputMode) => dispatch(setInputMode(inputMode))
    };
}

export default connect<MenuProps, MenuDispatchProps, {}, RootState>(
    mapStateToProps,
    mapDispatchToProps
)(Menu);
