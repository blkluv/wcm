import type { Rectangle } from "./rectangle";

export interface Location {
    code: string;
    level: number;
    externalCode: string;
    shelfModels: string[];
    enabled: boolean;
    areaCode: string;
}

export interface LocationMapElementModel extends Location {
    x: number | null;
    y: number | null;
    w: number | null;
    h: number | null;
}

export interface ValidLocationMapElementModel extends Location, Rectangle {

}

export function getLocationElementId(element: LocationMapElementModel) {
    return `${element.code}-location`;
}

export function getShelfModels(element: LocationMapElementModel) {
    return element.shelfModels.join(',');
}

export function checkRectangle(element: LocationMapElementModel) {
    return element.x != null && element.y != null && element.w != null && element.h != null;
}