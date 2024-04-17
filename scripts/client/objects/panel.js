// --------------------------------------------------------------
//
// Creates a Text object, with functions for managing state.
//
// spec = {
//    center: ,
//    size: ,
// }
//
// --------------------------------------------------------------
MyGame.objects.Panel = function(spec) {
    'use strict';

    let api = {
        updateText: updateText,
        get rotation() { return rotation; },
        get position() { return spec.position; },
        get text() { return spec.text; },
        get font() { return spec.font; },
        get fillStyle() { return spec.fillStyle; },
        get strokeStyle() { return spec.strokeStyle; }
    };

    return api;
}
