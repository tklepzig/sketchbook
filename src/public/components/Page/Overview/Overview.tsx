import { Menu } from "@components/Page/Overview/Menu";
import { OverviewCanvas } from "@components/Page/Overview/OverviewCanvas";
import { PageDetails, Point } from "@shared/models";
import * as React from "react";

interface OverviewProps {
    page: PageDetails;
    onNavigateBack: () => void;
    onClick: (position: Point) => void;
}

export const Overview: React.SFC<OverviewProps> = (props) => (
    <>
        <OverviewCanvas elements={props.page.elements} onClick={props.onClick} />
        <Menu title={props.page.name || `Page ${props.page.pageNumber}`} onNavigateBack={props.onNavigateBack} />
    </>
);
