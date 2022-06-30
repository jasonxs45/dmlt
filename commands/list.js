#!/usr/bin/env node
import importJson from '../utils/importJson.js'
import showTable from '../utils/showTable.js'
import path from 'path'

export default () => {
  const templateList = importJson(path.resolve('./template.json'))
  showTable(templateList)
}
