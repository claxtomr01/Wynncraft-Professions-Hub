/* Experimental crafting engine. Formula is explicitly illustrative, not Wynncraft-verified. */
export const PROFESSIONS=["Scribing","Jeweling","Cooking","Alchemy","Weaponsmithing","Woodworking","Armouring","Tailoring"];
export const SLOT_COUNT=6;
export function eligible(item,profession,level){return Array.isArray(item.professions)&&item.professions.includes(profession)&&Number(item.level)<=level}
export function simulate(slots,lookup,{profession,level=132,materialCost=0}={}){
 if(slots.length!==6)throw Error("Exactly six slots required");
 const items=slots.map(id=>id?lookup.find(i=>i.id===id):null);
 for(const item of items)if(item&&!eligible(item,profession,level))throw Error("Ingredient incompatible with profession or level");
 const stats={},effects=Array(6).fill(100),warnings=[];
 // Each imported ingredient may define a 6-element effectiveness array (percentage points).
 // These are generic illustrative multipliers; actual Wynncraft interactions require validation.
 items.forEach((item,i)=>{if(!item)return;const modifiers=item.effectiveness||[];for(let j=0;j<6;j++)effects[j]+=Number(modifiers[j]||0)});
 items.forEach((item,i)=>{if(!item)return;for(const [key,val] of Object.entries(item.stats||{}))stats[key]=(stats[key]||0)+Number(val||0)*effects[i]/100});
 const cost=items.reduce((s,i)=>s+Number(i?.price||0),Number(materialCost)||0);
 if(items.some(i=>i&&(!Array.isArray(i.effectiveness))))warnings.push("Some ingredient effectiveness modifiers are unknown");
 return {slots:[...slots],names:items.map(i=>i?.name||"Empty"),stats,effectiveness:effects,cost,warnings,verified:false};
}
export function optimize(items,{profession,level=132,stat="xpBonus",budget=0,beamWidth=120,results=10,locked=Array(6).fill(""),excluded=[]}={}){
 const pool=items.filter(i=>eligible(i,profession,level)&&!excluded.includes(i.id));
 if(locked.some((id,i)=>id&&!pool.some(p=>p.id===id)))throw Error("A locked ingredient is unavailable for this profession or level");
 const candidates=[...pool].sort((a,b)=>Number(b.stats?.[stat]||0)-Number(a.stats?.[stat]||0)).slice(0,80);
 let beam=[{slots:[],score:0,cost:0}];
 for(let pos=0;pos<6;pos++){
   const next=[];
   const options=locked[pos]?[pool.find(i=>i.id===locked[pos])]:candidates;
   for(const state of beam)for(const item of options){
     const cost=state.cost+Number(item.price||0);if(budget>0&&cost>budget)continue;
     const slots=[...state.slots,item.id];
     // Heuristic only; final ordering uses full simulated stats.
     const score=state.score+Number(item.stats?.[stat]||0);
     next.push({slots,score,cost});
   }
   next.sort((a,b)=>b.score-a.score||a.cost-b.cost);
   const unique=new Set();beam=[];
   for(const candidate of next){const key=candidate.slots.join("|");if(!unique.has(key)){unique.add(key);beam.push(candidate)}if(beam.length>=beamWidth)break}
   if(!beam.length)break;
 }
 return beam.map(b=>simulate(b.slots,items,{profession,level})).sort((a,b)=>(b.stats[stat]||0)-(a.stats[stat]||0)||a.cost-b.cost).slice(0,results);
}
