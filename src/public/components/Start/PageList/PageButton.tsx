import { Button } from "@components/Button";
import { Popup } from "@components/Popup";
import PageName from "@components/Start/PageList/PageName";
import { Page, Point } from "@shared/models";
import * as React from "react";

export interface PageButtonProps {
    page: Page;
    onClick: (pageNumber: number) => void;
    onDeletePage: (pageNumber: number) => void;
}

interface PageButtonState {
    popupPageNameVisible: boolean;
    popupMenuVisible: boolean;
    popupMenuPosition: Point;
}
export class PageButton extends React.Component<PageButtonProps, PageButtonState> {
    constructor(props: PageButtonProps) {
        super(props);
        this.onClick = this.onClick.bind(this);
        this.onDeleteClick = this.onDeleteClick.bind(this);
        this.openPopupMenu = this.openPopupMenu.bind(this);
        this.closePopupMenu = this.closePopupMenu.bind(this);

        this.openPopupPageName = this.openPopupPageName.bind(this);
        this.closePopupPageName = this.closePopupPageName.bind(this);

        this.state = { popupPageNameVisible: false, popupMenuVisible: false, popupMenuPosition: { x: 0, y: 0 } };
    }
    public render() {
        const name = this.props.page.name || `Page ${this.props.page.pageNumber}`;
        return (
            <>
                <div className="tile-page">
                    <Button className="open" onClick={this.onClick}>{name}</Button>
                    <Button className="more" onClick={this.openPopupMenu} />
                </div>
                <Popup
                    position={this.state.popupMenuPosition}
                    noDark
                    visible={this.state.popupMenuVisible}
                    onOutsideClick={this.closePopupMenu}
                >
                    <div className="list">
                        <Button onClick={this.openPopupPageName}>Set Name</Button>
                        <Button onClick={this.onDeleteClick}>Delete</Button>
                    </div>
                </Popup>
                <Popup visible={this.state.popupPageNameVisible} onOutsideClick={this.closePopupPageName}>
                    <PageName saved={this.closePopupPageName} page={this.props.page} />
                </Popup>
            </>);
    }

    private onClick() {
        this.props.onClick(this.props.page.pageNumber);
    }

    private onDeleteClick() {
        this.props.onDeletePage(this.props.page.pageNumber);
        this.setState({ popupMenuVisible: false });
    }

    private openPopupMenu(e: React.MouseEvent<HTMLButtonElement>) {
        const { left: x, top: y } = (e.target as HTMLElement).getBoundingClientRect();
        this.setState({ popupMenuVisible: true, popupMenuPosition: { x, y } });
    }
    private closePopupMenu() {
        this.setState({ popupMenuVisible: false });
    }

    private openPopupPageName() {
        this.setState({ popupPageNameVisible: true });
    }
    private closePopupPageName() {
        this.setState({ popupMenuVisible: false, popupPageNameVisible: false });
    }
}
