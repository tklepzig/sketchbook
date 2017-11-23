import * as React from "react";
import PenChooser from "./PenChooser/PenChooser";

// TODO: all props of PenChhoser have to set by redux
export const Menu: React.SFC = () => (
    <div className="menu">
        <PenChooser />
    </div>);
