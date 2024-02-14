/// <reference types="vite-plugin-svgr/client" />
import LogoIcon from "@/assets/svgs/logo-square.svg?react"
import {Link} from "react-router-dom";

export default function Logo() {
  return (
    <Link to={"/"} style={{height: "40px"}}>
      <LogoIcon/>
    </Link>
  )
}

