import type { Rectangle } from "./rectangle";

export interface MapElementLayerCtrl {
    area: boolean;
    location: boolean;
    shelf: boolean;
    inventory: boolean;
    transportTask: boolean;
}

export function getLocationStyle(element: Rectangle, b: boolean, selected: boolean) {
    const props = {
        translate: `${element.x}px ${element.y}px`,
        width: `${element.w}px`,
        height: `${element.h}px`
    } as React.CSSProperties;

    if (selected) {
        props['backgroundColor'] = 'yellow';
    }

    if (b) {
        props['borderStyle'] = 'dashed';
        props['borderColor'] = '#9c27b0';
    }

    return props;
}

export function intersect(element: Rectangle, offsetX: number, offsetY: number, scale: number, bounds: Rectangle) {
    return (element.x + element.w) * scale + offsetX >= bounds.x && (element.y + element.h) * scale + offsetY >= bounds.y && element.x * scale + offsetX <= bounds.x + bounds.w && element.y * scale + offsetY <= bounds.y + bounds.h;
}

export interface SearchResult {
    code: string;
    type: '库位' | '货架' | '库存' | '物料' | '供应商';
    locationCodes: string[];
}

export interface SelectedElement {
    code: string;
    type: 'location' | 'shelf';
}