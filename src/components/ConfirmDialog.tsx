import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useDialogLoadingButton } from "../hooks/useDialogLoadingButton";
import type { ConfirmDialogProps } from "../types/dialog";

export function ConfirmDialog(props: ConfirmDialogProps) {
    const { open, payload, onClose } = props;
    const cancelButtonProps = useDialogLoadingButton(() => onClose(false));
    const okButtonProps = useDialogLoadingButton(() => onClose(true));

    return (
        <Dialog maxWidth="xs" fullWidth open={open} onClose={() => onClose(false)}>
            <DialogTitle>{payload.title ?? 'Prompt'}</DialogTitle>
            <DialogContent>{payload.msg}</DialogContent>
            <DialogActions>
                <Button size="small" variant="contained" color="inherit" disabled={!open} {...cancelButtonProps}>
                    {payload.cancelText ?? 'Cancel'}
                </Button>
                <Button size="small" variant="contained" color={payload.severity} disabled={!open} {...okButtonProps}>
                    {payload.okText ?? 'Confirm'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}