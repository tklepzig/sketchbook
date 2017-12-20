import * as React from "react";
import { connect } from "react-redux";
import { Page, RootState } from "../models/RootState";
import { InputModeToggle } from "./InputModeToggle";
import { PageList } from "./PageList";
import Splash from "./Splash";

interface StartProps {
    pages: Page[];
}

const Start: React.SFC<StartProps> = (props) => <PageList pages={props.pages} />;

function mapStateToProps(state: RootState): StartProps {
    const { pages } = state;
    return { pages };
}

export default connect<StartProps, {}, {}, RootState>(
    mapStateToProps
)(Start);
