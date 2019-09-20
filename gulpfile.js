var del = require('del');
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var mincss = require('gulp-clean-css');//压缩css
var inline = require('gulp-inline-source'); //资源内联 （主要是js，css，图片）
var include = require('gulp-include'); //资源内联（主要是html片段）
var sequence = require('gulp-sequence');
var useref = require('gulp-useref'); //合并文件
var gulpif = require('gulp-if');
var print = require('gulp-print'); //打印命中的文件
var connect = require('gulp-connect'); //本地服务器
// var run = require('gulp-run');
var browserSync = require('browser-sync').create()





//清理构建目录
gulp.task('clean', function (cb) {
    del(['dist']).then(function () {
        cb();
    })
});

gulp.task('preview', ['clean'], function (a) {
    gulp.run('fileinclude');
});

gulp.task('mincss', function () {
    return gulp.src('./src/css/*.css')
        .pipe(mincss())
        .pipe(gulp.dest('dist/css/'))
        .pipe(browserSync.reload({
            stream: true
        }))
});


gulp.task('minimg', function () {
    gulp.src('src/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/images/'))
        .pipe(browserSync.reload({
            stream: true
        }))
});


gulp.task('minjs', function () {
    return gulp.src('./src/js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/js/'))
        .pipe(browserSync.reload({
            stream: true
        }))
});


gulp.task('html', function () {
    return gulp.src('./src/*.html')
        .pipe(inline())//把js内联到html中
        .pipe(include())//把html片段内联到html主文件中
        .pipe(useref())//根据标记的块  合并js或者css
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', mincss()))
        .pipe(browserSync.reload({
            stream: true
        })) //重新构建后自动刷新页面
        .pipe(gulp.dest('dist/'))
});



//本地服务器  支持自动刷新页面
gulp.task('connect', function () {
    browserSync.init({
        port: 8080,
        server: {
            baseDir: ['./dist'],
            livereload: true
        }
    })
});


// 代码复用
gulp.task('fileinclude', function () {
    gulp.src('./src/public/*.html')
        .pipe(include())
        .pipe(gulp.dest('./dist/public/'))
        .pipe(browserSync.reload({
            stream: true
        }))
    gulp.watch('./src/*.html', ['html']);
});


gulp.task('debug', ['connect'], function () {
    sequence('clean', ['mincss', 'minimg', 'minjs', 'html'])
    gulp.watch('./src/css/*.css', ['mincss']);
    gulp.watch('./src/js/*.js', ['minjs']);
    gulp.watch('./src/images/*', ['minimg']);
    gulp.watch('./src/*.html', ['html']);
    gulp.watch('./src/public/*.html', ['fileinclude']);
});
//sequence的返回函数只能运行一次 所以这里用function cb方式使用
gulp.task('watchlist', function (cb) {
    sequence('clean', ['mincss', 'minimg', 'minjs', 'html'])(cb)
});

gulp.task('watch', function () {
    gulp.watch('./src/**', ['mincss', 'minimg', 'minjs', 'html']);
});
