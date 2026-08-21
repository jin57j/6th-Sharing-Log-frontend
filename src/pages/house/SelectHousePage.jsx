import OnboardingShell from "../../components/OnboardingShell";
import HouseAddActions from "../../components/house/HouseAddActions";
import HouseSelectionList from "../../components/house/HouseSelectionList";
import SelectHouseHeader from "../../components/house/SelectHouseHeader";
import useSelectHousePage from "../../hooks/useSelectHousePage";

function SelectHousePage() {
  const page = useSelectHousePage();

  return (
    <OnboardingShell>
      <div className="relative w-full max-w-sm">
        <SelectHouseHeader />
        <HouseSelectionList
          groups={page.groups}
          isLoading={page.isLoading}
          errorMessage={page.errorMessage}
          onSelectGroup={page.onSelectGroup}
        />
        <HouseAddActions />
      </div>
    </OnboardingShell>
  );
}

export default SelectHousePage;
