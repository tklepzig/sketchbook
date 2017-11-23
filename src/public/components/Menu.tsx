import * as React from "react";
import PenChooser from "./PenChooser";

// TODO: all props of PenChhoser have to set by redux
export const Menu: React.SFC = () => (
    <div className="menu">
        <PenChooser color="blue" strokeWidth="s" onColorSelected={(color) => { }} onStrokeWidthSelected={(strokeWidth) => { }} onCancel={() => { }} popupVisible={false} onOpen={() => { }} />
    </div>);
