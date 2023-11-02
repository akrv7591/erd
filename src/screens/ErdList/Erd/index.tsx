import {ActionIcon, Card, Grid, Group, Image, Stack, Text, Title, Tooltip} from "@mantine/core";
import styles from "./style.module.css"
import {useModal} from "../../../hooks/useModal";
import AddModal from "../AddModal";
import {IconChartTreemap, IconEdit, IconTable, IconTrash} from "@tabler/icons-react";
import {notifications} from "@mantine/notifications";
import {MouseEventHandler} from "react";
import {useNavigate} from "react-router-dom";
import dayjs from "dayjs";
import {IErd, useErdStore} from "../../../stores/useErdStore";

interface Props {
  erd: IErd
}

const updateNotice = (name: string) => notifications.show({
  title: "Erd",
  message: `${name} updated successfully`,
  color: "var(--mantine-color-green-filled)"
})

const deleteNotice = (name: string) => notifications.show({
  title: "Erd",
  message: `${name} deleted successfully`,
  color: "var(--mantine-color-red-filled)"
})


export default function Erd({erd}: Props) {
  const modal = useModal({initialType: "update", initialOpen: false, baseTitle: erd.name})
  const setErd = useErdStore(state => state.setErd)
  const navigate = useNavigate()

  const onSubmit = async (data: IErd) => {
    modal.setLoading(true)
    await setErd(data, modal.modalProps.type, () => {
      modal.modalProps.type === "update" ? updateNotice(data.name) : deleteNotice(data.name);
      modal.setLoading(false)
    })

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
    <Grid.Col span={{xs: 12, sm: 3}}>
      <AddModal data={erd} {...modal.modalProps} onSubmit={onSubmit} key={JSON.stringify(erd)}/>
      <Card className={styles.box} onClick={navigateToErd}>
        <Stack>
          <Group>
            <IconChartTreemap stroke={1}/>
            <Title order={4}> {erd.name}</Title>
            <ActionIcon onClick={onUpdate} ml={'auto'}>
              <IconEdit stroke={1}/>
            </ActionIcon>
            <ActionIcon onClick={onDelete}>
              <IconTrash stroke={1}/>
            </ActionIcon>
          </Group>
          <Image mih={"200px"} h={"200px"}/>
          <Group justify={"space-between"}>
            <Tooltip label={`${erd.nodes.length} tables`}>
              <Group gap={2}>
                <Text>{erd.nodes.length}</Text>
                <IconTable stroke={1} size={20}/>
              </Group>
            </Tooltip>
            <Text size={"sm"}>
              {dayjs(erd.createdAt).format("YYYY-MM-DD")}
            </Text>
          </Group>
        </Stack>
      </Card>
    </Grid.Col>
  )
}
