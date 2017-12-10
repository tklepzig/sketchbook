import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { createStore } from "redux";
import { devToolsEnhancer } from "redux-devtools-extension";
import "./app.scss";
import Page from "./components/Page";
import Start from "./components/Start";
import { rootReducer } from "./rootReducer";

const store = createStore(rootReducer
    // , devToolsEnhancer({})
);

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={Start} />
                <Route exact path="/page/:id" component={Page} />
            </Switch>
        </BrowserRouter>
    </Provider>,
    document.getElementById("root"));
