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
        if (this.isFullscreenSupported) {
            this.callBrowserSpecificFunction([
                element.requestFullscreen,
                element.webkitRequestFullscreen,
                element.msRequestFullscreen,
                element.mozRequestFullScreen
            ]);
        }
    }

    public exit() {
        if (this.isFullscreenSupported) {
            const document: any = window.document;

            this.callBrowserSpecificFunction([
                document.exitFullscreen,
                document.webkitExitFullscreen,
                document.msExitFullscreen,
                document.mozCancelFullScreen
            ]);
        }
    }

    public toggle(element: any) {
        if (!this.isFullscreen()) {
            this.request(element);
        } else {
            this.exit();
        }
    }

    private callBrowserSpecificFunction(funcs: any[]) {
        for (const func of funcs) {
            if (func) {
                func();
                break;
            }
        }
    }
}

export default new Fullscreen();
