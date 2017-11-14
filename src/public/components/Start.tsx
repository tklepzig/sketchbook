import * as React from "react";
import Canvas from "./Canvas";

export interface StartState {
    ready: boolean;
}

export default class Start extends React.Component<any, StartState> {
    constructor() {
        super();
        this.state = { ready: false };
    }

    public componentWillMount() {
        setTimeout(() => this.setState({ ready: true }), 1500);
    }

    public render() {
        return (
            <div>
                <div id="loading" className={this.state.ready ? "hidden" : ""} />
                <Canvas />
            </div>);
    }
}
