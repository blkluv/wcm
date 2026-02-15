import { Autocomplete, Stack, TextField } from "@mui/material";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { inventoriesAtom, locationsAtom, shelvesAtom } from "../../store";
import { textFieldSlotProps } from "../../components/props";
import type { InventoryMapModel } from "../../types/inventory";
import { checkRectangle, getLocationElementId } from "../../types/location";
import { LocationItem } from "./LocationItem";
import { filterTake } from "../../types/utils";

export function Sidebar() {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [options, setOptions] = useState<string[]>([]);
    const locations = useAtomValue(locationsAtom);
    const shelves = useAtomValue(shelvesAtom);
    const inventories = useAtomValue(inventoriesAtom);

    const doSearch = () => {
        setOptions(filterTake(locations, x => !checkRectangle(x) && x.code.toLowerCase().includes(inputValue.toLowerCase()), 20).map(x => x.code));
    };

    useEffect(() => {
        if (open) {
            doSearch();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inputValue, open, locations]);

    const locationElements = [];
    for (const location of locations) {
        if (checkRectangle(location)) {
            continue;
        }

        if (value !== '' && location.code !== value) {
            continue;
        }

        const shelf = shelves.find(x => x.locationCode == location.code);
        let shelfInventories: InventoryMapModel[] = [];
        if (shelf) {
            shelfInventories = inventories.filter(x => x.shelfCode == shelf.code);
        }

        locationElements.push(<LocationItem key={getLocationElementId(location)} location={location} shelf={shelf} inventories={shelfInventories} />);
    }

    return (
        <Stack spacing={1} style={{ height: '100vh', width: '210px', borderRight: '1px solid grey', padding: '4px' }}>
            <Autocomplete open={open}
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
                value={value}
                inputValue={inputValue}
                onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
                noOptionsText={inputValue.length === 0 ? null : "无匹配项"}
                onChange={(_, option) => setValue(option ?? '')}
                fullWidth={true}
                options={options}
                forcePopupIcon={false}
                size="small"
                renderInput={(params) => <TextField {...params} slotProps={textFieldSlotProps} variant="outlined" placeholder="搜索库位" />}
            />
            <Stack direction="row" justifyContent="flex-start" flexWrap="wrap">
                {locationElements}
            </Stack>
        </Stack>
    );
}