import { Box, Button, Checkbox, FormControlLabel, Popover, Switch, Typography } from "@material-ui/core";
import React = require("react");
import { connect, ConnectedProps } from "react-redux";
import { setAggregationAction } from "../../Ducks/AggregationDuck";
import { setGenericFingerprintAttributes } from "../../Ducks/GenericFingerprintAttributesDuck";
import { setHoverWindowMode, WindowMode } from "../../Ducks/HoverSettingsDuck";
import { SelectionClusters } from "../../Overlays/SelectionClusters/SelectionClusters";
import { RootState } from "../../Store/Store";
import { VirtualColumn, VirtualTable } from "../../UI/VirtualTable";

const mapStateToProps = (state: RootState) => ({
    hoverSettings: state.hoverSettings,
    currentAggregation: state.currentAggregation,
    dataset: state.dataset
})

const mapDispatchToProps = dispatch => ({
    setHoverWindowMode: value => dispatch(setHoverWindowMode(value)),
    setAggregation: value => dispatch(setAggregationAction(value))
})

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
    hoverUpdate
}


export const DetailsTabPanel = connector(({ hoverSettings, setHoverWindowMode, hoverUpdate, setAggregation, currentAggregation, dataset }: Props) => {
    const handleChange = (_, value) => {
        setHoverWindowMode(value ? WindowMode.Extern : WindowMode.Embedded)
    }



    return <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box paddingLeft={2} paddingTop={2}>
            {/* TODO: Cluster count not working */}
            <Typography color={"textSecondary"} variant="body2">Selected <b>{currentAggregation.aggregation.length}</b> out of <b>{dataset && dataset.vectors.length}</b> items in <b>{currentAggregation.selectedClusters.length}</b> Groups</Typography>

            <FormControlLabel
                control={<Switch checked={hoverSettings.windowMode == WindowMode.Extern} onChange={handleChange} name="checkedA" />}
                label="External Selection Summary"
            />

            <Button variant="outlined" onClick={() => { setAggregation([]) }}>Clear Selection</Button>

            <AttributeTable></AttributeTable>
        </Box>

        <SelectionClusters hoverUpdate={hoverUpdate}></SelectionClusters>
    </div>
})
























const attributeConnector = connect(
    (state: RootState) => ({
        genericFingerprintAttributes: state.genericFingerprintAttributes
    }),
    dispatch => ({
        setGenericFingerprintAttributes: genericFingerprintAttributes => dispatch(setGenericFingerprintAttributes(genericFingerprintAttributes)),
    })
    , null, { forwardRef: true });

type AttributeTablePropsFromRedux = ConnectedProps<typeof attributeConnector>

type AttributeTableProps = AttributeTablePropsFromRedux



const AttributeTable = attributeConnector(({ genericFingerprintAttributes, setGenericFingerprintAttributes }: AttributeTableProps) => {
    const [anchorEl, setAnchorEl] = React.useState(null)

    const fingerprintAttributes = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const booleanRenderer = (row: any) => {
        return <Checkbox disableRipple checked={row['show']} onChange={(event) => {
            row['show'] = event.target.checked
            setGenericFingerprintAttributes([...genericFingerprintAttributes])
        }}></Checkbox>
    }

    return <div>
        <Button variant="outlined" onClick={fingerprintAttributes}>Fingerprint Attributes</Button>

        <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
        >
            <VirtualTable rows={genericFingerprintAttributes} rowHeight={35} tableHeight={300}>
                <VirtualColumn width={150} name="Feature" renderer={(row) => strrenderer("feature", row)}></VirtualColumn>
                <VirtualColumn width={50} name="Show" renderer={(row) => booleanRenderer(row)}></VirtualColumn>
            </VirtualTable>
        </Popover>
    </div>
})



const strrenderer = (name: string, row: any) => {
    return <div>{row[name]}</div>
}