import { Button, Grid } from '@mui/material';
import * as React from 'react';

export type DragAndDropProps = {
  handleDrop: Function;
  accept: string;
};

export type DragAndDropState = {
  drag: boolean;
};

export class DragAndDrop extends React.Component<DragAndDropProps, DragAndDropState> {
  dropRef: any;

  fileInput: any;

  constructor(props) {
    super(props);

    this.state = {
      drag: false,
    };
    this.dropRef = React.createRef();
    this.fileInput = React.createRef();
  }

  componentDidMount() {
    const div = this.dropRef.current;
    div.addEventListener('dragenter', this.handleDragIn);
    div.addEventListener('dragleave', this.handleDragOut);
    div.addEventListener('dragover', this.handleDrag);
    div.addEventListener('drop', this.handleDrop);
  }

  componentWillUnmount() {
    const div = this.dropRef.current;
    div.removeEventListener('dragenter', this.handleDragIn);
    div.removeEventListener('dragleave', this.handleDragOut);
    div.removeEventListener('dragover', this.handleDrag);
    div.removeEventListener('drop', this.handleDrop);
  }

  handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  handleDragIn = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      this.setState({ drag: true });
    }
  };

  handleDragOut = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const rect = this.dropRef.current.getBoundingClientRect();
    if (e.clientY < rect.top || e.clientY >= rect.bottom || e.clientX < rect.left || e.clientX >= rect.right) {
      this.setState({ drag: false });
    }
  };

  handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ drag: false });

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      this.props.handleDrop(e.dataTransfer.files);
      // e.dataTransfer.clearData()
    }
  };

  render() {
    return (
      <div
        // id="master"
        style={{ display: 'inline-block', position: 'relative' }}
        ref={this.dropRef}
      >
        {this.state.drag ? (
          <div
            style={{
              border: 'dashed blue 2px',
              position: 'absolute',
              borderRadius: '4px',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
            }}
          >
            <Grid style={{ height: '100%' }} container direction="column" justifyContent="center" alignItems="center">
              <div
                style={{
                  textAlign: 'center',
                  color: 'grey',
                  fontSize: 24,
                }}
              >
                <div>Drop a file here</div>
              </div>
            </Grid>
          </div>
        ) : (
          <div
            style={{
              border: 'dashed grey 2px',
              position: 'absolute',
              borderRadius: '4px',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
            }}
          >
            <Grid style={{ height: '100%' }} container direction="column" justifyContent="center" alignItems="center">
              <input
                style={{ display: 'none' }}
                accept={this.props.accept}
                ref={this.fileInput}
                // multiple
                type="file"
                onChange={(e) => {
                  this.props.handleDrop(e.target.files);
                }}
              />
              <Button variant="outlined" component="span" onClick={() => this.fileInput.current.click()}>
                Open file
              </Button>

              <div
                style={{
                  textAlign: 'center',
                  color: 'grey',
                  fontSize: 24,
                }}
              >
                <div>Drop a file here</div>
              </div>
            </Grid>
          </div>
        )}
        {this.props.children}
      </div>
    );
  }
}
export default DragAndDrop;
