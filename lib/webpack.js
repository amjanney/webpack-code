const fs = require('fs');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

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

  // 分析文件
  parse(entryFile) {
    // console.log(entryFile);
    const content = fs.readFileSync(entryFile, 'utf-8');
    // console.log(content);
    // 分析内容，得到ast
    const ast = parser.parse(content, {
      sourceType: 'module',
    });
    // 对生的ast进行遍历，增删改查

    console.log(ast.program.body);
  }

  // 生成文件
  file() {}
};
