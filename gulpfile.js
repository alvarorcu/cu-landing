var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var to5 = require('gulp-6to5');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

gulp.task('default', function () {
    return gulp.src('public/js/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(to5())
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('public/dist'));
});
