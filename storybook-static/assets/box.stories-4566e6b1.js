import{j as r}from"./jsx-runtime-ed146b25.js";import{R as f,B as a}from"./RoiProvider-d71e6690.js";import"./index-c6dae603.js";const j={title:"Box",tags:["autodocs"],decorators:[o=>r.jsx(f,{children:r.jsx(o,{})})],args:{id:"abcd-efgh-ijkl-mnop",x:0,y:0,width:500,height:500,label:"Label of the box",className:"orange",style:{backgroundColor:"red"}}};function s(o){return r.jsx(a,{...o})}function e(o){const{className:y,...n}=o;return r.jsx(a,{...n})}function t(o){const{style:y,...n}=o;return r.jsx(a,{...n})}var p,c,i;s.parameters={...s.parameters,docs:{...(p=s.parameters)==null?void 0:p.docs,source:{originalSource:`function Control(props: BoxAnnotationProps) {
  return <Box {...props} />;
}`,...(i=(c=s.parameters)==null?void 0:c.docs)==null?void 0:i.source}}};var l,m,u;e.parameters={...e.parameters,docs:{...(l=e.parameters)==null?void 0:l.docs,source:{originalSource:`function WithOnlyStyle(props: BoxAnnotationProps) {
  const {
    className,
    ...otherProps
  } = props;
  return <Box {...otherProps} />;
}`,...(u=(m=e.parameters)==null?void 0:m.docs)==null?void 0:u.source}}};var d,x,h;t.parameters={...t.parameters,docs:{...(d=t.parameters)==null?void 0:d.docs,source:{originalSource:`function WithOnlyClassname(props: BoxAnnotationProps) {
  const {
    style,
    ...otherProps
  } = props;
  return <Box {...otherProps} />;
}`,...(h=(x=t.parameters)==null?void 0:x.docs)==null?void 0:h.source}}};const C=["Control","WithOnlyStyle","WithOnlyClassname"];export{s as Control,t as WithOnlyClassname,e as WithOnlyStyle,C as __namedExportsOrder,j as default};
//# sourceMappingURL=box.stories-4566e6b1.js.map
