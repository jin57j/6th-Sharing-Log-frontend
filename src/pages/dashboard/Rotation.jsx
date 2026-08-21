import { useOutletContext } from "react-router";

import ChoreCalendarView from "../../components/rotation/ChoreCalendarView";
import RotationOverview from "../../components/rotation/RotationOverview";
import useRotationPage from "../../hooks/useRotationPage";

function Rotation() {
  const { activeGroup } = useOutletContext();
  const page = useRotationPage(activeGroup);

  if (page.calendar) {
    return <ChoreCalendarView {...page.calendar} />;
  }

  return <RotationOverview {...page.overview} />;
}

export default Rotation;
