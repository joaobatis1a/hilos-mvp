"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { SectionDot } from "./ThreadRail";
import { RevealLines } from "./RevealLines";
import { Magnetic } from "./Magnetic";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/analytics";

const fields = [
  { id: "nome", label: "Nome", required: true, type: "text" },
  { id: "loja", label: "Nome da loja", required: true, type: "text" },
  { id: "cidade", label: "Cidade", required: true, type: "text" },
  { id: "instagram", label: "Instagram da loja", required: true, type: "text" },
  { id: "whatsapp", label: "WhatsApp", required: true, type: "tel" },
  { id: "cnpj", label: "CNPJ (opcional)", required: false, type: "text" },
] as const;

type FormState = Record<(typeof fields)[number]["id"], string>;

const initialState: FormState = {
  nome: "",
  loja: "",
  cidade: "",
  instagram: "",
  whatsapp: "",
  cnpj: "",
};

export function Wholesale() {
  const [form, setForm] = useState<FormState>(initialState);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const message = [
      "Olá! Quero revender HILOS. Seguem meus dados:",
      `Nome: ${form.nome}`,
      `Loja: ${form.loja}`,
      `Cidade: ${form.cidade}`,
      `Instagram: ${form.instagram}`,
      `WhatsApp: ${form.whatsapp}`,
      form.cnpj ? `CNPJ: ${form.cnpj}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    trackEvent("atacado_lead_submit", { cidade: form.cidade });
    window.open(buildWhatsAppLink(message), "_blank", "noopener,noreferrer");
  }

  return (
    <section id="atacado" className="relative bg-ink py-24 text-cream md:py-32">
      <SectionDot tone="ink" />
      <div className="rail-gutter container-hilos grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.7 }}
        >
          <p className="eyebrow mb-4 text-rose">Atacado HILOS</p>
          <RevealLines
            as="h2"
            lines={["Vista sua loja", "com HILOS."]}
            className="font-display text-3xl font-medium md:text-5xl"
          />
          <p className="mt-6 max-w-sm text-cream/70">
            Quer levar a HILOS para seus clientes? Deixe seus dados e nossa
            equipe te procura no WhatsApp com as condições de atacado.
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="space-y-4"
        >
          {fields.map((field, i) => (
            <motion.div
              key={field.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.06 }}
            >
              <label htmlFor={field.id} className="eyebrow mb-2 block text-cream/60">
                {field.label}
              </label>
              <input
                id={field.id}
                type={field.type}
                required={field.required}
                value={form[field.id]}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, [field.id]: e.target.value }))
                }
                className="w-full border-b border-cream/25 bg-transparent py-2.5 text-cream outline-none transition-colors focus:border-terracotta"
              />
            </motion.div>
          ))}

          <Magnetic className="mt-6 block w-full md:inline-block md:w-auto">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              className="eyebrow w-full rounded-full bg-terracotta px-7 py-4 text-cream transition-colors hover:bg-terracotta-deep md:w-auto"
            >
              Quero revender HILOS
            </motion.button>
          </Magnetic>
        </motion.form>
      </div>
    </section>
  );
}
