const path = require('path');

// 不在ts项目中使用js文件
const RULE_NAME = 'no-js-in-ts-project';

const JS_REG = /\.jsx?$/;

const DEFAULT_WHITE_LIST = [
  'commitlint.config.js',
  'eslintrc.js',
  'prettierrc.js',
  'stylelintrc.js',
];

module.exports = {
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    fixable: null,
    messages: {
      noJSInTSProject: 'The "{{fileName}}" is not recommended in TS project',
    },
  },

  create(context) {
    // 获取文件名
    const fileName = context.getFilename();
    // 获取文件名后缀
    const extName = path.extname(fileName);
    const ruleOptions = context.options[0] || {};
    console.log('ruleOptions', ruleOptions);
    console.log('fileName', fileName);
    console.log('extName', extName);
    let { whiteList = [], autoMerge = true } = ruleOptions;
    if (whiteList.length === 0) {
      whiteList = DEFAULT_WHITE_LIST;
    } else if (autoMerge) {
      whiteList = [...new Set([...DEFAULT_WHITE_LIST, ...whiteList])];
    }
    const whiteListReg = new RegExp(`(${whiteList.join('|')})$`);
    console.log('11', `(${whiteList.join('|')})$`);

    if (!whiteListReg.test(fileName) && JS_REG.test(extName)) {
      context.report({
        loc: {
          start: {
            line: 0,
            column: 0,
          },
          end: {
            line: 0,
            column: 0,
          },
        },
        messageId: 'noJSInTSProject',
        data: {
          fileName,
        },
      });
    }

    // Necessary
    return {};
  },
};
