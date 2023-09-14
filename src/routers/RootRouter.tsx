import {createBrowserRouter} from "react-router-dom";
import Home from "screens/Home";
import ErdLayout from "components/layouts/ErdLayout";
import Erd from "screens/Erd";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <ErdLayout/>,
    children: [
      {
        index: true,
        element: <Home/>
      },
      {
        path: "erd",
        element: <Erd/>
      }
    ]
  }
])
