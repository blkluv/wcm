import type { Rectangle } from "./rectangle";

export interface Location {
    code: string;
    level: number;
    externalCode: string;
    shelfModels: string[];
    enabled: boolean;
    areaCode: string;
}

export interface LocationMapElementModel extends Location, Rectangle {

}

export function getLocationElementId(element: Location) {
    return `${element.code}-location`;
}

export function getShelfModels(element: LocationMapElementModel) {
    return element.shelfModels.join(',');
}