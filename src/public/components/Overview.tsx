import { Page, Point } from "@models/RootState";
import * as React from "react";
import { OverviewCanvas } from "./OverviewCanvas";

interface OverviewProps {
    page: Page;
    onNavigateBack: () => void;
    onClick: (position: Point) => void;
}

export const Overview: React.SFC<OverviewProps> = (props) => (
    <React.Fragment>
        <OverviewCanvas elements={props.page.elements} onClick={props.onClick} />
        <div className="menu">
            <button onClick={props.onNavigateBack}>Back</button>
        </div>
    </React.Fragment>
);
