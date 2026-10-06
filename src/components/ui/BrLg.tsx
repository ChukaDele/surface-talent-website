/**
 * A line break that only applies from the desktop layout up. Below 1024px the break is removed and
 * the two halves join into one flowing line, so the space in front of it is what keeps the words
 * apart. On desktop that space sits at the end of a line and collapses away, exactly like the
 * whitespace around any other wrapped word.
 */
export function BrLg() {
  return (
    <>
      {" "}
      <br className="st-br-lg" />
    </>
  );
}
