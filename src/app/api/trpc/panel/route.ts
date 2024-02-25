import { NextResponse } from "next/server";
import { renderTrpcPanel } from "trpc-panel";

import { appRouter } from "~/server/api/root";

export const GET = () => {
  return new NextResponse(
    renderTrpcPanel(appRouter, {
      url: "/trpc",
      transformer: "superjson",
    })
  );
};
