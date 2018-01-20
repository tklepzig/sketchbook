import { Button } from "@components/Button";
import * as React from "react";

export interface StrokeWidthButtonProps {
    color: string;
    strokeWidth: string;
    onClick: (strokeWidth: string) => void;
}

export const StrokeWidthButton: React.SFC<StrokeWidthButtonProps> = (props) => {
    const onClick = () => props.onClick(props.strokeWidth);
    return <Button className={`btn-pen ${props.color} ${props.strokeWidth}`} onClick={onClick} />;
};
