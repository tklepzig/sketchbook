import * as React from "react";
import { InputMode } from "../models/RootState";
import PenChooser from "./PenChooser";

export interface MenuProps {
    inputMode: InputMode;
}

export const Menu: React.SFC<MenuProps> = (props) => {
    const pen = props.inputMode === "pen" ? <PenChooser /> : <div>Switch to Pen</div>;
    const text = props.inputMode === "text" ? <div>FontSizeChooser</div> : <div>Switch to Text</div>;
    return (
        <div className="menu">
            {pen}
            {text}
        </div>);
};
