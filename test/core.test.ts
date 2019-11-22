/**
 * @author 成雨
 * @date 2019/11/19
 * @Description:
 */

// 切换运行目录到 test 下进行
process.chdir('test')

import Core from '../src/core'
import { readdirSync } from 'fs'
import { resolve, join } from 'path'
import * as shell from 'shelljs'
import defaultConfig, { defaultOutDir } from '../src/config/config'

const defaultKey = 'bZbDsh71Cg85yyw7DPNHwxJbF1dhhcQz'
const MAX_TIME = 1000 * 60 * 5

describe('core 测试', () => {

  describe('默认配置压缩 默认压缩是异步的', () => {

    beforeEach(async () => {
      await shell.rm('-rf', defaultOutDir)
    })

    afterEach(() => {
      // do something
    })

    beforeAll(() => {
      // do something
    })

    afterAll(async () => {
      await shell.rm('-rf', defaultOutDir)
    })

    it('defaultConfig 当前运行目录下执行压缩', async (done) => {
      const config = {
        ...defaultConfig,
        key: defaultKey
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

  describe('自定义参数', () => {

    const sourcePath = 'otherpath'

    const outPath = 'out'

    beforeEach(async () => {
      await shell.cp('-r', resolve('..', sourcePath), '.')
    })

    afterEach(async () => {
      // do something
      await shell.rm('-rf', outPath)
    })

    beforeAll(() => {
      // do something
    })

    afterAll(async () => {
      // do something
      await shell.rm('-rf', sourcePath)
    })

    it('path -> sourcePath 只指定文件source路径', async (done) => {
      const config = {
        key: defaultKey,
        path: sourcePath,
        out: '',
        sync: false
      }

      const core = new Core(config)
      await core.start()

      setTimeout(() => {
        const files = readdirSync(join(sourcePath, defaultOutDir))
        expect(files.length).toEqual(3)
        const secede = readdirSync(`${sourcePath}/${defaultOutDir}/secede`)
        expect(secede.length).toEqual(1)

        done()
      }, 10 * 1000)

    }, MAX_TIME)

    it('out -> outPath 只指定文件输出路径', async (done) => {

      const config = {
        key: defaultKey,
        path: sourcePath,
        out: outPath,
        sync: false
      }

      const core = new Core(config)
      await core.start()

      setTimeout(() => {
        const files = readdirSync(outPath)
        expect(files.length).toEqual(3)
        const secede = readdirSync(`${outPath}/secede`)
        expect(secede.length).toEqual(1)

        done()
      }, 10 * 1000)

    }, MAX_TIME)

    it('path -> sourcePath 只指定文件source路径，设置为同步压缩', async (done) => {
      const config = {
        key: defaultKey,
        path: sourcePath,
        out: '',
        sync: true
      }

      const core = new Core(config)
      await core.start()

      const files = readdirSync(join(sourcePath, defaultOutDir))
      expect(files.length).toEqual(3)
      const secede = readdirSync(`${sourcePath}/${defaultOutDir}/secede`)
      expect(secede.length).toEqual(1)

      done()

    }, MAX_TIME)

    it('out -> outPath 只指定文件输出路径，设置为同步压缩', async (done) => {

      const config = {
        key: defaultKey,
        path: sourcePath,
        out: outPath,
        sync: true
      }

      const core = new Core(config)
      await core.start()

      const files = readdirSync(outPath)
      expect(files.length).toEqual(3)
      const secede = readdirSync(`${outPath}/secede`)
      expect(secede.length).toEqual(1)

      done()

    }, MAX_TIME)

    it('输入文件', async (done) => {
      const config = {
        key: defaultKey,
        path: 'a.jpg',
        out: outPath,
        sync: true
      }

      const core = new Core(config)
      await core.start()

      const files = readdirSync(outPath)
      expect(files.length).toEqual(1)
      done()

    }, MAX_TIME)
  })

})
