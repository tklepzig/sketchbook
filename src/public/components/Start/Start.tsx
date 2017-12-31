import { PageList } from "@components/Start/PageList/PageList";
import { RootState } from "@models/RootState";
import fullscreen from "@services/Fullscreen";
import { Page } from "@shared/models";
import { addPage, fetchPageList } from "actions";
import * as React from "react";
import { connect, Dispatch, DispatchProp, ProviderProps } from "react-redux";
import { RouteComponentProps } from "react-router";

interface StartProps {
    pageList: Page[];
}

interface StartDispatchProps {
    dispatch: Dispatch<RootState>;
    onAddPage: (pageNumber: number, name: string) => void;

}

export interface StartOwnProps extends RouteComponentProps<any> {
}

class Start extends React.Component<StartProps & StartOwnProps & StartDispatchProps> {
    constructor(props: StartProps & StartOwnProps & StartDispatchProps) {
        super(props);
        this.onPageClick = this.onPageClick.bind(this);
        this.onAddPageClick = this.onAddPageClick.bind(this);
    }

    public componentWillMount() {
        this.props.dispatch(fetchPageList());
    }

    public render() {
        return (
            <>
            <PageList onClick={this.onPageClick} pageList={this.props.pageList} />
            <button onClick={this.onAddPageClick}>Add</button>
            </>
        );
    }

    private onPageClick(pageNumber: number) {
        this.props.history.replace(`/page/${pageNumber}`);
        if ("ontouchstart" in window) {
            fullscreen.request(document.body);
        }
    }

    private onAddPageClick() {
        let maxPageNumber = 0;
        for (const page of this.props.pageList) {
            if (page.pageNumber > maxPageNumber) {
                maxPageNumber = page.pageNumber;
            }
        }
        const nextPageNumber = maxPageNumber + 1;

        this.props.onAddPage(nextPageNumber, "");
        this.onPageClick(nextPageNumber);
    }
}

function mapStateToProps(state: RootState): StartProps {
    const { pageList } = state;
    return { pageList };
}

function mapDispatchToProps(dispatch: Dispatch<RootState>) {
    return {
        dispatch,
        onAddPage: (pageNumber: number, name: string) =>
            dispatch(addPage(pageNumber, name))
    };
}

export default connect<StartProps, StartDispatchProps, StartOwnProps, RootState>(
    mapStateToProps,
    mapDispatchToProps
)(Start);
