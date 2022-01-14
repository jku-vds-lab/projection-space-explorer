import { Grid } from "@mui/material";
import React = require("react");
import { Dataset } from "../../..";
import { CSVLoader } from "../../Utility/Loaders/CSVLoader";
import { JSONLoader } from "../../Utility/Loaders/JSONLoader";
import DragAndDrop from "./DragAndDrop";
import Papa = require("papaparse");

export var DatasetDrop = ({ onChange }: { onChange(dataset: Dataset): void; }) => {
    return <Grid container item alignItems="stretch" justifyContent="center" direction="column" style={{ padding: '16px' }}>
        <DragAndDrop accept=".csv,.json,.sdf" handleDrop={(files) => {
            if (files == null || files.length <= 0) {
                return;
            }

            var file = files[0]
            var fileName = file.name as string

            if (fileName.endsWith('.csv')) {
                const rows = []
                var header = null

                Papa.parse(file, {
                    //@ts-ignore
                    worker: true,
                    skipEmptyLines: true,
                    step: function (results) {
                        if (!header) {
                            header = results.data

                            return;
                        }

                        const dict = {}
                        //@ts-ignore
                        results.data!.forEach((value, i) => {
                            dict[header[i]] = value
                        })

                        rows.push(dict)
                    },
                    complete: function (results) {
                        new CSVLoader().resolveVectors(rows, onChange)
                    }
                });
            } else {
                var reader = new FileReader()

                reader.onload = (event) => {
                    var content = event.target.result

                    if (fileName.endsWith('json')) {
                        new JSONLoader().resolveContent(content, onChange)
                    }
                }

                reader.readAsText(file)
            }
        }}>
            <div style={{ height: 200 }}></div>
        </DragAndDrop>
    </Grid>
}
