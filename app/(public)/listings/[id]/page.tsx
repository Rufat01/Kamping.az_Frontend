import { getListing } from "@/features/(public)/listings/services/listings.service";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { notFound } from "next/navigation";
import Link from "next/link";
import ImageGallery from "@/features/(public)/listings/components/ImageGallery";
import RevealPhoneButton from "@/features/(public)/listings/components/RevealPhoneButton";
import { MapPin, Star, Users, Compass, ArrowUpRight, Calendar, ChevronRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";

type PageProps = { params: { id: string }; searchParams?: { reveal_phone?: string } };

export async function generateMetadata({ params }: PageProps) {
    try {
        const listing = await getListing(params.id);
        return {
            title: `${listing.title} | Kamping.az`,
            description: listing.description?.slice(0, 155),
            openGraph: {
                title: listing.title,
                description: listing.description?.slice(0, 155),
                images: listing.cover_image ? [{ url: listing.cover_image }] : [],
            },
        };
    } catch {
        return { title: "Elan tapilmadi" };
    }
}

export default async function ListingDetailPage({ params, searchParams }: PageProps) {
    const session = await getServerSession(authOptions);
    const autoReveal = !!session && searchParams?.reveal_phone === "true";
    let listing;
    try {
        listing = await getListing(params.id);
    } catch {
        notFound();
    }

    return (
        <>
        <Navbar forceScrolled />
        <main style={{ background: "#FAF6F0" }} className="relative overflow-hidden">

            {/* Decorative floating leaves — global background */}
            <svg className="absolute top-32 right-8 w-12 h-12 opacity-[0.12] animate-float-slow pointer-events-none" viewBox="0 0 64 64" fill="none">
                <path d="M32 8 C40 16, 48 28, 32 56 C16 28, 24 16, 32 8 Z" fill="#D4A574" />
            </svg>
            <svg className="absolute top-[600px] left-6 w-14 h-14 opacity-[0.08] animate-float pointer-events-none hidden lg:block" viewBox="0 0 64 64" fill="none" style={{ transform: "rotate(40deg)" }}>
                <path d="M32 8 C40 16, 48 28, 32 56 C16 28, 24 16, 32 8 Z" fill="#4A6B4F" />
            </svg>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">

                {/* Breadcrumb — compass style */}
                <nav aria-label="Naviqasiya" className="mb-6 flex items-center gap-2 text-sm">
                    <Compass className="w-4 h-4 text-[#D4A574]" strokeWidth={1.5} />
                    <Link href="/" className="text-[#4A6B4F]/70 hover:text-[#2D4A33] transition-colors font-semibold">
                        Ana səhifə
                    </Link>
                    <ChevronRight className="w-3 h-3 text-[#4A6B4F]/40" />
                    <Link href="/listings" className="text-[#4A6B4F]/70 hover:text-[#2D4A33] transition-colors font-semibold">
                        Məkanlar
                    </Link>
                    <ChevronRight className="w-3 h-3 text-[#4A6B4F]/40" />
                    <span className="text-[#2D4A33] font-bold truncate">{listing.title}</span>
                </nav>

                {/* Image Gallery — toxunulmur */}
                <section aria-label="Şəkillər" className="mb-10">
                    <ImageGallery images={listing.images} title={listing.title} />
                </section>

                {/* Main content + sidebar */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">

                    {/* Sol — main content */}
                    <div className="lg:col-span-2 space-y-10">

                        {/* Title section */}
                        <section>
                            <div className="flex items-start justify-between gap-6 mb-4">
                                <div className="flex-1">
                                    {/* Type stamp */}
                                    <div className="inline-block bg-white text-[#2D4A33] text-xs font-bold px-3 py-1.5 rounded-md border-2 border-dashed border-[#4A6B4F]/30 mb-4">
                                        {listing.listing_type_display}
                                    </div>

                                    <h1 className="font-display font-bold text-[#1F2D24] leading-[0.95] mb-3"
                                        style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)" }}>
                                        {listing.title}
                                    </h1>

                                    <div className="flex items-center gap-2 text-[#4A6B4F]/80">
                                        <MapPin className="w-4 h-4" strokeWidth={1.5} />
                                        <span className="text-sm font-medium">
                                            {listing.city} <span className="text-[#4A6B4F]/40">·</span> {listing.address}
                                        </span>
                                    </div>
                                </div>

                                {/* Desktop quick price — only for normal listings */}
                                {!listing.is_free && !listing.entry_fee && listing.price_per_night && (
                                    <div className="hidden sm:block text-right shrink-0">
                                        <p className="font-display text-3xl font-bold text-[#1F2D24]">
                                            ₼{Number(listing.price_per_night).toLocaleString()}
                                        </p>
                                        <p className="text-xs text-[#4A6B4F]/60 mt-1">gecəlik</p>
                                    </div>
                                )}
                            </div>

                            {/* Stats bar */}
                            <div className="flex items-center gap-6 pt-5 mt-5 border-t border-dashed border-[#E8E5D8]">
                                {listing.rating > 0 && (
                                    <div className="flex items-center gap-1.5">
                                        <Star className="w-4 h-4 fill-[#D4A574] text-[#D4A574]" />
                                        <span className="font-bold text-[#1F2D24]">{Number(listing.rating).toFixed(1)}</span>
                                        <span className="text-[#4A6B4F]/60 text-sm">({listing.review_count} rey)</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-1.5 text-[#4A6B4F]/80 text-sm">
                                    <Users className="w-4 h-4" strokeWidth={1.5} />
                                    <span>Maks. <strong>{listing.max_guests}</strong> qonaq</span>
                                </div>
                            </div>
                        </section>

                        {/* Description */}
                        <section aria-labelledby="desc-heading">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-6 h-px bg-[#D4A574]" />
                                <h2 id="desc-heading" className="text-[#A0613B] text-xs font-bold uppercase tracking-[0.25em]">
                                    Məkan haqqında
                                </h2>
                            </div>
                            <div className="bg-white rounded-2xl p-7 lg:p-8 relative"
                                style={{ boxShadow: "0 4px 20px -2px rgba(45,74,51,0.05)" }}>
                                <p className="whitespace-pre-line leading-relaxed text-[#1F2D24]/85 text-base font-light">
                                    {listing.description}
                                </p>
                            </div>
                        </section>

                        {/* Amenities */}
                        {listing.amenities?.length > 0 && (
                            <section aria-labelledby="amenities-heading">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-6 h-px bg-[#D4A574]" />
                                    <h2 id="amenities-heading" className="text-[#A0613B] text-xs font-bold uppercase tracking-[0.25em]">
                                        İmkanlar
                                    </h2>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {listing.amenities.map((amenity) => (
                                        <div
                                            key={amenity.id}
                                            className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-[#E8E5D8] hover:border-[#4A6B4F]/40 hover:shadow-sm transition-all group"
                                        >
                                            {amenity.icon ? (
                                                <img src={amenity.icon} alt="" className="h-5 w-5 shrink-0" aria-hidden="true" />
                                            ) : (
                                                <div className="w-5 h-5 rounded-full bg-[#D4A574]/20 flex items-center justify-center shrink-0">
                                                    <span className="text-[10px]">✦</span>
                                                </div>
                                            )}
                                            <span className="text-[#1F2D24] text-sm font-medium">{amenity.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* CTA back to listings */}
                        <Link href="/listings"
                            className="inline-flex items-center gap-2 text-[#4A6B4F] hover:text-[#2D4A33] text-sm font-bold transition-colors group">
                            ← Bütün məkanlara qayıt
                        </Link>
                    </div>

                    {/* Sag — sticky sidebar */}
                    <aside className="lg:sticky lg:top-24 h-fit space-y-5">

                        {/* Owner — yalnız adi elan */}
                        {!listing.is_free && !listing.entry_fee && listing.owner_name && (
                            <div className="bg-white rounded-3xl overflow-hidden"
                                style={{ boxShadow: "0 8px 30px -5px rgba(45,74,51,0.12)" }}>

                                {/* Header band */}
                                <div className="px-6 py-3 border-b border-dashed border-[#E8E5D8]"
                                    style={{ background: "#FAF6F0" }}>
                                    <p className="text-[#A0613B] text-xs font-bold uppercase tracking-[0.25em]">
                                        Sahibkar
                                    </p>
                                </div>

                                <div className="p-6 space-y-5">
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <div className="flex h-14 w-14 items-center justify-center rounded-full text-[#FAF6F0] text-lg font-bold font-display"
                                                style={{ background: "#2D4A33" }}>
                                                {listing.owner_name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white"
                                                style={{ background: "#D4A574" }} />
                                        </div>
                                        <div>
                                            <p className="font-display text-lg font-bold text-[#1F2D24]">{listing.owner_name}</p>
                                            <p className="text-xs text-[#4A6B4F]/60">Doğrulanmış sahibkar</p>
                                        </div>
                                    </div>

                                    {listing.owner_phone && (
                                        <RevealPhoneButton
                                            phone={listing.owner_phone}
                                            listingId={listing.id}
                                            isLoggedIn={!!session}
                                            autoReveal={autoReveal}
                                        />
                                    )}
                                </div>
                            </div>
                        )}

                        {/* KART 1 — Adi: gecəlik qiymət */}
                        {!listing.is_free && !listing.entry_fee && listing.price_per_night && (
                            <div className="bg-white rounded-3xl overflow-hidden"
                                style={{ boxShadow: "0 8px 30px -5px rgba(45,74,51,0.12)" }}>

                                <div className="px-6 py-3 border-b border-dashed border-[#E8E5D8]"
                                    style={{ background: "#FAF6F0" }}>
                                    <p className="text-[#A0613B] text-xs font-bold uppercase tracking-[0.25em]">
                                        Qiymət detalları
                                    </p>
                                </div>

                                <div className="p-6 space-y-4">
                                    <div className="text-center pb-4 border-b border-dashed border-[#E8E5D8]">
                                        <div className="flex items-baseline justify-center gap-1">
                                            <span className="font-display text-4xl font-bold text-[#1F2D24]">
                                                ₼{Number(listing.price_per_night).toLocaleString()}
                                            </span>
                                            <span className="text-[#4A6B4F]/60 text-sm">/gecə</span>
                                        </div>
                                    </div>

                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[#4A6B4F]/70 flex items-center gap-2">
                                                <Users className="w-3.5 h-3.5" /> Maksimum qonaq
                                            </span>
                                            <span className="font-bold text-[#1F2D24]">{listing.max_guests} nefer</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[#4A6B4F]/70 flex items-center gap-2">
                                                <MapPin className="w-3.5 h-3.5" /> Səhər
                                            </span>
                                            <span className="font-bold text-[#1F2D24]">{listing.city}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* KART 2 — Giriş haqqı */}
                        {listing.entry_fee && (
                            <div className="rounded-3xl overflow-hidden relative"
                                style={{
                                    background: "#FAF6F0",
                                    boxShadow: "0 8px 30px -5px rgba(160,97,59,0.2)",
                                    border: "2px dashed #A0613B"
                                }}>

                                <div className="p-7 space-y-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                                            style={{ background: "#A0613B" }}>
                                            🎟️
                                        </div>
                                        <div>
                                            <p className="text-[#A0613B] text-xs font-bold uppercase tracking-widest">
                                                Ödənişli giriş
                                            </p>
                                            <h3 className="font-display text-lg font-bold text-[#1F2D24]">
                                                Girişi pulludur
                                            </h3>
                                        </div>
                                    </div>

                                    <p className="text-[#4A6B4F]/80 text-sm leading-relaxed italic">
                                    Bu məkana giriş üçün bir dəfəlik ödəniş tələb olunur. Əlavə rezervasiya tələb olunmur.
                                     
                                    </p>

                                    <div className="text-center py-5 rounded-2xl bg-white border border-dashed border-[#A0613B]/30">
                                        <p className="text-[#4A6B4F]/60 text-xs uppercase tracking-widest mb-1">Bir dəfəlik</p>
                                        <div className="flex items-baseline justify-center gap-1">
                                            <span className="font-display text-4xl font-bold text-[#A0613B]">
                                                ₼{Number(listing.entry_fee).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-3 text-sm pt-3 border-t border-dashed border-[#E8E5D8]">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[#4A6B4F]/70 flex items-center gap-2">
                                                <Users className="w-3.5 h-3.5" /> Maksimum qonaq
                                            </span>
                                            <span className="font-bold text-[#1F2D24]">{listing.max_guests} nəfər</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[#4A6B4F]/70 flex items-center gap-2">
                                                <MapPin className="w-3.5 h-3.5" /> Səhər
                                            </span>
                                            <span className="font-bold text-[#1F2D24]">{listing.city}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* KART 3 — Tamamilə pulsuz */}
                        {listing.is_free && !listing.entry_fee && (
                            <div className="rounded-3xl overflow-hidden relative"
                                style={{
                                    background: "#1A3A2E",
                                    boxShadow: "0 8px 30px -5px rgba(26,58,46,0.3)"
                                }}>

                                {/* Decorative leaf */}
                                <svg className="absolute top-4 right-4 w-12 h-12 opacity-30" viewBox="0 0 64 64" fill="none">
                                    <path d="M32 8 C40 16, 48 28, 32 56 C16 28, 24 16, 32 8 Z" fill="#D4A574" />
                                </svg>

                                <div className="p-7 space-y-5 relative z-10">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                                            style={{ background: "#D4A574" }}>
                                            🌿
                                        </div>
                                        <div>
                                            <p className="text-[#D4A574] text-xs font-bold uppercase tracking-widest">
                                                Pulsuz Məkan
                                            </p>
                                            <h3 className="font-display text-lg font-bold text-[#FAF6F0]">
                                                İctimai kamp yeri
                                            </h3>
                                        </div>
                                    </div>

                                    <p className="text-[#FAF6F0]/60 text-sm leading-relaxed italic">
                                    Bu məkan ictimai kamp yeridir. Rezervasiya tələb olunmur — sadəcə yola düş və zövq al.
                                        
                                    </p>

                                    <div className="text-center py-4 rounded-2xl bg-[#FAF6F0]/5 border border-dashed border-[#D4A574]/30">
                                        <span className="font-display text-2xl font-bold text-[#D4A574]">
                                            Tamamilə Pulsuz
                                        </span>
                                    </div>

                                    <div className="space-y-3 text-sm pt-3 border-t border-dashed border-[#FAF6F0]/10">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[#FAF6F0]/50 flex items-center gap-2">
                                                <Users className="w-3.5 h-3.5" /> Maksimum qonaq
                                            </span>
                                            <span className="font-bold text-[#FAF6F0]">{listing.max_guests} nəfər</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[#FAF6F0]/50 flex items-center gap-2">
                                                <MapPin className="w-3.5 h-3.5" /> Səhər
                                            </span>
                                            <span className="font-bold text-[#FAF6F0]">{listing.city}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Naviqasiya CTA */}
                        <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${listing.latitude},${listing.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between gap-3 bg-white border-2 border-dashed border-[#4A6B4F]/30 hover:border-[#2D4A33] hover:shadow-md text-[#1F2D24] font-bold text-sm px-5 py-4 rounded-2xl transition-all group"
                        >
                            <div className="flex items-center gap-3">
                                <Compass className="w-4 h-4 text-[#A0613B]" strokeWidth={1.5} />
                                <span>Google Maps ilə yol al</span>
                            </div>
                            <ArrowUpRight className="w-4 h-4 text-[#4A6B4F] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </a>
                    </aside>
                </div>
            </div>
        </main>
        </>
    );
}
