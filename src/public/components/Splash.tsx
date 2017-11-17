import * as React from "react";

export interface SplashState {
    ready: boolean;
}


export default class Splash extends React.Component<any, SplashState> {
    constructor() {
        super();
        this.state = { ready: false };
    }

    public componentWillMount() {
        setTimeout(() => this.setState({ ready: true }), 1500);
    }

    public render() {
        return <div id="loading" className={this.state.ready ? "hidden" : ""} />;
    }
}
