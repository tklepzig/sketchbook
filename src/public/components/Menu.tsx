import * as React from "react";
import Popup from "./Popup";

export interface MenuProps {
}

export default class Menu extends React.Component<MenuProps, any> {
    public render() {
        return (
            <div className="menu">
                <button className="btn-pen stroke-width m black" />
                <Popup>
                    <button>Red</button>
                </Popup>
            </div>);
    }
}
