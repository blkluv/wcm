import { Refresh, Settings, Edit } from "@mui/icons-material";
import { TextField, Paper, Stack, Box, IconButton, Autocomplete } from "@mui/material";
import type { InventoryMapModel } from "../../types/inventory";
import type { LocationMapElementModel } from "../../types/location";
import type { SearchResult } from "../../types/map";
import type { ShelfMapElementModel } from "../../types/shelf";
import { filterTake, groupBy } from "../../types/utils";
import { inventoriesAtom, locationsAtom, selectedLocationsAtom, shelvesAtom } from "../../store";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

interface Props {
    refresh: () => Promise<void>;
}

const maxItem = 20;

interface Inventory extends InventoryMapModel {
    locationCode: string;
}

function search(keyword: string, locations: LocationMapElementModel[], shelves: ShelfMapElementModel[], inventories: InventoryMapModel[]) {
    const result: SearchResult[] = [];

    if (keyword === '') {
        return result;
    }

    keyword = keyword.toLowerCase();

    do {
        filterTake(locations, x => x.code.toLowerCase().includes(keyword), maxItem).forEach(x => result.push({ code: x.code, type: 'Location', locationCodes: [x.code] }));
        if (result.length >= maxItem) {
            break;
        }

        filterTake(shelves, x => x.locationCode != null && x.code.toLowerCase().includes(keyword), maxItem - result.length).forEach(x => result.push({ code: x.code, type: 'Shelf', locationCodes: [x.locationCode!] }));
        if (result.length >= maxItem) {
            break;
        }

        const list: Inventory[] = [];
        for (const shelf of shelves) {
            if (shelf.locationCode == null) {
                continue;
            }

            inventories.filter(x => x.shelfCode === shelf.code).forEach(x => list.push({ ...x, locationCode: shelf.locationCode! }));
        }

        filterTake(list, x => x.code.toLowerCase().includes(keyword), maxItem - result.length).forEach(x => result.push({ code: x.code, type: 'Inventory', locationCodes: [x.locationCode] }));
        if (result.length >= maxItem) {
            break;
        }

        {
            const groups = groupBy(filterTake(list, x => x.materialCode.toLowerCase().includes(keyword), maxItem - result.length), x => x.materialCode);
            for (const item of groups) {
                result.push({ code: item[0], type: 'Material', locationCodes: item[1].map(x => x.locationCode) });
            }

            if (result.length >= maxItem) {
                break;
            }
        }

        {
            const groups = groupBy(filterTake(list, x => x.supplierCode.toLowerCase().includes(keyword), maxItem - result.length), x => x.supplierCode);
            for (const item of groups) {
                result.push({ code: item[0], type: 'Supplier', locationCodes: item[1].map(x => x.locationCode) });
            }
        }

        // eslint-disable-next-line no-constant-condition
    } while (false);

    return result;
}

export function SearchBar(props: Props) {
    const locations = useAtomValue(locationsAtom);
    const shelves = useAtomValue(shelvesAtom);
    const inventories = useAtomValue(inventoriesAtom);
    const setSelectedLocations = useSetAtom(selectedLocationsAtom);
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [options, setOptions] = useState<SearchResult[]>([]);
    const navigate = useNavigate();

    const doSearch = () => {
        const list = search(inputValue, locations, shelves, inventories);
        setOptions(list);
    };

    useEffect(() => {
        if (open) {
            doSearch();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inputValue, open, locations, shelves, inventories]);

    return (
        <Box sx={{ position: 'absolute', zIndex: 99, translate: 'calc(100vw / 2 - 250px) 5px', width: '450px', opacity: 0.8 }}>
            <Paper elevation={0} variant="outlined" sx={{ padding: '4px' }}>
                <Stack direction="row" spacing={2}>
                    <Autocomplete open={open}
                        onOpen={() => setOpen(true)}
                        onClose={() => setOpen(false)}
                        inputValue={inputValue}
                        onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
                        noOptionsText={inputValue.length < 2 ? null : "No matches found"}
                        onChange={(_, option) => setSelectedLocations(option ? option.locationCodes : [])}
                        disablePortal
                        fullWidth={true}
                        options={options}
                        forcePopupIcon={false}
                        getOptionKey={option => option.code}
                        getOptionLabel={option => option.code}
                        renderOption={(props, option) => (
                            <li {...props} key={option.code}>
                                {option.type}: {option.code}
                            </li>
                        )}
                        renderInput={(params) => <TextField {...params} size="small" variant="outlined" placeholder="Search" />}
                    />
                    <IconButton size="medium">
                        <Settings />
                    </IconButton>
                    <IconButton size="medium" onClick={() => navigate('/editor')}>
                        <Edit />
                    </IconButton>
                    <IconButton size="medium" onClick={async () => await props.refresh()}>
                        <Refresh />
                    </IconButton>
                </Stack>
            </Paper>
        </Box>
    );
}