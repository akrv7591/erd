import {Button, Container, Grid, Group, TextInput} from "@mantine/core";
import Erd from "./Erd";
import AddModal from "./AddModal";
import {useModal} from "../../hooks/useModal";
import {IconPlus, IconSearch} from "@tabler/icons-react";
import React from "react";
import {notifications} from "@mantine/notifications";
import {IErd, useErdStore} from "../../stores/useErdStore";
import {Helmet} from "react-helmet-async";

const successNotice = (name: string) => notifications.show({
  title: "Erd",
  message: `${name} Erd added successfully`
})


export default function ErdList() {
  const [search, setSearch] = React.useState("")
  const [erds, setErd] = useErdStore(state => [state.erds, state.setErd])
  const modal = useModal({initialOpen: false, baseTitle: "Erd", initialType: "view"})
  const filteredErd = erds.filter(erd => erd.name.toLowerCase().includes(search.toLowerCase()))

  const onSubmit = async (data: IErd) => {
    modal.setLoading(true)
    await setErd(data, modal.modalProps.type, () => {
      modal.setLoading(false)
      successNotice(data.name)
    })

  }
  return (
    <Container size={"xl"}>
      <Helmet>
        <title>Erd list</title>
      </Helmet>
      <AddModal {...modal.modalProps} onSubmit={onSubmit}/>
      <Group mt={20} justify={"space-between"}>
        <TextInput
          onChange={e => setSearch(e.target.value)}
          autoFocus
          placeholder={"Search"}
          rightSection={<IconSearch stroke={1}/>}
        />
        <Button leftSection={<IconPlus stroke={1}/>} onClick={() => modal.open('create')}>
          add
        </Button>
      </Group>
      <Grid mt={20} style={{overflow: "visible"}}>
        {filteredErd.map(erd => <Erd key={erd.id} erd={erd}/>)}
      </Grid>
    </Container>
  )
}
