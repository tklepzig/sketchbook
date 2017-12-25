import Page from "@components/Page/Page";
import Splash from "@components/Splash";
import Start from "@components/Start/Start";
import { RootState } from "@models/RootState";
import * as React from "react";
import { connect } from "react-redux";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Dispatch } from "redux";
import { clearError } from "../actions";

interface AppProps {
    error: string;
}

interface AppDispatchProps {
    onDismissError: () => void;
}

const App: React.SFC<AppProps & AppDispatchProps> = (props) => {
    const errorHeadline = props.error ? (
        <h1 style={{ position: "fixed", zIndex: 100000 }}>{props.error}
            <button onClick={props.onDismissError}>Dismiss</button></h1>) : null;

    return (
        <React.Fragment>
            {errorHeadline}
            <Splash />
            <BrowserRouter>
                <Switch>
                    <Route exact path="/" component={Start} />
                    <Route exact path="/page/:id" component={Page} />
                </Switch>
            </BrowserRouter>
        </React.Fragment>
    );
};

function mapStateToProps(state: RootState): AppProps {
    const { error } = state;
    return { error };
}

function mapDispatchToProps(dispatch: Dispatch<RootState>) {
    return {
        onDismissError: () => dispatch(clearError())
    };
}

export default connect<AppProps, AppDispatchProps, {}, RootState>(
    mapStateToProps,
    mapDispatchToProps
)(App);