import{d as W,r as y,e as l,c as u,H as ne,I as be,b as s,J as pe,m,t as we,F as D,j as ye,y as xe,n as R,v as P,C as E,x,p as re,q as de,s as ue,K as ke,h as V,L as se,k as z,w as ge,M as Se,N as $e,T as Te,O as Ce,z as je,A as Ae,D as Pe}from"./index.7b360bb2.js";import{g as Me,M as q,F as K,_ as fe,a as G,V as J,h as Ie,j as le,k as Z,b as L,f as Oe,l as Ve,u as Fe,e as Be,m as Ee,n as Ne}from"./usePeek.4328d498.js";const Le={class:"flex flex-wrap justify-end rounded-lg bg-stone-200 m-2 p-2 rounded md:shadow-md"},Re=["onKeypress"],De={class:"flex items-center"},Ue={class:"flex"},We=s("div",{class:"icon icon-base bg-stone-500 i-mdi:paperclip"},null,-1),He=[We],Ke=["disabled"],ze=W({__name:"ChatInput",emits:["sendText","sendFile"],setup(e,{emit:o}){const n=y(""),a=()=>{n.value.length!==0&&(o("sendText",n.value),n.value="")},{showFilePicker:f,handleFileDrop:c}=Me({onChange:d=>{o("sendFile",d)}});return(d,t)=>(l(),u("div",Le,[ne(s("input",{"onUpdate:modelValue":t[0]||(t[0]=r=>n.value=r),autofocus:"",class:"flex-1 bg-transparent outline-none",maxlength:"500",type:"text",placeholder:"Type here",onKeypress:pe(a,["enter"])},null,40,Re),[[be,n.value]]),s("div",De,[s("div",Ue,[s("button",{class:"icon-contrast-button mr-2",onClick:t[1]||(t[1]=r=>m(f)())},He)]),s("button",{class:"primary-button",disabled:n.value.length===0,onClick:a},"send",8,Ke)])]))}});var Ge=typeof global=="object"&&global&&global.Object===Object&&global;const qe=Ge;var Je=typeof self=="object"&&self&&self.Object===Object&&self,Xe=qe||Je||Function("return this")();const ve=Xe;var Ye=ve.Symbol;const X=Ye;var me=Object.prototype,Qe=me.hasOwnProperty,Ze=me.toString,N=X?X.toStringTag:void 0;function et(e){var o=Qe.call(e,N),n=e[N];try{e[N]=void 0;var a=!0}catch{}var f=Ze.call(e);return a&&(o?e[N]=n:delete e[N]),f}var tt=Object.prototype,nt=tt.toString;function ot(e){return nt.call(e)}var st="[object Null]",lt="[object Undefined]",ae=X?X.toStringTag:void 0;function at(e){return e==null?e===void 0?lt:st:ae&&ae in Object(e)?et(e):ot(e)}function it(e){return e!=null&&typeof e=="object"}var ct="[object Symbol]";function rt(e){return typeof e=="symbol"||it(e)&&at(e)==ct}var dt=/\s/;function ut(e){for(var o=e.length;o--&&dt.test(e.charAt(o)););return o}var ft=/^\s+/;function vt(e){return e&&e.slice(0,ut(e)+1).replace(ft,"")}function oe(e){var o=typeof e;return e!=null&&(o=="object"||o=="function")}var ie=0/0,mt=/^[-+]0x[0-9a-f]+$/i,ht=/^0b[01]+$/i,_t=/^0o[0-7]+$/i,bt=parseInt;function ce(e){if(typeof e=="number")return e;if(rt(e))return ie;if(oe(e)){var o=typeof e.valueOf=="function"?e.valueOf():e;e=oe(o)?o+"":o}if(typeof e!="string")return e===0?e:+e;e=vt(e);var n=ht.test(e);return n||_t.test(e)?bt(e.slice(2),n?2:8):mt.test(e)?ie:+e}var pt=function(){return ve.Date.now()};const ee=pt;var wt="Expected a function",yt=Math.max,xt=Math.min;function kt(e,o,n){var a,f,c,d,t,r,h=0,k=!1,w=!1,i=!0;if(typeof e!="function")throw new TypeError(wt);o=ce(o)||0,oe(n)&&(k=!!n.leading,w="maxWait"in n,c=w?yt(ce(n.maxWait)||0,o):c,i="trailing"in n?!!n.trailing:i);function b(_){var $=a,A=f;return a=f=void 0,h=_,d=e.apply(A,$),d}function v(_){return h=_,t=setTimeout(T,o),k?b(_):d}function p(_){var $=_-r,A=_-h,Q=o-$;return w?xt(Q,c-A):Q}function S(_){var $=_-r,A=_-h;return r===void 0||$>=o||$<0||w&&A>=c}function T(){var _=ee();if(S(_))return I(_);t=setTimeout(T,p(_))}function I(_){return t=void 0,i&&a?b(_):(a=f=void 0,d)}function O(){t!==void 0&&clearTimeout(t),h=0,a=r=f=t=void 0}function j(){return t===void 0?d:I(ee())}function C(){var _=ee(),$=S(_);if(a=arguments,f=this,r=_,$){if(t===void 0)return v(r);if(w)return clearTimeout(t),t=setTimeout(T,o),b(r)}return t===void 0&&(t=setTimeout(T,o)),d}return C.cancel=O,C.flush=j,C}const H=e=>(re("data-v-3c7d874a"),e=e(),de(),e),gt={key:0,class:"bubble"},St={key:0,class:"bubble"},$t=["src"],Tt={key:1,class:"flex items-center"},Ct=H(()=>s("div",{class:"i-mdi:image w-4 h-4"},null,-1)),jt={key:1,class:"bubble"},At=["src"],Pt={key:1,class:"flex items-center"},Mt=H(()=>s("div",{class:"i-mdi:play-box w-4 h-4"},null,-1)),It={key:2,class:"bubble"},Ot=["src"],Vt={key:1,class:"flex items-center"},Ft=H(()=>s("div",{class:"i-mdi:music-box w-4 h-4"},null,-1)),Bt={key:3,class:"bubble"},Et=["href","download"],Nt=H(()=>s("div",{class:"i-mdi:file w-4 h-4 mr-1"},null,-1)),Lt={key:1,class:"flex items-center"},Rt=H(()=>s("div",{class:"i-mdi:file"},null,-1)),Dt=W({__name:"ChatList",props:{list:null},setup(e){const o=e,n=c=>{if(c instanceof Blob)return URL.createObjectURL(c);const d=new Blob([new Uint8Array(c).buffer]);return URL.createObjectURL(d)},a=y(),f=kt(()=>{xe(()=>{var c,d;(d=(c=a.value)==null?void 0:c.lastElementChild)==null||d.scrollIntoView({behavior:"smooth"})})},100);return we(()=>o.list.length,f),(c,d)=>(l(),u("div",{ref_key:"listEl",ref:a,class:"w-full h-full overflow-y-scroll pt-2"},[(l(!0),u(D,null,ye(e.list,(t,r)=>(l(),u("div",{key:t.id,class:R(["flex my-2 chat-item items-end",[t.byMe?"sended":"received"]])},[t.type===m(q).Text?(l(),u("div",gt,P(t.value),1)):t.type===m(q).File?(l(),u(D,{key:1},[t.fileType===m(K).Image?(l(),u("div",St,[t.received||t.byMe?(l(),u("img",{key:0,src:n(t.value),alt:""},null,8,$t)):(l(),u("div",Tt,[Ct,E(P(t.fileName),1)]))])):t.fileType===m(K).Video?(l(),u("div",jt,[t.received||t.byMe?(l(),u("video",{key:0,controls:"",src:n(t.value),alt:""},null,8,At)):(l(),u("div",Pt,[Mt,E(P(t.fileName),1)]))])):t.fileType===m(K).Audio?(l(),u("div",It,[t.received||t.byMe?(l(),u("audio",{key:0,controls:"",src:n(t.value),alt:""},null,8,Ot)):(l(),u("div",Vt,[Ft,E(P(t.fileName),1)]))])):t.fileType===m(K).File?(l(),u("div",Bt,[t.received||t.byMe?(l(),u("a",{key:0,class:"flex items-center rounded bg-white px-2 py-1 shadow",href:n(t.value),download:t.fileName,target:"_blank"},[Nt,E(P(t.fileName),1)],8,Et)):(l(),u("div",Lt,[Rt,E(P(t.fileName),1)]))])):x("",!0)],64)):x("",!0),s("div",{class:R(["bg-gray mx-1",[t.received?"i-mdi:check-circle-outline":"i-mdi:checkbox-blank-circle-outline"]])},null,2)],2))),128))],512))}});const Ut=fe(Dt,[["__scopeId","data-v-3c7d874a"]]);var g=(e=>(e.Camera="Camera",e.Screen="Screen",e.Microphone="Microphone",e))(g||{});const he={income:void 0,name:void 0,answered:!1,type:void 0,localStream:void 0,remoteStream:void 0},U={onAccept:()=>{},onCancel:()=>{},onStop:()=>{},onReject:()=>{}},B=y({...he}),te=y(),Y=y(!1);let F;const M=()=>{Y.value=!1,B.value={...he,...U},F==null||F()},Wt=(e,o)=>(Y.value=!0,{actionAccepted:new Promise((c,d)=>{B.value={income:!0,name:o,answered:!1,type:e,localStream:void 0,remoteStream:void 0,...U,onAccept:()=>{c(!0)},onReject:()=>{c(!1)}},F=d}),shiftToAnswerView:(c,d)=>new Promise((t,r)=>{F=r,B.value={income:!0,name:o,answered:!0,type:e,localStream:d,remoteStream:c,...U,onAccept:()=>{t()},onStop:()=>{t(),M()}}}),closePanel:()=>{M()}}),Ht=(e,o,n,a)=>(Y.value=!0,B.value={income:!1,name:o,answered:!1,type:e,localStream:n,remoteStream:void 0,...U,onCancel:()=>{console.log("terminate call"),a==null||a(),M()}},{shiftToAnswerView:d=>new Promise((r,h)=>{F=h,B.value={income:!1,name:o,answered:!0,type:e,localStream:n,remoteStream:d,...U,onAccept:()=>{},onStop:()=>{r(),M()},onCancel:()=>{h(),M()}}}),closePanel:()=>{M()}}),_e=e=>(re("data-v-8f50f7e2"),e=e(),de(),e),Kt={class:"call-panel w-full h-full backdrop-filter backdrop-blur rounded fixed top-0 flex place-center"},zt={class:"w-full h-full md:max-w-800px md:max-h-800px flex flex-col justify-between items-center pt-20 relative"},Gt={key:0,class:"text-lg font-semibold"},qt={key:1,class:"text-lg"},Jt={key:2,class:"w-full h-full flex justify-center items-center"},Xt={class:"relative w-full"},Yt={class:"relative"},Qt=_e(()=>s("div",{class:"i-mdi:phone-hangup w-8 h-8 bg-white"},null,-1)),Zt=[Qt],en=_e(()=>s("div",{class:"i-mdi:phone w-8 h-8 bg-white"},null,-1)),tn=[en],nn=W({__name:"CallPanel",props:{income:{type:[Boolean,null]},name:null,answered:{type:[Boolean,null]},type:null,localStream:null,remoteStream:null,receiver:null,mute:{type:Boolean},videoSource:null},emits:["toggleMute","switchVideo"],setup(e,{emit:o}){const n=e,a=w=>{switch(w){case g.Camera:return"video call";case g.Screen:return"screen share";case g.Microphone:return"phone call";default:return""}},f=ue(()=>n.income&&!n.answered),c=()=>{if(n.answered){o("stop");return}if(n.income){o("reject");return}o("cancel")},d=()=>{o("accept")},t=y(!0),r=()=>{t.value=!t.value},h=y(),k=y();return ke(()=>{h.value&&n.localStream&&(h.value.srcObject=n.localStream,h.value.play()),k.value&&n.remoteStream&&(k.value.srcObject=n.remoteStream,k.value.play())}),(w,i)=>(l(),u("div",Kt,[s("div",zt,[(!e.answered||!e.type)&&e.name?(l(),V(G,{key:0,name:e.name,class:"w-32 h-32"},null,8,["name"])):x("",!0),e.answered?x("",!0):(l(),u(D,{key:1},[e.income?(l(),u("div",Gt,"Invites you to join "+P(a(e.type)),1)):(l(),u("div",qt,"Waiting for answered"))],64)),e.answered?(l(),u("div",Jt,[s("div",{class:R(["video-view",{front:t.value}]),onClick:r},[s("div",Xt,[s("video",{ref_key:"otherVideoEl",ref:k,playsinline:"",class:"flex-1 w-full h-full rounded shadow-md"},null,512),e.name?(l(),V(G,{key:0,class:"w-10 absolute bottom-1 left-1 text-xs",name:e.name},null,8,["name"])):x("",!0)])],2),s("div",{class:R(["video-view w-full",{front:!t.value}]),onClick:r},[s("div",Yt,[ne(s("video",{ref_key:"selfVideoEl",ref:h,playsinline:"",class:"flex-1 w-full h-full rounded shadow-md"},null,512),[[se,e.videoSource!==m(J).Display]]),e.name?(l(),V(G,{key:0,class:"w-10 h-10 absolute bottom-1 left-1 text-xs",name:"me"})):x("",!0)]),ne(s("div",null,null,512),[[se,e.videoSource===m(J).Display]])],2)])):x("",!0),s("div",{class:R(["absolute bottom-20 flex w-full justify-between px-20 md:px-[30%] transition-all z-10",{"!px-[calc(50%-28px)]":!m(f)}])},[s("button",{class:"bg-red rounded-full w-14 h-14 flex-shrink-0 backdrop-filter backdrop-blur transition-all hover:scale-110 active:!scale-120 flex place-center",onClick:c},Zt),m(f)?(l(),u("button",{key:0,class:"bg-green rounded-full w-14 h-14 flex-shrink-0 backdrop-filter backdrop-blur transition-all hover:scale-110 active:!scale-120 flex place-center",onClick:d},tn)):x("",!0)],2)])]))}});const on=fe(nn,[["__scopeId","data-v-8f50f7e2"]]),sn=W({__name:"CallPanelProvider",setup(e,{expose:o}){const n=i=>i===g.Camera?[J.Facial,void 0]:i===g.Screen?[J.Display,void 0]:[void 0,void 0],a=y();let f;Ie({onBeRequest:async(i,b,{type:v,name:p})=>{try{const{closePanel:S,shiftToAnswerView:T,actionAccepted:I}=Wt(v,p);if(!await I){b(),S();return}const j=n(v);r.value=j[0],h.value=Boolean(j[1]);const C=v===g.Screen?void 0:(await le(...j)).stream,{remoteStream:_,close:$}=i(C),A=T(_,C);try{await A,$()}catch{console.log("connection was hanged up by other side"),S()}C&&Z(C)}catch{b()}},onClose:()=>{f==null||f(),M()}});const{userInfo:c}=Oe(),{callPlugin:d}=Ve();o({call:async i=>{L("Call",i,"Start");const b=n(i);r.value=b[0],h.value=Boolean(b[1]),a.value=await le(...b),L("Call",i,"Stream_Success");const v=a.value.stream,{shiftToAnswerView:p,closePanel:S}=Ht(i,c.name,v,()=>{f==null||f()}),{stop:T,answered:I}=d.call(v,{type:i,name:c.name},i!==g.Screen);f=()=>{T(),Z(v)};let O=-1;try{const j=await I;O=Date.now(),L("Call",i,"Connect_Success"),await p(j),T()}catch{console.log("connection was hanged up by other side"),S()}O!==-1&&L("Call",i,`Connect_Duration_${((Date.now()-O)/1e3).toFixed(2)}`),Z(v)}});const r=y(),h=y(!1),k=async()=>{var i;await((i=a.value)==null?void 0:i.switchAudio(!h.value)),h.value=!h.value},w=async i=>{var b;await((b=a.value)==null?void 0:b.switchVideo(i)),r.value=i};return(i,b)=>(l(),V(Ce,{to:"body"},[z(Te,{name:"slide"},{default:ge(()=>[m(Y)?(l(),V(on,Se({key:0},m(B),{receiver:m(te),"onUpdate:receiver":b[0]||(b[0]=v=>$e(te)?te.value=v:null),"video-source":r.value,mute:h.value,onToggleMute:k,onSwitchVideo:w}),null,16,["receiver","video-source","mute"])):x("",!0)]),_:1})]))}}),ln={class:"w-full h-full flex place-center"},an={class:"w-full h-full md:max-w-800px md:max-h-800px flex flex-col"},cn={class:"flex place-center p-2 rounded md:shadow-md"},rn=s("div",{class:"icon icon-base i-mdi:arrow-left"},null,-1),dn=[rn],un={class:"flex-1 flex justify-center items-center"},fn={class:"flex-1 flex justify-end"},vn=s("div",{class:"icon icon-base i-mdi:laptop"},null,-1),mn=[vn],hn=s("div",{class:"icon icon-base i-mdi:phone"},null,-1),_n=[hn],bn=s("div",{class:"icon icon-base i-mdi:video"},null,-1),pn=[bn],wn={class:"flex-1 overflow-y-hidden mb-2"},kn=W({__name:"Chat",setup(e){var b;const{info:o,peek:n}=Fe(),a=ue(()=>{var v;return(v=o.value)==null?void 0:v.connectors[0]}),{messageList:f,messagePlugin:c}=Ne(),d=v=>{r.value||c.send(q.Text,v)},t=v=>{r.value||c.send(q.File,v)},r=y(!1);(b=n.connectionManager.getAll()[0])==null||b.once("close",()=>{je({content:"Connection closed",type:"warning"}),r.value=!0});const h=Pe(),k=async()=>{try{await Ae({selections:[{label:"No",value:!1},{label:"Yes",value:!0}],content:"Are you sure to stop this conversation? All messages will be lost.",showClose:!0,modalClose:!0})&&(n.connectionManager.getAll()[0].close(),h.replace("/"))}catch{}},w=y(),i=v=>{var p;r.value||((p=w.value)==null||p.call(v),L("Call",v,"Start"))};return(v,p)=>(l(),u(D,null,[s("div",ln,[s("div",an,[s("div",cn,[s("div",{class:"flex-1 flex justify-start"},[s("button",{class:"icon-button",onClick:k},dn)]),s("div",un,[m(a)?(l(),V(G,{key:0,preview:"",name:m(a).name,class:"h-10 !text-xs"},null,8,["name"])):x("",!0)]),s("div",fn,[m(Be)?(l(),u(D,{key:0},[m(Ee)?(l(),u("button",{key:0,class:"icon-button mr-1 md:mr-2",title:"share screen",onClick:p[0]||(p[0]=S=>i(m(g).Screen))},mn)):x("",!0),s("button",{class:"icon-button mr-1 md:mr-2",title:"audio call",onClick:p[1]||(p[1]=S=>i(m(g).Microphone))},_n),s("button",{class:"icon-button",title:"video call",onClick:p[2]||(p[2]=S=>i(m(g).Camera))},pn)],64)):x("",!0)])]),s("div",wn,[z(Ut,{class:"px-2",list:m(f)},null,8,["list"])]),z(ze,{onSendText:d,onSendFile:t})])]),z(m(sn),{ref_key:"callPanelProvider",ref:w},null,512)],64))}});export{kn as default};