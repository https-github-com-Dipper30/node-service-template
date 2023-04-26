import fs from 'fs'

export const appendLog = async (path: string, data: string) => {
  fs.appendFile(path, data + '\n', err => {
    // eslint-disable-next-line no-console
    console.error('Failure when logging ', err)
  })
}

export const appendMsgLog = (data: string) => {
  appendLog('logs/msg.txt', data)
}