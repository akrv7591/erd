import {Stack} from "@mantine/core";
import TableList from "@/screens/Playground/Aside/TableList";
import MinimapController from "@/screens/Playground/Aside/MinimapController.tsx";

export default function Aside() {
  return (
    <Stack h={"100%"}>
      <TableList/>
      <MinimapController />
    </Stack>
  )
}
