import * as React from "react";
import { InputMode } from "../models/RootState";
import FontSizeChooser from "./FontSizeChooser";
import PenChooser from "./PenChooser";

export interface MenuProps {
    inputMode: InputMode;
}

// TODO: redux state handling from pen/fontsize-chooser to menu
export const Menu: React.SFC<MenuProps> = (props) => {
    const pen = props.inputMode === "pen" ? <PenChooser /> : <div>Switch to Pen</div>;
    const text = props.inputMode === "text" ? <FontSizeChooser /> : <div>Switch to Text</div>;
    return (
        <div className="menu">
            {pen}
            {text}
        </div>);
};
