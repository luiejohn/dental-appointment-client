"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../lib/auth";
import { useAppointments, useCancelAppointment } from "../../lib/api";
import { useRouter } from "next/navigation";
import { Button } from "../../components/shared/button";

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const { data: appointments, isLoading, error } = useAppointments();
  const cancelMutation = useCancelAppointment();

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    }
  }, [authLoading, user, router]);

  const handleCancel = async (id: string) => {
    setCancellingId(id);
    try {
      await cancelMutation.mutateAsync(id);
    } catch (err) {
      console.error(err);
    } finally {
      setCancellingId(null);
    }
  };

  if (authLoading || isLoading) {
    return <div className="flex justify-center">Loading...</div>;
  }

  if (error) {
    return (
      <p className="text-red-600">
        Error loading appointments: {error.message}
      </p>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Your Appointments</h1>
      {!appointments || appointments.length === 0 ? (
        <p>You have no upcoming appointments.</p>
      ) : (
        <ul className="space-y-2">
          {appointments.map((appt) => (
            <li
              key={appt.id}
              className="border rounded p-4 flex justify-between items-center"
            >
              <div>
                <p>
                  <strong>Dentist:</strong> {appt.dentist.name}
                </p>

                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(appt.startTs).toLocaleString()}
                </p>

                <p>
                  <strong>Status:</strong> {appt.status}
                </p>
              </div>

              <div className="space-x-2">
                <Button
                  variant="outline"
                  onClick={() =>
                    router.push(
                      `/booking?id=${appt.id}&dentistId=${appt.dentist.id}&startTs=${appt.startTs}`
                    )
                  }
                >
                  Reschedule
                </Button>

                <Button
                  variant="outline"
                  onClick={() => handleCancel(appt.id)}
                  disabled={cancellingId === appt.id}
                >
                  {cancellingId === appt.id ? "Canceling..." : "Cancel"}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
