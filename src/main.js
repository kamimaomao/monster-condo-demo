import {Game,TYPES,findMatch} from './model.js';
import {TowerScene,W,H,BASE,STEP,palette} from './scene.js';
import {monsterSVG} from './monsters.js';
const $=s=>document.querySelector(s), stage=$('#game'), hitboard=$('#hitboard');
const names={blue:'REGINALD',red:'BOAT HEAD',green:'MR. SHIGOTO',yellow:'LADY FEROCIOUS'};
const cn={blue:'蓝色',red:'红色',green:'绿色',yellow:'黄色'};
const powers={blue:'稳固高塔',red:'怪兽摇篮曲',green:'双倍合成',yellow:'得分 ×10'};
let game=new Game(), view, busy=false, paused=false, drag=null, selected=null, tasks=[], scoreShown=0, firstMove=true, demo=false, endedShown=false, soundOn=false, audio=null, previous=performance.now(), elapsed=0,lastAction=0;
try{view=new TowerScene($('#webgl'));}catch(error){$('#loading').textContent='此浏览器无法启动 WebGL，请用最新版 Chrome 或 Safari 打开。';throw error;}
function schedule(delay,fn){tasks.push({at:elapsed+delay,fn});}
function beep(kind,tier=0){
 if(!soundOn)return;
 try{audio ||= new(window.AudioContext||window.webkitAudioContext)();if(audio.state==='suspended')audio.resume();const now=audio.currentTime;
 const notes=kind==='match'?[392,523.25,659.25,783.99]:kind==='bad'?[110,87]:kind==='power'?[261.63,329.63,392,523.25]:[240,390];
 notes.forEach((hz,i)=>{const osc=audio.createOscillator(),g=audio.createGain();osc.type=kind==='bad'?'sawtooth':'triangle';osc.frequency.setValueAtTime(hz*(1+tier*.12),now+i*.055);g.gain.setValueAtTime(.0001,now+i*.055);g.gain.exponentialRampToValueAtTime(.065,now+i*.055+.009);g.gain.exponentialRampToValueAtTime(.0001,now+i*.055+.22);osc.connect(g);g.connect(audio.destination);osc.start(now+i*.055);osc.stop(now+i*.055+.24);});}catch{soundOn=false;}
}
function float(text,x,y,color){const e=document.createElement('div');e.className='float-text';e.textContent=text;e.style.left=x/W*100+'%';e.style.top=y/H*100+'%';if(color)e.style.color=color;$('#fx').append(e);e.addEventListener('animationend',()=>e.remove(),{once:true});}
function collectFeedback(ev){const c=ev.collected;if(!c)return;if(c.seconds)float('+'+c.seconds+' 秒',W-80,150,'#fff797');if(c.multiplierGain)float('倍率 +'+c.multiplierGain,95,170,'#ff9df1');if(c.coins)float('金币 +'+c.coins,W/2,650,'#fff797');}
function banner(text){const e=$('#combo-banner');e.classList.remove('pop');void e.offsetWidth;e.textContent=text;e.classList.add('pop');}
function flash(){const e=$('#flash');e.classList.remove('fire');void e.offsetWidth;e.classList.add('fire');}
function renderMonsters(){game.monsters.forEach((m,i)=>{const e=$('#monster'+i);if(e.dataset.color!==m.color){e.innerHTML=monsterSVG(m.color);e.dataset.color=m.color;$('#name'+i).textContent=names[m.color];}});}
function sync(){view.sync(game.floors);const existing=new Map([...hitboard.children].map(e=>[Number(e.dataset.id),e]));const ids=new Set(game.floors.map(f=>f.id));for(const[id,e]of existing)if(!ids.has(id))e.remove();
 game.floors.forEach((f,i)=>{let b=existing.get(f.id);if(!b){b=document.createElement('button');b.dataset.id=f.id;b.addEventListener('focus',()=>{selected=f.id;});hitboard.append(b);}b.setAttribute('aria-label',`第${i+1}层 ${TYPES[f.type]?.name||f.type}，左右划动投喂`);b.dataset.type=f.type;b.style.top=(BASE-i*STEP-STEP/2)/H*100+'%';});renderMonsters();stage.dataset.phase=game.phase;
}
function start(){if(game.phase==='ready'){game.start();$('#prompt').classList.add('hidden');view.mark(game.floors.map(f=>f.id),false);stage.dataset.phase='playing';}}
function finishMove(){if(game.phase==='ended'){busy=false;return;}const match=findMatch(game.floors);if(match){busy=true;view.mark(match.ids);schedule(.4,()=>{const y=match.ids.reduce((s,id)=>s+view.getY(id),0)/match.ids.length;const ev=game.resolveMatch(match);if(!ev){view.mark(match.ids,false);busy=false;return;}
  const rank=Math.max(0,TYPES[match.type]?.tier||0);collectFeedback(ev);view.beam(y,rank>0?'#ffe65e':palette[match.type],rank+1);view.burst(W/2,y,palette[ev.result]||'#fff46f',38+rank*9,1+rank*.18);float('+'+ev.points.toLocaleString(),W/2,y-25);banner(ev.mega?'MEGA ZONE!':ev.chain>1?['','COMBO!','SUPER COMBO!','EPIC COMBO!','ULTRA COMBO!'][Math.min(ev.chain,4)]:'COMBO!');beep('match',rank);if(rank>=2||ev.mega)flash();
  for(const tag of ev.tagged)float('换班！',tag.side?405:75,410,'#fff6a6');
  $('#hint').textContent=ev.mega?'MEGA ZONE · 怪兽狂欢！':`${TYPES[ev.type]?.name} → ${TYPES[ev.result]?.name||'MEGA ZONE'}${ev.created.filter(f=>f.type===ev.result).length>1?' ×'+ev.created.filter(f=>f.type===ev.result).length:''} · ${ev.chain} 连锁`;
  sync();for(const f of ev.created){const o=view.items.get(f.id);if(o){o.y=y;o.vy=0;o.landed=false;}}
  schedule(.34,finishMove);
 });}else{game.refill();sync();if(findMatch(game.floors)){schedule(.4,finishMove);return;}busy=false;if(firstMove){firstMove=false;$('#hint').textContent='铜楼喂给怪兽，发动超能力；也可以留着继续合成';}if(demo&&game.mega>0){$('#hint').textContent='五段连锁完成！三颗钻石进入 MEGA ZONE';demo=false;}lastAction=elapsed;}}
