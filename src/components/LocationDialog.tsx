import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, Typography } from "@mui/material";
import type { DialogProps, OpenDialogOptions } from "../types/dialog";
import { DraggableDialogPaperComponent } from "./DraggableDialogPaperComponent";
import { useAtom, useAtomValue } from "jotai";
import { locationsAtom, shelvesAtom, inventoriesAtom, transportTasksAtom } from "../store";
import { getShelfModels, type LocationMapElementModel } from "../types/location";
import { getInventoryStatusName, getYesOrNo, transportTaskStatuses } from "../types/enums";
import { groupByMaterial, type InventoryMapModel } from "../types/inventory";
import { Fragment } from "react/jsx-runtime";
import { useDialog } from "../hooks/useDialog";
import { TransportTaskCreationDialog } from "./TransportTaskCreationDialog";
import { TransportTaskDetailDialog } from "./TransportTaskDetailDialog";
import { InventoryDialog } from "./InventoryDialog";
import { InventoryEditDialog } from "./InventoryEditDialog";
import { DialogCloseButton } from "./DialogCloseButton";
import { dialogSlotProps } from "./props";
import { TransportTasksDialog } from "./TransportTasksDialog";
import type { ShelfMapElementModel } from "../types/shelf";
import { ShelfEditionDialog } from "./ShelfEditionDialog";
import { LocationEditionDialog } from "./LocationEditionDialog";
import { getDisplayName } from "../utils";

interface Payload extends OpenDialogOptions<void> {
    code: string;
}

type Props = DialogProps<Payload, void>;

export function LocationDialog(props: Props) {
    const { open, payload, onClose } = props;
    const dialog = useDialog();
    const locations = useAtomValue(locationsAtom);
    const shelves = useAtomValue(shelvesAtom);
    const [inventories, setInventories] = useAtom(inventoriesAtom);
    const tasks = useAtomValue(transportTasksAtom);

    const location = locations.find(x => x.code == payload.code);
    const shelf = shelves.find(x => x.locationCode === payload.code);
    const shelfInventories = shelf ? inventories.filter(x => x.shelfCode === shelf.code) : [];
    const locationTasks = tasks.filter(x => x.startLocationCode === payload.code || x.endLocationCode === payload.code);

    const transferShelf = async (shelfCode: string) => {
        await dialog.open(TransportTaskCreationDialog, { shelfCode: shelfCode });
    };

    const transferShelfToHere = async () => {
        await dialog.open(TransportTaskCreationDialog, { toLocationCode: payload.code });
    };

    const viewTask = async () => {
        if (locationTasks.length === 1) {
            await dialog.open(TransportTaskDetailDialog, { code: locationTasks[0].code });
        } else if (locationTasks.length > 1) {
            await dialog.open(TransportTasksDialog, { status: transportTaskStatuses.executing, title: `Location ${payload.code} - Active Tasks`, tasks: locationTasks });
        }
    };

    const bindInventory = async (shelfCode: string) => {
        await dialog.open(InventoryEditDialog, { shelfCode: shelfCode });
    };

    const editInventory = async (shelfCode: string, inventory: InventoryMapModel) => {
        await dialog.open(InventoryEditDialog, { shelfCode: shelfCode, inventory: inventory });
    };

    const deleteInventory = async (inventory: InventoryMapModel) => {
        const confirmed = await dialog.confirm(`Are you sure you want to delete inventory ${inventory.code}?`, { severity: 'warning' });
        if (confirmed) {
            const arr = inventories.filter(x => x.code !== inventory.code);
            setInventories(arr);
        }
    };

    const viewInventories = async (shelfCode: string) => {
        await dialog.open(InventoryDialog, { shelfCode: shelfCode });
    };

    const editShelf = async (shelf: ShelfMapElementModel) => {
        await dialog.open(ShelfEditionDialog, { shelf: shelf });
    };

    const editLocation = async (location: LocationMapElementModel) => {
        await dialog.open(LocationEditionDialog, { location: location });
    };

    const shelfContent = shelf
        ? (
            <>
                <Grid size={12}>
                    <Divider />
                </Grid>
                <Grid size={4}>
                    <Typography variant="body1">Shelf Code</Typography>
                </Grid>
                <Grid size={8}>
                    <Typography variant="body2">{shelf.code}</Typography>
                </Grid>
                <Grid size={4}>
                    <Typography variant="body1">Shelf Model</Typography>
                </Grid>
                <Grid size={8}>
                    <Typography variant="body2">{shelf.model}</Typography>
                </Grid>
                <Grid size={4}>
                    <Typography variant="body1">Shelf Status</Typography>
                </Grid>
                <Grid size={8}>
                    <Typography variant="body2">Enabled {getYesOrNo(shelf.enabled)} | Locked {getYesOrNo(tasks.some(x => x.shelfCode === shelf.code))}</Typography>
                </Grid>
            </>
        )
        : null;

    const inventoriesContent = shelfInventories.length > 0
        ? (
            <>
                <Grid size={12}>
                    <Divider />
                </Grid>
                <Grid size={12}>
                    {shelfInventories.length === 1 ? <LocationInventoryPanel inventory={shelfInventories[0]} /> : <LocationInventoriesPanel inventories={shelfInventories} />}
                </Grid>
            </>
        )
        : null;

    const locationContent = location
        ? (
            <Grid container spacing={0.5} alignItems="center">
                <Grid size={4}>
                    <Typography variant="body1">Location</Typography>
                </Grid>
                <Grid size={8}>
                    <Typography variant="body2">{`${location.areaCode}/${location.code}`}</Typography>
                </Grid>
                <Grid size={4}>
                    <Typography variant="body1">Compatible Shelf Models</Typography>
                </Grid>
                <Grid size={8}>
                    <Typography variant="body2">{getShelfModels(location)}</Typography>
                </Grid>
                <Grid size={4}>
                    <Typography variant="body1">External Code</Typography>
                </Grid>
                <Grid size={8}>
                    <Typography variant="body2">{location.externalCode}</Typography>
                </Grid>
                <Grid size={4}>
                    <Typography variant="body1">Location Level</Typography>
                </Grid>
                <Grid size={8}>
                    <Typography variant="body2">{location.level}</Typography>
                </Grid>
                <Grid size={4}>
                    <Typography variant="body1">Location Status</Typography>
                </Grid>
                <Grid size={8}>
                    <Typography variant="body2">Enabled {getYesOrNo(location.enabled)} | Locked {getYesOrNo(tasks.some(x => x.endLocationCode === location.code))}</Typography>
                </Grid>

                {shelfContent}
                {inventoriesContent}
            </Grid>
        )
        : null;

    const buttons = [];
    if (!shelf) {
        if (location?.enabled === true && !locationTasks.some(x => x.endLocationCode === payload.code)) {
            buttons.push(<Button key="b0" size="small" variant="contained" color="inherit" onClick={transferShelfToHere}>Dispatch Shelf Here</Button>);
        }

        if (locationTasks.length > 0) {
            buttons.push(<Button key="b1" size="small" variant="contained" color="inherit" onClick={viewTask}>View Tasks</Button>);
        }
    } else {
        if (locationTasks.length === 0) {
            buttons.push(<Button key="b2" size="small" variant="contained" color="inherit" onClick={() => transferShelf(shelf.code)}>Dispatch Shelf</Button>);
        } else {
            if (locationTasks.length > 0) {
                buttons.push(<Button key="b3" size="small" variant="contained" color="inherit" onClick={viewTask}>View Tasks</Button>);
            }
        }

        if (shelfInventories.length === 0) {
            buttons.push(<Button key="b4" size="small" variant="contained" color="inherit" onClick={() => bindInventory(shelf.code)}>Add Inventory</Button>);
        } else if (shelfInventories.length === 1) {
            buttons.push(<Button key="b5" size="small" variant="contained" color="inherit" onClick={() => editInventory(shelf.code, shelfInventories[0])}>Edit Inventory</Button>);
            buttons.push(<Button key="b6" size="small" variant="contained" color="warning" onClick={() => deleteInventory(shelfInventories[0])}>Delete Inventory</Button>);
        } else {
            buttons.push(<Button key="b7" size="small" variant="contained" color="inherit" onClick={() => viewInventories(shelf.code)}>View Multiple Boxes</Button>);
        }

        if (locationTasks.length === 0) {
            buttons.push(<Button key="b8" size="small" variant="contained" color="inherit" onClick={() => editShelf(shelf)}>Edit Shelf</Button>);
        }
    }

    if (locationTasks.length === 0 && location) {
        buttons.push(<Button key="b9" size="small" variant="contained" color="inherit" onClick={() => editLocation(location)}>Edit Location</Button>);
    }

    return (
        <Dialog maxWidth="xs" fullWidth open={open} PaperComponent={DraggableDialogPaperComponent} hideBackdrop disableEscapeKeyDown disableEnforceFocus slotProps={dialogSlotProps}>
            <DialogTitle style={{ cursor: 'move' }}>{`Location ${payload.code}`}</DialogTitle>
            <DialogCloseButton close={onClose} />
            <DialogContent>
                {locationContent}
            </DialogContent>
            <DialogActions>
                {buttons}
            </DialogActions>
        </Dialog>
    );
}

