import {Modal, ModalProps} from "@mantine/core";
import {ModalType} from "../../../hooks/useModal";

export interface ModalBaseProps extends Omit<ModalProps, 'onSubmit'> {
  onSubmit: (data: any) => Promise<void> | void
  type: ModalType
  loading?: boolean
}

export default function ModalBase(props: ModalBaseProps){
  return <Modal {...props} />
}
