import React from "react";

export type ModalType = "create" | "update" | "delete" | "view"

interface Props {
  initialOpen: boolean
  baseTitle: string
  initialType: ModalType
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

export const useModal = (props: Props) => {
  const [opened, setOpened] = React.useState(props.initialOpen)
  const [type, setType] = React.useState(props.initialType)
  const onClose = () => setOpened(cur => !cur)
  const open = (type: ModalType = 'view') => setOpened(() => {
    setType(type)
    return true
  })
  const title = getTitle(props.baseTitle, type)
  return {
    modalProps: {
      opened,
      onClose,
      title,
      type
    },
    open,
  }
}
