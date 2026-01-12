class Logger {
  static log(...a){ console.log('[apple]',...a); }
  static warn(...a){ console.warn('[apple]',...a); }
  static error(...a){ console.error('[apple]',...a); }
}
class EventEmitter {
  constructor(){ this._ev = {}; }
  on(n,f){ (this._ev[n]||(this._ev[n]=[])).push(f); return this; }
  off(n,f){ if(!this._ev[n]) return this; this._ev[n]=this._ev[n].filter(x=>x!==f); return this; }
  emit(n,...a){ (this._ev[n]||[]).slice().forEach(fn=>fn(...a)); return this; }
}
function debounce(fn,ms=200){ let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a),ms); }; }
function throttle(fn,ms=100){ let last=0; return (...a)=>{ const now=Date.now(); if(now-last>ms){ last=now; fn(...a); } }; }
export { Logger, EventEmitter, debounce, throttle };
