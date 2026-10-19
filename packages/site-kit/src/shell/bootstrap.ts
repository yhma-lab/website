/**
 * Inline bootstrap scripts, kept free of React and CSS imports so their browser
 * behavior can also be exercised by plain unit tests.
 */

/** Initial root-shell marker; the bootstrap resolves it to `light` or `dark`. */
export const THEME_DEFAULT = 'system'

/**
 * Resolve appearance before paint and retain it when React acquires <html>.
 * React clears singleton attributes on mount; valid user toggles remain authoritative.
 */
export const themeBootstrap = `(function(){
var root=document.documentElement,s,d=false;
var valid=function(value){return value==='dark'||value==='light'};
try{s=localStorage.getItem('theme')}catch(e){}
try{d=window.matchMedia('(prefers-color-scheme: dark)').matches}catch(e){}
var theme=valid(s)?s:(d?'dark':'light');
root.dataset['theme']=theme;
new MutationObserver(function(records){
var current=root.dataset['theme'];
if(valid(current)){theme=current;return}
for(var i=records.length-1;i>=0;i--){
var previous=records[i].oldValue;
if(valid(previous)){theme=previous;break}
}
root.dataset['theme']=theme;
}).observe(root,{attributes:true,attributeFilter:['data-theme'],attributeOldValue:true});
})()`

/**
 * The document is the sole owner of language hrefs and active navigation.
 * With SSR disabled, the RSC payload can mount or replace links after parsing.
 * Observe child lists only: our own href/aria-current writes cannot retrigger it.
 */
export const navigationBootstrap = `(function(){
var norm=function(p){var t=p.replace(/\\/+$/,'');return t.length>0?t:'/'};
var set=function(node,key,value){if(node.getAttribute(key)!==value)node.setAttribute(key,value)};
var apply=function(){
var path=location.pathname;
var currentPath=norm(path);
var links=document.querySelectorAll('a[data-alt-site]');
for(var i=0;i<links.length;i++){
var base=links[i].getAttribute('data-alt-site');
if(!base)continue;
var hasExt=/\\.[a-z0-9]+$/i.test(path);
var p=path.charAt(path.length-1)==='/'||hasExt?path:path+'/';
set(links[i],'href',base.replace(/\\/$/,'')+(p.charAt(0)==='/'?p:'/'+p)+location.search+location.hash);
}
var nav=document.querySelectorAll('#nav-menu a');
for(var j=0;j<nav.length;j++){
var raw=nav[j].getAttribute('href')||'';
var to=norm(raw);
var current=raw.indexOf('#')<0&&(to==='/'?currentPath==='/':currentPath===to||currentPath.indexOf(to+'/')===0);
if(current)set(nav[j],'aria-current','page');
else if(nav[j].hasAttribute('aria-current'))nav[j].removeAttribute('aria-current');
}
};
var relevant=function(node){return node.nodeType===1&&(node.matches('#nav-menu,a[data-alt-site]')||node.querySelector('#nav-menu,a[data-alt-site]'))};
new MutationObserver(function(records){
for(var i=0;i<records.length;i++){
var record=records[i];
if(record.target.nodeType===1&&record.target.closest('#nav-menu')){apply();return}
for(var j=0;j<record.addedNodes.length;j++){
if(relevant(record.addedNodes[j])){apply();return}
}
}
}).observe(document.documentElement,{childList:true,subtree:true});
window.addEventListener('hashchange',apply);
window.addEventListener('popstate',apply);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});
else apply();
})()`
