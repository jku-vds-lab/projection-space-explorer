import * as React from 'react';
import { usePromiseTracker } from "react-promise-tracker";
import Loader from 'react-loader-spinner';
import { Button, Dialog, DialogActions, DialogContent } from '@mui/material';


export const LoadingIndicatorView = props => {
    const { promiseInProgress } = usePromiseTracker({area: props.area});
    return (
        promiseInProgress && 
            <div
              style={{
                width: "100%",
                height: "100",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Loader type="ThreeDots" color="#2BAD60" height="100" width="100" />
            </div>
    );  
}

export const LoadingIndicatorDialog = props => {
    const { promiseInProgress } = usePromiseTracker({area: props.area});
    
    return <Dialog maxWidth='lg' open={promiseInProgress}> {/*onClose={props.handleClose} */}
        <DialogContent>
            <LoadingIndicatorView area={props.area}/>
        </DialogContent>
        <DialogActions>
            <Button onClick={props.handleClose}>
                Cancel
            </Button>
        </DialogActions>
    </Dialog>
}