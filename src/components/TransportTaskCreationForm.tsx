import { Box, Stack } from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { locationsAtom, shelvesAtom, transportTasksAtom } from "../store";
import { useAtom, useAtomValue } from "jotai";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { createNew } from "../types/transportTask";
import { LocationAutocomplete } from "./LocationAutocomplete";
import { ShelfAutocomplete } from "./ShelfAutocomplete";
import { customEventTypes } from "../types/enums";
import type { SelectedElement } from "../types/map";

const schema = yup.object({
    shelfCode: yup.string().required('Please select a shelf or choose one on the map').max(50, 'Shelf cannot exceed 50 characters'),
    locationCode: yup.string().required('Please select a location or choose one on the map').max(50, 'Location cannot exceed 50 characters')
}).required();

type FormValues = yup.InferType<typeof schema>;

interface Props {
    shelfCode?: string;
    toLocationCode?: string;
}

export const TransportTaskCreationForm = forwardRef((props: Props, ref: React.Ref<{ submit: () => Promise<boolean> }>) => {
    const { shelfCode, toLocationCode } = props;
    const [selectedElement, setSelectedElement] = useState<SelectedElement | null>(null);
    const [tasks, setTasks] = useAtom(transportTasksAtom);
    const locations = useAtomValue(locationsAtom);
    const shelves = useAtomValue(shelvesAtom);

    useEffect(() => {
        const handleLocationEvt = (evt: CustomEventInit<{ code: string; }>) => {
            if (evt.detail) {
                setSelectedElement({ code: evt.detail.code, type: 'location' });
            }
        };

        const handleShelfEvt = (evt: CustomEventInit<{ code: string; }>) => {
            if (evt.detail) {
                setSelectedElement({ code: evt.detail.code, type: 'shelf' });
            }
        };

        window.addEventListener(customEventTypes.locationSelected, handleLocationEvt);
        window.addEventListener(customEventTypes.shelfSelected, handleShelfEvt);

        return () => {
            window.removeEventListener(customEventTypes.locationSelected, handleLocationEvt);
            window.removeEventListener(customEventTypes.shelfSelected, handleShelfEvt);
        }
    }, []);

    const methods = useForm<FormValues>({
        resolver: yupResolver(schema),
        mode: 'onChange',
        defaultValues: {
            shelfCode: shelfCode ?? '',
            locationCode: toLocationCode ?? ''
        }
    });

    const {
        handleSubmit,
        reset,
        setValue,
        formState: { isValid }
    } = methods;

    const onSubmit = async (data: FormValues) => {
        setTasks([...tasks, createNew(data.shelfCode, data.locationCode, shelves, locations, tasks)]);
        reset();
    };

    useImperativeHandle(ref, () => ({
        submit: async () => {
            await handleSubmit(onSubmit)();
            return isValid;
        }
    }));

    useEffect(() => {
        if (selectedElement) {
            if (selectedElement.type === 'shelf') {
                if (!shelfCode) {
                    setValue('shelfCode', selectedElement.code, { shouldValidate: true });
                }
            } else {
                if (!toLocationCode) {
                    setValue('locationCode', selectedElement.code, { shouldValidate: true });
                }
            }
        }

    }, [selectedElement, setValue, shelfCode, toLocationCode]);

    return (
        <FormProvider {...methods}>
            <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={1}>
                    <ShelfAutocomplete label="Shelf" required disabled={!!shelfCode} />
                    <LocationAutocomplete label="Location" required disabled={!!toLocationCode} />
                </Stack>
            </Box>
        </FormProvider>
    );
});