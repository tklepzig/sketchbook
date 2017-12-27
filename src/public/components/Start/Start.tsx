import { PageList } from "@components/Start/PageList";
import { RootState } from "@models/RootState";
import fullscreen from "@services/Fullscreen";
import { Page } from "@shared/models";
import { fetchPageList } from "actions";
import * as React from "react";
import { connect, Dispatch, DispatchProp, ProviderProps } from "react-redux";
import { RouteComponentProps } from "react-router";

interface StartProps {
    pageList: Array<{ id: string }>;
}

interface StartDispatchProps {
    dispatch: Dispatch<RootState>;

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
        return <PageList onClick={this.onPageClick} pageList={this.props.pageList} />;
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

export default connect<StartProps, StartDispatchProps, StartOwnProps, RootState>(
    mapStateToProps
)(Start);
