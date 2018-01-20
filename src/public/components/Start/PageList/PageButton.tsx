import { Button } from "@components/Button";
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
            <Button className="open" onClick={onClick}>{`Page ${props.pageNumber}`}</Button>
            <Button title="Delete Page" className="delete" onClick={onDeleteClick} />
        </div>);
};
