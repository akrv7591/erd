import {memo, MouseEventHandler} from "react";
import type {Erd} from "@/types/data/db-model-interfaces.ts";
import {ActionIcon, Badge, Card, Center, Group, Image, Overlay, Text, Tooltip} from "@mantine/core";
import LogoSquare from "@/assets/svgs/logo-square-custom.svg"
import {useHover} from "@mantine/hooks";
import {IconGlobe, IconLock, IconSettings, IconTable, IconTrash} from "@tabler/icons-react";
import classes from "./style.module.css";
import {useModal} from "@/hooks/useModal.ts";
import {ErdModal} from "@/screens/Library/Main/ErdModal";
import {Link} from "react-router-dom";
import {ResourceProvider} from "@/components/common/ResourceProvider/ResourceProvider.tsx";


interface Props {
  data: Erd
}

export const ErdItem = memo(({data}: Props) => {
  const {hovered, ref} = useHover()
  const modal = useModal<Erd>({
    initialType: "update",
    initialOpen: false,
    baseTitle: data.name,
    initialData: data
  })
  const handleEditModalOpen: MouseEventHandler = (e) => {
    e.stopPropagation()
    e.preventDefault()
    modal.open({type: "update"})
  }
  const handleDeleteModalOpen: MouseEventHandler = (e) => {
    e.stopPropagation()
    e.preventDefault()
    modal.open({type: "delete"})
  }

  return (
    <Card p={0} classNames={{root: classes.root}}>
      <ErdModal {...modal.modalProps} />
      <Link to={data.id} state={{erd: data}}>
        <div className={classes.imgContainer} ref={ref}>
          {data.thumbnailId ? (
            <ResourceProvider
              name={"StaticFile"}
              resourceId={data.thumbnailId}
              renderer={(thumbnail) => (
                <Image className={classes.img} src={thumbnail.url} fallbackSrc={LogoSquare}/>
              )}
            />
          ) : (
            <Image className={classes.imgEmpty} src={null} fallbackSrc={LogoSquare}/>
          )}

          {hovered && (
            <Overlay blur={1} opacity={10} px={"md"} color={"#000"} radius={"xs"}>
              <Center h={"100%"}>
                <Text>{data.description || "No description"}</Text>
              </Center>
            </Overlay>
          )}
          <div className={classes.header}>
            <Tooltip label={"Entity count"}>
              <Badge
                variant={"default"}
                size={"md"}
                radius={"lg"}
                leftSection={(<IconTable size={"1rem"}/>)}
              >
                {data.entityCount}
              </Badge>
            </Tooltip>
            <Badge
              variant={"default"}
              size={"md"}
              radius={"lg"}
              leftSection={(
                data.isPublic ? <IconGlobe size={15}/> : <IconLock size={15}/>
              )}
            >
              {data.isPublic ? "Public" : "Private"}
            </Badge>
            <ActionIcon ml={"auto"} variant={"default"} size={"sm"} onClick={handleEditModalOpen}>
              <IconSettings size={15}/>
            </ActionIcon>
            <ActionIcon variant={"default"} size={"sm"} onClick={handleDeleteModalOpen}>
              <IconTrash size={15}/>
            </ActionIcon>
          </div>
        </div>
      </Link>
      <Group className={classes.titleContainer}>
        <Text size={"xl"} fw={600}>{data.name}</Text>
      </Group>
    </Card>
  )
})
