//Define gulp and the other plugins.
let pkg         = require("./package.json");
    gulp        = require("gulp");
    uglify      = require('gulp-uglify');
    concat      = require('gulp-concat');
    del         = require('del');
    babel       = require('gulp-babel');
    es2015      = require('babel-preset-es2015');
    babelify    = require('babelify');
    browserify  = require('browserify');
    gulp        = require('gulp');
    runSequence = require('run-sequence');
    source      = require('vinyl-source-stream');
    streamify   = require('gulp-streamify');
    buffer      = require('vinyl-buffer');

//Define some directorys for convience
let SRC         = './src';
let SRC_ASSETS  = './src/assets/**/*';

let OUT         = './dist';
let OUT_ASSETS  = './dist/assets';

//Define the default task
gulp.task('default', ['build']);

//Build task
gulp.task('build', function () {
    return browserify({
         entries: SRC + '/Main.js'
        })
        .transform("babelify", {presets: [es2015]})
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(streamify(uglify()))
        .pipe(gulp.dest(OUT));
});

//A task that copys assets and builds in sequence using runSequence
gulp.task('buildcopy', function(callback) {
  runSequence(['clean', 'build'], 'copy', callback);
});

//Copy assets
gulp.task('copy', function() {
    gulp.src(SRC_ASSETS)
        .pipe(gulp.dest(OUT_ASSETS))
});

//Cleans assets folder using del module
gulp.task('clean', function () {
  return del([
    // here we use a globbing pattern to match everything inside the target folder
    OUT_ASSETS + '/**/*'//,
    // if you don't want a file you can negate the pattern as below
    //'!src/js/bundle.min'
  ], {force : true});
});