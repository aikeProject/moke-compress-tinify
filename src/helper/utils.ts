/**
 * @author 成雨
 * @date 2019/11/18
 * @Description: 工具函数
 */

import { promises, accessSync } from 'fs'
import { join, parse } from 'path'
import * as mkdirp from 'mkdirp'

const { stat } = promises

/**
 * 检查是否是目录
 * @param path 路径地址
 */
async function isDirectory(path: string) {

  try {
    const stats = await stat(path)

    return stats.isDirectory()
  } catch (e) {
    return false
  }

}

/**
 * 判断当前路径是否是文件
 * @param path 路径地址
 */
async function isFile(path: string) {
  try {
    const stats = await stat(path)

    return stats.isFile()
  } catch (e) {
    return false
  }
}


/**
 * 如果 name 重复则返回 name(1)
 * 如果 name(1)重复  -> name(2)
 * 以此类推
 * @param path 文件路径
 * @param name 文件名
 */
function existDir(path: string = '', name: string): string {

  let n = 1

  const fn = (path: string = '', name: string): string => {
    const out = join(path, name)

    try {

      accessSync(out)
      name = name.replace(/\(.*\)$/, '')

      return fn(path, `${name}(${n++})`)
    } catch (e) {
      return name
    }

  }

  return fn(path, name)
}

const reg = {
  isHttp: /^http:\/\//,
  isHttps: /^https:\/\//,
  isPic: /\.(jpg|jpeg|png|gif)$/,
  isBase64: /^data:(.+?);base64,(.+)$/,
  isTinyPic: /\.(jpg|jpeg|png)$/
}

/**
 * 创建目录
 * @param file
 */
function mkdirOutput(file: string) {
  const { dir } = parse(file)
  return new Promise((resolve, reject) => {
    mkdirp(dir, function(err) {
      if (err) {
        reject(err)
        return
      }
      resolve(true)
    })
  })
}

export {
  isDirectory,
  isFile,
  reg,
  existDir,
  mkdirOutput
}
