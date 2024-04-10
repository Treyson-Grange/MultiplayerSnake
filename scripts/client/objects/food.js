// --------------------------------------------------------------
//
// Creates a Food object, with functions for managing state.
//
// spec = {
//    imageSrc: ,   // Web server location of the image
//    center: { x: , y: },
//    size: { width: , height: },
//    points: ,
// }
//
// --------------------------------------------------------------
MyGame.objects.Food = function(spec) {
    'use strict';

    let imageReady = false;
    let image = new Image();

    image.onload = function() {
        imageReady = true;
    };
    image.src = spec.imageSrc;

    let api = {
        get imageSrc() { return spec.imageSrc; },
        get center() { return spec.center; },
        get size() { return spec.size; },
        get points() { return spec.points; },
    };

    return api;
}
