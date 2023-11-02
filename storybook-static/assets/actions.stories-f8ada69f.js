import{j as t}from"./jsx-runtime-ed146b25.js";import{u as O,R as E,a as v,b as I,c as u}from"./RoiProvider-d71e6690.js";import{r as w}from"./index-c6dae603.js";function a(){const e=O();return w.useMemo(()=>({createRoi:o=>{e({type:"CREATE_ROI",payload:o})},updateRoi:(o,d)=>{e({type:"UPDATE_ROI",payload:{...d,id:o}})},removeRoi:o=>{e({type:"REMOVE_ROI",payload:o})},setMode:o=>e({type:"SET_MODE",payload:o})}),[e])}const M=[{id:"0000-1111-2222-3333",x:0,y:0,width:.2,height:.2}],T={title:"Actions",decorators:[e=>t.jsx(E,{initialRois:M,children:t.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:5},children:[t.jsx(e,{}),t.jsx(v,{target:t.jsx(S,{}),children:t.jsx(I,{getStyle:(n,o)=>({style:{backgroundColor:o?"green":"darkgreen",opacity:o?.4:.6}})})})]})})]};function S(){return t.jsx("img",{src:"/barbara.jpg",style:{display:"block",width:"100%"}})}function i(){const{createRoi:e}=a();function n(){e({id:"abcd-efgh-ijkl-mnop",x:0,y:0,width:.2,height:.2})}return t.jsx("button",{onClick:n,children:"Add a new ROI"})}function r(){const{selectedRoi:e}=u(),{removeRoi:n}=a();return t.jsx("button",{onClick:()=>n(e),children:"Remove ROI"})}function c(){const{selectedRoi:e}=u(),{updateRoi:n}=a();return t.jsx("button",{onClick:()=>n(e,{y:.1}),children:"Update ROI"})}function s(e){const{type:n}=e,{createRoi:o,setMode:d}=a(),{mode:A}=u();w.useEffect(()=>{d(n)},[n]);function C(){o({id:"abcd-efgh-ijkl-mnop",x:0,y:0,width:.2,height:.2})}return t.jsxs("button",{onClick:C,children:["Add a new ROI with mode: ",A]})}s.argTypes={type:{control:"select",options:["draw","select"]}};s.args={type:"draw"};var p,R,l;i.parameters={...i.parameters,docs:{...(p=i.parameters)==null?void 0:p.docs,source:{originalSource:`function Add() {
  const {
    createRoi
  } = useRoiActions();
  function onClick() {
    createRoi({
      id: 'abcd-efgh-ijkl-mnop',
      x: 0,
      y: 0,
      width: 0.2,
      height: 0.2
    });
  }
  return <button onClick={onClick}>Add a new ROI</button>;
}`,...(l=(R=i.parameters)==null?void 0:R.docs)==null?void 0:l.source}}};var m,h,y;r.parameters={...r.parameters,docs:{...(m=r.parameters)==null?void 0:m.docs,source:{originalSource:`function Remove() {
  const {
    selectedRoi
  } = useRoiState();
  const {
    removeRoi
  } = useRoiActions();
  return <button onClick={() => removeRoi(selectedRoi)}>Remove ROI</button>;
}`,...(y=(h=r.parameters)==null?void 0:h.docs)==null?void 0:y.source}}};var f,g,x;c.parameters={...c.parameters,docs:{...(f=c.parameters)==null?void 0:f.docs,source:{originalSource:`function Update() {
  const {
    selectedRoi
  } = useRoiState();
  const {
    updateRoi
  } = useRoiActions();
  return <button onClick={() => updateRoi(selectedRoi, {
    y: 0.1
  })}>
      Update ROI
    </button>;
}`,...(x=(g=c.parameters)==null?void 0:g.docs)==null?void 0:x.source}}};var b,k,j;s.parameters={...s.parameters,docs:{...(b=s.parameters)==null?void 0:b.docs,source:{originalSource:`function Mode(props: {
  type: 'draw' | 'select';
}) {
  const {
    type
  } = props;
  const {
    createRoi,
    setMode
  } = useRoiActions();
  const {
    mode
  } = useRoiState();
  useEffect(() => {
    setMode(type);
  }, [type]);
  function onClick() {
    createRoi({
      id: 'abcd-efgh-ijkl-mnop',
      x: 0,
      y: 0,
      width: 0.2,
      height: 0.2
    });
  }
  return <button onClick={onClick}>Add a new ROI with mode: {mode}</button>;
}`,...(j=(k=s.parameters)==null?void 0:k.docs)==null?void 0:j.source}}};const P=["Add","Remove","Update","Mode"];export{i as Add,s as Mode,r as Remove,c as Update,P as __namedExportsOrder,T as default};
//# sourceMappingURL=actions.stories-f8ada69f.js.map
