import * as React from "react";

export interface ColorButtonProps {
    color: string;
    onClick: (color: string) => void;
}

export const ColorButton: React.SFC<ColorButtonProps> = (props) => {
    const onClick = () => props.onClick(props.color);
    return <button className={`btn-pen ${props.color}`} onClick={onClick} />;
};
