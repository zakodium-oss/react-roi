import{j as e}from"./jsx-runtime-ed146b25.js";import{R as d,a as u,b as p}from"./RoiProvider-d71e6690.js";import"./index-c6dae603.js";const j={title:"Actions"},x=[{id:"0000-1111-2222-3333",label:e.jsx("div",{style:{color:"white",backgroundColor:"transparent",width:"100%",display:"flex",justifyContent:"center",justifyItems:"center",fontSize:"12px"},children:"Styled label"}),x:0,y:0,width:.5,height:.5}];function g(){return e.jsx("img",{src:"/barbara.jpg",style:{display:"block",width:"100%"}})}function i(){return e.jsx(d,{initialRois:x,children:e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:5},children:e.jsx(u,{target:e.jsx(g,{}),children:e.jsx(p,{getStyle:(y,n)=>({style:{backgroundColor:n?"green":"darkgreen",opacity:n?.4:.6}})})})})})}function t(){return e.jsx(d,{initialRois:x,children:e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:5},children:e.jsx(u,{target:e.jsx(g,{}),children:e.jsx(p,{})})})})}var r,o,a;i.parameters={...i.parameters,docs:{...(r=i.parameters)==null?void 0:r.docs,source:{originalSource:`function Initial() {
  return <RoiProvider initialRois={initialRois}>
      <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 5
    }}>
        <RoiContainer target={<Target />}>
          <RoiList getStyle={(roi, selected) => ({
          style: {
            backgroundColor: selected ? 'green' : 'darkgreen',
            opacity: selected ? 0.4 : 0.6
          }
        })} />
        </RoiContainer>
      </div>
    </RoiProvider>;
}`,...(a=(o=i.parameters)==null?void 0:o.docs)==null?void 0:a.source}}};var s,l,c;t.parameters={...t.parameters,docs:{...(s=t.parameters)==null?void 0:s.docs,source:{originalSource:`function WithDefaultStyle() {
  return <RoiProvider initialRois={initialRois}>
      <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 5
    }}>
        <RoiContainer target={<Target />}>
          <RoiList />
        </RoiContainer>
      </div>
    </RoiProvider>;
}`,...(c=(l=t.parameters)==null?void 0:l.docs)==null?void 0:c.source}}};const h=["Initial","WithDefaultStyle"];export{i as Initial,t as WithDefaultStyle,h as __namedExportsOrder,j as default};
//# sourceMappingURL=initial.stories-3c40eede.js.map
