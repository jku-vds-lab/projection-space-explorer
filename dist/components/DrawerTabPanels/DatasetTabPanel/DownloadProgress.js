"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const material_1 = require("@mui/material");
const React = require("react");
const react_redux_1 = require("react-redux");
const mapStateToProps = (state) => ({});
const mapDispatchToProps = dispatch => ({});
const connector = react_redux_1.connect(mapStateToProps, mapDispatchToProps);
function DownloadProgress({ job, onFinish, onCancel }) {
    const [progress, setProgress] = React.useState(0);
    const [finished, setFinished] = React.useState(false);
    React.useEffect(() => {
        if (job) {
            job.start((result) => {
                setFinished(true);
                onFinish(result);
            }, (progress) => { setProgress(progress); });
        }
    }, [job]);
    return (React.createElement(material_1.Dialog, { disableEscapeKeyDown: true, maxWidth: "xs", "aria-labelledby": "confirmation-dialog-title", open: job != null, fullWidth: true },
        React.createElement(material_1.DialogTitle, { id: "confirmation-dialog-title" }, "Download Progress"),
        React.createElement(material_1.DialogContent, { dividers: true },
            React.createElement("div", { style: { display: 'flex', justifyContent: 'center' } },
                React.createElement(material_1.Box, { position: "relative", display: "inline-flex", m: 2 },
                    React.createElement(material_1.CircularProgress, { size: "128px" }),
                    React.createElement(material_1.Box, { top: 0, left: 0, bottom: 0, right: 0, position: "absolute", display: "flex", alignItems: "center", justifyContent: "center" },
                        React.createElement(material_1.Typography, { variant: "caption", component: "div", color: "textSecondary" }, `${Math.round((progress / 1000))}kb`))))),
        React.createElement(material_1.DialogActions, null,
            React.createElement(material_1.Button, { autoFocus: true, onClick: () => { job.terminate(); onCancel(); }, color: "primary" }, "Cancel"))));
}
exports.DownloadProgress = DownloadProgress;
