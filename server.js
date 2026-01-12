import { EventEmitter } from './utils.js';
class Server extends EventEmitter{
  constructor(port=3000){ super(); this.port=port; this._routes=[]; this._middlewares=[]; }
  use(fn){ this._middlewares.push(fn); return this; }
  route(method,path,handler){ this._routes.push({method:method.toUpperCase(),path,handler}); return this; }
  findRoute(req){ return this._routes.find(r=>r.method===req.method && (r.path===req.url || (r.path instanceof RegExp && r.path.test(req.url)))); }
  start(){
    if(typeof window!=='undefined') { console.warn('Server.start intended for Node.js'); return; }
    const http = require('http');
    const srv = http.createServer((req,res)=>{
      const ctx = {req,res,body:null};
      let i=0;
      const next = ()=>{ if(i < this._middlewares.length) return Promise.resolve(this._middlewares[i++](ctx,next)); const route = this.findRoute(req); if(route) return Promise.resolve(route.handler(ctx)); res.statusCode=404; res.end('Not Found'); };
      Promise.resolve(next()).catch(err=>{ res.statusCode=500; res.end('Server Error'); this.emit('error',err); });
    });
    srv.listen(this.port);
    this.emit('listening',this.port);
    console.log(`Server listening ${this.port}`);
    return srv;
  }
}
export { Server };
