import { Box, Stack, TextField } from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { textFieldSlotProps } from "./props";
import { inventoriesAtom, materialsAtom, suppliersAtom } from "../store";
import { useAtom, useAtomValue } from "jotai";
import { forwardRef, useImperativeHandle } from "react";
import { createNew, type InventoryMapModel } from "../types/inventory";
import { generateBatchNo, generateLabelCode } from "../utils";
import { NumberField } from "./NumberField";
import { SupplierAutocomplete } from "./SupplierAutocomplete";
import { MaterialAutocomplete } from "./MaterialAutocomplete";

const schema = yup.object({
    code: yup.string().required("Label is required").max(50, "Label cannot exceed 50 characters"),
    shelfCode: yup.string().required("Shelf is required").max(50, "Shelf cannot exceed 50 characters"),
    supplierCode: yup.string().required("Supplier is required").max(50, "Supplier cannot exceed 50 characters"),
    materialCode: yup.string().required("Material is required").max(50, "Material cannot exceed 50 characters"),
    batchNo: yup.string().required("Batch number is required").max(6, "Batch number cannot exceed 6 characters"),
    qty: yup.number().required().min(1).max(999999)
}).required();

type FormValues = yup.InferType<typeof schema>;

interface Props {
    inventory?: InventoryMapModel;
    shelfCode: string;
}

export const InventoryEditForm = forwardRef((props: Props, ref: React.Ref<{ submit: () => Promise<boolean> }>) => {
    const { shelfCode, inventory } = props;
    const [inventories, setInventories] = useAtom(inventoriesAtom);
    const materials = useAtomValue(materialsAtom);
    const suppliers = useAtomValue(suppliersAtom);

    const methods = useForm<FormValues>({
        resolver: yupResolver(schema),
        mode: 'onChange',
        defaultValues: {
            code: inventory?.code ?? generateLabelCode(),
            shelfCode: inventory?.shelfCode ?? shelfCode,
            supplierCode: inventory?.supplierCode ?? '',
            materialCode: inventory?.materialCode ?? '',
            batchNo: inventory?.batchNo ?? generateBatchNo(),
            qty: inventory?.qty ?? 1
        }
    });

    const {
        register,
        handleSubmit,
        formState: { errors, defaultValues, isValid },
        reset,
        setValue,
    } = methods;

    const onSubmit = async (data: FormValues) => {
        const item = createNew(data.code, data.shelfCode, data.supplierCode, data.materialCode, data.batchNo, data.qty, materials, suppliers);
        if (inventory) {
            const arr = inventories.filter(x => x.code !== inventory.code);
            arr.push(item);
            setInventories([...arr]);
        } else {
            setInventories([...inventories, item]);
        }
        reset();
    };

    useImperativeHandle(ref, () => ({
        submit: async () => {
            await handleSubmit(onSubmit)();
            return isValid;
        }
    }));

    return (
        <FormProvider {...methods}>
            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={1}>
                    <TextField label="Label" variant="outlined" size="small" disabled={inventory != undefined} slotProps={textFieldSlotProps} fullWidth required error={!!errors.code} helperText={errors.code?.message} {...register('code')} />
                    <TextField label="Shelf" variant="outlined" size="small" disabled={inventory == undefined} slotProps={textFieldSlotProps} fullWidth required error={!!errors.shelfCode} helperText={errors.shelfCode?.message} {...register('shelfCode')} />
                    <TextField label="Batch No." variant="outlined" size="small" slotProps={textFieldSlotProps} fullWidth required error={!!errors.batchNo} helperText={errors.batchNo?.message} {...register('batchNo')} />
                    <SupplierAutocomplete label="Supplier" required />
                    <MaterialAutocomplete label="Material" required />
                    <NumberField label="Quantity" size="small" fullWidth required error={!!errors.qty} helperText={errors.qty?.message} min={1} max={999999} defaultValue={defaultValues?.qty} onValueChange={x => setValue('qty', x ?? 0)} />
                </Stack>
            </Box>
        </FormProvider>
    );
});