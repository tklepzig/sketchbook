import * as React from "react";
import observer from "../services/Observer";

export interface PopupState {
    visible: boolean;
}

export default class Popup extends React.Component<any, PopupState> {
    constructor() {
        super();
        this.overlayClick = this.overlayClick.bind(this);
        observer.subscribe("popupVisible", (visible) => this.setState({ visible }));
        this.state = { visible: false };
    }
    public render() {
        return (
            <div onClick={this.overlayClick} className={`popup ${this.state.visible ? "" : "hidden"}`}>
                <section>{this.props.children}</section>
            </div>
        );
    }

    private overlayClick() {
        observer.publish("popupVisible", false);
    }
}
