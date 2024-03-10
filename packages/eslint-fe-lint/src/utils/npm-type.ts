// 检查当前npm类型： npm 或pnpm

import {sync as commandExistSync } from 'command-exists';

const promise:Promise<'npm' | 'pnpm'> = new Promise((resolve) => {
  if (!commandExistSync('pnpm')) resolve('npm')
  resolve('pnpm')
});

export default promise