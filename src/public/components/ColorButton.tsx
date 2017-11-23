import * as React from "react";

export interface ColorButtonProps {
    color: string;
    onClick: (color: string) => void;
}

export const ColorButton: React.SFC<ColorButtonProps> = (props) => {
    const onClick = () => props.onClick(props.color);
    return (<button onClick={onClick}>{props.color}</button>);
};
