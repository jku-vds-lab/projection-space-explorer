import { SvgIcon } from "@material-ui/core"
import React = require("react")

export const PointsIcon = () => {
    return <SvgIcon style={{ fontSize: 48 }} viewBox={"0 0 48 48"}>
        <circle cx="10" cy="10" r="5" stroke="black" strokeWidth="3" fill="black" />
        <circle cx="40" cy="22" r="5" stroke="black" strokeWidth="3" fill="black" />
        <circle cx="15" cy="35" r="5" stroke="black" strokeWidth="3" fill="black" />
        <line x1="10" y1="10" x2="40" y2="22" stroke="black" strokeWidth="3" />
    </SvgIcon>
}