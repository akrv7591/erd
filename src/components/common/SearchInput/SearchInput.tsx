import {TextInput, TextInputProps} from "@mantine/core";
import {IconSearch} from "@tabler/icons-react";
import {FC, memo} from "react";

interface Props extends Omit<TextInputProps, 'onChange'> {
  onChange: (v: string) => void
}

export const SearchInput: FC<Props> = memo(({onChange, ...props}: Props) => {
  return (
    <TextInput
      onChange={e => onChange(e.target.value)}
      rightSection={<IconSearch stroke={1} size={18}/>}
      {...props}
    />
  )
})
