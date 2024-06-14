import {ZoomIn} from "./ZoomIn";
import {ZoomOut} from "./ZoomOut";
import {FitView} from "./FitView";
import {FullScreenView} from "./FullScreenView";

export const PaneControls = () => {
  return (
    <>
      <ZoomIn />
      <ZoomOut />
      <FitView />
      <FullScreenView />
    </>
  )
}
