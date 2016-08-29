﻿/*
jQuery implementation & improvements by Filip Stanek (http://www.bloodforge.com)
Based off code written by Johny Cornwell (http://www.blog.jonnycornwell.com/)
This is liensed under the Creative Commons License (http://creativecommons.org/licenses/by/3.0/)
*/

// A function to create a particle object.
function Particle(context, canvasWidth, canvasHeight, particleWidth, particleHeight) {

    this._image = null;

    // Set the initial x and y positions
    this._x = 0;
    this._y = 0;

    // Set the initial velocity
    this._xVelocity = 0;
    this._yVelocity = 0;

    // Set the radius
    this._radius = 5;

    // Store the context which will be used to draw the particle
    this._context = context;

    // Set the dimensions of the canvas as variables so they can be used.
    this._canvasWidth = canvasWidth;
    this._canvasHeight = canvasHeight;

    // Set the dimensions of the particle
    this._particleWidth = particleWidth;
    this._particleHeight = particleHeight;
}

// The function to draw the particle on the canvas.
Particle.prototype.Draw = function () {
    this._context.drawImage(this._image, this._x - (this._particleWidth / 2), this._y - (this._particleHeight / 2));
};

// Update the particle.
Particle.prototype.Update = function () {
    // Update the position of the particle with the addition of the velocity.
    this._x += this._xVelocity;
    this._y += this._yVelocity;

    // Check if has crossed the right edge
    if (this._x >= this._canvasWidth) {
        this._xVelocity = -this._xVelocity;
        this._x = this._canvasWidth;
    }
        // Check if has crossed the left edge
    else if (this._x <= 0) {
        this._xVelocity = -this._xVelocity;
        this._x = 0;
    }

    // Check if has crossed the bottom edge
    if (this._y >= this._canvasHeight) {
        this._yVelocity = -this._yVelocity;
        this._y = this._canvasHeight;
    }

        // Check if has crossed the top edge
    else if (this._y <= 0) {
        this._yVelocity = -this._yVelocity;
        this._y = 0;
    }
};

// A function to set the position of the particle.
Particle.prototype.SetPosition = function (x, y) {
    this._x = x;
    this._y = y;
};

// Function to set the velocity.
Particle.prototype.SetVelocity = function (x, y) {
    this._xVelocity = x;
    this._yVelocity = y;
};

Particle.prototype.SetImage = function (image) {
    this._image = image;
};

