// 检查文档是否更新
// 如何获取包的版本，通过pnpm view xx version

import npmType from '../utils/npm-type';
import { execSync } from 'child_process'; // 子进程的同步执行
import { PKG_NAME, PKG_VERSION } from '../utils/constant';
import ora from 'ora';
import log from '../utils/log';

/**
 * 检测最新版本号
 * 有返回值则要更新，null则不需要更新
 * @returns
 */
const checkVersionUpdate = async (): Promise<string | null> => {
  const npm = await npmType;

  const lastestVersion = execSync(`${npm} view ${PKG_NAME} version`).toString().trim();
  // 相等就不用更新
  if (lastestVersion === PKG_VERSION) return;
  // 比对版本
  const compareArr = PKG_VERSION.split('.').map(Number);
  const lastestArr = lastestVersion.split('.').map(Number);
  // x.y.z
  for (let i = 0; i < compareArr.length; i++) {
    if (compareArr[i] > lastestArr[i]) {
      // 已最新不需要更新
      return null;
    } else if (compareArr[i] < lastestArr[i]) {
      // 需更新
      return lastestVersion;
    }
  }
};

/**
 * 检查cli包版本是否最新
 * autoInstall true表示自动安装
 */
export default async (autoInstall = true) => {
  /// 1. 检查包版本，是否需要更新
  const checking = ora(`[${PKG_NAME}] checking version...`);
  checking.start();

  try {
    const npm = await npmType;
    const lastestVersion = await checkVersionUpdate();
    checking.stop();

    if (lastestVersion && autoInstall) {
      const update = ora(`[${PKG_NAME}] 存在新版本，将升级至${lastestVersion} updating...`);
      update.start();

      // 全局安装脚手架
      execSync(`${npm} install ${PKG_NAME} -g`);

      update.stop();
    } else if (lastestVersion) {
      log.warn(
        `最新版本为 ${lastestVersion}，本地版本为 ${PKG_VERSION}，请尽快升级到最新版本。\n你可以执行 ${npm} install -g ${PKG_NAME}@latest 来安装此版本\n`,
      );
    } else if (autoInstall) {
      log.info('当前没有可用更新');
    }
  } catch (e) {
    checking.stop();
    log.error(e);
  }
};
