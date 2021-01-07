import React = require("react");
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../Store/Store";

const mapStateToProps = (state: RootState) => ({
})

const mapDispatchToProps = dispatch => ({
})

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
}


export const HoverTabPanel = connector((props: Props) => {
    return <div></div>
})