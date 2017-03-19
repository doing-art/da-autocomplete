import daConfig from './DaConfig'
import DaHelpers from './DaHelpers'

export default class DaAutocomplete {
    constructor(control, config) {
        DaAutocomplete._counter = DaAutocomplete._counter || 0;
        this._controlId = 'da-autocomplete-search-control-' + (++DaAutocomplete._counter);

        if(control) {
            this._initControlExisting(control);
            this._initConfig(config);
            this._initTemplate();
            this._initSearch();
            this._initResult();
            this._initValidation();
        } else {
            console.log('Передайте селектор либо элемент(Node) первым параметром.');
        }
    }

    _initControlExisting(control) {
        if(control) {
            if(typeof control === 'string') {
                this._controlExisting = document.querySelector(control);
            } else {
                this._controlExisting = control;
            }
        }
    }

    _initConfig(config) {
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
    }

    _initTemplate() {
        let autocomplete = document.createElement('div');
        let autocompleteParent = this._controlExisting.parentNode;
        let autocompleteWidth = this._controlExisting.offsetWidth;

        autocomplete.className = 'da-autocomplete';
        autocomplete.style.width = `${autocompleteWidth}px`;
        autocompleteParent.replaceChild(autocomplete, this._controlExisting);

        this._autocomplete = autocomplete;
    }

    _initSearch() {
        let search = document.createElement('div');
        let placeholder = document.createElement('label');
        let control = this._controlExisting.cloneNode(true);
        let itemClick = new Event('click');

        control.id = this._controlId;
        control.classList.add('da-autocomplete__search-control');

        control.addEventListener('focus', () => {
            this._autocomplete.classList.add('da-autocomplete--focus')
            if(!this._autocomplete.classList.contains('da-autocomplete--select') && control.value.length > 0) {
                this._open();
            }
        });

        control.addEventListener('blur', () => {
            this._autocomplete.classList.remove('da-autocomplete--focus')
        });

        control.addEventListener('input', () => {
            if(control.value.length > 0) {
                this._open();
                this._autocomplete.classList.add('da-autocomplete--full');
            } else {
                this._close();
                this._autocomplete.classList.remove('da-autocomplete--full');
            }

            this._startSearch(control.value);
        });

        document.addEventListener('click', (e) => {
            if(!DaHelpers.isChildOf(e.target, this._autocomplete) && this._isOpen()) {
                let itemNumber = this._resultList.childElementCount;

                if(itemNumber !== 1 || this._isLoading()) {
                    this._autocomplete.classList.add('da-autocomplete--validation-error');
                }
                if(itemNumber === 1) {
                    this._resultList.querySelector('.da-autocomplete__result-item').dispatchEvent(itemClick);
                }

                this._clearSelected();
                this._close();
            }
        });

        placeholder.innerText = this._config.placeholderMessage;
        placeholder.htmlFor = this._controlId;
        placeholder.className = 'da-autocomplete__search-placeholder';
        placeholder.setAttribute('unselectable', 'on');

        search.className = 'da-autocomplete__search';
        search.appendChild(control);
        search.appendChild(placeholder);

        this._search = search;
        this._control = control;

        this._autocomplete.appendChild(search);
    }

    _initResult() {
        let result = document.createElement('div');
        let resultList = document.createElement('ul');
        let prloader = document.createElement('div');
        let success = document.createElement('div');
        let empty = document.createElement('div');

        let notification = document.createElement('div');
        let message = document.createElement('div');
        let reloadBtn = document.createElement('button');

        result.className = 'da-autocomplete__result';
        resultList.className = 'da-autocomplete__result-list';
        prloader.className = 'da-autocomplete__result-preloader';
        prloader.innerText = this._config.preloaderText;
        success.className = 'da-autocomplete__result-success';
        empty.className = 'da-autocomplete__result-empty';
        empty.innerText = this._config.serverEmptyMessage;

        notification.className = 'da-autocomplete__result-notification';
        message.className = 'da-autocomplete__result-message';
        message.innerText = this._config.serverErrorMessage;
        reloadBtn.setAttribute('type', 'button');
        reloadBtn.className = 'da-autocomplete__result-reload';
        reloadBtn.innerText = this._config.reloadButtonText;

        reloadBtn.addEventListener('click', () => {
            this._startSearch(this._control.value);
        });

        notification.appendChild(message);
        notification.appendChild(reloadBtn);

        result.appendChild(resultList);
        result.appendChild(prloader);
        result.appendChild(success);
        result.appendChild(empty);
        result.appendChild(notification);

        this._preloader = prloader;
        this._resultList = resultList;
        this._success = success;

        this._autocomplete.appendChild(result);
    }

    _initValidation() {
        let validation = document.createElement('label');
        let validationError = document.createElement('div');

        validation.className = 'da-autocomplete__validation';
        validation.htmlFor = this._controlId;

        validationError.className = 'da-autocomplete__validation-error';
        validationError.innerText = this._config.validationErrorMessage;

        validation.appendChild(validationError);

        this._autocomplete.appendChild(validation);
    }

