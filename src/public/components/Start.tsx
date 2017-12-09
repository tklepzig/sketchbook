import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { addLine } from "../actions";
import { Line } from "../models/Line";
import { RootState } from "../models/RootState";
import Canvas, { DrawMode } from "./Canvas";
import { Menu } from "./Menu";
import Splash from "./Splash";

export interface StartProps {
    color: string;
    lineWidth: number;
    drawMode: DrawMode;
    lines: Line[];
}

interface StartDispatchProps {
    onLineAdded: (line: Line) => void;
}

class Start extends React.Component<StartProps & StartDispatchProps> {
    public render() {
        return (
            <React.Fragment>
                <Splash />
                <Canvas
                    color={this.props.color}
                    drawMode={this.props.drawMode}
                    lineWidth={this.props.lineWidth}
                    lines={this.props.lines}
                    onLineAdded={this.props.onLineAdded}
                />
                <Menu />
            </React.Fragment>
        );
    }
}

function mapStateToProps(state: RootState): StartProps {
    const { lines, pen: { color, strokeWidth } } = state;
    let colorHexCode: string;
    let lineWidth: number;
    let drawMode = DrawMode.Above;

    switch (color) {
        case "black":
            colorHexCode = "#1d1d1d";
            break;
        case "grey":
            colorHexCode = "#b9afb0";
            drawMode = DrawMode.Below;
            break;
        case "blue":
            colorHexCode = "#4595d8";
            drawMode = DrawMode.Below;
            break;
        case "orange":
            colorHexCode = "#f9a765";
            drawMode = DrawMode.Below;
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

    return { color: colorHexCode, lineWidth, drawMode, lines };
}

function mapDispatchToProps(dispatch: Dispatch<RootState>) {
    return {
        onLineAdded: (line: Line) => dispatch(addLine(line))
    };
}

export default connect<StartProps, StartDispatchProps, {}, RootState>(
    mapStateToProps,
    mapDispatchToProps
)(Start);
