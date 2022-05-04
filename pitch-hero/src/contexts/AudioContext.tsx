
// const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var AudioContexto = window.AudioContext || window.webkitAudioContext;

var audioCtx = new AudioContexto({
  latencyHint: 'interactive',
  sampleRate: 44100,
});

console.log(window);
// if (! window.AudioContext) {
//   if (window.webkitAudioContext) {

//   }
  
// }

// var ctx = new AudioContext();

let analyser = audioCtx.createAnalyser();
analyser.fftSize = 2048;

const AudioContext = {
  getAudioContext() {
    return audioCtx;
  },

  getAnalyser() {
    return analyser;
  },

  resetAnalyser() {
    analyser = audioCtx.createAnalyser();
  },

  decodeAudioData(audioData) {
    audioCtx.decodeAudioData(audioData).then(function (decodedData) {
      // use the decoded data here
    });
  },
};

export default AudioContext;

// // const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
// // var AudioContext = window.AudioContext || window.webkitAudioContext;
// if (! window.AudioContext) {
//   if (window.webkitAudioContext) {
//     window.AudioContext = window.webkitAudioContext;
//   }
// }

// var ctx = new AudioContext();
// let analyser = audioCtx.createAnalyser();
// analyser.fftSize = 2048;
// const AudioContext = {
//   getAudioContext() {
//     return audioCtx;
//   },

//   getAnalyser() {
//     return analyser;
//   },

//   resetAnalyser() {
//     analyser = audioCtx.createAnalyser();
//   },

//   decodeAudioData(audioData) {
//     audioCtx.decodeAudioData(audioData).then(function (decodedData) {
//       // use the decoded data here
//     });
//   },
// };

// export default AudioContext;