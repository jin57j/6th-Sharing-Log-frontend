import { useOutletContext } from "react-router";

import AccountHouseInformation from "../../components/account/AccountHouseInformation";
import AccountPageHeader from "../../components/account/AccountPageHeader";
import AccountUserInformation from "../../components/account/AccountUserInformation";
import DeleteHouseModal from "../../components/account/DeleteHouseModal";
import NotificationSettingsSection from "../../components/account/NotificationSettingsSection";
import OtherSettingsSection from "../../components/account/OtherSettingsSection";
import useAccountPage from "../../hooks/useAccountPage";

function AccountPage() {
  const { profile } =
    useOutletContext();

  const page =
    useAccountPage(profile);

  if (page.status.isLoading) {
    return (
      <div className="grid min-h-full place-items-center p-5">
        <p
          role="status"
          className="text-sm font-semibold text-[#8B8575]"
        >
          설정 정보를 불러오는 중이에요...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-full text-[#1A1428]">
      <div className="mx-auto max-w-3xl p-5 pb-8 sm:p-8">
        <AccountPageHeader />

        {page.status.errorMessage && (
          <p
            role="alert"
            className="mt-6 rounded-xl border border-[#E63946]/20 bg-[#E63946]/5 px-4 py-3 text-sm font-semibold leading-6 text-[#E63946]"
          >
            {page.status.errorMessage}
          </p>
        )}

        <div className="mt-8 space-y-5">
          <AccountUserInformation
            {...page.userInformation}
          />

          {page.isOwner && (
            <OtherSettingsSection
              house={page.house}
            />
          )}

          {page.hasSelectedHouse && (
            <NotificationSettingsSection />
          )}

          <AccountHouseInformation
            {...page.houseInformation}
          />
        </div>
      </div>

      {page.deleteModal && (
        <DeleteHouseModal
          {...page.deleteModal}
        />
      )}
    </div>
  );
}

export default AccountPage;
