// Hand-authored from a one-time read-through of the real review corpus in
// BlueStone/reviews.db (keyword scans + manual reading of representative
// reviews per theme). Citations are real reviews (name/rating/text), not
// generated. Re-derive by hand if reviews.db is refreshed with new data.

export const insights = [
  {
    cat: "Product",
    headline: "Design and craftsmanship are the strongest driver of 5★ reviews",
    sev: "Medium",
    count: 515,
    snips: [
      {
        name: "kirti katariya",
        p: "play",
        r: 5,
        t: "After remaining skeptical for long time for online purchase of jewelry, I finally decided to give Bluestone a go. Every process of purchase/return is super smooth and convenient. I love the designs they offer, very beautiful and unique in each category.",
      },
      {
        name: "VANITA SINGH",
        p: "play",
        r: 5,
        t: "Awesome design... Love to wear... Stunning product... Goes with all outfits...",
      },
      {
        name: "Ibtasam Parween",
        p: "play",
        r: 5,
        t: "Have some unique designs, can make order for different ring size, the gold rings are available in 14KT/18KT/22KT purity in low price range. I would say it is a better application than other jewellery applications.",
      },
    ],
  },
  {
    cat: "Product",
    headline: "High making charges are the single most common complaint in 1-2★ reviews",
    sev: "Critical",
    count: 153,
    snips: [
      {
        name: "subhankar sarkar",
        p: "play",
        r: 1,
        t: "High making charges and only western design. After buying the scheme also I paid 21000 as making charge. At the last 25 percent we need to pay as making charges.",
      },
      {
        name: "saiteja rekha",
        p: "play",
        r: 1,
        t: "Very high making charges. You buy any ring or pendant, 30-50% is for making charge only. I am preferring a good branded store where you can bargain the making charges. That doesn't happen in bluestone stores.",
      },
      {
        name: "Surabhi Bais",
        p: "play",
        r: 1,
        t: "I bought a diamond mangalsutra pendant after falling into their 0% making charges trap. After I placed the order, the price breakup showed was totally different. It had full making charges and 25% off on the diamond price.",
      },
    ],
  },
  {
    cat: "Store",
    headline: "In-store staff are repeatedly named and praised by first name",
    sev: "Medium",
    count: 22,
    snips: [
      {
        name: "Santoshi Hajare",
        p: "play",
        r: 5,
        t: "The staff named Himanshu who attended me so well, his nature towards me was brilliant and very impressive, the way he explained the policies of Bluestone was excellent.",
      },
      {
        name: "Menaka Santhanam",
        p: "play",
        r: 5,
        t: "We visited the Coimbatore branch and the staff were really amazing. Nice options in rings, earrings and necklaces. My daughter loved the experience, especially Vishnu was helping us with our choice and customisations.",
      },
      {
        name: "Tejasvini Chaudhari",
        p: "play",
        r: 5,
        t: "Very exciting experience. The staff also very supportive and well behaved. Very unique design, I must suggest everyone should visit Bluestone at least once.",
      },
    ],
  },
  {
    cat: "App",
    headline: "Login, OTP, and app-loading failures block customers before purchase",
    sev: "High",
    count: 46,
    snips: [
      {
        name: "Vineeth Tej Gajelli",
        p: "play",
        r: 1,
        t: "Unable to sign up in any way, no otp, no google login, no facebook login, nothing works.",
      },
      {
        name: "MANJU TIRKEY",
        p: "play",
        r: 5,
        t: "My app is giving trouble, it's not opening. I have twice uninstalled and again installed.",
      },
      {
        name: "A Google user",
        p: "play",
        r: 2,
        t: "When I go to the cart to place an order, the loading circle just won't stop. At the payment section it just won't let me pay. I like the app but this bug just bugs me hard time.",
      },
    ],
  },
  {
    cat: "Customer Support",
    headline: "Support replies with generic, scripted responses instead of resolving issues",
    sev: "Critical",
    count: 181,
    snips: [
      {
        name: "Faraz Pasha",
        p: "play",
        r: 1,
        t: "I ordered a ring for my wife well in advance of our anniversary. It missed our anniversary entirely. Despite my multiple attempts to contact customer service for an update, I received nothing but generic responses and empty promises.",
      },
      {
        name: "Khamney Afi",
        p: "play",
        r: 1,
        t: "Lots of issues with the app. Especially if you're trying to reset your password. And I haven't received any customer support in this regard.",
      },
      {
        name: "ANJU HAZARIKA",
        p: "play",
        r: 1,
        t: "I called customer support team but the call never got connected, have put up a request also from the app itself but no response. Please don't use this app.",
      },
    ],
  },
  {
    cat: "Delivery & Logistics",
    headline: "Delivery delays and stuck refunds are the top driver of 1★ ratings",
    sev: "Critical",
    count: 26,
    snips: [
      {
        name: "Kanika Gupta",
        p: "play",
        r: 1,
        t: "Waiting since ages for my refund on a same-day-delivery return case. It reached their warehouse, refund still not processed. They only reply that the case has been escalated, but a resolution date is never given.",
      },
      {
        name: "harshita gupta",
        p: "play",
        r: 1,
        t: "Delayed deliveries. Without intimation, changes in the metal weight of the product and no follow up from bluestone.",
      },
      {
        name: "A Google user",
        p: "play",
        r: 1,
        t: "A gift for someone supposed to be delivered within a certain timeframe was delayed by a week. Cancelled the order and vowed never to return again to bluestone.",
      },
    ],
  },
  {
    cat: "Brand Perception",
    headline: "Buyback and exchange policy disputes fuel public \"fraud\" accusations",
    sev: "High",
    count: 55,
    snips: [
      {
        name: "impeccablestyle studio",
        p: "play",
        r: 1,
        t: "I feel this whole company is fraud, there was no mobile verification at the time of taking up the plan. Now they are not even updating my contact number. These are bunch of scammers and fraud.",
      },
      {
        name: "Zeal Yang",
        p: "play",
        r: 2,
        t: "I tried the 10+1 gold scheme and it was not what I expected. After maturity I expected a gift card for the same amount, but received a discount voucher with a validity of about 2 months. It seems a little scammy.",
      },
      {
        name: "Gaurav Nartam",
        p: "play",
        r: 1,
        t: "They cancelled the order on their own, stating that the recipient asked to cancel when in reality we never received any call, and now they're not refunding the money too. These are bunch of scammers.",
      },
    ],
  },
];
