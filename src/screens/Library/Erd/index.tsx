import {ActionIcon, Card, Grid, Group, Image, Stack, Text, Title} from "@mantine/core";
import styles from "./style.module.css"
import {useModal} from "@/hooks/useModal";
import {IconChartTreemap, IconEdit, IconTrash} from "@tabler/icons-react";
import {MouseEventHandler} from "react";
import {useNavigate} from "react-router-dom";
import dayjs from "dayjs";
import ErdModal from "../ErdModal";
import TableCount from "./TableCount.tsx";
import {useAuthStore} from "@/stores/useAuthStore.ts";
import {IErd} from "@/types/data/db-model-interfaces";

interface Props {
  erd: IErd
}


export default function Erd({erd}: Props) {
  const modal = useModal({initialType: "update", initialOpen: false, baseTitle: erd.name})
  const user = useAuthStore(state => state.getAuthorization())
  const navigate = useNavigate()
  const isUserAdmin = erd.userErds?.find(userErd => userErd.isAdmin && userErd.userId === user!.id)

  const onDelete: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation()
    modal.open("delete")
  }

  const onUpdate: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation()
    modal.open("update")
  }


  const navigateToErd = () => navigate(erd.id, {state: {erd}})

  return (
    <Grid.Col span={{xs: 12, sm: 6, md: 4, lg: 3}}>
      <ErdModal data={erd} {...modal.modalProps}/>
      <Card className={styles.box} onClick={navigateToErd}>
        <Stack>
          <Group>
            <IconChartTreemap stroke={1}/>
            <Title order={4}> {erd.name}</Title>
            {
              isUserAdmin && (
                <>
                  <ActionIcon onClick={onUpdate} ml={'auto'}>
                    <IconEdit stroke={1}/>
                  </ActionIcon>
                  <ActionIcon onClick={onDelete}>
                    <IconTrash stroke={1}/>
                  </ActionIcon>
                </>
              )
            }
          </Group>
          <Image mih={"200px"} h={"200px"}/>
          <Group justify={"space-between"}>
            <TableCount erdId={erd.id} />
            <Text size={"sm"}>
              {dayjs(erd.createdAt).format("YYYY-MM-DD")}
            </Text>
          </Group>
        </Stack>
      </Card>
    </Grid.Col>
  )
}
