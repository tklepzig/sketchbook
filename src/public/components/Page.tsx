import * as React from "react";
import { connect } from "react-redux";
import { NavLink, RouteComponentProps } from "react-router-dom";
import { Dispatch } from "redux";
import { addLine } from "../actions";
import { CompositeOperation, InputMode, Line, Page as PageModel, Point, RootState } from "../models/RootState";
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
    compositeOperation: CompositeOperation;
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
            ? <Overview elements={this.props.page.elements} onClick={this.onOverviewClick} />
            : (
                <SketchArea
                    center={this.state.sketchAreaCenter}
                    color={this.props.color}
                    compositeOperation={this.props.compositeOperation}
                    lineWidth={this.props.lineWidth}
                    elements={this.props.page.elements}
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
    const { color, strokeWidth } = state.pen;
    let page = state.pages.find((p) => p.id === ownProps.match.params.id);

    if (!page) {
        // TODO: redundant defintion of default value for page
        page = { id: (state.pages.length + 1).toString(), elements: [] };
    }

    let colorHexCode: string;
    let lineWidth: number;
    let compositeOperation: CompositeOperation = "source-over";

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

    return { color: colorHexCode, lineWidth, compositeOperation, page };
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
