function Sounds() {
    this.audioContext = null;
    this.sounds = {};
}

Sounds.prototype.init = function() {
    context = window.AudioContext || window.webkitAudioContext;
    this.audioContext = new context();
    this.mute = false;
};

Sounds.prototype.loadSound = function(name, url) {
    var self = this;
    this.sounds[name] = null;

    var req = new XMLHttpRequest();
    req.open('GET', url, true);
    req.responseType = 'arraybuffer';
    req.onload = function() {
        self.audioContext.decodeAudioData(req.response, function(buffer) {
            self.sounds[name] = {buffer: buffer};
        });
    };
    try {
      req.send();
    } catch(e) {
      console.log("An exception occured getting sound the sound " + name + " this might be " +
         "because the page is running from the file system, not a webserver.");
      console.log(e);
    }
};

Sounds.prototype.playSound = function(name, volume) {
    if(!this.sounds[name] || this.mute === true) {
        return;
    }

    var source = this.audioContext.createBufferSource();
    source.buffer = this.sounds[name].buffer;
    var gainNode = this.audioContext.createGain();
    source.connect(gainNode);

    gainNode.gain.value = volume || 1;
    gainNode.connect(this.audioContext.destination);
    source.start(0);
};