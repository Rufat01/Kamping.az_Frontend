"use client";
import { useState } from "react";
import Link from "next/link";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { sendContactMessage } from "../../lib/api";
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, Compass, Instagram, Facebook, Youtube, MessageCircle, ArrowUpRight } from "lucide-react";
import Navbar from "../../components/Navbar";

const INITIAL_FORM = { name: "", email: "", subject: "", message: "" };

function validate(form) {
  const errors = {};
  if (!form.name.trim() || form.name.trim().length < 2)
    errors.name = "Ad en azı 2 simvol olmalidir.";
  if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errors.email = "Duzgun email daxil edin.";
  if (!form.subject.trim() || form.subject.trim().length < 3)
    errors.subject = "Movzu en azı 3 simvol olmalidir.";
  if (!form.message.trim() || form.message.trim().length < 10)
    errors.message = "Mesaj en azı 10 simvol olmalidir.";
  return errors;
}

export default function ContactPage() {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [serverError, setServerError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setStatus("sending");
    setServerError("");

    try {
      if (!executeRecaptcha) {
        setServerError("reCAPTCHA hazir deyil. Yeniden cehd edin.");
        setStatus("error");
        return;
      }
      const recaptchaToken = await executeRecaptcha("contact_form");
      await sendContactMessage({ ...form, recaptcha_token: recaptchaToken });
      setStatus("success");
      setForm(INITIAL_FORM);
    } catch (err) {
      if (err && typeof err === "object") {
        const backendErrors = {};
        Object.keys(err).forEach((key) => {
          if (Array.isArray(err[key])) backendErrors[key] = err[key][0];
        });
        if (Object.keys(backendErrors).length > 0) {
          setErrors(backendErrors);
          setStatus("idle");
          return;
        }
      }
      setStatus("error");
      setServerError(err.message || "Xeta bash verdi. Yeniden cehd edin.");
    }
  };

  return (
     <>
    <Navbar />
    <main style={{ background: "#FAF6F0" }} className="relative overflow-hidden">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden pt-28 pb-20 lg:pb-28 px-4 sm:px-6 lg:px-8"
        style={{ background: "#1A3A2E" }}>

        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1487730116645-74489c95b41b?w=1800&q=85" alt="" className="w-full h-full object-cover opacity-25" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(26,58,46,0.6) 0%, rgba(26,58,46,0.92) 100%)" }} />
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 70% 30%, rgba(212,165,116,0.2) 0%, transparent 60%)" }} />
        </div>

        {/* Floating leaves */}
        <svg className="absolute top-32 left-12 w-14 h-14 opacity-25 animate-float-slow" viewBox="0 0 64 64" fill="none">
          <path d="M32 8 C40 16, 48 28, 32 56 C16 28, 24 16, 32 8 Z" fill="#D4A574" />
        </svg>
        <svg className="absolute bottom-32 right-10 w-12 h-12 opacity-20 animate-float" viewBox="0 0 64 64" fill="none" style={{ transform: "rotate(-30deg)" }}>
          <path d="M32 8 C40 16, 48 28, 32 56 C16 28, 24 16, 32 8 Z" fill="#FAF6F0" />
        </svg>

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="h-px w-10 bg-[#D4A574]" />
            <Compass className="w-5 h-5 text-[#D4A574]" strokeWidth={1.5} />
            <span className="text-[#D4A574] text-xs font-bold uppercase tracking-[0.25em]">
              Bizimle elaqe
            </span>
            <Compass className="w-5 h-5 text-[#D4A574]" strokeWidth={1.5} />
            <div className="h-px w-10 bg-[#D4A574]" />
          </div>

          <h1 className="font-display font-bold text-[#FAF6F0] leading-[0.95] tracking-tight mb-6"
            style={{ fontSize: "clamp(3rem, 8vw, 7rem)" }}>
            Bizimle <em className="text-[#D4A574]">danis</em>
          </h1>

          <p className="text-[#FAF6F0]/65 text-base sm:text-lg max-w-xl mx-auto leading-relaxed font-light">
            Sualin, taklifin ve ya hekayen var? Bir mektub yaz — birlikde kesh edek.
          </p>
        </div>

        {/* Bottom curve */}
        <svg className="absolute bottom-0 left-0 w-full pointer-events-none" viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ height: "50px" }}>
          <path d="M0,50 Q360,10 720,35 T1440,30 L1440,60 L0,60 Z" fill="#FAF6F0" />
        </svg>
      </section>

      {/* ── CONTENT ── */}
      <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 relative">

        <svg className="absolute top-32 right-8 w-16 h-16 opacity-[0.08] animate-float pointer-events-none" viewBox="0 0 64 64" fill="none">
          <path d="M32 8 C40 16, 48 28, 32 56 C16 28, 24 16, 32 8 Z" fill="#D4A574" />
        </svg>

        <div className="relative max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-12">

            {/* Sol — contact info */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-px bg-[#D4A574]" />
                  <span className="text-[#A0613B] text-xs font-bold uppercase tracking-[0.25em]">
                    Elaqe yollari
                  </span>
                </div>
                <h2 className="font-display font-bold text-[#1F2D24] leading-[0.95] mb-3"
                  style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)" }}>
                  Hər vaxt <em className="text-[#4A6B4F]">birlikteyik</em>
                </h2>
                <p className="text-[#4A6B4F]/75 text-sm leading-relaxed">
                  Aşagidaki kanallardan istifade ede biler ve ya formu doldura bilersen.
                </p>
              </div>

              {/* Contact cards — stamps style */}
              {[
                { icon: Mail, label: "Email", value: "info@kamping.az", href: "mailto:info@kamping.az", color: "#4A6B4F" },
                { icon: Phone, label: "Telefon", value: "+994 50 123 45 67", href: "tel:+994501234567", color: "#A0613B" },
                { icon: MapPin, label: "Unvan", value: "Baki, Azərbaycan", href: null, color: "#2D4A33" },
              ].map(({ icon: Icon, label, value, href, color }) => {
                const Wrapper = href ? "a" : "div";
                return (
                  <Wrapper
                    key={label}
                    {...(href ? { href } : {})}
                    className="block bg-white rounded-2xl p-5 group transition-all hover:-translate-y-0.5 hover:shadow-lg"
                    style={{ boxShadow: "0 4px 20px -2px rgba(45,74,51,0.06)" }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: color }}>
                        <Icon className="w-5 h-5 text-[#FAF6F0]" strokeWidth={1.5} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-[#4A6B4F]/60 uppercase tracking-widest mb-0.5">
                          {label}
                        </p>
                        <p className="text-[#1F2D24] font-display font-bold text-base truncate">{value}</p>
                      </div>
                      {href && (
                        <ArrowUpRight className="w-4 h-4 text-[#4A6B4F]/40 group-hover:text-[#2D4A33] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                      )}
                    </div>
                  </Wrapper>
                );
              })}

              {/* Social */}
              <div className="pt-2">
                <p className="text-xs font-bold text-[#4A6B4F]/60 uppercase tracking-widest mb-3">
                  Sosial mediyada
                </p>
                <div className="flex gap-3">
                  {[
                    { icon: Instagram, href: "#" },
                    { icon: Facebook, href: "#" },
                    { icon: Youtube, href: "#" },
                    { icon: MessageCircle, href: "#" },
                  ].map(({ icon: Icon, href }, i) => (
                    <a key={i} href={href}
                      className="w-11 h-11 rounded-2xl bg-white border-2 border-dashed border-[#4A6B4F]/30 flex items-center justify-center hover:border-[#2D4A33] hover:bg-[#2D4A33] group transition-all">
                      <Icon className="w-4 h-4 text-[#4A6B4F] group-hover:text-[#FAF6F0] transition-colors" strokeWidth={1.5} />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Sağ — form */}
            <div className="lg:col-span-3">
              <div className="relative">
                {/* Paper backdrop — slight tilt */}
                <div className="absolute inset-0 rounded-3xl transform rotate-[-0.5deg]"
                  style={{ background: "#E8E5D8", boxShadow: "0 15px 50px -10px rgba(45,74,51,0.15)" }} />

                <div className="relative bg-white rounded-3xl overflow-hidden">

                  {/* Form header — like envelope flap */}
                  <div className="px-7 py-5 border-b-2 border-dashed border-[#E8E5D8]"
                    style={{ background: "#FAF6F0" }}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[#A0613B] text-xs font-bold uppercase tracking-[0.25em] mb-1">
                          Mektub yaz
                        </p>
                        <h2 className="font-display text-2xl font-bold text-[#1F2D24]">
                          Sənin mesajin
                        </h2>
                      </div>
                      <Send className="w-7 h-7 text-[#4A6B4F]/40" strokeWidth={1.5} />
                    </div>
                  </div>

                  {status === "success" ? (
                    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
                      <div className="relative mb-6">
                        <svg className="absolute -top-2 -left-4 w-10 h-10 opacity-40 animate-float-slow" viewBox="0 0 64 64" fill="none">
                          <path d="M32 8 C40 16, 48 28, 32 56 C16 28, 24 16, 32 8 Z" fill="#D4A574" />
                        </svg>
                        <div className="w-20 h-20 rounded-full flex items-center justify-center relative"
                          style={{ background: "#4A6B4F" }}>
                          <CheckCircle className="w-10 h-10 text-[#FAF6F0]" strokeWidth={1.5} />
                        </div>
                      </div>
                      <h3 className="font-display text-3xl font-bold text-[#1F2D24] mb-3">
                        Mesaj <em className="text-[#4A6B4F]">gondərildi!</em>
                      </h3>
                      <p className="text-[#4A6B4F]/70 text-sm max-w-sm mb-6 leading-relaxed">
                        Tezliklə sizinlə əlaqə saxlayacağıq. Bu vaxt mecanlara bir baxin?
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button onClick={() => setStatus("idle")}
                          className="text-[#4A6B4F] hover:text-[#2D4A33] text-sm font-bold transition-colors px-5 py-3 rounded-xl border-2 border-dashed border-[#4A6B4F]/30 hover:border-[#2D4A33]">
                          Yeni mesaj
                        </button>
                        <Link href="/listings"
                          className="bg-[#2D4A33] hover:bg-[#1A3A2E] text-[#FAF6F0] font-bold text-sm px-5 py-3 rounded-xl transition-all">
                          Mecanlara bax →
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} noValidate className="p-7 lg:p-8 space-y-5">

                      {status === "error" && serverError && (
                        <div className="flex items-start gap-3 bg-[#A0613B]/10 border-2 border-dashed border-[#A0613B]/40 text-[#A0613B] text-sm px-4 py-3 rounded-xl">
                          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                          <span>{serverError}</span>
                        </div>
                      )}

                      {/* Name + Email */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                          { name: "name", label: "Ad Soyad", placeholder: "Adin", type: "text" },
                          { name: "email", label: "Email", placeholder: "email@example.com", type: "email" },
                        ].map((field) => (
                          <div key={field.name}>
                            <label className="block text-xs font-bold text-[#4A6B4F] uppercase tracking-widest mb-1.5">
                              {field.label} <span className="text-[#A0613B]">*</span>
                            </label>
                            <input
                              type={field.type}
                              name={field.name}
                              value={form[field.name]}
                              onChange={handleChange}
                              placeholder={field.placeholder}
                              className={`w-full rounded-xl px-4 py-3 text-sm text-[#1F2D24] placeholder:text-[#4A6B4F]/40 focus:outline-none transition-colors border-2 ${
                                errors[field.name]
                                  ? "border-[#A0613B] bg-[#A0613B]/5"
                                  : "border-[#E8E5D8] bg-[#FAF6F0]/50 focus:border-[#4A6B4F]"
                              }`}
                            />
                            {errors[field.name] && (
                              <p className="text-[#A0613B] text-xs mt-1.5 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> {errors[field.name]}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Subject */}
                      <div>
                        <label className="block text-xs font-bold text-[#4A6B4F] uppercase tracking-widest mb-1.5">
                          Movzu <span className="text-[#A0613B]">*</span>
                        </label>
                        <input
                          type="text"
                          name="subject"
                          value={form.subject}
                          onChange={handleChange}
                          placeholder="Mövzuyu qisa qeyd et"
                          className={`w-full rounded-xl px-4 py-3 text-sm text-[#1F2D24] placeholder:text-[#4A6B4F]/40 focus:outline-none transition-colors border-2 ${
                            errors.subject
                              ? "border-[#A0613B] bg-[#A0613B]/5"
                              : "border-[#E8E5D8] bg-[#FAF6F0]/50 focus:border-[#4A6B4F]"
                          }`}
                        />
                        {errors.subject && (
                          <p className="text-[#A0613B] text-xs mt-1.5 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> {errors.subject}
                          </p>
                        )}
                      </div>

                      {/* Message */}
                      <div>
                        <label className="block text-xs font-bold text-[#4A6B4F] uppercase tracking-widest mb-1.5">
                          Mesaj <span className="text-[#A0613B]">*</span>
                        </label>
                        <textarea
                          name="message"
                          value={form.message}
                          onChange={handleChange}
                          placeholder="Sənin hekayən, sualın və ya təklifin..."
                          rows={6}
                          className={`w-full rounded-xl px-4 py-3 text-sm text-[#1F2D24] placeholder:text-[#4A6B4F]/40 focus:outline-none transition-colors resize-none border-2 ${
                            errors.message
                              ? "border-[#A0613B] bg-[#A0613B]/5"
                              : "border-[#E8E5D8] bg-[#FAF6F0]/50 focus:border-[#4A6B4F]"
                          }`}
                        />
                        {errors.message && (
                          <p className="text-[#A0613B] text-xs mt-1.5 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> {errors.message}
                          </p>
                        )}
                      </div>

                      {/* Submit */}
                      <button
                        type="submit"
                        disabled={status === "sending"}
                        className="w-full flex items-center justify-center gap-2 font-bold text-sm px-8 py-4 rounded-2xl transition-all active:scale-95 disabled:cursor-not-allowed hover:shadow-xl"
                        style={{
                          background: status === "sending" ? "#4A6B4F" : "#2D4A33",
                          color: "#FAF6F0"
                        }}
                      >
                        {status === "sending" ? (
                          <>
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                            </svg>
                            Gondərilir...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Mektubu Yola sal
                          </>
                        )}
                      </button>

                      <p className="text-center text-[#4A6B4F]/50 text-xs">
                        Mesajinizi gondərmekle <a href="#" className="underline">qaydalarimizi</a> qebul edirsiniz.
                      </p>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
    </>
  );
}
