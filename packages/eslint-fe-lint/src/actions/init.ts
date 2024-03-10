// 初始化

// 问答交互式命令行提示
import inquirer from 'inquirer';
import path from 'path';
import { InitOptions, PKG } from '../types';
import { PROJECT_TYPES, PKG_NAME } from '../utils/constants';
import fs from 'fs-extra';
import update from './update';
import log from '../utils/log';
import conflictResolve from '../utils/conflict-resolve';
import npmType from '../utils/npm-type';
import spawn from 'cross-spawn';
import generateTemplate from '../utils/generate-template';

let step = 0;

/**
 * 选择项目语言与框架
 */
const chooseEslintType = async (): Promise<string> => {
  const { type } = await inquirer.prompt({
    type: 'list',
    name: 'type',
    message: `Step ${++step}. 请选择项目的语言（JS/TS）和框架（React/Vue）类型：`,
    choices: PROJECT_TYPES,
  });
  return type;
};

/**
 * 选择是否启用stylelint
 */
const chooseEnableStylelint = async (defaultValue): Promise<boolean> => {
  const { enable } = await inquirer.prompt({
    type: 'confirm',
    name: 'enable',
    message: `Step ${++step}. 是否启用 stylelint ?`,
    default: defaultValue,
  });
  return enable;
};

/**
 * 选择是否启用markdownlint
 * @returns
 */
const chooseEnableMarkdownlint = async (): Promise<boolean> => {
  const { enable } = await inquirer.prompt({
    type: 'confirm',
    name: 'enable',
    message: `Step ${++step}. 是否启用 markdownlint ?`,
    default: true,
  });
  return enable;
};

/**
 * 选择是否启用prettier
 */
const chooseEnablePrettier = async (): Promise<boolean> => {
  const { enable } = await inquirer.prompt({
    type: 'confirm',
    name: 'enable',
    message: `Step ${++step}. 是否启用 prettier ?`,
    default: true,
  });
  return enable;
};

export default async (options: InitOptions) => {
  const cwd = options.cwd || process.cwd(); // 获取路径，默认为当前路径
  const isTest = process.env.NODE_ENV === 'test'; // 是否为测试环境
  const checkVersionUpdate = options.checkVersionUpdate || false; // 是否检查版本更新

  const disableNpmInstall = options.disableNpmInstall || false; // 是否禁用自动安装依赖
  const config: Record<string, any> = {};

  /// 当前项目是否已有一些配置，比如stylelintrc已有一些配置，需要先合并，不能直接去掉用户的配置
  const pkgPath = path.resolve(cwd, 'package.json');let pkg: PKG = fs.readFileSync(pkgPath); // 读取package.json内容

  // 脚手架版本检查
  if (!isTest && checkVersionUpdate) {
    await update(false); // 默认不安装cli包，一般让用户自己去处理
  }

  /// 初始化配置参数-完成问答参数处理
  // 初始化 `enableESLint`，默认为 true，无需让用户选择
  if (typeof options.enableESLint === 'boolean') {
    config.enableESLint = options.enableESLint;
  } else {
    config.enableESLint = true;
  }

  // 初始化 `eslintType`
  if (options.eslintType && PROJECT_TYPES.find((choice) => choice.value === options.eslintType)) {
    config.eslintType = options.eslintType;
  } else {
    config.eslintType = await chooseEslintType();
  }

  // 初始化 `enableStylelint`
  if (typeof options.enableStylelint === 'boolean') {
    config.enableStylelint = options.enableStylelint;
  } else {
    config.enableStylelint = await chooseEnableStylelint(!/node/.test(config.eslintType));
  }

  // 初始化 `enableMarkdownlint`
  if (typeof options.enableMarkdownlint === 'boolean') {
    config.enableMarkdownlint = options.enableMarkdownlint;
  } else {
    config.enableMarkdownlint = await chooseEnableMarkdownlint();
  }

  // 初始化 `enablePrettier`
  if (typeof options.enablePrettier === 'boolean') {
    config.enablePrettier = options.enablePrettier;
  } else {
    config.enablePrettier = await chooseEnablePrettier();
  }

  /// 解决资源冲突：安装版本的时候解决版本冲突
  if (!isTest) {
    log.info(`Step ${++step}. 检查并处理项目中可能存在的依赖和配置冲突`);
    pkg = await conflictResolve(cwd, options.rewriteConfig);
    log.success(`Step ${step}. 已完成项目依赖和配置冲突检查处理 :D`);

    if(!disableNpmInstall){
      log.info(`Step ${++step}. 安装依赖`);
      const npm = await npmType;
      spawn.sync(
        npm,
        ['i', '-D', PKG_NAME],
        { stdio: 'inherit', cwd },
      );
      log.success(`Step ${step}. 安装依赖成功 :D`);
    }
  }

  // 更新 pkg.json-注入指令
  pkg = fs.readJSONSync(pkgPath);
  // 在 `package.json` 中写入 `scripts`
  if (!pkg.scripts) {
    pkg.scripts = {};
  }
  if (!pkg.scripts[`${PKG_NAME}-scan`]) {
    pkg.scripts[`${PKG_NAME}-scan`] = `${PKG_NAME} scan`;
  }
  if (!pkg.scripts[`${PKG_NAME}-fix`]) {
    pkg.scripts[`${PKG_NAME}-fix`] = `${PKG_NAME} fix`;
  }

  /// 植入模板
  log.info(`Step ${++step}. 写入配置文件`);
  generateTemplate(cwd, config);
  log.success(`Step ${step}. 写入配置文件成功 :D`);

  // 完成信息
  const logs = [`${PKG_NAME} 初始化完成 :D`].join('\r\n');
  log.success(logs);
};
