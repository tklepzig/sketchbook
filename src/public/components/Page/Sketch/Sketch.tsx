import Menu from "@components/Page/Sketch/Menu/Menu";
import SketchCanvas from "@components/Page/Sketch/SketchCanvas";
import {
    CompositeOperation,
    FontSize,
    InputMode,
    Line,
    Page,
    Point,
    RootState,
    Text
} from "@models/RootState";
import { addLine, addText } from "actions";
import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { NavLink } from "react-router-dom";

export interface SketchProps {
    inputMode: InputMode;
    fontSize: number;
    color: string;
    lineWidth: number;
    compositeOperation: CompositeOperation;
}

export interface SketchOwnProps {
    page: Page;
    center: Point;
    onNavigateBack: () => void;
}

interface SketchDispatchProps {
    onLineAdded: (line: Line) => void;
    onTextAdded: (text: Text) => void;
}

const Sketch: React.SFC<SketchProps & SketchDispatchProps & SketchOwnProps> = (props) => (
    <React.Fragment>
        <SketchCanvas
            inputMode={props.inputMode}
            fontSize={props.fontSize}
            color={props.color}
            compositeOperation={props.compositeOperation}
            lineWidth={props.lineWidth}
            elements={props.page.elements}
            center={props.center}
            onLineAdded={props.onLineAdded}
            onTextAdded={props.onTextAdded}
        />
        <Menu onNavigateBack={props.onNavigateBack} />
    </React.Fragment>
);

function mapStateToProps(state: RootState): SketchProps {
    const { inputMode, fontSize, pen: { color, strokeWidth } } = state;

    let colorHexCode: string;
    let lineWidth: number;
    let compositeOperation: CompositeOperation = "source-over";
    let fontSizeNumber: number;

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
        default:
            throw new Error(`Unknown line color: ${color}`);
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
        default:
            throw new Error(`Unknown stroke width: ${strokeWidth}`);
    }

    switch (fontSize) {
        case "small":
            fontSizeNumber = 12;
            break;
        case "medium":
            fontSizeNumber = 20;
            break;
        case "large":
            fontSizeNumber = 30;
            break;
        default:
            throw new Error(`Unknown font size: ${fontSize}`);
    }

    return { color: colorHexCode, lineWidth, compositeOperation, inputMode, fontSize: fontSizeNumber };
}

function mapDispatchToProps(dispatch: Dispatch<RootState>, ownProps: SketchOwnProps) {
    return {
        onLineAdded: (line: Line) => dispatch(addLine(ownProps.page.id, line)),
        onTextAdded: (text: Text) => dispatch(addText(ownProps.page.id, text))
    };
}

export default connect<SketchProps, SketchDispatchProps, SketchOwnProps, RootState>(
    mapStateToProps,
    mapDispatchToProps
)(Sketch);