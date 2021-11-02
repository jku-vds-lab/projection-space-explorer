import { createTheme, ThemeProvider } from "@mui/material";
import { PropsWithChildren } from "react";
import React = require("react");
import { Provider } from "react-redux";
import { Store } from "redux";
import { API } from "./PluginScript";

type PSEContextProps = {
    context?: API<any>
    onStateChanged?: (values: any, keys: any) => void
}

const theme = createTheme({
    palette: {
        primary: {
            // light: will be calculated from palette.primary.main,
            main: '#007dad',
            // dark: will be calculated from palette.primary.main,
            // contrastText: will be calculated to contrast with palette.primary.main
        }
    }
})








export function PSEContextProvider({ context, children, onStateChanged }: PropsWithChildren<PSEContextProps>) {
    const [store, setStore] = React.useState<Store>(null)

    React.useEffect(() => {
        if (context) {
            setStore(context.store)
        } else {
            setStore(null)
        }
    }, [context])

    return store ? <ThemeProvider theme={theme}>
        <Provider store={store}>
            {children}
        </Provider>
    </ThemeProvider> : null
}




