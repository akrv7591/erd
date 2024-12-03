import {createBrowserRouter, createRoutesFromElements, Route} from "react-router-dom";
import {ProtectedRoute} from "@/components/auth/ProtectedRoute";
import {ReactFlowProvider} from "@xyflow/react";
import {DiagramProvider} from "@/providers/DiagramProvider";
import {lazy} from "react";

const Home = lazy(() => import("@/screens/Home"))
const NotFound = lazy(() => import("@/screens/NotFound"))
const Library = lazy(() => import( "@/screens/Library"))
const PrivacyPolicy = lazy(() => import( "@/screens/PrivacyPolicy"))
const TermsOfService = lazy(() => import( "@/screens/TermsOfService"))
const JoinTeam = lazy(() => import( "@/screens/JoinTeam"))
const Diagram = lazy(() => import( "@/screens/Diagram"))
const ProfileSetting = lazy(() => import( "@/screens/ProfileSetting"))
const LogToCallback = lazy(() => import( "@/screens/LogToCallback"))



export const routes = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/*Home*/}
      <Route index element={<Home/>}/>

      {/*Library*/}
      <Route path={"library"} element={<ProtectedRoute/>}>
        <Route index element={<Library/>}/>
        <Route path={":erdId/*"} element={(
          <ReactFlowProvider>
            <DiagramProvider>
              <Diagram/>
            </DiagramProvider>
          </ReactFlowProvider>
        )}/>
      </Route>

      {/*ProfileSetting*/}
      <Route path={"profile"} element={<ProtectedRoute/>}>
        <Route index element={<ProfileSetting/>}/>
        <Route path={"setting"} element={<ProfileSetting/>}/>
      </Route>

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
