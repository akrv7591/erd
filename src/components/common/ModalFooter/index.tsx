import {Button, Grid} from "@mantine/core";

interface Props {
  onClose: () => void
}

export default function ModalFooter(props: Props) {
  return (
    <Grid mt={20}>
      <Grid.Col span={6}>
        <Button fullWidth color={"gray"} onClick={props.onClose}>Cancel</Button>
      </Grid.Col>
      <Grid.Col span={6}>
        <Button fullWidth type={"submit"} >Submit</Button>
      </Grid.Col>
    </Grid>
  )
}
