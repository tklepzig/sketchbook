import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { addLine } from "../actions";
import { CompositeOperation, FontSize, InputMode, Line, Page, Point, RootState } from "../models/RootState";
import Canvas from "./Canvas";
import Menu from "./Menu";

export interface SketchAreaProps {
    inputMode: InputMode;
    fontSize: FontSize;
    color: string;
    lineWidth: number;
    compositeOperation: CompositeOperation;
}

export interface SketchAreaOwnProps {
    page: Page;
    center: Point;
}

interface SketchAreaDispatchProps {
    onLineAdded: (line: Line) => void;
}

const SketchArea: React.SFC<SketchAreaProps & SketchAreaDispatchProps & SketchAreaOwnProps> = (props) => (
    <React.Fragment>
        <Canvas
            inputMode={props.inputMode}
            fontSize={props.fontSize}
            color={props.color}
            compositeOperation={props.compositeOperation}
            lineWidth={props.lineWidth}
            elements={props.page.elements}
            onLineAdded={props.onLineAdded}
        />
        <Menu />
    </React.Fragment>
);

function mapStateToProps(state: RootState): SketchAreaProps {
    const { inputMode, fontSize, pen: { color, strokeWidth } } = state;

    let colorHexCode: string;
    let lineWidth: number;
    let compositeOperation: CompositeOperation = "source-over";

    switch (color) {
        case "black":
            colorHexCode = "#1d1d1d";
            break;
        case "grey":
            colorHexCode = "#b9afb0";
            compositeOperation = "destination-over";
            break;
        case "blue":
            colorHexCode = "#4595d8";
            compositeOperation = "destination-over";
            break;
        case "orange":
            colorHexCode = "#f9a765";
            compositeOperation = "destination-over";
            break;
        // TODO: redundant defintion of default value for color
        default:
            colorHexCode = "#1d1d1d";
            break;
    }

    switch (strokeWidth) {
        case "s":
            lineWidth = 4;
            break;
        case "m":
            lineWidth = 10;
            break;
        case "l":
            lineWidth = 20;
            break;
        // TODO: redundant defintion of default value for lineWidth
        default:
            lineWidth = 4;
            break;
    }

    return { color: colorHexCode, lineWidth, compositeOperation, inputMode, fontSize };
}

function mapDispatchToProps(dispatch: Dispatch<RootState>, ownProps: SketchAreaOwnProps) {
    return {
        onLineAdded: (line: Line) => dispatch(addLine(ownProps.page.id, line))
    };
}

export default connect<SketchAreaProps, SketchAreaDispatchProps, SketchAreaOwnProps, RootState>(
    mapStateToProps,
    mapDispatchToProps
)(SketchArea);
