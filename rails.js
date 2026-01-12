import { EventEmitter } from './utils.js';
class Model extends EventEmitter {
  constructor(attrs={}){ super(); this.attrs = Object.assign({}, attrs); this.id = this.attrs.id || Math.random().toString(36).slice(2,9); }
  save(store){ store.createOrUpdate(this); this.emit('saved',this); return this; }
  toJSON(){ return Object.assign({id:this.id}, this.attrs); }
}
class Store {
  constructor(){ this._data = {}; }
  create(model){ this._data[model.id] = model; return model; }
  update(id,attrs){ const m=this._data[id]; if(!m) throw new Error('not found'); Object.assign(m.attrs,attrs); return m; }
  createOrUpdate(model){ this._data[model.id]=model; return model; }
  find(id){ return this._data[id]||null; }
  all(){ return Object.values(this._data); }
}
export { Model, Store };
