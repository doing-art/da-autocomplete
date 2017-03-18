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
}