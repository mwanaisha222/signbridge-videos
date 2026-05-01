import { createFileRoute } from "@tanstack/react-router";
import { SignBridgeApp } from "@/components/SignBridgeApp";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <>
      <h1 className="sr-only">
        Wamu — Bridging hearts through signs
      </h1>
      <SignBridgeApp />
    </>
  );
}
