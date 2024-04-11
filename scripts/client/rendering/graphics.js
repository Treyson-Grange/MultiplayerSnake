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
	function SpriteSheet(spec) {
		var that = {},
			image = new Image();

		//
		// Initialize the animation of the spritesheet
		spec.sprite = 0;		// Which sprite to start with
		spec.elapsedTime = 0;	// How much time has occured in the animation

		//
		// Load the image, set the ready flag once it is loaded so that
		// rendering can begin.
		image.onload = function() { 
			//
			// Our clever trick, replace the draw function once the image is loaded...no if statements!
			that.drawSprite = function() {
				context.save();

				// context.translate(spec.center.x, spec.center.y);
				// context.rotate(spec.rotation);
				// context.translate(-spec.center.x, -spec.center.y);

				//
				// Pick the selected sprite from the sprite sheet to render
				context.drawImage(
					image,
					spec.width * spec.sprite, 0,	// Which sprite to pick out
					spec.width, spec.height,		// The size of the sprite
					spec.center.x - spec.width/2,	// Where to draw the sprite
					spec.center.y - spec.height/2,
					spec.width, spec.height);

				context.restore();
			};
			//
			// Once the image is loaded, we can compute the height and width based upon
			// what we know of the image and the number of sprites in the sheet.
			spec.height = image.height;
			spec.width = image.width / spec.spriteCount;
		};
		image.src = spec.spriteSheet;

		//------------------------------------------------------------------
		//
		// Update the animation of the sprite based upon elapsed time.
		//
		//------------------------------------------------------------------
		that.update = function(elapsedTime, forward) {
			spec.elapsedTime += elapsedTime;
			//
			// Check to see if we should update the animation frame
			if (spec.elapsedTime >= spec.spriteTime[spec.sprite]) {
				//
				// When switching sprites, keep the leftover time because
				// it needs to be accounted for the next sprite animation frame.
				spec.elapsedTime -= spec.spriteTime[spec.sprite];
                spec.sprite -= 1;
                //
                // This provides wrap around from the first to the last sprite
                if (spec.sprite < 0) {
                    spec.sprite = spec.spriteCount - 1;
                }
			}
		};

        //------------------------------------------------------------------
		//
		// Render the correct sprint from the sprite sheet
		//
		//------------------------------------------------------------------
        that.drawSprite = function() {
            //
            // Starts out empty, but gets replaced once the image is loaded!
        };

        return that;
    }



  return {
    clear: clear,
    saveContext: saveContext,
    restoreContext: restoreContext,
    rotateCanvas: rotateCanvas,
    drawImage: drawImage,
    SpriteSheet : SpriteSheet
  };
})();
