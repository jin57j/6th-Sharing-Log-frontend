import { useOutletContext } from "react-router";

import SubstituteRequestModal from "../../components/common/SubstituteRequestModal";
import HomeWeeklyTasks from "../../components/home/HomeWeeklyTasks";
import useHomePage from "../../hooks/useHomePage";
import Calendar from "./Calendar";

function Home() {
  const { activeGroup } = useOutletContext();
  const page = useHomePage(activeGroup);

  return (
    <div className="min-h-screen bg-[#F7F4EF] px-5 py-10">
      <div className="mx-auto max-w-4xl">
        <HomeWeeklyTasks {...page.weeklyTasks} />
        <Calendar embedded />

        {page.substituteModal && (
          <SubstituteRequestModal {...page.substituteModal} />
        )}
      </div>
    </div>
  );
}

export default Home;
