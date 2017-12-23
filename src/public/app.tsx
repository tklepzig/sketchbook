import App from "@components/App";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
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

ReactDOM.render((
    <Provider store={store}>
        <App />
    </Provider>), document.getElementById("root"));
