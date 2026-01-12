const text = document.getElementById("anjaliText");
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.lang = "hi-IN";
recognition.continuous = false;
recognition.interimResults = false;

let listening = false;
let stopTime = 0;
let isSpeaking = false;

/* START */
function startListening(){
  stopSpeaking();
  listening = true;
  stopTime = Date.now() + 120000;
  recognition.start();
  text.innerText = "मैं सुन रही हूँ… 👂";
}

/* USER SPEAKS */
recognition.onresult = (event)=>{
  stopTime = Date.now() + 120000;

  const user = event.results[0][0].transcript.toLowerCase();

  // Always allow interrupt
  if(user.includes("चुप") || user.includes("रुको") || user.includes("stop")){
    stopSpeaking();
    text.innerText = "ठीक है… मैं सुन रही हूँ 👂";
    return;
  }

  // If Anjali is speaking, ignore everything else
  if(isSpeaking) return;

  const reply = ResponseEngine.respond(user);
  text.innerText = reply;
  speak(reply);
};

/* MIC AUTO */
recognition.onend = ()=>{
  if(listening && Date.now() < stopTime){
    recognition.start();
  } else {
    listening = false;
    text.innerText = "मैं अभी रुकी हूँ… 🎧";
  }
};

/* STOP SPEAKING */
function stopSpeaking(){
  if(speechSynthesis.speaking){
    speechSynthesis.cancel();
  }
  isSpeaking = false;
}

/* SPEAK */
function speak(msg){
  stopSpeaking();
  isSpeaking = true;

  const u = new SpeechSynthesisUtterance(msg);
  u.lang = "hi-IN";

  u.onend = ()=>{
    isSpeaking = false;
  };

  speechSynthesis.speak(u);
}
