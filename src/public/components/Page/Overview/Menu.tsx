import { Button } from "@components/Button";
import * as React from "react";

interface MenuProps {
    onNavigateBack: () => void;
    title: string;
}

export const Menu: React.SFC<MenuProps> = (props) => {

    return (
        <div className="menu">
            <Button className="btn-back" onClick={props.onNavigateBack} />
            <header>{props.title}</header>
            <div style={{ flex: 1 }} />
        </div>);
};
