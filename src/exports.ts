import { PSEContextProvider } from "./components/Store/PSEContext";
import { Application, tryIt } from ".";
import { PluginRegistry, API } from "./components/Store/PluginScript";
import { HoverTabPanel } from "./components/DrawerTabPanels/HoverTabPanel/HoverTabPanel";
const r = require('react')
const k = require('react-dom')

console.log(r)
// @ts-ignore
window.Test = r
// @ts-ignore
window.Test2 = k








export {PSEContextProvider, Application, PluginRegistry, HoverTabPanel, API, tryIt}