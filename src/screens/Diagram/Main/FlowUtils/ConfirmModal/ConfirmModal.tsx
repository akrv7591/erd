import {memo} from "react";
import {Avatar, Button, Card, Group, Modal, Stack, Text} from '@mantine/core';
import {IconExclamationCircle} from "@tabler/icons-react";
import {useDiagramStore} from "@/hooks";

export const ConfirmModal = memo(() => {
  const modal = useDiagramStore(state => state.confirmModal)
  const handleCancel = () => modal.onCancel ? modal.onCancel(modal.close) : null
  const handleConfirm = () => modal.onConfirm(modal.close)
  return (
    <Modal size={"lg"} withCloseButton={false} opened={modal.opened} onClose={modal.close}>
      <Stack align={"center"}>
        <Avatar size={"lg"}>
          <IconExclamationCircle size={50}/>
        </Avatar>
        <Card w={"100%"}>
          <Text>{modal.message}</Text>
        </Card>
        <Group w={"100%"}>
          <Button flex={1} variant={"default"} onClick={handleCancel}>Cancel</Button>
          <Button flex={1} autoFocus data-autofocus variant={"light"} onClick={handleConfirm}>Confirm</Button>
        </Group>
      </Stack>
    </Modal>
  );
})
