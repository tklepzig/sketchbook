import * as React from "react";

export interface MenuProps {
}

export default class Menu extends React.Component<MenuProps, any> {
    public render() {
        return (
            <div className="menu">
                <button className="btn-pen color black" />
                <button className="btn-pen stroke-width m black" />
            </div>);
    }
}
