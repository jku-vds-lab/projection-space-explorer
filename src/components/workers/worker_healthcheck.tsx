import * as backend_utils from "../../utils/backend-connect";

var backendRunning = false


function check() {
    fetch(backend_utils.BASE_URL+'/healthcheck', {
        method: 'GET'
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