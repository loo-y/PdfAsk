'use strict'

var gulp = require('gulp')
var sass = require('gulp-sass')(require('node-sass'))
var autoprefixer = require('gulp-autoprefixer') // css加兼容的前缀

// sass.compiler = require('node-sass')

function sassTask() {
    return gulp
        .src(['./src/sass/*.scss', './src/sass/**/*.scss'])
        .pipe(sass().on('error', sass.logError))
        .pipe(
            autoprefixer({
                overrideBrowserslist: [
                    'last 2 versions',
                    'last 2 Explorer versions',
                    'not ie < 9',
                    'Firefox >= 20',
                    '> 5%',
                ],
            })
        )
        .pipe(gulp.dest('./src/css'))
}

gulp.task('sass', sassTask)

gulp.task('watch', function () {
    gulp.watch('./src/sass/*.scss', gulp.series('sass'))
    gulp.watch('./src/sass/**/*.scss', gulp.series('sass'))
})


exports.default = sassTask