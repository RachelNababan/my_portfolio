import React, { useState } from "react";

type ContactState = { name: string; email: string; message: string };

export const ContactForm: React.FC<{
  sendTo?: string; // recipient email address (optional; fallback to VITE_CONTACT_EMAIL)
}> = ({ sendTo }) => {
  const [state, setState] = useState<ContactState>({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<boolean | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // pick recipient from prop or from Vite env (if available)
  const DEFAULT_TO = sendTo ?? import.meta.env.VITE_CONTACT_EMAIL ?? "";

  function update(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;
    setState((s) => ({ ...s, [name]: value }));
  }

  // Simple email validation
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    // Validation
    if (!state.name.trim()) {
      setErrorMsg("Please enter your name");
      setSuccess(false);
      return;
    }
    
    if (!state.email.trim() || !isValidEmail(state.email)) {
      setErrorMsg("Please enter a valid email address");
      setSuccess(false);
      return;
    }
    
    if (!state.message.trim() || state.message.trim().length < 10) {
      setErrorMsg("Please enter a message (at least 10 characters)");
      setSuccess(false);
      return;
    }
    
    setLoading(true);
    setSuccess(null);
    setErrorMsg(null);

    const endpoint = import.meta.env.VITE_MAIL_API_URL + "/send";

    // require a recipient address somewhere (either env or passed prop)
    if (!DEFAULT_TO) {
      console.warn(
        "ContactForm: no recipient configured. Set VITE_CONTACT_EMAIL or pass sendTo prop.",
      );
      setErrorMsg(
        "Contact form is not configured. Please contact the administrator.",
      );
      setSuccess(false);
      setLoading(false);
      return;
    }

    const payload = {
      to: DEFAULT_TO,
      subject: `Portfolio Contact: ${state.name || state.email}`,
      body: `Name: ${state.name}\nEmail: ${state.email}\n\nMessage:\n${state.message}\n\n---\nSent from Portfolio Contact Form`,
      html: false,
      from_name: state.name || undefined,
      from_email: state.email || undefined,
    };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => null);
        throw new Error(text || `Server returned ${res.status}`);
      }

      // success
      setSuccess(true);
      setState({ name: "", email: "", message: "" });
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 5000);
    } catch (err) {
      console.error("Failed to send contact message", err);
      setSuccess(false);
      setErrorMsg((err as Error).message || "Failed to send message. Please try again or email directly.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3" aria-live="polite">
      <label htmlFor="name" className="text-xs sm:text-sm text-[var(--text)]">
        Name
      </label>
      <input
        id="name"
        name="name"
        title="Name"
        placeholder="Your name"
        value={state.name}
        onChange={update}
        className="w-full px-3 py-2 text-sm rounded-md bg-[var(--surface)] border border-[var(--border)] text-[var(--text)]"
      />
      <label htmlFor="email" className="text-xs sm:text-sm text-[var(--text)]">
        Email
      </label>
      <input
        id="email"
        name="email"
        type="email"
        title="Email"
        placeholder="Your email"
        value={state.email}
        onChange={update}
        className="w-full px-3 py-2 text-sm rounded-md bg-[var(--surface)] border border-[var(--border)] text-[var(--text)]"
      />
      <label htmlFor="message" className="text-xs sm:text-sm text-[var(--text)]">
        Message
      </label>
      <textarea
        id="message"
        name="message"
        title="Message"
        placeholder="Your message"
        value={state.message}
        onChange={update}
        rows={6}
        className="w-full px-3 py-2 text-sm rounded-md bg-[var(--surface)] border border-[var(--border)] text-[var(--text)]"
        required
      />

      <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto px-4 py-2 rounded-lg text-sm text-white bg-[var(--brand)] hover:bg-[var(--brand)]/90 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending...
            </span>
          ) : "Send message"}
        </button>

        {success === true && (
          <div className="flex items-center gap-2 text-xs sm:text-sm text-green-600 dark:text-green-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Message sent successfully! I'll get back to you soon.
          </div>
        )}
        {success === false && (
          <div className="text-xs sm:text-sm text-red-600 dark:text-red-400">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Failed to send message
            </div>
            {errorMsg && (
              <span className="block text-[10px] sm:text-xs mt-1 ml-6">{errorMsg}</span>
            )}
          </div>
        )}
      </div>
    </form>
  );
};
