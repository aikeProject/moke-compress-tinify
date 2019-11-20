/**
 * @author 成雨
 * @date 2019/11/20
 * @Description:
 */

export interface InterfaceConfig {
  key: string; // api key
  path: string; // 压缩目录
  out: string; // 输出目录
  sync: boolean; // 是否异步压缩
}
