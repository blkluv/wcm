import type { ApiResult } from "../types/api";
import { generateFetchExEvent } from "../types/event";

export async function doFetch<T>(url: string, defValue: T, init?: RequestInit, globalLoading: boolean = false /* loadingKey: string */) {
    try {
        if (globalLoading) {
            // TODO
        }

        const resp = await fetch(url, init);

        if (globalLoading) {
            // TODO
        }

        if (resp.headers.get('content-type')?.startsWith('application/json')) {
            const json = await resp.json();
            if (!json) {
                return defValue;
            }

            const result = json as unknown as ApiResult;
            if (result.status === 'success') {
                if (typeof defValue === 'boolean') {
                    return true as T;
                }

                if (typeof defValue === 'object') {
                    return json['value'] as T;
                }
            } else {
                window.dispatchEvent(generateFetchExEvent(result.message!));
            }
        } else {
            window.dispatchEvent(generateFetchExEvent(`${resp.status}`));
        }
    } catch (error) {
        window.dispatchEvent(generateFetchExEvent((error as Error).message));
    }

    return defValue;
}