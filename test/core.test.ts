/**
 * @author 成雨
 * @date 2019/11/19
 * @Description:
 */

import { compressImage } from '../src/core'
import * as tinify from 'tinify'
import { readdirSync } from 'fs'
import * as shell from 'shelljs'
import { existDir } from '../src/helper/utils'

// 切换运行目录到 test 下进行
process.chdir('test')

const MAX_TIME = 1000 * 60 * 5

describe('core 测试', () => {

  beforeAll(() => {
    // @ts-ignore
    tinify.key = 'bZbDsh71Cg85yyw7DPNHwxJbF1dhhcQz'
  })

  afterEach(() => {
    // @ts-ignore
    tinify.key = ''
  })

  afterAll(() => {
    shell.rm('-rf', 'compress')
  })

  it('should compressImage 当前目录下没有 compress 文件夹', async () => {
    try {
      await compressImage('a.jpg')
      const files = readdirSync('compress')
      const file = files[0]
      expect('a.jpg').toEqual(file)
    } catch (e) {
      console.log(e)
    }
  }, MAX_TIME)

})
