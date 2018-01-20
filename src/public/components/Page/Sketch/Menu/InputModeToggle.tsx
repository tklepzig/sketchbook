import { Button } from "@components/Button";
import { InputMode } from "@shared/models";
import * as React from "react";

export interface InputModeToggleProps {
    inputMode: InputMode;
    inputModeChanged: (inputMode: InputMode) => void;
}

export interface InputModeToggleState {
    inputMode: InputMode;
}

export class InputModeToggle extends React.Component<InputModeToggleProps, InputModeToggleState> {
    constructor(props: InputModeToggleProps) {
        super(props);
        this.state = { inputMode: props.inputMode };
        this.onClick = this.onClick.bind(this);
    }

    public render() {
        return (
            <Button onClick={this.onClick} className={`inputModeToggle ${this.state.inputMode}`}>
                <div className="pen">Pen</div>
                <div className="text">Text</div>
                <div className="btn" />
            </Button>);
    }

    private onClick() {
        this.setState({
            inputMode: this.state.inputMode === "pen" ? "text" : "pen"
        },
            () => this.props.inputModeChanged(this.state.inputMode));
    }
}
