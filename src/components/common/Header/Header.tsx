import {Group} from "@mantine/core";
import {AppLogo} from "@/components/common/AppLogo";
import {Account} from "@/components/common/Account";
import {FC, memo, PropsWithChildren} from "react";
import {userAuthorized} from "@/hooks";


export const Header: FC<PropsWithChildren> = memo(({children}) => {
  const isAuthorized = userAuthorized()
  return (
    <Group h="100%" px={20} justify={"space-between"} align={"center"}>
      <AppLogo/>
      {children}
      <Group gap={5} ml={"auto"}>
        {isAuthorized && (
          <Account/>
        )}
      </Group>
    </Group>
  )
})
