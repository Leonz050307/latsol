import React from 'react'
export function BentoGrid({children}:{children:React.ReactNode}){ return <div className="bento">{children}</div> }
export function BentoItem({span='col-span-2 row-span-1', title, desc, children}:{span?:string; title:string; desc:string; children?:React.ReactNode}){
  return <div className={"card "+span}>
    <div className="text-xl font-semibold">{title}</div>
    <div className="opacity-80 text-sm mb-3">{desc}</div>
    {children}
  </div>
}
