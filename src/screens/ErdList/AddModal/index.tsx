import {Modal, Stack, Text, TextInput} from "@mantine/core";
import {ModalBaseProps} from "../../../components/common/ModalBase";
import ModalForm from "../../../components/common/ModalForm";
import {useForm} from "@mantine/form";
import {IErd} from "../../../stores/useErdStore";

interface Props extends ModalBaseProps {
  data?: IErd
}

export default function AddModal({onSubmit, data, type, loading, ...props}: Props) {
  const form = useForm({
    initialValues: {
      name: "",
      description: "",
      ...data && {
        ...data
      }
    }
  })

  const handleSubmit = async (data: any) => {
    await onSubmit(data)
    form.reset()
    props.onClose()
  }
  return (
    <Modal {...props}>
      <ModalForm onClose={props.onClose} onSubmit={form.onSubmit(handleSubmit)} loading={loading}>
        {type === "delete"
          ? <Text>Are you sure to delete {data?.name}</Text>
          : (
            <Stack>
              <TextInput
                {...form.getInputProps("name", {withFocus: true})}
                label={"Name"}
                required
                data-autofocus
              />
              <TextInput
                {...form.getInputProps("description")}
                label={"Description"}
              />
            </Stack>
          )
        }

      </ModalForm>
    </Modal>
  )
}
