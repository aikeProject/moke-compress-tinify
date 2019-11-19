/**
 * @author 成雨
 * @date 2019/11/19
 * @Description:
 */

import { writeFileSync } from 'fs'

// 切换运行目录到 test 下进行
process.chdir('test')

describe('测试一些node api 用法', () => {

  it('should writeFileSync', function() {
    try {
      writeFileSync('some/test.txt', 'some content')
    } catch (e) {
      if (e.code === 'ENOENT') {
        console.log('ENOENT (无此文件或目录): 通常是由 fs 操作引起的，表明指定的路径不存在，即给定的路径找不到文件或目录')
      }
    }
  })

})
