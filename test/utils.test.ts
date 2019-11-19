/**
 * @author 成雨
 * @date 2019/11/19
 * @Description:
 */

import { existDir, isDirectory } from '../src/helper/utils'
import { mkdirSync } from 'fs'
import * as shell from 'shelljs'

// 切换运行目录到 test 下进行
process.chdir('test')

// 进程的当前工作目录
console.log('cwd', process.cwd())
/**
 * utils
 */
describe('util test', () => {
  it('util existDir 当前目录下没有 compress 目录', () => {

    const cwd = process.cwd()

    expect(existDir('', 'compress')).toEqual('compress')
    expect(existDir(cwd, 'compress')).toEqual('compress')
  })

  describe('util existDir 当前目录下有compress目录', () => {
    beforeAll(async () => {
      try {
        mkdirSync('compress')
      } catch (e) {
        await shell.rm('-rf', 'compress')
        mkdirSync('compress')
      }
    })

    afterEach(() => {
      // do something
    })

    afterAll(() => {
      shell.rm('-rf', 'compress')
      shell.rm('-rf', 'compress(1)')
    })

    it('创建目录检测是否重名，返回不重复的目录名', async () => {
      const cwd = process.cwd()

      expect(existDir('', 'compress')).toEqual('compress(1)')
      mkdirSync('compress(1)')
      expect(existDir(cwd, 'compress')).toEqual('compress(2)')
    })
  })
})
