window.kontext = function( container ) {

	// Dispatched when the current layer changes
	var changed = new kontext.Signal();
	// All layers in this instance of kontext
	var layers = Array.prototype.slice.call( container.querySelectorAll( '.layer' ) );
	// Flag if the browser is capable of handling our fancy transition
	var capable =	'WebkitPerspective' in document.body.style || 'MozPerspective' in document.body.style || 'msPerspective' in document.body.style || 'OPerspective' in document.body.style || 'perspective' in document.body.style;
	if( capable ) {
		container.classList.add( 'capable' );
	}
	// Create dimmer elements to fade out preceding slides
	layers.forEach( function( el, i ) {
		if( !el.querySelector( '.dimmer' ) ) el.innerHTML += '<div class="dimmer"></div>';
	} );

	/* Transitions to and shows the target layer. @param target index of layer or layer DOM element */
	function show( target, direction ) {
		// Make sure our listing of available layers is up to date
		layers = Array.prototype.slice.call( container.querySelectorAll( '.layer' ) );
		// Flag to CSS that we're ready to animate transitions
		container.classList.add( 'animate' );
		// Flag which direction
		direction = direction || ( target > getIndex() ? 'right' : 'left' );
		// Accept multiple types of targets
		if( typeof target === 'string' ) target = parseInt( target );
		if( typeof target !== 'number' ) target = getIndex( target );
		// Enforce index bounds
		target = Math.max( Math.min( target, layers.length ), 0 );
		// Only navigate if were able to locate the target
		if( layers[ target ] && !layers[ target ].classList.contains( 'show' ) ) {
			layers.forEach( function( el, i ) {
				el.classList.remove( 'left', 'right' );
				el.classList.add( direction );
				if( el.classList.contains( 'show' ) ) {
					el.classList.remove( 'show' );
					el.classList.add( 'hide' );
				}
				else {
					el.classList.remove( 'hide' );
				}
			} );

			layers[ target ].classList.add( 'show' );
			changed.dispatch( layers[target], target );
		}
	}

	/* Shows the previous layer. */
	function prev() {
		var index = getIndex() - 1;
		show( index >= 0 ? index : layers.length + index, 'left' );
	}

	/* Shows the next layer. */
	function next() {
		show( ( getIndex() + 1 ) % layers.length, 'right' );
	}

	/* Retrieves the index of the current slide. @param of [optional] layer DOM element which index is to be returned */
	function getIndex( of ) {
		var index = 0;
		layers.forEach( function( layer, i ) {
			if( ( of && of == layer ) || ( !of && layer.classList.contains( 'show' ) ) ) {
				index = i;
				return;
			}
		} );
		return index;
	}

	/* Retrieves the total number of layers. */
	function getTotal() {
		return layers.length;
	}

	// API
	return {
		show: show,
		prev: prev,
		next: next,
		getIndex: getIndex,
		getTotal: getTotal,
		changed: changed
	};
};

/* Minimal utility for dispatching signals (events). */
kontext.Signal = function() {
	this.listeners = [];
}

kontext.Signal.prototype.add = function( callback ) {
	this.listeners.push( callback );
}

kontext.Signal.prototype.remove = function( callback ) {
	var i = this.listeners.indexOf( callback );
	if( i >= 0 ) this.listeners.splice( i, 1 );
}

kontext.Signal.prototype.dispatch = function() {
	var args = Array.prototype.slice.call( arguments );
	this.listeners.forEach( function( f, i ) {
		f.apply( null, args );
	} );
}

// Create a new instance of kontext
var k = kontext( document.querySelector( '.kontext' ) );
// Demo page JS
var bulletsContainer = document.body.querySelector( '.bullets' );
// // Create one bullet per layer
for( var i = 0, len = k.getTotal(); i < len; i++ ) {
	var bullet = document.createElement( 'li' );
	bullet.className = i === 0 ? 'active' : '';
	bullet.setAttribute( 'index', i );
	if (i == 0) {
		bullet.setAttribute( 'id', 'purple' );
	} else if ( i ==1) {
		bullet.setAttribute( 'id',  'orange');
	};
	bullet.onclick = function( event ) { k.show( event.target.getAttribute( 'index' ) ) };
	bullet.ontouchstart = function( event ) { k.show( event.target.getAttribute( 'index' ) ) };
	bulletsContainer.appendChild( bullet );
	if (i == 0) {
		document.getElementById('purple').innerHTML = 'Purple Suit';
	} else if (i == 1) {
		document.getElementById('orange').innerHTML = 'Orange Suit';
	};
}

