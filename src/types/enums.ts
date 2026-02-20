export function getStatusName(status: number, obj: { [key: number]: string }) {
    return Object.hasOwn(obj, status) ? obj[status] : null;
}

export function getTransportTaskStatusName(status: number) {
    return getStatusName(status, transportTaskStatusNames);
}

export function getInventoryStatusName(status: number) {
    return getStatusName(status, inventoryStatusNames);
}

export const EventTypes = {
    globalError: 'globalError',
    globalLoading: 'globalLoading',
} as const;

export const transportTaskStatuses = {
    aborted: -1,
    pending: 0,
    exceptional: 1,
    executing: 2,
    renewable: 3,
    completed: 4
} as const;

const transportTaskStatusNames: { [key: number]: string } = {
    0: 'Pending',
    1: 'Exception',
    2: 'Executing',
    3: 'Renewable',
    4: 'Completed'
};
transportTaskStatusNames[-1] = 'Aborted';

export const inventoryStatuses = {
    qualified: 0
} as const;

const inventoryStatusNames: { [key: number]: string } = {
    0: 'Qualified'
};

export function getYesOrNo(b: boolean) {
    return b ? 'Y' : 'N';
}

export const customEventTypes = {
    fetchExCaught: 'fetchExCaught',
    locationSelected: 'locationSelected',
    shelfSelected: 'shelfSelected'
} as const;