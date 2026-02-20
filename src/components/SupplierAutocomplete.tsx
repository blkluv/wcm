import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { textFieldSlotProps } from "./props";
import { useAtomValue } from "jotai";
import { suppliersAtom } from "../store"; // FIX 1: Corrected spelling from 'supplersAtom'
import { Controller, useFormContext } from "react-hook-form";
import type { Supplier } from "../types/supplier";
import { getDisplayName } from "../utils";

export function SupplierAutocomplete(props: { label?: string; required: boolean; }) {
    const [open, setOpen] = useState(false);
    const { control } = useFormContext<{ supplierCode: string; }>();
    const [inputValue, setInputValue] = useState('');
    const [options, setOptions] = useState<Supplier[]>([]);
    const suppliers = useAtomValue(suppliersAtom); // FIX 2: Updated variable reference

    const doSearch = () => {
        // FIX 3: Added explicit type (x: Supplier) to satisfy the TS7006 'any' error
        setOptions(suppliers.filter((x: Supplier) => x.code.toLowerCase().includes(inputValue.toLowerCase())));
    };

    useEffect(() => {
        if (open) {
            doSearch();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inputValue, open, suppliers]);

    return (
        <Controller name="supplierCode" control={control}
            render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                <Autocomplete 
                    open={open}
                    onOpen={() => setOpen(true)}
                    onClose={() => setOpen(false)}
                    // Simplified value handling to ensure consistency
                    value={options.find(opt => opt.code === value) || null}
                    inputValue={inputValue}
                    onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
                    noOptionsText={inputValue.length === 0 ? null : "No matches found"}
                    onChange={(_, option) => onChange(option?.code ?? '')}
                    fullWidth={true}
                    options={options}
                    forcePopupIcon={false}
                    getOptionKey={option => option.code}
                    getOptionLabel={option => getDisplayName(option.code, option.name)}
                    renderOption={(props, option) => (
                        <li {...props} key={option.code}>
                            {getDisplayName(option.code, option.name)}
                        </li>
                    )}
                    size="small"
                    renderInput={(params) => (
                        <TextField 
                            {...params} 
                            required={props.required} 
                            slotProps={textFieldSlotProps} 
                            variant="outlined" 
                            label={props.label} 
                            error={!!error} 
                            helperText={error?.message} 
                            inputRef={ref} 
                        />
                    )}
                />
            )}
        />
    );
}