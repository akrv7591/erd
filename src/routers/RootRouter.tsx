import {createBrowserRouter, Outlet, RouteObject} from "react-router-dom";
import Erd from "../screens/ErdDiagram";
import HomeLayout from "../components/layouts/HomeLayout";
import LibraryLayout from "../components/layouts/LibraryLayout";
import ErdLayout from "../components/layouts/ErdLayout";
import SignIn from "../screens/Auth/SignIn";
import SignUp from "../screens/Auth/SignUp";
import AuthLayout from "../components/layouts/AuthLayout";
import SendEmailVerification from "../screens/Auth/SendEmailVerification";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import Home from "../screens/Home/Home";
import NotFound from "../screens/NotFound";
import Library from "../screens/Library";
import ErdDiagramLayout from "../components/layouts/ErdDiagramLayout";
import VerifyEmail from "../screens/VerifyEmail";
import PasswordOTP from "../screens/PasswordOTP.tsx";
import MultiplayerProvider from "../providers/MultiplayerProvider.tsx";

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
      path: "library",
      element: (
        <ProtectedRoute>
          <ErdLayout/>
        </ProtectedRoute>
      ),
      children:
        [
          {
            path: "",
            element: <LibraryLayout/>,
            children: [
              {
                index: true,
                element: <Library/>
              },
              NotFoundRoute
            ]
          }, {}, {
          path: ":erdId",
          element: (
            <MultiplayerProvider>
                <ErdDiagramLayout/>
            </MultiplayerProvider>
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
    },
    {
      path: "verify-email/:emailUuid",
      element: <VerifyEmail/>
    },
    {
      path: "password-otp",
      element: <PasswordOTP />
    }
  ])

