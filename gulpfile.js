var gulp = require('gulp');
var eslint = require('gulp-eslint');
var $ = require('gulp-load-plugins')();
var open = require('open');

var app = {
  srcPath: 'src/',
  devPath: 'build/',
  prdPath: 'dist/',
  staticPath: 'static/'
};

gulp.task('lib', function() {
  gulp.src(['bower_components/**/*.js', 'bower_components/**/*.css'])
  .pipe(gulp.dest(app.devPath + 'vendor'))
  .pipe(gulp.dest(app.prdPath + 'vendor'))
  .pipe($.connect.reload());
});

gulp.task('html', function() {
  gulp.src(app.srcPath + '**/*.html')
  .pipe(gulp.dest(app.devPath))
  .pipe(gulp.dest(app.prdPath))
  .pipe($.connect.reload());
})

gulp.task('less', function() {
  gulp.src(app.srcPath + 'app.less')
  .pipe($.plumber())
  .pipe($.less())
  // .pipe($.autoprefix({browsers: ['last 3 version']}))
  .pipe(gulp.dest(app.devPath + 'css'))
  .pipe($.cssmin())
  .pipe(gulp.dest(app.prdPath + 'css'))
  .pipe($.connect.reload());
});

gulp.task('js', function() {
  gulp.src(app.srcPath + '**/*.js')
  .pipe($.plumber())
  .pipe($.concat('app.js'))
  .pipe(gulp.dest(app.devPath + 'js'))
  .pipe($.uglify())
  .pipe(gulp.dest(app.prdPath + 'js'))
  .pipe($.connect.reload());
});

gulp.task('image', function() {
  gulp.src(app.srcPath + 'image/**/*')
  .pipe($.plumber())
  .pipe(gulp.dest(app.devPath + 'image'))
  .pipe($.imagemin())
  .pipe(gulp.dest(app.prdPath + 'image'))
  .pipe($.connect.reload());
});

gulp.task('css', function() {
  gulp.src([app.staticPath + '**/*.css', '!' + app.staticPath + 'font-awesome{,/**}'])
  .pipe(gulp.dest(app.devPath + 'css'))
  .pipe(gulp.dest(app.prdPath + 'css'))
  .pipe($.connect.reload());
});

gulp.task('static', function() {
  gulp.src(app.staticPath + 'assetRecord.xlsx')
  .pipe(gulp.dest(app.devPath + 'static'))
  .pipe(gulp.dest(app.prdPath + 'static'))
  .pipe($.connect.reload());
});

gulp.task('fontAwesome', function() {
  gulp.src([app.staticPath + 'font-awesome/**/*', '!' + app.staticPath + 'font-awesome/less{,/**}', '!' + app.staticPath + 'font-awesome/scss{,/**}'])
  .pipe(gulp.dest(app.devPath + 'vendor/font-awesome'))
  .pipe(gulp.dest(app.prdPath + 'vendor/font-awesome'))
  .pipe($.connect.reload());
});

gulp.task('build', ['lib', 'html', 'less', 'js', 'image', 'css', 'static', 'fontAwesome']);

gulp.task('clean', function() {
  gulp.src([app.devPath, app.prdPath])
  .pipe($.clean());
});

gulp.task('serve', ['build'], function() {
  $.connect.server({
    root: [app.devPath],
    livereload: true,
    port: 3000
  });

  open('http://localhost:3000');

  gulp.watch(['bower_components/**/*.js', 'bower_components/**/*.css'], ['lib']);
  gulp.watch(app.srcPath + '**/*.html', ['html']);
  gulp.watch(app.srcPath + '**/*.less', ['less']);
  gulp.watch(app.srcPath + '**/*.js', ['js']);
  gulp.watch(app.srcPath + 'image/**/*', ['image']);
  gulp.watch([app.staticPath + '**/*.css', '!' + app.staticPath + 'font-awesome{,/**}'], ['css']);
});

gulp.task('default', ['serve']);
