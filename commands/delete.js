#!/usr/bin/env node
import inquirer from 'inquirer'
import path from 'path'
import importJson from '../utils/importJson.js'
import showTable from '../utils/showTable.js'

import symbols from 'log-symbols'
import chalk from 'chalk'
import writeFile from '../utils/writeFile.js'

chalk.level = 1

const templateList = importJson('./template.json')

const question = [
  {
    type: 'input',
    name: 'name',
    message: '请输入模板名称',
    validate: (val) => {
      if (!val) return 'Name is required'
      if (!templateList[val]) return `tempalte ${val} does not exist`
      return true
    }
  }
]

export default async () => {
  const answers = await inquirer.prompt(question)
  const { name } = answers
  delete templateList[name]
  writeFile(
    path.resolve('./template.json'),
    JSON.stringify(templateList),
    (err) => {
      if (err) console.log(chalk.red(symbols.error), chalk.red(err))
      console.log('\n')
      console.log(chalk.green(symbols.success), chalk.green(`delete template ${name} successfully!\n`))
      console.log(chalk.green('The latest templateList is: \n'))
      showTable(templateList)
    })
}