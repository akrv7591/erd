import {Button, Grid} from "@mantine/core";

interface Props {
  onClose: () => void
  loading?: boolean
}

export default function ModalFooter(props: Props) {
  return (
    <Grid mt={20}>
      <Grid.Col span={6}>
        <Button fullWidth color={"gray"} onClick={props.onClose}>Cancel</Button>
      </Grid.Col>
      <Grid.Col span={6}>
        <Button fullWidth type={"submit"} loading={props.loading}>Submit</Button>
      </Grid.Col>
    </Grid>
  )
}
