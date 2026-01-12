import { Vector3 } from './math.js';
class Body {
  constructor(mass=1,position=new Vector3(0,0,0),velocity=new Vector3(0,0,0)){ this.mass=mass; this.pos=position; this.vel=velocity; this.force=new Vector3(0,0,0); this.radius=1; }
  applyForce(f){ this.force.add(f); }
  integrate(dt){
    const a = this.force.clone().scale(1/this.mass);
    this.vel.add(a.clone().scale(dt));
    this.pos.add(this.vel.clone().scale(dt));
    this.force.set(0,0,0);
  }
}
class World {
  constructor(){ this.bodies=[]; this.gravity=new Vector3(0,-9.81,0); }
  add(body){ this.bodies.push(body); return body; }
  step(dt){
    for(const b of this.bodies) b.applyForce(this.gravity.clone().scale(b.mass));
    for(const b of this.bodies) b.integrate(dt);
    this._resolveCollisions();
  }
  _resolveCollisions(){
    for(let i=0;i<this.bodies.length;i++) for(let j=i+1;j<this.bodies.length;j++){
      const A=this.bodies[i], B=this.bodies[j];
      const d = A.pos.clone().sub(B.pos);
      const dist = d.length();
      const min = A.radius + B.radius;
      if(dist>0 && dist<min){
        const n = d.scale(1/dist);
        const overlap = min - dist;
        A.pos.add(n.clone().scale(overlap*0.5));
        B.pos.add(n.clone().scale(-overlap*0.5));
        const rel = A.vel.clone().sub(B.vel);
        const sep = rel.dot(n);
        if(sep<0){
          const e = 0.7;
          const jimp = -(1+e)*sep/(1/A.mass + 1/B.mass);
          const impulse = n.clone().scale(jimp);
          A.vel.add(impulse.clone().scale(1/A.mass));
          B.vel.sub(impulse.clone().scale(1/B.mass));
        }
      }
    }
  }
}
export { Body, World };
