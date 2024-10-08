import {getRoleDescription, roleData} from "@/utility/RoleUtils.ts";
import {Badge, Skeleton, Tooltip} from "@mantine/core";
import {memo} from "react";
import {useQuery} from "@tanstack/react-query";
import {userTeamApi} from "@/api/team.ts";
import {IconError404} from "@tabler/icons-react";
import {useAuthStore} from "@/stores/useAuthStore.ts";

interface Props {
  teamId: string
}

const Role = memo((props: Props) => {
  const user = useAuthStore(state => state.user)
  const {status, data} = useQuery({
    queryKey: [props.teamId, user.id],
    queryFn: userTeamApi
  })

  switch (status) {
    case "pending":
      return <Skeleton animate height={"20px"} width={"50px"}/>
    case "error":
      return <IconError404/>
    default:
      const role = roleData.find(role => role.value === data.role)

      return (
        <Tooltip label={getRoleDescription(role?.value!)}>
          <Badge variant={"default"}>{role?.label}</Badge>
        </Tooltip>
      )
  }
})

export default Role
