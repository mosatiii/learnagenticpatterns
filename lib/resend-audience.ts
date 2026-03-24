/**
 * Fire-and-forget helper to add a contact to the Resend Audience.
 * Safe to call without await — never throws if env vars are missing.
 */
export async function addContactToAudience({
  email,
  firstName,
}: {
  email: string;
  firstName: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;

  if (!apiKey || apiKey === "your_resend_key" || !audienceId) return;

  const res = await fetch(
    `https://api.resend.com/audiences/${audienceId}/contacts`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        first_name: firstName,
        unsubscribed: false,
      }),
    }
  );

  if (!res.ok) {
    console.error("Resend audience sync failed:", res.status, await res.text());
  }
}
