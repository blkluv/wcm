import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import type { DialogProps, OpenDialogOptions } from "../types/dialog";
import { DraggableDialogPaperComponent } from "./DraggableDialogPaperComponent";
import { abortTask, canAbort, canContinue, canRepeat, canTriggerEnd, canTriggerStart, triggerTaskEnd, triggerTaskStart, type TransportTaskMapModel } from "../types/transportTask";
import { getSourceLocation, getTargetLocation } from "../types/utils";
import { useAtom } from "jotai";
import { selectedTasksAtom, shelvesAtom, transportTasksAtom } from "../store";
import { toYYYYMMDDHHmmss } from "../utils/datetime";
import { dialogSlotProps } from "./props";
import { useDialog } from "../hooks/useDialog";
import { DialogCloseButton } from "./DialogCloseButton";
import { useEffect, useState } from "react";
import { getTransportTaskStatusName } from "../types/enums";

interface Payload extends OpenDialogOptions<void> {
    code: string;
}

type Props = DialogProps<Payload, void>;

export function TransportTaskDetailDialog(props: Props) {
    const { open, payload, onClose } = props;
    const dialog = useDialog();
    const [tasks, setTasks] = useAtom(transportTasksAtom);
    const [shelves, setShelves] = useAtom(shelvesAtom);
    const [selectedTasks, setSelectedTasks] = useAtom(selectedTasksAtom);
    const [task, setTask] = useState<TransportTaskMapModel | null>(null);

    const doSetTask = () => {
        setTask(tasks.find(x => x.code === payload.code) ?? null);
    };

    useEffect(() => {
        doSetTask();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [payload.code]);

    const triggerStart = async () => {
        if (!task) {
            return;
        }

        const confirmed = await dialog.confirm(`Are you sure you want to start task ${task.code}?`, { severity: 'warning' });
        if (confirmed) {
            triggerTaskStart(task);
            setTasks([...tasks]);

            const shelf = shelves.find(x => x.code === task.shelfCode);
            if (shelf) {
                shelf.locationCode = null;
                setShelves([...shelves]);
            }
        }
    };

    const clean = (task: TransportTaskMapModel) => {
        if (selectedTasks && (selectedTasks.locationCode === task.startLocationCode || selectedTasks.locationCode === task.endLocationCode || selectedTasks.taskCode === task.code)) {
            setSelectedTasks(null);
        }
    };

    const triggerEnd = async () => {
        if (!task) {
            return;
        }

        const confirmed = await dialog.confirm(`Are you sure you want to complete task ${task.code}?`, { severity: 'warning' });
        if (confirmed) {
            triggerTaskEnd(task);
            setTasks(tasks.filter(x => x.code !== task.code));

            const shelf = shelves.find(x => x.code === task.shelfCode);
            if (shelf) {
                shelf.locationCode = task.endLocationCode;
                setShelves([...shelves]);
            }

            clean(task);
        }
    };

    const abort = async () => {
        if (!task) {
            return;
        }

        const confirmed = await dialog.confirm(`Are you sure you want to abort task ${task.code}?`, { severity: 'warning' });
        if (confirmed) {
            abortTask(task);
            setTasks(tasks.filter(x => x.code !== task.code));
            clean(task);
        }
    };

    return (
        <Dialog maxWidth="xs" fullWidth open={open} PaperComponent={DraggableDialogPaperComponent} hideBackdrop disableEscapeKeyDown disableEnforceFocus slotProps={dialogSlotProps}>
            <DialogTitle style={{ cursor: 'move' }}>Transport Task {payload.code}</DialogTitle>
            <DialogCloseButton close={onClose} />
            <DialogContent>
                {
                    task ? (
                        <>
                            <Typography variant="body1" align="left"><b>Task Type</b> {task.businessTypeName}</Typography>
                            <Typography variant="body1" align="left"><b>Task Code</b> {task.code}</Typography>
                            <Typography variant="body1" align="left"><b>Status</b> {getTransportTaskStatusName(task.status)}</Typography>
                            <Typography variant="body1" align="left"><b>Priority</b> {task.priority}</Typography>
                            <Typography variant="body1" align="left"><b>AGV ID</b> {task.agvCode}</Typography>
                            <Typography variant="body1" align="left"><b>Shelf Code</b> {task.shelfCode}</Typography>
                            <Typography variant="body1" align="left"><b>Source Location</b> {getSourceLocation(task)}</Typography>
                            <Typography variant="body1" align="left"><b>Destination Location</b> {getTargetLocation(task)}</Typography>
                            <Typography variant="body1" align="left"><b>External Task No.</b> {task.externalTaskCode}</Typography>
                            <Typography variant="body1" align="left"><b>Created By</b> {task.createdBy}</Typography>
                            <Typography variant="body1" align="left"><b>Created At</b> {toYYYYMMDDHHmmss(task.createdAt)}</Typography>
                            <Typography variant="body1" align="left"><b>Departed At</b> {toYYYYMMDDHHmmss(task.leavedAt)}</Typography>
                            <Typography variant="body1" align="left"><b>Arrived At</b> {toYYYYMMDDHHmmss(task.arrivedAt)}</Typography>
                            <Typography variant="body1" align="left"><b>Scheduled At</b> {toYYYYMMDDHHmmss(task.scheduledAt)}</Typography>
                            <Typography variant="body1" align="left"><b>Message</b> {task.message}</Typography>
                        </>
                    ) : null
                }
            </DialogContent>
            <DialogActions>
                {
                    task ? (
                        <>
                            <Button size="small" variant="contained" disabled={!canContinue(task)} color="inherit">Continue</Button>
                            <Button size="small" variant="contained" disabled={!canTriggerStart(task)} onClick={triggerStart} color="inherit">Start</Button>
                            <Button size="small" variant="contained" disabled={!canTriggerEnd(task)} onClick={triggerEnd} color="primary">Complete</Button>
                            <Button size="small" variant="contained" disabled={!canAbort(task)} onClick={abort} color="warning">Abort</Button>
                            <Button size="small" variant="contained" disabled={!canRepeat(task)} color="inherit">Duplicate</Button>
                        </>
                    ) : null
                }
            </DialogActions>
        </Dialog>
    );
}