/**
 * @author 成雨
 * @date 2019/11/18
 * @Description: tinify 压缩工具
 */

import { version, parse, help, command, description } from 'commander'
import { prompt } from 'inquirer'
import * as chalk from 'chalk'
import * as loadJsonFile from 'load-json-file'
import { choseKey } from './helper/questions'
import { setKeyJson, readKeysJson } from './helper/keysJson'
import Core from './core'
import { resolve } from 'path'
import { InterfaceConfig } from './type'

description('使用tinify压缩图片')

try {
  const pkg = loadJsonFile.sync<{ version: string }>(resolve(__dirname, '../package.json'))
  version(pkg.version, '-v, --version', '版本号信息')
} catch (e) {
  console.log(chalk.red(e))
}

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
  .option('-s, --sync', '是否同步压缩，默认异步压缩')
  .description('压缩图片')
  .action(async (options) => {
    const { key, path, out, sync } = options
    const config: InterfaceConfig = { key: '', path, out, sync }

    if (!key || typeof key !== 'string') {
      const keys = await readKeysJson()
      if (!(keys || []).length) {
        console.log(chalk.red('请设置压缩图片所需要的api key: moke-compress c -k <key>'))
        return
      }

      const chose = await choseKey()
      const answers = await prompt(chose)
      config.key = answers.tinifyKey as string
      // 启动压缩
      new Core(config).start()

    } else {

      const configKeys = await readKeysJson()
      await setKeyJson([...(configKeys || []), key])
      const keys = await readKeysJson() as string[]

      (keys || []).map((item: string) => {
        console.log(chalk.green(item))
      })
    }
  })

command('*').description('...').action(() => help())

parse(process.argv)

if (process.argv.length < 3) {
  help()
}
