/// <reference types="vite-plugin-svgr/client" />
import LogoIcon from "@/assets/svgs/logo-square.svg?react"
import {Link, LinkProps} from "react-router-dom";
import {SVGProps} from "react";

interface Props extends Omit<LinkProps, 'to'> {
  iconProps?: SVGProps<SVGSVGElement>
}

export default function Logo({iconProps={}, ...rest}: Props) {
  return (
    <Link {...rest} to={"/"} style={{height: "40px"}}>
      <LogoIcon {...iconProps}/>
    </Link>
  )
}

