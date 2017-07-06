/*
    Apply a css transform rule to the target element
    ---

    element        obj       Element object
    transform      str       Transform string to apply

*/

export default function(element, transform) {

    // If a jQuery/Zepto object use the first element in the list
    if ( !element.nodeType ) { element = element[0]; }

    element.style.mozTransform = transform;
    element.style.webkitTransform = transform;
    element.style.transform = transform;
}
