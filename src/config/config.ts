/**
 * @author 成雨
 * @date 2019/11/20
 * @Description:
 */
import * as path from 'path'
import { InterfaceConfig } from '../type'

const config: InterfaceConfig = {
  key: '',
  // 默认开启异步压缩
  sync: true,
  // 图片压缩默认输入路径 resolve 默认返回当前路径 绝对路径
  path: process.cwd(),
  // 图片压缩输出目录绝对路径 当前路径 + compress
  out: path.resolve('moke-compress')
}

export default config
