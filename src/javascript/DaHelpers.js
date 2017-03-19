/**
 * класс, содержащий вспомогательные методы
 */
export default class DaHelpers {
    /**
     * проверка является ли @child потомком @parent
     * @param child { element }
     * @param parent { element }
     * @returns { boolean }
     */
    static isChildOf(child, parent) {
        if (child.parentNode === parent) {
            return true;
        } else if (child.parentNode === null) {
            return false;
        } else {
            return DaHelpers.isChildOf(child.parentNode, parent);
        }
    }

    /**
     * создает новый объект события с поддержкой IE9
     * @param eventName { string }
     * @returns { event }
     */
    static newEvent(eventName) {
        let event;

        if(typeof(Event) === 'function') {
            event = new Event(eventName);
        } else{
            event = document.createEvent('Event');
            event.initEvent(eventName, true, true);
        }

        return event;
    }
}