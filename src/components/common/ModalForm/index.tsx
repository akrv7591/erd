import {HTMLAttributes} from "react";
import ModalFooter from "../ModalFooter";

interface Props extends HTMLAttributes<HTMLFormElement> {
  onClose: () => void
}

export default function ModalForm({children, onClose, ...props}: Props) {
  return (
    <form {...props}>
      {children}
      <ModalFooter onClose={onClose}/>
    </form>
  )
}
