/**
 * @classDescription Draws underlayer with nested params by canvas tag
 * @author Maksim Horbachevsky, fantactuka[at]yahoo.com, http://fantactuka.net/canvasul/
 * @param <Object>options
 * 		@param <Object>style
 * 			@param <String>add - class name for canvas tag
 * 			@param <Integer>left - left position in pixels
 * 			@param <Integer>top - top position in pixels
 * 			@param <Integer>width - width in pixels
 * 			@param <Integer>height - height in pixels
 *		@param <Object>glow(stroke, fill)
 *			@param <Integer>size - size in pixels
 *			@param <HEX-String>(<RGB(RGBA)-IntegerArray>)startColor(endColor) - gradient colors. Set equal to simple fill.
 *			@param <String>gmode - set direction for gradient ('vertical')
 * 		@param <Integer, IntegerArray>corners - size of corners radiuses
 * 		
 * 		todo:
 * 			implement shadow support
 * 			implement angle support for shadow, gradients instead of 'gmode'
 * 			implement inner glow, inner shadow
 *			fix mess with corners
 */

var Underlayer = new Class({
	
	version: '0.8',
	
	options: {

		style: {
			add: 'underlayer',
			width: 200,
			height: 30
		},

		glow: {
			size: 0,
			startColor: '#666',
			endColor: '#666',
			gmode: 'vertical'
		},
		
		shadow: {
			size: 0,
			startColor: '#900',
			endColor: '#666',
			gmode: 'vertical'
		},
		
		stroke: {
			size: 0,
			startColor: '#fff',
			endColor: '#fff',
			gmode: 'vertical'
		},
		
		fill: {
			startColor: '#ddd',
			endColor: '#fff',
			gmode: 'vertical'
		},
		
		corners: 10
		
	},	
		
	Implements: [Events, Options],
		
	initialize: function(options) {
		this.setOptions(options);
		
		/*
		this.canvas = new Element('canvas', {
			'class': this.options.style.add,
			'height': this.options.style.height,
			'width': this.options.style.width
		});
		
		if (Browser.Engine.trident) {
			var tmp = new Element('div').adopt(this.canvas.addClass('canvasULTmpElement'));
			G_vmlCanvasManager.initElement(this.canvas);
			this.canvas = tmp.getElement('.canvasULTmpElement');
			this.canvas.removeClass('canvasULTmpElement');
			tmp.destroy();
		}
		*/
		
		this.canvas = new Canvas({
			'class': this.options.style.add,
			'height': this.options.style.height,
			'width': this.options.style.width
		});
		
		if(this.options.style.top) this.canvas.setStyle('top', this.options.style.top);
		if(this.options.style.left) this.canvas.setStyle('left', this.options.style.left);
		if(this.options.style.zindex) this.canvas.setStyle('z-index', this.options.style.zindex);

		/* Glow drawing. */
		for(var i = 0; i < this.options.glow.size; i ++) {
			var startColor = $type(this.options.glow.startColor) == 'string' ? this.options.glow.startColor.hexToRgb(true) : this.options.glow.startColor;
			var endColor = $type(this.options.glow.endColor) == 'string' ? this.options.glow.endColor.hexToRgb(true) : this.options.glow.endColor;
			startColor[3] = 0.5 / this.options.glow.size * (i + 1);
			endColor[3] = 0.5 / this.options.glow.size * (i + 1);
			this.drawRectangle({
				x: i,
				y: i,
				width: this.options.style.width - i * 2,
				height: this.options.style.height - i * 2,
				startColor: startColor,
				endColor: endColor,
				gmode: this.options.glow.gmode,
				corners: $type(this.options.corners) == 'number' ? 
					(this.options.corners + this.options.stroke.size) : 
					this.options.corners.map(function(item) {
						return item + this.options.stroke.size
					}.bind(this))				
			});
		}
		
		/* Shadow drawing. */
		for(var i = 0; i < this.options.shadow.size; i ++) {
			var startColor = $type(this.options.shadow.startColor) == 'string' ? this.options.shadow.startColor.hexToRgb(true) : this.options.shadow.startColor;
			var endColor = $type(this.options.shadow.endColor) == 'string' ? this.options.shadow.endColor.hexToRgb(true) : this.options.shadow.endColor;
			startColor[3] = 0.5 / this.options.shadow.size * (this.options.shadow.size - i);
			endColor[3] = 0.5 / this.options.shadow.size * (this.options.shadow.size - i);
			this.drawRectangle({
				x: i + 1,
				y: i + 1,
				width: this.options.style.width - this.options.shadow.size,
				height: this.options.style.height - this.options.shadow.size,
				startColor: startColor,
				endColor: endColor,
				gmode: this.options.shadow.gmode,
				corners: $type(this.options.corners) == 'number' ? 
					(this.options.corners + this.options.stroke.size) : 
					this.options.corners.map(function(item) {
						return item + this.options.stroke.size
					}.bind(this))				
			});
		}		

		/* Stroke drawing. */
		if(this.options.stroke.size > 0) {
			this.drawRectangle({ 
				x: this.options.glow.size,
				y: this.options.glow.size,
				width: this.options.style.width - Math.max(this.options.glow.size * 2, this.options.shadow.size),
				height: this.options.style.height - Math.max(this.options.glow.size * 2, this.options.shadow.size),
				startColor: this.options.stroke.startColor,
				endColor: this.options.stroke.endColor,
				gmode: this.options.stroke.gmode,
				corners: $type(this.options.corners) == 'number' ? 
					(this.options.corners + this.options.stroke.size) : 
					this.options.corners.map(function(item) {
						return item + this.options.stroke.size
					}.bind(this))
			});
		}
		
		/* Fill draw */
		this.drawRectangle({ 
			x: this.options.stroke.size + this.options.glow.size,
			y: this.options.stroke.size + this.options.glow.size,
			width: this.options.style.width - this.options.stroke.size * 2 - Math.max(this.options.glow.size * 2, this.options.shadow.size) ,
			height: this.options.style.height - this.options.stroke.size * 2 - Math.max(this.options.glow.size * 2, this.options.shadow.size),
			startColor: this.options.fill.startColor,
			endColor: this.options.fill.endColor,
			gmode: this.options.fill.gmode
		});
		
		return this.canvas;
	},	
		
	drawRectangle: function(params) {
		
		var defaults = {
			x: 0,
			y: 0,
			width: this.options.style.width,
			height: this.options.style.height,
			corners: this.options.corners,
			startColor: this.options.fill.startColor,
			endColor: this.options.fill.endColor,
			gmode: 'vertical'
		};
		
		var o = $merge(defaults, params);
		var c = this.canvas.getContext('2d');
		
		if($type(o.corners) == 'number') { o.corners = [o.corners, o.corners, o.corners, o.corners] }
		if($type(o.startColor) == 'string') { o.startColor = o.startColor.hexToRgb(true); }
		if($type(o.endColor) == 'string') { o.endColor = o.endColor.hexToRgb(true); }
		if(o.startColor != o.endColor) {
			var fill = (o.gmode == 'vertical') ? c.createLinearGradient(0, 0, 0, o.height) : c.createLinearGradient(0, 0, o.width, 0);
			fill.addColorStop(0, this.rgb(o.startColor));
			fill.addColorStop(1, this.rgb(o.endColor));
		} else {
			var fill = this.rgb(o.startColor);
		}
		
		c.beginPath();
		c.fillStyle = fill;
		c.moveTo(o.x + o.corners[0], o.y);
		c.lineTo(o.x + o.width - o.corners[1], o.y);
		c.quadraticCurveTo(o.x + o.width, o.y, o.x + o.width, o.y + o.corners[1]);
		c.lineTo(o.x + o.width, o.y + o.height - o.corners[2]);
		c.quadraticCurveTo(o.x + o.width, o.y + o.height, o.x + o.width - o.corners[2], o.y + o.height);
		c.lineTo(o.x + o.corners[3], o.y + o.height);
		c.quadraticCurveTo(o.x, o.y + o.height, o.x, o.y + o.height - o.corners[3]);
		c.lineTo(o.x, o.y + o.corners[0]);
		c.quadraticCurveTo(o.x, o.y, o.x + o.corners[0], o.y);
		c.fill();

	},	

	rgb: function(a) {
		return 'rgb' + ((a.length > 3) ? 'a(' : '(') + a.join(', ') + ')';
	}	
		
});

Element.implement({
	underlayer: function() {
		var params = Array.link(arguments, {'options': Object.type});
		var element = this;
		element.store('options', params.options);
		if(!['relative', 'absolute', 'fixed'].contains(element.getStyle('position'))) element.setStyle('position', 'relative');
		if(element.getStyle('background-color')) element.setStyle('background-color', 'transparent');
		if(!$defined(params.options)) params.options = {};
		if(!$defined(params.options.style)) params.options.style = {};
		if(!$defined(params.options.style.width)) params.options.style.width = element.getWidth();
		if(!$defined(params.options.style.height)) params.options.style.height = element.getHeight();
		var canvas = new Underlayer(params.options);
		canvas.inject(element, 'bottom');
		return this;
	},
	
	underlayerResize: function(options) {
		var element = this;
		if(!options) var options = {};
		if(element.getElement('.underlayer')) {
			element.getElement('.underlayer').set('height', options.width || element.getWidth());
			element.getElement('.underlayer').set('height', options.height || element.getHeight());
		}
	}
	
});