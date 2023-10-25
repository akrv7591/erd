import {Button, Container, Grid, Group, TextInput} from "@mantine/core";
import {atom, useAtomValue, useSetAtom} from "jotai";
import {erdsAtom, IErd, setErds} from "../../atoms/erdsAtom";
import Erd from "./Erd";
import AddModal from "./AddModal";
import {useModal} from "../../hooks/useModal";
import {IconPlus, IconSearch} from "@tabler/icons-react";
import React from "react";
import {notifications} from "@mantine/notifications";
import {splitAtom} from "jotai/utils";

const successNotice = () => notifications.show({
  title: "Erd",
  message: "Erd added successfully"
})

const searchErds = atom(null, (get, set, search: string) => set(erdsAtom, curErds => curErds.filter(erd => erd.name.toLowerCase().includes(search.toLowerCase()))))
const erdAtomsAtom = splitAtom(erdsAtom)

export default function ErdList() {
  const setSearch = useSetAtom(searchErds)
  const setErd = useSetAtom(setErds)
  const erdAtoms = useAtomValue(erdAtomsAtom)
  const modal = useModal({initialOpen: false, baseTitle: "Erd", initialType: "view"})
  const onSubmit = (data: IErd) => {
    setErd({type: modal.modalProps.type, data})
    successNotice()
  }
  return (
    <Container miw={{sm: "100%", lg: "1500px"}}>
      <AddModal {...modal.modalProps} onSubmit={onSubmit}/>
      <Group mt={20} justify={"space-between"}>
        <TextInput
          onChange={e => setSearch(e.target.value)}
          placeholder={"Search"}
          rightSection={<IconSearch stroke={1}/>}/>
        <Button leftSection={<IconPlus stroke={1}/>} onClick={() => modal.open('create')}>
          add
        </Button>
      </Group>
      <Grid mt={20} style={{overflow: "visible"}}>
        {erdAtoms.map(erdAtom => <Erd key={String(erdAtom)} erdAtom={erdAtom}/>)}
      </Grid>
    </Container>
  )
}
