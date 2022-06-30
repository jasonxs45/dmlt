#!/usr/bin/env node
import { program } from 'commander'
import importJson from '../utils/importJson.js'

import add from '../commands/add.js'
import deletejs from '../commands/delete.js'
import list from '../commands/list.js'
import init from '../commands/init.js'

const packagejson = importJson('./package.json')


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
  .description('list all templates')
  .action(list)

program
  .command('init')
  // .arguments('<template-name>', '模板名称', '请输入模板名称')
  .description('init a project')
  .action(init)


program.parse(process.argv)
