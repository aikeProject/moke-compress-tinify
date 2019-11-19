/**
 * @author 成雨
 * @date 2019/11/18
 * @Description: 压缩相关方法
 */

import * as tinify from 'tinify'
import * as chalk from 'chalk'
import { promises } from 'fs'
import { join } from 'path'
import { existDir } from './utils'

/**
 * tinify 剩余次数
 */
function residue() {
  return 500 - (tinify.compressionCount || 0)
}

/**
 * 验证tinify api key 是否可用
 * @param apiKey api key
 */
function validateTinify(apiKey: string) {
  // @ts-ignore
  tinify.key = apiKey

  return tinify.validate().then(() => {
    const count = residue()

    console.log(chalk.green(`剩余可用次数${count}`))

    return Promise.resolve(true)
  }, () => {

    console.log(chalk.red('当前 api key 错误或者当月500次用尽，请重新设置api key'))

    return Promise.reject(false)
  })
}

async function compressTinify(file: string, outPath: string = '') {

  try {
    const sourceData = await promises.readFile(file)

    const source = await tinify.fromBuffer(sourceData)

    const buffer = await source.toBuffer()

    const name = existDir(outPath, 'compress')

    const outFile = join(outPath, name, file)

    try {
      await promises.writeFile(outFile, buffer)
    } catch (e) {
      if (e.code === 'ENOENT') {
        await promises.mkdir(join(outPath, name))
        await promises.writeFile(outFile, buffer)
      }
    }


    console.log(chalk.green(`图片压缩成功${file}`))
  } catch (e) {
    console.log(chalk.red(`图片压缩失败${file}`))

    throw e
  }

}

export {
  residue,
  validateTinify,
  compressTinify
}

