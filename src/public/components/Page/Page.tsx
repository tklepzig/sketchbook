import { Overview } from "@components/Page/Overview/Overview";
import Sketch from "@components/Page/Sketch/Sketch";
import { RootState } from "@models/RootState";
import { Page as PageModel, Point } from "@shared/models";
import * as React from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import { Dispatch } from "redux";

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
    sketchCenter: Point;
}

class Page extends React.Component<PageProps & PageOwnProps, PageState> {
    constructor(props: PageProps & PageOwnProps) {
        super(props);
        this.onOverviewClick = this.onOverviewClick.bind(this);
        this.onNavigateBack = this.onNavigateBack.bind(this);
        this.backToStart = this.backToStart.bind(this);

        this.state = { isOverview: props.page.elements.length > 0, sketchCenter: { x: 0, y: 0 } };
    }

    public render() {
        const content = this.state.isOverview
            ? (
                <Overview
                    page={this.props.page}
                    onClick={this.onOverviewClick}
                    onNavigateBack={this.backToStart}
                />)
            : (
                <Sketch
                    page={this.props.page}
                    center={this.state.sketchCenter}
                    onNavigateBack={this.onNavigateBack}
                />);

        return (
            <React.Fragment>
                {content}
            </React.Fragment>
        );
    }

    private onOverviewClick(position: Point) {
        this.setState({ isOverview: false, sketchCenter: position });
    }

    private onNavigateBack() {
        this.setState({ isOverview: true });
    }

    private backToStart() {
        this.props.history.replace("/");
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
