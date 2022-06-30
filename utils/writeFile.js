import fs from 'fs'

export default (url, str, cb) => {
  fs.writeFile(url, str, 'utf-8', (err) => {
    if (cb && typeof cb === 'function') {
      cb(err)
    }
  })
}