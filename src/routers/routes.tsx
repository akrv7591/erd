import {createBrowserRouter, createRoutesFromElements, Route} from "react-router-dom";
import {ProtectedRoute} from "@/components/auth/ProtectedRoute";
import Home from "@/screens/Home";
import NotFound from "@/screens/NotFound";
import {Library} from "@/screens/Library";
import VerifyEmail from "@/screens/VerifyEmail";
import PrivacyPolicy from "@/screens/PrivacyPolicy";
import TermsOfService from "@/screens/TermsOfService";
import JoinTeam from "@/screens/JoinTeam";
import {Playground} from "@/screens/Playground";
import ProfileSetting from "@/screens/ProfileSetting"
import {LogToCallback} from "@/screens/LogToCallback/LogToCallback";
import {ReactFlowProvider} from "@xyflow/react";
import {DiagramProvider} from "@/providers/DiagramProvider";


export const routes = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/*Home*/}
      <Route index element={<Home/>}/>

      <Route path={"profile"} element={<ProtectedRoute/>}>
        <Route index element={<ProfileSetting/>}/>
        <Route path={"setting"} element={<ProfileSetting/>}/>
      </Route>

      {/*Library*/}
      <Route path={"library"} element={<ProtectedRoute/>}>
        <Route index element={<Library/>}/>
        <Route path={":erdId/*"} element={(
          <ReactFlowProvider defaultNodes={[]} defaultEdges={[]}>
            <DiagramProvider>
              <Playground/>
            </DiagramProvider>
          </ReactFlowProvider>
        )}/>
      </Route>

      {/*Verify Email*/}
      <Route path={"verify-email/:emailUuid"} element={<VerifyEmail/>}/>

      {/*Privacy and Policy*/}
      <Route path={"privacy-policy"} element={<PrivacyPolicy/>}/>

      {/*Terms and Conditions*/}
      <Route path={"terms"} element={<TermsOfService/>}/>

      <Route path={"team-invitations/:invitationId/join"} element={<ProtectedRoute/>}>
        <Route index element={<JoinTeam/>}/>
      </Route>

      {/*LogTo callback */}
      <Route path={"callback"} element={<LogToCallback/>}/>

      {/*Not found*/}
      <Route path={"*"} element={<NotFound/>}/>
    </>
  )
)
