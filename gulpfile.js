/**
 * Created by donz on 2017/6/2.
 */
const gulp = require('gulp');
const mocha = require('gulp-mocha');
const istanbul = require('gulp-istanbul');
const webpack = require('webpack-stream');
const child = require('child_process');
const less = require('gulp-less');
const eslint = require('gulp-eslint');
const minify = require('gulp-minify');
const imagemin = require('gulp-imagemin');
const rename = require('gulp-rename');
const clean = require('gulp-clean');
const notify = require('gulp-notify');
const autoprefixer = require('gulp-autoprefixer');
const minifycss = require('gulp-minify-css');
const cache = require('gulp-cache');
const fileinclude = require('gulp-file-include');

const REPORTER = 'dot';
const TEST_FILE = './test/index.js';
const TEST_SUPPORT_SERVER_FILE = './test/support/server.js';
const BUILD_TARGET_DIR = './dist/';
//CSS task
gulp.task('styles', function () {
    gulp.src('src/less/*.less')
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(gulp.dest('dist/css'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(less())
        .pipe(gulp.dest('dist/css'))
        .pipe(notify({ message: 'Styles task complete' }));
})

gulp.task('scripts', function () {
    gulp.src('src/entry.js')
        .pipe(webpack( require('./webpack.config.js') ))
        .pipe(gulp.dest('dist/js'))
        .pipe(notify({ message: 'scripts task complete' }));
})

// 图片
gulp.task('images', function() {
    return gulp.src('src/images/**/*')
        .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
        .pipe(gulp.dest('dist/images'))
        .pipe(notify({ message: 'Images task complete' }));
});
//html
gulp.task('html', function() {
    return gulp.src('src/**/*.html')
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('dist/'))
        .pipe(notify({ message: 'html task complete' }));
});
// 清理
gulp.task('clean', function() {
    return gulp.src(['dist/css', 'dist/js', 'dist/images'], {read: false})
        .pipe(clean());
});

gulp.task('test', ['lint'], function () {
    if (process.env.hasOwnProperty('BROWSER_NAME')) {
        return testZuul();
    } else {
        return testNode();
    }
});
gulp.task('test-node', testNode);
gulp.task('test-zuul', testZuul);
gulp.task('lint', function () {
    return gulp.src([
        '*.js',
        'lib/**/*.js',
        'test/**/*.js',
        'support/**/*.js'
    ])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

function testZuul () {
    const ZUUL_CMD = './node_modules/zuul/bin/zuul';
    const args = [
        '--browser-name',
        process.env.BROWSER_NAME,
        '--browser-version',
        process.env.BROWSER_VERSION
    ];
    if (process.env.hasOwnProperty('BROWSER_PLATFORM')) {
        args.push('--browser-platform');
        args.push(process.env.BROWSER_PLATFORM);
    }
    args.push(TEST_FILE);
    const zuulChild = child.spawn(ZUUL_CMD, args, { stdio: 'inherit' });
    zuulChild.on('exit', function (code) { process.exit(code); });
    return zuulChild;
}

function testNode () {
    const MOCHA_OPTS = {
        reporter: REPORTER,
        require: [TEST_SUPPORT_SERVER_FILE],
        bail: true
    };
    return gulp.src(TEST_FILE, { read: false })
        .pipe(mocha(MOCHA_OPTS))
        // following lines to fix gulp-mocha not terminating (see gulp-mocha webpage)
        .once('error', function (err) {
            console.error(err.stack);
            process.exit(1);
        })
        .once('end', function () {
            process.exit();
        });
}

gulp.task('istanbul-pre-test', function () {
    return gulp.src(['lib/**/*.js'])
    // Covering files
        .pipe(istanbul())
        // Force `require` to return covered files
        .pipe(istanbul.hookRequire());
});

gulp.task('test-cov', ['istanbul-pre-test'], function () {
    gulp.src(['test/*.js', 'test/support/*.js'])
        .pipe(mocha({
            reporter: REPORTER
        }))
        .pipe(istanbul.writeReports())
        .once('error', function (err) {
            console.error(err);
            process.exit(1);
        })
        .once('end', function () {
            process.exit();
        });
});

// 预设任务
gulp.task('default', ['clean'], function() {
    gulp.start('styles', 'scripts', 'images', 'html');
});


