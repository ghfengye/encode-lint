// 返回给用户的默认配置项-推荐规则
module.exports = {
  // 插件命名
  plugins: ['encode-fe-eslint-plugin'],
  rules: {
    'encode-fe-eslint-plugin/no-http-url': 'warn',
    'encode-fe-eslint-plugin/no-secret-info': 'error',
  },
}