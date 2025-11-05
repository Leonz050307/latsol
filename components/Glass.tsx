import React from 'react'
export default function Glass({children, className='' }:{children:React.ReactNode; className?:string}){
  return <div className={"glass "+className}>{children}</div>
}
