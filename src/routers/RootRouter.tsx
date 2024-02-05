import {createBrowserRouter, createRoutesFromElements, Outlet, Route} from "react-router-dom";
import AuthLayout from "@/components/layouts/AuthLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Home from "@/screens/Home/Home.tsx";



export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path={""} element={<Outlet/>}>
      {/*Home*/}
      <Route index element={<Home/>}/>

      {/*Auth*/}
      <Route path={"auth"} element={<AuthLayout/>}>
        <Route path={""} lazy={() => import("@/screens/Auth/Signin")}/>
        <Route path={"sign-up"} lazy={() => import("@/screens/Auth/Signup")}/>
      </Route>

      {/*Library*/}
      <Route path={"library"} element={<ProtectedRoute/>}>
        <Route path={""} lazy={() => import("@/screens/Library")} />
        <Route path={":erdId"} lazy={() => import("@/screens/Playground")} />
      </Route>

      {/*Verify Email*/}
      <Route path={"verify-email/:emailUuid"} lazy={() => import("@/screens/VerifyEmail")}/>

      {/*Privacy and Policy*/}
      <Route path={"privacy-policy"} lazy={() => import("@/screens/PrivacyPolicy")}/>

      {/*Terms and Conditions*/}
      <Route path={"terms"} lazy={() => import("@/screens/TermsOfService")}/>

      <Route path={"team/:joinTeamId/join"} element={<ProtectedRoute/>}>
        <Route index lazy={() => import("@/screens/JoinTeam")}/>
      </Route>

      {/*Not found*/}
      <Route path={"*"} lazy={() => import("@/screens/NotFound")}/>
    </Route>
  )
)

