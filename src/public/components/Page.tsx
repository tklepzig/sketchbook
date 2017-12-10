import * as React from "react";
import { connect } from "react-redux";
import { NavLink, RouteComponentProps } from "react-router-dom";
import { Dispatch } from "redux";
import { addLine } from "../actions";
import { DrawMode, Line, Page as PageModel, Point, RootState } from "../models/RootState";
import { Overview } from "./Overview";
import { SketchArea } from "./SketchArea";

export interface PageRouteProps {
    id: string;
}

export interface PageOwnProps extends RouteComponentProps<PageRouteProps> {
}

export interface PageProps {
    color: string;
    lineWidth: number;
    drawMode: DrawMode;
    page: PageModel;
}

interface PageDispatchProps {
    onLineAdded: (line: Line) => void;
}

export interface PageState {
    isOverview: boolean;
    sketchAreaCenter: Point;
}

class Page extends React.Component<PageProps & PageDispatchProps & PageOwnProps, PageState> {
    constructor(props: any) {
        super(props);
        this.onOverviewClick = this.onOverviewClick.bind(this);
        this.state = { isOverview: true, sketchAreaCenter: { x: 0, y: 0 } };
    }

    public render() {
        const content = this.state.isOverview
            ? <Overview lines={this.props.page.lines} onClick={this.onOverviewClick} />
            : (
                <SketchArea
                    center={this.state.sketchAreaCenter}
                    color={this.props.color}
                    drawMode={this.props.drawMode}
                    lineWidth={this.props.lineWidth}
                    lines={this.props.page.lines}
                    onLineAdded={this.props.onLineAdded}
                />);

        return (
            < React.Fragment >
                {content}
            </React.Fragment >
        );
    }

    private onOverviewClick() {
        this.setState({ isOverview: false, sketchAreaCenter: { x: 0, y: 0 } });
    }
}

function mapStateToProps(state: RootState, ownProps: PageOwnProps): PageProps {
    const { pen: { color, strokeWidth } } = state;
    let page = state.pages.find((p) => p.id === ownProps.match.params.id);

    if (!page) {
        // TODO: redundant defintion of default value for page
        page = { id: (state.pages.length + 1).toString(), lines: [] };
    }

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

    return { color: colorHexCode, lineWidth, drawMode, page };
}

function mapDispatchToProps(dispatch: Dispatch<RootState>, ownProps: PageOwnProps) {
    return {
        onLineAdded: (line: Line) => dispatch(addLine(ownProps.match.params.id, line))
    };
}

export default connect<PageProps, PageDispatchProps, PageOwnProps, RootState>(
    mapStateToProps,
    mapDispatchToProps
)(Page);
