import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import type { DialogProps, OpenDialogOptions } from "../types/dialog";
import type { InventoryMapModel } from "../types/inventory";
import { DraggableDialogPaperComponent } from "./DraggableDialogPaperComponent";
import { dialogSlotProps } from "./props";
import { DialogCloseButton } from "./DialogCloseButton";

interface Payload extends OpenDialogOptions<void> {
    inventory?: InventoryMapModel;
    shelfCode: string;
}

type Props = DialogProps<Payload, void>;

export function InventoryEditDialog(props: Props) {
    const { open, payload, onClose } = props;

    return (
        <Dialog maxWidth="xs" fullWidth open={open} PaperComponent={DraggableDialogPaperComponent} hideBackdrop disableEscapeKeyDown disableEnforceFocus slotProps={dialogSlotProps}>
            <DialogTitle style={{ cursor: 'move' }}>{payload.inventory ? '编辑库存' : '新增库存'}</DialogTitle>
            <DialogCloseButton close={onClose} />
            <DialogContent>

            </DialogContent>
            <DialogActions>
                <Button size="small" variant="contained">提交</Button>
            </DialogActions>
        </Dialog>
    );
}