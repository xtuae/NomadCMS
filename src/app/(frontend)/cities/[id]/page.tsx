"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
// import Lottie from "lottie-react";
import emailjs from "@emailjs/browser";

import "./citydetails.css";
// If your load.json lives elsewhere, adjust this import path.
// You can place it at: src/assets/load.json

// If your SparkHeader is a shared component, update this import to where it actually lives.
// Or remove it if you don't use it on this page.

type City = {
  id: string | number;
  countryName: string;
  country_description?: string;

  city_one?: string;
  city_oneinfo?: string;
  city_two?: string;
  city_twoinfo?: string;

  image?: string;
  monthlyCost?: number;
  climate?: string;
  aqi?: string | number;

  cost?: number;
  internetSpeed?: number;
  safetyScore?: number;
  overallScore?: number;

  visaDuration?: string;
  visaFees?: string;

  specialRequirements?: string;
  steps_apply?: string;
  processing_time?: string;
  minimum_incom?: string;
  why_choose?: string;
};

export default function CityDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [city, setCity] = useState<City | null>(null);
  const [showAnimation, setShowAnimation] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    country: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // --- helpers ---
  const resolveImageUrl = (image?: string) => {
    if (!image) return "/fallback.webp";
    if (image.startsWith("http") || image.startsWith("//")) return image;
    // Match your Vite code's API base env var
    return `${process.env.NEXT_PUBLIC_PAYLOAD_API_URL || ""}${image}`;
  };

  const getRatingLevel = (value: number = 0) => {
    if (value >= 80) return { level: "Excellent", color: "#22c55e" };
    if (value >= 70) return { level: "Good", color: "#facc15" };
    if (value >= 60) return { level: "Fair", color: "#f97316" };
    return { level: "Poor", color: "#ef4444" };
  };

  // --- effects ---
  useEffect(() => {
    if (!id) return;

    const loadCity = async () => {
      try {
        // Fetch a single place by id from Payload CMS
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/places/${id}`,
          { cache: "no-store" }
        );
        if (!res.ok) throw new Error(`Failed to fetch place ${id}`);
        const data: City = await res.json();
        setCity(data);
        // preset country in form for email
        setFormData((prev) => ({ ...prev, country: data.countryName || "" }));
      } catch (error) {
        console.error("Error fetching city:", error);
      }
    };

    loadCity();

    const t = setTimeout(() => setShowAnimation(false), 3000);
    return () => clearTimeout(t);
  }, [id]);

  // --- form handlers ---
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          name: formData.name,
          email: formData.email,
          country: formData.country,
          message: formData.message,
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );

      alert("Inquiry sent successfully!");
      setFormData({
        name: "",
        email: "",
        country: city?.countryName || "",
        message: "",
      });
    } catch (error) {
      console.error("Email send failed:", error);
      alert("Failed to send email.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- loading ---
  if (showAnimation || !city) {
    return (
      <div className="city-loading-container">
        {/* <Lottie
          // animationData={loadingAnimation}
          loop={false}
          autoplay={true}
          style={{ width: 300, height: 300 }}
        /> */}
      </div>
    );
  }

  const imageUrl = resolveImageUrl(city.image);

  // --- render ---
  return (
    <div className="city-details-container">
      <div className="sticky-header-wrapper">
        {/* remove if you don't have this component */}
      </div>

      <div
        className="hero-section text-white"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          minHeight: "60vh",
          position: "relative",
        }}
      >
        <div className="back-button" onClick={() => router.back()}>
          <FontAwesomeIcon icon={faArrowLeft} className="back-icon" />
          <span className="back-arrow"></span> Back to Countries
        </div>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>{city.countryName}</h1>
          <p>{city.country_description}</p>
        </div>
      </div>

      <div className="majorcity-section">
        <h2>Major Cities</h2>
        <div className="majorcity-grid">
          <div className="majorcity-card">
            <h3>{city.city_one}</h3>
            <p>{city.city_oneinfo}</p>
          </div>
          <div className="majorcity-card">
            <h3>{city.city_two}</h3>
            <p>{city.city_twoinfo}</p>
          </div>
        </div>
      </div>

      <div className="main-layout">
        {/* Left Side - Living Costs & Quality */}
        <div className="quality-cont">
          <h2>Living Costs & Quality</h2>
          <div className="quality-grid">
            <div className="cost-and-stats">
              <div className="monthly-cost">
                <h3>
                  ${city.monthlyCost}
                  <span>/month</span>
                </h3>
                <p>Estimated monthly cost for nomads</p>
              </div>
              <div className="quick-stats">
                <div className="stat">
                  <span>🌡</span>
                  {city.climate}
                </div>
                <div className="stat">
                  <span>🌿</span>
                  {city.aqi} AQI
                </div>
                <div className="stat">
                  <span>🛡</span>
                  {getRatingLevel(city.safetyScore || 0).level} Safety
                </div>
              </div>
            </div>

            <div className="rating-section">
              {[
                { label: "💰 Cost", value: city.cost || 0, color: "#f97316" },
                {
                  label: "📶 Internet",
                  value: city.internetSpeed || 0,
                  color: "#3b82f6",
                },
                {
                  label: "🛡 Safety",
                  value: city.safetyScore || 0,
                  color: "#22c55e",
                },
                {
                  label: "❤️ Liked",
                  value: city.overallScore || 0,
                  color: "#ef4444",
                },
              ].map(({ label, value, color }) => (
                <div className="rating-row" key={label}>
                  <div className="rating-label">{label}</div>
                  <div className="rating-bar">
                    <div
                      className="fill"
                      style={{ width: `${value}%`, backgroundColor: color }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Stats */}
        <div className="stats-column">
          <div className="stat-box">
            <div className="icon">⏳</div>
            <h3>{city.visaDuration}</h3>
            <p>Visa Duration</p>
          </div>
          <div className="stat-box">
            <div className="icon">📶</div>
            <h3>{city.internetSpeed} Mbps</h3>
            <p>Internet Speed</p>
          </div>
          <div className="stat-box">
            <div className="icon">🌡️</div>
            <h3>{city.climate}</h3>
            <p>Avg. Temperature</p>
          </div>
          <div className="stat-box">
            <div className="icon">💸</div>
            <h3>{city.visaFees}</h3>
            <p>Visa Application Fees</p>
          </div>
        </div>
      </div>

      {/* Visa Overview Section */}
      <div className="visa-overview">
        <div className="visa-layout">
          {/* Left - Requirements */}
          <div className="visa-left">
            <h2>Visa Program Overview</h2>

            <div className="visa-section">
              <h4 className="section-title">✅ Requirements</h4>
              <ul>
                {(city.specialRequirements || "")
                  .split("\n")
                  .map((req) => req.replace(/^-+\s*/, "").trim())
                  .filter((req) => req.length > 0)
                  .map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
              </ul>
            </div>
          </div>

          {/* Right - How to Apply */}
          <div className="visa-right">
            <div className="why-choose">
              <h3>How to Apply? </h3>
              <div className="steps-text">
                {(city.steps_apply || "")
                  .split("\n")
                  .filter((line) => line.trim() !== "")
                  .map((line, index) => {
                    const isIndented = /^\s/.test(line);
                    const trimmed = line.trim();
                    return (
                      <div
                        key={index}
                        style={{ marginLeft: isIndented ? "20px" : "0" }}
                      >
                        {isIndented ? `• ${trimmed}` : trimmed}
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>

        <div className="visa-bottom-stats">
          <div className="stat-block">
            <h5>Processing Time</h5>
            <p>{city.processing_time}</p>
          </div>
          <div className="stat-block">
            <h5>Income Requirement</h5>
            <p>{city.minimum_incom}</p>
          </div>
          <div className="stat-block">
            <h5>Application Fee</h5>
            <p>{city.visaFees}</p>
          </div>
        </div>
      </div>

      {/* About + Inquiry */}
      <div className="about-inquiry-container">
        <div className="city-about">
          <h2 className="city-que">
            Why {city?.countryName} is Perfect for Digital Nomads
          </h2>
          <p className="city-ans1">
            {(city.why_choose || "")
              .split("\n")
              .filter((line) => line.trim() !== "")
              .map((line, index) => (
                <React.Fragment key={index}>
                  {line.trim()}
                  <br />
                </React.Fragment>
              ))}
          </p>
        </div>

        <div className="inquiry-form">
          <h2>Interested in {city.countryName}?</h2>
          <p>
            Get personalized guidance on the visa application process and living
            in {city.countryName}.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="input-row">
              <label>
                Your Name:
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Your Email:
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>

            <label>
              Message:
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="Tell us about your situation and what information you need..."
              ></textarea>
            </label>

            <button type="submit" disabled={isLoading}>
              <FontAwesomeIcon
                icon={faPaperPlane}
                style={{ marginRight: "8px" }}
              />
              {isLoading ? "Sending..." : "Send Inquiry"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
