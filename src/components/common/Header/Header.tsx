import {Group} from "@mantine/core";
import {AppLogo} from "@/components/common/AppLogo";
import {Account} from "@/components/common/Account";
import {FC, memo, PropsWithChildren} from "react";
import { useUser } from "@/hooks";


export const Header: FC<PropsWithChildren> = memo(({children}) => {
  const {data} = useUser()
  return (
    <Group h="100%" px={20} justify={"space-between"} align={"center"}>
      <AppLogo/>
      {children}
      <Group gap={5} ml={"auto"}>
        {data && (
          <Account/>
        )}
      </Group>
    </Group>
  )
})
