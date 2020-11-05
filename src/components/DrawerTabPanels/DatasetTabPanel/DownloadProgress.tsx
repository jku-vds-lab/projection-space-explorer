import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, LinearProgress, RadioGroup, Typography } from "@material-ui/core";
import React = require("react");
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../Store/Store";
import { DownloadJob } from "./DownloadJob";

const mapStateToProps = (state: RootState) => ({
})

const mapDispatchToProps = dispatch => ({
})

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
    job: DownloadJob
    onFinish: any
    onCancel: any
}

export function DownloadProgress({ job, onFinish, onCancel }: Props) {
    const [progress, setProgress] = React.useState(0)

    React.useEffect(() => {
        if (job) {
            job.start((result) => {
                onFinish(result)
            }, (progress) => { setProgress(progress) })
        }
    }, [job])

    return (
        <Dialog
            disableBackdropClick
            disableEscapeKeyDown
            maxWidth="xs"
            aria-labelledby="confirmation-dialog-title"
            open={job != null}
            fullWidth={true}
        >
            <DialogTitle id="confirmation-dialog-title">Download Progress</DialogTitle>
            <DialogContent dividers>
                <Box display="flex" alignItems="center">
                    <Box width="100%" mr={1}>
                        <LinearProgress variant="determinate" value={progress * 100} />
                    </Box>
                    <Box minWidth={35}>
                        <Typography variant="body2" color="textSecondary">{`${Math.round(
                            progress * 100
                        )}%`}</Typography>
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={() => { job.terminate(); }} color="primary">
                    Cancel
            </Button>
            </DialogActions>
        </Dialog>
    )
}