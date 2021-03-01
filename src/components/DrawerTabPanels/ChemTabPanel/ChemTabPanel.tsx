import { Box } from "@material-ui/core";
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


export const ChemTabPanel = connector(({  }: Props) => {
    
    return <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box paddingLeft={2} paddingTop={2}>
            TODO
        </Box>

    </div>
})