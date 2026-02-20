import { Paper, Box, Stack, Typography } from "@mui/material";
import { useAtomValue } from "jotai";
import { exceptionalShelfQtyAtom, transportTaskStatisticalDataAtom } from "../../store";
import { useDialog } from "../../hooks/useDialog";
import { transportTaskStatuses } from "../../types/enums";
import { TransportTasksDialog } from "../../components/TransportTasksDialog";
import { NoLocationShelvesDialog } from "../../components/NoLocationShelvesDialog";

export function TransportTaskCounter() {
    const statisticalData = useAtomValue(transportTaskStatisticalDataAtom);
    const qty = useAtomValue(exceptionalShelfQtyAtom);
    const dialog = useDialog();

    const viewTasks = async (status: number, title: string) => {
        await dialog.open(TransportTasksDialog, { status: status, title: title });
    };

    const viewShelves = async () => {
        await dialog.open(NoLocationShelvesDialog, {});
    };

    return (
        <Box style={{ position: 'absolute', zIndex: 99, translate: '10px 10px', textAlign: 'center', opacity: 0.8 }}>
            <Paper elevation={0} variant="outlined" sx={{ padding: '4px' }}>
                <Stack direction="row" spacing={2}>
                    <div>
                        <Typography variant="body2">Pending</Typography>
                        <Typography variant="h6" style={{ cursor: 'pointer' }} onClick={() => viewTasks(transportTaskStatuses.pending, 'Pending Tasks')}>{statisticalData.pending}</Typography>
                    </div>
                    <div>
                        <Typography variant="body2">Exception Tasks</Typography>
                        <Typography variant="h6" color="error" style={{ cursor: 'pointer' }} onClick={() => viewTasks(transportTaskStatuses.exceptional, 'Exception Tasks')}>{statisticalData.exceptional}</Typography>
                    </div>
                    <div>
                        <Typography variant="body2">Executing</Typography>
                        <Typography variant="h6" color="success" style={{ cursor: 'pointer' }} onClick={() => viewTasks(transportTaskStatuses.executing, 'Executing Tasks')}>{statisticalData.executing}</Typography>
                    </div>
                    <div>
                        <Typography variant="body2">Unassigned Shelves</Typography>
                        <Typography variant="h6" color="warning" style={{ cursor: 'pointer' }} onClick={viewShelves}>{qty}</Typography>
                    </div>
                </Stack>
            </Paper>
        </Box>
    );
}