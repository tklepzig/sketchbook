import { Button } from "@components/Button";
import More from "@components/Start/PageList/More";
import { RootState } from "@models/RootState";
import { Page } from "@shared/models";
import { deletePage, setPageName } from "actions";
import * as React from "react";
import { connect, Dispatch } from "react-redux";

interface PageButtonOwnProps {
    page: Page;
    onClick: (pageNumber: number) => void;
}

interface PageButtonDispatchProps {
    onDeletePage: (pageNumber: number) => void;
    onSetPageName: (pageNumber: number, name: string) => void;
}

const PageButton: React.SFC<PageButtonOwnProps & PageButtonDispatchProps> = (props) => {
    const onClick = () => props.onClick(props.page.pageNumber);
    const onDeletePageClick = (page: Page) => {
        const msg = `Deleting ${page.name || `Page ${page.pageNumber}`}, this operation is irreversible, are you sure?`;
        if (confirm(msg)) {
            props.onDeletePage(page.pageNumber);
        }
    };
    const name = props.page.name || `Page ${props.page.pageNumber}`;

    return (
        <>
            <div className="tile-page">
                <Button className="open" onClick={onClick}>{name}</Button>
                <More page={props.page} onSetPageName={props.onSetPageName} onDeletePage={onDeletePageClick} />
            </div>
        </>);
};

function mapDispatchToProps(dispatch: Dispatch<RootState>) {
    return {
        onSetPageName: (pageNumber: number, name: string) =>
            dispatch(setPageName(pageNumber, name)),
        onDeletePage: (pageNumber: number) =>
            dispatch(deletePage(pageNumber))
    };
}

export default connect<{}, PageButtonDispatchProps, PageButtonOwnProps, RootState>(
    undefined,
    mapDispatchToProps
)(PageButton);
