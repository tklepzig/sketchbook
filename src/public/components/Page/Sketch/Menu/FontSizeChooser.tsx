import { Button } from "@components/Button";
import { FontSizeButton } from "@components/Page/Sketch/Menu/FontSizeButton";
import { Popup } from "@components/Popup";
import { RootState } from "@models/RootState";
import { FontSize } from "@shared/models";
import { setFontSize, SetFontSizeAction } from "actions";
import * as React from "react";
import { connect, Dispatch } from "react-redux";

export interface FontSizeChooserProps {
    fontSize: FontSize;
    onFontSizeSelected: (fontSize: FontSize) => void;
}

interface FontSizeChooserState {
    popupVisible: boolean;
}

export class FontSizeChooser
    extends React.Component<FontSizeChooserProps, FontSizeChooserState> {
    constructor(props: FontSizeChooserProps) {
        super(props);
        this.openPopup = this.openPopup.bind(this);
        this.closePopup = this.closePopup.bind(this);
        this.fontSizeSelected = this.fontSizeSelected.bind(this);

        this.state = { popupVisible: false };
    }
    public render() {
        return (
            <>
                <Button className={`btn-font-size ${this.props.fontSize}`} onClick={this.openPopup}>a</Button>
                <Popup visible={this.state.popupVisible} onOutsideClick={this.closePopup}>
                    <header>Font Size</header>
                    <div>
                        <FontSizeButton fontSize="small" onClick={this.fontSizeSelected} />
                        <FontSizeButton fontSize="medium" onClick={this.fontSizeSelected} />
                        <FontSizeButton fontSize="large" onClick={this.fontSizeSelected} />
                    </div>
                </Popup>
            </>
        );
    }

    private fontSizeSelected(fontSize: FontSize) {
        this.closePopup();
        this.props.onFontSizeSelected(fontSize);
    }

    private openPopup() {
        this.setState({ popupVisible: true });
    }

    private closePopup() {
        this.setState({ popupVisible: false });
    }
}
