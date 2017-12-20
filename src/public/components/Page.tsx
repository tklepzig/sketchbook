import * as React from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import { Dispatch } from "redux";
import { Page as PageModel, Point, RootState } from "../models/RootState";
import { Overview } from "./Overview";
import SketchArea from "./SketchArea";

export interface PageRouteProps {
    id: string;
}

export interface PageOwnProps extends RouteComponentProps<PageRouteProps> {
}

export interface PageProps {
    page: PageModel;
}

export interface PageState {
    isOverview: boolean;
    sketchAreaCenter: Point;
}

class Page extends React.Component<PageProps & PageOwnProps, PageState> {
    constructor(props: any) {
        super(props);
        this.onOverviewClick = this.onOverviewClick.bind(this);
        this.onNavigateBack = this.onNavigateBack.bind(this);
        this.state = { isOverview: true, sketchAreaCenter: { x: 0, y: 0 } };
    }

    public render() {
        const content = this.state.isOverview
            ? <Overview elements={this.props.page.elements} onClick={this.onOverviewClick} />
            : (
                <SketchArea
                    page={this.props.page}
                    center={this.state.sketchAreaCenter}
                    onNavigateBack={this.onNavigateBack}
                />);

        return (
            < React.Fragment >
                {content}
            </React.Fragment >
        );
    }

    private onOverviewClick(position: Point) {
        this.setState({ isOverview: false, sketchAreaCenter: position });
    }

    private onNavigateBack() {
        this.setState({ isOverview: true });
    }
}

function mapStateToProps(state: RootState, ownProps: PageOwnProps): PageProps {
    const page = state.pages.find((p) => p.id === ownProps.match.params.id);

    if (!page) {
        throw new Error(`Unknown Page with id ${ownProps.match.params.id}`);
    }

    return { page };
}

export default connect<PageProps, {}, PageOwnProps, RootState>(
    mapStateToProps
)(Page);
