import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { getMyGroups } from "../api/groupApi";
import { saveActiveGroupId } from "../utils/activeGroup";

export default function useSelectHousePage() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadGroups() {
      try {
        setIsLoading(true);
        setErrorMessage("");
        const myGroups = await getMyGroups();

        if (!cancelled) {
          setGroups(myGroups);
        }
      } catch (error) {
        if (cancelled) {
          return;
        }

        if (error.status === 401) {
          navigate("/", { replace: true });
          return;
        }

        setErrorMessage(
          error.message ?? "하우스 목록을 불러오지 못했습니다.",
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

  function selectGroup(group) {
    saveActiveGroupId(group.groupPublicId);
    navigate("/home", { replace: true });
  }

  return {
    groups,
    isLoading,
    errorMessage,
    onSelectGroup: selectGroup,
  };
}
