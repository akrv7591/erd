import {createBrowserRouter, createRoutesFromElements, Outlet, Route} from "react-router-dom";
import SignIn from "@/screens/Auth/Signin";
import SignUp from "@/screens/Auth/Signup";
import AuthLayout from "@/components/layouts/AuthLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Home from "@/screens/Home";
import NotFound from "@/screens/NotFound";
import Library from "@/screens/Library";
import VerifyEmail from "@/screens/VerifyEmail";
import PrivacyPolicy from "@/screens/PrivacyPolicy";
import TermsOfService from "@/screens/TermsOfService";
import JoinTeam from "@/screens/JoinTeam";
import Playground from "@/screens/Playground";


export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path={""} element={<Outlet/>}>
      {/*Home*/}
      <Route index element={<Home/>}/>

      {/*Auth*/}
      <Route path={"auth"} element={<AuthLayout/>}>
        <Route index element={<SignIn/>}/>
        <Route path={"sign-up"} element={<SignUp/>}/>
      </Route>

      {/*Library*/}
      <Route path={"library"} element={<ProtectedRoute/>}>
        <Route index element={<Library/>}/>
        <Route path={":erdId"} element={<Playground/>}/>
      </Route>

      {/*Verify Email*/}
      <Route path={"verify-email/:emailUuid"} element={<VerifyEmail/>}/>

      {/*Privacy and Policy*/}
      <Route path={"privacy-policy"} element={<PrivacyPolicy/>}/>

      {/*Terms and Conditions*/}
      <Route path={"terms"} element={<TermsOfService/>}/>

      <Route path={"team/:joinTeamId/join"} element={<ProtectedRoute/>}>
        <Route index element={<JoinTeam/>}/>
      </Route>

      {/*Not found*/}
      <Route path={"*"} element={<NotFound/>}/>
    </Route>
  )
)

