import { atom } from "jotai";
import type { TransportTaskMapModel, TransportTaskStatisticalData } from "../types/transportTask";
import type { AreaMapElementModel } from "../types/area";
import type { Location, LocationMapElementModel } from "../types/location";
import type { ShelfMapElementModel } from "../types/shelf";
import type { InventoryMapModel } from "../types/inventory";
import { transportTaskStatuses } from "../types/enums";
import type { MapElementLayerCtrl } from "../types/map";
import type { Material } from "../types/material";
import type { Supplier } from "../types/supplier";

export const globalAlertAtom = atom<string | null>();

export const layerCtrlAtom = atom<MapElementLayerCtrl>({
    area: true,
    location: true,
    shelf: true,
    inventory: true,
    transportTask: false
});

export const scaleAtom = atom<number>(1);

export const areasAtom = atom<AreaMapElementModel[]>([]);

export const hiddenLocationsAtom = atom<Location[]>([]);

export const locationsAtom = atom<LocationMapElementModel[]>([]);

export const shelvesAtom = atom<ShelfMapElementModel[]>([]);

export const inventoriesAtom = atom<InventoryMapModel[]>([]);

export const transportTasksAtom = atom<TransportTaskMapModel[]>([]);

export const shelfModelsAtom = atom<string[]>(['1212', '1313', '1317']);

