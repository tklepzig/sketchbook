// from https://github.com/NoHomey/bind-decorator/blob/master/src/index.ts
export function bind(
    target: object,
    propertyKey: string,
    descriptor: PropertyDescriptor): PropertyDescriptor | void {
    if (!descriptor || (typeof descriptor.value !== "function")) {
        throw new TypeError(`Only methods can be decorated with @bind. <${propertyKey}> is not a method!`);
    }

    return {
        configurable: true,
        get(this: any) {
            const bound = descriptor.value.bind(this);
            Object.defineProperty(this, propertyKey, {
                value: bound,
                configurable: true,
                writable: true
            });
            return bound;
        }
    };
}
