import { makeStyles, Typography, Tabs, Tab, TextField, Box } from "@material-ui/core";
import React = require("react");

const useStylesProjectionSettings = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
        height: 224,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2
    },
    tabs: {
        borderRight: `1px solid ${theme.palette.divider}`,
    },
    panel: {
    }
}));


function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && <Box p={3}>{children}</Box>}
        </Typography>
    );
}

function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}


/**
 * Radio group with projection settings based on projection method.
 */
export var ProjectionSettings = ({ method, setMethod,
    learningRate, perplexity,
    setLearningRate, setPerplexity,
    nNeighbors, setNNeighbors }) => {
    const classes = useStylesProjectionSettings();

    return (
        <div className={classes.root}>
            <Tabs
                orientation="vertical"
                variant="scrollable"
                value={method}
                onChange={(event, newValue) => setMethod(newValue)}
                aria-label="Vertical tabs example"
                className={classes.tabs}
            >
                <Tab label="t-SNE" {...a11yProps(0)} />
                <Tab label="UMAP" {...a11yProps(1)} />
            </Tabs>
            <TabPanel value={method} index={0} className={classes.panel}>
                <div>

                    <TextField
                        id="standard-number"
                        label="Perplexity"
                        type="number"
                        value={perplexity}
                        onChange={(e) => setPerplexity(e.target.value)}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />

                </div>
                <div>

                    <TextField
                        id="standard-number"
                        label="Learning Rate"
                        type="number"
                        value={learningRate}
                        onChange={(e) => setLearningRate(e.target.value)}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />

                </div>
            </TabPanel>
            <TabPanel value={method} index={1} className={classes.panel}>
                <TextField
                    id="standard-number"
                    label="n Neighbors"
                    type="number"
                    value={nNeighbors}
                    onChange={(e) => setNNeighbors(e.target.value)}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </TabPanel>
        </div>
    );
}