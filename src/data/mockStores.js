// Store Deep Dive has no real backing data — Google Play reviews carry no
// store/branch/city information at all. Ported verbatim from the prototype
// mock data pending a real store/CRM data source. Kept isolated here so it's
// obvious what's mock vs. real (see src/data/generated/ for real data).

export const trendLabels = [
  "Oct", "Nov", "Dec", "Jan", "Feb", "Mar",
  "Apr", "May", "Jun", "Jul", "Aug", "Sep",
];

export const stores = [
  { city: "Mumbai", name: "Phoenix Palladium", avg: 4.6, reviews: 842, sent: 82, trend: [4.4, 4.45, 4.5, 4.55, 4.5, 4.6, 4.62, 4.58, 4.55, 4.6, 4.63, 4.6] },
  { city: "Mumbai", name: "Andheri Lokhandwala", avg: 4.3, reviews: 511, sent: 76, trend: [4.1, 4.15, 4.2, 4.25, 4.2, 4.3, 4.28, 4.32, 4.3, 4.35, 4.3, 4.3] },
  { city: "Delhi", name: "Select Citywalk", avg: 4.4, reviews: 623, sent: 78, trend: [4.2, 4.25, 4.3, 4.35, 4.4, 4.38, 4.42, 4.4, 4.36, 4.4, 4.44, 4.4] },
  { city: "Delhi", name: "Connaught Place", avg: 4.1, reviews: 388, sent: 71, trend: [3.9, 4.0, 4.05, 4.1, 4.15, 4.1, 4.08, 4.12, 4.1, 4.15, 4.1, 4.1] },
  { city: "Bengaluru", name: "Phoenix Marketcity", avg: 4.5, reviews: 734, sent: 80, trend: [4.3, 4.35, 4.4, 4.45, 4.5, 4.48, 4.52, 4.5, 4.46, 4.5, 4.54, 4.5] },
  { city: "Bengaluru", name: "Indiranagar", avg: 4.0, reviews: 296, sent: 68, trend: [3.8, 3.9, 3.95, 4.0, 4.05, 4.0, 3.98, 4.02, 4.0, 4.05, 4.0, 4.0] },
];

// Only the mock reviews that carry a store — used by the Store Deep Dive
// review list. Field shape matches src/data/generated/reviews.json so the
// same <ReviewCard> works for both real and mock rows.
export const mockStoreReviews = [
  { name: "Ananya Menon", p: "gmaps", r: 5, d: "2025-09-08", s: "pos", v: true, city: "Bengaluru", store: "Phoenix Marketcity", c: null, t: "Picked up my engagement ring here. The staff let me try a dozen designs without any pressure and the certification was explained clearly. Loved the experience." },
  { name: "Priya Iyer", p: "gmaps", r: 5, d: "2025-09-04", s: "pos", v: true, city: "Mumbai", store: "Phoenix Palladium", c: null, t: "Beautiful store, the consultant remembered my anniversary and suggested a matching pendant. Buyback policy is very transparent." },
  { name: "Sneha Kapoor", p: "instagram", r: 4, d: "2025-09-06", s: "pos", v: false, city: "Delhi", store: "Select Citywalk", c: "Tanishq", t: "Designs are more modern than Tanishq honestly, but the try-at-home slot took a week to confirm." },
  { name: "Divya Rao", p: "gmaps", r: 3, d: "2025-08-30", s: "neu", v: true, city: "Bengaluru", store: "Indiranagar", c: null, t: "Nice collection but the store was crowded on the weekend and I had to wait 40 minutes for a consultant." },
  { name: "Ishita Bose", p: "gmaps", r: 4, d: "2025-08-26", s: "pos", v: true, city: "Delhi", store: "Connaught Place", c: null, t: "Good ambience and honest advice on gold vs lab-grown diamonds. Slightly pricey but you get what you pay for." },
  { name: "Tara Fernandes", p: "gmaps", r: 5, d: "2025-08-24", s: "pos", v: true, city: "Mumbai", store: "Andheri Lokhandwala", c: null, t: "Bought my wedding set here. The team handled the customization patiently and delivered ahead of schedule." },
  { name: "Ritika Shah", p: "gmaps", r: 3, d: "2025-08-20", s: "neu", v: true, city: "Pune", store: "Phoenix Marketcity", c: null, t: "Selection is decent, staff friendly, but the billing counter queue was long during the sale." },
];
