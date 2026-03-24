/**
 * Fire-and-forget helper to add a contact to the Resend Audience.
 * Safe to call without await — never throws if env vars are missing.
 */
export async function addContactToAudience({
  email,
  firstName,
  role,
}: {
  email: string;
  firstName: string;
  role?: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;

  if (!apiKey || apiKey === "your_resend_key" || !audienceId) return;

  // Create/update contact in audience
  const createRes = await fetch(
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

  if (!createRes.ok) {
    console.error("Resend audience sync failed:", createRes.status, await createRes.text());
    return;
  }

  // Set role property (requires separate PATCH call)
  if (role) {
    const patchRes = await fetch(
      `https://api.resend.com/contacts/${email}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ properties: { role } }),
      }
    );

    if (!patchRes.ok) {
      console.error("Resend role update failed:", patchRes.status, await patchRes.text());
    }
  }
}
