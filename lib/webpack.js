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
    this.modules = [];
  }

  // 启动函数
  run() {
    const info = this.parse(this.entry);
    this.modules.push(info);

    // 遍历模块
    for (let i = 0; i < this.modules.length; i++) {
      const item = this.modules[i];
      const { modulesPath } = item;
      if (modulesPath) {
        for (let j in modulesPath) {
          this.modules.push(this.parse(modulesPath[j]));
        }
      }
    }
    // 数组结构转换
    const obj = {};
    this.modules.forEach((item) => {
      obj[item.entryPath] = {
        modulesPath: item.modulesPath,
        code: item.code,
      };
    });
    console.log(obj);
    this.file(obj);
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
    // console.log(modulesPath);

    // 把ast处理成标准的代码
    const { code } = transformFromAst(ast, null, {
      presets: ['@babel/preset-env'],
    });
    // console.log(code);

    return {
      entryPath,
      modulesPath,
      code,
    };
  }

  // 生成文件
  file(code) {
    console.log(this.output.path, this.output.filename);
    const filePath = path.join(this.output.path, this.output.filename);
    const newCode = JSON.stringify(code);
    const bundle = `(function(graph){
  function require(module){
    function localRequire(relativePath){
      return require(graph[module].modulesPath[relativePath])
    }
    var exports = {};
    (function(require,exports,code){
      eval(code)
    })(localRequire,exports,graph[module].code)
    
    return exports;
  }
  require('${this.entry}')
})(${newCode})`;
    fs.writeFileSync(filePath, bundle, 'utf-8');
  }
};
