/*
  Persistent 1px hairline pinned to the top of the viewport. Hidden until
  the BootLoader fires its handoff (it adds .mm-boot-done to <html>),
  then fades in to receive the collapsed terminal line. PLAN §1.
*/

export default function TopHairline() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[90] h-px bg-border opacity-0 transition-opacity duration-300 ease-out [html.mm-boot-done_&]:opacity-100"
    />
  );
}
