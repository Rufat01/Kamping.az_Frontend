export const siteConfig = {
  name: "Kamping.az",
  description: "Azərbaycanda ən gözəl kamp yerlərini kəşf edin.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://kamping.az",
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  recaptchaSiteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "",
  ogImage: "/og-image.jpg",
  links: {
    instagram: "#",
    facebook: "#",
    youtube: "#",
  },
};
