/* ===== ANJALI BRAIN + RESPONSE ENGINE ===== */

(function(){

  /* -------- MEMORY -------- */
  let memory = JSON.parse(localStorage.getItem("anjaliMemory")) || [];

  function saveMemory(){
    localStorage.setItem("anjaliMemory", JSON.stringify(memory));
  }

  function clean(t){
    return (t || "")
      .toLowerCase()
      .replace(/[^\u0900-\u097F a-z0-9 ]/g,"")
      .replace(/\s+/g," ")
      .trim();
  }

  /* -------- ADMIN FUNCTIONS -------- */
  window.saveQA = function(q,a){
    if(!q || !a) return;
    memory.push({ q: clean(q), a: a });
    saveMemory();
  };

  window.showMemory = function(){
    return memory.map(m=>"❓ "+m.q+" → "+m.a).join("<br>");
  };

  /* -------- MATCHING -------- */
  function similarity(a,b){
    let A=a.split(" "), B=b.split(" ");
    let m=0;
    for(let w of A){
      if(B.includes(w)) m++;
    }
    return m / Math.max(A.length,B.length);
  }

  function findAnswer(text){
    text = clean(text);
    let best=null, score=0;

    for(let m of memory){
      let s = similarity(text, m.q);
      if(s>score){
        score=s;
        best=m;
      }
    }

    if(best && score>0.4) return best.a;
    return "मुझे यह नहीं पता… मुझे सिखाओ 🤍";
  }

  /* -------- RESPONSE ENGINE -------- */
  window.ResponseEngine = {
    respond: function(userText){
      try{
        const reply = findAnswer(userText);
        return reply || "मैं यहाँ हूँ 💖";
      }catch(e){
        console.error("Anjali error:", e);
        return "मुझे सोचने में थोड़ी परेशानी हुई 😔";
      }
    }
  };

})();
