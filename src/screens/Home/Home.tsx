import {Button, Container, Text, ThemeIcon, Title, List, rem, Group, Image} from "@mantine/core";
import classes from "./style.module.css";
import { IconCheck } from "@tabler/icons-react";
import {Link} from "react-router-dom";
import {PROJECT} from "../../constants/project";
import {Helmet} from "react-helmet-async";

export default function Home() {
  return (
    <Container size="1400">
      <Helmet>
        <title>Home</title>
      </Helmet>
      <div className={classes.inner}>
        <div className={classes.content}>
          <Title className={classes.title}>
            Welcome to <span className={classes.highlight} >{PROJECT.NAME}</span> , <br /> Your One-Stop Solution for ERD Design!
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
                <IconCheck style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
              </ThemeIcon>
            }
          >
            <List.Item>
              <b>Intuitive Drag-and-Drop Interface</b> – Create entities, attributes, and relationships with a simple drag-and-drop motion.
            </List.Item>
            <List.Item>
              <b>Collaboration Made Easy:</b> – Share your ERD designs with team members and get real-time updates.
            </List.Item>
            <List.Item>
              <b>Auto-Generate SQL</b> – Convert your ERD into SQL code with a single click.
            </List.Item>
            <List.Item>
              <b>Save and Export</b> – Save your progress and export your diagrams in multiple formats, including PNG, JPEG, and PDF.
            </List.Item>
            <List.Item>
              <b>Templates and Examples</b> – Get started quickly with our built-in templates and example diagrams.
            </List.Item>
          </List>

          <Group mt={30}>
            <Link to={"library"} state={{destination: "/library"}}>
              <Button radius="xl" size="md" className={classes.control}>
                Get started
              </Button>
            </Link>
            {/*<Button variant="default" radius="xl" size="md" className={classes.control}>*/}
            {/*  Source code*/}
            {/*</Button>*/}
          </Group>
        </div>
        <Image src={null} className={classes.image} width={400} height={400}/>
      </div>
    </Container>
  );
}


