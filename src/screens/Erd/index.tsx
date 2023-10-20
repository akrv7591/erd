import {ActionIcon, AppShell, Card, Container, Grid, Group, Text, Tooltip} from "@mantine/core";
import {IconPlus, IconTable, IconTrash} from "@tabler/icons-react";
import {Link} from "react-router-dom";
import {useErds} from "../../hooks/useErds";

const Erd = () => {
  const {erds, addErd, removeErd} = useErds()


  return (
    <AppShell header={{height: 50}}>
      <AppShell.Header>
        <Group justify={"space-between"} px={"50px"} align={"center"} h={"100%"}>
          <Text>Erd list</Text>
          <Tooltip label={"Add erd"}>
            <ActionIcon onClick={addErd}>
              <IconPlus stroke={1}/>
            </ActionIcon>
          </Tooltip>
        </Group>
      </AppShell.Header>
      <AppShell.Main>
        <Container size={"xl"}>
          <Grid mt={20}>
            {erds.map(item => (
              <Grid.Col span={3} key={item.id}>
                <Link to={item.id}>
                  <Card>
                    <Group justify={"space-between"}>
                      <Text>{item.name}</Text>
                      <ActionIcon color={"red"} onClick={e => {
                        e.preventDefault()
                        removeErd(item)
                      }}>
                        <IconTrash stroke={1}/>
                      </ActionIcon>
                    </Group>
                    <IconTable width={"100%"} height={"100%"} stroke={1}/>
                  </Card>
                </Link>
              </Grid.Col>
            ))}
          </Grid>
        </Container>
      </AppShell.Main>
    </AppShell>
  )
}

export default Erd
