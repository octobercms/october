/**
 * Guarantees a minimum time for executing an operation.
 */
export class TimeoutPromise {
    constructor() {
        this.startTime = new Date();
    }

    make(data) {
        const timeElapsed = new Date() - this.startTime;
        const remainingTime = Math.max(0, 300 - timeElapsed);

        return new Promise((resolve) => {
            setTimeout(function() {
                resolve(data);
            }, remainingTime);
        });
    }
}
