import {Checkbox, Table, Text} from "@mantine/core";
import {useLibraryStore} from "@/stores/useLibrary.ts";
import {IErd} from "@/types/data/db-model-interfaces";

interface Props {
  erds: IErd[]
}

const Header = (props: Props) => {
  const checkedErds = useLibraryStore(state => state.checkedErds)
  const clearCheckedErds = useLibraryStore(state => state.clearCheckedErds)
  const onErdCheckBoxClick = useLibraryStore(state => state.onErdCheckBoxClick)
  const isIndeterminate = checkedErds.length > 0 && checkedErds.length !== props.erds.length
  const isChecked = props.erds.length > 0 && checkedErds.length === props.erds.length
  const onErdCheckBoxChange = () => {
    if (isIndeterminate) {
      clearCheckedErds()
    } else {
      props.erds.forEach(erd => onErdCheckBoxClick(erd))
    }
  }

  return (
    <Table.Thead>
      <Table.Tr>
        <Table.Th>
          <Checkbox checked={isChecked} indeterminate={isIndeterminate} onChange={onErdCheckBoxChange}/>
        </Table.Th>
        <Table.Th>
          <Text>Name</Text>
        </Table.Th>
        <Table.Th>
          <Text>Entities</Text>
        </Table.Th>
        <Table.Th>
          <Text>Created at</Text>
        </Table.Th>
        <Table.Th>
          <Text>Updated at</Text>
        </Table.Th>
        <Table.Th>
          <Text>Role</Text>
        </Table.Th>
        <Table.Th>
          <Text>Actions</Text>
        </Table.Th>
      </Table.Tr>
    </Table.Thead>
  )
}

export default Header
