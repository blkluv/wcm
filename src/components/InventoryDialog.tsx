import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { DialogProps, OpenDialogOptions } from "../types/dialog";
import { DraggableDialogPaperComponent } from "./DraggableDialogPaperComponent";

interface Payload extends OpenDialogOptions<void> {
    shelfCode: string;
}

type Props = DialogProps<Payload, void>;

export function InventoryDialog(props: Props) {
    const { open, payload, onClose } = props;

    return (
        <Dialog maxWidth="xs" fullWidth open={open} PaperComponent={DraggableDialogPaperComponent} hideBackdrop disableEscapeKeyDown
            slotProps={{
                root: {
                    sx: {
                        pointerEvents: 'none'
                    }
                },
                paper: {
                    sx: {
                        pointerEvents: 'auto'
                    }
                }
            }}>
            <DialogTitle style={{ cursor: 'move' }}>货架 {payload.shelfCode} 库存详情</DialogTitle>
            <IconButton onClick={() => onClose()} sx={(theme) => ({ position: 'absolute', right: 8, top: 8, color: theme.palette.grey[500] })}>
                <CloseIcon />
            </IconButton>
            <DialogContent>

            </DialogContent>
            <DialogActions>
                <Button size="small" variant="contained" color="inherit">新增库存</Button>
                <Button size="small" variant="contained" color="inherit">编辑库存</Button>
                <Button size="small" variant="contained" color="warning">删除库存</Button>
            </DialogActions>
        </Dialog>
    );
}