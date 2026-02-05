import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import type { DialogProps, OpenDialogOptions } from "../types/dialog";
import { DraggableDialogPaperComponent } from "./DraggableDialogPaperComponent";
import { DialogCloseButton } from "./DialogCloseButton";
import { dialogSlotProps } from "./props";

interface Payload extends OpenDialogOptions<void> {
    shelfCode: string;
}

type Props = DialogProps<Payload, void>;

export function InventoryDialog(props: Props) {
    const { open, payload, onClose } = props;

    return (
        <Dialog maxWidth="xs" fullWidth open={open} PaperComponent={DraggableDialogPaperComponent} hideBackdrop disableEscapeKeyDown disableEnforceFocus slotProps={dialogSlotProps}>
            <DialogTitle style={{ cursor: 'move' }}>货架 {payload.shelfCode} 库存详情</DialogTitle>
            <DialogCloseButton close={onClose} />
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