function swipe(id,side){if(busy||paused||game.phase==='ended')return;start();const floor=game.floors.find(f=>f.id===id);if(!floor)return;if(floor.type==='concrete'){float('在旁边合成来清除',W/2,view.getY(id)-40,'#ffe776');view.shake=3;beep('bad');view.dragFloor(null);return;}
 busy=true;lastAction=elapsed;const y=view.getY(id);view.dragFloor(id,side?370:-370);schedule(.15,()=>{const ev=game.swipe(id,side);view.dragFloor(null);if(!ev){busy=false;return;}view.eject(floor,side);collectFeedback(ev);sync();const m=$('#monster'+side);m.classList.remove('eat');void m.offsetWidth;m.classList.add('eat');schedule(.38,()=>m.classList.remove('eat'));
  if(ev.power){float(powers[game.monsters[side].color]+'!',side?365:115,y-40,'#fff6a6');beep('power');}else{float(ev.good?'好吃！':'吃错了！',side?392:88,Math.max(380,Math.min(620,y)),ev.good?'#f1ff9d':'#ff7186');beep(ev.good?'feed':'bad');}
  schedule(.25,finishMove);
 });}
function reset(mode='classic',showcase=false){tasks=[];busy=false;paused=false;drag=null;view.dragFloor(null);selected=null;elapsed=0;lastAction=0;scoreShown=0;firstMove=true;demo=showcase;endedShown=false;game=new Game({mode,seed:showcase?1:Math.floor(Math.random()*1e7)});$('#modal').classList.add('hidden');$('#fx').replaceChildren();$('#combo-banner').textContent='';$('#prompt').classList.remove('hidden');$('#prompt b').textContent=showcase?'一划触发五段连锁':'把蓝色楼层划向左边';$('#prompt small').textContent=showcase?'同一套规则：铜 → 银 → 金 → 钻石':'让 3 层红色公寓碰在一起';$('#hint').textContent=mode==='practice'?'练习模式 · 尽情尝试合成与怪兽能力':'左右划走一层 · 同色三层自动合成';$('#practice').textContent=mode==='practice'?'两分钟挑战':'无限练习';
 if(showcase){game.floors=['diamond','diamond','gold','gold','silver','silver','bronze','bronze','red','red','blue','red','green','yellow'].map((type,i)=>({id:-1000-i,type}));}
 sync();view.settle();selected=game.floors[showcase?10:2].id;if(showcase){start();busy=true;schedule(.8,()=>{busy=false;swipe(-1010,0);});}}
