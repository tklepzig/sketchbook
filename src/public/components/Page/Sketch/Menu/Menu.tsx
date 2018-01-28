import { FontSizeChooser } from "@components/Page/Sketch/Menu/FontSizeChooser";
import { InputModeToggle } from "@components/Page/Sketch/Menu/InputModeToggle";
import { PenChooser } from "@components/Page/Sketch/Menu/PenChooser";
import { RootState } from "@models/RootState";
import { FontSize, InputMode } from "@shared/models";

import { Button } from "@components/Button";
import {
    redo,
    setColor,
    SetColorAction,
    setFontSize,
    SetFontSizeAction,
    setInputMode,
    SetInputModeAction,
    setStrokeWidth,
    SetStrokeWidthAction,
    undo
} from "actions";
import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { ActionCreators } from "redux-undo";

interface MenuProps {
    inputMode: InputMode;
    color: string;
    strokeWidth: string;
    fontSize: FontSize;
    canUndo: boolean;
    canRedo: boolean;
}

interface MenuOwnProps {
    onNavigateBack: () => void;
}

interface MenuDispatchProps {
    onColorSelected: (color: string) => SetColorAction;
    onStrokeWidthSelected: (strokeWidth: string) => SetStrokeWidthAction;
    onFontSizeSelected: (fontSize: FontSize) => SetFontSizeAction;
    onInputModeSelected: (inputMode: InputMode) => SetInputModeAction;
    onUndo: () => void;
    onRedo: () => void;
}

const Menu: React.SFC<MenuProps & MenuOwnProps & MenuDispatchProps> = (props) => {
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

    const inputModeToggle = "ontouchstart" in window
        ? null
        : <InputModeToggle inputMode={props.inputMode} inputModeChanged={props.onInputModeSelected} />;

    return (
        <div className="menu">
            <Button className="btn-back" onClick={props.onNavigateBack} />
            <div style={{ flex: 1 }} />
            <Button title="Undo" className="btn-undo" disabled={!props.canUndo} onClick={props.onUndo} />
            <Button title="Redo" className="btn-redo" disabled={!props.canRedo} onClick={props.onRedo} />
            <div style={{ flex: "0 0 20px" }} />
            {content}
            <div style={{ flex: "0 0 20px" }} />
            {inputModeToggle}
            <div style={{ flex: 1 }} />
        </div>);
};

function mapStateToProps(state: RootState) {
    const {
        inputMode,
        fontSize,
        pen: { color, strokeWidth },
        currentPage: { past, future }
    } = state;

    return {
        color, strokeWidth,
        fontSize, inputMode,
        canUndo: past.length > 0,
        canRedo: future.length > 0
    };
}

function mapDispatchToProps(dispatch: Dispatch<RootState>) {
    return {
        onColorSelected: (color: string) => dispatch(setColor(color)),
        onFontSizeSelected: (fontSize: FontSize) => dispatch(setFontSize(fontSize)),
        onStrokeWidthSelected: (strokeWidth: string) => dispatch(setStrokeWidth(strokeWidth)),
        onInputModeSelected: (inputMode: InputMode) => dispatch(setInputMode(inputMode)),
        onUndo: () => dispatch(undo()),
        onRedo: () => dispatch(redo())
    };
}

export default connect<MenuProps, MenuDispatchProps, MenuOwnProps, RootState>(
    mapStateToProps,
    mapDispatchToProps
)(Menu);
