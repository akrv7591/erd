import ZoomIn from "@/screens/Playground/Navbar/PlaygroundPaneControls/ZoomIn.tsx";
import ZoomOut from "@/screens/Playground/Navbar/PlaygroundPaneControls/ZoomOut.tsx";
import FitView from "@/screens/Playground/Navbar/PlaygroundPaneControls/FitView.tsx";

export default function PlaygroundPaneControls() {
  return (
    <>
      <ZoomIn />
      <ZoomOut />
      <FitView />
    </>
  )
}
