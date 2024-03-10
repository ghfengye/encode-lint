'use strict';

const rule = require('../../rules/no-http-url');
const { RuleTester } = require('eslint');

const ruleTester = new RuleTester();

ruleTester.run('no-http-url', rule, {
  valid: [ // 合法示例，是否测试用例通过这些示例，并不发出警告或错误
    {
      code: "var test = 'https://chenghuai.com';",
    },
  ],

  invalid: [ // 不合法示例，是否测试用例正确识别这些示例，发出警告或错误
    {
      code: "var test = 'http://chenghuai.com';",
      output: "var test = 'http://chenghuai.com';",
      errors: [
        {
          message: 'Recommended "http://chenghuai.com" switch to HTTPS',
        },
      ],
    },
    {
      code: "<img src='http://chenghuai.com' />",
      output: "<img src='http://chenghuai.com' />",
      parserOptions: { // 解析选项
        ecmaFeatures: {
          jsx: true,
        },
      },
      errors: [
        {
          message: 'Recommended "http://chenghuai.com" switch to HTTPS',
        },
      ],
    },
  ],
});
