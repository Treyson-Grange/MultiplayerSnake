// --------------------------------------------------------------
//
// Creates a Button object, with functions for managing state.
//
// spec = {
//    texture: ,
//    size: { width: , height: },
//    center: { x: , y: }
// }
//
// --------------------------------------------------------------
MyGame.objects.Button = function(spec) {
    'use strict';

    let active = false;

    let imageReady = false;
    let image = new Image();

    image.onload = function() {
        imageReady = true;
    };
    image.src = spec.imageSrc;
    
    // Check if click is inside the rectangle
    // function isInsideRectangle(mouseX, mouseY, rectX, rectY, rectWidth, rectHeight) {
    //     return mouseX >= rectX && mouseX <= rectX + rectWidth && mouseY >= rectY && mouseY <= rectY + rectHeight;
    // }

    // Handle click event
    // canvas.addEventListener("click", function(event) {
    //     var mouseX = event.clientX - canvas.getBoundingClientRect().left;
    //     var mouseY = event.clientY - canvas.getBoundingClientRect().top;

        // Check if the click is inside the rectangle
    //     if (isInsideRectangle(mouseX, mouseY, 50, 50, 100, 100)) {
    //         console.log("yay!");
    //     }
    // });

    function updateButton() {
    }

    let api = {
        updateButton: updateButton,
        get size() { return spec.size; },
        get center() { return spec.center; },
        get imageReady() { return imageReady; },
        get image() { return image; },
    };

    return api;
}
