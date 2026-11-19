const { eq, is } = require("drizzle-orm");
const express = require("express");

const db = require("../db/db");
const { potions } = require("../db/schema");
const renderErrorHandler = require("../utilities/renderErrorHandler");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const allPotions = await db.select().from(potions);
    return res.status(200).json(allPotions);
  } catch (err) {
    renderErrorHandler(res, err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const [entry] = await db
      .select()
      .from(potions)
      .where(eq(req.params.id, potions.id));

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: "Potions not found!",
      });
    }

    return res.status(200).json(entry);
  } catch (err) {
    renderErrorHandler(res, err);
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, effect, isDangerous } = req.body;

    if (!name) {
      return res.status(404).json({
        message: "The `name` field is required!",
      });
    }

    if (!effect) {
      return res.status(404).json({
        message: "The `effect` field is required!",
      });
    }

    if (isDangerous === undefined) {
      return res.status(404).json({
        message: "The `isDangerous` field is required!",
      });
    }

    await db.insert(potions).values({
      name: name,
      effect: effect,
      isDangerous: isDangerous,
    });

    return res.status(201).json({
      message: "New potion added successfully!",
    });
  } catch (err) {
    return renderErrorHandler(res, err);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { name, effect, isDangerous } = req.body;
    const [entry] = await db
      .select()
      .from(potions)
      .where(eq(potions.id, +req.params.id));

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: "Potion not found!",
      });
    }

    await db
      .update(potions)
      .set({ name, effect, isDangerous })
      .where(eq(potions.id, +req.params.id));

    return res.status(200).json({
      message: "Potion updated successfully!",
    });
  } catch (err) {
    return renderErrorHandler(res, err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const [exist] = await db
      .select()
      .from(potions)
      .where(eq(potions.id, +req.params.id));

    if (!exist) {
      return res.status(404).json({
        success: false,
        message: "Potion not found!",
      });
    }

    await db.delete(potions).where(eq(potions.id, +req.params.id));

    return res.status(202).json({
      success: true,
      message: "Potion successfully deleted!",
    });
  } catch (err) {
    renderErrorHandler(res, err);
  }
});

module.exports = router;
