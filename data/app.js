var app = module.exports = require('appjs');
app.serveFilesFrom(__dirname + '/content');

var window = app.createWindow({
  width  : 1200,
  height : 600
});

window.on('create', function(){
  window.frame.show();
  window.frame.center();
});

window.on('ready', function(){
  window.require = require;
  window.process = process;
  window.module = module;
  
  window.mdns = require('mdns');
  
  this.addEventListener('keydown', function(e){
    if (e.keyIdentifier === 'F12') {
      this.frame.openDevTools();
    }
  });

  this.Function('return '+function(require, process, Buffer){
    var Module = require('module'),
        path = require('path'),
        nodeCompile = Module.prototype._compile

    Module.prototype._compile = function(content, filename){
      if (inBrowser) {
        return browserCompile.call(this, content, filename);
      } else {
        return nodeCompile.call(this, content, filename);
      }
    };

    var inBrowser = true;
    // entry point is here, currently loads browser-main.js
    document.mainModule = require('./js/browser');
    inBrowser = false;

    function browserCompile(content, filename) {
      var self = this;
      this.exports = {};
      this.children = [];
      content = content.replace(/^\#\!.*/, '');

      function require(request){
        inBrowser = true;
        request = self.require(request);
        inBrowser = false;
        return request;
      }

      require.resolve = function(request){
        return Module._resolveFilename(request, self);
      };

      require.main = document.mainModule;
      var argNames = ['exports', 'require', 'module', '__filename', '__dirname', 'global', 'process', 'Buffer', content];
      var args = [this.exports, require, this, filename, path.dirname(filename), window, process, Buffer];
      return Function.apply(null, argNames).apply(this.exports, args);
    }
  })().call(this, require, process, Buffer);

});