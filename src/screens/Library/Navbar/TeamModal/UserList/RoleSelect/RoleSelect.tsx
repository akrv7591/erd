import {memo, useCallback, useMemo, useState} from "react";
import {ComboboxData, ComboboxItem, Group, Loader, Select, Text, Tooltip} from "@mantine/core";
import {IconCheck} from "@tabler/icons-react";
import {useRoles, useUserTeam} from "@/hooks";
import voca from "voca";
import {useHover} from "@mantine/hooks";


interface RenderOptionProps {
  option: ComboboxItem
  checked?: boolean
  dropDownOpened: boolean
}

const Option = memo(({option, checked, dropDownOpened}: RenderOptionProps) => {
  const {ref, hovered} = useHover()
  const roles = useRoles()

  const opened = useMemo(() => {
    return hovered && dropDownOpened
  }, [hovered, dropDownOpened])

  const description = useMemo(() => {
    return roles.data.find(role => role.id === option.value)?.description
  }, [roles, option.value])

  return (
    <Tooltip label={description} ref={ref} opened={opened} withinPortal transitionProps={{duration: 0}} offset={20}>
      <Group justify={"space-between"} flex={1}>
        <Text size={"sm"}>{option.label}</Text>
        {checked && <IconCheck size={"20"}/>}
      </Group>
    </Tooltip>
  )
})

interface Props {
  role: string
  onChange: (role: string) => void
  label?: string
  loading?: boolean
}

export const RoleSelect = memo(({role, onChange, label, loading}: Props) => {
  const {isOwner} = useUserTeam()
  const roles = useRoles()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const rolesData: ComboboxData = (() => {
    return roles.data.filter(role => {
      if (isOwner) {
        return role.name !== "owner"
      } else {
        return role.name !== "owner" && role.name !== "admin"
      }
    }).map(role => ({
      value: role.id,
      label: voca.titleCase(role.name),
    }))
  })()

  const handleDropdownOpen = useCallback(() => {
    setIsDropdownOpen(true)
  }, [])

  const handleDropdownClose = useCallback(() => {
    setIsDropdownOpen(false)
  }, [])

  return (
    <Select
      value={role}
      data={rolesData}
      checkIconPosition={"right"}
      label={label}
      maw={"150px"}
      onDropdownClose={handleDropdownClose}
      onDropdownOpen={handleDropdownOpen}
      rightSection={loading && (
        <Loader size={"10px"}/>
      )}
      disabled={loading}
      onChange={value => {
        if (value) {
          onChange(value)
        }
      }}
      renderOption={({option, checked}) => (
        <Option option={option} checked={checked} dropDownOpened={isDropdownOpen}/>
      )}
      size={"sm"}
    />
  )
})
