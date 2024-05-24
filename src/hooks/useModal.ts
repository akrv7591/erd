import {useCallback, useMemo, useState} from "react";
export type ModalType = "create" | "update" | "delete" | "view"

interface Props<T> {
  initialOpen: boolean
  baseTitle: string
  initialType: ModalType
  initialData?: T | null
}

type Data<T> = T | null

export interface ModalState<T> {
  opened: boolean
  type: ModalType
  data: Data<T>
}

export interface ModalProps<T> extends ModalState<T> {
  onClose: () => void
}

interface OpenHandlerOptions<T> {
  type?: ModalType
  data?: Data<T>
}

export interface UseModalType<T> {
  modalProps: ModalProps<T> ,
  open: (options?: OpenHandlerOptions<T>) => void
}

const getTitle = (title: string, type: ModalType) => {
  switch (type) {
    case "create":
      return `Create ${title.toLowerCase()}`
    case "update":
      return `Update ${title.toLowerCase()}`
    default:
      return title
  }
}

export const useModal = <T>(props: Props<T>): UseModalType<T> => {
  const [modalPropsDataOnly, setModalProps] = useState<ModalState<T>>({
    opened: props.initialOpen,
    type: props.initialType,
    data: null
  })


  const handleClose = useCallback(() => {
    setModalProps(prevState => ({...prevState, opened: false}))
  }, [])

  const handleOpen = useCallback((options?: OpenHandlerOptions<T>) => {
    setModalProps(prevState => ({...prevState, ...options, opened: true}))
  }, [])

  const modalProps: ModalProps<T> = useMemo(() => {
    const title = getTitle(props.baseTitle, modalPropsDataOnly.type)
    return {
      ...modalPropsDataOnly,
      title,
      onClose: handleClose
    }

  }, [handleClose, modalPropsDataOnly])

  return {
    modalProps,
    open: handleOpen,
  }
}
