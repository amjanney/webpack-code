(function(graph){
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
  require('./src/index.js')
})({"./src/index.js":{"modulesPath":{"./test.js":"./src/test.js"},"code":"\"use strict\";\n\nvar _test = _interopRequireDefault(require(\"./test.js\"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { \"default\": obj }; }\n\nconsole.log(\"hello \".concat(_test[\"default\"]));"},"./src/test.js":{"modulesPath":{},"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports[\"default\"] = void 0;\nvar str = 'webpack';\nvar _default = str;\nexports[\"default\"] = _default;"}})