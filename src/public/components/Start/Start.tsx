import { PageList } from "@components/Start/PageList";
import fullscreen from "@services/Fullscreen";
import { Page, RootState } from "@shared/RootState";
import * as React from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";

interface StartProps {
    pages: Page[];
}

export interface StartOwnProps extends RouteComponentProps<any> {
}

const Start: React.SFC<StartProps & StartOwnProps> = (props) => {
    const onClick = (path: string) => {
        props.history.replace(path);
        if ("ontouchstart" in window) {
            fullscreen.request(document.body);
        }
    };
    return <PageList onClick={onClick} pages={props.pages} />;
};

function mapStateToProps(state: RootState): StartProps {
    const { pages } = state;
    return { pages };
}

export default connect<StartProps, {}, {}, RootState>(
    mapStateToProps
)(Start);