(function ($) {

    var PLUGIN_NAME = 'SmokeEffect';

    var methods = {

        init: function (options) {

            return this.each(function () {

                var $container = $(this);

                var settings = $.extend({
                    backgroundColor: $container.css('backgroundColor') ? $container.css('backgroundColor') : "rgba(0, 0, 0, 0.5)",
                    density: 8,
                    maximumVelocity: 1,
                    fps: 15,
                    forceBackgroundRender: false,
                    image: "data:image/png;base64,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",
                    imageWidth: 128,
                    imageHeight: 128
                }, options);

                var bInitialized = $container.data(PLUGIN_NAME);
                if (!bInitialized) {

                    var canvas;
                    var width = $container.outerWidth();
                    var height = $container.outerHeight();

                    if ($container.prop('tagName') == 'CANVAS') {
                        canvas = $container[0];
                    }
                    else {
                        canvas = document.createElement('CANVAS');
                        canvas.width = width;
                        canvas.height = height;
                        canvas.style.position = 'absolute';
                    }

                    if (canvas && canvas.getContext) {

                        function generateRandom(min, max) {
                            return Math.random() * (max - min) + min;
                        }

                        //$container.prepend($(canvas));
                        var context;
                        if ($container.prop('tagName') == 'CANVAS') {
                            context = canvas.getContext('2d');
                        }
                        else if (document.getCSSCanvasContext) {
                            settings.canvasID = 'smokeEffect' + Math.floor(generateRandom(1, 99999));
                            $container.css('background', '-webkit-canvas(' + settings.canvasID + ')');
                            context = document.getCSSCanvasContext('2d', settings.canvasID, width, height);
                            $(window).resize(function () {
                                $container.SmokeEffect('resize');
                            });
                        }
                        else if (settings.forceBackgroundRender) {
                            context = canvas.getContext('2d');
                        }
                        else {
                            $.error('Abandoning SmokeEffect since the browser doesn\'t support canvas backgrounds and the "forceBackgroundRender" flag was not set! Alternately, you can also call SmokeEffect directly on a canvas to force it to draw');
                            return;
                        }

                        var imageObject = new Image(256, 256);
                        imageObject.src = settings.image;

                        var particles = [];

                        // Create the particles and set their initial positions and velocities
                        var totalPixels = width * height;
                        var imgpixels = settings.imageWidth * settings.imageHeight;
                        var areaRatio = imgpixels / totalPixels;
                        var particleCount = Math.ceil(settings.density / areaRatio);

                        for (var i = 0; i < particleCount; ++i) {
                            var particle = new Particle(context, width, height, settings.imageWidth, settings.imageHeight);

                            // Set the position to be inside the canvas bounds
                            particle.SetPosition(generateRandom(0, width), generateRandom(0, height));

                            // Set the initial velocity to be either random and either negative or positive
                            particle.SetVelocity(generateRandom(-settings.maximumVelocity, settings.maximumVelocity), generateRandom(-settings.maximumVelocity, settings.maximumVelocity));

                            // set the image
                            particle.SetImage(imageObject);

                            particles.push(particle);
                        }

                        settings.context = context;
                        settings.image = imageObject;
                        settings.particles = particles;

                        $container.data(PLUGIN_NAME, settings);

                        setInterval(function () {

                            $container.SmokeEffect('update');
                            $container.SmokeEffect('draw');

                        }, 1000 / settings.fps);
                    }
                    else {
                        $.error('Cannot create SmokeEffect because the browser lacks support');
                    }
                }

            });
        },

        update: function () {
            // Update the scene

            var settings = $(this).data(PLUGIN_NAME);

            if (settings) {
                settings.particles.forEach(function (particle) {
                    particle.Update();
                });
            }
        },

        draw: function () {
            // The function to draw the scene

            var settings = $(this).data(PLUGIN_NAME);

            if (settings) {
                // Clear the drawing surface and fill it with a black background
                //this._context.fillStyle = "rgba(0, 0, 0, 0.5)";
                settings.context.fillStyle = settings.backgroundColor;
                settings.context.fillRect(0, 0, $(this).outerWidth(), $(this).outerHeight());

                // Go through all of the particles and draw them.
                settings.particles.forEach(function (particle) {
                    particle.Draw();
                });

                if (!document.getCSSCanvasContext && settings.forceBackgroundRender) {
                    $(this).css('backgroundImage', 'url(' + settings.context.canvas.toDataURL() + ')');
                }
            }
        },

        resize: function () {
            var $container = $(this);
            var settings = $container.data(PLUGIN_NAME);
            var newWidth = $container.outerWidth();
            var newHeight = $container.outerHeight();
            settings.context.clearRect(0, 0, newWidth, newHeight);
            settings.context = document.getCSSCanvasContext('2d', settings.canvasID, newWidth, newHeight);
            $container.data(PLUGIN_NAME, settings);
        },

        option: function (sName, vValue) {
            var $container = $(this);
            var settings = $container.data(PLUGIN_NAME);
            if (typeof (sName) == "string") {
                if (vValue == undefined) return settings[sName];	// getter of option

                settings[sName] = vValue;	// setter of option
            }
            else {
                settings = $.extend(settings, sName);
            }
            $container.data(PLUGIN_NAME, settings);
        }

    };

    $.fn.SmokeEffect = function (method) {
        // Method calling logic
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        }
        else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        }
        else {
            $.error("Method '" + method + "' does not exist on plugin '" + PLUGIN_NAME + "'");
        }
    };
}(jQuery));