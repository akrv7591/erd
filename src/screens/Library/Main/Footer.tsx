import {memo} from "react";
import {Button, Flex, Group, Pagination, Tooltip} from "@mantine/core";
import {IconTrash} from "@tabler/icons-react";
import {PaginationUtil} from "@/utility/PaginationUtil.ts";
import {useLibraryStore} from "@/stores/useLibrary.ts";
import {IListQuery} from "@/hooks/useListQuery.ts";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {deleteErdApi} from "@/api/erd.ts";
import ButtonWithConfirm from "@/components/common/ButtonWithConfirm";
import {notifications} from "@mantine/notifications";
import {IErd} from "@/types/data/db-model-interfaces";

interface Props {
  total: number
  params: IListQuery
  setParams: (params: Partial<IListQuery>) => void
}

const Footer = memo((props: Props) => {
  const checkedErds = useLibraryStore(state => state.checkedErds)
  const clearCheckedErds = useLibraryStore(state => state.clearCheckedErds)
  const queryClient = useQueryClient()
  const deleteMutation = useMutation({
    mutationFn: async (erds: IErd[]) => Promise.all(erds.map(erd => deleteErdApi(erd.id))),
    onSuccess: () => {
      clearCheckedErds()

      queryClient.refetchQueries({
        queryKey: ['erdList'],
      })

      notifications.show({
        title: "Erd",
        message: "Erd deleted successfully",
      })
    },
    onError: () => {
      notifications.show({
        title: "Erd",
        message: "Failed to delete erd",
        color: "red"
      })
    }
  })

  return (
    <Group mt={"auto"} justify={"space-between"}>
      <Tooltip label={checkedErds.length === 0 ? "Please select at least one erd" : "Delete selected erds"}>
        <ButtonWithConfirm
          target={(
            <Button variant={"filled"} color={"red"} disabled={checkedErds.length === 0} leftSection={<IconTrash/>}>
              Delete
            </Button>
          )}
          message={"Are you sure to delete selected erds?"}
          onConfirm={() => deleteMutation.mutate(checkedErds)}/>
      </Tooltip>
      <Flex flex={1} justify={"center"}>
        <Pagination
          value={props.params.offset / props.params.limit + 1}
          total={PaginationUtil.getPageCount(props.params, props.total)}
          onChange={(page => props.setParams({offset: PaginationUtil.getOffset(props.params, page)}))}
        />
      </Flex>
    </Group>
  )
})

export default Footer
