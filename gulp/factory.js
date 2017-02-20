import gulp from 'gulp'

export default (taskName, dependencies) => {
    gulp.task(taskName, dependencies, require(`./tasks/${taskName}.js`)() );
}