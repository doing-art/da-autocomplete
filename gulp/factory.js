export default (taskName, gulp, plugins, dependencies) => {
    System.import('./gulp/tasks/' + taskName).then( (importedModule) => {
        gulp.task(taskName, dependencies, importedModule(gulp, plugins));
    });
}