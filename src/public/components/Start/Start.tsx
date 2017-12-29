import { PageList } from "@components/Start/PageList";
import { RootState } from "@models/RootState";
import fullscreen from "@services/Fullscreen";
import { Page } from "@shared/models";
import { addPage, fetchPageList } from "actions";
import * as React from "react";
import { connect, Dispatch, DispatchProp, ProviderProps } from "react-redux";
import { RouteComponentProps } from "react-router";

interface StartProps {
    pageList: Array<{ id: string }>;
}

interface StartDispatchProps {
    dispatch: Dispatch<RootState>;
    onAddPage: () => void;

}

export interface StartOwnProps extends RouteComponentProps<any> {
}

class Start extends React.Component<StartProps & StartOwnProps & StartDispatchProps> {
    constructor(props: StartProps & StartOwnProps & StartDispatchProps) {
        super(props);
        this.onPageClick = this.onPageClick.bind(this);
    }

    public componentWillMount() {
        this.props.dispatch(fetchPageList());
    }

    public render() {
        return (
            <>
            <PageList onClick={this.onPageClick} pageList={this.props.pageList} />
            <button onClick={this.props.onAddPage}>Add</button>
            </>
        );
    }

    private onPageClick(path: string) {
        this.props.history.replace(path);
        if ("ontouchstart" in window) {
            fullscreen.request(document.body);
        }
    }
}

function mapStateToProps(state: RootState): StartProps {
    const { pageList } = state;
    return { pageList };
}

function mapDispatchToProps(dispatch: Dispatch<RootState>) {
    return {
        dispatch,
        onAddPage: () => dispatch(addPage("1"))
    };
}

export default connect<StartProps, StartDispatchProps, StartOwnProps, RootState>(
    mapStateToProps,
    mapDispatchToProps
)(Start);
