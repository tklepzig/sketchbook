import * as React from "react";
import { NavLink } from "react-router-dom";
import { CompositeOperation, Line, PageElement, Point } from "../models/RootState";
import Canvas from "./Canvas";
import { Menu } from "./Menu";

export interface SketchAreaProps {
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
            color={props.color}
            compositeOperation={props.compositeOperation}
            lineWidth={props.lineWidth}
            elements={props.elements}
            onLineAdded={props.onLineAdded}
        />
        <Menu />
    </React.Fragment>
);
