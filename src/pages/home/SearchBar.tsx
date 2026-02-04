import { Refresh, Settings, Edit } from "@mui/icons-material";
import { TextField, Paper, Stack, Box, IconButton, Autocomplete } from "@mui/material";
import type { InventoryMapModel } from "../../types/inventory";
import type { LocationMapElementModel } from "../../types/location";
import type { SearchResult } from "../../types/map";
import type { ShelfMapElementModel } from "../../types/shelf";
import { filterTake } from "../../types/utils";
import { inventoriesAtom, locationsAtom, shelvesAtom } from "../../store";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";

interface Props {
    refresh: () => Promise<void>;
}

const maxItem = 20;

function search(keyWord: string, locations: LocationMapElementModel[], shelves: ShelfMapElementModel[], inventories: InventoryMapModel[]) {
    const result: SearchResult[] = [];

    if (keyWord === '') {
        return result;
    }

    do {
        filterTake(locations, x => x.code.toLowerCase().includes(keyWord.toLowerCase()), maxItem).forEach(x => result.push({ code: x.code, type: '库位' }));
        if (result.length >= maxItem) {
            break;
        }

        filterTake(shelves, x => x.locationCode != null && x.code.toLowerCase().includes(keyWord.toLowerCase()), maxItem - result.length).forEach(x => { result.push({ code: x.code, type: '货架' }) });
        if (result.length >= maxItem) {
            break;
        }

        const list: InventoryMapModel[] = [];
        for (const shelf of shelves) {
            if (shelf.locationCode == null) {
                continue;
            }

            inventories.filter(x => x.shelfCode === shelf.code).forEach(x => list.push(x));
        }

        filterTake(list, x => x.code.toLowerCase().includes(keyWord.toLowerCase()) || x.materialCode.toLowerCase().includes(keyWord.toLowerCase()) || x.supplierCode.toLowerCase().includes(keyWord.toLowerCase()), maxItem - result.length).forEach(x => result.push({ code: x.code, type: '库存', materialCode: x.materialCode, supplierCode: x.supplierCode }));
        // eslint-disable-next-line no-constant-condition
    } while (false);

    return result;
}

export function SearchBar(props: Props) {
    const locations = useAtomValue(locationsAtom);
    const shelves = useAtomValue(shelvesAtom);
    const inventories = useAtomValue(inventoriesAtom);
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [options, setOptions] = useState<SearchResult[]>([]);

    const doSearch = () => {
        const list = search(inputValue, locations, shelves, inventories);
        console.log(list);
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
                        noOptionsText={'无匹配项'}
                        disablePortal
                        fullWidth={true}
                        options={options}
                        forcePopupIcon={false}
                        getOptionKey={option => option.code}
                        getOptionLabel={option => option.code}
                        renderOption={(props, option) => {
                            return (
                                <li {...props} key={option.code}>
                                    {option.type}: {option.code}
                                </li>
                            );
                        }}
                        renderInput={(params) => <TextField {...params} size="small" variant="outlined" placeholder="搜索" />}
                    />
                    <IconButton size="medium">
                        <Settings />
                    </IconButton>
                    <IconButton size="medium">
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