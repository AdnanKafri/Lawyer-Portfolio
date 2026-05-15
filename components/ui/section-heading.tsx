export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  description: string;
  align?: "left" | "center";
}) {
  return (
    <div
      className={
        align === "center"
          ? "mx-auto max-w-3xl text-center"
          : "max-w-3xl"
      }
    >
      <p className="eyebrow mb-5">
        {eyebrow}
      </p>
      <h2 className="text-heading balanced-copy mb-5 text-[2rem] font-semibold text-foreground md:text-[2.8rem]">
        {title}
      </h2>
      <p className="balanced-copy max-w-2xl text-body-lg text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
