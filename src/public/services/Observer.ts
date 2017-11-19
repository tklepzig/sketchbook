class Observer {
    private subscribers: Map<string, Array<((data: any) => void)>>;

    constructor() {
        this.subscribers = new Map();
    }

    public publish(event: string, data: any) {
        if (this.subscribers.has(event)) {
            this.subscribers.get(event).forEach((callback) => callback(data));
        }
    }

    public subscribe(event: string, callback: (data: any) => void) {
        if (!this.subscribers.has(event)) {
            this.subscribers.set(event, []);
        }

        this.subscribers.get(event).push(callback);
    }
}

export default new Observer();
