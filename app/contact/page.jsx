"use client";
import { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from "lucide-react";
import { sendContactMessage } from "../../lib/api";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

const INITIAL_FORM = { name: "", email: "", subject: "", message: "" };

function validate(form) {
    const errors = {};
    if (!form.name.trim() || form.name.trim().length < 2)
        errors.name = "Ad ən azı 2 simvol olmalıdır.";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
        errors.email = "Düzgün email daxil edin.";
    if (!form.subject.trim() || form.subject.trim().length < 3)
        errors.subject = "Mövzu ən azı 3 simvol olmalıdır.";
    if (!form.message.trim() || form.message.trim().length < 10)
        errors.message = "Mesaj ən azı 10 simvol olmalıdır.";
    return errors;
}

export default function ContactPage() {
    const [form, setForm] = useState(INITIAL_FORM);
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState("idle"); // idle | sending | success | error
    const [serverError, setServerError] = useState("");
    const { executeRecaptcha } = useGoogleReCaptcha();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        // Yazarkən xətanı sil
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Client validation
        const validationErrors = validate(form);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setStatus("sending");
        setServerError("");

        if (!executeRecaptcha) {
            setServerError("reCAPTCHA hazır deyil. Yenidən cəhd edin.");
            setStatus("error");
            return;
        }

        const recaptchaToken = await executeRecaptcha("contact_form");

        try {
            await sendContactMessage({ ...form, recaptcha_token: recaptchaToken });
            setStatus("success");
            setForm(INITIAL_FORM);
        } catch (err) {
            // Backend validation xətaları
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
            setServerError(err.message || "Xəta baş verdi. Yenidən cəhd edin.");
        }
    };

    return (
        <>
            <main>
                <Navbar />

                {/* Hero */}
                <section className="bg-forest-900 pt-28 pb-16 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto text-center">
                        <span className="inline-block bg-amber-500/20 border border-amber-400/30 text-amber-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
                            Bizimlə əlaqə
                        </span>
                        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
                            Sualınız var?
                        </h1>
                        <p className="text-white/60 text-lg max-w-xl mx-auto">
                            Hər hansı sualınız, təklifiniz və ya probleminiz üçün bizimlə əlaqə saxlayın.
                        </p>
                    </div>
                </section>

                <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                        {/* Sol — əlaqə məlumatları */}
                        <div className="lg:col-span-1 flex flex-col gap-6">
                            <div>
                                <h2 className="font-display text-2xl font-bold text-forest-900 mb-2">
                                    Əlaqə məlumatları
                                </h2>
                                <p className="text-forest-500 text-sm leading-relaxed">
                                    Aşağıdakı kanallardan biri ilə də bizimlə əlaqə saxlaya bilərsiniz.
                                </p>
                            </div>

                            {[
                                { icon: Mail, label: "Email", value: "info@kamping.az", href: "mailto:info@kamping.az" },
                                { icon: Phone, label: "Telefon", value: "+994 50 123 45 67", href: "tel:+994501234567" },
                                { icon: MapPin, label: "Ünvan", value: "Bakı, Azərbaycan", href: null },
                            ].map(({ icon: Icon, label, value, href }) => (
                                <div key={label} className="flex items-start gap-4">
                                    <div className="w-11 h-11 bg-forest-50 rounded-xl flex items-center justify-center shrink-0">
                                        <Icon className="w-5 h-5 text-forest-700" strokeWidth={1.5} />
                                    </div>
                                    <div>
                                        <div className="text-xs font-semibold text-forest-400 uppercase tracking-wider mb-0.5">
                                            {label}
                                        </div>
                                        {href ? (
                                            <a href={href} className="text-forest-800 font-medium text-sm hover:text-forest-600 transition-colors">
                                                {value}
                                            </a>
                                        ) : (
                                            <span className="text-forest-800 font-medium text-sm">{value}</span>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {/* Sosial */}
                            <div className="pt-4 border-t border-forest-100">
                                <div className="text-xs font-semibold text-forest-400 uppercase tracking-wider mb-3">
                                    Sosial şəbəkələr
                                </div>
                                <div className="flex gap-3">
                                    {["Instagram", "Facebook", "YouTube"].map((s) => (
                                        <a
                                            key={s}
                                            href="#"
                                            className="text-xs font-medium text-forest-600 hover:text-forest-900 transition-colors"
                                        >
                                            {s}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sağ — form */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-3xl border border-forest-100 p-8 sm:p-10 shadow-sm">

                                {/* Uğurlu göndərmə */}
                                {status === "success" ? (
                                    <div className="flex flex-col items-center justify-center py-12 text-center">
                                        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
                                            <CheckCircle className="w-8 h-8 text-green-500" />
                                        </div>
                                        <h3 className="font-display text-2xl font-bold text-forest-900 mb-2">
                                            Mesajınız göndərildi!
                                        </h3>
                                        <p className="text-forest-500 text-sm max-w-sm mb-6">
                                            Tezliklə sizinlə əlaqə saxlayacağıq.
                                        </p>
                                        <button
                                            onClick={() => setStatus("idle")}
                                            className="text-sm font-semibold text-forest-700 hover:text-forest-900 underline underline-offset-4 transition-colors"
                                        >
                                            Yeni mesaj göndər
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
                                        <h2 className="font-display text-2xl font-bold text-forest-900 mb-1">
                                            Mesaj göndər
                                        </h2>

                                        {/* Server xətası */}
                                        {status === "error" && serverError && (
                                            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                                                <AlertCircle className="w-4 h-4 shrink-0" />
                                                {serverError}
                                            </div>
                                        )}

                                        {/* Ad + Email */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <div>
                                                <label className="block text-xs font-semibold text-forest-700 uppercase tracking-wider mb-1.5">
                                                    Ad Soyad <span className="text-red-400">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={form.name}
                                                    onChange={handleChange}
                                                    placeholder="Adınız"
                                                    className={`w-full border rounded-xl px-4 py-3 text-sm text-forest-900 placeholder:text-forest-300 focus:outline-none transition-colors ${errors.name
                                                            ? "border-red-300 bg-red-50 focus:border-red-400"
                                                            : "border-forest-200 bg-cream/50 focus:border-forest-400"
                                                        }`}
                                                />
                                                {errors.name && (
                                                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-xs font-semibold text-forest-700 uppercase tracking-wider mb-1.5">
                                                    Email <span className="text-red-400">*</span>
                                                </label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={form.email}
                                                    onChange={handleChange}
                                                    placeholder="email@nümunə.com"
                                                    className={`w-full border rounded-xl px-4 py-3 text-sm text-forest-900 placeholder:text-forest-300 focus:outline-none transition-colors ${errors.email
                                                            ? "border-red-300 bg-red-50 focus:border-red-400"
                                                            : "border-forest-200 bg-cream/50 focus:border-forest-400"
                                                        }`}
                                                />
                                                {errors.email && (
                                                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Mövzu */}
                                        <div>
                                            <label className="block text-xs font-semibold text-forest-700 uppercase tracking-wider mb-1.5">
                                                Mövzu <span className="text-red-400">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="subject"
                                                value={form.subject}
                                                onChange={handleChange}
                                                placeholder="Mövzunu qısa qeyd edin"
                                                className={`w-full border rounded-xl px-4 py-3 text-sm text-forest-900 placeholder:text-forest-300 focus:outline-none transition-colors ${errors.subject
                                                        ? "border-red-300 bg-red-50 focus:border-red-400"
                                                        : "border-forest-200 bg-cream/50 focus:border-forest-400"
                                                    }`}
                                            />
                                            {errors.subject && (
                                                <p className="text-red-500 text-xs mt-1">{errors.subject}</p>
                                            )}
                                        </div>

                                        {/* Mesaj */}
                                        <div>
                                            <label className="block text-xs font-semibold text-forest-700 uppercase tracking-wider mb-1.5">
                                                Mesaj <span className="text-red-400">*</span>
                                            </label>
                                            <textarea
                                                name="message"
                                                value={form.message}
                                                onChange={handleChange}
                                                placeholder="Mesajınızı buraya yazın..."
                                                rows={5}
                                                className={`w-full border rounded-xl px-4 py-3 text-sm text-forest-900 placeholder:text-forest-300 focus:outline-none transition-colors resize-none ${errors.message
                                                        ? "border-red-300 bg-red-50 focus:border-red-400"
                                                        : "border-forest-200 bg-cream/50 focus:border-forest-400"
                                                    }`}
                                            />
                                            {errors.message && (
                                                <p className="text-red-500 text-xs mt-1">{errors.message}</p>
                                            )}
                                        </div>

                                        {/* Submit */}
                                        <button
                                            type="submit"
                                            disabled={status === "sending"}
                                            className="flex items-center justify-center gap-2 bg-forest-800 hover:bg-forest-700 disabled:bg-forest-400 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 hover:shadow-lg active:scale-95 disabled:cursor-not-allowed"
                                        >
                                            {status === "sending" ? (
                                                <>
                                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                                    </svg>
                                                    Göndərilir...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-4 h-4" />
                                                    Göndər
                                                </>
                                            )}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

            </main>
        </>
    );
}