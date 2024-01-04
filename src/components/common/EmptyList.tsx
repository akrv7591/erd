import {Center, Stack, Text} from "@mantine/core";
import {IconList} from "@tabler/icons-react";

export default function EmptyList () {
  return (
    <Center h={"100%"}>
      <Stack align={"center"}>
        <IconList size={30}/>
        <Text>No data was found</Text>
      </Stack>
    </Center>
  )
}
