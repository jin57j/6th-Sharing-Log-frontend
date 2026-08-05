import { useEffect, useState } from "react";

import { getCsrfToken } from "../api/authApi";
import {
  cancelReservation,
  createReservation,
  createSpace,
  getReservations,
  getSpaces,
} from "../api/reservationApi";
import { getToday } from "../utils/date";

export default function useReservation(
  groupId,
) {
  const today = getToday();

  const [spaces, setSpaces] = useState([]);

  const [
    selectedSpaceId,
    setSelectedSpaceId,
  ] = useState("");

  const [selectedDate, setSelectedDate] =
    useState(today);

  const [reservations, setReservations] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  // 화면에 들어오면 현재 하우스의 공간 목록을 조회합니다.
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
            String(spaceList[0].spaceId),
          );
        }
      } catch (error) {
        if (!cancelled) {
          setMessage(error.message);
        }
      }
    }

    loadSpaces();

    return () => {
      cancelled = true;
    };
  }, [groupId]);

  // 선택한 날짜 또는 공간이 변경되면 예약을 다시 조회합니다.
  useEffect(() => {
    if (!groupId || !selectedSpaceId) {
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
            spaceId: selectedSpaceId,
          });

        if (!cancelled) {
          setReservations(reservationList);
        }
      } catch (error) {
        if (!cancelled) {
          setMessage(error.message);
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

  // 공간 추가
  async function handleAddSpace(name) {
    const normalizedName = name.trim();

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

      const csrf = await getCsrfToken();

      const newSpace = await createSpace({
        groupId,
        name: normalizedName,
        csrf,
      });

      setSpaces((currentSpaces) => [
        ...currentSpaces,
        newSpace,
      ]);

      setSelectedSpaceId(
        String(newSpace.spaceId),
      );

      setMessage(
        `${newSpace.name} 공간을 추가했습니다.`,
      );
    } catch (error) {
      setMessage(error.message);
    }
  }

  // 예약 생성
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

      const csrf = await getCsrfToken();

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
          ].sort((first, second) =>
            first.startTime.localeCompare(
              second.startTime,
            ),
          ),
      );

      setMessage("예약을 등록했습니다.");
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

  // 예약 취소
  async function handleCancel(reservation) {
    const shouldCancel = window.confirm(
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

      const csrf = await getCsrfToken();

      await cancelReservation({
        groupId,
        reservationId:
          reservation.reservationId,
        version: reservation.version,
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

      setMessage("예약을 취소했습니다.");
    } catch (error) {
      setMessage(error.message);
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
    handleAddSpace,
    handleReservation,
    handleCancel,
  };
}