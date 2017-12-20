import * as React from "react";

export interface SplashState {
    ready: boolean;
}

export default class Splash extends React.Component<any, SplashState> {
    private timeoutId: any;

    constructor(props: any) {
        super(props);
        this.state = { ready: false };
    }

    public componentWillMount() {
        this.timeoutId = setTimeout(() => this.setState({ ready: true }), 1500);
    }

    public componentWillUnmount() {
        clearTimeout(this.timeoutId);
    }

    public render() {
        return <div id="loading" className={this.state.ready ? "hidden" : ""} />;
    }
}
