/* GoodSaenz cart PREVIEW 0.1: temporary, same-tab session storage only.
 * This is NOT a payment or order-submission system. DO NOT put secret keys here.
 * Before publishing a live checkout, migrate personalized item data to
 * authenticated/secure Azure-side cart storage; price validation belongs server-side.
 */
(function(global){
  'use strict';
  const KEY='goodsaenz-cart-preview-v1';
  const PRICES={clear:{engrave:40,single:60,multi:80},color:{engrave:50,single:70,multi:90},special:{engrave:60,single:80,multi:100}};
  const SHAPES={cloud:'Cloud',flowers:'Flower bouquet',western:'Cowboy boot & hat',basketball:'Basketball',heart:'Heart',butterfly:'Butterfly',custom:'Fully custom design'};
  const PLATES={clear:'Clear acrylic',color:'Translucent acrylic',special:'Specialty acrylic'};
  const FINISHES={engrave:'Engrave only',single:'Single-color UV resin',multi:'Multicolor UV resin'};
  function uid(){return(global.crypto && typeof global.crypto.randomUUID==='function')?global.crypto.randomUUID():'lamp-'+Date.now()+'-'+Math.random().toString(36).slice(2,9)}
  function safeLoad(){try{const data=JSON.parse(sessionStorage.getItem(KEY)||'[]');return Array.isArray(data)?data:[]}catch{return []}}
  let records=safeLoad();
  function save(){sessionStorage.setItem(KEY,JSON.stringify(records));renderBadges();global.dispatchEvent(new CustomEvent('goodsaenz:cart-changed',{detail:{count:count()}}));}
  function count(){return records.reduce((sum,item)=>sum+(Number(item.quantity)||1),0)}
  function priced(item){
    if(item.design==='custom'||(item.plate!=='clear'&&item.plateColor==='other')||(item.finish!=='engrave'&&item.fillColors?.includes('other')))return null;
    return PRICES[item.plate]?.[item.finish]??null;
  }
  function normalize(item){
    const result={...item};
    result.id=String(item.id||uid());
    result.quantity=Math.min(20,Math.max(1,Number.parseInt(item.quantity,10)||1));
    result.design=Object.hasOwn(SHAPES,item.design)?item.design:'custom';
    result.plate=Object.hasOwn(PLATES,item.plate)?item.plate:'clear';
    result.finish=Object.hasOwn(FINISHES,item.finish)?item.finish:'engrave';
    result.quote=priced(result)===null;
    result.kind='glow-lamp';
    // Never trust any client-provided price; always recalculate.
    delete result.unitPrice;
    delete result.price;
    return result;
  }
  function add(item){const normalized=normalize(item);records.push(normalized);save();return normalized.id}
  function update(id,item){let index=records.findIndex(x=>x.id===id);if(index<0)return false;records[index]=normalize({...item,id});save();return true}
  function remove(id){records=records.filter(x=>x.id!==id);save()}
  function changeQty(id,q){const v=Math.min(20,Math.max(1,Number.parseInt(q,10)||1));const item=records.find(x=>x.id===id);if(!item)return;item.quantity=v;save()}
  function get(id){const x=records.find(x=>x.id===id);return x?structuredClone(x):null}
  function list(){return records.map(x=>structuredClone(x))}
  function label(item){return SHAPES[item.design]||'Custom Glow Lamp'}
  function describe(item){const parts=[PLATES[item.plate]||item.plate,FINISHES[item.finish]||item.finish];if(item.design==='custom'){parts.push('Original design request')}else if(item.noName){parts.push('No personalized wording')}else if(item.name){parts.push('Lettering: '+item.name)}if(item.plate==='color'||item.plate==='special'){parts.push('Acrylic: '+(item.plateColor||item.specialType||'Not selected'))}if(item.finish!=='engrave'){parts.push('Fill colors: '+(item.fillColors||[]).join(', '))}if(item.quote)parts.push('Needs individual quote');return parts.join(' · ')}
  function renderBadges(){document.querySelectorAll('[data-cart-count]').forEach(el=>el.textContent=String(count()))}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',renderBadges);else renderBadges();
  global.GoodSaenzCart={add,update,remove,changeQty,get,list,count,priced,label,describe,PRICES,SHAPES,PLATES,FINISHES,renderBadges};
})(window);
