const bridge = window.bridge
const decoder = new TextDecoder('utf-8')
const status = document.getElementById('status')
const log = document.getElementById('log')

function writeLog(message) {
  log.textContent += message + '\n'
}

status.innerText = `Scaffold ready (${bridge.pkg().version})`

function showUpdateReady() {
  status.innerText = 'Update ready'
  const btn = document.getElementById('update-btn')
  btn.style.display = 'inline-block'
  btn.onclick = async () => {
    btn.disabled = true
    btn.innerText = 'Updating...'
    try {
      await bridge.applyUpdate()
      await bridge.appAfterUpdate()
    } catch (err) {
      status.innerText = 'Update failed: ' + err.message
      btn.style.display = 'none'
    }
  }
}

function onWorkerUpdaterEvent(name) {
  if (name === 'updating') {
    status.innerText = 'Updating...'
    return
  }
  if (name === 'updated') showUpdateReady()
}

const workers = {
  main: '/workers/main.js'
}

bridge.startWorker(workers.main)
let sentHello = false

const offWorkerStdout = bridge.onWorkerStdout(workers.main, (data) => {
  writeLog('stdout: ' + decoder.decode(data).trim())
})

const offWorkerStderr = bridge.onWorkerStderr(workers.main, (data) => {
  writeLog('stderr: ' + decoder.decode(data).trim())
})

const offWorkerIpc = bridge.onWorkerIPC(workers.main, (data) => {
  const message = decoder.decode(data)
  writeLog('ipc: ' + message)
  onWorkerUpdaterEvent(message)

  if (!sentHello) {
    sentHello = true
    bridge.writeWorkerIPC(workers.main, 'Hello from renderer')
  }
})

const offWorkerExit = bridge.onWorkerExit(workers.main, (code) => {
  status.innerText = `Worker exited (${code})`
  offWorkerStdout()
  offWorkerStderr()
  offWorkerIpc()
  offWorkerExit()
})
