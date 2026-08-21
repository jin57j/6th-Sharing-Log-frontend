import {
  House,
  MapPin,
  ShieldCheck,
} from "lucide-react";

import HouseDangerZone from "./HouseDangerZone";
import HouseInformationEditor from "./HouseInformationEditor";
import InformationRow from "./InformationRow";

function AccountHouseInformation({
  house,
  onUpdated,
  actions,
}) {
  return (
    <section className="rounded-2xl border border-[#1A1428]/10 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2">
        <House
          size={21}
          aria-hidden="true"
        />

        <h2 className="text-lg font-black">
          하우스 정보
        </h2>
      </div>

      <p className="mt-1 text-sm leading-6 text-[#8B8575]">
        현재 선택한 하우스의 정보와 내 역할을 확인할 수
        있어요.
      </p>

      {house ? (
        <>
          <div className="mt-5">
            {house.role === "OWNER" ? (
              <HouseInformationEditor
                key={house.groupPublicId}
                house={house}
                onUpdated={onUpdated}
              />
            ) : (
              <>
                <InformationRow
                  icon={House}
                  label="하우스 이름"
                  value={house.groupName}
                />

                <InformationRow
                  icon={MapPin}
                  label="주소"
                  value={
                    house.groupAddress ||
                    "등록된 주소가 없어요"
                  }
                />
              </>
            )}

            <InformationRow
              icon={ShieldCheck}
              label="내 역할"
              value={
                house.role === "OWNER"
                  ? "관리자"
                  : "멤버"
              }
            />
          </div>

          <HouseDangerZone
            house={house}
            {...actions}
          />
        </>
      ) : (
        <p className="mt-5 rounded-xl bg-[#F8F4EE] px-4 py-5 text-center text-sm font-semibold text-[#8B8575]">
          참여 중인 하우스가 없어요.
        </p>
      )}
    </section>
  );
}

export default AccountHouseInformation;
