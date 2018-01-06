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
            <button title="Add New Page" className="btn-add-page" onClick={props.onAddPage} />
        </div>);
};
