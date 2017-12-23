import Page from "@components/Page/Page";
import Splash from "@components/Splash";
import Start from "@components/Start/Start";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunkMiddleware from "redux-thunk";
import { rootReducer } from "rootReducer";
import "./app.scss";

const store = createStore(rootReducer,
    // composeWithDevTools(
    applyMiddleware(thunkMiddleware),
    // ),
);

ReactDOM.render(
    <Provider store={store}>
        <React.Fragment>
            <Splash />
            <BrowserRouter>
                <Switch>
                    <Route exact path="/" component={Start} />
                    <Route exact path="/page/:id" component={Page} />
                </Switch>
            </BrowserRouter>
        </React.Fragment>
    </Provider>,
    document.getElementById("root"));
