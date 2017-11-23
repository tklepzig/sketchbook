import * as React from "react";

export interface StrokeWidthButtonProps {
    strokeWidth: string;
    onClick: (strokeWidth: string) => void;
}

export const StrokeWidthButton: React.SFC<StrokeWidthButtonProps> = (props) => {
    const onClick = () => props.onClick(props.strokeWidth);
    return <button onClick={onClick}>{props.strokeWidth}</button>;
};
