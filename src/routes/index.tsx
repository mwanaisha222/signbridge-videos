import { createFileRoute } from "@tanstack/react-router";
import { SignBridgeApp } from "@/components/SignBridgeApp";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <>
      <h1 className="sr-only">
        SignBridge — Translate text and voice into sign language videos
      </h1>
      <SignBridgeApp />
    </>
  );
}
