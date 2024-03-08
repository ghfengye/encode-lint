module.exports = {
  extends: [
    './rules/base/best-practices',
    './rules/base/possible-errors',
    './rules/base/style',
    './rules/base/variables',
    './rules/base/es5',
  ].map(require.resolve),
  root: true, // 默认情况下，ESLint在所有父文件夹中查找配置文件，直到根目录。添加root为true，则找到配置文件后不再向上查找
};
