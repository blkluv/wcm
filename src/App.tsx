import { CssBaseline } from "@mui/material";
import { createBrowserRouter, RouterProvider } from 'react-router';
import { Home } from "./pages/home/Home";
import { DialogsProvider } from "./hooks/DialogsProvider";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import { useEffect } from "react";

const router = createBrowserRouter([
    {
        children: [
            {
                path: '*',
                Component: Home,
            },
        ],
    },
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
                        : '发生未知错误，请稍后重试';
            enqueueSnackbar(message, { anchorOrigin: { vertical: 'top', horizontal: 'center' }, variant: 'error' });
        };

        const handleError = (event: ErrorEvent) => {
            event.preventDefault();
            enqueueSnackbar(event.message, { anchorOrigin: { vertical: 'top', horizontal: 'center' }, variant: 'error' });
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
            <SnackbarProvider maxSnack={5} />
            <DialogsProvider>
                <RouterProvider router={router} />
            </DialogsProvider>
        </>
    );
}