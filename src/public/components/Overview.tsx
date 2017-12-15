import * as React from "react";
import { NavLink } from "react-router-dom";
import { Line, PageElement } from "../models/RootState";

export interface OverviewProps {
    elements: PageElement[];
    onClick: () => void;
}

export const Overview: React.SFC<OverviewProps> = (props) => {
    return (
        <button onClick={props.onClick}>Click to draw</button>
    );
};
