"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { useState, type FormEvent, type PointerEvent } from "react";
import { Magnetic } from "./Magnetic";
import { RevealLines } from "./RevealLines";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/analytics";

type FieldId = "nome" | "whatsapp" | "loja" | "cidade" | "instagram" | "cnpj";
type Field = { id: FieldId; label: string; type: string; required: boolean; placeholder: string };

const STEPS: { title: string; fields: Field[] }[] = [
  {
    title: "Sobre você",
    fields: [
      { id: "nome", label: "Seu nome", type: "text", required: true, placeholder: "Como podemos te chamar?" },
      { id: "whatsapp", label: "WhatsApp", type: "tel", required: true, placeholder: "(81) 9 0000-0000" },
    ],
  },
  {
    title: "Sua loja",
    fields: [
      { id: "loja", label: "Nome da loja", type: "text", required: true, placeholder: "Nome da sua loja" },
      { id: "cidade", label: "Cidade", type: "text", required: true, placeholder: "Recife, Olinda, Caruaru..." },
      { id: "instagram", label: "Instagram da loja", type: "text", required: true, placeholder: "@sualoja" },
      { id: "cnpj", label: "CNPJ (opcional)", type: "text", required: false, placeholder: "00.000.000/0000-00" },
    ],
  },
  { title: "Revisar", fields: [] },
];

const BENEFITS = [
  { title: "Curadoria pronta", text: "Peças escolhidas para girar na sua arara." },
  { title: "Atendimento direto", text: "Você fala com a equipe HILOS, sem intermediários." },
  { title: "Novidades primeiro", text: "Lançamentos e reposições avisados antes." },
];

const EMPTY: Record<FieldId, string> = {
  nome: "",
  whatsapp: "",
  loja: "",
  cidade: "",
  instagram: "",
  cnpj: "",
};

