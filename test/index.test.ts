import { defaultOutDir } from '../src/config/config'

/**
 * @author 成雨
 * @date 2019/11/21
 * @Description: 命令行测试
 */

// 切换运行目录到 test 下进行
process.chdir('test')

import * as shell from 'shelljs'
import * as path from 'path'
import { EOL } from 'os'

const cmd = require('./helper/cmd.js')

const MAX_TIME = 1000 * 60 * 5
const defaultKey = 'bZbDsh71Cg85yyw7DPNHwxJbF1dhhcQz'

async function cli(args: string[] = [], inputs: string[] = []) {
  const response = await cmd.create(path.resolve('../src/index.ts')).execute(
    args,
    inputs,
    {
      timeout: 5 * 1000,
      maxTimeout: MAX_TIME,
      env: {
        DEBUG: true
      }
    }
  )

  return response
}

describe('command', () => {

  beforeAll(async () => {
    await shell.rm('-f', path.resolve('../src/config/keys.json'))
  })

  afterAll(async () => {
    await shell.rm('-rf', defaultOutDir)
  })

  it('没有设置 api key (moke-compress c)', async (done) => {
    const response = await cli(['c'])

    const lastLine = response.trim().split(EOL).pop()

    console.log('--- lastLine ---')
    console.log(lastLine)

    expect(lastLine).toMatch(/请设置压缩图片所需要的api key/)

    done()
  }, MAX_TIME)

  it('设置api key (moke-compress c -k defaultKey)', async (done) => {
    const response = await cli(['c', '-k', defaultKey])
    const lastLine = response.trim().split(EOL).pop().trim()

    console.log('--- lastLine ---')
    console.log(lastLine)

    expect(lastLine).toBe(defaultKey)

    done()

  }, MAX_TIME)

  it('should (moke-compress c)', async (done) => {

    const response = await cli(['c'], [cmd.ENTER])
    const lastLine = response.trim().split(EOL).pop()

    console.log('--- lastLine ---')
    console.log(lastLine)

    expect(lastLine).toMatch(/总数: 3 成功: 3 失败: 0/)

    done()
  }, MAX_TIME)

  describe('自定义参数', () => {

    const sourcePath = 'otherpath'

    const outPath = 'out'

    beforeEach(async () => {
      await shell.cp('-r', path.resolve('..', sourcePath), '.')
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

    it('should (moke-compress c -p sourcePath)', async (done) => {

      const response = await cli(['c', '-p', sourcePath], [cmd.ENTER])
      const lastLine = response.trim().split(EOL).pop()

      console.log('--- lastLine ---')
      console.log(lastLine)

      expect(lastLine).toMatch(/总数: 3 成功: 3 失败: 0/)

      done()
    }, MAX_TIME)

    it('should (moke-compress c -p sourcePath -o out)', async (done) => {

      const response = await cli(['c', '-p', sourcePath, '-o', outPath], [cmd.ENTER])
      const lastLine = response.trim().split(EOL).pop()

      console.log('--- lastLine ---')
      console.log(lastLine)

      expect(lastLine).toMatch(/总数: 3 成功: 3 失败: 0/)

      done()
    }, MAX_TIME)

    it('should (moke-compress c -p sourcePath -o out -s) 同步压缩', async (done) => {

      const response = await cli(['c', '-p', sourcePath, '-o', outPath, '-s'], [cmd.ENTER])
      const lastLine = response.trim().split(EOL).pop()

      console.log('--- lastLine ---')
      console.log(lastLine)

      expect(lastLine).toMatch(/总数: 3 成功: 3 失败: 0/)

      done()
    }, MAX_TIME)

  })
})
