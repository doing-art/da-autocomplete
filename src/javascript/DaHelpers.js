export default class DaHelpers {
    static isChildOf(child, parent) {
        if (child.parentNode === parent) {
            return true;
        } else if (child.parentNode === null) {
            return false;
        } else {
            return DaHelpers.isChildOf(child.parentNode, parent);
        }
    }

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