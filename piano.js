const keys = document.querySelectorAll(".key"),
			note = document.querySelector(".nowplaying"),
			hints = document.querySelectorAll(".hints"),
			audios = document.querySelectorAll("audio"),
			volumeControl = document.getElementById("volume");

let volume = 1;

if (volumeControl) {
	volume = parseFloat(volumeControl.value);
	// set initial volume on all audio elements
	audios.forEach(a => a.volume = volume);
	volumeControl.addEventListener('input', (e) => {
		volume = parseFloat(e.target.value);
		audios.forEach(a => a.volume = volume);
	});
}

// pitch (transpose) in semitones; +/-12 = octave up/down
let transposeSemitones = 0;
const pitchUpBtn = document.getElementById('pitch-up'),
			pitchDownBtn = document.getElementById('pitch-down'),
			pitchDisplay = document.getElementById('pitch-display');

function updatePitchDisplay() {
	const oct = transposeSemitones / 4;
	pitchDisplay.textContent = `Octave: ${oct > 0 ? '+' + oct : oct}`;
}

if (pitchUpBtn) {
	pitchUpBtn.addEventListener('click', () => {
		transposeSemitones += 4;
		updatePitchDisplay();
	});
}
if (pitchDownBtn) {
	pitchDownBtn.addEventListener('click', () => {
		transposeSemitones -= 4;
		updatePitchDisplay();
	});
}

updatePitchDisplay();

function playByCode(keyCode) {
	const audio = document.querySelector(`audio[data-key="${keyCode}"]`),
				key = document.querySelector(`.key[data-key="${keyCode}"]`);
	if (!key || !audio) return;
	const keyNote = key.getAttribute("data-note");
	key.classList.add("playing");
	note.innerHTML = keyNote;
	audio.currentTime = 0;
	audio.volume = volume;
	audio.playbackRate = Math.pow(2, transposeSemitones / 12);
	audio.play();
}

function playNote(e) {
	// keyboard event
	playByCode(e.keyCode);
}

function removeTransition(e) {
	if (e.propertyName !== "transform") return;
	this.classList.remove("playing");
}

function hintsOn(e, index) {
	e.setAttribute("style", "transition-delay:" + index * 50 + "ms");
}

hints.forEach(hintsOn);
keys.forEach(key => key.addEventListener("transitionend", removeTransition));
window.addEventListener("keydown", playNote);

// mouse & touch support
keys.forEach(key => {
	key.addEventListener('click', () => {
		playByCode(parseInt(key.getAttribute('data-key')));
	});
	key.addEventListener('touchstart', (ev) => {
		ev.preventDefault();
		playByCode(parseInt(key.getAttribute('data-key')));
	}, {passive: false});
});
