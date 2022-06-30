#!/usr/bin/env node
import importJson from '../utils/importJson.js'
import showTable from '../utils/showTable.js'

export default () => {
  const templateList = importJson('../template.json')
  showTable(templateList)
}
