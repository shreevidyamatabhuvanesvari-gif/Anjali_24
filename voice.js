const text = document.getElementById("anjaliText");

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = "hi-IN";

function startListening(){
  recognition.start();
  text.innerText = "सुन रही हूँ… 💕";
}

recognition.onresult = (e) => {
  const user = e.results[0][0].transcript;
  const reply = getAnswer(user);
  text.innerText = reply;
  speak(reply);
};

function speak(msg){
  const speech = new SpeechSynthesisUtterance(msg);
  speech.lang = "hi-IN";
  speechSynthesis.speak(speech);
}
