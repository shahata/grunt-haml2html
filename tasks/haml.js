'use strict';

var dargs = require('dargs');
var async = require('async');
var path = require('path');

module.exports = function(grunt) {
  grunt.registerMultiTask('haml', 'Compile Haml to HTML', function() {
    var options = this.options();
    var cb = this.async();

    grunt.verbose.writeflags(options, 'Options');

    var bundleExec = options.bundleExec;
    delete options.bundleExec;

    var encoding = options.encoding;
    delete options.encoding;

    async.each(this.files, function(f, next) {
      var filepath = f.src[0];

      // Warn on and remove invalid source files (if nonull was set).
      if (!grunt.file.exists(filepath)) {
        grunt.log.warn('Source file "' + filepath + '" not found.');
        next();
      } else {
        var args = ['haml', f.src[0], f.dest].concat(dargs(options));

        if (bundleExec) {
          args.unshift('bundle', 'exec');
        }

        if (encoding) {
          args.push('-E', encoding);
        }

        args.push('--load-path', path.dirname(filepath));

        // Make sure grunt creates the destination folders
        grunt.file.write(f.dest, '');

        grunt.util.spawn({
          cmd: args.shift(),
          args: args
        }, function(error, result, code) {
          if (code === 127) {
            return grunt.warn(
              'You need to have Ruby and Haml installed and in your PATH for\n' +
              'this task to work. More info:\n' +
              'https://github.com/jhchen/grunt-haml2html'
            );
          }
          next(error);
        });
      }
    }, cb);
  });
};
