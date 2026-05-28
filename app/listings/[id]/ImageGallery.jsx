"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs, Zoom, Keyboard } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/zoom";

export default function ImageGallery({ images, title }) {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [lightbox, setLightbox] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [mainSwiper, setMainSwiper] = useState(null);

    const sorted = images?.length
        ? [
            ...images.filter((img) => img.is_cover),
            ...images.filter((img) => !img.is_cover),
        ]
        : [];

    // Scroll kilidi
    useEffect(() => {
        document.body.style.overflow = lightbox ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [lightbox]);

    // Lightbox açılanda eyni slide-da davam et
    const openLightbox = (index) => {
        setActiveIndex(index);
        setLightbox(true);
    };

    if (!sorted.length) return null;

    return (
        <>
            {/* ── Əsas qalereya ── */}
            <div className="overflow-hidden rounded-2xl">
                <Swiper
                    modules={[Navigation, Thumbs, Keyboard]}
                    navigation
                    keyboard={{ enabled: true }}
                    thumbs={{ swiper: thumbsSwiper }}
                    onSwiper={setMainSwiper}
                    onSlideChange={(s) => setActiveIndex(s.activeIndex)}
                    className="gallery-main aspect-[16/9] w-full cursor-zoom-in"
                    onClick={() => openLightbox(activeIndex)}
                >
                    {sorted.map((img, i) => (
                        <SwiperSlide key={img.id}>
                            <div className="relative h-full w-full">
                                <Image
                                    src={img.image || "/placeholder.jpg"}
                                    alt={`${title} — ${i + 1}`}
                                    fill
                                    sizes="(max-width: 1024px) 100vw, 66vw"
                                    className="object-cover"
                                    priority={i === 0}
                                />
                            </div>
                        </SwiperSlide>
                    ))}

                    {/* Sayğac */}
                    <div className="swiper-counter">
                        {activeIndex + 1} / {sorted.length}
                    </div>
                </Swiper>

                {/* Thumbnails */}
                {sorted.length > 1 && (
                    <Swiper
                        modules={[Thumbs]}
                        onSwiper={setThumbsSwiper}
                        slidesPerView={4}
                        spaceBetween={8}
                        watchSlidesProgress
                        className="gallery-thumbs mt-3"
                    >
                        {sorted.map((img, i) => (
                            <SwiperSlide key={img.id}>
                                <div
                                    className="relative aspect-square cursor-pointer overflow-hidden rounded-lg"
                                    onClick={() => {
                                        mainSwiper?.slideTo(i);
                                        setActiveIndex(i);
                                    }}
                                >
                                    <Image
                                        src={img.image || "/placeholder.jpg"}
                                        alt={`${title} — ${i + 1}`}
                                        fill
                                        sizes="25vw"
                                        className="object-cover"
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                )}
            </div>

            {/* ── Lightbox ── */}
            {/* ── Lightbox ── */}
            {lightbox && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center"
                    style={{ backgroundColor: "rgba(0,0,0,0.96)" }}
                    onClick={() => setLightbox(false)}
                >
                    {/* Bağla düyməsi */}
                    <button
                        className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/25 transition"
                        onClick={() => setLightbox(false)}
                        aria-label="Bağla"
                    >
                        ✕
                    </button>

                    {/* Slider — kənara klik keçməsin */}
                    <div
                        className="relative w-full max-w-5xl px-16"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Swiper
                            modules={[Navigation, Zoom, Keyboard]}
                            navigation
                            zoom={{ maxRatio: 3 }}
                            keyboard={{ enabled: true }}
                            initialSlide={activeIndex}
                            onSlideChange={(s) => setActiveIndex(s.activeIndex)}
                            className="lightbox-swiper"
                        >
                            {sorted.map((img, i) => (
                                <SwiperSlide key={img.id}>
                                    <div className="swiper-zoom-container">
                                        <div className="relative h-[80vh] w-full">
                                            <Image
                                                src={img.image || "/placeholder.jpg"}
                                                alt={`${title} — ${i + 1}`}
                                                fill
                                                sizes="100vw"
                                                className="object-contain"
                                                priority={i === activeIndex}
                                            />
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        {/* Dot indikatoru */}
                        <div className="mt-4 flex justify-center gap-2">
                            {sorted.map((_, i) => (
                                <span
                                    key={i}
                                    className={`block rounded-full transition-all duration-200 ${i === activeIndex
                                        ? "h-1.5 w-6 bg-white"
                                        : "h-1.5 w-1.5 bg-white/40"
                                        }`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Sayğac */}
                    <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm text-white/60">
                        {activeIndex + 1} / {sorted.length}
                    </p>
                </div>
            )}

            {/* ── Swiper custom styles ── */}
            <style>{`
        .gallery-main { position: relative; }

        .swiper-counter {
          position: absolute;
          bottom: 12px;
          right: 12px;
          z-index: 10;
          background: rgba(0,0,0,0.55);
          color: #fff;
          font-size: 12px;
          padding: 3px 10px;
          border-radius: 20px;
        }

        .gallery-thumbs .swiper-slide {
          opacity: 0.5;
          transition: opacity 0.2s;
        }
        .gallery-thumbs .swiper-slide-thumb-active {
          opacity: 1;
          outline: 2px solid hsl(var(--primary));
          border-radius: 8px;
        }

        .gallery-main .swiper-button-next,
.gallery-main .swiper-button-prev {
  color: #fff;
  background: rgba(0,0,0,0.4);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  transition: background 0.2s, opacity 0.2s;  /* opacity əlavə et */
  opacity: 0;                                   /* default gizli */
}
        .lightbox-swiper .swiper-button-next:hover,
        .lightbox-swiper .swiper-button-prev:hover {
          background: rgba(255,255,255,0.25);
        }
        .lightbox-swiper .swiper-button-next::after,
        .lightbox-swiper .swiper-button-prev::after {
          font-size: 30px;
        }

        .gallery-main .swiper-button-next,
        .gallery-main .swiper-button-prev {
          color: #fff;
          background: rgba(0,0,0,0.4);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          transition: background 0.2s;
        }
        .gallery-main .swiper-button-next:hover,
        .gallery-main .swiper-button-prev:hover {
          background: rgba(0,0,0,0.65);
        }
        .gallery-main .swiper-button-next::after,
        .gallery-main .swiper-button-prev::after {
          font-size: 14px;
        }
      `}</style>
        </>
    );
}