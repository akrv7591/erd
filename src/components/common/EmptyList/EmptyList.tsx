import {Center, Stack, Text} from "@mantine/core";
import {IconList} from "@tabler/icons-react";
import {memo} from "react";

export const EmptyList = memo(() => {
  return (
    <Center h={"100%"}>
      <Stack align={"center"}>
        <IconList size={30}/>
        <Text>No data was found</Text>
      </Stack>
    </Center>
  )
})
