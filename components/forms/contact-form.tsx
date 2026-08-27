"use client";

import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { submitLeadAction } from "@/lib/actions/leads";
import { defaultFormActionState } from "@/lib/actions/form-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm({ locale }: { locale: "en" | "ar" }) {
  const [state, formAction, isPending] = useActionState(
    submitLeadAction,
    defaultFormActionState,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      toast.success(state.message);
      formRef.current?.reset();
    }

    if (state.status === "error") {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="grid gap-4">
      <input type="hidden" name="locale" value={locale} />
      <label htmlFor={`${locale}-full-name`} className="sr-only">
        {locale === "ar"
          ? "\u0627\u0644\u0627\u0633\u0645 \u0627\u0644\u0643\u0627\u0645\u0644"
          : "Full name"}
      </label>
      <Input
        id={`${locale}-full-name`}
        name="fullName"
        placeholder={
          locale === "ar"
            ? "\u0627\u0644\u0627\u0633\u0645 \u0627\u0644\u0643\u0627\u0645\u0644"
            : "Full name"
        }
        required
      />
      <label htmlFor={`${locale}-email`} className="sr-only">
        {locale === "ar"
          ? "\u0627\u0644\u0628\u0631\u064a\u062f \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a"
          : "Email address"}
      </label>
      <Input
        id={`${locale}-email`}
        type="email"
        name="email"
        placeholder={
          locale === "ar"
            ? "\u0627\u0644\u0628\u0631\u064a\u062f \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a"
            : "Email address"
        }
        required
      />
      <label htmlFor={`${locale}-phone`} className="sr-only">
        {locale === "ar"
          ? "\u0631\u0642\u0645 \u0627\u0644\u0647\u0627\u062a\u0641"
          : "Phone number"}
      </label>
      <Input
        id={`${locale}-phone`}
        name="phone"
        placeholder={
          locale === "ar"
            ? "\u0631\u0642\u0645 \u0627\u0644\u0647\u0627\u062a\u0641"
            : "Phone number"
        }
        required
      />
      <label htmlFor={`${locale}-message`} className="sr-only">
        {locale === "ar"
          ? "\u0627\u0634\u0631\u062d \u0637\u0628\u064a\u0639\u0629 \u0627\u0644\u0627\u0633\u062a\u0634\u0627\u0631\u0629 \u0627\u0644\u0642\u0627\u0646\u0648\u0646\u064a\u0629"
          : "Tell us about your legal matter"}
      </label>
      <Textarea
        id={`${locale}-message`}
        name="message"
        placeholder={
          locale === "ar"
            ? "\u0627\u0634\u0631\u062d \u0637\u0628\u064a\u0639\u0629 \u0627\u0644\u0627\u0633\u062a\u0634\u0627\u0631\u0629 \u0627\u0644\u0642\u0627\u0646\u0648\u0646\u064a\u0629"
            : "Tell us about your legal matter"
        }
        required
      />
      <Button size="lg" type="submit" disabled={isPending}>
        {isPending
          ? locale === "ar"
            ? "\u062c\u0627\u0631\u064d \u0627\u0644\u0625\u0631\u0633\u0627\u0644..."
            : "Submitting..."
          : locale === "ar"
            ? "\u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0637\u0644\u0628"
            : "Submit inquiry"}
      </Button>
    </form>
  );
}
