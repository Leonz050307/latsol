(function(){
  function rnd(){return Math.random().toString(16).slice(2)}
  if(!document.cookie.match(/(?:^|; )fp=/)){
    var fp = Date.now().toString(16)+rnd()+rnd();
    document.cookie = 'fp='+fp+'; path=/; max-age='+(60*60*24*365*2);
  }
})();
