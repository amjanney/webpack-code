const fs = require('fs');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const path = require('path');
const { transformFromAst } = require('@babel/core');

module.exports = class Webpack {
  constructor(options) {
    // console.log(options);

    const { entry, output } = options;
    this.entry = entry;
    this.output = output;
  }

  // 启动函数
  run() {
    this.parse(this.entry);
  }

  // 分析文件(先从入口文件开始)
  parse(entryPath) {
    // console.log(entryPath);
    // 1.读取问价你的内容
    const content = fs.readFileSync(entryPath, 'utf-8');
    // console.log(content);

    // 2.分析内容，得到ast
    const ast = parser.parse(content, {
      sourceType: 'module',
    });
    // console.log(ast.program.body);

    // 3.对生成的ast进行遍历
    const modulesPath = {};
    traverse(ast, {
      ImportDeclaration({ node }) {
        // console.log(node);
        // 拿到模块依赖在项目中的路径(必须是项目的根目录)
        const originPath = node.source.value;
        const newPath = './' + path.join(path.dirname(entryPath), originPath);
        // console.log(newPath);
        modulesPath[originPath] = newPath;
      },
    });

    // 把ast处理成标准的代码
    transformFromAst(ast, null, {});
    console.log(modulesPath);
  }

  // 生成文件
  file() {}
};
