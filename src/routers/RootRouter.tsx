import {createBrowserRouter} from "react-router-dom";
import Home from "screens/Home";
import ErdLayout from "components/layouts/ErdDiagramLayout";
import Erd from "../screens/ErdDiagram";
import HomeLayout from "../components/layouts/HomeLayout";
import ErdList from "screens/ErdList";
import ErdListLayout from "../components/layouts/ErdListLayout";
import {ReactFlowProvider} from "reactflow";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout/>,
    children:
      [
        {
          index: true,
          element: <Home/>
        },
        {
          path: "erd",
          element: <ErdListLayout/>,
          children:
            [
              {
                index: true,
                element: <ErdList/>
              }
            ]
        },
        {
          path: "erd/:erdUuid",
          element: (
            <ReactFlowProvider>
              <ErdLayout/>,
            </ReactFlowProvider>
          ),
          children:
            [
              {
                index: true,
                element: <Erd/>
              }
            ]
        }
      ]
  }
])

