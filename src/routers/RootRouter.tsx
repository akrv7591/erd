import {createBrowserRouter, createRoutesFromElements, Outlet, Route} from "react-router-dom";
import AuthLayout from "@/components/layouts/AuthLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Home from "@/screens/Home"

const Signin = () => import("@/screens/Auth/Signin")
const Signup = () => import("@/screens/Auth/Signup")
const Library = () => import("@/screens/Library")
const Playground = () => import("@/screens/Playground")
const VerifyEmail = () => import("@/screens/VerifyEmail")
const PrivacyPolicy = () => import("@/screens/PrivacyPolicy")
const TermsAndConditions = () => import("@/screens/TermsOfService")
const JoinTeam = () => import("@/screens/JoinTeam")
const NotFound = () => import("@/screens/NotFound")

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path={""} element={<Outlet/>}>
      {/*Home*/}
      <Route index element={<Home />}/>

      {/*Auth*/}
      <Route path={"auth"} element={<AuthLayout/>}>
        <Route path={""} lazy={Signin}/>
        <Route path={"sign-up"} lazy={Signup}/>
      </Route>

      {/*Library*/}
      <Route path={"library"} element={<ProtectedRoute/>}>
        <Route path={""} lazy={Library} />
        <Route path={":erdId"} lazy={Playground} />
      </Route>

      {/*Verify Email*/}
      <Route path={"verify-email/:emailUuid"} lazy={VerifyEmail}/>

      {/*Privacy and Policy*/}
      <Route path={"privacy-policy"} lazy={PrivacyPolicy}/>

      {/*Terms and Conditions*/}
      <Route path={"terms"} lazy={TermsAndConditions}/>

      <Route path={"team/:joinTeamId/join"} element={<ProtectedRoute/>}>
        <Route index lazy={JoinTeam}/>
      </Route>

      {/*Not found*/}
      <Route path={"*"} lazy={NotFound}/>
    </Route>
  )
)