function LocationInventoryPanel({ inventory }: { inventory: InventoryMapModel }) {
    return (
        <Grid container spacing={0.5} alignItems="center">
            <Grid size={4}>
                <Typography variant="body1">Box Label</Typography>
            </Grid>
            <Grid size={8}>
                <Typography variant="body2">{inventory.code}</Typography>
            </Grid>
            <Grid size={4}>
                <Typography variant="body1">Supplier</Typography>
            </Grid>
            <Grid size={8}>
                <Typography variant="body2">{getDisplayName(inventory.supplierCode, inventory.supplierName)}</Typography>
            </Grid>
            <Grid size={4}>
                <Typography variant="body1">Material</Typography>
            </Grid>
            <Grid size={8}>
                <Typography variant="body2">{getDisplayName(inventory.materialCode, inventory.materialName)}</Typography>
            </Grid>
            <Grid size={4}>
                <Typography variant="body1">Batch No.</Typography>
            </Grid>
            <Grid size={8}>
                <Typography variant="body2">{inventory.batchNo}</Typography>
            </Grid>
            <Grid size={4}>
                <Typography variant="body1">Quantity</Typography>
            </Grid>
            <Grid size={8}>
                <Typography variant="body2">{inventory.qty}</Typography>
            </Grid>
            <Grid size={4}>
                <Typography variant="body1">Status</Typography>
            </Grid>
            <Grid size={8}>
                <Typography variant="body2">{getInventoryStatusName(inventory.status)}</Typography>
            </Grid>
        </Grid>
    );
}

function LocationInventoriesPanel({ inventories }: { inventories: InventoryMapModel[] }) {
    const groups = groupByMaterial(inventories);
    const elements = [];
    for (const item of groups) {
        elements.push(
            <Fragment key={item[0]}>
                <Grid size={4}>
                    <Typography variant="body1">Material</Typography>
                </Grid>
                <Grid size={8}>
                    <Typography variant="body2">{getDisplayName(item[0], item[1][0].materialName)} x{item[1].length}</Typography>
                </Grid>
            </Fragment>
        );
    }

    return (
        <Grid container spacing={0.5} alignItems="center">
            {elements}
        </Grid>
    );
}