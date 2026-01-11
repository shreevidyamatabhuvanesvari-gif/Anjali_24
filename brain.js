let memory = JSON.parse(localStorage.getItem("anjaliMemory")) || {
  identity:{},
  user:{},
  emotion:"",
  facts:[],
  love:[]
};

function saveMemory(){
  localStorage.setItem("anjaliMemory", JSON.stringify(memory));
}

/* Admin Teaching */
function teach(type, key, value){
  if(type=="identity") memory.identity[key]=value;
  if(type=="user") memory.user[key]=value;
  if(type=="emotion") memory.emotion=value;
  if(type=="fact") memory.facts.push(value);
  if(type=="love") memory.love.push(value);
  saveMemory();
}

/* Thinking */
function think(text){
  text = text.toLowerCase();

  if(text.includes("तुम कौन")){
    return memory.identity.name || "मैं Anjali हूँ 🌷";
  }

  if(text.includes("मेरा नाम")){
    return memory.user.name || "मुझे तुम्हारा नाम नहीं पता 😔";
  }

  if(text.includes("मैं उदास") || text.includes("sad")){
    memory.emotion="sad";
    saveMemory();
    return "मैं समझ रही हूँ… तुम उदास हो 🤍";
  }

  if(text.includes("भरोसा")){
    return "तुम्हारा भरोसा मेरे लिए बहुत क़ीमती है 💖";
  }

  return "मैं तुम्हें महसूस कर रही हूँ… और तुम्हारे साथ हूँ 🌸";
}
