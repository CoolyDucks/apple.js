class Base {
  constructor(attrs = {}) {
    this.__id = Base._nextId();
    Object.assign(this, attrs);
  }
  static _nextId(){ Base._id = (Base._id||0)+1; return Base._id; }
  toJSON(){ const o = {}; for (let k of Object.keys(this)) if (!k.startsWith('__')) o[k]=this[k]; return o; }
}
class Observable {
  constructor(){ this._ev = {}; }
  on(name,fn){ (this._ev[name]||(this._ev[name]=[])).push(fn); return this; }
  off(name,fn){ if(!this._ev[name]) return this; this._ev[name]=this._ev[name].filter(x=>x!==fn); return this; }
  emit(name,...args){ (this._ev[name]||[]).slice().forEach(fn=>fn(...args)); return this; }
}
function mixin(target, ...sources){ for (const s of sources) Object.getOwnPropertyNames(s).forEach(k=>{ if(k!=='constructor') Object.defineProperty(target, k, Object.getOwnPropertyDescriptor(s,k)); }); return target; }
class ClassFactory {
  static extend(Parent, protoProps = {}, staticProps = {}) {
    class C extends Parent { constructor(...a){ super(...a); if(typeof protoProps.constructor==='function') protoProps.constructor.apply(this,a);} }
    Object.assign(C.prototype, protoProps);
    Object.assign(C, staticProps);
    return C;
  }
}
export { Base, Observable, mixin, ClassFactory };
