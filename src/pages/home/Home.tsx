import { TransportTaskCounter } from "./TransportTaskCounter";
import { SearchBar } from "./SearchBar";
import { CtrlGroup } from "./CtrlGroup";
import { ViewPort } from "./ViewPort";
import { LoadingProgress } from "./LoadingProgress";
import { useEffect, useState } from "react";
import { getAreas, getLocations, getShelves, getInventories, getTrasnportTasks } from "../../clients/map";
import { useSetAtom } from "jotai";
import { areasAtom, locationsAtom, shelvesAtom, inventoriesAtom, transportTasksAtom } from "../../store";

export function Home() {
    const [loading, setLoading] = useState(false);
    const [size, setSize] = useState<number[]>([0, 0]);

    const setAreas = useSetAtom(areasAtom);
    const setLocations = useSetAtom(locationsAtom);
    const setShelves = useSetAtom(shelvesAtom);
    const setInventories = useSetAtom(inventoriesAtom);
    const setTransportTasks = useSetAtom(transportTasksAtom);

    const loadElements = async () => {
        setLoading(true);

        const areas = await getAreas();
        const locations = await getLocations();
        const shelves = await getShelves();
        const inventories = await getInventories();
        const transpotTasks = await getTrasnportTasks();

        let mapW = 0;
        let mapH = 0;

        for (const location of locations) {
            mapW = Math.max(location.x + location.w, mapW);
            mapH = Math.max(location.y + location.h, mapH);
        }

        setSize([mapW, mapH]);

        setAreas(areas);
        setLocations(locations);
        setShelves(shelves);
        setInventories(inventories);
        setTransportTasks(transpotTasks);

        setLoading(false);
    };

    useEffect(() => {
        loadElements();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div style={{ userSelect: 'none' }}>
            {
                loading
                    ? <LoadingProgress />
                    :
                    <>
                        <TransportTaskCounter />
                        <SearchBar refresh={loadElements} />
                        <CtrlGroup />
                    </>
            }
            <ViewPort mapW={size[0]} mapH={size[1]} />
        </div>
    );
}