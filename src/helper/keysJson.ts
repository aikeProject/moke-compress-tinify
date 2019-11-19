/**
 * @author 成雨
 * @date 2019/11/18
 * @Description: 设置 api key 到json文件中
 */

import * as writeJsonFile from 'write-json-file'
import * as loadJsonFile from 'load-json-file'
import { resolve } from 'path'

const path = resolve(__dirname, '..', 'config/keys.json')

function setKeyJson(data: string[] = []) {
  return writeJsonFile(path, data || [])
}

function readKeysJson() {
  return loadJsonFile<string[]>(path)
}

export {
  setKeyJson,
  readKeysJson
}
