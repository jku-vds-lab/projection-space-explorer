import { createTheme, ThemeProvider } from "@mui/material";
import { PropsWithChildren } from "react";
import React = require("react");
import { Provider } from "react-redux";
import { applyMiddleware, createStore, Store } from "redux";
import { devToolsEnhancer } from "redux-devtools-extension";
import { API } from "./PluginScript";
import { rootReducer } from "./Store";

type PSEContextProps = {
    context?: API
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

    return store ? <Provider store={store}>
        <ThemeProvider theme={theme}>
            {children}
        </ThemeProvider>
    </Provider> : null
}





