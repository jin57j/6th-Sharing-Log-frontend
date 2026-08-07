import {
  useEffect,
  useState,
} from "react";

import { getCsrfToken } from "../api/authApi";
import {
  cancelReservation,
  createReservation,
  createSpace,
  deleteSpace,
  getReservations,
  getSpaces,
} from "../api/reservationApi";
import { getToday } from "../utils/date";

export default function useReservation(
  groupId,
) {
  const today = getToday();

  const [spaces, setSpaces] =
    useState([]);

  const [
    selectedSpaceId,
    setSelectedSpaceId,
  ] = useState("");

  const [
    selectedDate,
    setSelectedDate,
  ] = useState(today);

  const [
    reservations,
    setReservations,
  ] = useState([]);

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [
    deletingSpaceId,
    setDeletingSpaceId,
  ] = useState("");

  // 화면에 들어오거나 하우스가 변경되면
  // 현재 하우스의 공간 목록을 조회합니다.
  useEffect(() => {
    if (!groupId) {
      return;
    }

    let cancelled = false;

    async function loadSpaces() {
      try {
        const spaceList =
          await getSpaces(groupId);

        if (cancelled) {
          return;
        }

        setSpaces(spaceList);

        if (spaceList.length > 0) {
          setSelectedSpaceId(
            String(
              spaceList[0].spaceId,
            ),
          );
        } else {
          setSelectedSpaceId("");
          setReservations([]);
        }
      } catch (error) {
        if (!cancelled) {
          setMessage(
            error.message ??
              "공간 목록을 불러오지 못했습니다.",
          );
        }
      }
    }

    loadSpaces();

    return () => {
      cancelled = true;
    };
  }, [groupId]);

  // 선택한 날짜 또는 공간이 변경되면
  // 예약 목록을 다시 조회합니다.
  useEffect(() => {
    if (
      !groupId ||
      !selectedSpaceId
    ) {
      return;
    }

    let cancelled = false;

    async function loadReservations() {
      setLoading(true);
      setMessage("");

      try {
        const reservationList =
          await getReservations({
            groupId,
            date: selectedDate,
            spaceId:
              selectedSpaceId,
          });

        if (!cancelled) {
          setReservations(
            reservationList,
          );
        }
      } catch (error) {
        if (!cancelled) {
          setMessage(
            error.message ??
              "예약 목록을 불러오지 못했습니다.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadReservations();

    return () => {
      cancelled = true;
    };
  }, [
    groupId,
    selectedDate,
    selectedSpaceId,
  ]);

  // 새로운 공간 추가
  async function handleAddSpace(name) {
    const normalizedName =
      name.trim();

    if (!normalizedName) {
      setMessage(
        "공간 이름을 입력해 주세요.",
      );

      return;
    }

    if (!groupId) {
      setMessage(
        "하우스 정보를 불러오지 못했습니다.",
      );

      return;
    }

    try {
      setMessage("");

      const csrf =
        await getCsrfToken();

      const newSpace =
        await createSpace({
          groupId,
          name: normalizedName,
          csrf,
        });

      setSpaces(
        (currentSpaces) => [
          ...currentSpaces,
          newSpace,
        ],
      );

      setSelectedSpaceId(
        String(newSpace.spaceId),
      );

      setMessage(
        `${newSpace.name} 공간을 추가했습니다.`,
      );
    } catch (error) {
      if (error.status === 409) {
        setMessage(
          "이미 같은 이름의 공간이 있습니다.",
        );

        return;
      }

      setMessage(
        error.message ??
          "공간을 추가하지 못했습니다.",
      );
    }
  }

  // 예약 공간 삭제
  async function handleDeleteSpace(
    space,
  ) {
    if (
      !groupId ||
      !space?.spaceId
    ) {
      setMessage(
        "삭제할 공간 정보를 확인하지 못했습니다.",
      );

      return;
    }

    const shouldDelete =
      window.confirm(
        `"${space.name}" 공간을 삭제할까요?\n삭제한 공간은 예약 목록에서 더 이상 선택할 수 없어요.`,
      );

    if (!shouldDelete) {
      return;
    }

    const targetSpaceId =
      String(space.spaceId);

    try {
      setMessage("");
      setDeletingSpaceId(
        targetSpaceId,
      );

      const csrf =
        await getCsrfToken();

      await deleteSpace({
        groupId,
        spaceId: space.spaceId,
        csrf,
      });

      const remainingSpaces =
        spaces.filter(
          (currentSpace) =>
            String(
              currentSpace.spaceId,
            ) !== targetSpaceId,
        );

      setSpaces(remainingSpaces);

      // 현재 선택 중인 공간을 삭제했다면
      // 남은 첫 번째 공간을 선택합니다.
      if (
        String(selectedSpaceId) ===
        targetSpaceId
      ) {
        const nextSpaceId =
          remainingSpaces.length > 0
            ? String(
                remainingSpaces[0]
                  .spaceId,
              )
            : "";

        setSelectedSpaceId(
          nextSpaceId,
        );

        setReservations([]);
      }

      setMessage(
        `${space.name} 공간을 삭제했습니다.`,
      );
    } catch (error) {
      if (error.status === 401) {
        setMessage(
          "로그인이 만료되었습니다. 다시 로그인해 주세요.",
        );

        return;
      }

      if (error.status === 403) {
        setMessage(
          "이 공간을 삭제할 권한이 없습니다.",
        );

        return;
      }

      setMessage(
        error.message ??
          "공간을 삭제하지 못했습니다.",
      );
    } finally {
      setDeletingSpaceId("");
    }
  }

  // 새로운 예약 생성
  async function handleReservation({
    selectedSpaceId: inputSpaceId,
    selectedDate: inputDate,
    startTime,
    endTime,
  }) {
    setSelectedDate(inputDate);

    if (!groupId) {
      setMessage(
        "하우스 정보를 불러오지 못했습니다.",
      );

      return;
    }

    if (!inputSpaceId) {
      setMessage(
        "예약할 공간을 선택해 주세요.",
      );

      return;
    }

    if (inputDate < today) {
      setMessage(
        "지난 날짜는 예약할 수 없습니다.",
      );

      return;
    }

    try {
      setMessage("");

      const csrf =
        await getCsrfToken();

      const newReservation =
        await createReservation({
          groupId,
          spaceId: inputSpaceId,
          date: inputDate,
          startTime,
          endTime,
          csrf,
        });

      setReservations(
        (currentReservations) =>
          [
            ...currentReservations,
            newReservation,
          ].sort(
            (first, second) =>
              first.startTime.localeCompare(
                second.startTime,
              ),
          ),
      );

      setMessage(
        "예약을 등록했습니다.",
      );
    } catch (error) {
      // 409 Conflict는 이미 예약된 시간과 겹친다는 의미입니다.
      if (error.status === 409) {
        setMessage(
          "이미 예약된 시간입니다. 다른 시간을 선택해 주세요.",
        );

        return;
      }

      setMessage(
        error.message ??
          "예약을 등록하지 못했습니다.",
      );
    }
  }

  // 본인의 예약 취소
  async function handleCancel(
    reservation,
  ) {
    const shouldCancel =
      window.confirm(
        `${reservation.startTime} ~ ${reservation.endTime} 예약을 취소할까요?`,
      );

    if (!shouldCancel) {
      return;
    }

    if (!groupId) {
      setMessage(
        "하우스 정보를 불러오지 못했습니다.",
      );

      return;
    }

    try {
      setMessage("");

      const csrf =
        await getCsrfToken();

      await cancelReservation({
        groupId,
        reservationId:
          reservation.reservationId,
        version:
          reservation.version,
        csrf,
      });

      setReservations(
        (currentReservations) =>
          currentReservations.filter(
            (item) =>
              item.reservationId !==
              reservation.reservationId,
          ),
      );

      setMessage(
        "예약을 취소했습니다.",
      );
    } catch (error) {
      setMessage(
        error.message ??
          "예약을 취소하지 못했습니다.",
      );
    }
  }

  return {
    today,

    spaces,
    selectedSpaceId,
    setSelectedSpaceId,

    selectedDate,
    setSelectedDate,

    reservations,
    loading,
    message,

    deletingSpaceId,

    handleAddSpace,
    handleDeleteSpace,
    handleReservation,
    handleCancel,
  };
}