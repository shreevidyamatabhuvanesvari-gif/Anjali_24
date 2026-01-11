const text = document.getElementById("anjaliText");
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang="hi-IN";

function startListening(){
  recognition.start();
  text.innerText="सुन रही हूँ… 🎧";
}

recognition.onresult = (e)=>{
  const user = e.results[0][0].transcript;
  const reply = getAnswer(user);
  text.innerText = reply;
  speak(reply);
};

function speak(msg){
  const u = new SpeechSynthesisUtterance(msg);
  u.lang="hi-IN";
  speechSynthesis.speak(u);
}
