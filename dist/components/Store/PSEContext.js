"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const material_1 = require("@mui/material");
const React = require("react");
const react_redux_1 = require("react-redux");
const theme = material_1.createTheme({
    palette: {
        primary: {
            // light: will be calculated from palette.primary.main,
            main: '#007dad',
        }
    }
});
function PSEContextProvider({ context, children, onStateChanged }) {
    const [store, setStore] = React.useState(null);
    React.useEffect(() => {
        if (context) {
            setStore(context.store);
        }
        else {
            setStore(null);
        }
    }, [context]);
    return store ? React.createElement(material_1.ThemeProvider, { theme: theme },
        React.createElement(react_redux_1.Provider, { store: store }, children)) : null;
}
exports.PSEContextProvider = PSEContextProvider;
