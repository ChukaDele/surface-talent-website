import type { CSSProperties, ReactNode } from "react";

export function Section({ children, className = "", style, id, ...rest }: { children: ReactNode; className?: string; style?: CSSProperties; id?: string } & Record<string, unknown>) {
  return (
    <section id={id} className={`st-section ${className}`} style={style} {...rest}>
      {children}
    </section>
  );
}

export function Inner({ children, className = "", style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <div className={`st-inner ${className}`} style={style}>
      {children}
    </div>
  );
}
