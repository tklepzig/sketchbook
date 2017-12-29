import { Page } from "@shared/models";
import * as React from "react";
import { RouteComponentProps } from "react-router";
import { NavLink } from "react-router-dom";

interface PageListProps {
    pageList: Array<{ id: string }>;
    onClick: (page: string) => void;
}

export const PageList: React.SFC<PageListProps> = (props) => {
    const onClick = () => {
        props.onClick("1");
    };

    const pageList = props.pageList.map((page) => (
        <li key={page.id}>
            <button onClick={onClick}>Page {page.id}</button>
        </li>));
    return <ul>{pageList}</ul>;
};
