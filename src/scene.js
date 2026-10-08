import * as THREE from 'three';
export const W = 480, H = 854, BASE = 729, STEP = 39;
const palette={red:'#e54845',blue:'#2589e5',green:'#57c929',yellow:'#f6b931',bronze:'#c58a65',silver:'#b6d8ef',gold:'#ffd240',diamond:'#f164df',concrete:'#8c8398',clock:'#f582d6',piggy:'#f789dc',multiplier:'#be85f8',cat:'#fff0b5'};
const colors={};
function texture(type){
 const c=document.createElement('canvas');c.width=512;c.height=128;const ctx=c.getContext('2d');
 const p=palette[type];ctx.fillStyle=p;ctx.fillRect(0,0,512,128);ctx.fillStyle='#00000019';ctx.fillRect(0,84,512,44);ctx.fillStyle='#ffffff38';ctx.fillRect(0,0,512,8);
 ctx.strokeStyle='#221c4166';ctx.lineWidth=3;
 for(let y=14;y<128;y+=24){for(let x=(y/24%2)*28;x<512;x+=60){ctx.strokeRect(x,y,59,23);}}
 if(['red','blue','green','yellow'].includes(type)){
  for(let i=0;i<4;i++){const x=27+i*107;ctx.fillStyle='#26365c';ctx.fillRect(x+5,24,74,78);ctx.fillStyle='#faffef';ctx.fillRect(x,18,74,78);ctx.fillStyle='#2b4e7a';ctx.fillRect(x+7,25,60,61);ctx.fillStyle='#8ed8f3';ctx.fillRect(x+11,28,52,50);ctx.fillStyle='#e7fdff';ctx.beginPath();ctx.moveTo(x+12,30);ctx.lineTo(x+61,77);ctx.lineTo(x+42,77);ctx.lineTo(x+12,47);ctx.fill();ctx.fillStyle='#fffce0';ctx.fillRect(x+32,23,6,66);ctx.fillRect(x-3,92,79,8);}
  ctx.fillStyle='#19193755';ctx.fillRect(470,32,18,67);ctx.fillStyle='#ffeaa3';ctx.fillRect(473,38,12,46);
 }else if(type==='concrete'){
  ctx.strokeStyle='#554d64';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(160,0);ctx.lineTo(199,45);ctx.lineTo(174,66);ctx.lineTo(204,103);ctx.lineTo(194,128);ctx.stroke();ctx.fillStyle='#e9d761';ctx.fillRect(280,28,130,62);ctx.fillStyle='#3f354a';ctx.font='bold 52px Arial';ctx.fillText('!',334,78);
 }else if(['clock','piggy','multiplier','cat'].includes(type)){
  ctx.fillStyle='#ffffff25';ctx.fillRect(10,10,490,25);ctx.strokeStyle='#774e8f';ctx.lineWidth=5;ctx.strokeRect(11,12,490,104);ctx.save();ctx.translate(256,64);
  if(type==='clock'){ctx.fillStyle='#fffce7';ctx.strokeStyle='#8b457c';ctx.lineWidth=6;ctx.beginPath();ctx.arc(0,0,43,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(0,-28);ctx.lineTo(0,0);ctx.lineTo(20,10);ctx.stroke();}
  if(type==='piggy'){ctx.fillStyle='#ffef9f';ctx.strokeStyle='#a25a83';ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(0,3,46,31,0,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.fillRect(24,-35,16,25);ctx.fillRect(33,-8,27,24);ctx.fillRect(-29,25,13,18);ctx.fillRect(20,25,13,18);ctx.fillStyle='#8b446b';ctx.fillRect(-15,-17,30,4);ctx.beginPath();ctx.arc(24,-4,4,0,Math.PI*2);ctx.fill();}
  if(type==='multiplier'){ctx.font='bold 83px Arial';ctx.fillStyle='#fffda6';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('×',0,4);}
  if(type==='cat'){ctx.fillStyle='#ffca5e';ctx.strokeStyle='#704a65';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(-39,-35);ctx.lineTo(-14,-24);ctx.lineTo(14,-24);ctx.lineTo(39,-35);ctx.lineTo(44,15);ctx.quadraticCurveTo(0,65,-44,15);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle='#65415a';for(const x of [-20,20]){ctx.beginPath();ctx.arc(x,1,5,0,Math.PI*2);ctx.fill();}ctx.fillStyle='#f47887';ctx.beginPath();ctx.moveTo(-7,15);ctx.lineTo(7,15);ctx.lineTo(0,24);ctx.fill();}
  ctx.restore();
 }else{
  ctx.fillStyle='#ffffff2d';ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(270,0);ctx.lineTo(128,128);ctx.lineTo(0,128);ctx.fill();
  ctx.strokeStyle='#432d6866';ctx.lineWidth=7;ctx.strokeRect(13,13,486,102);ctx.strokeStyle='#fff5c48c';ctx.lineWidth=3;ctx.strokeRect(22,22,468,84);
  ctx.fillStyle='#3b294a33';ctx.fillRect(52,37,95,50);ctx.fillRect(365,37,95,50);
  ctx.save();ctx.translate(255,64);ctx.fillStyle=type==='diamond'?'#b3faff':'#fff8b2';ctx.strokeStyle=type==='diamond'?'#963ca5':'#916532';ctx.lineWidth=4;
  if(type==='diamond'){ctx.beginPath();ctx.moveTo(-36,-26);ctx.lineTo(36,-26);ctx.lineTo(50,-3);ctx.lineTo(0,38);ctx.lineTo(-50,-3);ctx.closePath();ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(-50,-3);ctx.lineTo(50,-3);ctx.moveTo(-19,-26);ctx.lineTo(0,38);ctx.lineTo(19,-26);ctx.stroke();}else{ctx.beginPath();ctx.ellipse(0,0,41,43,0,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.fillStyle=type==='gold'?'#d49827':type==='silver'?'#6a96af':'#a36944';ctx.font='bold 60px Arial';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('★',0,3);}ctx.restore();
 }
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=4;return t;
}
export class TowerScene{
 constructor(host){
  this.renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});this.renderer.setPixelRatio(Math.min(devicePixelRatio,2));this.renderer.setClearColor(0x000000,0);this.renderer.outputColorSpace=THREE.SRGBColorSpace;host.appendChild(this.renderer.domElement);
  this.scene=new THREE.Scene();this.camera=new THREE.OrthographicCamera(-W/2,W/2,H/2,-H/2,.1,3000);this.camera.position.z=1000;
  this.scene.add(new THREE.AmbientLight(0xffffff,2.1));const light=new THREE.DirectionalLight(0xffeada,2.2);light.position.set(-300,700,900);this.scene.add(light);
  this.tower=new THREE.Group();this.scene.add(this.tower);this.items=new Map();this.particles=[];this.time=0;this.shake=0;this.drag=null;this.tilt=0;
  this.box=new THREE.BoxGeometry(161,34,57);this.edgeGeometry=new THREE.EdgesGeometry(this.box);this.slab=new THREE.BoxGeometry(169,4,64);this.particleGeometry=new THREE.PlaneGeometry(1,1);
  for(const type of Object.keys(palette))colors[type]={hex:new THREE.Color(palette[type]),texture:texture(type)};
  const ground=new THREE.Mesh(new THREE.CircleGeometry(1,48),new THREE.MeshBasicMaterial({color:0x181135,transparent:true,opacity:.45}));ground.position.set(0,H/2-752,-70);ground.scale.set(112,20,1);this.scene.add(ground);
  this.resize=new ResizeObserver(()=>this.renderer.setSize(host.clientWidth,host.clientHeight,false));this.resize.observe(host);
 }
 floor(f){
  const g=new THREE.Group(),p=colors[f.type]||colors.concrete;
  const mats=[0,1,2,3,4,5].map((_,i)=>new THREE.MeshLambertMaterial({color:i===4?0xffffff:p.hex,map:i===4?p.texture:null}));
  const box=new THREE.Mesh(this.box,mats);g.add(box);g.add(new THREE.LineSegments(this.edgeGeometry,new THREE.LineBasicMaterial({color:0x252038,transparent:true,opacity:.8})));
  const roof=new THREE.Mesh(this.slab,new THREE.MeshLambertMaterial({color:p.hex.clone().multiplyScalar(1.16)}));roof.position.y=19;g.add(roof);g.rotation.set(.15,-.29,0);g.position.z=3;this.tower.add(g);
  return {g,mats,f,vy:0,x:0,y:-90,target:0,oldTarget:0,flash:0,matching:false,landed:false};
 }
 sync(floors){
  const keep=new Map(floors.map(f=>[f.id,f.type]));for(const [id,o] of this.items){if(keep.get(id)!==o.f.type){this.tower.remove(o.g);o.g.traverse(n=>{if(n.material){for(const m of Array.isArray(n.material)?n.material:[n.material])m.dispose();}});this.items.delete(id);}}
  floors.forEach((f,i)=>{let o=this.items.get(f.id);if(!o){o=this.floor(f);this.items.set(f.id,o);o.y=Math.min(BASE-i*STEP-170,-45);o.target=BASE-i*STEP;}o.oldTarget=o.target;o.target=BASE-i*STEP;if(Math.abs(o.target-o.oldTarget)>5)o.landed=false;o.f=f;});
 }
 settle(){this.tilt=0;this.shake=0;for(const p of this.particles){this.scene.remove(p.mesh);p.mesh.material.dispose();if(p.ring)p.mesh.geometry.dispose();}this.particles=[];for(const o of this.items.values()){o.y=o.target;o.vy=0;o.x=0;o.matching=false;o.landed=true;}}
 mark(ids,on=true){const mid=ids.reduce((sum,id)=>sum+this.getY(id),0)/ids.length;for(const id of ids){const o=this.items.get(id);if(o){o.matching=on;o.matchStart=this.time;o.matchCenter=mid;}}}
 dragFloor(id,x){this.drag=id==null?null:{id,x};}
 getY(id){return this.items.get(id)?.y??BASE;}
 eject(f,side){const o=this.items.get(f.id);if(!o)return;this.burst(side?445:35,o.y,palette[f.type],15);}
 burst(x,y,color,count=35,power=1){
  for(let i=0;i<count;i++){
   const angle=Math.random()*Math.PI*2,speed=(60+Math.random()*180)*power;
   const mat=new THREE.MeshBasicMaterial({color:i%4===0?'#ffffff':color,transparent:true,depthTest:false});const mesh=new THREE.Mesh(this.particleGeometry,mat);mesh.position.set(x-W/2,H/2-y,120);mesh.scale.set(3+Math.random()*9,2+Math.random()*5,1);this.scene.add(mesh);this.particles.push({mesh,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,life:.45+Math.random()*.5,max:1,spin:(Math.random()-.5)*12,gravity:180});
  }
 }
 beam(y,color,power=1){
  const mat=new THREE.MeshBasicMaterial({color,transparent:true,opacity:.75,blending:THREE.AdditiveBlending,depthTest:false});const mesh=new THREE.Mesh(this.particleGeometry,mat);mesh.position.set(0,H/2-y,110);mesh.scale.set(W,18+power*12,1);this.scene.add(mesh);this.particles.push({mesh,life:.45,max:.45,beam:true,vx:0,vy:0,gravity:0});
  const ring=new THREE.Mesh(new THREE.RingGeometry(20,24,40),new THREE.MeshBasicMaterial({color:'#fff6c5',transparent:true,opacity:1,depthTest:false}));ring.position.set(0,H/2-y,119);this.scene.add(ring);this.particles.push({mesh:ring,life:.45,max:.45,ring:true,vx:0,vy:0,gravity:0});
  for(let i=0;i<9;i++){const mesh2=new THREE.Mesh(this.particleGeometry,new THREE.MeshBasicMaterial({color:'#fff8cb',transparent:true,depthTest:false}));mesh2.position.set((Math.random()-.5)*130,H/2-y,118);mesh2.scale.set(3,14,1);this.scene.add(mesh2);this.particles.push({mesh:mesh2,life:.6+i*.015,max:.75,vx:0,vy:0,gravity:0,seek:true});}
  this.shake=Math.max(this.shake,3+power*2);
 }
 update(dt,tilt=0,ended=false){
  this.time+=dt;this.tilt+=(tilt-this.tilt)*Math.min(1,dt*5);const shake=this.shake;this.shake*=Math.exp(-dt*10);this.tower.position.x=(Math.random()-.5)*shake;this.tower.position.y=(Math.random()-.5)*shake;
  for(const [id,o] of this.items){
   if(o.y<o.target-0.3||!o.landed){o.vy+=2300*dt;o.y+=o.vy*dt;if(o.y>=o.target){o.y=o.target;if(o.vy>70){o.vy=-o.vy*.16;}else{o.vy=0;o.landed=true;}}}
   const desired=(this.drag?.id===id?this.drag.x:0)+this.tilt*(BASE-o.y)*.24;
   o.x+=(desired-o.x)*Math.min(1,dt*28);
   o.g.position.x=o.x+Math.sin(this.time*3+o.y*.017)*Math.abs(this.tilt)*3;o.g.position.y=H/2-o.y;
   o.g.rotation.z=-this.tilt*.19+Math.sin(this.time*4+o.y*.04)*Math.abs(this.tilt)*.025;
   if(ended&&Math.abs(tilt)>.8){o.g.rotation.z=-tilt*(BASE-o.y)*.005;}
   const pulse=o.matching?((Math.sin(this.time*37)+1)*.5):0;for(const m of o.mats){m.emissive.setRGB(pulse*.7,pulse*.65,pulse*.7);}
   const progress=o.matching?Math.max(0,Math.min(1,(this.time-o.matchStart-.28)/.12)):0;const s=o.matching?1+Math.sin(this.time*29)*.025:1;o.g.scale.set(s+progress*.12,s*(1-progress*.72),1);if(progress)o.g.position.y+=(o.y-o.matchCenter)*progress;
  }
  for(let i=this.particles.length-1;i>=0;i--){const p=this.particles[i];p.life-=dt;if(p.life<=0){this.scene.remove(p.mesh);p.mesh.material.dispose();if(p.ring)p.mesh.geometry.dispose();this.particles.splice(i,1);continue;}
   if(p.seek){p.mesh.position.x+=(-197-p.mesh.position.x)*dt*4.8;p.mesh.position.y+=(H/2-70-p.mesh.position.y)*dt*4.8;p.mesh.rotation.z=-.4;}
   else{p.vy-=p.gravity*dt;p.mesh.position.x+=p.vx*dt;p.mesh.position.y+=p.vy*dt;p.mesh.rotation.z+=(p.spin||0)*dt;}
   p.mesh.material.opacity=Math.min(1,p.life/(p.max*.55));if(p.ring){const s=1+(1-p.life/p.max)*8;p.mesh.scale.set(s,s*.48,1);}if(p.beam)p.mesh.scale.y+=(130-p.mesh.scale.y)*dt*8;
  }
  this.renderer.render(this.scene,this.camera);
 }
}
export {palette};
