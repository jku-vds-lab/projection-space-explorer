import { debounce } from 'lodash';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

function copyStyles(sourceDoc: Document, targetDoc: Document) {
  Array.from(targetDoc.querySelectorAll('style')).forEach((e) => e.remove());
  Array.from(targetDoc.querySelectorAll('link')).forEach((e) => e.remove());

  Array.from(sourceDoc.styleSheets).forEach((styleSheet) => {
    // @ts-ignore
    if (styleSheet.href) {
      const newLinkEl = sourceDoc.createElement('link');

      newLinkEl.rel = 'stylesheet';
      // @ts-ignore
      newLinkEl.href = styleSheet.href;
      targetDoc.head.appendChild(newLinkEl);
      // @ts-ignore
    } else if (styleSheet.cssRules && styleSheet.cssRules.length > 0) {
      const newStyleEl = sourceDoc.createElement('style');
      // @ts-ignore
      Array.from(styleSheet.cssRules).forEach((cssRule) => {
        // @ts-ignore
        newStyleEl.appendChild(sourceDoc.createTextNode(cssRule.cssText));
      });

      targetDoc.head.appendChild(newStyleEl);
    }
  });
}

export class MyWindowPortal extends React.PureComponent<any> {
  externalWindow: any;

  containerEl: any;

  constructor(props) {
    super(props);
    // STEP 1: create a container <div>
    this.containerEl = document.createElement('div');
    this.externalWindow = null;
  }

  componentDidMount() {
    // STEP 3: open a new browser window and store a reference to it
    this.externalWindow = window.open('', '', 'width=300,height=600,left=0,top=0');

    copyStyles(document, this.externalWindow.document);

    // Options for the observer (which mutations to observe)
    const config = { attributes: true, childList: true, subtree: true };

    // Callback function to execute when mutations are observed
    const callback = debounce(
      (mutationList, observer) => {
        copyStyles(document, this.externalWindow.document);

        for (const mutation of mutationList) {
          if (mutation.type === 'childList') {
            console.log(mutation);
          }
        }
      },
      50,
      { leading: true, trailing: true },
    );

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(document.head, config);

    // Later, you can stop observing
    // TODO: unmount
    // observer.disconnect();

    this.externalWindow.addEventListener('beforeunload', () => {
      this.props.onClose();
    });

    // STEP 4: append the container <div> (that has props.children appended to it) to the body of the new window
    this.externalWindow.document.body.appendChild(this.containerEl);

    this.externalWindow.document.title = 'Selection Summary';
  }

  componentWillUnmount() {
    // STEP 5: This will fire when this.state.showWindowPortal in the parent component becomes false
    // So we tidy up by closing the window
    this.externalWindow.close();
  }

  render() {
    // STEP 2: append props.children to the container <div> that isn't mounted anywhere yet
    return ReactDOM.createPortal(this.props.children, this.containerEl);
  }
}
