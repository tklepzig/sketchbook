import * as React from "react";

export interface MenuProps {
}

export default class Menu extends React.Component<MenuProps, any> {
    public render() {
        return (
            <div className="menu">{this.props.children}</div>);
    }
}
