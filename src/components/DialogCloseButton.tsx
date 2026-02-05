import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export function DialogCloseButton({ close }: { close: () => Promise<void>; }) {
    return (
        <IconButton onClick={close} sx={(theme) => ({ position: 'absolute', right: 8, top: 8, color: theme.palette.grey[500] })}>
            <CloseIcon />
        </IconButton>
    );
}