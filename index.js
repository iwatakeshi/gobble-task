const gobble = require('gobble')

class Task {
  /**
   * @param {Object} tasks A dictionary of tasks that may contain operations
   * @example
   * ```js
   * // Create a task with no operations
   * Task.create({ 'app/root' : false })
   * 
   * // Create a task with multiple operations
   * Task.create({ 'app/js' : [{ 'babelify': { options: { /* babelify options */ } }}, {'operation...n': {}}]
   *
   * // Create multiple tasks
   * Task.create({
   *  'app/root': false,
   *  'app/js': [
   *    {
   *      'babelify': {
   *        options: {
   *          entries: [ './app.js' ],
   *          dest: 'bundle.js',
   *          standalone: 'app',
   *          debug: true
   *        }
   *      }
   *    },
   *    {
   *      'uglifyjs': {
   *        options: {
   *          ext: '.min.js'
   *        }
   *      }
   *    }
   *  ],
   *  'sass': {
   *    dir: 'app/styles',
   *    options: {
   *      src: 'main.scss',
   *      dest: 'main.css'
   *    }
   *  },
   *
   *})
   * ```
   */
  static create(tasks = {}) {
    /* Iterate through all tasks */
    return Object.keys(tasks).map(name => {
      /* Get the value of the current task */
      const value = tasks[name]
      /* Check the type of 'value' */
      const isArray = Array.isArray(value)
      const isNOOP = value === false
      const hasOpts = value ? !!value.options : false
      if (isArray) {
        value.unshift(gobble(name))
        return value.reduce((prev, curr) => {
          let n = Object.keys(curr)[0], v = curr[n];
          return v === false ? prev.transform(n) : prev.transform(n, v.options);
        })
      }
      else if (isNOOP) return gobble(name)
      else if (hasOpts) return gobble(value.dir).transform(name, value.options)
      else return gobble(value.dir).transform(name)
    })
  }
}
modules.export = Task
