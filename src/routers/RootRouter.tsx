import {createBrowserRouter, Outlet} from "react-router-dom";
import Home from "screens/Home";
import ErdLayout from "components/layouts/ErdItemLayout";
import ErdItem from "../screens/ErdItem";
import HomeLayout from "../components/layouts/HomeLayout";
import ErdList from "../screens/Erd";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout/>,
    children: [
      {
        index: true,
        element: <Home/>
      }, {
        path: "erd",
        element: <Outlet/>,
        children: [{
          index: true,
          element: <ErdList/>
        }, {
          path: ":erdUuid",
          element: <ErdLayout/>,
          children: [{
            index: true,
            element: <ErdItem/>
          }]
        }]
      }
    ]
  }
])

