import { Box, Stack, TextField } from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { textFieldSlotProps } from "./props";
import { inventoriesAtom, materialsAtom, supplersAtom } from "../store";
import { useAtom, useAtomValue } from "jotai";
import { forwardRef, useImperativeHandle } from "react";
import { createNew, type InventoryMapModel } from "../types/inventory";
import { generateBatchNo, generateLabelCode } from "../utils";
import { NumberField } from "./NumberField";
import { SupplierAutocomplete } from "./SupplierAutocomplete";
import { MaterialAutocomplete } from "./MaterialAutocomplete";

const schema = yup.object({
    code: yup.string().required("标签是必须的").max(50, "标签最多50个字符"),
    shelfCode: yup.string().required("货架是必须的").max(50, "货架最多50个字符"),
    supplierCode: yup.string().required("供应商是必须的").max(50, "供应商最多50个字符"),
    materialCode: yup.string().required("物料是必须的").max(50, "物料最多50个字符"),
    batchNo: yup.string().required("批次号是必须的").max(6, "批次号最多6个字符"),
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
    const suppliers = useAtomValue(supplersAtom);

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
                    <TextField label="标签" variant="outlined" size="small" disabled={inventory != undefined} slotProps={textFieldSlotProps} fullWidth required error={!!errors.code} helperText={errors.code?.message} {...register('code')} />
                    <TextField label="货架" variant="outlined" size="small" disabled={inventory == undefined} slotProps={textFieldSlotProps} fullWidth required error={!!errors.shelfCode} helperText={errors.shelfCode?.message} {...register('shelfCode')} />
                    <TextField label="批次号" variant="outlined" size="small" slotProps={textFieldSlotProps} fullWidth required error={!!errors.batchNo} helperText={errors.batchNo?.message} {...register('batchNo')} />
                    <SupplierAutocomplete label="供应商" required />
                    <MaterialAutocomplete label="物料" required />
                    <NumberField label="数量" size="small" fullWidth required error={!!errors.qty} helperText={errors.qty?.message} min={1} max={999999} defaultValue={defaultValues?.qty} onValueChange={x => setValue('qty', x ?? 0)} />
                </Stack>
            </Box>
        </FormProvider>
    );
});