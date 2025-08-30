// app/page.tsx
import CityPreview from "./cities/CityPreview";
import Image from "next/image";
import LifestyleMeter from "./components/LifestyleMeter";

interface HomeHero {
  prefix_title: string;
  headline: string;
  subheadline: string;
  paragraph: string;
  testimonial_head: string;
  testimonial_quote: string;
  testimonials?: Testimonial[];

  backgroundImage?: { url: string };
}

interface HomePageData {
  home_hero: HomeHero;
}

interface Testimonial {
  authorName: string;
  authorAvatar?: { url: string };
  text: string;
}

export default async function HomePage() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/pages?where[pageType][equals]=home&limit=1`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch homepage data");
  }

  const data = await res.json();

  // Quick debug log to see the fetched data
  console.log("Fetched homepage data:", JSON.stringify(data, null, 2));

  const CMS_URL =
    process.env.NEXT_PUBLIC_PAYLOAD_URL?.replace(/\/api$/, "") || "";
  const home: HomePageData = data.docs[0];

  console.log(home);
  console.log(home?.home_hero);

  const bgUrl = home?.home_hero?.backgroundImage?.url
    ? `${CMS_URL}${home.home_hero.backgroundImage.url}`
    : null;

  console.log("Background URL:", bgUrl);
  console.log(
    "First testimonial avatar URL:",
    home.home_hero.testimonials?.[0]?.authorAvatar?.url
  );

  return (
    <main>
      <section className="relative flex items-center justify-between h-[80vh] px-12 md:px-20">
        {bgUrl && (
          <Image
            src={bgUrl}
            alt="Background"
            fill
            quality={100}
            priority
            className="object-cover"
          />
        )}
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Left content */}
        <div className="relative z-10 max-w-xl text-white space-y-4 mt-20">
          <p className="text-sm md:text-base tracking-widest uppercase text-gray-200 mb-2">
            {home.home_hero.prefix_title}
          </p>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold font-serif leading-snug text-white">
            {home.home_hero.subheadline}
          </h2>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold font-serif text-yellow-400 drop-shadow-lg mt-2">
            {home.home_hero.headline}
          </h1>
          <p className="text-base md:text-lg mt-4 mb-8 max-w-xl text-gray-100">
            {home.home_hero.paragraph}
          </p>
        </div>

        {/* Right info box */}
        <div className="relative z-10 bg-white text-black p-6 rounded-xl shadow-lg w-72 md:w-96">
          <h3 className="text-lg md:text-xl font-semibold mb-3 text-gray-800">
            {home.home_hero.testimonial_head}
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            {home.home_hero.testimonial_quote}
          </p>
          <div className="flex -space-x-3 mt-4">
            {home.home_hero.testimonials?.length ? (
              home.home_hero.testimonials.map((t, i) => (
                <Image
                  key={i}
                  src={
                    t.authorAvatar?.url
                      ? t.authorAvatar.url.startsWith("http")
                        ? t.authorAvatar.url
                        : `${CMS_URL}${t.authorAvatar.url}`
                      : "/placeholder.png"
                  }
                  alt={t.authorName || "Author"}
                  width={40}
                  height={40}
                  className="rounded-full border-2 border-white shadow-sm"
                />
              ))
            ) : (
              <Image
                src="/placeholder.png"
                alt="Author"
                width={40}
                height={40}
                className="rounded-full border-2 border-white shadow-sm"
              />
            )}
          </div>
          <div className="mt-6">
            <p className="text-sm text-gray-500 mb-2">FOLLOW US:</p>
            <div className="flex space-x-4">
              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-500"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-pink-500"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.013-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.08 2.465c.636-.247 1.363-.416 2.427-.465C9.53 2.013 9.884 2 12.315 2zM12 7a5 5 0 100 10 5 5 0 000-10zm0 8a3 3 0 110-6 3 3 0 010 6zm5.25-9.75a1.25 1.25 0 100-2.5 1.25 1.25 0 000 2.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              {/* Twitter */}
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-400"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              {/* YouTube */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-red-600"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.78 22 12 22 12s0 3.22-.42 4.814a2.502 2.502 0 01-1.768 1.768c-1.594.42-7.812.42-7.812.42s-6.218 0-7.812-.42a2.502 2.502 0 01-1.768-1.768C2 15.22 2 12 2 12s0-3.22.42-4.814a2.502 2.502 0 011.768-1.768C5.782 5 12 5 12 5s6.218 0 7.812.418zM9.75 15.5V8.5l6.5 3.5-6.5 3.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <h2 className="section-title text-3xl font-bold text-center mb-6">
          Explore Cities
        </h2>
        <CityPreview />
      </div>

      <LifestyleMeter />
    </main>
  );
}
