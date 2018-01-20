import * as React from "react";
import { Point } from "../../shared/models";

interface PopupProps {
    visible: boolean;
    noDark?: boolean;
    position?: Point;
    onOutsideClick: () => void;
}

interface PopupState {
    leftOffset: number;
    topOffset: number;
}

export class Popup extends React.Component<PopupProps, PopupState> {

    private section: HTMLElement | null = null;

    constructor(props: PopupProps) {
        super(props);
        this.onClick = this.onClick.bind(this);

        this.state = { leftOffset: 0, topOffset: 0 };
    }
    public componentDidUpdate() {
        if (!this.section) {
            return;
        }

        const { right, bottom } = this.section.getBoundingClientRect();

        if (right > window.innerWidth) {
            this.setState({ leftOffset: right - window.innerWidth + 4 });
        }
        if (bottom > window.innerHeight) {
            this.setState({ topOffset: bottom - window.innerHeight + 4 });
        }
    }

    public render() {
        const style: React.CSSProperties | undefined = this.props.position
            ? {
                position: "absolute",
                left: this.props.position.x - this.state.leftOffset,
                top: this.props.position.y - this.state.topOffset
            }
            : undefined;

        return (
            <div
                onClick={this.onClick}
                className={`popup${this.props.visible ? "" : " hidden"}${this.props.noDark ? " no-dark" : ""}`}
            >
                <section ref={(s) => this.section = s} style={style}>{this.props.children}</section>
            </div>);
    }

    private onClick(e: any) {
        if (!e.target.className.startsWith("popup")) {
            return;
        }

        this.props.onOutsideClick();
    }
}
