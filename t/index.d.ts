import "regenerator-runtime/runtime";
export interface ApplicationConfig {
}
/**const onClick = async (content: string) => {
  // @ts-ignore
  const handle = await window.showSaveFilePicker({
    suggestedName: 'session.pse',
    types: [{
      description: 'PSE Session',
      accept: {
        'text/plain': ['.pse'],
      },
    }],
  });

  const writable = await handle.createWritable()
  writable.write(content)
  await writable.close()

  return handle;
}


const loo = async () => {
  // @ts-ignore
  const [fileHandle] = await window.showOpenFilePicker();
  const file = await fileHandle.getFile();
  const contents = await file.text();

  return contents
}








PluginRegistry.getInstance().registerPlugin(new RubikPlugin())
PluginRegistry.getInstance().registerPlugin(new ChessPlugin())
PluginRegistry.getInstance().registerPlugin(new CoralPlugin())
PluginRegistry.getInstance().registerPlugin(new ChemPlugin())
PluginRegistry.getInstance().registerPlugin(new GoPlugin())




const EntryPoint = () => {
  const api = new API()
  const [context, setContext] = React.useState(api)

  api.onStateChanged = (values, keys) => {
  }



  return <div>
    <Button style={{ zIndex: 10000, position: 'absolute' }
    } onClick={() => {
      console.log(context.store.getState().lineUpInput)
      onClick(context.serialize())
    }}>store</Button>

    <Button style={{ zIndex: 10000, position: 'absolute', left: 100 }} onClick={async () => {
      const content = await loo()
      setContext(new API(content))
    }}>load</Button>
    <PSEContextProvider
      context={context}
      onStateChanged={(values, keys) => {
      }}
      
      >

      <Application config={{}} />
    </PSEContextProvider>
  </div>
}

// Render the application into our 'mountingPoint' div that is declared in 'index.html'.
ReactDOM.render(<EntryPoint></EntryPoint>, document.getElementById("mountingPoint"))**/ 
