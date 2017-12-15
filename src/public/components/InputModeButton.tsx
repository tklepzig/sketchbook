import * as React from "react";
import { InputMode } from "../models/RootState";

export interface InputModeButtonProps {
    inputMode: InputMode;
    onClick: (inputMode: InputMode) => void;
}

export const InputModeButton: React.SFC<InputModeButtonProps> = (props) => {
    const onClick = () => props.onClick(props.inputMode);
    return <button onClick={onClick}>{props.inputMode}</button>;
};
