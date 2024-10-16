import {Box} from "@mantine/core";
import classes from "./style.module.css";
import {Helmet} from "react-helmet-async";
import ScrollSpy from "react-ui-scrollspy";
import HeroNode from "@/screens/Home/Main/HeroNode";

export default function Main() {
  return (
    <ScrollSpy activeClass={"activeScroll"} scrollThrottle={60} useBoxMethod={false}>
      <Box className={classes.box} id="first_look">
        <Helmet>
          <title>Your One-Stop Solution for Entity Relation Diagram</title>
        </Helmet>
        <HeroNode/>
      </Box>
    </ScrollSpy>
  );
}
