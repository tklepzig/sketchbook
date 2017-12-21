import * as React from "react";
import { RouteComponentProps } from "react-router";
import { NavLink } from "react-router-dom";
import { Page } from "../models/RootState";

interface PageListProps {
    pages: Page[];
    onClick: (page: string) => void;
}

export const PageList: React.SFC<PageListProps> = (props) => {
    const onClick = () => {
        props.onClick("/page/1");
    };

    const pageList = props.pages.map((page) => (
        <li key={page.id}>
            <button onClick={onClick}>Page {page.id}</button>
        </li>));
    return <ul>{pageList}</ul>;
};
