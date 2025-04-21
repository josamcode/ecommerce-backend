const express = require("express");
const Visit = require("../models/Visit");
const rateLimit = require("express-rate-limit");
const router = express.Router();

const visitLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 1,
  message: {
    status: 429,
    message: "Too many requests from this IP, please try again after 1 minute.",
  },
});

router.post("/", visitLimiter, async (req, res) => {
  const page = req.body.page || "home";

  try {
    let visit = await Visit.findOne({ page });

    if (!visit) {
      visit = new Visit({ page, count: 1 });
    } else {
      visit.count += 1;
    }

    await visit.save();

    res.status(200).json({ visits: visit.count });
  } catch (err) {
    console.error("Visit error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.get("/", async (req, res) => {
  try {
    const visits = await Visit.find({});
    res.status(200).json(visits);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
