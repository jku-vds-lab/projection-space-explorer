import { Box, Button, CircularProgress, Container, Dialog, DialogActions, DialogContent, DialogTitle, LinearProgress, RadioGroup, Typography } from "@mui/material";
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
    const [finished, setFinished] = React.useState(false)

    React.useEffect(() => {
        if (job) {
            job.start((result) => {
                setFinished(true)
                onFinish(result)
            }, (progress) => { setProgress(progress) })
        }
    }, [job])

    return (
        <Dialog
            disableEscapeKeyDown
            maxWidth="xs"
            aria-labelledby="confirmation-dialog-title"
            open={job != null}
            fullWidth={true}
        >
            <DialogTitle id="confirmation-dialog-title">Download Progress</DialogTitle>
            <DialogContent dividers>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Box position="relative" display="inline-flex" m={2}>
                        <CircularProgress size="128px" />
                        <Box
                            top={0}
                            left={0}
                            bottom={0}
                            right={0}
                            position="absolute"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        >

                            <Typography variant="caption" component="div" color="textSecondary">{`${Math.round(
                                (progress / 1000)
                            )}kb`}</Typography>
                        </Box>
                    </Box>
                </div>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={() => { job.terminate(); onCancel() }} color="primary">
                    Cancel
            </Button>
            </DialogActions>
        </Dialog>
    )
}