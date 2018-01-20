class Fullscreen {
    public isFullscreenSupported() {
        const document: any = window.document;

        return document.mozFullScreenEnabled
            || document.fullscreenEnabled
            || document.webkitFullscreenEnabled
            || document.msFullscreenEnabled;
    }
    public isFullscreen() {
        const document: any = window.document;
        const fullScreenElement = document.webkitFullscreenElement
            || document.fullscreenElement
            || document.mozFullScreenElement
            || document.msFullscreenElement;

        return fullScreenElement !== null;
    }

    public request(element: any) {
        if (!this.isFullscreenSupported) {
            return;
        }

        element.requestFullscreen = element.requestFullscreen
            || element.webkitRequestFullscreen
            || element.msRequestFullscreen
            || element.mozRequestFullScreen;

        element.requestFullscreen();
    }

    public exit() {
        if (!this.isFullscreenSupported) {
            return;
        }

        const document: any = window.document;

        document.exitFullscreen = document.exitFullscreen
            || document.webkitExitFullscreen
            || document.msExitFullscreen
            || document.mozCancelFullScreen;

        document.exitFullscreen();
    }

    public toggle(element: any) {
        if (!this.isFullscreen()) {
            this.request(element);
        } else {
            this.exit();
        }
    }
}

export default new Fullscreen();
