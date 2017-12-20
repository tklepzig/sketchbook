import * as React from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import { Page, RootState } from "../models/RootState";
import fullscreen from "../services/Fullscreen";
import { InputModeToggle } from "./InputModeToggle";
import { PageList } from "./PageList";
import Splash from "./Splash";

interface StartProps {
    pages: Page[];
}

export interface StartOwnProps extends RouteComponentProps<any> {
}

const Start: React.SFC<StartProps & StartOwnProps> = (props) => {
    const onClick = (path: string) => {
        props.history.push(path);
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
