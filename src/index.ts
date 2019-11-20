/**
 * @author 成雨
 * @date 2019/11/18
 * @Description: tinify 压缩工具
 */

import { version, parse, help, command, description } from 'commander'
import { prompt } from 'inquirer'
import * as chalk from 'chalk'
import * as pkg from '../package.json'
import * as configKeys from './config/keys.json'
import { choseKey } from './helper/questions'
import { setKeyJson, readKeysJson } from './helper/keysJson'
import { start } from './core'

description('使用tinify压缩图片')

version(pkg.version, '-v, --version', '版本号信息')

command('clear')
  .alias('rm')
  .option('-t, --tinifyKeys', '清空设置的api key')
  .description('清空设置的key')
  .action(async (options) => {
    const { tinifyKeys } = options

    if (tinifyKeys) {
      await setKeyJson()
      console.log(chalk.red('已清空设置的 tinify api key'))
    }

  })

// 压缩命令
command('compress')
  .alias('c')
  .option('-k, --key [key]', '设置key，查看相关 https://tinify.cn/developers/reference')
  .option('-p, --path [path]', '输入压缩图片所在目录')
  .option('-o, --out [path]', '输入输出压缩图片目录')
  .option('-s, --sync', '是否异步压缩')
  .description('压缩图片')
  .action(async (options) => {
    const { key, path, out, args } = options
    const config = {}

    if (!key || typeof key !== 'string') {
      const keys = await readKeysJson()

      if (!(keys || []).length) {
        console.log(chalk.red('请设置压缩图片所需要的api key'))
        return
      }

      const chose = await choseKey()
      const answers = await prompt(chose)

      // 启动压缩
      start(answers.tinifyKey as string)

    } else {
      await setKeyJson([...(configKeys as [] || []), key])
    }
  })

command('*').description('没有此命令').action(() => help())

parse(process.argv)

if (process.argv.length < 3) {
  help()
}

// console.log(opts())
// console.log(args)
