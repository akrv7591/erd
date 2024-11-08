import {Grid} from "@mantine/core";
import {Skeleton} from "@mantine/core";
import {memo} from "react";

interface Props {
  count: number
}
export const TeamSkeleton = memo((props: Props) => {
  return Array.from({length: props.count}).map((_, i) => (
    <Grid key={i} w={"100%"} gutter={"xs"} pr={"10px"} align={"center"} mt={20} opacity={(props.count - i)/10}>
      <Grid.Col span={2}>
        <Skeleton circle height={"35px"} animate/>
      </Grid.Col>
      <Grid.Col  span={8}>
        <Skeleton height={"35px"} animate/>
      </Grid.Col>
      <Grid.Col  span={2}>
        <Skeleton width={"35px"} height={"35px"} animate/>
      </Grid.Col>
    </Grid>

  ))
})
