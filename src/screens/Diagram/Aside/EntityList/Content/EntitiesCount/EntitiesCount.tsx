import { Group, Tooltip, CloseButton, Text } from "@mantine/core";
import { FC, memo } from "react";

interface Props {
    count: number
    onClose: () => void
}

export const EntitiesCount: FC<Props> = memo(({ count, onClose }) => {
    return (
        <Group w={"100%"} justify={"space-between"}>
            <Text>
                {count} {count === 1 ? "entity" : "entities"}
            </Text>
            <Tooltip label={"Close"}>
                <CloseButton onClick={onClose} />
            </Tooltip>
        </Group>
    )
})