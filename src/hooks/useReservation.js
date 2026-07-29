// 공간 예약 페이지에서 필요한 모든 데이터(상태)와
// 기능(API 요청)을 처리하는 커스텀 훅

import { useEffect, useState } from "react";
import {
  cancelReservation,
  createReservation,
  createSpace,
  getReservations,
  getSpaces,
} from "../api/reservationApi";
import { getToday } from "../utils/date";

const TEMPORARY_GROUP_ID = 1;

export default function useReservation() {
  const today = getToday();

  const [spaces, setSpaces] = useState([]);
  const [selectedSpaceId, setSelectedSpaceId] = useState("");
  const [selectedDate, setSelectedDate] = useState(today);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

   // 화면이 처음 열리면 공간 목록을 불러옴
  useEffect(() => {
    let cancelled = false;

    async function loadSpaces() {
      try {
        const spaceList = await getSpaces(TEMPORARY_GROUP_ID);

        if (cancelled) {
          return;
        }

        setSpaces(spaceList);

        if (spaceList.length > 0) {
          setSelectedSpaceId(String(spaceList[0].spaceId));
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
  }, []);

   // 날짜 또는 공간이 바뀌면 해당 예약 목록을 불러옵니다.
  useEffect(() => {
    if (!selectedSpaceId) {
      return;
    }

    let cancelled = false;

    async function loadReservations() {
      setLoading(true);

      try {
        const reservationList = await getReservations({
          groupId: TEMPORARY_GROUP_ID,
          date: selectedDate,
          spaceId: Number(selectedSpaceId),
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
  }, [selectedDate, selectedSpaceId]);

  const handleAddSpace = async (name) => {
    if (!name) {
      setMessage("공간 이름을 입력해 주세요.");
      return;
    }

    try {
      const newSpace = await createSpace(TEMPORARY_GROUP_ID, name);

      setSpaces((currentSpaces) => [...currentSpaces, newSpace]);
      setSelectedSpaceId(String(newSpace.spaceId));
      setMessage(`${newSpace.name} 공간을 추가했습니다.`);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleReservation = async ({
    selectedSpaceId,
    selectedDate: inputDate,
    startTime,
    endTime,
  }) => {
    setSelectedDate(inputDate);

    if (!selectedSpaceId) {
      setMessage("예약할 공간을 선택해 주세요.");
      return;
    }

    if (inputDate < today) {
      setMessage("지난 날짜는 예약할 수 없습니다.");
      return;
    }

    try {
      const newReservation = await createReservation(TEMPORARY_GROUP_ID, {
        spaceId: Number(selectedSpaceId),
        date: inputDate,
        startTime,
        endTime,
      });

      setReservations((currentReservations) =>
        [...currentReservations, newReservation].sort((first, second) =>
          first.startTime.localeCompare(second.startTime),
        ),
      );

      setMessage("예약을 등록했습니다.");
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleCancel = async (reservation) => {
    const shouldCancel = window.confirm(
      `${reservation.startTime} ~ ${reservation.endTime} 예약을 취소할까요?`,
    );

    if (!shouldCancel) {
      return;
    }

    try {
      await cancelReservation(
        TEMPORARY_GROUP_ID,
        reservation.reservationId,
      );

      setReservations((currentReservations) =>
        currentReservations.filter(
          (item) => item.reservationId !== reservation.reservationId,
        ),
      );

      setMessage("예약을 취소했습니다.");
    } catch (error) {
      setMessage(error.message);
    }
  };

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