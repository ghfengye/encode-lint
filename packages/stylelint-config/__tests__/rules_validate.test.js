const assert = require('assert');
const stylelint = require('stylelint');
const path = require('path');

describe('test.rules.test.js',  () => {
  it('validate default', async () => {
    const filePaths = [path.join(__dirname, './fixtures/index.css')];

    const result = await stylelint.lint({
      configFile: path.join(__dirname, '../index.js'), // 规则的文件
      files: filePaths, // 当前能接收的文件名
      fix: false, // 是否自动修复
    })
    console.log(result);
  })
})