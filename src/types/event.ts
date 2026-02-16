import { customEventTypes } from "./enums";

export function generateFetchExEvent(message: string) {
    return new CustomEvent(customEventTypes.fetchExCaught, { detail: { message } });
}

export function generateLocationSelectedEvent(code: string) {
    return new CustomEvent(customEventTypes.locationSelected, { detail: { code } });
}

export function generateShelfSelectedEvent(code: string) {
    return new CustomEvent(customEventTypes.shelfSelected, { detail: { code } });
}