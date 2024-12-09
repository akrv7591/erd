import {Button, Container, Image, List, rem, Text, ThemeIcon, Title} from "@mantine/core";
import {PROJECT} from "@/constants/project";
import {IconCheck} from "@tabler/icons-react";
import classes from "./style.module.css";

export const Hero = () => {
  return (
    <Container size={"xl"}>
      <div className={classes.inner}>
        <div className={classes.content}>
          <Title className={classes.title}>
            An <span className={classes.highlight}>{PROJECT.NAME},</span> <br /> Design Databases Smarter and Faster!
          </Title>
          <Text c="dimmed" mt="md">
            Powerful Tools to Create and Manage Database Diagrams Effortlessly.
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
          <div className={classes.btnContainer}>
            <Button fullWidth size={"lg"} variant={"filled"}>Get started</Button>
          </div>
        </div>
        <Image src={"/images/hero-image-transparent.png"} className={classes.image} />
      </div>
    </Container>
  )
}
