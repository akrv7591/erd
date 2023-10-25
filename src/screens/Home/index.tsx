import {Button} from "@mantine/core";
import {Link, useNavigate} from "react-router-dom";
import React from "react";
import {useOnMount} from "../../hooks/useOnMount";

export default function Index () {
  const navigate = useNavigate()
  useOnMount(() => {
    navigate("/erd")
  })
  return (
    <Link to={"erd"}>
      <Button>Erd</Button>
    </Link>
  )
}
