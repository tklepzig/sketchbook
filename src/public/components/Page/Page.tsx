import { Overview } from "@components/Page/Overview/Overview";
import Sketch from "@components/Page/Sketch/Sketch";
import { RootState } from "@models/RootState";
import { PageDetails, Point } from "@shared/models";
import { clearCurrentPage, fetchPage } from "actions";
import * as React from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import { Dispatch } from "redux";

interface PageRouteProps {
    pageNumber: number;
}

interface PageOwnProps extends RouteComponentProps<PageRouteProps> {
}

interface PageProps {
    page: PageDetails | null;
}

interface PageDispatchProps {
    dispatch: Dispatch<RootState>;
}

interface PageState {
    sketchCenter: Point;
    isOverview: boolean;
}

class Page extends React.Component<PageProps & PageOwnProps & PageDispatchProps, PageState> {
    constructor(props: PageProps & PageOwnProps & PageDispatchProps) {
        super(props);
        this.onOverviewClick = this.onOverviewClick.bind(this);
        this.onNavigateBack = this.onNavigateBack.bind(this);
        this.backToStart = this.backToStart.bind(this);

        this.state = {
            isOverview: true,
            sketchCenter: { x: 0, y: 0 }
        };
    }

    public async componentWillMount() {
        // make sure the web font has been loaded before the page is fetched from server
        document.fonts.load("300 1px OpenSans");
        document.fonts.load("400 1px OpenSans");
        document.fonts.load("600 1px OpenSans");

        await document.fonts.ready;
        this.props.dispatch(fetchPage(this.props.match.params.pageNumber));
    }

    public render() {
        if (!this.props.page) {
            return null;
        }

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
            <>
                {content}
            </>
        );
    }

    private onOverviewClick(position: Point) {
        this.setState({ isOverview: false, sketchCenter: position });
    }

    private onNavigateBack() {
        this.setState({ isOverview: true });
    }

    private backToStart() {
        this.props.dispatch(clearCurrentPage());
        this.props.history.replace("/");
    }
}

function mapStateToProps(state: RootState): PageProps {
    const page = state.currentPage.present;
    return { page };
}

export default connect<PageProps, PageDispatchProps, PageOwnProps, RootState>(
    mapStateToProps
)(Page);
