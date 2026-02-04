export function getSourceLocation({ startAreaCode, startLocationCode }: { startAreaCode: string | null; startLocationCode: string | null }) {
    return [startAreaCode, startLocationCode].filter(x => x != null).join('/');
}

export function getTargetLocation({ endAreaCode, endLocationCode }: { endAreaCode: string; endLocationCode: string | null }) {
    return [endAreaCode, endLocationCode].filter(x => x != null).join('/');
}

export function getLocations({ startLocationCode, endLocationCode }: { startLocationCode: string | null; endLocationCode: string | null }) {
    return [startLocationCode, endLocationCode].filter(x => x != null).join('/');
}

export function filterTake<T>(array: T[], predicate: (item: T) => boolean, qty: number) {
    const result: T[] = [];
    for (const item of array) {
        if (predicate(item)) {
            result.push(item);
            if (result.length === qty) {
                break;
            }
        }
    }
    return result;
}