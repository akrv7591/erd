import {ElementType} from "react";


interface Props {
  array: any[]
  component: ElementType
}
export default function ArrayOf(props: Props) {
  return props.array.map(item => <props.component key={item.id} />)
}
