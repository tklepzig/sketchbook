import * as React from "react";
import { Point } from "../../shared/models";

export interface PopupProps {
    visible: boolean;
    noDark?: boolean;
    position?: Point;
    onOutsideClick: () => void;
}

export const Popup: React.SFC<PopupProps> = (props) => {
    const onClick = (e: any) => {
        if (!e.target.className.startsWith("popup")) {
            return;
        }

        props.onOutsideClick();
    };
    const style: React.CSSProperties | undefined = props.position
        ? {
            position: "absolute",
            left: props.position.x,
            top: props.position.y
        }
        : undefined;

    return (
        <div
            onClick={onClick}
            className={`popup${props.visible ? "" : " hidden"}${props.noDark ? " no-dark" : ""}`}
        >
            <section style={style}>{props.children}</section>
        </div>);
};
