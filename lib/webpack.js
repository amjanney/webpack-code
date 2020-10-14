const fs = require('fs');

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
    console.log(content);
  }

  // 生成文件
  file() {}
};