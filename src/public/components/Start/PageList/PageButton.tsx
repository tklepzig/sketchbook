import * as React from "react";

export interface PageButtonProps {
    pageNumber: number;
    onClick: (pageNumber: number) => void;
}

export const PageButton: React.SFC<PageButtonProps> = (props) => {
    const onClick = () => props.onClick(props.pageNumber);
    return <button onClick={onClick}>{`Page ${props.pageNumber}`}</button>;
};
