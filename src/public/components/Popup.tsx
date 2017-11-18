import * as React from "react";

export default class Popup extends React.Component {
    public render() {
        return (
            <div className="popup">
                <section>{this.props.children}</section>
            </div>
        );
    }
}
