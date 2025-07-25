"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect, useMemo, Suspense } from "react";
import DatePicker from "react-datepicker";
import { useForm, Controller } from "react-hook-form";
import {
  useDentists,
  useBookAppointment,
  useUpdateAppointment,
  useAvailability,
} from "../../lib/api";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "../../components/shared/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../components/shared/select";

export interface BookingForm {
  dentistId: string;
  date: Date | null;
}

function formatLocalDate(d: Date) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function BookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const existingId = searchParams.get("id") || undefined;
  const existingDentist = searchParams.get("dentistId") || undefined;
  const existingStart = searchParams.get("startTs") || undefined;

  const { data: dentists = [] } = useDentists();
  const bookMutation = useBookAppointment();
  const updateMutation = useUpdateAppointment();

  const [day, setDay] = useState<string>("");

  const {
    control,
    watch,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<BookingForm>({
    defaultValues: {
      dentistId: existingDentist || "",
      date: existingStart ? new Date(existingStart) : null,
    },
  });

  useEffect(() => {
    if (existingStart) {
      const d = new Date(existingStart);
      setDay(formatLocalDate(d));
    }
    if (existingDentist) {
      setValue("dentistId", existingDentist);
    }
  }, [existingDentist, existingStart, setValue]);

  const selectedDentist = watch("dentistId");
  const availQuery = useAvailability({ dentistId: selectedDentist, date: day });

  const otherAppointments = useMemo(
    () => (availQuery.data || []).filter((appt) => appt.id !== existingId),
    [availQuery.data, existingId]
  );
  const excludeTimes = useMemo(
    () => otherAppointments.map((appt) => new Date(appt.startTs)),
    [otherAppointments]
  );

  const onSubmit = async (data: BookingForm) => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");
    if (!data.date) return;

    const dayStr = formatLocalDate(data.date);
    setDay(dayStr);

    const { data: latest = [] } = await availQuery.refetch();

    const others = latest.filter((appt) => appt.id !== existingId);

    const selectedStart = data.date;
    const selectedEnd = new Date(selectedStart.getTime() + 60 * 60 * 1000);

    const overlapping = others.some((appt) => {
      const apptStart = new Date(appt.startTs);
      const apptEnd = new Date(appt.endTs);
      return (
        (selectedStart >= apptStart && selectedStart < apptEnd) ||
        (selectedEnd > apptStart && selectedEnd <= apptEnd) ||
        (selectedStart <= apptStart && selectedEnd >= apptEnd)
      );
    });

    if (overlapping) {
      alert("Schedule no longer available. Please choose another time.");
      return;
    }

    try {
      if (existingId) {
        await updateMutation.mutateAsync({
          id: existingId,
          dentistId: data.dentistId,
          startTs: selectedStart.toISOString(),
          endTs: selectedEnd.toISOString(),
        });
      } else {
        await bookMutation.mutateAsync({
          dentistId: data.dentistId,
          startTs: selectedStart.toISOString(),
          endTs: selectedEnd.toISOString(),
        });
      }
      router.push("/dashboard");
    } catch (err: unknown) {
      console.error(err);
      alert("Something went wrong while booking.");
    }
  };

  const onCancel = () => {
    router.push("/dashboard");
  };

  const isBooking = bookMutation.status === "pending";
  const isUpdating = updateMutation.status === "pending";
  const isBusy = existingId ? isUpdating : isBooking;

  return (
    <Suspense fallback={<p>Loading booking form…</p>}>
      <div className="max-w-lg mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">
          {existingId ? "Reschedule Appointment" : "Book an Appointment"}
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Controller
            name="dentistId"
            control={control}
            rules={{ required: "Please select a dentist." }}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a dentist" />
                </SelectTrigger>
                <SelectContent>
                  {dentists.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.name} — {d.specialization}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.dentistId && (
            <p className="text-red-600">{errors.dentistId.message}</p>
          )}

          <Controller
            name="date"
            control={control}
            rules={{ required: "Please select date and time." }}
            render={({ field }) => (
              <DatePicker
                selected={field.value}
                onChange={(d) => {
                  field.onChange(d);
                  if (d) setDay(formatLocalDate(d));
                }}
                showTimeSelect
                timeIntervals={60}
                dateFormat="MMMM d, yyyy h:mm aa"
                inline
                excludeTimes={excludeTimes}
              />
            )}
          />
          {errors.date && <p className="text-red-600">{errors.date.message}</p>}

          <div className="flex space-x-2">
            <Button type="submit" disabled={isBusy}>
              {existingId
                ? isUpdating
                  ? "Rescheduling…"
                  : "Reschedule"
                : isBooking
                ? "Booking…"
                : "Book Appointment"}
            </Button>

            {existingId && (
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </div>
    </Suspense>
  );
}
