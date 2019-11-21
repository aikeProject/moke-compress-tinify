/**
 * @author 成雨
 * @date 2019/11/19
 * @Description:
 */

// 切换运行目录到 test 下进行
process.chdir('test')

import Core from '../src/core'
import * as tinify from 'tinify'
import { readdirSync } from 'fs'
import * as shell from 'shelljs'
import defaultConfig, { defaultOutDir } from '../src/config/config'


const MAX_TIME = 1000 * 60 * 5

describe('core 测试', () => {

  describe('默认配置压缩', () => {

    beforeEach(async () => {
      await shell.rm('-rf', defaultOutDir)
    })

    afterEach(() => {
      // do something
    })

    beforeAll(() => {
      // @ts-ignore
      tinify.key = ''
    })

    afterAll(async () => {
      // @ts-ignore
      tinify.key = ''
      await shell.rm('-rf', defaultOutDir)
    })

    it('defaultConfig', async (done) => {
      const config = {
        ...defaultConfig,
        key: 'bZbDsh71Cg85yyw7DPNHwxJbF1dhhcQz'
      }

      const core = new Core(config)
      await core.start()

      setTimeout(() => {
        const files = readdirSync(defaultOutDir)
        expect(files.length).toEqual(3)
        const secede = readdirSync(`${defaultOutDir}/secede`)
        expect(secede.length).toEqual(1)

        done()
      }, 10 * 1000)

    }, MAX_TIME)

  })

  describe('设置 path', () => {
    beforeEach(async () => {
      await shell.rm('-rf', 'otherpath/' + defaultOutDir)
    })

    afterEach(() => {
      // do something
    })

    beforeAll(() => {
      // @ts-ignore
      tinify.key = ''
    })

    afterAll(async () => {
      // @ts-ignore
      tinify.key = ''
      await shell.rm('-rf', 'otherpath/' + defaultOutDir)
    })

    it('defaultConfig', async (done) => {
      const config = {
        ...defaultConfig,
        key: 'bZbDsh71Cg85yyw7DPNHwxJbF1dhhcQz',
        path: 'otherpath'
      }

      const core = new Core(config)
      await core.start()

      setTimeout(() => {
        const files = readdirSync('otherpath/' + defaultOutDir)
        expect(files.length).toEqual(3)
        const secede = readdirSync(`otherpath/${defaultOutDir}/secede`)
        expect(secede.length).toEqual(1)

        done()
      }, 10 * 1000)

    }, MAX_TIME)

  })

})
