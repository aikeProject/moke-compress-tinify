/**
 * @author 成雨
 * @date 2019/11/18
 * @Description: 压缩图片核心方法
 */

import { join } from 'path'
import { promises } from 'fs'
import { validateTinify, residue, compressTinify } from './helper/tinify'
import { isFile, isDirectory, reg } from './helper/utils'
import * as chalk from 'chalk'

const { readdir } = promises

async function findImages(path: string) {
  try {
    const isDir = await isDirectory(path)
    if (!isDir) {
      return
    }

    const files = await readdir(path)

    for (let file of files) {
      const fullPath = join(path, file)
      await compressImage(fullPath)
    }
  } catch (error) {
    console.log(error)
  }
}

async function compressImage(file: string) {

  const isDir = await isDirectory(file)

  if (isDir) {
    findImages(file)
  }

  const isFileFlag = await isFile(file)

  if (isFileFlag) {
    if (reg.isTinyPic.test(file)) {
      const left = residue()
      // 剩余数判断，解决同步时剩余数不足导致的全部图片压缩失败问题
      if (left <= 0) {
        console.log(chalk.red(`当前key的可用剩余数不足！${file} 压缩失败！`))
        return
      }

      await compressTinify(file)

    } else {
      console.log(chalk.red(`不支持的文件格式 ${file}`))
    }
  }
}

/**
 * 启动压缩
 * @param key
 * @param path {string}
 */
async function start(key: string, path: string) {
  try {
    const isValid = await validateTinify(key)
    if (!isValid) return

    await findImages(path)

  } catch (e) {
    // do something
  }

}

export {
  start,
  findImages,
  compressImage
}
