import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { devToolsEnhancer } from "redux-devtools-extension";
import "./app.scss";
import Start from "./components/Start";
import { rootReducer } from "./rootReducer";

const store = createStore(rootReducer
    // , devToolsEnhancer({})
);

ReactDOM.render(
    <Provider store={store}>
        <Start />
    </Provider>,
    document.getElementById("root"));
