import type { Material } from "./material";
import type { Supplier } from "./supplier";

export interface InventoryMapModel {
    code: string;
    shelfCode: string;
    supplierCode: string;
    supplierName: string | null;
    materialCode: string;
    materialName: string | null;
    batchNo: string;
    qty: number;
    status: number;
}

export function groupByMaterial(list: InventoryMapModel[]) {
    return list.reduce((x, y) => {
        const arr = x.get(y.materialCode);
        if (arr) {
            arr.push(y);
        } else {
            x.set(y.materialCode, [y]);
        }

        return x;
    }, new Map<string, InventoryMapModel[]>());
}

export function createNew(code: string, shelfCode: string, supplierCode: string, materialCode: string, batchNo: string, qty: number, materials: Material[], suppliers: Supplier[]) {
    const material = materials.find(x => x.code == materialCode);
    if (!material) {
        throw new Error('Material not found.');
    }

    const supplier = suppliers.find(x => x.code == supplierCode);
    if (!supplier) {
        throw new Error('Supplier not found.');
    }

    return {
        code: code,
        shelfCode: shelfCode,
        supplierCode: supplierCode,
        supplierName: material.name,
        materialCode: materialCode,
        materialName: supplier.name,
        batchNo: batchNo,
        qty: qty,
        status: 0
    }
}