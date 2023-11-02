import {HTMLAttributes} from "react";
import ModalFooter from "../ModalFooter";

interface Props extends HTMLAttributes<HTMLFormElement> {
  onClose: () => void
  loading?: boolean
}

export default function ModalForm({children, loading, onClose, ...props}: Props) {
  return (
    <form {...props}>
      {children}
      <ModalFooter onClose={onClose} loading={loading}/>
    </form>
  )
}
