#!/usr/bin/env node
import { program } from 'commander'
import chalk from 'chalk'
import figlet from 'figlet'
import semver from 'semver'


import importJson from '../utils/importJson.js'
import enhanceErrorMessages from '../utils/enhanceErrorMessages.js'

import add from '../commands/add.js'
import deletejs from '../commands/delete.js'
import list from '../commands/list.js'
import init from '../commands/init.js'

/**=====================================
 * 检查node版本
 =====================================*/
const packagejson = importJson('../package.json')
const requiredVersion = packagejson.engines.node
function checkNodeVersion (wanted, id) {
  if (!semver.satisfies(process.version, wanted, { includePrerelease: true })) {
    console.log(chalk.red(
      `'${id}'需要 Node ${wanted}, 当前版本 Node ${process.version}.\n请升级Node版本.`
    ))
    process.exit(1)
  }
}
checkNodeVersion(requiredVersion, 'dmlt')

/**=====================================
 * 注册异常处理事件
 ======================================*/

enhanceErrorMessages('missingArgument', argName => {
  return `缺少参数 ${chalk.yellow(`<${argName}>`)}.`
})

enhanceErrorMessages('unknownOption', optionName => {
  return `未知选项 ${chalk.yellow(optionName)}.`
})

enhanceErrorMessages('optionMissingArgument', (option, flag) => {
  return `选项缺少参数 ${chalk.yellow(option.flags)}` + (
    flag ? `, got ${chalk.yellow(flag)}` : ``
  )
})

// 引入firlet打印
figlet('DMLT',
  {
    font: 'roman',
    horizontalLayout: 'full',
    verticalLayout: 'full',
    // width: 120,
    whitespaceBreak: true
  },
  (err, data) => {
    if (err) {
      console.log('Something went wrong...');
      console.dir(err);
      return;
    }
    // 打印文字图案
    console.log(chalk.green(data))

    console.log(chalk.green(`\n dumi组件库开发脚手架 \n`))
    
    program.usage('<command>')

    program.version(packagejson.version)

    // program
    //   .command('add')
    //   .description('add a new template')
    //   .action(add)


    // program
    //   .command('delete')
    //   .description('delete a template')
    //   .action(deletejs)


    program
      .command('list')
      .description('查看所有模板')
      .action(list)

    program
      .command('init', )
      .arguments('<app-name>', '模板名称', '请输入模板名称')
      .description('创建一个项目')
      .option('-f, --force', 'Overwrite target directory if it exists')
      .action(init)


    program.parse(process.argv)
  });
