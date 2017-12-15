import * as React from "react";
import { NavLink } from "react-router-dom";
import { Page } from "../models/RootState";

interface PageListProps {
    pages: Page[];
}

export const PageList: React.SFC<PageListProps> = (props) => {
    const pageList = props.pages.map((page) => (
        <li key={page.id}>
            <NavLink to={`/page/${page.id}`}>Page {page.id}</NavLink>
        </li>));
    return (
        <ul>{pageList}</ul>
    );
};
