const { eq } = require("drizzle-orm");
const express = require("express");

const db = require("../db/db");
const { potions } = require("../db/schema");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const allPotions = await db.select().from(potions);
    return res.status(200).json(allPotions);
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
});

module.exports = router;