export const materialsAtom = atom<Material[]>([
    { code: 'PALLET001', name: 'Euro Pallet - Wood (1200x800mm)', type: 'large-part' },
    { code: 'PALLET002', name: 'Industrial Pallet - Wood (1200x1000mm)', type: 'large-part' },
    { code: 'PALLET003', name: 'Plastic Pallet (1200x800mm)', type: 'large-part' },
    { code: 'BULK001', name: 'Corrugated Cardboard - Bale', type: 'large-part' },
    { code: 'BULK002', name: 'Stretch Wrap - 500mm x 300m', type: 'medium-part' },
    { code: 'BULK003', name: 'Packing Tape - 48mm x 100m (Case of 36)', type: 'medium-part' },
    { code: 'BOX001', name: 'Small Box - 300x200x150mm (Bundle of 25)', type: 'medium-part' },
    { code: 'BOX002', name: 'Medium Box - 400x300x200mm (Bundle of 20)', type: 'medium-part' },
    { code: 'BOX003', name: 'Large Box - 600x400x300mm (Bundle of 10)', type: 'large-part' },
    { code: 'BOX004', name: 'Extra Large Box - 800x600x400mm (Bundle of 5)', type: 'large-part' },
    { code: 'BOX005', name: 'Folding Box - 500x400x300mm (Bundle of 15)', type: 'medium-part' },
    { code: 'CONTAINER001', name: 'Plastic Tote - 40L (Stackable)', type: 'medium-part' },
    { code: 'CONTAINER002', name: 'Plastic Tote - 60L (Stackable)', type: 'medium-part' },
    { code: 'CONTAINER003', name: 'Plastic Tote - 80L (Stackable)', type: 'large-part' },
    { code: 'CONTAINER004', name: 'Wire Mesh Container - 1200x1000x900mm', type: 'large-part' },
    { code: 'BIN001', name: 'Small Parts Bin - 150x100x80mm', type: 'small-part' },
    { code: 'BIN002', name: 'Medium Parts Bin - 300x200x150mm', type: 'small-part' },
    { code: 'BIN003', name: 'Large Parts Bin - 450x300x200mm', type: 'medium-part' },
    { code: 'PACK001', name: 'Bubble Wrap - 500mm x 50m Roll', type: 'medium-part' },
    { code: 'PACK002', name: 'Bubble Wrap - 1000mm x 50m Roll', type: 'large-part' },
    { code: 'PACK003', name: 'Foam Sheets - 1000x1000x10mm (Pack of 10)', type: 'medium-part' },
    { code: 'PACK004', name: 'Packing Peanuts - 500L Bag', type: 'medium-part' },
    { code: 'PACK005', name: 'Air Pillows - Roll of 100', type: 'small-part' },
    { code: 'PACK006', name: 'Corner Protectors - 50x50x1000mm (Pack of 10)', type: 'medium-part' },
    { code: 'PACK007', name: 'Pallet Corner Boards - 50x50x1200mm (Pack of 20)', type: 'medium-part' },
    { code: 'PACK008', name: 'Strapping - Polyester (12mm x 1000m Coil)', type: 'medium-part' },
    { code: 'PACK009', name: 'Strapping - Steel (19mm x 500m Coil)', type: 'large-part' },
    { code: 'PACK010', name: 'Strapping Buckles - Box of 500', type: 'small-part' },
    { code: 'LABEL001', name: 'Shipping Labels - 4x6" (Roll of 500)', type: 'small-part' },
    { code: 'LABEL002', name: 'Barcode Labels - 2x1" (Roll of 1000)', type: 'small-part' },
    { code: 'LABEL003', name: 'Warning Labels - "Fragile" (Pack of 100)', type: 'small-part' },
    { code: 'LABEL004', name: 'Warning Labels - "This Side Up" (Pack of 100)', type: 'small-part' },
    { code: 'DOC001', name: 'Packing Slips - A5 (Pad of 100)', type: 'small-part' },
    { code: 'DOC002', name: 'Bill of Lading Forms - A4 (Pad of 50)', type: 'small-part' },
    { code: 'DOC003', name: 'Shipping Manifest - A4 (Pad of 50)', type: 'small-part' },
    { code: 'EQPT001', name: 'Forklift Battery - 48V', type: 'large-part' },
    { code: 'EQPT002', name: 'Forklift Tire - Front (Pair)', type: 'large-part' },
    { code: 'EQPT003', name: 'Forklift Tire - Rear (Pair)', type: 'large-part' },
    { code: 'EQPT004', name: 'Pallet Jack Wheel - Set of 4', type: 'medium-part' },
    { code: 'EQPT005', name: 'Rack Beam - 2700mm', type: 'large-part' },
    { code: 'EQPT006', name: 'Rack Upright - 3600mm', type: 'large-part' },
    { code: 'EQPT007', name: 'Wire Decking - 1000x800mm', type: 'large-part' },
    { code: 'EQPT008', name: 'Pallet Support Bar - 2700mm', type: 'large-part' },
    { code: 'EQPT009', name: 'Row Spacer - 100mm', type: 'medium-part' },
    { code: 'EQPT010', name: 'Column Protector - Yellow', type: 'medium-part' },
    { code: 'EQPT011', name: 'Rack Label Holder - Magnetic', type: 'small-part' },
    { code: 'SAFE001', name: 'Safety Vest - Hi-Vis (Case of 20)', type: 'medium-part' },
    { code: 'SAFE002', name: 'Hard Hat - Standard (Case of 10)', type: 'medium-part' },
    { code: 'SAFE003', name: 'Safety Glasses - Clear (Box of 20)', type: 'small-part' },
    { code: 'SAFE004', name: 'Steel Toe Boots - Size 42 (Pair)', type: 'medium-part' },
    { code: 'SAFE005', name: 'Work Gloves - Cotton (Dozen)', type: 'small-part' },
    { code: 'SAFE006', name: 'Cut Resistant Gloves - Level 5 (Pair)', type: 'small-part' },
    { code: 'SAFE007', name: 'Safety Cones - 700mm (Set of 4)', type: 'medium-part' },
    { code: 'SAFE008', name: 'Safety Barrier - 2000mm (Set of 5)', type: 'large-part' },
    { code: 'SAFE009', name: 'First Aid Kit - Wall Mounted', type: 'medium-part' },
    { code: 'SAFE010', name: 'Fire Extinguisher - 5kg ABC', type: 'medium-part' },
    { code: 'SAFE011', name: 'Spill Kit - 50L', type: 'medium-part' },
    { code: 'SAFE012', name: 'Eye Wash Station', type: 'medium-part' },
    { code: 'CLEAN001', name: 'Industrial Broom - 600mm (Case of 6)', type: 'medium-part' },
    { code: 'CLEAN002', name: 'Mop - Cotton (Case of 12)', type: 'medium-part' },
    { code: 'CLEAN003', name: 'Floor Scrubber Pad - 500mm (Pack of 5)', type: 'small-part' },
    { code: 'CLEAN004', name: 'Trash Bags - 120L (Case of 500)', type: 'medium-part' },
    { code: 'CLEAN005', name: 'Trash Bags - Heavy Duty 200L (Case of 250)', type: 'medium-part' },
    { code: 'CLEAN006', name: 'Industrial Degreaser - 20L Pail', type: 'large-part' },
    { code: 'CLEAN007', name: 'Floor Cleaner - Concentrate (20L)', type: 'large-part' },
    { code: 'CLEAN008', name: 'Paper Towels - Industrial Roll (Case of 12)', type: 'medium-part' },
    { code: 'OFF001', name: 'Printer Paper - A4 (Case of 10 Reams)', type: 'medium-part' },
    { code: 'OFF002', name: 'Printer Paper - Label Stock (Box of 100 Sheets)', type: 'small-part' },
    { code: 'OFF003', name: 'Toner Cartridge - Black', type: 'small-part' },
    { code: 'OFF004', name: 'Toner Cartridge - Color Set', type: 'small-part' },
    { code: 'OFF005', name: 'Clipboard - Letter Size (Case of 24)', type: 'small-part' },
    { code: 'OFF006', name: 'Pens - Black (Box of 100)', type: 'small-part' },
    { code: 'OFF007', name: 'Markers - Permanent (Box of 24)', type: 'small-part' },
    { code: 'OFF008', name: 'Battery - AA (Case of 100)', type: 'small-part' },
    { code: 'OFF009', name: 'Battery - AAA (Case of 100)', type: 'small-part' }
]);

export const suppliersAtom = atom<Supplier[]>([
    { code: '000000', name: 'Default Supplier' }
]);

export const transportTaskStatisticalDataAtom = atom<TransportTaskStatisticalData>(get => {
    const tasks = get(transportTasksAtom);
    const pending = tasks.filter(x => x.status === transportTaskStatuses.pending).length;
    const exceptional = tasks.filter(x => x.status === transportTaskStatuses.exceptional).length;
    const executing = tasks.filter(x => x.status === transportTaskStatuses.executing || x.status === transportTaskStatuses.renewable).length;
    return { pending, exceptional, executing };
});

export const exceptionalShelfQtyAtom = atom<number>(get => {
    const shelves = get(shelvesAtom);
    const tasks = get(transportTasksAtom);
    return shelves.filter(x => x.locationCode === null && !tasks.some(y => y.shelfCode === x.code && y.status >= transportTaskStatuses.pending && y.status <= transportTaskStatuses.renewable)).length;
});

export const selectedLocationsAtom = atom<string[]>([]);

export const selectedTasksAtom = atom<{ locationCode?: string; taskCode?: string; } | null>(null);