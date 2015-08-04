'use strict';

var gulp = require('gulp');
var mocha = require('gulp-mocha');
var jshint = require('gulp-jshint');
var webpack = require('gulp-webpack');

gulp.task('default', ['test', 'lint', 'build'], function() {});


gulp.task('test', function() {
  return gulp.src('test/*test.js')
             .pipe(mocha());
          // .pipe(mocha({reporter: 'nyan'}));
});

gulp.task('lint', function() {
  return gulp.src(['*.js', 'test/*.js'])
             .pipe(jshint())
             .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('webpack', function() {
  return gulp.src('app/js/client.js')
    .pipe(webpack({
      output: {
        filename: 'bundle.js'
      }
    }))
    .pipe(gulp.dest('build/'));
});

gulp.task('copy', function() {
  return gulp.src('app/**/*.html')
    .pipe(gulp.dest('build/'));
});

gulp.task('build', ['webpack', 'copy']);

