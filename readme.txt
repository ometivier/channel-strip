=== Channel Strip - A Web Audio experiment by Middle Ear Media. ===

Author: Obadiah Metivier
Author URI: http://middleearmedia.com/
Tags: web audio api, channel strip, mixer, html5, css3, javascript, jquery, middle ear media, obadiah metivier
Stable tag: 1.1

This web app is a stand alone audio channel strip that allows an audio signal to be boosted, attenuated, equalized, panned, compressed and muted in the browser. The audio source is derived from user media via file select input. Simply choose an audio file (mp3 or wav, etc.) from your hard drive and click Play to get the party started.

== Description ==

This web app is a stand alone audio channel strip that allows an audio signal to be boosted, attenuated, equalized, panned, compressed and muted in the browser. The audio source is derived from user media via file select input. Simply choose an audio file (mp3 or wav, etc.) from your hard drive and click Play to get the party started. It uses the Web Audio API, jQuery, and jQuery Knob.

== Changelog ==

= 1.0 =
* Start coding. Style vertical slider and knob controls for interface. Style strip. 04/25/2013.

* Add and style file select input for audio source. Add and style checkboxes for EQ, Compression, and Mute. Tweek performance of knob, slider, and checkbox controls. Add strip sections. Add description below. 04/30/2013.

* Finish coding. Clean up all files. Update readme.txt. 05/01/2013.

= 1.1 =
* Update code to match new spec. Remove webkit prefix. Replace noteOn() and noteOff() methods with start() and stop() methods. Replace createGainNode with createGain. 12/20/2014.