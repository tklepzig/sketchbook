import * as React from "react";

interface MenuProps {
    onAddPage: () => void;
}

export const Menu: React.SFC<MenuProps> = (props) => {

    return (
        <div className="menu">
        <img src="assets/logo.png" />
            <header>Sketchbook</header>
            <div style={{ flex: 1 }} />
            <button onClick={props.onAddPage}>Add Page</button>
        </div>);
};
