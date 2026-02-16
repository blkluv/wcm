import { useAtom, useAtomValue } from "jotai";
import { useDrop } from "react-dnd";
import { inventoriesAtom, locationsAtom, shelvesAtom } from "../../store";
import type { InventoryMapModel } from "../../types/inventory";
import { getLocationElementId, type Location } from "../../types/location";
import { LocationMapElement } from "../../components/LocationMapElement";
import { useCallback, useRef } from "react";

export function MapCanvas() {
    const ref = useRef<HTMLDivElement>(null);
    const [locations, setLocations] = useAtom(locationsAtom);
    const shelves = useAtomValue(shelvesAtom);
    const inventories = useAtomValue(inventoriesAtom);

    const [, drop] = useDrop(() => ({
        accept: 'location',
        drop: (item: Location, monitor) => {
            const clientOffset = monitor.getClientOffset();
            const initialClientOffset = monitor.getInitialClientOffset();
            const initialSourceClientOffset = monitor.getInitialSourceClientOffset();
            let offset: { x: number, y: number; } | null = null;
            if (clientOffset && initialClientOffset && initialSourceClientOffset) {
                const rect = ref.current!.getBoundingClientRect();

                const itemCenterOffsetX = initialClientOffset.x - initialSourceClientOffset.x;
                const itemCenterOffsetY = initialClientOffset.y - initialSourceClientOffset.y;

                const finalCenterX = clientOffset.x - itemCenterOffsetX;
                const finalCenterY = clientOffset.y - itemCenterOffsetY;

                const x = finalCenterX - rect.left;
                const y = finalCenterY - rect.top;

                offset = { x, y };

                const location = { ...item, x, y, w: 100, h: 100 };
                setLocations(prev => {
                    return [...prev, location];
                });
            }

            return { code: 'MapCanvas', offset };
        }
    }));

    const setRef = useCallback((node: HTMLDivElement | null) => {
        ref.current = node;
        drop(node);
    }, [drop]);

    const locationElements = [];
    for (const location of locations) {
        const shelf = shelves.find(x => x.locationCode == location.code);
        let shelfInventories: InventoryMapModel[] = [];
        if (shelf) {
            shelfInventories = inventories.filter(x => x.shelfCode == shelf.code);
        }

        locationElements.push(<LocationMapElement key={getLocationElementId(location)} location={location} shelf={shelf} inventories={shelfInventories} arriveTasks={[]} onlyShelf={false} selected={false} />);
    }

    return (
        <div style={{ width: 'calc(100vw - 210px)', height: '100vh', overflow: 'auto', position: 'relative' }}>
            <div ref={setRef} style={{ width: '100vw', height: '100vh', margin: '16px' }}>
                {locationElements}
            </div>
        </div>
    );
}