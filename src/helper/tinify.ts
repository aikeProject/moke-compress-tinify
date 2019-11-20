/**
 * @author 成雨
 * @date 2019/11/18
 * @Description: 压缩相关方法
 */

import * as tinify from 'tinify'
import * as chalk from 'chalk'
import { promises } from 'fs'
import { relative, resolve } from 'path'
import { mkdirOutput } from './utils'

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

async function compressTinify(file: string, outPath: string = '', defaultPath: string) {

  try {
    console.log(chalk.blue(`开始压缩图片 ${file} compress...`))

    const sourceData = await promises.readFile(file)

    const source = await tinify.fromBuffer(sourceData)

    const buffer = await source.toBuffer()

    // 获取图片相对路径
    const relativeFile = relative(defaultPath, file)

    // 返回压缩图片的绝对路径
    const outFile = resolve(outPath, relativeFile)

    await mkdirOutput(outFile)

    await promises.writeFile(outFile, buffer)

    console.log(chalk.green(`图片压缩成功: ${relativeFile}`))
  } catch (e) {
    console.log(chalk.red(`图片压缩失败: ${file}`))

    throw e
  }

}

export {
  residue,
  validateTinify,
  compressTinify
}

