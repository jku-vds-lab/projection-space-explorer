var backendRunning = false


function check() {
    fetch('http://localhost:8090/heart', {
        method: 'POST',
        body: JSON.stringify("")
    }).then(() => {
        if (backendRunning == false) {
            self.postMessage(true)
        }

        backendRunning = true

    }).catch(() => {
        if (backendRunning == true) {
            self.postMessage(false)
        }

        backendRunning = false
    })
}

check()