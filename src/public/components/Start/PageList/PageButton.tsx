import * as React from "react";

export interface PageButtonProps {
    id: string;
    onClick: (id: string) => void;
}

export const PageButton: React.SFC<PageButtonProps> = (props) => {
    const onClick = () => props.onClick(props.id);
    return <button onClick={onClick}>{`Page ${props.id}`}</button>;
};
