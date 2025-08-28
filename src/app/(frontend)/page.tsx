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

  const CMS_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL?.replace(/\/api$/, "") || "";
  const home: HomePageData = data.docs[0];

  console.log(home);
  console.log(home?.home_hero);


  const bgUrl = home?.home_hero?.backgroundImage?.url
    ? `${CMS_URL}${home.home_hero.backgroundImage.url}`
    : null;
  
  console.log("Background URL:", bgUrl);
  console.log("First testimonial avatar URL:", home.home_hero.testimonials?.[0]?.authorAvatar?.url);


  return (
    <main>
      <section
  className="relative flex items-center justify-between h-[80vh] px-8 md:px-14"
  style={{
    backgroundImage: bgUrl ? `url(${bgUrl})` : undefined,
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
>
  {/* Dark overlay */}
  <div className="absolute inset-0 bg-black/50"></div>

  {/* Left content */}
  <div className="relative z-10 max-w-xl text-white space-y-4 mt-20">
    <p className="text-sm md:text-base tracking-widest uppercase text-gray-200 mb-2">{home.home_hero.prefix_title}</p>
    <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold font-serif leading-snug text-white">{home.home_hero.subheadline}</h2>

    <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold font-serif text-yellow-400 drop-shadow-lg mt-2">
      {home.home_hero.headline}
    </h1>
    <p className="text-base md:text-lg mt-4 mb-8 max-w-xl text-gray-100">{home.home_hero.paragraph}</p>
  </div>

  {/* Right info box */}
  <div className="relative z-10 bg-white text-black p-6 rounded-xl shadow-lg w-72 md:w-96">
    <h3 className="text-lg md:text-xl font-semibold mb-3 text-gray-800">{home.home_hero.testimonial_head}</h3>
    <p className="text-gray-600 text-sm mb-4">{home.home_hero.testimonial_quote}</p>
    <div className="flex -space-x-3 mt-4">
  {home.home_hero.testimonials?.length ? (
    home.home_hero.testimonials.map((t, i) => (
      <Image
        key={i}
        src={
          t.authorAvatar?.url
            ? t.authorAvatar.url.startsWith("http")
              ? t.authorAvatar.url
              : `${CMS_URL}${t.authorAvatar.url}` // Now safely adds /api/media/...
            : '/placeholder.png'
        }
        alt={t.authorName || 'Author'}
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


  </div>
</section>


      

      <div className="container mx-auto px-4">
        <h2 className="section-title text-3xl font-bold text-center mb-6">Explore Cities</h2>
        <CityPreview />
      </div>

      <LifestyleMeter />
    </main>
  );
}
