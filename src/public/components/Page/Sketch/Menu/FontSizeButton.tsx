import { Button } from "@components/Button";
import { FontSize } from "@shared/models";
import * as React from "react";

export interface FontSizeButtonProps {
    fontSize: FontSize;
    onClick: (fontSize: FontSize) => void;
}

export const FontSizeButton: React.SFC<FontSizeButtonProps> = (props) => {
    const onClick = () => props.onClick(props.fontSize);
    return <Button className={`btn-font-size ${props.fontSize}`} onClick={onClick}>a</Button>;
};
