"use client";

import dynamic from "next/dynamic";

const Workspace = dynamic(() => import("./workspace"), {
  ssr: false,
  loading: () => <main className="loading-screen">Loading CollabDocs…</main>,
});

export default function Page() {
  return <Workspace />;
}
