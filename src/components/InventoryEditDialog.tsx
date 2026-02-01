import { Dialog, DialogTitle, IconButton, DialogContent, DialogActions, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { DialogProps, OpenDialogOptions } from "../types/dialog";
import type { InventoryMapModel } from "../types/inventory";
import { DraggableDialogPaperComponent } from "./DraggableDialogPaperComponent";

interface Payload extends OpenDialogOptions<void> {
    inventory?: InventoryMapModel;
    shelfCode: string;
}

type Props = DialogProps<Payload, void>;

export function InventoryEditDialog(props: Props) {
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
            <DialogTitle style={{ cursor: 'move' }}>{payload.inventory ? '编辑库存' : '新增库存'}</DialogTitle>
            <IconButton onClick={() => onClose()} sx={(theme) => ({ position: 'absolute', right: 8, top: 8, color: theme.palette.grey[500] })}>
                <CloseIcon />
            </IconButton>
            <DialogContent>

            </DialogContent>
            <DialogActions>
                <Button size="small" variant="contained">提交</Button>
            </DialogActions>
        </Dialog>
    );
}