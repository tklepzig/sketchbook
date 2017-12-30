import { PageButton } from "@components/Start/PageList/PageButton";
import { Page } from "@shared/models";
import * as React from "react";
import { RouteComponentProps } from "react-router";
import { NavLink } from "react-router-dom";

interface PageListProps {
    pageList: Page[];
    onClick: (pageNumber: number) => void;
}

export const PageList: React.SFC<PageListProps> = (props) => {
    const onClick = (pageNumber: number) => {
        props.onClick(pageNumber);
    };

    const pageList = props.pageList.map((page) => (
        <li key={page.pageNumber}>
            <PageButton pageNumber={page.pageNumber} onClick={onClick} />
        </li>));
    return <ul>{pageList}</ul>;
};
