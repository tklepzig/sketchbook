import { FontSize } from "@shared/RootState";
import * as React from "react";

export interface FontSizeButtonProps {
    fontSize: FontSize;
    onClick: (fontSize: FontSize) => void;
}

export const FontSizeButton: React.SFC<FontSizeButtonProps> = (props) => {
    const onClick = () => props.onClick(props.fontSize);
    return <button className={`btn-font-size ${props.fontSize}`} onClick={onClick}>a</button>;
};
