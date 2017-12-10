import * as React from "react";
import { NavLink } from "react-router-dom";
import { DrawMode, Line, Point } from "../models/RootState";
import Canvas from "./Canvas";
import { Menu } from "./Menu";

export interface SketchAreaProps {
    center: Point;
    color: string;
    lineWidth: number;
    drawMode: DrawMode;
    lines: Line[];
    onLineAdded: (line: Line) => void;
}

export const SketchArea: React.SFC<SketchAreaProps> = (props) => (
    <React.Fragment>
        <Canvas
            color={props.color}
            drawMode={props.drawMode}
            lineWidth={props.lineWidth}
            lines={props.lines}
            onLineAdded={props.onLineAdded}
        />
        <Menu />
    </React.Fragment>
);
