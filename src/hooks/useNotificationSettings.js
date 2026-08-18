import {
  useEffect,
  useState,
} from "react";

import {
  getNotificationPreferences,
  getNotificationSettings,
  updateNotificationPreferences,
  updateNotificationSettings,
} from "../api/notificationApi";

const DEFAULT_FORM = {
  dueSoonEnabled: true,
  dailyHoursBeforeDue: "5",
  weeklyHoursBeforeDue: "5",
  biweeklyHoursBeforeDue: "5",
};

const HOUR_LIMITS = [
  {
    name: "dailyHoursBeforeDue",
    label: "매일",
    min: 1,
    max: 24,
  },
  {
    name: "weeklyHoursBeforeDue",
    label: "매주",
    min: 1,
    max: 168,
  },
  {
    name: "biweeklyHoursBeforeDue",
    label: "격주",
    min: 1,
    max: 336,
  },
];

function validateNotificationHours(
  form,
) {
  for (const limit of HOUR_LIMITS) {
    const value =
      Number(form[limit.name]);

    if (
      !Number.isInteger(value) ||
      value < limit.min ||
      value > limit.max
    ) {
      return `${limit.label} 업무 알림 시간은 ${limit.min}시간 이상 ${limit.max}시간 이하로 입력해 주세요.`;
    }
  }

  return "";
}

export default function useNotificationSettings(
  groupId,
) {
  const [form, setForm] =
    useState(DEFAULT_FORM);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isSaving, setIsSaving] =
    useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  useEffect(() => {
    if (!groupId) {
      return undefined;
    }

    let cancelled = false;

    async function loadSettings() {
      try {
        setIsLoading(true);
        setErrorMessage("");
        setSuccessMessage("");

        const [
          preferences,
          settings,
        ] = await Promise.all([
          getNotificationPreferences(),
          getNotificationSettings(
            groupId,
          ),
        ]);

        if (cancelled) {
          return;
        }

        setForm({
          dueSoonEnabled:
            preferences?.dueSoonEnabled ??
            true,

          dailyHoursBeforeDue:
            String(
              settings?.dailyHoursBeforeDue ??
                5,
            ),

          weeklyHoursBeforeDue:
            String(
              settings?.weeklyHoursBeforeDue ??
                5,
            ),

          biweeklyHoursBeforeDue:
            String(
              settings?.biweeklyHoursBeforeDue ??
                5,
            ),
        });
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(
            error.message ??
              "알림 설정을 불러오지 못했습니다.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadSettings();

    return () => {
      cancelled = true;
    };
  }, [groupId]);

  function handleToggle() {
    setForm((currentForm) => ({
      ...currentForm,

      dueSoonEnabled:
        !currentForm.dueSoonEnabled,
    }));

    setErrorMessage("");
    setSuccessMessage("");
  }

  function handleHoursChange(event) {
    const {
      name,
      value,
    } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));

    setErrorMessage("");
    setSuccessMessage("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!groupId || isSaving) {
      return;
    }

    const validationMessage =
      validateNotificationHours(form);

    if (validationMessage) {
      setErrorMessage(
        validationMessage,
      );

      return;
    }

    const dailyHoursBeforeDue =
      Number(
        form.dailyHoursBeforeDue,
      );

    const weeklyHoursBeforeDue =
      Number(
        form.weeklyHoursBeforeDue,
      );

    const biweeklyHoursBeforeDue =
      Number(
        form.biweeklyHoursBeforeDue,
      );

    try {
      setIsSaving(true);
      setErrorMessage("");
      setSuccessMessage("");

      const [
        preferences,
        settings,
      ] = await Promise.all([
        updateNotificationPreferences({
          dueSoonEnabled:
            form.dueSoonEnabled,
        }),

        updateNotificationSettings({
          groupId,
          dailyHoursBeforeDue,
          weeklyHoursBeforeDue,
          biweeklyHoursBeforeDue,
        }),
      ]);

      setForm({
        dueSoonEnabled:
          preferences?.dueSoonEnabled ??
          form.dueSoonEnabled,

        dailyHoursBeforeDue:
          String(
            settings?.dailyHoursBeforeDue ??
              dailyHoursBeforeDue,
          ),

        weeklyHoursBeforeDue:
          String(
            settings?.weeklyHoursBeforeDue ??
              weeklyHoursBeforeDue,
          ),

        biweeklyHoursBeforeDue:
          String(
            settings?.biweeklyHoursBeforeDue ??
              biweeklyHoursBeforeDue,
          ),
      });

      setSuccessMessage(
        "알림 설정을 저장했습니다.",
      );
    } catch (error) {
      if (error.status === 401) {
        setErrorMessage(
          "로그인이 만료되었습니다. 다시 로그인해 주세요.",
        );

        return;
      }

      setErrorMessage(
        error.message ??
          "알림 설정을 저장하지 못했습니다.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return {
    form,
    isLoading,
    isSaving,
    errorMessage,
    successMessage,
    hourLimits: HOUR_LIMITS,
    handleToggle,
    handleHoursChange,
    handleSubmit,
  };
}
