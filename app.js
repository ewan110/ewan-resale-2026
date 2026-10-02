const KEY="ewan_resale_v5_data";
const initial={
 goal:1000,cash:22.01,vintedAvailable:22.01,vintedPending:119,printer:23,
 pokemonTotal:481.93,
 stock:[
  {name:"Lacoste gris",buy:14.43,target:31},
  {name:"RL gris torsadé",buy:23.80,target:69},
  {name:"RL blanc torsadé",buy:27.39,target:69},
  {name:"RL blanc torsadé",buy:25.60,target:69},
  {name:"RL blanc torsadé — NWT",buy:26.65,target:79},
  {name:"RL bleu torsadé",buy:24.53,target:69},
  {name:"Polo RL gris S",buy:25.65,target:69}
 ],
 sales:[
  {name:"Zara jeans",buy:10.15,sell:24},
  {name:"Under Armour running",buy:10.21,sell:22},
  {name:"Pull Lacoste",buy:13.38,sell:31.50},
  {name:"Ralph Lauren T-shirt",buy:7.99,sell:2},
  {name:"Ralph Lauren T-shirt",buy:7.73,sell:20},
  {name:"Under Armour T-shirt",buy:8.09,sell:14},
  {name:"Under Armour rose",buy:9.88,sell:18},
  {name:"Carhartt / pull noir",buy:17.54,sell:36}
 ],
 purchases:[
  {name:"Zara jeans",amount:10.15},{name:"Under Armour running",amount:10.21},{name:"Pull Lacoste",amount:13.38},
  {name:"RL T-shirt",amount:7.99},{name:"RL T-shirt",amount:7.73},{name:"Under Armour T-shirt",amount:8.09},
  {name:"Under Armour rose",amount:9.88},{name:"Carhartt / pull noir",amount:17.54},
  {name:"Lacoste gris",amount:14.43},{name:"RL gris torsadé",amount:23.80},{name:"RL blanc torsadé",amount:27.39},
  {name:"RL blanc torsadé",amount:25.60},{name:"RL blanc torsadé NWT",amount:26.65},{name:"RL bleu torsadé",amount:24.53},
  {name:"Polo RL gris S",amount:25.65},{name:"Imprimante thermique",amount:23}
 ]
};
let d=load();
function load(){try{return {...initial,...JSON.parse(localStorage.getItem(KEY)||"{}")}}catch(e){return initial}}
function save(){localStorage.setItem(KEY,JSON.stringify(d));render()}
const euro=n=>Number(n||0).toLocaleString("fr-FR",{minimumFractionDigits:2,maximumFractionDigits:2})+" €";
function render(){
 const stockInvest=d.stock.reduce((s,x)=>s+x.buy,0), target=d.stock.reduce((s,x)=>s+x.target,0);
 const salesClothing=d.sales.reduce((s,x)=>s+x.sell,0), pct=Math.min(100,d.pokemonTotal+salesClothing>0?((d.pokemonTotal+salesClothing)/d.goal)*100:0);
 document.getElementById("total").textContent=euro(d.pokemonTotal+salesClothing);
 document.getElementById("salesTotal").textContent=euro(salesClothing);
 document.getElementById("pokemonTotal").textContent=euro(d.pokemonTotal);
 document.getElementById("stockCount").textContent=d.stock.length;
 document.getElementById("investments").textContent=euro(d.purchases.reduce((s,x)=>s+x.amount,0));
 document.getElementById("cash").textContent=euro(d.cash);
 document.getElementById("vintedAvailable").textContent=euro(d.vintedAvailable);
 document.getElementById("vintedPending").textContent=euro(d.vintedPending);
 document.getElementById("printer").textContent=euro(d.printer);
 document.getElementById("pct").textContent=pct.toFixed(2).replace(".",",")+" %";
 document.getElementById("bar").style.width=pct+"%";
 document.getElementById("remaining").textContent=euro(Math.max(0,d.goal-(d.pokemonTotal+salesClothing)));
 document.getElementById("stockList").innerHTML=d.stock.length?d.stock.map((x,i)=>`<div class="item"><div class="row"><span>${esc(x.name)}</span><b>${euro(x.target)}</b></div><div class="muted">Achat ${euro(x.buy)} · Marge cible ${euro(x.target-x.buy)}</div><button class="btn red" style="margin-top:8px" onclick="removeStock(${i})">Retirer</button></div>`).join(""):"<span class='muted'>Stock vide</span>";
 document.getElementById("salesList").innerHTML=d.sales.map((x,i)=>`<div class="item"><div class="row"><span>${esc(x.name)}</span><b>${euro(x.sell)}</b></div><div class="muted">Achat ${euro(x.buy)} · Bénéfice ${euro(x.sell-x.buy)}</div></div>`).join("");
 document.getElementById("purchaseList").innerHTML=d.purchases.map(x=>`<div class="item"><div class="row"><span>${esc(x.name)}</span><b>${euro(x.amount)}</b></div></div>`).join("");
 document.getElementById("pokemonPanel").innerHTML=`<div class="row"><span>Cumul Pokémon</span><b>${euro(d.pokemonTotal)}</b></div><div class="row" style="margin-top:10px"><span>Stock Pokémon</span><b>0 €</b></div>`;
 if(document.getElementById("setCash")){setCash.value=d.cash;setVinted.value=d.vintedAvailable;setPending.value=d.vintedPending}
}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
function show(id){document.querySelectorAll("section").forEach(s=>s.classList.add("hidden"));document.getElementById(id).classList.remove("hidden");render();scrollTo(0,0)}
function removeStock(i){if(confirm("Retirer cet article du stock ?")){d.stock.splice(i,1);save()}}
function openAdd(type){
 show("modal");
 const title={stock:"Ajouter un article",sale:"Ajouter une vente",purchase:"Ajouter un achat",pokemon:"Ajouter une vente Pokémon"}[type];
 modalTitle.textContent=title;
 form.innerHTML=`<label>Nom<input id="fName" class="input"></label><label>Montant achat<input id="fBuy" class="input" type="number" step=".01"></label>${type==="stock"?'<label>Prix de revente cible<input id="fTarget" class="input" type="number" step=".01"></label>':type==="sale"?'<label>Prix de vente<input id="fSell" class="input" type="number" step=".01"></label>':''}<button class="btn" onclick="add('${type}')">Enregistrer</button> <button class="btn dark" onclick="show('home')">Annuler</button>`;
}
function add(type){
 const name=fName.value.trim(),buy=Number(fBuy?.value||0);
 if(!name)return alert("Nom obligatoire");
 if(type==="stock")d.stock.push({name,buy,target:Number(fTarget.value||0)});
 if(type==="sale")d.sales.push({name,buy,sell:Number(fSell.value||0)});
 if(type==="purchase")d.purchases.push({name,amount:buy});
 if(type==="pokemon")d.pokemonTotal+=buy;
 save();show(type==="stock"?"stock":type==="sale"?"sales":type==="purchase"?"purchases":"pokemon");
}
function saveSettings(){d.cash=Number(setCash.value||0);d.vintedAvailable=Number(setVinted.value||0);d.vintedPending=Number(setPending.value||0);save();show("home")}
render();
