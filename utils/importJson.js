import path from 'path'
import fs from 'fs'
export default url => {
  return JSON.parse(fs.readFileSync(path.resolve(url), 'utf-8'))
}