    _startSearch(searchPhrase) {
        let XHR = ('onload' in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;
        let xhr = new XHR();
        let url = `${this._config.requestUrl}?searchPhrase=${searchPhrase}&resultNumberToShow=${this._config.resultNumberToShow}`;

        xhr.open('GET', url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');

        let promise = new Promise( (resolve, reject) => {
            let timer;

            xhr.onload = () => {
                timer && clearTimeout(timer);
                this._hidePrloader().then( () => {
                    xhr.status === 200 ? resolve( xhr.responseText && JSON.parse(xhr.responseText) ) : reject();
                });
            };

            timer = this._showPreloader();
            this._clearResult();
            xhr.send();
        });

        promise.then( (result) => {
            if(result.data && result.data.length) {
                this._resultList.innerHTML = this._getResultListContent(result.data);
                this._reinitResultItems();
                this._showSuccesMessage(result.data.length, result.total);
            } else {
                this._autocomplete.classList.add('da-autocomplete--empty');
            }
        }, () => {
            this._autocomplete.classList.add('da-autocomplete--error');
            this._hideSuccesMessage();
        });
    }

    _reinitResultItems() {
        let resultItems = this._resultList.querySelectorAll('.da-autocomplete__result-item');
        let itemFocused = this._itemFocused = resultItems && resultItems[0];
        let itemSelected = this._itemSelected = this._resultList.querySelector('.da-autocomplete__result-item--select');

        for(let resultItem of resultItems) {
            resultItem.addEventListener('click', (e) => {
                this._control.value = e.target.innerText;
                this._clearResult();

                this._autocomplete.classList.add('da-autocomplete--select');
                itemSelected = e.target;
                itemSelected.classList.add('da-autocomplete__result-item--select');
                this._itemSelected = itemSelected;

                this._close();
            });

            resultItem.addEventListener('mouseenter', (e) => {
                itemFocused && itemFocused.classList.remove('da-autocomplete__result-item--focus');
                itemFocused = e.target;
                itemFocused.classList.add('da-autocomplete__result-item--focus');
                this._itemFocused = itemFocused;
            });
        }
    }

    _clearResult() {
        this._resultList.innerHTML = '';

        this._autocomplete.classList.remove('da-autocomplete--error');
        this._autocomplete.classList.remove('da-autocomplete--success');
        this._autocomplete.classList.remove('da-autocomplete--empty');
        this._autocomplete.classList.remove('da-autocomplete--validation-error');
        this._autocomplete.classList.remove('da-autocomplete--select');
    }

    _clearSelected() {
        if(this._itemSelected) {
            this._itemSelected.classList.remove('da-autocomplete__result-item--select');
            this._itemSelected = null;
        }
    }

    _showSuccesMessage(shownNumber, totalNumber) {
        let message = this._config.serverSucccessMessage;

        message = message.replace(/\$\{shown\}/, shownNumber);
        message = message.replace(/\$\{total\}/, totalNumber);
        this._success.innerText = message;

        if(shownNumber && totalNumber && totalNumber > shownNumber) {
            this._autocomplete.classList.add('da-autocomplete--success');
        }
    }

    _hideSuccesMessage() {
        this._autocomplete.classList.remove('da-autocomplete--success');
    }

    _showPreloader() {
        return setTimeout( () => {
            this._preloader.classList.add('da-autocomplete__result-preloader--show');
            this._preloaderShowMoment = new Date();
        }, this._config.preloaderShowingDelay);
    }

    _hidePrloader() {
        let preloaderShowMoment = this._preloaderShowMoment;
        let preloaderMinShowDuration = this._config.preloaderMinShowDuration;

        let preloaderShowDuration = preloaderShowMoment ?
            (new Date()) - preloaderShowMoment : preloaderMinShowDuration;

        let preloaderHiddenDelay = preloaderShowDuration < preloaderMinShowDuration ?
            preloaderMinShowDuration - preloaderShowDuration : 0;

        preloaderShowMoment = null;

        return new Promise( (resolve) => {
            setTimeout( () => {
                this._preloader.classList.remove('da-autocomplete__result-preloader--show');
                resolve();
            }, preloaderHiddenDelay);
        });
    }

    _open() {
        let distanceToBottom = window.innerHeight - this._control.getBoundingClientRect().bottom;

        if(distanceToBottom < this._config.openOnTopDistance) {
            this._autocomplete.classList.add('da-autocomplete--open-top');
        }

        this._autocomplete.classList.add('da-autocomplete--open');
    }

    _close() {
        this._autocomplete.classList.remove('da-autocomplete--open');
        this._autocomplete.classList.remove('da-autocomplete--open-top')
    }

    _isOpen() {
        return this._autocomplete.classList.contains('da-autocomplete--open');
    }

    _isLoading() {
        return this._preloader.classList.contains('da-autocomplete__result-preloader--show');
    }

    _getResultListContent(result) {
        let content = '';
        let selectedValue = this._itemSelected && this._itemSelected.innerText;

        if(result) {
            for(let [index, item] of result.entries()) {
                content += `<li class="da-autocomplete__result-item ${index === 0 ? 
                    'da-autocomplete__result-item--focus' : ''} ${item.City === selectedValue ?
                    'da-autocomplete__result-item--select' : ''}">${item.City}</li>`;
            }
        }

        return content;
    }
}