import { Box, Typography } from "@material-ui/core";
import React = require("react");
import { AVector, IVector } from "../../../model/Vector";
import { CSVLoader } from "../../Utility/Loaders/CSVLoader";
import { JSONLoader } from "../../Utility/Loaders/JSONLoader";
import { LoadingIndicatorDialog } from "../../Utility/Loaders/LoadingIndicator";
import { SDFLoader } from "../../Utility/Loaders/SDFLoader";
import { DatasetDrop } from "./DatasetDrop";
import { DownloadJob } from "./DownloadJob";
import { DownloadProgress } from "./DownloadProgress";
import { PredefinedDatasets } from "./PredefinedDatasets";
import { SDFModifierDialog } from "./SDFModifierDialog";
import * as frontend_utils from "../../../utils/frontend-connect";
import { useCancellablePromise } from "../../../utils/promise-helpers";

var d3v5 = require('d3')

function convertFromCSV(vectors) {
    return vectors.map(vector => {
        return AVector.create(vector)
    })
}

export function DatasetTabPanel({ onDataSelected }) {
    const [job, setJob] = React.useState(null)
    const [entry, setEntry] = React.useState(null);
    const [openSDFDialog, setOpen] = React.useState(false);
    const [refreshUploadedFiles, setRefreshUploadedFiles] = React.useState(0);

    const { cancellablePromise, cancelPromises } = useCancellablePromise();
    let abort_controller = new AbortController();

    function onModifierDialogClose(modifiers) {
        setOpen(false);
        if (modifiers !== null) {
            abort_controller = new AbortController();
            new SDFLoader().resolvePath(entry, onDataSelected, cancellablePromise, modifiers, abort_controller);
        }
    }

    let predefined = <PredefinedDatasets onChange={(entry) => {
        if (entry.path.endsWith('sdf')) {
            setEntry(entry);
            setOpen(true);
        } else {
            setJob(new DownloadJob(entry))
        }
    }} ></PredefinedDatasets>


    return <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>


        <Box paddingLeft={2} paddingTop={2}>
            <Typography variant="subtitle2" gutterBottom>{'Custom Datasets (Drag and Drop)'}</Typography>
        </Box>


        <DatasetDrop
            onChange={(var1, var2) => {
                onDataSelected(var1, var2);
            }}
            cancellablePromise={cancellablePromise}
            abort_controller={abort_controller} />



        <Box paddingLeft={2} paddingTop={2}>
            <Typography variant="subtitle2" gutterBottom>{'Predefined Datasets'}</Typography>
        </Box>
        {predefined}



        <DownloadProgress job={job} onFinish={(result) => {
            if (job.entry.path.endsWith('json')) {
                new JSONLoader().resolve(JSON.parse(result), onDataSelected, job.entry.type, job.entry)
            } else {
                new CSVLoader().resolve(onDataSelected, convertFromCSV(d3v5.csvParse(result)), job.entry.type, job.entry)
            }

            setJob(null)
        }} onCancel={() => { setJob(null) }}></DownloadProgress>



        <LoadingIndicatorDialog handleClose={() => { cancelPromises(); }} area={"global_loading_indicator"} />
        <SDFModifierDialog openSDFDialog={openSDFDialog} handleClose={onModifierDialogClose}></SDFModifierDialog>
    </div>
}

