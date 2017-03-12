import daConfig from './DaConfig'

export default class DaAutocomplete {
    constructor(control, config) {
        DaAutocomplete._counter = 0;

        if(typeof control === 'string') {
            this._controlExisting = document.querySelector(control);
        } else {
            this._controlExisting = control;
        }

        this._config = {};
        if(config) {
            for(let prop in daConfig) {
                this._config[prop] = config[prop] || daConfig[prop];
            }
        } else {
            for(let prop in daConfig) {
                this._config[prop] = daConfig[prop];
            }
        }

        this._initSearch();
        this._initTemplate();
    }

    _initSearch() {
        let search = document.createElement('div');
        let placeholder = document.createElement('label');
        let control = this._controlExisting.cloneNode(true);
        let controlId = 'da-autocomplete-search-control-' + (++DaAutocomplete._counter);

        control.id = controlId;
        control.classList.add('da-autocomplete__search-control');

        placeholder.innerText = this._config.placeholderMessage;
        placeholder.htmlFor  = controlId;
        placeholder.className = 'da-autocomplete__search-placeholder';

        search.className = 'da-autocomplete__search';
        search.appendChild(control);
        search.appendChild(placeholder);

        this._search = search;
        this._control = control;
    }

    _initTemplate() {
        let autocomplete = document.createElement('div');
        let autocompleteParent = this._controlExisting.parentNode;

        autocomplete.className = 'da-autocomplete';
        autocomplete.appendChild(this._search);

        autocompleteParent.replaceChild(autocomplete, this._controlExisting);

        this._autocomplete = autocomplete;
    }
}