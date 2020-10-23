import { SvgIcon } from "@material-ui/core"
import React = require("react")

export const ClusterIcon = () => {
    return <SvgIcon style={{ fontSize: 48 }} viewBox={"0 0 48 48"}>
        <circle cx="40" cy="25" r="5" stroke="black" strokeWidth="2" fill="red" />
        <circle cx="28" cy="34" r="5" stroke="black" strokeWidth="2" fill="red" />
        <circle cx="40" cy="40" r="5" stroke="black" strokeWidth="2" fill="red" />
        <rect x="8" y="7" width="8" height="8" strokeWidth="2" fill="yellow" stroke="black" />
        <rect x="10" y="20" width="8" height="8" strokeWidth="2" fill="yellow" stroke="black" />
        <rect x="23" y="6" width="8" height="8" strokeWidth="2" fill="yellow" stroke="black" />
        <line x1="1.5" y1="0" x2="1.5" y2="48" strokeWidth="3" stroke="black" />
        <line x1="1.5" y1="46.5" x2="48" y2="46.5" strokeWidth="3" stroke="black" />
        <line x1="10" y1="42" x2="48" y2="0" strokeWidth="3" stroke="black" />
    </SvgIcon>
}