var backendRunning = false


function check() {
    fetch('http://localhost:8090/heart', {
        method: 'POST',
        body: JSON.stringify("")
    }).then(() => {
        let context = self as any

        if (backendRunning == false) {
            context.postMessage(true)
        }

        backendRunning = true

    }).catch(() => {
        let context = self as any

        if (backendRunning == true) {
            context.postMessage(false)
        }

        backendRunning = false
    })
}

check()