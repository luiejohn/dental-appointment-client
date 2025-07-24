export const dynamic = "force-dynamic";
import React, { Suspense } from "react";
import BookingClient from "./BookingClient";

export default function Page() {
  return (
    <Suspense fallback={<p>Loading booking form…</p>}>
      <BookingClient />
    </Suspense>
  );
}