export function Wholesale() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState<string | null>(null);

  const mx = useSpring(useMotionValue(720), { stiffness: 80, damping: 20 });
  const my = useSpring(useMotionValue(360), { stiffness: 80, damping: 20 });

  function onPointerMove(e: PointerEvent<HTMLElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set(e.clientX - rect.left);
    my.set(e.clientY - rect.top);
  }

  function go(next: number) {
    if (next > step) {
      const missing = STEPS[step].fields.find((f) => f.required && !form[f.id].trim());
      if (missing) {
        setError(`Preencha "${missing.label}" para continuar.`);
        return;
      }
    }
    setError(null);
    setDirection(next > step ? 1 : -1);
    setStep(next);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (step < STEPS.length - 1) {
      go(step + 1);
      return;
    }
    const message = [
      "Olá! Quero revender HILOS. Seguem meus dados:",
      `Nome: ${form.nome}`,
      `WhatsApp: ${form.whatsapp}`,
      `Loja: ${form.loja}`,
      `Cidade: ${form.cidade}`,
      `Instagram: ${form.instagram}`,
      form.cnpj ? `CNPJ: ${form.cnpj}` : null,
    ]
      .filter(Boolean)
      .join("\n");
    trackEvent("atacado_lead_submit", { cidade: form.cidade });
    window.open(buildWhatsAppLink(message), "_blank", "noopener,noreferrer");
  }

  const allFields = STEPS.flatMap((s) => s.fields);

  return (
    <section
      id="atacado"
      onPointerMove={onPointerMove}
      data-thread="0.975:0.03 0.6:0.08 0.03:0.16 0.04:0.55 0.025:0.96"
      data-thread-mobile="0.025:0.02 0.035:0.5 0.022:0.97"
      className="relative overflow-hidden bg-ink py-24 text-cream md:py-32"
    >
      <motion.div
        aria-hidden
        style={{ x: mx, y: my }}
        className="pointer-events-none absolute top-[-520px] left-[-520px] h-[1040px] w-[1040px] rounded-full bg-[radial-gradient(circle,rgba(189,91,53,0.32),transparent_70%)] will-change-transform"
      />


      <div className="container-hilos relative grid grid-cols-1 gap-14 md:grid-cols-[1fr_1.05fr] md:gap-20">
        <div>
          <p className="eyebrow mb-5 text-rose">Atacado HILOS</p>
          <RevealLines
            as="h2"
            lines={["Vista sua loja", "com HILOS."]}
            className="font-display text-5xl leading-[0.95] font-medium md:text-7xl"
          />
          <p className="mt-6 max-w-md text-cream/70">
            Quer levar a HILOS para os seus clientes? Conte um pouco sobre você e a sua loja — a gente responde no
            WhatsApp com as condições de revenda.
          </p>

          <ul className="mt-12 space-y-3">
            {BENEFITS.map((b, i) => (
              <motion.li
                key={b.title}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.12 }}
                whileHover={{ x: 10 }}
                className="group flex items-center gap-5 rounded-2xl border border-cream/10 p-5 transition-colors hover:border-terracotta/60 hover:bg-cream/[0.03]"
              >
                <span className="font-display text-4xl text-terracotta italic">0{i + 1}</span>
                <span>
                  <span className="block font-display text-2xl">{b.title}</span>
                  <span className="text-sm text-cream/60">{b.text}</span>
                </span>
              </motion.li>
            ))}
          </ul>
        </div>

        <motion.form
          onSubmit={handleSubmit}
          noValidate
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative self-start overflow-hidden rounded-[2rem] border border-cream/15 bg-cream/[0.05] p-6 shadow-[0_0_80px_-20px_rgba(189,91,53,0.5)] md:p-10"
        >
          <div className="mb-10 flex items-center">
            {STEPS.map((s, i) => (
              <div key={s.title} className="flex flex-1 items-center last:flex-none">
                <button
                  type="button"
                  onClick={() => i < step && go(i)}
                  className="flex flex-col items-center gap-2"
                >
                  <motion.span
                    animate={{
                      backgroundColor: i <= step ? "#bd5b35" : "rgba(247,242,233,0)",
                      scale: i === step ? 1.15 : 1,
                    }}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-terracotta font-display text-lg"
                  >
                    {i + 1}
                  </motion.span>
                  <span className={`eyebrow text-[0.58rem] ${i === step ? "text-cream" : "text-cream/40"}`}>
                    {s.title}
                  </span>
                </button>
                {i < STEPS.length - 1 && (
                  <svg viewBox="0 0 100 12" preserveAspectRatio="none" className="mx-2 mb-6 h-3 flex-1" aria-hidden>
                    <path d="M0 6 C 25 0, 50 12, 75 6 S 100 3, 100 6" fill="none" stroke="rgba(247,242,233,0.15)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                    <motion.path
                      d="M0 6 C 25 0, 50 12, 75 6 S 100 3, 100 6"
                      fill="none"
                      stroke="#bd5b35"
                      strokeWidth="2"
                      vectorEffect="non-scaling-stroke"
                      animate={{ pathLength: step > i ? 1 : 0 }}
                      transition={{ duration: 0.7 }}
                    />
                  </svg>
                )}
              </div>
            ))}
          </div>

          <div className="relative min-h-[300px]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                initial={{ opacity: 0, x: direction * 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -60 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-6"
              >
                {step < STEPS.length - 1 ? (
                  STEPS[step].fields.map((field) => (
                    <div key={field.id} className="group">
                      <label htmlFor={field.id} className="eyebrow mb-2 block text-cream/60">
                        {field.label}
                      </label>
                      <input
                        id={field.id}
                        type={field.type}
                        required={field.required}
                        placeholder={field.placeholder}
                        value={form[field.id]}
                        onChange={(e) => setForm((prev) => ({ ...prev, [field.id]: e.target.value }))}
                        className="w-full border-b border-cream/25 bg-transparent py-3 font-display text-2xl text-cream outline-none placeholder:text-cream/20 transition-colors focus:border-terracotta"
                      />
                    </div>
                  ))
                ) : (
                  <dl className="divide-y divide-cream/10">
                    {allFields.map((field) => (
                      <div key={field.id} className="flex justify-between gap-4 py-3">
                        <dt className="eyebrow text-cream/50">{field.label}</dt>
                        <dd className="text-right font-display text-lg">{form[field.id] || "—"}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {error && (
              <motion.p
                role="alert"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4 text-sm text-rose"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <div className="mt-8 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => go(step - 1)}
              disabled={step === 0}
              className="eyebrow text-cream/60 transition-colors hover:text-cream disabled:opacity-0"
            >
              ← Voltar
            </button>
            <Magnetic>
              <button
                type="submit"
                className="eyebrow group relative overflow-hidden rounded-full bg-terracotta px-8 py-4 text-cream"
              >
                <span className="absolute inset-0 translate-y-full bg-cream transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-0" />
                <span className="relative transition-colors duration-500 group-hover:text-ink">
                  {step < STEPS.length - 1 ? "Continuar →" : "Quero revender HILOS"}
                </span>
              </button>
            </Magnetic>
          </div>
        </motion.form>
      </div>
    </section>
  );
}
