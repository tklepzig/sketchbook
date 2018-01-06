import * as React from "react";

export interface PageButtonProps {
    pageNumber: number;
    onClick: (pageNumber: number) => void;
    onDeletePage: (pageNumber: number) => void;
}

export const PageButton: React.SFC<PageButtonProps> = (props) => {
    const onClick = () => props.onClick(props.pageNumber);
    const onDeleteClick = () => props.onDeletePage(props.pageNumber);
    return (
        <div className="tile-page">
            <button className="open" onClick={onClick}>{`Page ${props.pageNumber}`}</button>
            <button className="delete" onClick={onDeleteClick}>Delete</button>
        </div>);
};
