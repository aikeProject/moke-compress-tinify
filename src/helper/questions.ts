/**
 * @author 成雨
 * @date 2019/11/18
 * @Description: 命令行交互
 */

import { readKeysJson } from './keysJson'

async function choseKey() {

  const keys = await readKeysJson()

  return [
    {
      type: 'list',
      name: 'tinifyKey',
      message: '选择你设置好的 tinify api key',
      choices: keys || []
    }
  ]
}

export {
  choseKey
}
