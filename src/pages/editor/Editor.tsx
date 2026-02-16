import { Stack } from "@mui/material";
import { Sidebar } from "./Sidebar";
import { MapCanvas } from "./MapCanvas";
import { useEffect, useState } from "react";
import { useSetAtom } from "jotai";
import { getShelves, getInventories, getLocations } from "../../clients/map";
import { hiddenLocationsAtom, locationsAtom, shelvesAtom, inventoriesAtom } from "../../store";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { getHiddenLocations } from "../../clients/location";

export function Editor() {
    const [loading, setLoading] = useState(false);
    const setHiddenLocations = useSetAtom(hiddenLocationsAtom);
    const setLocations = useSetAtom(locationsAtom);
    const setShelves = useSetAtom(shelvesAtom);
    const setInventories = useSetAtom(inventoriesAtom);

    const loadElements = async () => {
        setLoading(true);

        const hiddenLocations = await getHiddenLocations();
        const locations = await getLocations();
        const shelves = await getShelves();
        const inventories = await getInventories();

        setHiddenLocations(hiddenLocations);
        setLocations(locations);
        setShelves(shelves);
        setInventories(inventories);

        setLoading(false);
    };

    useEffect(() => {
        loadElements();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            {
                loading
                    ? <p>loading</p>
                    :
                    <DndProvider backend={HTML5Backend}>
                        <Stack direction="row">
                            <Sidebar />
                            <MapCanvas />
                        </Stack>
                    </DndProvider>
            }
        </>
    );
}