import vibration from "@services/Vibration";
import * as React from "react";

export interface ButtonProps
    extends React.AllHTMLAttributes<HTMLButtonElement>,
    React.ClassAttributes<HTMLButtonElement> {
}

export const Button: React.SFC<ButtonProps> = (props) => {
    const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        vibration.vibrate(20);
        if (props.onClick) {
            props.onClick(e);
        }
    };
    return <button {...props} onClick={onClick}>{props.children}</button>;
};
