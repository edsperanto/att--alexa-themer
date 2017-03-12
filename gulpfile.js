const gulp = require('gulp');
const scss = require('gulp-sass');
const connect = require('gulp-connect');

gulp.task('scss', () => {
  return gulp.src('./scss/*.scss')
    .pipe(scss())
    .pipe(gulp.dest('./public/css'));
});

// gulp.task('connect', function(){
//   connect.server({
//     root: './public',
//     livereload: true
//   })
// })

gulp.task('watch', ['live-reload'], ()=>{
  gulp.watch('./scss/**/*.scss', ['scss']);
});

gulp.task('default', ['scss', 'watch']);

gulp.task('live-reload', function(){
  gulp.src('./public/**/*')
  .pipe(connect.reload());
});