import { getListing } from "../../../lib/api";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ImageGallery from "./ImageGallery";

export async function generateMetadata({ params }) {
    try {
        const listing = await getListing(params.id);
        return {
            title: `${listing.title} | SaytAdı`,
            description: listing.description?.slice(0, 155),
            openGraph: {
                title: listing.title,
                description: listing.description?.slice(0, 155),
                images: listing.cover_image ? [{ url: listing.cover_image }] : [],
            },
        };
    } catch {
        return { title: "Elan tapılmadı" };
    }
}

export default async function ListingDetailPage({ params }) {
    let listing;
    try {
        listing = await getListing(params.id);
    } catch {
        notFound();
    }

    const coverImage =
        listing.cover_image ||
        listing.images?.find((img) => img.is_cover)?.image ||
        listing.images?.[0]?.image ||
        "/placeholder.jpg";

    const otherImages = listing.images?.filter(
        (img) => img.image !== coverImage
    ) || [];

    return (
        <main className="container mx-auto max-w-5xl px-4 py-10">

            {/* Breadcrumb — SEO üçün */}
            <nav aria-label="Naviqasiya" className="mb-4 text-sm text-muted-foreground">
                <Link href="/">Ana səhifə</Link>
                <span className="mx-2">/</span>
                <Link href="/listings">Elanlar</Link>
                <span className="mx-2">/</span>
                <span>{listing.title}</span>
            </nav>

            <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">

                {/* Sol — əsas məzmun */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Şəkil qalereya */}
                    <section aria-label="Şəkillər">
                        <ImageGallery images={listing.images} title={listing.title} />
                    </section>

                    {/* Başlıq + meta */}
                    <section>
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <span className="mb-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                                    {listing.listing_type_display}
                                </span>
                                <h1 className="text-2xl font-bold leading-tight">{listing.title}</h1>
                                <p className="mt-1 text-muted-foreground">
                                    {listing.city}, {listing.address}
                                </p>
                            </div>
                            <div className="text-right shrink-0">
                                <p className="text-2xl font-bold">
                                    {Number(listing.price_per_night).toLocaleString()} ₼
                                </p>
                                <p className="text-sm text-muted-foreground">/ gecə</p>
                            </div>
                        </div>

                        {/* Reytinq */}
                        <div className="mt-3 flex items-center gap-2 text-sm">
                            <span className="text-yellow-500">★</span>
                            <span className="font-medium">{Number(listing.rating).toFixed(1)}</span>
                            <span className="text-muted-foreground">
                                ({listing.review_count} rəy)
                            </span>
                            <span className="mx-2 text-muted-foreground">·</span>
                            <span className="text-muted-foreground">
                                Maks. {listing.max_guests} qonaq
                            </span>
                        </div>
                    </section>

                    {/* Təsvir */}
                    <section aria-labelledby="desc-heading">
                        <h2 id="desc-heading" className="mb-3 text-lg font-semibold">
                            Elan haqqında
                        </h2>
                        <p className="whitespace-pre-line leading-relaxed text-muted-foreground">
                            {listing.description}
                        </p>
                    </section>

                    {/* Əlverişliklər */}
                    {listing.amenities?.length > 0 && (
                        <section aria-labelledby="amenities-heading">
                            <h2 id="amenities-heading" className="mb-4 text-lg font-semibold">
                                Əlverişliklər
                            </h2>
                            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                {listing.amenities.map((amenity) => (
                                    <li
                                        key={amenity.id}
                                        className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm"
                                    >
                                        {amenity.icon && (
                                            <img
                                                src={amenity.icon}
                                                alt=""
                                                className="h-5 w-5"
                                                aria-hidden="true"
                                            />
                                        )}
                                        {amenity.name}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}
                </div>

                {/* Sağ — sahibkar kartı (sticky) */}
                <aside className="lg:sticky lg:top-24 h-fit space-y-4">

                    {/* Sahibkar */}
                    <div className="rounded-2xl border p-5 space-y-4">
                        <h2 className="font-semibold">Sahibkar</h2>
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                                {listing.owner_name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="font-medium">{listing.owner_name}</p>
                                <p className="text-sm text-muted-foreground">Sahibkar</p>
                            </div>
                        </div>


                        <a
                            href={`tel:${listing.owner_phone}`}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
                        >
                            📞 {listing.owner_phone}
                        </a>
                    </div>

                    {/* Qiymət xülasəsi */}
                    <div className="rounded-2xl border p-5 space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Gecəlik qiymət</span>
                            <span className="font-medium">
                                {Number(listing.price_per_night).toLocaleString()} ₼
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Maksimum qonaq</span>
                            <span className="font-medium">{listing.max_guests} nəfər</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Şəhər</span>
                            <span className="font-medium">{listing.city}</span>
                        </div>
                    </div>

                </aside>
            </div>
        </main>
    );
}