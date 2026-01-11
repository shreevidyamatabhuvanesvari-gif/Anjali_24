const ConversationState = {
  mood: "neutral",
  topic: null,

  updateFromText(text){
    if(text.includes("उदास") || text.includes("sad")) this.mood="sad";
    if(text.includes("प्यार") || text.includes("love")) this.mood="romantic";
    if(text.includes("मज़ाक")) this.mood="playful";
  }
};
