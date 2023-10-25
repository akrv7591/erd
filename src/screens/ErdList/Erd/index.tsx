import {ActionIcon, Card, Grid, Group, Image, Stack, Title} from "@mantine/core";
import {IErd, setErds} from "../../../atoms/erdsAtom";
import styles from "./style.module.css"
import {useModal} from "../../../hooks/useModal";
import AddModal from "../AddModal";
import {PrimitiveAtom, useAtomValue, useSetAtom} from "jotai";
import {IconChartTreemap, IconEdit, IconTrash} from "@tabler/icons-react";
import {notifications} from "@mantine/notifications";
import {MouseEventHandler} from "react";
import {useNavigate} from "react-router-dom";

interface Props {
  erdAtom: PrimitiveAtom<IErd>
}

const updateNotice = () => notifications.show({
  title: "Erd",
  message: "Erd updated successfully",
  color: "var(--mantine-color-green-filled)"
})

const deleteNotice = () => notifications.show({
  title: "Erd",
  message: "Erd deleted successfully",
  color: "var(--mantine-color-red-filled)"
})


export default function Erd({erdAtom}: Props) {
  const erd = useAtomValue(erdAtom)
  const modal = useModal({initialType: "update", initialOpen: false, baseTitle: erd.name})
  const setErd = useSetAtom(setErds)
  const navigate = useNavigate()

  const onSubmit = (data: IErd) => {
    setErd({type: modal.modalProps.type, data})
    modal.modalProps.type === "update"? updateNotice(): deleteNotice()
  }
  const onDelete: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation()
    modal.open("delete")
  }

  const onUpdate: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation()
    modal.open("update")
  }
  const navigateToErd = () => navigate(erd.id)

  return (
    <Grid.Col span={{xs: 12, md: 3}}>
      <AddModal data={erd} {...modal.modalProps} onSubmit={onSubmit}/>
      <Card className={styles.box} onClick={navigateToErd}>
        <Stack>
          <Group>
            <IconChartTreemap stroke={1}/>
            <Title order={4}> {erd.name}</Title>
            <ActionIcon onClick={onUpdate} color={"var(--mantine-color-green-filled)"} ml={'auto'}>
              <IconEdit  stroke={1}/>
            </ActionIcon>
            <ActionIcon onClick={onDelete} color={"var(--mantine-color-red-filled)"}>
              <IconTrash  stroke={1}/>
            </ActionIcon>
          </Group>
          <Image mih={"200px"} h={"200px"}/>
        </Stack>
      </Card>
    </Grid.Col>
  )
}
