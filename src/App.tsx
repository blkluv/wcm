import { CssBaseline } from "@mui/material";
import { createBrowserRouter, RouterProvider } from 'react-router';
import { Home } from "./pages/home/Home";
import { DialogsProvider } from "./hooks/DialogsProvider";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import { useEffect } from "react";
import { Editor } from "./pages/editor/Editor";

const router = createBrowserRouter([
    {
        children: [
            {
                path: '/editor',
                Component: Editor
            },
            {
                path: '*',
                Component: Home
            }
        ]
    }
]);

export function App() {
    useEffect(() => {
        const handleRejection = (event: PromiseRejectionEvent) => {
            event.preventDefault();
            const message =
                event.reason instanceof Error
                    ? event.reason.message
                    : typeof event.reason === 'string'
                        ? event.reason
                        : 'An unknown error occurred, please try again later.';
            enqueueSnackbar(message, { variant: 'error' });
        };

        const handleError = (event: ErrorEvent) => {
            event.preventDefault();
            enqueueSnackbar(event.message, { variant: 'error' });
        };

        window.addEventListener('unhandledrejection', handleRejection);
        window.addEventListener('error', handleError);

        return () => {
            window.removeEventListener('unhandledrejection', handleRejection);
            window.removeEventListener('error', handleError);
        };
    }, []);

    return (
        <>
            <CssBaseline enableColorScheme />
            <SnackbarProvider maxSnack={5} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} />
            <DialogsProvider>
                <RouterProvider router={router} />
            </DialogsProvider>
        </>
    );
}