import vibration from "@services/Vibration";
import * as React from "react";

export interface ButtonProps {
    onClick: (color: string) => void;
    title?: string;
    className?: string;
}

export const Button: React.SFC<ButtonProps> = (props) => {
    const onClick = (e: any) => {
        vibration.vibrate(20);
        setTimeout(() => props.onClick(e), 0);
    };
    return <button title={props.title} className={props.className} onClick={onClick}>{props.children}</button>;
};
