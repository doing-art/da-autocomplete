import gulp from 'gulp'
import webpack from 'webpack-stream'
import sourcemaps from 'gulp-sourcemaps'
import rename from 'gulp-rename'
import uglify from 'gulp-uglify'

import factory from './gulp/factory'

factory('scripts', gulp);

gulp.task('build', () => {
    return gulp.src('./src/javascript/index.js')
        .pipe(webpack(require('./webpack.config.js')))
        .pipe(gulp.dest('./lib/js'))
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(uglify({ preserveComments: 'license' }))
        .pipe(rename('da-autocomplete.min.js'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./lib/js'));
});