import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { DialogProps, OpenDialogOptions } from "../types/dialog";
import { DraggableDialogPaperComponent } from "./DraggableDialogPaperComponent";
import { abortTask, canAbort, canContinue, canRepeat, canTrigger } from "../types/transportTask";
import { getSourceLocation, getTargetLocation } from "../types/utils";
import { useAtom } from "jotai";
import { transportTasksAtom } from "../store";
import { toYYYYMMDDHHmmss } from "../utils/datetime";
import { dialogSlotProps } from "./props";
import { useDialog } from "../hooks/useDialog";

interface Payload extends OpenDialogOptions<void> {
    code: string;
}

type Props = DialogProps<Payload, void>;

export function TransportTaskDetailDialog(props: Props) {
    const { open, payload, onClose } = props;
    const dialog = useDialog();
    const [tasks, setTasks] = useAtom(transportTasksAtom);
    const task = tasks.find(x => x.code === payload.code);

    const abort = async () => {
        if (!task) {
            return;
        }

        const b = await dialog.confirm(`确定中断任务 ${task.code}？`, { severity: 'warning' });
        if (b) {
            abortTask(task);
            setTasks([...tasks]);
        }
    };

    return (
        <Dialog maxWidth="xs" fullWidth open={open} PaperComponent={DraggableDialogPaperComponent} hideBackdrop disableEscapeKeyDown disableEnforceFocus slotProps={dialogSlotProps}>
            <DialogTitle style={{ cursor: 'move' }}>搬运任务 {payload.code}</DialogTitle>
            <IconButton onClick={() => onClose()} sx={(theme) => ({ position: 'absolute', right: 8, top: 8, color: theme.palette.grey[500] })}>
                <CloseIcon />
            </IconButton>
            <DialogContent>
                {
                    task ? (
                        <>
                            <Typography variant="body1" align="left"><b>任务类型</b> {task.businessTypeName}</Typography>
                            <Typography variant="body1" align="left"><b>任务编码</b> {task.code}</Typography>
                            <Typography variant="body1" align="left"><b>状态</b> {task.status}</Typography>
                            <Typography variant="body1" align="left"><b>优先级</b> {task.priority}</Typography>
                            <Typography variant="body1" align="left"><b>AGV编号</b> {task.agvCode}</Typography>
                            <Typography variant="body1" align="left"><b>货架编码</b> {task.shelfCode}</Typography>
                            <Typography variant="body1" align="left"><b>源位置</b> {getSourceLocation(task)}</Typography>
                            <Typography variant="body1" align="left"><b>目的位置</b> {getTargetLocation(task)}</Typography>
                            <Typography variant="body1" align="left"><b>外部任务编号</b> {task.externalTaskCode}</Typography>
                            <Typography variant="body1" align="left"><b>创建用户</b> {task.createdBy}</Typography>
                            <Typography variant="body1" align="left"><b>创建时间</b> {toYYYYMMDDHHmmss(task.createdAt)}</Typography>
                            <Typography variant="body1" align="left"><b>离开时间</b> {toYYYYMMDDHHmmss(task.leavedAt)}</Typography>
                            <Typography variant="body1" align="left"><b>到达时间</b> {toYYYYMMDDHHmmss(task.arrivedAt)}</Typography>
                            <Typography variant="body1" align="left"><b>调度时间</b> {toYYYYMMDDHHmmss(task.scheduledAt)}</Typography>
                            <Typography variant="body1" align="left"><b>提示信息</b> {task.message}</Typography>
                        </>
                    ) : null
                }
            </DialogContent>
            <DialogActions>
                {
                    task ? (
                        <>
                            <Button size="small" variant="contained" disabled={!canContinue(task)} color="inherit">继续</Button>
                            <Button size="small" variant="contained" disabled={!canTrigger(task)} onClick={abort} color="inherit">触发开始</Button>
                            <Button size="small" variant="contained" disabled={!canTrigger(task)} onClick={abort} color="primary">触发结束</Button>
                            <Button size="small" variant="contained" disabled={!canAbort(task)} onClick={abort} color="warning">中断</Button>
                            <Button size="small" variant="contained" disabled={!canRepeat(task)} onClick={abort} color="inherit">复制</Button>
                        </>
                    ) : null
                }
            </DialogActions>
        </Dialog>
    );
}