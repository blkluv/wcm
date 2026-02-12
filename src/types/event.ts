import { customEventTypes } from "./enums";

export const EventTypes = {
    globalError: 'globalError',
    globalLoading: 'globalLoading',
} as const;

export function generateLocationSelectedEvent(code: string) {
    return new CustomEvent(customEventTypes.locationSelected, { detail: { code } });
}

export function generateShelfSelectedEvent(code: string) {
    return new CustomEvent(customEventTypes.shelfSelected, { detail: { code } });
}