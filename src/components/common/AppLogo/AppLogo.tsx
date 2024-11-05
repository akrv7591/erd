/// <reference types="vite-plugin-svgr/client" />
import LogoIcon from "@/assets/svgs/logo-square.svg?react"
import {Link, LinkProps} from "react-router-dom";
import {FC, memo, SVGProps} from "react";

interface Props extends Omit<LinkProps, 'to'> {
  iconProps?: SVGProps<SVGSVGElement>
}

export const AppLogo: FC<Props> = memo(({iconProps = {}, ...rest}) => {
  return (
    <Link {...rest} to={"/"} style={{height: "40px"}}>
      <LogoIcon {...iconProps}/>
    </Link>
  )
})

