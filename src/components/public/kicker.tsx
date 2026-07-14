// Marca visual de secao: apenas um traco laranja. Sem texto (nada de eyebrow).
export function SectionMark() {
  return (
    <span
      className="mb-4 block h-[4px] w-9 rounded-full bg-laranja"
      aria-hidden
    />
  );
}
