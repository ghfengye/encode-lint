const rule = require('../../rules/no-broad-semantic-versioning');
const { RuleTester } = require('eslint');

const ruleTester = new RuleTester();

ruleTester.run('no-broad-semantic-versioning', rule, {
  valid: [
    // 找到package.json, 校验通过
    {
      filename: 'package.json',
      code: `module.exports = ${JSON.stringify({
        devDependencies: { 'eslint-plugin-encode': '^0.0.5' },
      })}`,
    },
    // 不匹配直接跳过
    {
      filename: 'package.js',
      code: 'var t = 1',
    },
  ],

  invalid: [
    // 不合法示例，是否测试用例正确识别这些示例，发出警告或错误
    {
      filename: 'package.json',
      code: `module.exports = ${JSON.stringify({
        devDependencies: { 'eslint-plugin-encode': '*' },
      })}`,
      errors: [
        {
          message: 'The "eslint-plugin-encode" is not recommended to use "*"',
        },
      ],
    },
  ],
});
