// 入口文件
import initAction from './actions/init'
import type { InitOptions } from './types'

type IInitOptions = Omit<InitOptions, 'checkVersionUpdate'>;

// 初始化
export const init = async (options: IInitOptions) => {
  return await initAction({
    ...options,
    checkVersionUpdate: false
  })
}