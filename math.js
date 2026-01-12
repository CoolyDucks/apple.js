class Vector3 {
  constructor(x=0,y=0,z=0){ this.x=x; this.y=y; this.z=z; }
  add(v){ this.x+=v.x; this.y+=v.y; this.z+=v.z; return this; }
  sub(v){ this.x-=v.x; this.y-=v.y; this.z-=v.z; return this; }
  clone(){ return new Vector3(this.x,this.y,this.z); }
  scale(s){ this.x*=s; this.y*=s; this.z*=s; return this; }
  length(){ return Math.hypot(this.x,this.y,this.z); }
  dot(v){ return this.x*v.x + this.y*v.y + this.z*v.z; }
  set(x,y,z){ this.x=x; this.y=y; this.z=z; return this; }
}
class Matrix4 {
  constructor(){ this.elements = new Float32Array(16); this.identity(); }
  identity(){ const e=this.elements; e.set([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]); return this; }
  multiply(m){
    const a=this.elements,b=m.elements,r=new Float32Array(16);
    for(let i=0;i<4;i++) for(let j=0;j<4;j++){
      let s=0; for(let k=0;k<4;k++) s+=a[i*4+k]*b[k*4+j]; r[i*4+j]=s;
    }
    this.elements=r; return this;
  }
  static perspective(fov,aspect,near,far){
    const m=new Matrix4(); const f=1/Math.tan(fov/2); const e=m.elements;
    e[0]=f/aspect; e[5]=f; e[10]=(far+near)/(near-far); e[11]=-1; e[14]=(2*far*near)/(near-far); e[15]=0; return m;
  }
  static lookAt(eye,center,up){
    const z = eye.clone().sub(center); const zn = 1/z.length(); z.scale(zn);
    const x = up.clone().cross? up.clone().cross(z) : new Vector3(); // minimal check
    const xn = 1/x.length(); x.scale(xn);
    const y = z.clone().cross? z.clone().cross(x) : new Vector3();
    const m = new Matrix4(); const e=m.elements;
    e.set([x.x, y.x, z.x, 0, x.y, y.y, z.y, 0, x.z, y.z, z.z, 0, -(x.x*eye.x + x.y*eye.y + x.z*eye.z), -(y.x*eye.x + y.y*eye.y + y.z*eye.z), -(z.x*eye.x + z.y*eye.y + z.z*eye.z), 1]);
    return m;
  }
}
Vector3.prototype.cross = function(v){ return new Vector3(this.y*v.z - this.z*v.y, this.z*v.x - this.x*v.z, this.x*v.y - this.y*v.x); };
Vector3.prototype.dot = function(v){ return this.x*v.x + this.y*v.y + this.z*v.z; };
export { Vector3, Matrix4 };
