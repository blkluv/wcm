import { Button, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItemButton, Typography } from "@mui/material";
import type { DialogProps, OpenDialogOptions } from "../types/dialog";
import { DraggableDialogPaperComponent } from "./DraggableDialogPaperComponent";
import { DialogCloseButton } from "./DialogCloseButton";
import { dialogSlotProps } from "./props";
import { inventoriesAtom } from "../store";
import { useAtom } from "jotai";
import type { InventoryMapModel } from "../types/inventory";
import { useState } from "react";
import { useDialog } from "../hooks/useDialog";
import { InventoryEditDialog } from "./InventoryEditDialog";
import { getDisplayName } from "../utils";
import { getInventoryStatusName } from "../types/enums";

interface Payload extends OpenDialogOptions<void> {
    shelfCode: string;
}

type Props = DialogProps<Payload, void>;

export function InventoryDialog(props: Props) {
    const { open, payload, onClose } = props;
    const [inventory, setInventory] = useState<InventoryMapModel | null>(null);
    const [inventories, setInventories] = useAtom(inventoriesAtom);
    const dialog = useDialog();
    const shelfInventories = inventories.filter(x => x.shelfCode === payload.shelfCode);

    const bindInventory = async () => {
        await dialog.open(InventoryEditDialog, { shelfCode: payload.shelfCode });
    };

    const editInventory = async () => {
        if (inventory) {
            await dialog.open(InventoryEditDialog, { shelfCode: payload.shelfCode, inventory: inventory });
        }
    };

    const deleteInventory = async () => {
        if (inventory) {
            const confirmed = await dialog.confirm(`Are you sure you want to delete inventory ${inventory.code}?`, { severity: 'warning' });
            if (confirmed) {
                const arr = inventories.filter(x => x.code !== inventory.code);
                setInventories(arr);
                setInventory(null);
            }
        }
    };

    return (
        <Dialog maxWidth="xs" fullWidth open={open} PaperComponent={DraggableDialogPaperComponent} hideBackdrop disableEscapeKeyDown disableEnforceFocus slotProps={dialogSlotProps}>
            <DialogTitle style={{ cursor: 'move' }}>Shelf {payload.shelfCode} Inventory Details</DialogTitle>
            <DialogCloseButton close={onClose} />
            <DialogContent>
                <List>
                    {
                        shelfInventories.map(x => (
                            <ListItemButton key={x.code} onClick={() => setInventory(x)} selected={x === inventory} style={{ flexDirection: 'column', alignItems: 'start' }}>
                                <Typography variant="body1" align="left"><b>Box Label</b> {x.code}</Typography>
                                <Typography variant="body1" align="left"><b>Supplier</b> {getDisplayName(x.supplierCode, x.supplierName)}</Typography>
                                <Typography variant="body1" align="left"><b>Material</b> {getDisplayName(x.materialCode, x.materialName)}</Typography>
                                <Typography variant="body1" align="left"><b>Batch No.</b> {x.batchNo}</Typography>
                                <Typography variant="body1" align="left"><b>Quantity</b> {x.qty}</Typography>
                                <Typography variant="body1" align="left"><b>Status</b> {getInventoryStatusName(x.status)}</Typography>
                            </ListItemButton>
                        ))
                    }
                </List>
            </DialogContent>
            <DialogActions>
                <Button size="small" variant="contained" color="inherit" onClick={bindInventory}>Add Inventory</Button>
                <Button size="small" variant="contained" color="inherit" disabled={!inventory} onClick={editInventory}>Edit Inventory</Button>
                <Button size="small" variant="contained" color="warning" disabled={!inventory} onClick={deleteInventory}>Delete Inventory</Button>
            </DialogActions>
        </Dialog>
    );
}