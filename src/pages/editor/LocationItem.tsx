import { Paper, Stack, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { LocationMapElementModel } from "../../types/location";
import type { ShelfMapElementModel } from "../../types/shelf";
import { groupByMaterial, type InventoryMapModel } from "../../types/inventory";
import { useDrag } from "react-dnd";

interface Props {
    location: LocationMapElementModel;
    shelf?: ShelfMapElementModel;
    inventories: InventoryMapModel[];
}

export function LocationItem(props: Props) {
    const { location, shelf, inventories } = props;

    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'location',
        item: { code: location.code },
        // end: (item, monitor) => {
        //     const dropResult = monitor.getDropResult<{ code: string, offset: { x: number; y: number; } | null }>();
        //     if (item && dropResult) {

        //     }
        // },
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        })
    }));

    const elements = [];
    if (inventories.length === 1) {
        elements.push(<Typography key={inventories[0].code} variant="body2">{inventories[0].materialCode}</Typography>);
    } else if (inventories.length > 1) {
        const groups = groupByMaterial(inventories);
        for (const item of groups) {
            elements.push(<Typography key={item[0]} variant="body2" style={{ fontSize: '10px' }}>{item[0]} X{item[1].length}</Typography>);
        }
    }

    let closeIcon = null;
    if (!location.enabled || shelf?.enabled === false) {
        closeIcon = (
            <div style={{ position: 'absolute', width: `100px`, height: `100px`, opacity: 0.5 }}>
                <CloseIcon color="warning" style={{ fontSize: `100px` }} />
            </div>
        );
    }

    return (
        <Paper ref={drag as unknown as React.Ref<HTMLDivElement>} elevation={0} variant="outlined" style={{ width: `100px`, height: `100px`, cursor: 'move', userSelect: 'none', opacity: `${isDragging ? 0.4 : 1}` }} data-location-code={location.code}>
            <div style={{ width: `${location.w}px`, height: `${location.h}px`, position: 'relative', alignContent: 'center' }}>
                {closeIcon}
                <Stack spacing={0} alignItems="center" justifyItems="flex-start" style={{ height: '100%' }}>
                    <Typography variant="subtitle1">{location.code}</Typography>
                    {shelf ? <Typography variant="body2">{shelf.code}</Typography> : null}
                    {elements}
                </Stack>
            </div>
        </Paper>
    );
}