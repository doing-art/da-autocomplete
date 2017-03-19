import 'babel-polyfill'
import 'classlist-polyfill'
import DaAutocomplete from './DaAutocomplete'

if(NODE_ENV === 'development') {
    require('../stylesheets/main.sass')
}

export {DaAutocomplete}