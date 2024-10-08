import {Checkbox, Group, Table, Text, Tooltip} from "@mantine/core";
import styles from "./style.module.css"
import {useNavigate} from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"
import Actions from "@/screens/Library/Main/Erd/Actions.tsx";
import ErdModal from "@/screens/Library/Main/ErdModal";
import {useModal} from "@/hooks/useModal.ts";
import {memo} from "react";
import {useLibraryStore} from "@/stores/useLibrary.ts";
import Role from "@/screens/Library/Main/Erd/Role.tsx";
import {IErd} from "@/types/data/db-model-interfaces.ts";

dayjs.extend(relativeTime)

interface Props {
  erd: IErd
}

const Erd = memo(({erd}: Props) => {
  const navigate = useNavigate()
  const modal = useModal<IErd>({initialType: "update", initialOpen: false, baseTitle: erd.name})
  const navigateToErd = () => navigate(erd.id, {state: {erd}})
  const checkedErds = useLibraryStore(state => state.checkedErds)
  const onErdCheckBoxClick = useLibraryStore(state => state.onErdCheckBoxClick)

  return (
    <>
      <ErdModal {...modal.modalProps}/>
      <Table.Tr className={styles.box} onClick={navigateToErd}>
        <Table.Td>
          <Checkbox
            checked={checkedErds.includes(erd)}
            onChange={() => onErdCheckBoxClick(erd)}
            onClick={e => {
              e.stopPropagation()
            }}
          />
        </Table.Td>
        <Table.Td>
          <Group>
            <Tooltip label={erd.description ? erd.description : "No description"}>
              <Text> {erd.name}</Text>
            </Tooltip>
          </Group>
        </Table.Td>
        <Table.Td>
          <Text>{erd.entityCount}</Text>
        </Table.Td>
        <Table.Td visibleFrom={"md"}>
          <Text size={"sm"}>
            {dayjs(erd.createdAt).format("YYYY-MM-DD")}
          </Text>
        </Table.Td>
        <Table.Td visibleFrom={"md"}>
          <Text size={"sm"}>
            {dayjs(erd.updatedAt).fromNow()}
          </Text>
        </Table.Td>
        <Table.Td visibleFrom={"md"}>
          <Role teamId={erd.teamId}/>
        </Table.Td>
        <Table.Td>
          <Actions erd={erd} modal={modal}/>
        </Table.Td>
      </Table.Tr>
    </>
  )
})


export default Erd
