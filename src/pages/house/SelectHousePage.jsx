import {
  useEffect,
  useState,
} from "react";
import {
  Link,
  useNavigate,
} from "react-router";

import { getMyGroups } from "../../api/groupApi";
import OnboardingShell from "../../components/OnboardingShell";
import { saveActiveGroupId } from "../../utils/activeGroup";
import { getHouseEmoji } from "../../utils/houseIcon";

function SelectHousePage() {
  const navigate = useNavigate();

  const [groups, setGroups] =
    useState([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadGroups() {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const myGroups =
          await getMyGroups();

        if (!cancelled) {
          setGroups(myGroups);
        }
      } catch (error) {
        if (cancelled) {
          return;
        }

        if (error.status === 401) {
          navigate("/", {
            replace: true,
          });

          return;
        }

        setErrorMessage(
          error.message ??
            "하우스 목록을 불러오지 못했습니다.",
        );
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadGroups();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  function handleSelectGroup(group) {
    saveActiveGroupId(
      group.groupPublicId,
    );

    navigate("/home", {
      replace: true,
    });
  }

  return (
    <OnboardingShell>
      <div className="relative w-full max-w-sm">
        <header className="mb-7 text-center">
          <h1 className="font-display text-2xl font-black tracking-[-0.03em]">
            하우스를 선택해 주세요
          </h1>

          <p className="mt-2 text-sm text-[#8B8575]">
            입장할 하우스를 선택하거나 새로운 하우스를 추가할 수 있어요
          </p>
        </header>

        {isLoading && (
          <p
            role="status"
            className="mb-5 rounded-2xl bg-white px-4 py-5 text-center text-sm font-semibold text-[#8B8575] shadow-sm"
          >
            가입한 하우스를 불러오는 중이에요...
          </p>
        )}

        {errorMessage && (
          <p
            role="alert"
            className="mb-5 rounded-2xl border border-[#E63946]/20 bg-white px-4 py-4 text-sm font-semibold text-[#E63946]"
          >
            {errorMessage}
          </p>
        )}

        {!isLoading &&
          !errorMessage &&
          groups.length > 0 && (
            <section className="mb-6">
              <h2 className="mb-3 text-sm font-black text-[#1A1428]">
                참여 중인 하우스
              </h2>

              <div className="space-y-2">
                {groups.map((group) => (
                  <button
                    key={
                      group.groupPublicId
                    }
                    type="button"
                    onClick={() =>
                      handleSelectGroup(
                        group,
                      )
                    }
                    className="flex w-full items-center gap-3 rounded-2xl border border-[#1A1428]/10 bg-white p-4 text-left shadow-sm transition hover:border-[#E63946]/40 hover:bg-[#E63946]/5 active:scale-[0.98]"
                  >
                    <span
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#EFEBE2] text-xl"
                      aria-hidden="true"
                    >
                      {getHouseEmoji(group.groupPublicId)}
                    </span>

                    <span className="min-w-0 flex-1">
                      <strong className="block truncate text-sm font-black text-[#1A1428]">
                        {group.groupName}
                      </strong>

                      <span className="mt-1 block truncate text-xs text-[#8B8575]">
                        {group.groupAddress ||
                          "등록된 주소 없음"}
                      </span>
                    </span>

                    <span className="rounded-full bg-[#FFB703]/20 px-2.5 py-1 text-[10px] font-bold text-[#1A1428]">
                      {group.role ===
                      "OWNER"
                        ? "관리자"
                        : "멤버"}
                    </span>

                    <span
                      className="text-lg text-[#E63946]"
                      aria-hidden="true"
                    >
                      ›
                    </span>
                  </button>
                ))}
              </div>
            </section>
          )}

        {!isLoading &&
          !errorMessage &&
          groups.length === 0 && (
            <p className="mb-6 rounded-2xl bg-[#EFEBE2]/70 px-4 py-5 text-center text-sm font-semibold leading-6 text-[#8B8575]">
              아직 참여 중인 하우스가 없어요.
              <br />
              새 하우스를 만들거나 초대코드로 참가해 주세요.
            </p>
          )}

        <section>
          <h2 className="mb-3 text-sm font-black text-[#1A1428]">
            하우스 추가
          </h2>

          <div className="space-y-3">
            <Link
              to="/create-house"
              className="group relative block w-full overflow-hidden rounded-2xl border-2 border-[#E63946] bg-[#E63946] p-5 text-left text-white no-underline shadow-lg transition hover:brightness-95 active:scale-[0.98]"
            >
              <div className="relative flex items-center gap-4">
                <span
                  className="text-3xl"
                  aria-hidden="true"
                >
                  ✨
                </span>

                <span className="min-w-0 flex-1">
                  <strong className="block font-display text-base font-black">
                    새 하우스 만들기
                  </strong>

                  <span className="mt-1 block text-xs text-white/75">
                    하우스 정보를 입력하고 초대코드를 받아요
                  </span>
                </span>

                <span
                  className="text-xl"
                  aria-hidden="true"
                >
                  ›
                </span>
              </div>
            </Link>

            <Link
              to="/join-house"
              className="group relative block w-full overflow-hidden rounded-2xl border-2 border-[#1A1428]/10 bg-white p-5 text-left text-[#1A1428] no-underline shadow-sm transition hover:border-[#06D6A0]/60 hover:bg-[#06D6A0]/5 active:scale-[0.98]"
            >
              <div className="relative flex items-center gap-4">
                <span
                  className="text-3xl"
                  aria-hidden="true"
                >
                  🤝
                </span>

                <span className="min-w-0 flex-1">
                  <strong className="block font-display text-base font-black">
                    초대코드로 참가하기
                  </strong>

                  <span className="mt-1 block text-xs text-[#8B8575]">
                    기존 하우스에 새로운 멤버로 들어가요
                  </span>
                </span>

                <span
                  className="text-xl text-[#06D6A0]"
                  aria-hidden="true"
                >
                  ›
                </span>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </OnboardingShell>
  );
}

export default SelectHousePage;
