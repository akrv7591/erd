import {Badge, Checkbox, Group, Table, Text, Tooltip} from "@mantine/core";
import styles from "./style.module.css"
import {useNavigate} from "react-router-dom";
import dayjs from "dayjs";
import TableCount from "./TableCount.tsx";
import {IErd} from "@/types/data/db-model-interfaces";
import Actions from "@/screens/Library/Erd/Actions.tsx";
import {useTeamPermission} from "@/hooks/useTeamPermission.ts";
import {IconExclamationCircle} from "@tabler/icons-react";
import ErdModal from "@/screens/Library/ErdModal";
import {useModal} from "@/hooks/useModal.ts";
import {getRoleDescription, roleData} from "@/utility/role-util.ts";

interface Props {
  erd: IErd
}


export default function Erd({erd}: Props) {
  const navigate = useNavigate()
  const modal = useModal({initialType: "update", initialOpen: false, baseTitle: erd.name})
  const permission = useTeamPermission(erd.teamId)
  const navigateToErd = () => navigate(erd.id, {state: {erd}})
  const role = roleData.find(role => role.value === permission?.role)

  return (
    <>
      <ErdModal data={erd} {...modal.modalProps}/>
      <Table.Tr className={styles.box} onClick={navigateToErd}>
        <Table.Td>
          <Checkbox onClick={e => {
            e.stopPropagation()
          }}/>
        </Table.Td>
        <Table.Td>
          <Group>
            <Text> {erd.name}</Text>
            <Tooltip label={erd.description ? erd.description : "No description"}>
              <IconExclamationCircle size={15}/>
            </Tooltip>
          </Group>
        </Table.Td>
        <Table.Td>
          <TableCount erdId={erd.id}/>
        </Table.Td>
        <Table.Td>
          <Text size={"sm"}>
            {dayjs(erd.createdAt).format("YYYY-MM-DD")}
          </Text>
        </Table.Td>
        <Table.Td>
          <Text size={"sm"}>
            {dayjs(erd.updatedAt).format("YYYY-MM-DD")}
          </Text>
        </Table.Td>
        <Table.Td>
          <Tooltip label={getRoleDescription(role?.value!)}>
            <Badge variant={"default"}>{role?.label}</Badge>
          </Tooltip>
        </Table.Td>
        <Table.Td>
          <Actions erd={erd} modal={modal}/>
        </Table.Td>
      </Table.Tr>
    </>


  )
}
