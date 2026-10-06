/**
 * Hero option F — the photographic direction, still.
 *
 * The same treatment as the video plate with nothing moving: no frame, a partial desaturation
 * unified by a copper-over-navy grade, and the caption sitting on its own reserved band. It is
 * what option G falls back to under reduced motion, kept as a variant in its own right so the
 * still and the moving version can be compared side by side.
 *
 * Footage licensed from Coverr. See public/assets/media/hero/LICENCE.txt.
 */
export function PlateHero({
  src = "/assets/media/hero/line-02.jpg",
  caption = "Surface preparation",
  line = "Line operative",
}: { src?: string; caption?: string; line?: string }) {
  return (
    <figure className="st-plate">
      <div className="st-plate__frame">
        <img className="st-plate__img" src={src} alt="" width={600} height={800} decoding="async" />
        <div className="st-plate__wash" aria-hidden="true" />
        <div className="st-plate__meta">
          <span className="st-plate__tag">{caption}</span>
          <span className="st-plate__line">{line}</span>
        </div>
      </div>
    </figure>
  );
}
