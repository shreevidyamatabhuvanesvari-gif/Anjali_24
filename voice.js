const textBox = document.getElementById("anjaliText");

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.lang = "hi-IN";
recognition.continuous = false;
recognition.interimResults = false;

function startListening(){
  speechSynthesis.cancel();
  recognition.start();
  textBox.innerText = "सुन रही हूँ… 🎧";
}

recognition.onresult = (event)=>{
  const user = event.results[0][0].transcript;
  const reply = ResponseEngine.respond(user);

  textBox.innerText = reply;
  speak(reply);
};

function speak(msg){
  if(!msg) msg = "मैं यहाँ हूँ";

  const u = new SpeechSynthesisUtterance(msg);
  u.lang = "hi-IN";
  speechSynthesis.cancel();
  speechSynthesis.speak(u);
}
