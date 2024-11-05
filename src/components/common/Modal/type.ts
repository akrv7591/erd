import {ModalProps} from "@mantine/core";
import {ModalType} from "@/hooks";

export interface ModalBaseProps extends Omit<ModalProps, 'onSubmit'> {
  onSubmit?: (data: any) => Promise<void> | void
  type: ModalType
}
