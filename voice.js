const text = document.getElementById("anjaliText");

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.lang = "hi-IN";
recognition.interimResults = false;
recognition.continuous = false; // Chrome requires false

let listening = false;
let stopTime = 0;

/* START LISTENING */
function startListening(){
  speechSynthesis.cancel();        // अगर Anjali बोल रही है, चुप करो
  listening = true;
  stopTime = Date.now() + 120000;   // 2 minutes from now
  recognition.start();
  text.innerText = "मैं सुन रही हूँ… 👂";
}

/* WHEN USER SPEAKS */
recognition.onresult = (event)=>{
  // user spoke → reset 2 minute window
  stopTime = Date.now() + 120000;

  const user = event.results[0][0].transcript;

  speechSynthesis.cancel(); // अगर बोल रही थी तो काटो

  const reply = getAnswer(user);
  text.innerText = reply;
  speak(reply);
};

/* WHEN MIC STOPS (Chrome auto stops it) */
recognition.onend = ()=>{
  if(listening && Date.now() < stopTime){
    recognition.start();   // auto-restart mic
  } else {
    listening = false;
    text.innerText = "मैं अभी रुकी हूँ… 🎧";
  }
};

/* SPEAK */
function speak(msg){
  const u = new SpeechSynthesisUtterance(msg);
  u.lang = "hi-IN";
  speechSynthesis.speak(u);
}
