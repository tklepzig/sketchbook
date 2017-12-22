import { Menu } from "@components/Page/Overview/Menu";
import { OverviewCanvas } from "@components/Page/Overview/OverviewCanvas";
import { Page, Point } from "@models/RootState";
import * as React from "react";

interface OverviewProps {
    page: Page;
    onNavigateBack: () => void;
    onClick: (position: Point) => void;
}

export const Overview: React.SFC<OverviewProps> = (props) => (
    <React.Fragment>
        <OverviewCanvas elements={props.page.elements} onClick={props.onClick} />
        <Menu title={`Page ${props.page.id}`} onNavigateBack={props.onNavigateBack} />
    </React.Fragment>
);
