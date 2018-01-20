import vibration from "@services/Vibration";
import * as React from "react";

export interface ButtonProps
    extends React.AllHTMLAttributes<HTMLButtonElement>,
    React.ClassAttributes<HTMLButtonElement> {
}

export const Button: React.SFC<ButtonProps> = (props) => {
    const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.persist();
        vibration.vibrate(20);

        setTimeout(() => {
            if (props.onClick) {
                props.onClick(e);
            }
        }, 0);
    };
    return <button {...props} onClick={onClick}>{props.children}</button>;
};
