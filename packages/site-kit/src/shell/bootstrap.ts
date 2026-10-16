/**
 * Inline bootstrap scripts.
 *
 * They live in their own module, with no React, StyleX or CSS imports, so the
 * navigation logic can be exercised by a plain unit test (the shell itself pulls
 * in the compiled stylesheet and cannot run outside the bundler).
 */

/** Applied to `<html>` by the theme bootstrap when no stored preference exists. */
export const THEME_DEFAULT = 'system'

/**
 * Theme bootstrap, inlined in `<head>`.
 *
 * Runs before the first paint, because a wrong `data-theme` flashes light on
 * dark. It only touches `document.documentElement`, so it is safe to run before
 * the body exists.
 */
export const themeBootstrap = `(function(){try{
var s=localStorage.getItem('theme');
var d=window.matchMedia('(prefers-color-scheme: dark)').matches;
document.documentElement.dataset['theme']=s==='dark'||s==='light'?s:(d?'dark':'light');
}catch(e){}})()`

/**
 * Language switch, inlined in `<head>` and applied once the document is parsed.
 *
 * The switch keeps the visitor on the same page of the paired site, and the
 * current path is only known in the browser: Waku does not hand a layout the
 * request path, so the server renders the paired site's home page as the
 * fallback href. The same pass marks the current menu entry, which the navbar
 * cannot do on the server for the same reason.
 *
 * Both steps wait for `DOMContentLoaded` — a script in `<head>` runs before the
 * elements it queries exist. Without JavaScript the fallback href and the
 * unmarked menu are what remains, and both are still usable.
 */
export const navigationBootstrap = `(function(){
var norm=function(p){var t=p.replace(/\\/+$/,'');return t.length>0?t:'/'};
var apply=function(){try{
var path=location.pathname;
var links=document.querySelectorAll('a[data-alt-site]');
for(var i=0;i<links.length;i++){
var base=links[i].getAttribute('data-alt-site');
if(!base)continue;
var hasExt=/\\.[a-z0-9]+$/i.test(path);
var p=path.charAt(path.length-1)==='/'||hasExt?path:path+'/';
links[i].setAttribute('href',base.replace(/\\/$/,'')+(p.charAt(0)==='/'?p:'/'+p)+location.search+location.hash);
}
var nav=document.querySelectorAll('#nav-menu a');
for(var j=0;j<nav.length;j++){
var raw=nav[j].getAttribute('href')||'';
if(raw.indexOf('#')>=0)continue;
var to=norm(raw);
var current=to==='/'?norm(path)==='/':norm(path)===to||norm(path).indexOf(to+'/')===0;
if(current)nav[j].setAttribute('aria-current','page');
}}catch(e){}};
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',apply)}else{apply()}
})()`
