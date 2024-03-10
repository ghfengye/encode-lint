// 建议将http转为https链接

// literal node string
const RULE_NAME = 'no-http-url';
module.exports = {
  name: RULE_NAME,
  // 定义当前规则的建议
  meta: {
    type: "suggestion", // 这是个建议类型
    fixable: null, // 不自动修复
    messages: {
      noHttpUrl: 'Recommended "{{url}}" switch to HTTPS',
    }
  },
  create(context) {
    // AST 解析
    // visitor
    return {
      // 字面量
      Literal: function handleRequires(node) {
        // node 为当前匹配到的节点
        if (node.value && typeof node.value === 'string' && node.value.indexOf('http:') === 0) {
          context.report({
            node,
            messageId: 'noHttpUrl',
            data: {
              url: node.value
            }
          })
        }
      }
    }
  }
}