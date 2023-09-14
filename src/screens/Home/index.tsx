import {Button} from "@mantine/core";
import {Link} from "react-router-dom";
import React from "react";

export default function Index () {
  return (
    <Link to={"erd"}>
      <Button>Erd</Button>
    </Link>
  )
}
