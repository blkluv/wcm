import { Box, FormControlLabel, Stack, Switch, TextField } from "@mui/material";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { textFieldSlotProps } from "./props";
import { locationsAtom } from "../store";
import { useAtom } from "jotai";
import { forwardRef, useImperativeHandle } from "react";
import { NumberField } from "./NumberField";
import type { LocationMapElementModel } from "../types/location";
import { AreaAutocomplete } from "./AreaAutocomplete";
import { ShelfModelSelector } from "./ShelfModelSelector";

const schema = yup.object({
    code: yup.string().required('Code is required').max(50, 'Code cannot exceed 50 characters'),
    level: yup.number().required().min(1).max(6),
    externalCode: yup.string().required('External code is required').max(50, 'External code cannot exceed 50 characters'),
    shelfModels: yup.array().of(yup.string().required('Shelf model is required')).required('Shelf models are required').min(1, 'At least one shelf model must be selected'),
    enabled: yup.boolean().required(),
    areaCode: yup.string().required('Area is required').max(50, 'Area cannot exceed 50 characters')
}).required();

type FormValues = yup.InferType<typeof schema>;

interface Props {
    location: LocationMapElementModel;
}

export const LocationEditionForm = forwardRef((props: Props, ref: React.Ref<{ submit: () => Promise<boolean> }>) => {
    const { location } = props;
    const [locations, setLocations] = useAtom(locationsAtom);

    const methods = useForm<FormValues>({
        resolver: yupResolver(schema),
        mode: 'onChange',
        defaultValues: {
            code: location.code,
            level: location.level,
            externalCode: location.externalCode,
            shelfModels: location.shelfModels,
            enabled: location.enabled,
            areaCode: location.areaCode
        }
    });

    const {
        control,
        register,
        handleSubmit,
        formState: { errors, defaultValues, isValid },
        reset,
        setValue,
    } = methods;

    const onSubmit = async (data: FormValues) => {
        const arr = locations.filter(x => x.code !== location.code);
        arr.push({
            code: data.code,
            level: data.level,
            externalCode: data.externalCode,
            shelfModels: data.shelfModels,
            enabled: data.enabled,
            areaCode: data.areaCode,
            x: location.x,
            y: location.y,
            w: location.w,
            h: location.h
        });
        setLocations([...arr]);
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
                    <TextField label="Code" variant="outlined" size="small" disabled slotProps={textFieldSlotProps} fullWidth required error={!!errors.code} helperText={errors.code?.message} {...register('code')} />
                    <AreaAutocomplete label="Area" required />
                    <ShelfModelSelector label="Shelf Model" required />
                    <NumberField label="Level" size="small" fullWidth required error={!!errors.level} helperText={errors.level?.message} min={1} max={6} defaultValue={defaultValues?.level} onValueChange={x => setValue('level', x ?? 0)} />
                    <TextField label="External Code" variant="outlined" size="small" slotProps={textFieldSlotProps} fullWidth required error={!!errors.externalCode} helperText={errors.externalCode?.message} {...register('externalCode')} />
                    <Controller name="enabled" control={control}
                        render={({ field }) => (
                            <FormControlLabel control={<Switch checked={field.value} {...field} name="enabled" />} label="Enabled" />
                        )}
                    />
                </Stack>
            </Box>
        </FormProvider>
    );
});