// Update the bullets when the layer changes
k.changed.add( function( layer, index ) {
	var bullets = document.body.querySelectorAll( '.bullets li' );
	for( var i = 0, len = bullets.length; i < len; i++ ) {
		bullets[i].className = i === index ? 'active' : '';
	};
	for ( var i = 0, len = bullets.length; i < len; i++ ) {
		//SWITCHING FROM ORANGE TO PURPLE
		if (bullets[i].id === 'purple' && bullets[i].className === 'active') {
			// TEXT SWITCH
			var element = document.getElementById("showingtext");
			document.getElementById('showingtext').innerHTML = 'Purple Suit';
			element.classList.toggle("otext");
			  
			// ICON SWITCH
			var element = document.getElementById("select-box__icon");
			var string = element.className.baseVal;
			var array = string.split(" ");

			// REMOVING THE CLASS AND ADDING IT BACK ONTO THE SVG
			for ( var i = 0, len = array.length; i < len; i++ ) {
				if (array[i] === 'odots') {
					delete array[i];
					var final = array.toString();
					var test = final.split(',').join(' ');

					element.className.baseVal = test;
				};
			};
		//SWITCHING FROM PURPLE TO ORANGE	
		} else if (bullets[i].id === 'orange' && bullets[i].className === 'active'){
			// TEXT SWITCH
			var element = document.getElementById("showingtext");
			document.getElementById('showingtext').innerHTML = 'Orange Suit';
			element.classList.toggle("otext");
			  
			// ICON SWITCH
			var element = document.getElementById("select-box__icon");
			var string = element.className.baseVal;
			var array = string.split(" ");

			// REMOVING THE CLASS AND ADDING IT BACK ONTO THE SVG
			for ( var i = 0, len = array.length; i < len; i++ ) {
				if (array[i] === 'pdots') {
					delete array[i];
					var final = array.toString();
					var test = final.split(',').join(' ');

					element.className.baseVal = test;
				} else {
					array.push("odots");
					var final = array.toString();
					var test = final.split(',').join(' ');

					element.className.baseVal = test;
				};
			};
		};
	};
} );

document.addEventListener( 'keyup', function( event ) {
	if( event.keyCode === 37 ) k.prev();
	if( event.keyCode === 39 ) k.next();
}, false );

// Tilter one
(function() {
	// Init
	var container = document.getElementById("container"), inner = document.getElementById("inner");
	// Mouse
	var mouse = {
		_x: 0,
		_y: 0,
		x: 0,
		y: 0,
		updatePosition: function(event) {
		var e = event || window.event;
		this.x = e.clientX - this._x;
		this.y = (e.clientY - this._y) * -1;
		},
		setOrigin: function(e) {
		this._x = e.offsetLeft + Math.floor(e.offsetWidth / 2);
		this._y = e.offsetTop + Math.floor(e.offsetHeight / 2);
		},
		show: function() {
		return "(" + this.x + ", " + this.y + ")";
		}
	};
  
	// Track the mouse position relative to the center of the container.
	mouse.setOrigin(container);
  
	var counter = 0;
	var refreshRate = 10;
	var isTimeToUpdate = function() {
		return counter++ % refreshRate === 0;
	};
  
	var onMouseEnterHandler = function(event) {
		update(event);
	};
  
	var onMouseLeaveHandler = function() {
		inner.style = "";
	};
  
	var onMouseMoveHandler = function(event) {
		if (isTimeToUpdate()) {
			update(event);
		}
	};
  
	var update = function(event) {
		mouse.updatePosition(event);
		updateTransformStyle(
			(mouse.y / inner.offsetHeight / 2).toFixed(2),
			(mouse.x / inner.offsetWidth / 2).toFixed(2)
		);
	};
  
	var updateTransformStyle = function(x, y) {
		var style = "rotateX(" + x + "deg) rotateY(" + y + "deg)";
		inner.style.transform = style;
		inner.style.webkitTransform = style;
		inner.style.mozTranform = style;
		inner.style.msTransform = style;
		inner.style.oTransform = style;
	};
  
	container.onmousemove = onMouseMoveHandler;
	container.onmouseleave = onMouseLeaveHandler;
	container.onmouseenter = onMouseEnterHandler;
})();

// Tilter two
(function() {
	// Init
	var container = document.getElementById("container2"), inner = document.getElementById("inner2");

	// Mouse
	var mouse = {
		_x: 0,
		_y: 0,
		x: 0,
		y: 0,
		updatePosition: function(event) {
		var e = event || window.event;
		this.x = e.clientX - this._x;
		this.y = (e.clientY - this._y) * -1;
		},
		setOrigin: function(e) {
		this._x = e.offsetLeft + Math.floor(e.offsetWidth / 2);
		this._y = e.offsetTop + Math.floor(e.offsetHeight / 2);
		},
		show: function() {
		return "(" + this.x + ", " + this.y + ")";
	}
};

// Track the mouse position relative to the center of the container.
mouse.setOrigin(container);

var counter = 0;
var refreshRate = 10;
var isTimeToUpdate = function() {
	return counter++ % refreshRate === 0;
};

var onMouseEnterHandler = function(event) {
	update(event);
};

var onMouseLeaveHandler = function() {
	inner.style = "";
};

var onMouseMoveHandler = function(event) {
	if (isTimeToUpdate()) {
		update(event);
	}
};

var update = function(event) {
	mouse.updatePosition(event);
	updateTransformStyle(
		(mouse.y / inner.offsetHeight / 2).toFixed(2),
		(mouse.x / inner.offsetWidth / 2).toFixed(2)
	);
};

var updateTransformStyle = function(x, y) {
	var style = "rotateX(" + x + "deg) rotateY(" + y + "deg)";
	inner.style.transform = style;
	inner.style.webkitTransform = style;
	inner.style.mozTranform = style;
	inner.style.msTransform = style;
	inner.style.oTransform = style;
};

container.onmousemove = onMouseMoveHandler;
container.onmouseleave = onMouseLeaveHandler;
container.onmouseenter = onMouseEnterHandler;
})();