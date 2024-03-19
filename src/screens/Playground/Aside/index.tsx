import {Stack} from "@mantine/core";
import TableList from "@/screens/Playground/Aside/TableList";
import MinimapController from "@/screens/Playground/Aside/MinimapController.tsx";
import MemoController from "@/screens/Playground/Aside/MemoController.tsx";
import EntityLogicalAdvancedViewController from "@/screens/Playground/Aside/EntityLogicalAdvancedViewController.tsx";

export default function Aside() {
  return (
    <Stack h={"100%"} gap={"5px"} py={"5px"}>
      <TableList/>
      <EntityLogicalAdvancedViewController />
      <MemoController />
      <MinimapController />
    </Stack>
  )
}
