import * as React from "react";
import { Point } from "../../shared/models";

interface PopupProps {
    visible: boolean;
    noDark?: boolean;
    position?: Point;
    onOutsideClick: () => void;
}

interface PopupState {
    position?: Point;
}

export class Popup extends React.Component<PopupProps, PopupState> {

    private section: HTMLElement | null = null;

    constructor(props: PopupProps) {
        super(props);
        this.onClick = this.onClick.bind(this);

        this.state = {};
    }

    public componentDidUpdate() {
        if (!this.state.position || !this.section) {
            return;
        }

        const { right, bottom } = this.section.getBoundingClientRect();
        if (right > window.innerWidth) {
            const xOffset = right - window.innerWidth + 4;
            this.setState({ position: { ...this.state.position, x: this.state.position.x - xOffset } });
        }
        if (bottom > window.innerHeight) {
            const yOffset = bottom - window.innerHeight + 4;
            this.setState({ position: { ...this.state.position, y: this.state.position.y - yOffset } });
        }
    }

    public componentWillReceiveProps(newProps: PopupProps) {
        this.setState({ position: newProps.position });
    }

    public render() {
        const style: React.CSSProperties | undefined = this.state.position
            ? {
                position: "absolute",
                left: this.state.position.x,
                top: this.state.position.y
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
