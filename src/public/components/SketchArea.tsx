import * as React from "react";
import { NavLink } from "react-router-dom";
import { CompositeOperation, FontSize, InputMode, Line, PageElement, Point } from "../models/RootState";
import Canvas from "./Canvas";
import Menu from "./Menu";

export interface SketchAreaProps {
    inputMode: InputMode;
    fontSize: FontSize;
    center: Point;
    color: string;
    lineWidth: number;
    compositeOperation: CompositeOperation;
    elements: PageElement[];
    onLineAdded: (line: Line) => void;
}

export const SketchArea: React.SFC<SketchAreaProps> = (props) => (
    <React.Fragment>
        <Canvas
            inputMode={props.inputMode}
            fontSize={props.fontSize}
            color={props.color}
            compositeOperation={props.compositeOperation}
            lineWidth={props.lineWidth}
            elements={props.elements}
            onLineAdded={props.onLineAdded}
        />
        <Menu />
    </React.Fragment>
);
