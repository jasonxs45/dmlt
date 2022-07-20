#!/usr/bin/env node
import path from 'path'
import fs from 'fs-extra'
import inquirer from 'inquirer'
import ora from 'ora'
import { download } from 'obtain-git-repo';
import symbols from 'log-symbols'
import validateProjectName from 'validate-npm-package-name'
import chalk from 'chalk'
import importJson from '../utils/importJson.js'

const templateList = importJson('../template.json')

chalk.level = 1

const spinner = ora('Downloading...')

const question = [
  {
    type: 'list',
    choices: ['dumi', 'dumi&lerna'],
    name: 'template',
    message: '请选择模板名称'
  }
]


const downloadRepo = ({ name, url, inCurrent, overwrite, template, targetDir }) => {
  const tempName = (!inCurrent && !overwrite) ? name : `.__temp.${name}.${Date.now()}`
  const cwd = process.cwd()
  const tempTargetDir = inCurrent ? path.resolve(cwd, '../', tempName) : path.resolve(cwd, tempName)
  // console.log('name:  ' + name)
  // console.log('overwrite:  ' + overwrite)
  // console.log('inCurrent:  ' + inCurrent)
  // console.log('targetDir:  ' + targetDir)
  // console.log('tempTargetDir:  ' + tempTargetDir)
  console.log(url)
  console.log(chalk.green('\n Start generating... \n'))
  // 出现加载图标
  spinner.start()
  return new Promise((res, rej) => {
    download(`direct:${url}`, `${tempTargetDir}`, { clone: true }, (err) => {
      if (err) {
        spinner.fail()
        console.log(chalk.red(symbols.error), chalk.red(`Generation failed. ${err}`))
        fs.rmdirSync(tempTargetDir, { recursive: true, force: true })
        rej(err)
        process.exit(1)
        return
      }
      // 结束加载图标
      spinner.succeed()
      if (targetDir && (inCurrent || (overwrite === 'overwrite' && !inCurrent))) {
        fs.rmdirSync(targetDir, { recursive: true, force: true })
        fs.renameSync(tempTargetDir, targetDir)
      }
      console.log(chalk.green(symbols.success), chalk.green('Generation completed!'))
      console.log('\n To get started')
      if (!inCurrent) {
        console.log(`\n    cd ${name} \n`)
      } else {
        console.log(`\n    cd . \n`)
      }
      if (template !== 'dumi') {
        console.log(`\n    npm run initialize \n`)
      }
      console.log(`\n    npm run start \n`)
      res()
      process.exit()
    })
  })
}

const create = async (projectName, options) => {
  const cwd = options.cwd || process.cwd()
  const inCurrent = projectName === '.'
  const name = inCurrent ? path.relative('../', cwd) : projectName
  const targetDir = path.resolve(cwd, projectName || '.')
  const result = validateProjectName(name)

  let answers = {}

  if (!result.validForNewPackages) {
    console.error(chalk.red(`Invalid project name: "${name}"`))
    result.errors && result.errors.forEach(err => {
      console.error(chalk.red.dim('Error: ' + err))
    })
    result.warnings && result.warnings.forEach(warn => {
      console.error(chalk.red.dim('Warning: ' + warn))
    })
    process.exit(1)
  }


  if (fs.existsSync(targetDir) && !options.merge) {
    if (options.force) {
      answers.force = true
      // await fs.remove(targetDir)
    } else {
      if (inCurrent) {
        const { ok } = await inquirer.prompt([
          {
            name: 'ok',
            type: 'confirm',
            message: `是否在当前目录创建项目?`
          }
        ])
        if (!ok) {
          return
        }
      } else {
        const { action } = await inquirer.prompt([
          {
            name: 'action',
            type: 'list',
            message: `目标目录 ${chalk.cyan(targetDir)} 已存在. 选择行为:`,
            choices: [
              { name: '覆盖', value: 'overwrite' },
              { name: '取消', value: false }
            ]
          }
        ])
        answers.action = action
        if (!action) {
          return
        } else if (action === 'overwrite') {
          // console.log(`\nRemoving ${chalk.cyan(targetDir)}...`)
          // await fs.remove(targetDir)
        }
      }
    }
  }

  answers = {
    ...answers,
    ...await inquirer.prompt(question)
  }

  if (answers.template && targetDir) {
    const url = templateList[answers.template]
    downloadRepo({
      name,
      inCurrent,
      overwrite: answers.action,
      template: answers.template,
      url,
      targetDir
    })
  }
}

export default create