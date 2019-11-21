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

    console.log('')
    console.log(chalk.green(`当前tinify api key 剩余可用次数${chalk.yellow(count)}`))
    console.log('')

    return Promise.resolve(true)
  }, () => {

    console.log('')
    console.log(chalk.red('当前 api key 错误或者当月500次用尽，请重新设置api key'))
    console.log('')

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
    const relativeFile = file.split('/').pop()!

    // 返回压缩图片的绝对路径
    const outFile = resolve(outPath, relativeFile)

    await mkdirOutput(outFile)

    await promises.writeFile(outFile, buffer)

    console.log(chalk.green(`图片压缩成功: ${relativeFile}`))
    console.log(chalk.green(`图片保存到: ${outFile}`))
  } catch (e) {
    console.log(chalk.red(`图片压缩失败: ${file}`))
    return file
  }

}

export {
  residue,
  validateTinify,
  compressTinify
}

