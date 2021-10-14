import { Grid } from "@mui/material";
import React = require("react");
import { CSVLoader } from "../../Utility/Loaders/CSVLoader";
import { JSONLoader } from "../../Utility/Loaders/JSONLoader";
import DragAndDrop from "./DragAndDrop";

export var DatasetDrop = ({ onChange }) => {
    return <Grid container item alignItems="stretch" justifyContent="center" direction="column" style={{ padding: '16px' }}>
        <DragAndDrop accept="image/*" handleDrop={(files) => {
            if (files == null || files.length <= 0) {
                return;
            }

            var file = files[0]
            var fileName = file.name as string

            var reader = new FileReader()
            reader.onload = (event) => {
                var content = event.target.result

                if (fileName.endsWith('json')) {
                    new JSONLoader().resolveContent(content, onChange)
                } else {
                    new CSVLoader().resolveContent(content, onChange)
                }
            }

            reader.readAsText(file)
        }}>
            <div style={{ height: 200 }}></div>
        </DragAndDrop>
    </Grid>
}
