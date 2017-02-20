import gulp from 'gulp'
import webpack from 'webpack-stream'
import sourcemaps from 'gulp-sourcemaps'
import rename from 'gulp-rename'
import uglify from 'gulp-uglify'

export default () => {
    return () => {
        return gulp.src('./src/stylesheets/main.sass')
            .pipe(webpack(require('../../webpack.config.js')))
            .pipe(gulp.dest('./lib/css'))
            .pipe(sourcemaps.init({ loadMaps: true }))
            .pipe(uglify({ preserveComments: 'license' }))
            .pipe(rename('da-autocomplete.min.css'))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('./lib/js'));
    };
}