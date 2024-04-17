// ------------------------------------------------------------------
//
// This is the graphics rendering code for the game.
//
// ------------------------------------------------------------------
MyGame.graphics = (function () {
  "use strict";

  let canvas = document.getElementById("canvas-main");
  let context = canvas.getContext("2d");

  //------------------------------------------------------------------
  //
  // Place a 'clear' function on the Canvas prototype, this makes it a part
  // of the canvas, rather than making a function that calls and does it.
  //
  //------------------------------------------------------------------
  CanvasRenderingContext2D.prototype.clear = function () {
    this.save();
    this.setTransform(1, 0, 0, 1, 0, 0);
    this.clearRect(0, 0, canvas.width, canvas.height);
    this.restore();
  };

  //------------------------------------------------------------------
  //
  // Public function that allows the client code to clear the canvas.
  //
  //------------------------------------------------------------------
  function clear() {
    context.clear();
  }

  //------------------------------------------------------------------
  //
  // Simple pass-through to save the canvas context.
  //
  //------------------------------------------------------------------
  function saveContext() {
    context.save();
  }

  //------------------------------------------------------------------
  //
  // Simple pass-through the restore the canvas context.
  //
  //------------------------------------------------------------------
  function restoreContext() {
    context.restore();
  }

  //------------------------------------------------------------------
  //
  // Rotate the canvas to prepare it for rendering of a rotated object.
  //
  //------------------------------------------------------------------
  function rotateCanvas(center, rotation) {
    context.translate(center.x * canvas.width, center.y * canvas.width);
    context.rotate(rotation);
    context.translate(-center.x * canvas.width, -center.y * canvas.width);
  }

  //------------------------------------------------------------------
  //
  // Draw an image into the local canvas coordinate system.
  //
  //------------------------------------------------------------------
  function drawImage(texture, center, size) {
    let localCenter = {
      x: center.x * canvas.width,
      y: center.y * canvas.width,
    };
    let localSize = {
      width: size.width * canvas.width,
      height: size.height * canvas.height,
    };

    context.drawImage(
      texture,
      localCenter.x - localSize.width / 2,
      localCenter.y - localSize.height / 2,
      localSize.width,
      localSize.height
    );
  }

  	//------------------------------------------------------------------
	//
	// Provides rendering support for a sprite animated from a sprite sheet.
	//
	//------------------------------------------------------------------
    function drawSprite(texture, position, size, spriteIndex) {
        // console.log(texture, position, size, spriteIndex);
        let localCenter = {
            x: position.x * canvas.width,
            y: position.y * canvas.width,
            };
        let localSize = {
            width: size.width * canvas.width,
            height: size.height * canvas.height,
            };
    
        // console.log(localCenter, localSize);
        // context.save();

        //
        // Pick the selected sprite from the sprite sheet to render
        context.drawImage(
            texture,
            localSize.width * spriteIndex, 0,	// Which sprite to pick out
            localSize.width, localSize.height,		// The size of the sprite
            localCenter.x - localSize.width/2,	// Where to draw the sprite
            localCenter.y - localSize.height/2,
            localSize.width, localSize.height);
          
        // context.restore();
    }
			//
			// Once the image is loaded, we can compute the height and width based upon
			// what we know of the image and the number of sprites in the sheet.
            // DO THIS IN GAME.JS OR SOMETHING !!!???
		// 	spec.height = image.height;
		// 	spec.width = image.width / spec.spriteCount;
		// };
		// image.src = spec.spriteSheet;

    function drawText(spec) {
        console.log(spec);

        // let width = canvas.width / 2;
        // let height = canvas.height / 2;

        context.save();

        context.font = spec.font;
        context.fillStyle = spec.fillStyle;
        context.strokeStyle = spec.strokeStyle;
        context.textBaseline = 'top';

        // context.translate(spec.position.x, spec.position.y);
        // context.rotate(spec.rotation);
        // context.translate(-spec.position.x, -spec.position.y);


        context.fillText(spec.text, spec.position.x, spec.position.y);
        context.strokeText(spec.text, spec.position.x, spec.position.y);

        context.restore();
    }
    

  return {
    clear: clear,
    saveContext: saveContext,
    restoreContext: restoreContext,
    rotateCanvas: rotateCanvas,
    drawImage: drawImage,
    drawSprite: drawSprite,
    drawText: drawText,
  };
})();
