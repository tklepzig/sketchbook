import { Button } from "@components/Button";
import { Popup } from "@components/Popup";
import * as React from "react";
import { Point } from "../../../../shared/models";

export interface PageButtonProps {
    pageNumber: number;
    onClick: (pageNumber: number) => void;
    onDeletePage: (pageNumber: number) => void;
}

interface PageButtonState {
    popupVisible: boolean;
    popupPosition: Point;
}
export class PageButton extends React.Component<PageButtonProps, PageButtonState> {
    constructor(props: PageButtonProps) {
        super(props);
        this.onClick = this.onClick.bind(this);
        this.onDeleteClick = this.onDeleteClick.bind(this);
        this.openPopup = this.openPopup.bind(this);
        this.closePopup = this.closePopup.bind(this);

        this.state = { popupVisible: false, popupPosition: { x: 0, y: 0 } };
    }
    public render() {
        return (
            <>
                <div className="tile-page">
                    <Button className="open" onClick={this.onClick}>{`Page ${this.props.pageNumber}`}</Button>
                    <Button className="more" onClick={this.openPopup} />
                </div>
                <Popup
                    position={this.state.popupPosition}
                    noDark
                    visible={this.state.popupVisible}
                    onOutsideClick={this.closePopup}
                >
                    <div className="list">
                        <Button>Edit Name</Button>
                        <Button onClick={this.onDeleteClick}>Delete</Button>
                    </div>
                </Popup>
            </>);
    }

    private onClick() {
        this.props.onClick(this.props.pageNumber);
    }

    private onDeleteClick() {
        this.props.onDeletePage(this.props.pageNumber);
        this.setState({ popupVisible: false });
    }

    private openPopup(e: React.MouseEvent<HTMLButtonElement>) {
        const { left: x, top: y } = (e.target as HTMLElement).getBoundingClientRect();
        this.setState({ popupVisible: true, popupPosition: { x, y } });
    }

    private closePopup() {
        this.setState({ popupVisible: false });
    }
}
