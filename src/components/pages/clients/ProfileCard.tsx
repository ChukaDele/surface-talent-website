/** Figma "Profile Card" (2027:20866…): 240×300, r10, crisp photo fill, bottom scrim, status badge, name, role. */
export type Profile = { key: string; name: string; role: string; src: string };

export function ProfileCard({ p, index, style, className = "", decorative = false }: { p: Profile; index: number; style?: React.CSSProperties; className?: string; decorative?: boolean }) {
  return (
    <figure className={`st-profile ${className}`} data-profile={decorative ? undefined : index} aria-hidden={decorative || undefined} style={style}>
      <picture>
        <source type="image/webp" srcSet={`${p.src.replace(/\.jpg$/, "-240.webp")} 1x, ${p.src.replace(/\.jpg$/, "-480.webp")} 2x`} />
        <img className="st-profile__img" src={p.src} alt="" width={240} height={300} loading={index < 4 ? "eager" : "lazy"} decoding="async" />
      </picture>
      <div className="st-profile__shade" aria-hidden="true" />
      <figcaption className="st-profile__meta">
        <span className="st-profile__badge"><span className="st-profile__dot" aria-hidden="true" />Available for hire</span>
        <span className="st-profile__name">{p.name}</span>
        <span className="st-profile__role">{p.role}</span>
      </figcaption>
    </figure>
  );
}
