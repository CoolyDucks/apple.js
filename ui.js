class UIManager {
  constructor(root=document.body){
    this.root = root;
    this.container = document.createElement('div');
    Object.assign(this.container.style,{position:'absolute',top:'10px',left:'10px',zIndex:9999});
    this.root.appendChild(this.container);
  }
  panel(title){
    const p = document.createElement('div'); p.style.margin='6px'; p.style.padding='8px'; p.style.background='rgba(0,0,0,0.5)'; p.style.borderRadius='6px';
    if(title){ const h=document.createElement('div'); h.textContent=title; h.style.fontWeight='600'; h.style.marginBottom='6px'; p.appendChild(h); }
    this.container.appendChild(p); return p;
  }
  button(parent,text,cb){
    const b = document.createElement('button'); b.innerText=text; b.style.margin='4px'; b.onclick=cb; parent.appendChild(b); return b;
  }
  slider(parent,min,max,step,initial,cb){
    const input=document.createElement('input'); input.type='range'; input.min=min; input.max=max; input.step=step; input.value=initial; input.oninput=()=>cb(Number(input.value)); parent.appendChild(input); return input;
  }
  checkbox(parent,label,checked,cb){ const d=document.createElement('label'); const c=document.createElement('input'); c.type='checkbox'; c.checked=checked; c.onchange=()=>cb(c.checked); d.appendChild(c); d.appendChild(document.createTextNode(' '+label)); parent.appendChild(d); return c; }
}
export { UIManager };
