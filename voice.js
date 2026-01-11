const text = document.getElementById("anjaliText");
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.lang = "hi-IN";
recognition.continuous = true;

let listenTimer = null;

/* START LISTENING */
function startListening(){
  speechSynthesis.cancel();      // Anjali को चुप
  recognition.start();
  text.innerText = "मैं सुन रही हूँ… 👂";
  resetTimer();
}

/* RESET 2 MIN TIMER */
function resetTimer(){
  if(listenTimer) clearTimeout(listenTimer);
  listenTimer = setTimeout(()=>{
    recognition.stop();
    text.innerText = "मैं अभी रुकी हूँ… 🎧";
  }, 120000); // 2 minutes
}

/* WHEN USER SPEAKS */
recognition.onresult = (event)=>{
  resetTimer();   // हर बार बोलने पर 2 मिनट reset

  const user = event.results[event.results.length-1][0].transcript;
  const reply = getAnswer(user);

  text.innerText = reply;
  speak(reply);
};

/* HANDLE ERRORS */
recognition.onerror = ()=>{
  recognition.stop();
};

/* SPEAK */
function speak(msg){
  speechSynthesis.cancel(); // अगर पहले बोल रही थी तो रोक दो
  const u = new SpeechSynthesisUtterance(msg);
  u.lang = "hi-IN";
  speechSynthesis.speak(u);
}
