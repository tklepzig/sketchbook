import * as React from "react";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import { Page, RootState } from "../models/RootState";
import Splash from "./Splash";

export interface StartProps {
    pages: Page[];
}

const Start: React.SFC<StartProps> = (props) => {
    const pageList = props.pages.map((page) => (
        <li key={page.id}>
            <NavLink to={`/page/${page.id}`}>Page {page.id}</NavLink>
        </li>));
    return (
        <React.Fragment>
            <Splash />
            <ul>
                {pageList}
            </ul>
        </React.Fragment>
    );
};

function mapStateToProps(state: RootState): StartProps {
    const { pages } = state;
    return { pages };
}

export default connect<StartProps, {}, {}, RootState>(
    mapStateToProps
)(Start);
