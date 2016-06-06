var gulp = require('gulp'),
    commonjs = require('rollup-plugin-commonjs'),
    resolve = require('rollup-plugin-node-resolve'),
    concat = require('gulp-concat'),
    rollup = require('gulp-rollup'),
    sourcemaps = require('gulp-sourcemaps'),
    connect = require('gulp-connect'),
    babel = require('gulp-babel'),
    ngAnnotate = require('gulp-ng-annotate'),
    uglify = require('gulp-uglify'),
    server = require('gulp-develop-server'),
    replace = require('gulp-replace');

var env = process.env.NODE_ENV || 'development',
    apiUrls = {
        development: 'http://localhost:5000/api',
        production: '/api'
    },
    options = {
        server: {
            path: './server/init.js',
            execArgv: ['--harmony']
        }
    };


function build() {
    return gulp.src("./server/init.js", {read: false})
        .pipe(rollup({
            sourceMap: true,
            plugins: [resolve({jsnext: true}), commonjs()]
        }))
        .pipe(babel({presets: ['es2015']}))
        .pipe(ngAnnotate())
        .pipe(replace(/\{\{API_URL\}\}/g, apiUrls[env]))
        //.pipe(sourcemaps.write("."))
        .pipe(gulp.dest('dist'));
}

gulp.task('compress', ['build'], function () {
    return gulp.src('./dist/init.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

gulp.task('build', build);

gulp.task('watch', ['server:start'], function () {
    gulp.watch('app/**/*.js', ['build']);
    gulp.watch('api/**/*.js', ['server:restart']);
});

gulp.task('connect', ['watch'], function () {
    connect.server({
        port: 4000,
        livereload: true
    });
});

gulp.task('server:start', function () {
    server.listen(options.server);
});
gulp.task('server:restart', function () {
    server.restart();
});

var tasks = {
    development: ['connect'],
    production: ['compress']
};
gulp.task('default', tasks[env]);