import type { Location } from "../types/location";
import { doFetch } from "./helper";

export async function getHiddenLocations(): Promise<Location[]> {
    const url = '/locations.json';
    return await doFetch(url, [], { method: 'get' });
}