import * as React from "react";

export interface PopupProps {
    visible: boolean;
    onOutsideClick: () => void;
}

export const Popup: React.SFC<PopupProps> = (props) => {

    const onClick = (e: any) => {
        if (!e.target.className.startsWith("popup")) {
            return;
        }

        props.onOutsideClick();
    };

    return (
        <div onClick={onClick} className={`popup ${props.visible ? "" : "hidden"}`}>
            <section>{props.children}</section>
        </div>);
};
