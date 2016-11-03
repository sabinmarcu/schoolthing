'use strict';

var gulp = require('gulp');
var bower = require('gulp-bower');
var browserSync = require('browser-sync');

// Load plugins
var $ = require('gulp-load-plugins')({
    rename: {
            'gulp-ruby-sass': 'sass'
        }
    });

gulp.task('bower', function() {
    return bower()
        .pipe(gulp.dest('bower_components'));
});

gulp.task('fonts', function() {
    return gulp.src('bower_components/mdi/fonts/**.*')
        .pipe(gulp.dest('build'));
});

gulp.task('scss', function(){
    var browsers = [
        '> 1%',
        'last 2 versions',
        'Firefox ESR',
        'Opera 12.1'
    ];

    return gulp.src(['src/styles/main.sass'])
        .pipe($.sass({
            style: 'expanded',
            loadPath: [
                'src/styles',
                'bower_components'
            ]
        })
        .on('error', $.util.log))
        .pipe($.postcss([
            require('autoprefixer-core')({
                browsers: browsers
            })
        ]))
        .pipe(gulp.dest('build/styles'))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('less', function() {
    var browsers = [
        '> 1%',
        'last 2 versions',
        'Firefox ESR',
        'Opera 12.1'
    ];

    return gulp.src('src/**/*.less')
        .pipe($.less({
            paths: ['bower_components']
        })
        .on('error', $.util.log))
        .pipe($.postcss([
                require('autoprefixer-core')({
                    browsers: browsers
                })
            ]))
        .pipe(gulp.dest('build'))
        .pipe(browserSync.reload({stream: true}));
    });

gulp.task('styles', ['scss', 'less']);


gulp.task('views', function(){
    return gulp.src([
            '!src/views/layout.jade',
            'src/views/*.jade'
        ])
        .pipe($.jade({
            pretty: true
        }))
        .on('error', $.util.log)
        .pipe(gulp.dest('build'))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('fonts', function() {
    return gulp.src('bower_components/mdi/fonts/**.*')
        .pipe(gulp.dest('build/fonts'));
});

gulp.task('images', function() {
    return gulp.src('src/images/**/*')
        .pipe($.imagemin({
            svgoPlugins: [{
                convertPathData: false
            }]
        }))
        .pipe(gulp.dest('build/images'));
});

gulp.task('resources', ['images', 'fonts']);

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: './build'
        }
    });
});


gulp.task('watch', ['build'], function() {
    gulp.watch('src/styles/**/*', ['styles']);
    gulp.watch('src/images/**/*', ['images']);
    gulp.watch('src/**/*.jade', ['views']);

    gulp.start('browser-sync');
});

// JSHint grunfile.js
gulp.task('selfcheck', function() {
    return gulp.src('gulpfile.js')
        .pipe($.jshint())
        .pipe($.jshint.reporter('default'))
        .pipe($.jshint.reporter('fail'));
});


gulp.task('clean', function(cb) {
    var del = require('del');
    del(['build'], cb);
});


gulp.task('build', ['styles', 'views', 'resources']);


gulp.task('default', ['selfcheck', 'clean'], function() {
    gulp.start('watch');
});
