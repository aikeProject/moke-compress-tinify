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
  startTime: number = new Date().getTime()

  constructor(config: InterfaceConfig) {

    let path = config.path ? resolve(config.path) : defaultConfig.path
    let out = config.out ? resolve(config.out) : defaultConfig.out

    this.config = Object.assign({}, defaultConfig, config, { path, out })
  }

  /**
   * 查找path下的可压缩文件
   * @param path
   */
  async findImages(path: string) {
    const { sync } = this.config
    try {
      const isDir = await isDirectory(path)

      if (!isDir) {
        await this.compressImage(path)
        return
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

  /**
   * 压缩传入的file文件
   * @param file
   */
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

        this.done('sync')

      } else {
        console.log(chalk.red(`不支持的文件格式 ${file}`))
      }
    }
  }

  /**
   * 启动压缩
   */
  async start() {

    const { path, key } = this.config

    try {
      const isValid = await validateTinify(key)
      if (!isValid) return

      await this.findImages(path)

      this.done('t')

    } catch (e) {
      // do something
    }

  }

  /**
   * 完成时输出提示
   * @param type sync 异步压缩 t 同步压缩
   */
  done(type: 'sync' | 't') {

    const errorCount = this.errorFile.length
    const successCount = this.sum - errorCount
    let time = (new Date().getTime() - this.startTime) / 1000
    time = parseFloat(time.toFixed(2))
    let show = false


    if (!this.config.sync && type === 't') show = true

    if (this.config.sync && this.sum === this.fileList.length && type === 'sync') show = true

    if (show) {

      let done = `${chalk.blue('总数:')} ${chalk.blue(this.sum)} `
      done += `${chalk.green('成功:')} ${chalk.green(successCount)} `
      done += `${chalk.red('失败:')} ${chalk.red(errorCount)} `
      done += `${chalk.blue('耗时:')} ${time}秒 `

      console.log('')
      console.log(done)

      if (errorCount) {
        const errorStr = this.errorFile.join('\n')

        console.log('')
        console.log(chalk.blue('失败文件: '))
        console.log(chalk.red(errorStr))
      }
    }
  }

}

export default Core
