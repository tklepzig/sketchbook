import * as React from "react";
import PenChooser from "./PenChooser";
import Popup from "./Popup";

export interface MenuProps {
}

export default class Menu extends React.Component<MenuProps, any> {

    public render() {
        return (
            <div className="menu">
                <PenChooser />
            </div>);
    }
}
