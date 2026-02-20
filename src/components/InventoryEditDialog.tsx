import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import type { DialogProps, OpenDialogOptions } from "../types/dialog";
import type { InventoryMapModel } from "../types/inventory";
import { DraggableDialogPaperComponent } from "./DraggableDialogPaperComponent";
import { dialogSlotProps } from "./props";
import { DialogCloseButton } from "./DialogCloseButton";
import { useRef } from "react";
import { InventoryEditForm } from "./InventoryEditForm";

interface Payload extends OpenDialogOptions<void> {
    inventory?: InventoryMapModel;
    shelfCode: string;
}

type Props = DialogProps<Payload, void>;

export function InventoryEditDialog(props: Props) {
    const { open, payload, onClose } = props;
    const formRef = useRef<{ submit: () => Promise<boolean> } | null>(null);

    const handleClick = async () => {
        if (formRef.current) {
            const b = await formRef.current.submit();
            if (b) {
                onClose();
            }
        }
    };

return (
        <Dialog maxWidth="xs" fullWidth open={open} PaperComponent={DraggableDialogPaperComponent} hideBackdrop disableEscapeKeyDown disableEnforceFocus slotProps={dialogSlotProps}>
            <DialogTitle style={{ cursor: 'move' }}>{payload.inventory ? 'Edit Inventory' : 'Add Inventory'}</DialogTitle>
            <DialogCloseButton close={onClose} />
            <DialogContent>
                <InventoryEditForm ref={formRef} shelfCode={payload.shelfCode} inventory={payload.inventory} />
            </DialogContent>
            <DialogActions>
                <Button size="small" variant="contained" onClick={handleClick}>Submit</Button>
            </DialogActions>
        </Dialog>
    );
}