function modal(title,body,actions,label='MONSTER SHOW'){paused=true;view.dragFloor(null);drag=null;$('#modal-title').textContent=title;$('#modal-label').textContent=label;$('#modal-body').innerHTML=body;$('#modal-actions').replaceChildren();for(const a of actions){const b=document.createElement('button');b.textContent=a.label;if(a.secondary)b.className='secondary';b.addEventListener('click',a.run);$('#modal-actions').append(b);}$('#modal').classList.remove('hidden');$('#modal-actions button')?.focus();}
function resume(){paused=false;$('#modal').classList.add('hidden');stage.focus({preventScroll:true});}
function pause(){if(paused){resume();return;}if(game.phase==='ended')return;modal('中场休息',`<p>怪兽们正在等你回来。<br>目前得分 <b>${game.score.toLocaleString()}</b></p>`,[{label:'继续挑战',run:resume},{label:'重新开始',secondary:true,run:()=>reset(game.mode)}]);}
function end(){endedShown=true;let best=game.score;try{best=Math.max(best,Number(localStorage.getItem('condo-best')||0));localStorage.setItem('condo-best',String(best));}catch{}
 modal(game.resultReason==='time'?'时间到！':'高塔倒下了！',`<p>本场得分</p><p class="result-score">${game.score.toLocaleString()}</p><div class="result-grid"><span><b>${game.maxChain}</b>最高连锁</span><span><b>${game.matches}</b>合成次数</span><span><b>${game.feeds}</b>投喂次数</span></div><p>最佳纪录 ${best.toLocaleString()}</p>`,[{label:'再来一局',run:()=>reset(game.mode)},{label:'无限练习',secondary:true,run:()=>reset('practice')}],'SHOW COMPLETE');}
