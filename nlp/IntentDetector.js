const IntentDetector = {
  detect(text){
    text=text.toLowerCase();

    if(text.includes("मेरा नाम")) return "set_name";
    if(text.includes("कौन")) return "question";
    if(text.includes("उदास") || text.includes("खुश")) return "emotion";
    if(text.includes("प्यार")) return "love";

    return "chat";
  }
};
