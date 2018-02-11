import { Button } from "@components/Button";
import { Popup } from "@components/Popup";
import { Page, Point } from "@shared/models";
import * as React from "react";
import { bind } from "react.ex";

export interface MoreProps {
    page: Page;
    onDeletePage: (page: Page) => void;
    onSetPageName: (pageNumber: number, name: string) => void;
}

export interface MoreState {
    popupPageNameVisible: boolean;
    popupMenuVisible: boolean;
    popupMenuPosition: Point;
    pageName: string;
}

export default class More extends React.Component<MoreProps, MoreState> {
    private pageNameInput: HTMLInputElement | null = null;

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
                    <header>Set Page Name</header>
                    <form>
                        <input
                            ref={(i) => this.pageNameInput = i}
                            value={this.state.pageName}
                            onChange={this.updatePageName}
                        />
                        <button type="submit" onClick={this.savePageName}>Save</button>
                    </form>
                </Popup>
            </>);
    }
    @bind
    private onDeleteClick() {
        this.props.onDeletePage(this.props.page);
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
        this.setState({ popupMenuVisible: false, popupPageNameVisible: true }, () => {
            if (this.pageNameInput) {
                this.pageNameInput.focus();
                this.pageNameInput.select();
            }
        });
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
    private savePageName(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        this.props.onSetPageName(this.props.page.pageNumber, this.state.pageName);
        this.closePopupPageName();
    }
}
