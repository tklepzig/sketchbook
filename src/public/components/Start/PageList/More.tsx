import { Button } from "@components/Button";
import { Popup } from "@components/Popup";
import { Page, Point } from "@shared/models";
import * as React from "react";
import { bind } from "react.ex";

export interface MoreProps {
    page: Page;
    onDeletePage: (pageNumber: number) => void;
    onSetPageName: (pageNumber: number, name: string) => void;
}

export interface MoreState {
    popupPageNameVisible: boolean;
    popupMenuVisible: boolean;
    popupMenuPosition: Point;
    pageName: string;
}

export default class More extends React.Component<MoreProps, MoreState> {
    constructor(props: MoreProps) {
        super(props);

        this.state = {
            popupPageNameVisible: false,
            popupMenuVisible: false,
            popupMenuPosition: { x: 0, y: 0 },
            pageName: props.page.name
        };
    }

    public componentWillReceiveProps(newProps: MoreProps) {
        this.setState({ pageName: newProps.page.name });
    }
    public render() {
        return (
            <>
                <Button className="more" onClick={this.openPopupMenu} />
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
                    <input value={this.state.pageName} onChange={this.updatePageName} />
                    <button onClick={this.savePageName}>Save</button>
                </Popup>
            </>);
    }
    @bind
    private onDeleteClick() {
        this.props.onDeletePage(this.props.page.pageNumber);
        this.setState({ popupMenuVisible: false });
    }

    @bind
    private openPopupMenu(e: React.MouseEvent<HTMLButtonElement>) {
        const { left: x, top: y } = (e.target as HTMLElement).getBoundingClientRect();
        this.setState({ popupMenuVisible: true, popupMenuPosition: { x, y } });
    }
    @bind
    private closePopupMenu() {
        this.setState({ popupMenuVisible: false });
    }

    @bind
    private openPopupPageName() {
        this.setState({ popupPageNameVisible: true });
    }
    @bind
    private closePopupPageName() {
        this.setState({ popupMenuVisible: false, popupPageNameVisible: false });
    }

    @bind
    private updatePageName(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ pageName: e.target.value });
    }

    @bind
    private savePageName() {
        this.props.onSetPageName(this.props.page.pageNumber, this.state.pageName);
        this.closePopupPageName();
    }
}
