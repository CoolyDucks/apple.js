import { Vector3, Matrix4 } from './math.js';
class GLUtils {
  static compile(gl,src,type){ const s = gl.createShader(type); gl.shaderSource(s,src); gl.compileShader(s); if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; }
  static program(gl,vs,fs){ const p=gl.createProgram(); gl.attachShader(p,GLUtils.compile(gl,vs,gl.VERTEX_SHADER)); gl.attachShader(p,GLUtils.compile(gl,fs,gl.FRAGMENT_SHADER)); gl.linkProgram(p); if(!gl.getProgramParameter(p,gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p)); return p; }
}
class Mesh {
  constructor(vertices, indices, attrs={}){ this.vertices = new Float32Array(vertices); this.indices = indices? new Uint16Array(indices) : null; this.attrs = attrs; }
}
class Renderer3D {
  constructor(canvas){
    this.canvas = canvas;
    this.gl = canvas.getContext('webgl')||canvas.getContext('experimental-webgl');
    this.gl.enable(this.gl.DEPTH_TEST);
    this.scene = [];
    this._defaultShader = null;
  }
  createDefaultShader(){
    const vs = `
      attribute vec3 aPos;
      attribute vec3 aColor;
      uniform mat4 uMVP;
      varying vec3 vColor;
      void main(){ gl_Position = uMVP * vec4(aPos,1.0); vColor = aColor; }
    `;
    const fs = `precision mediump float; varying vec3 vColor; void main(){ gl_FragColor = vec4(vColor,1.0); }`;
    this._defaultShader = GLUtils.program(this.gl,vs,fs);
    this._locations = {
      aPos: this.gl.getAttribLocation(this._defaultShader,'aPos'),
      aColor: this.gl.getAttribLocation(this._defaultShader,'aColor'),
      uMVP: this.gl.getUniformLocation(this._defaultShader,'uMVP')
    };
  }
  add(mesh, transform = Matrix4.identity()){
    if(!this._defaultShader) this.createDefaultShader();
    const gl = this.gl;
    const vao = {vbo:gl.createBuffer(), ibo:mesh.indices?gl.createBuffer():null, count: mesh.indices?mesh.indices.length:mesh.vertices.length/6};
    gl.bindBuffer(gl.ARRAY_BUFFER, vao.vbo); gl.bufferData(gl.ARRAY_BUFFER, mesh.vertices, gl.STATIC_DRAW);
    if(vao.ibo){ gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vao.ibo); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.indices, gl.STATIC_DRAW); }
    this.scene.push({mesh,vao,transform});
    return this.scene.length-1;
  }
  render(cameraMatrix){
    const gl = this.gl;
    gl.viewport(0,0,this.canvas.width,this.canvas.height);
    gl.clearColor(0.05,0.05,0.05,1); gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    gl.useProgram(this._defaultShader);
    for(const node of this.scene){
      gl.bindBuffer(gl.ARRAY_BUFFER, node.vao.vbo);
      gl.enableVertexAttribArray(this._locations.aPos);
      gl.vertexAttribPointer(this._locations.aPos,3,gl.FLOAT,false,24,0);
      gl.enableVertexAttribArray(this._locations.aColor);
      gl.vertexAttribPointer(this._locations.aColor,3,gl.FLOAT,false,24,12);
      gl.uniformMatrix4fv(this._locations.uMVP,false,cameraMatrix.elements);
      if(node.vao.ibo){ gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,node.vao.ibo); gl.drawElements(gl.TRIANGLES,node.vao.count,gl.UNSIGNED_SHORT,0); } else { gl.drawArrays(gl.TRIANGLES,0,node.vao.count); }
    }
  }
}
export { GLUtils, Mesh, Renderer3D };
