import { generateTaskCode } from "../utils";
import { transportTaskStatuses } from "./enums";
import type { LocationMapElementModel } from "./location";
import type { ShelfMapElementModel } from "./shelf";
import dayjs from "dayjs";

export interface TransportTaskMapModel {
    code: string;
    shelfCode: string;
    startAreaCode: string | null;
    endAreaCode: string;
    startLocationCode: string | null;
    endLocationCode: string;
    businessTypeCode: string;
    businessTypeName: string | null;
    status: number;
    createdAt: string;
}

export interface TransportTaskStatisticalData {
    pending: number;
    exceptional: number;
    executing: number;
}

export interface TransportTaskDetailModel extends TransportTaskMapModel {
    externalTaskCode: string | null;
    agvCode: string | null;
    shelfAngle: number | null;
    priority: number | null;
    createdBy: string | null;
    leavedAt: string | null;
    arrivedAt: string | null;
    scheduledAt: string | null;
    message: string | null;
}

export function canTrigger(task: TransportTaskMapModel) {
    return task.status >= transportTaskStatuses.pending && task.status < transportTaskStatuses.renewable;
}

export function canContinue(task: TransportTaskMapModel) {
    return task.status == transportTaskStatuses.renewable;
}

export function canRepeat(task: TransportTaskMapModel) {
    return task.status == transportTaskStatuses.executing;
}

export function canAbort(task: TransportTaskMapModel) {
    return task.status >= transportTaskStatuses.pending && task.status <= transportTaskStatuses.renewable;
}

export function createNew(shelfCode: string, toLocationCode: string, shelves: ShelfMapElementModel[], locations: LocationMapElementModel[]) {
    const shelf = shelves.find(x => x.code === shelfCode);
    if (!shelf) {
        throw new Error('Shelf not found.');
    }

    if (!shelf.locationCode) {
        throw new Error('Shelf location not found.');
    }

    const startLocation = locations.find(x => x.code == shelf.locationCode);
    if (!startLocation) {
        throw new Error('Start location not found.');
    }

    const endLocation = locations.find(x => x.code == toLocationCode);
    if (!endLocation) {
        throw new Error('End location not found.');
    }

    return {
        code: generateTaskCode(),
        shelfCode: shelfCode,
        startAreaCode: startLocation.areaCode,
        endAreaCode: endLocation.areaCode,
        startLocationCode: startLocation.code,
        endLocationCode: toLocationCode,
        businessTypeCode: 'F01',
        businessTypeName: '货架调度',
        status: transportTaskStatuses.executing,
        createdAt: dayjs(new Date()).format('YYYY-MM-DDTHH:mm:ssZ'),
    };
}