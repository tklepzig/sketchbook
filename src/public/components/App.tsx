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
    ready: boolean;
}

interface AppDispatchProps {
    onDismissError: () => void;
}

const App: React.SFC<AppProps & AppDispatchProps> = (props) => {
    const errorToast = (
        <div className="error-toast">
            <header>{props.error}</header>
            <button onClick={props.onDismissError}>Dismiss</button>
        </div>);

    return (
        <>
        {props.error ? errorToast : null}
        <Splash isVisible={!props.ready} />
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={Start} />
                <Route exact path="/page/:pageNumber" component={Page} />
            </Switch>
        </BrowserRouter>
        </>
    );
};

function mapStateToProps(state: RootState): AppProps {
    const { error, ready } = state;
    return { error, ready };
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
