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
import { InputModeButton } from "./InputModeButton";
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
    const pen = props.inputMode === "pen"
        ? (
            <PenChooser
                color={props.color}
                strokeWidth={props.strokeWidth}
                onColorSelected={props.onColorSelected}
                onStrokeWidthSelected={props.onStrokeWidthSelected}
            />)
        : <InputModeButton inputMode="pen" onClick={props.onInputModeSelected} />;

    const text = props.inputMode === "text"
        ? (
            <FontSizeChooser
                fontSize={props.fontSize}
                onFontSizeSelected={props.onFontSizeSelected}
            />)
        : <InputModeButton inputMode="text" onClick={props.onInputModeSelected} />;

    return (
        <div className="menu">
            {pen}
            {text}
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
