import gulp from 'gulp'
import webpack from 'webpack-stream'

gulp.task('build', () => {
    return gulp.src('./src/javascript/index.js')
        .pipe(webpack(require('./webpack.config.js')))
        .pipe(gulp.dest('./lib/js'));
});