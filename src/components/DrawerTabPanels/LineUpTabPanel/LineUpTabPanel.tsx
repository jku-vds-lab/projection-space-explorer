import { Typography } from "@material-ui/core";
import { Box, Button, FormControlLabel, Switch } from "@mui/material";
import React = require("react");
import { connect, ConnectedProps } from "react-redux";
import { setLineUpInput_filter, setLineUpInput_visibility } from "../../Ducks/LineUpInputDuck";
import { RootState } from "../../Store/Store";
import GetAppIcon from '@material-ui/icons/GetApp';

const mapStateToProps = (state: RootState) => ({
    dataset: state.dataset,
    currentAggregation: state.currentAggregation,
    lineUpInput: state.lineUpInput
})

const mapDispatchToProps = dispatch => ({
    setLineUpInput_visibility: value => dispatch(setLineUpInput_visibility(value)),
    setLineUpInput_filter: value => dispatch(setLineUpInput_filter(value)),
})

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
    splitRef: any
}


export const LineUpTabPanel = connector(({ setLineUpInput_visibility, setLineUpInput_filter, lineUpInput, dataset, currentAggregation, splitRef }: Props) => {
    const handleChange = (_, value) => {

    }

    const onLoad = (filter) => {
        setLineUpInput_visibility(true);
        setLineUpInput_filter(filter);

        const curr_sizes = splitRef.current.split.getSizes();
        if(curr_sizes[1] < 2){
            splitRef.current.split.setSizes([curr_sizes[0], 70])
        }
    }


    
    // https://stackoverflow.com/questions/31214677/download-a-reactjs-object-as-a-file
    const downloadImpl = (data: string, name: string, mimetype: string) => {
        var b = new Blob([data], {type: mimetype});
        var csvURL = window.URL.createObjectURL(b);
        let tempLink = document.createElement('a');
        tempLink.href = csvURL;
        tempLink.setAttribute('download', name);
        tempLink.click();
    };
    
    const exportCSV = () => {
        if(lineUpInput.lineup && lineUpInput.lineup.data){
            // exports all data that is currently shown in the table -> filters and sorts are applied! also annotations are included
            lineUpInput.lineup!.data.exportTable(lineUpInput.lineup!.data.getRankings()[0], {separator: ","}).then(x => downloadImpl(x, `lineup-export.csv`, 'application/csv'))
        }
    }

    let [cell_value_vis, set_cell_value_vis] = React.useState(false);


    React.useEffect(() => {
        let style = document.getElementById('cell_value_vis')
        if(!style){
            style = document.createElement('style');
            style.setAttribute("id", "cell_value_vis");
            style.setAttribute("type", "text/css");
            const head = document.head || document.getElementsByTagName('head')[0];
            head.appendChild(style);
        }

        const css = cell_value_vis ? '.lu-hover-only { visibility: visible; }' : '.lu-hover-only { visibility: hidden; }';
        // @ts-ignore
        if (style.styleSheet){
        // This is required for IE8 and below.
            // @ts-ignore
            style.styleSheet.cssText = css;
        } else {
            style.innerHTML = "";
            style.appendChild(document.createTextNode(css));
        }

    }, [cell_value_vis])

    const toggleVis = () => {
        set_cell_value_vis(() => { return !cell_value_vis })
    }

    return <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box paddingLeft={2} paddingTop={1} paddingRight={2}>
            <Typography variant="subtitle2" gutterBottom>
                LineUp Settings
            </Typography>
        </Box>
        <Box paddingLeft={2} paddingTop={1} paddingRight={2}>
            {/* <FormControlLabel
                control={<Switch checked={true} onChange={handleChange} name="checkedA" />}
                label="External Selection Summary"
            /> */}

            <Button fullWidth style={{ marginRight: 2}} variant="outlined" onClick={() => onLoad({'reset': true})}>Load All</Button>

        </Box>
        <Box paddingLeft={2} paddingTop={1} paddingRight={2}>
            <Button fullWidth variant="outlined" onClick={() => onLoad({'selection': currentAggregation.aggregation})}>Load Selection</Button>
        </Box>
        <Box paddingLeft={2} paddingTop={1} paddingRight={2}>
            <FormControlLabel
                control={<Switch color="primary" value={cell_value_vis} onChange={(event) => {
                    toggleVis()
                }} />}
                label="Show Cell Values"
            />
        </Box>
        <Box paddingLeft={2} paddingTop={1} paddingRight={2}>
            <Button fullWidth variant="outlined" onClick={() => { exportCSV() }}><GetAppIcon/>&nbsp;Export CSV</Button> 
        </Box>
    </div>
})