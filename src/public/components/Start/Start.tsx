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

const Start: React.SFC<StartProps & StartOwnProps & StartDispatchProps> = (props) => {

        // on init: call dispatch(fetchPageList) und set ready wenn fertig
    props.dispatch(fetchPageList());
    const onClick = (path: string) => {
        props.history.replace(path);
        if ("ontouchstart" in window) {
            fullscreen.request(document.body);
        }
    };
    return <PageList onClick={onClick} pageList={props.pageList} />;
};

function mapStateToProps(state: RootState): StartProps {
    const { pageList } = state;
    return { pageList };
}

export default connect<StartProps, StartDispatchProps, StartOwnProps, RootState>(
    mapStateToProps
)(Start);
