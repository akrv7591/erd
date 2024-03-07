import {Button, Group, List, rem, Text, ThemeIcon, Title} from "@mantine/core";
import {PROJECT} from "@/constants/project.ts";
import {IconCheck} from "@tabler/icons-react";
import {Link} from "react-router-dom";
import classes from "./style.module.css";


export default function HeroNode() {
  return (
    <div className={classes.content}>
      <Title className={classes.title}>
        Welcome to
        <Text
          span
          variant="gradient"
          gradient={{from: 'blue', to: 'cyan'}}
          className={classes.highlight}
        >{PROJECT.NAME},
        </Text> <br/> Your One-Stop Solution for Entity Relation Design!
      </Title>
      <Text c="dimmed" mt="md">
        Design, Collaborate, and Generate SQL in Minutes!
      </Text>

      <List
        mt={30}
        spacing="sm"
        size="sm"
        icon={
          <ThemeIcon size={20} radius="xl">
            <IconCheck style={{width: rem(12), height: rem(12)}} stroke={1.5}/>
          </ThemeIcon>
        }
      >
        <List.Item>
          <b>Intuitive Drag-and-Drop Interface</b> – Create entities, attributes, and relationships with a simple
          drag-and-drop motion.
        </List.Item>
        <List.Item>
          <b>Collaboration Made Easy:</b> – Share your ERD designs with team members and get real-time updates.
        </List.Item>
        <List.Item>
          <b>Auto-Generate SQL</b> – Convert your ERD into SQL code with a single click.
        </List.Item>
        <List.Item>
          <b>Save and Export</b> – Save your progress and export your diagrams in multiple formats, including PNG,
          JPEG, and PDF.
        </List.Item>
        <List.Item>
          <b>Templates and Examples</b> – Get started quickly with our built-in templates and example diagrams.
        </List.Item>
      </List>

      <Group mt={30} style={{zIndex: 9999}}>
        <Link to={"library"} state={{destination: "/library"}}>
          <Button radius="xl" size="md" className={classes.control}>
            Get started
          </Button>
        </Link>
      </Group>
    </div>
  )
}
