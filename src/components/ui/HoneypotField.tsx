// Honeypot anti-spam field. Hidden from real users (off-screen, aria-hidden,
// not in tab order); bots tend to auto-fill it. The API rejects any submission
// where this field is non-empty. Field name: "hp_website".
export function HoneypotField() {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden" tabIndex={-1}>
      <label>
        Leave this field empty
        <input
          type="text"
          name="hp_website"
          tabIndex={-1}
          autoComplete="off"
        />
      </label>
    </div>
  );
}
