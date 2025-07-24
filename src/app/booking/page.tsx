"use client";

import { useState, useEffect, useMemo } from "react";
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
      setDay(d.toISOString().slice(0, 10));
    }
    if (existingDentist) {
      setValue("dentistId", existingDentist);
    }
  }, [existingDentist, existingStart, setValue]);

  const selectedDentist = control._formValues?.dentistId;
  const availQuery = useAvailability({ dentistId: selectedDentist, date: day });

  const excludeTimes = useMemo(
    () => (availQuery.data || []).map((appt) => new Date(appt.startTs)),
    [availQuery.data]
  );

  const onSubmit = async (data: BookingForm) => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");
    if (!data.date) return;

    setDay(data.date.toISOString().slice(0, 10));

    try {
      if (existingId) {
        await updateMutation.mutateAsync({
          id: existingId,
          dentistId: data.dentistId,
          startTs: data.date.toISOString(),
          endTs: new Date(data.date.getTime() + 60 * 60 * 1000).toISOString(),
        });
      } else {
        await bookMutation.mutateAsync({
          dentistId: data.dentistId,
          startTs: data.date.toISOString(),
          endTs: new Date(data.date.getTime() + 60 * 60 * 1000).toISOString(),
        });
      }
      router.push("/dashboard");
    } catch (err: unknown) {
      console.error(err);
    }
  };

  const onCancel = () => {
    router.push("/dashboard");
  };

  const isBooking = bookMutation.status === "pending";
  const isUpdating = updateMutation.status === "pending";
  const isBusy = existingId ? isUpdating : isBooking;

  return (
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
                if (d) setDay(d.toISOString().slice(0, 10));
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
  );
}
