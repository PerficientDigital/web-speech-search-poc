(function($) {
	// variables 
	var ignoreOnend = false;
	var messages = {
		'start' : 'Click on the microphone icon and begin speaking.',
		'speak_now' : 'Speak now.',
		'no_speech' : 'No speech was detected. You may need to adjust your microphone settings',
		'no_microphone' : 'No microphone was found. Ensure that a microphone is installed and that microphone settings are configured correctly.',
		'denied' : 'Permission to use microphone was denied or is blocked.',
		'upgrade' : 'Web Speech API is not supported by this browser. Chrome version 25 or later.'
	}
	var recognition = null;
	var recognizing = false;
	var $startico = $('.webspeech__start img');

	// shared functions
	var displayMessage = function(key) {
		if(key === ''){
			$('.webspeech__message').html('');
		} else {
			$('.webspeech__message').html(messages[key]);
		}
	}
	var finishRecongition = function(terms) {
		var url = $('.webspeech').data('url').replace("{TERM}", encodeURIComponent(terms));
		$('.webspeech__search-results').load(url);
	}

	// initialize
	if (!('webkitSpeechRecognition' in window)) {
		$('.webspeech__start').hide();
		displayMessage('upgrade');
	} else {
		recognition = new webkitSpeechRecognition();
		recognition.continuous = true;
		recognition.interimResults = true;
		recognition.lang = navigator.language;
		recognition.onstart = function() {
			recognizing = true;
			displayMessage('speak_now');
			$startico.attr('src', '/etc/clientlibs/webspeechsearch/icons/mic-animate.gif');
		};
		recognition.onerror = function(event) {
			if (event.error == 'no-speech') {
				$startico.attr('src', '/etc/clientlibs/webspeechsearch/icons/mic.gif');
				displayMessage('no_speech');
				ignoreOnend = true;
			}
			if (event.error == 'audio-capture') {
				start_img.src = 'mic.gif';
				displayMessage('no_microphone');
				ignoreOnend = true;
			}
			if (event.error == 'not-allowed') {
				displayMessage('denied');
				ignoreOnend = true;
			}
		};
		recognition.onend = function() {
			recognizing = false;
			if (ignore_onend) {
				return;
			}
			$startico.attr('src', '/etc/clientlibs/webspeechsearch/icons/mic.gif');
			
			var final = $('.webspeech__final').html();
			if (final === '') {
				displayMessage('start');
				return;
			}
			displayMessage('');
			finishRecongition($('.webspeech__final').html());
		};
		
		recognition.onresult = function(event) {
			var text = '';
			var final = false;
			for (var i = event.resultIndex; i < event.results.length; ++i) {
				if (event.results[i].isFinal) {
					final = true;
				}
				text += event.results[i][0].transcript;
			}
			if(final){
				$('.webspeech__interim').html('');
				$('.webspeech__final').html(text);
				recognition.stop();
			} else {
				$('.webspeech__final').html('');
				$('.webspeech__interim').html(text);
				
			}
		};
	}
	
	// start listening
	$('.webspeech__start').click(function(){
		if (recognizing) {
			recognition.stop();
			return;
		}
		recognition.start();
		ignore_onend = false;
		$('.webspeech__final, .webspeech__interim').html('');
		$startico.attr('src', '/etc/clientlibs/webspeechsearch/icons/mic-slash.gif');
		displayMessage('allow');
	});
})(jQuery);