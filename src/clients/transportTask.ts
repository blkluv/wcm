import type { TransportTaskDetailModel } from "../types/transportTask";
import { doFetch } from "./helper";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getTrasnportTaskDetail(_code: string): Promise<TransportTaskDetailModel | null> {
    const url = '/transportTaskDetail.json';
    return await doFetch(url, null, { method: 'get' });
}