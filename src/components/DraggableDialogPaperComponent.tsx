import { Paper, type PaperProps } from "@mui/material";
import { useRef, } from "react";
import Draggable from "react-draggable";

export function DraggableDialogPaperComponent(props: PaperProps) {
    const nodeRef = useRef<HTMLDivElement>(null);

    return (
        <Draggable nodeRef={nodeRef} bounds="parent" cancel={'[class*="MuiDialogContent-root"]'}>
            <Paper style={{ cursor: 'default' }} {...props} ref={nodeRef} />
        </Draggable>
    );
}