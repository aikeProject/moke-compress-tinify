/**
 * @author 成雨
 * @date 2019/11/18
 * @Description: 压缩图片核心方法
 */

import { join, resolve } from 'path'
import { promises } from 'fs'
import { validateTinify, residue, compressTinify } from './helper/tinify'
import { isFile, isDirectory, reg } from './helper/utils'
import * as chalk from 'chalk'
import { InterfaceConfig } from './type'
import defaultConfig, { defaultOutDir } from './config/config'

const { readdir } = promises

class Core {
  config: InterfaceConfig
  fileList: string[] = []
  errorFile: string[] = []
  sum: number = 0

  constructor(config: InterfaceConfig) {

    let path = config.path ? resolve(config.path) : defaultConfig.path
    let out = config.out ? resolve(config.out) : defaultConfig.out

    this.config = Object.assign({}, defaultConfig, config, { path, out })
  }

  async findImages(path: string) {
    const { sync } = this.config
    try {
      const isDir = await isDirectory(path)

      if (!isDir) {
        await this.compressImage(path)
      }

      let files = await readdir(path)

      files = files.filter((item: string) => {
        if (/^\./.test(item)) return false
        return defaultOutDir !== item
      })

      for (let file of files) {
        const fullPath = join(path, file)
        if (sync) {
          this.compressImage(fullPath)
        } else {
          await this.compressImage(fullPath)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  async compressImage(file: string) {

    const { out, path } = this.config

    const isDir = await isDirectory(file)

    if (isDir) {
      await this.findImages(file)
    }

    const isFileFlag = await isFile(file)

    if (isFileFlag) {
      if (reg.isTinyPic.test(file)) {
        const left = residue()

        if (left <= 0) {
          console.log(chalk.red(`当前key的可用剩余数不足！${file} 压缩失败！`))
          return
        }

        this.fileList.push(file)

        const errorFile = await compressTinify(file, out, path)
        if (errorFile) this.errorFile.push(errorFile)

        ++this.sum

        if (this.sum === this.fileList.length) {
          console.log('fileList', this.fileList)
          console.log('errorFile', this.errorFile)
        }

      } else {
        console.log(chalk.red(`不支持的文件格式 ${file}`))
      }
    }
  }

  /**
   * 启动压缩
   * @param config
   */
  async start() {

    const { path, key } = this.config

    try {
      const isValid = await validateTinify(key)
      if (!isValid) return

      await this.findImages(path)

      console.log('done')

    } catch (e) {
      // do something
    }

  }
}

export default Core
