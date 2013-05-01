/*
 * Name: Channel Strip
 * Description: Web Audio API Channel Strip. Audio Source via User Media.
 * Author: Obadiah Metivier
 * Author URI: http://middleearmedia.com/
 * Version: 1.0
 */

// This makes the knobs work (along with jquery.knob.js)
(function( $ ) {
	var methods = {
		init: function() {
		}, 
	};	
	$.fn.knob = function( method ) {
		if ( methods[method] ) {
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist' );
		}    			
	};	
})( jQuery );
			
var context = new window.webkitAudioContext(); // Create audio container
var source = null; // Create empty audio source
var audioBuffer = null; // Create empty audio buffer

function stopSound() {
  if (source) {
    source.noteOff(0); // Stop immediately
  }
}

function playSound() {
  source = context.createBufferSource(); // Create a sound source
  source.buffer = audioBuffer; // Add the buffered data to our object
  source.loop = true; // Make it loop
  source.connect(gain1Node);
  source.noteOn(0); // Play immediately
}

function initSound(arrayBuffer) {
  context.decodeAudioData(arrayBuffer, function(buffer) {
    audioBuffer = buffer;
    var buttons = document.querySelectorAll('button');
    buttons[0].disabled = false;
    buttons[1].disabled = false;
  }, function(e) {
    console.log('Error decoding file', e);
  }); 
}

// Read user selected file as ArrayBuffer and pass it to the API
var fileInput = document.querySelector('input[type="file"]');
fileInput.addEventListener('change', function(e) {  
  var reader = new FileReader();
  reader.onload = function(e) {
    initSound(this.result);
  };
  reader.readAsArrayBuffer(this.files[0]);
}, false);

// Load file from a URL as ArrayBuffer. Need to add input for this option!
// Example: loadSoundFile('assets/sounds/demo.wav');
function loadSoundFile(url) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'arraybuffer';
  xhr.onload = function(e) {
    initSound(this.response); // this.response is ArrayBuffer
  };
  xhr.send();
}

// Create Audio Nodes
var gain1Node = context.createGainNode(); // Create source gain node
var eq1Node = context.createGainNode(); // Create eq routing gain node
var pan1Node = context.createPanner(); // Create panner node
var volume1Node = context.createGainNode(); // Create channel volume gain node
var mute1Node = context.createGainNode(); // Create mute routing gain node

var makeHigh1Node = function () {
	var high1 = context.createBiquadFilter();
 
	high1.type = "highshelf"; // Highshelf filter
	high1.frequency.value = 6000;
	high1.gain.value = $('#high-1').val();

	return high1;
}

var makeMid1Node = function () {
	var mid1 = context.createBiquadFilter();
 
	mid1.type = "peaking"; // Peaking filter
	mid1.frequency.value = 1000;
	mid1.Q.value = 1;
	mid1.gain.value = $('#mid-1').val();

	return mid1;
}

var makeLow1Node = function () {
	var low1 = context.createBiquadFilter();
 
	low1.type = "lowshelf"; // Lowshelf filter
	low1.frequency.value = 440;
	low1.gain.value = $('#low-1').val();

	return low1;
}

// High EQ
high1Node = makeHigh1Node(),

// Mid EQ
mid1Node = makeMid1Node(),

// Low EQ
low1Node = makeLow1Node(),

// Volume
volume1Node.gain.value = 0.5; // Initial volume is 50%

$(function () {
	document.getElementById('volume-1').addEventListener('change', function() {
		volume1Node.gain.value = this.value;
	});
})

// Mute
mute1Node.gain.value = 0; // Volume is 0%

// Compressor (post EQ)
compressor1Post = context.createDynamicsCompressor(); // Create Compressor Node

// Listen for Knob changes
$(function () {
	$('#gain-1').dial({'change': function (v) {
		gain1Node.gain.value = v / 10;
	}});

	$('#high-1').dial({'change': function (v) {
		high1Node.gain.value = v;
	}});

	$('#mid-1').dial({'change': function (v) {
		mid1Node.gain.value = v;
	}});

    $('#low-1').dial({'change': function (v) {
		low1Node.gain.value = v;
    }});
	
    $('#pan-1').dial({'change': function (x) {
		var xDeg = x;
		var zDeg = xDeg + 90;
		if (zDeg > 90) {
			zDeg = 180 - zDeg;
		}
		var x = Math.sin(xDeg * (Math.PI / 180));
		var z = Math.sin(zDeg * (Math.PI / 180));
		pan1Node.setPosition(x, 0, z);
    }});
		
})

// Wiring
gain1Node.connect(pan1Node);
pan1Node.connect(volume1Node);
volume1Node.connect(context.destination);	

// EQ wiring
$('#eq-1').change(function () {
	if ($(this).attr('checked') === 'checked') {
		gain1Node.disconnect(0);
		gain1Node.connect(high1Node);
		high1Node.connect(mid1Node);
		mid1Node.connect(low1Node);
		low1Node.connect(pan1Node);		
	} else {
		gain1Node.disconnect(0);
		high1Node.disconnect(0);
		mid1Node.disconnect(0);
		low1Node.disconnect(0);		
		gain1Node.connect(pan1Node);
	}
})

// Compressor Post wiring
$('#compost-1').change(function () {
	if ($('#mute-1').attr('checked') === 'checked') {
		volume1Node.disconnect(0);
		compressor1Post.disconnect(0);
		volume1Node.connect(compressor1Post);
		compressor1Post.connect(mute1Node);
		mute1Node.connect(context.destination);
	} else if ($(this).attr('checked') === 'checked') {
		volume1Node.disconnect(0);
		volume1Node.connect(compressor1Post);	
		compressor1Post.connect(context.destination);		
	} else {
		volume1Node.disconnect(0);
		compressor1Post.disconnect(0);
		volume1Node.connect(context.destination);
	}
})

// Mute wiring
$('#mute-1').change(function () {
	if ($(this).attr('checked') === 'checked') {
		volume1Node.disconnect(0);
		compressor1Post.disconnect(0);
		volume1Node.connect(compressor1Post);
		compressor1Post.connect(mute1Node);
		mute1Node.connect(context.destination);
	} else if ($('#compost-1').attr('checked') === 'checked') {
		volume1Node.disconnect(0);
		compressor1Post.disconnect(0);
		volume1Node.connect(compressor1Post);
		compressor1Post.connect(context.destination);
	} else {
		volume1Node.connect(context.destination);
	}
})

// Solo wiring for multi-channel mixer
// assuming that:	compressor1Post.connect(masterGainNode);
// assuming that:	masterGainNode.connect(context.destination);
$('#solo-1').change(function () {
	if ($(this).attr('checked') === 'checked') {
		compressor1Post.connect(masterGainNode);
		compressor2Post.disconnect(0);
		compressor2Post.connect(mute2Node);
		mute2Node.connect(masterGainNode);
	} else {
		compressor1Post.connect(masterGainNode);
	}
})