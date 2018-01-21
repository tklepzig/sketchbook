import { RootState } from "@models/RootState";
import { Page } from "@shared/models";
import { setPageName } from "actions";
import * as React from "react";
import { connect, Dispatch } from "react-redux";

interface PageNameOwnProps {
    page: Page;
    saved: () => void;
}

interface PageNameDispatchProps {
    onSetPageName: (pageNumber: number, name: string) => void;
}

interface PageNameState {
    name: string;
}

class PageName extends React.Component<PageNameOwnProps & PageNameDispatchProps, PageNameState> {
    constructor(props: PageNameOwnProps & PageNameDispatchProps) {
        super(props);
        this.updateName = this.updateName.bind(this);
        this.save = this.save.bind(this);

        this.state = { name: props.page.name };
    }

    public componentWillReceiveProps(newProps: PageNameOwnProps) {
        this.setState({ name: newProps.page.name });
    }

    public render() {
        return (
            <>
                <input value={this.state.name} onChange={this.updateName} />
                <button onClick={this.save}>Save</button>
            </>);
    }
    private updateName(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ name: e.target.value });
    }

    private save() {
        this.props.onSetPageName(this.props.page.pageNumber, this.state.name);
        this.props.saved();
    }
}

function mapDispatchToProps(dispatch: Dispatch<RootState>) {
    return {
        onSetPageName: (pageNumber: number, name: string) =>
            dispatch(setPageName(pageNumber, name))
    };
}

export default connect<{}, PageNameDispatchProps, PageNameOwnProps, RootState>(
    undefined,
    mapDispatchToProps
)(PageName);
