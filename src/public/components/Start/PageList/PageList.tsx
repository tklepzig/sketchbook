import { PageButton } from "@components/Start/PageList/PageButton";
import { Page } from "@shared/models";
import * as React from "react";
import { RouteComponentProps } from "react-router";
import { NavLink } from "react-router-dom";

interface PageListProps {
    pageList: Array<{ id: string }>;
    onClick: (page: string) => void;
}

export const PageList: React.SFC<PageListProps> = (props) => {
    const onClick = (id: string) => {
        props.onClick(id);
    };

    const pageList = props.pageList.map((page) => (
        <li key={page.id}>
            <PageButton id={page.id} onClick={onClick} />
        </li>));
    return <ul>{pageList}</ul>;
};
