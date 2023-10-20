import {Card, CardProps, Center, Group, NativeSelect, Stack, Text} from "@mantine/core"
import {IconRelationManyToMany} from "@tabler/icons-react";

const data = ['SET NULL', 'CASCADE']

const RelationForm = (props: CardProps) => {
 return (
   <Card {...props}>
     <Center>
       <IconRelationManyToMany  stroke={1} size={50}/>
     </Center>
      <Stack>
        <Group>
          <Text>On Update</Text>
          <NativeSelect data={data}/>
        </Group>
        <Group>
          <Text>On Delete</Text>
          <NativeSelect ml={"auto"} data={data}/>
        </Group>
      </Stack>
   </Card>
 )
}


export default RelationForm
