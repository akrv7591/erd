import {createBrowserRouter, Outlet, RouteObject} from "react-router-dom";
// import Erd from "../screens/ErdDiagram";
import Erd from "../screens/ErdDiagramTest";
import HomeLayout from "../components/layouts/HomeLayout";
import ErdListLayout from "../components/layouts/ErdListLayout";
import ErdProvider from "../providers/ErdProvider";
import ErdLayout from "../components/layouts/ErdLayout";
import SignIn from "../screens/Auth/SignIn";
import SignUp from "../screens/Auth/SignUp";

import AuthLayout from "../components/layouts/AuthLayout";
import SendEmailVerification from "../screens/Auth/SendEmailVerification";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import Home from "../screens/Home/Home";
import NotFound from "../screens/NotFound";
import ErdList from "../screens/ErdList";
import ErdDiagramLayout from "../components/layouts/ErdDiagramLayout";

const NotFoundRoute: RouteObject = {
  path: "*",
  element: <NotFound/>
}

export const router = createBrowserRouter(
  [
    {
      path: "",
      element: <HomeLayout/>,
      children: [
        {
          index: true,
          element: <Home/>
        },
        NotFoundRoute
      ]
    },
    {
      path: "auth",
      element: <AuthLayout/>,
      children: [
        {
          index: true,
          element: <SignIn/>
        }, {
          path: "sign-up",
          element: <Outlet/>,
          children: [
            {
              index: true,
              element: <SignUp/>
            }, {
              path: "send-email-verification",
              element: <SendEmailVerification/>
            }
          ]
        },

        NotFoundRoute
      ]
    },
    {
      path: "erd",
      element: (
        <ProtectedRoute>
          <ErdLayout/>
        </ProtectedRoute>
      ),
      children:
        [
          {
            path: "",
            element: <ErdListLayout/>,
            children: [
              {
                index: true,
                element: <ErdList/>
              },
              NotFoundRoute
            ]
          },
          {
            path: ":erdUuid",
            element: (
              <ErdProvider>
                <ErdDiagramLayout/>
              </ErdProvider>
            ),
            children:
              [
                {
                  index: true,
                  element: <Erd/>
                },
                NotFoundRoute
              ]
          },
          NotFoundRoute
        ]
    }
  ])

