import 'babel-polyfill'
import 'classlist-polyfill'
import DaAutocomplete from './DaAutocomplete'

/**
 * в develop версии проекта подключение стилей инлайново
 */
if(NODE_ENV === 'development') {
    require('../stylesheets/main.sass')
}

export {DaAutocomplete}