stage.addEventListener('pointerdown',e=>{const b=e.target.closest('#hitboard button');if(!b||busy||paused||game.phase==='ended'||!e.isPrimary)return;e.preventDefault();stage.focus({preventScroll:true});selected=Number(b.dataset.id);drag={id:selected,x:e.clientX,y:e.clientY};stage.setPointerCapture(e.pointerId);});
stage.addEventListener('pointermove',e=>{if(!drag)return;const dx=(e.clientX-drag.x)*W/stage.clientWidth;view.dragFloor(drag.id,Math.max(-225,Math.min(225,dx)));});
stage.addEventListener('pointerup',e=>{if(!drag)return;const d=drag;drag=null;view.dragFloor(null);const dx=(e.clientX-d.x)*W/stage.clientWidth,dy=(e.clientY-d.y)*H/stage.clientHeight;if(Math.abs(dx)>=23&&Math.abs(dx)>Math.abs(dy)*.8)swipe(d.id,dx>0?1:0);else selected=d.id;if(stage.hasPointerCapture(e.pointerId))stage.releasePointerCapture(e.pointerId);});
stage.addEventListener('pointercancel',()=>{drag=null;view.dragFloor(null);});
stage.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();pause();}if((e.key==='ArrowLeft'||e.key==='ArrowRight')&&selected!=null){e.preventDefault();swipe(selected,e.key==='ArrowRight'?1:0);}});
$('#sound').onclick=()=>{soundOn=!soundOn;$('#sound').setAttribute('aria-label',soundOn?'关闭音效':'开启音效');$('#sound').style.color=soundOn?'#fff68e':'#b7a4c6';beep('feed');};
$('#pause').onclick=pause;$('#practice').onclick=()=>reset(game.mode==='practice'?'classic':'practice');$('#showcase').onclick=()=>reset('practice',true);
$('#help').onclick=()=>modal('玩法说明',`<div class="rule-detail"><p><b>① 左右划出一层</b><br>喂相同颜色可安抚怪兽，喂错会激怒它。</p><p><b>② 让同色楼层上下相接</b><br>三层或更多同色楼层自动合成。铜、银、金可夹在颜色之间。</p><p><b>③ 金属不断升级</b><br>普通 → 铜 → 银 → 金 → 钻石。三颗钻石开启 Mega Zone。</p><p><b>④ 特殊楼层</b><br>时钟延时、储蓄罐给金币、倍率楼增倍率；三个时钟／储蓄罐可混合成倍率楼。混凝土不能喂，靠合成清除，三块混凝土变猫。</p><p><b>⑤ 金属喂怪发动能力</b><br>蓝：稳住高塔；红：安抚减速；绿：双倍合成；黄：十倍分数。</p><p>点击选中楼层后，也可用键盘 ← → 投喂。</p></div>`,[{label:'知道了，继续',run:resume}],'HOW TO PLAY');
document.addEventListener('visibilitychange',()=>{if(document.hidden&&game.phase==='playing'&&!paused)pause();});
function frame(now){const realdt=Math.min((now-previous)/1000,.05);previous=now;const dt=paused?0:realdt;if(dt){elapsed+=dt;game.tick(dt);const due=tasks.filter(t=>t.at<=elapsed);tasks=tasks.filter(t=>t.at>elapsed);due.forEach(t=>t.fn());if(game.phase==='ended'&&!endedShown){endedShown=true;view.shake=game.resultReason==='tower'?15:0;schedule(.6,end);}}
 view.update(dt,game.tilt,game.phase==='ended');for(const b of hitboard.children){const o=view.items.get(Number(b.dataset.id));if(o){b.style.top=(o.y-STEP/2)/H*100+'%';b.style.left=(W/2+o.x-88)/W*100+'%';}}
 scoreShown+=(game.score-scoreShown)*Math.min(1,realdt*9);$('#score').textContent=Math.round(scoreShown).toLocaleString();$('#score').style.fontSize=game.score>=100000000?'5.9cqw':'8cqw';$('#coins').textContent='金币 '+game.coins;$('#multiplier').textContent='×'+game.multiplier;$('#chain').textContent='CHAIN ×'+game.chain;
 const t=game.remaining;$('#timer').innerHTML=game.mode==='practice'?'∞ <span>练习</span>':`${Math.floor(t/60).toString().padStart(2,'0')}:${Math.floor(t%60).toString().padStart(2,'0')}<span>.${Math.floor(t%1*100).toString().padStart(2,'0')}</span>`;$('.timer').classList.toggle('urgent',game.mode!=='practice'&&t<15);
 game.monsters.forEach((m,i)=>{const good=100-m.anger;$('#mood'+i).style.width=good+'%';$('#mood'+i).style.background=m.anger>65?'linear-gradient(#ff9a68,#ee4761)':'linear-gradient(#c7ed64,#45b86b)';$('#status'+i).textContent=m.power>0?`${powers[m.color]} ${Math.ceil(m.power)}s`:`${m.anger>65?'生气了！':'想吃'}${cn[m.color]}`;$('#monster'+i).classList.toggle('angry',m.anger>75);$('#monster'+i).classList.toggle('powered',m.power>0);});
 $('#power-banner').textContent=game.mega>0?`★ MEGA ZONE · ${Math.ceil(game.mega)}s ★`:game.monsters.filter(m=>m.power>0).map(m=>`${powers[m.color]} ${Math.ceil(m.power)}s`).join('  +  ');stage.classList.toggle('mega',game.mega>0);stage.dataset.phase=paused?'paused':game.phase;stage.dataset.score=game.score;stage.dataset.chain=game.chain;stage.dataset.matches=game.matches;stage.dataset.floors=game.floors.map(f=>f.type).join(',');
 requestAnimationFrame(frame);
}
reset();$('#loading').remove();requestAnimationFrame(frame);
