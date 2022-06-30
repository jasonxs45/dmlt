#!/usr/bin/env node
import { program } from 'commander'
import path from 'path'
import fs from 'fs'
import inquirer from 'inquirer'
import ora from 'ora'
import download from 'download-git-repo'
import symbols from 'log-symbols'
import chalk from 'chalk'
import importJson from '../utils/importJson.js'
const templateList = importJson('./template.json')
chalk.level = 1

const spinner = ora('Downloading...')

let question = [
  {
    type: 'confirm',
    message: '检测到您未输入目录名称，是否使用当前目录创建？',
    name: 'usePwd'
  },
  {
    type: 'input',
    message: '请输入目录名：',
    name: 'destination',
    when: answers => answers.usePwd !== undefined && answers.usePwd === false,
    validate: async val => {
      if (!val.trim()) return '请输入有效的目录名'
      return true
    }
  },
  {
    type: 'confirm',
    message: '该目录已存在，是否覆盖：',
    name: 'override',
    when: answers => {
      try {
        const stats = fs.statSync(answers.destination)
        if (stats.isDirectory()) {
          return true
        }
      } catch (error) {
        console.log(error)
        return false
      }
    }
  },
  {
    type: 'list',
    choices: ['dumi', 'dumi&lerna'],
    name: 'template',
    message: '请选择模板名称',
    when: answers => answers.override
  }
]

export default async (tempName, proName) => {
  program.usage('init [project-name]')
  if (program.args.length < 1) return program.help()

  let destination = program.args[1]
  let answers = {
    destination
  }

  // 如果参数里面包含目录名
  if (destination) {
    question.splice(0, 2)
    question[0].when = () => {
      try {
        const stats = fs.statSync(answers.destination)
        if (stats.isDirectory()) {
          return true
        }
      } catch (error) {
        // console.log(error)
        return false
      }
    }
  }
  
  answers = {
    ...answers,
    ...await inquirer.prompt(question)
  }

  destination = answers.destination ? answers.destination.trim() : ''

  const temporaryDir = `.__temp.${destination}.${Date.now()}`

  if (answers.template) {
    const url = templateList[answers.template]
    console.log(url)
    console.log(chalk.green('\n Start generating... \n'))
    // 出现加载图标
    spinner.start()

    download(`direct:${url}`, `./${temporaryDir}`, { clone: true }, (err) => {
      if (err) {
        spinner.fail()
        console.log(chalk.red(symbols.error), chalk.red(`Generation failed. ${err}`))
        fs.rmdirSync(temporaryDir, { recursive: true, force: true })
        return
      }
      // 结束加载图标
      spinner.succeed()
      fs.rmdirSync(destination, { recursive: true, force: true })
      fs.renameSync(temporaryDir, destination)
      console.log(chalk.green(symbols.success), chalk.green('Generation completed!'))
      console.log('\n To get started')
      console.log(`\n    cd ${destination} \n`)
    })
  }
}