const path = require("path")

// 校验package.json 中的版本规则为~ 或 ^ ，否则就报错
const RULE_NAME = "no-broad-semantic-versioning" // 版本依赖

module.exports = {
  name: RULE_NAME,
  meta: {
    type: "problem", // 这是个错误类型
    fixable: null,
    messages: {
      noBroadSemanticVersioning:
        'The "{{dependencyName}}" is not recommended to use "{{versioning}}"',
    },
  },

  create(context) {
    // 判断是不是package.json
    if (path.basename(context.getFilename()) !== "package.json") {
      return {}
    }
    const cwd = context.getCwd() // 获取根目录地址
    return {
      Property(node) {
        console.log('node', node)
        if (
          node.key &&
          node.key.value &&
          (node.key.value === 'dependencies' || node.key.value === 'devDependencies') &&
          node.value &&
          node.value.properties
        ) {
          node.value.properties.forEach(property => {
            // console.log("property", property)
            console.log(" property.loc", property.loc)
            const dependencyName = property.key.value
            const dependencyVersion = property.value.value
            console.log(" dependencyName", dependencyName)
            console.log("dependencyVersion", dependencyVersion)
            if (
              // *
              dependencyVersion.indexOf("*") > -1 ||
              // x.x
              dependencyVersion.indexOf("x") > -1 ||
              // > x
              dependencyVersion.indexOf(">") > -1
            ) {
              context.report({
                loc: property.loc,
                messageId: "noBroadSemanticVersioning",
                data: {
                  dependencyName,
                  versioning: dependencyVersion,
                },
              })
            }
          })
        }
      },
    }
  },
}
