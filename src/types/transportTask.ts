import { transportTaskStatuses } from "./enums";

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
    createdAt: Date;
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
    leavedAt: Date | null;
    arrivedAt: Date | null;
    scheduledAt: Date | null;
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