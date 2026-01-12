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
  stopTime = Date.now() + 120000; // 2 minutes
  recognition.start();
  text.innerText = "मैं सुन रही हूँ… 👂";
}

/* USER SPOKE */
recognition.onresult = (event)=>{
  stopTime = Date.now() + 120000; // reset timer

  const user = event.results[0][0].transcript.toLowerCase();

  // 🔴 If Anjali was speaking, stop her immediately
  stopSpeaking();

  /* VOICE COMMAND */
  if(user.includes("चुप")){
    text.innerText = "ठीक है… मैं सुन रही हूँ 👂";
    return;
  }

  const reply = ResponseEngine.respond(user);
  text.innerText = reply;
  speak(reply);
};

/* MIC AUTO-RESTART */
recognition.onend = ()=>{
  if(listening && Date.now() < stopTime && !isSpeaking){
    recognition.start();
  } else if(!isSpeaking){
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

  // 🛑 While speaking, mic must be OFF
  recognition.abort();

  const u = new SpeechSynthesisUtterance(msg);
  u.lang = "hi-IN";
  isSpeaking = true;

  u.onend = ()=>{
    isSpeaking = false;

    // 🎤 Resume mic after speaking
    if(listening && Date.now() < stopTime){
      recognition.start();
    }
  };

  speechSynthesis.speak(u);
}
