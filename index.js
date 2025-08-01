const express = require("express");
const cors = require("cors");
const connectDB = require("./configurationBD/configurationbd");
const Products = require("./models/product");
const Slider = require("./models/slider");
const Inscriptionclient = require("./models/inscription");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to DB
connectDB();

// =================== ROUTES =================== //

// === Products ===
app.get("/products", async (req, res) => {
  try {
    const data = await Products.find();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/products", async (req, res) => {
  try {
    const newProduct = await Products.create(req.body);
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put("/products/:id", async (req, res) => {
  try {
    const updated = await Products.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete("/products/:id", async (req, res) => {
  try {
    await Products.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// === Slider ===
app.get("/sliders", async (req, res) => {
  try {
    const data = await Slider.find();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Dans votre route POST /sliders
app.post("/sliders", async (req, res) => {
  try {
    // Validation des champs requis
    if (!req.body.title || !req.body.product || !req.body.ProductSliderImage) {
      return res.status(400).json({ error: "Champs requis manquants" });
    }

    const product = await Products.findById(req.body.product);
    if (!product) {
      return res.status(404).json({ error: "Produit non trouvé" });
    }

    const newSlider = await Slider.create({
      title: req.body.title,
      DescriptionSlider: req.body.DescriptionSlider || "", // Description optionnelle
      ProductSliderImage: req.body.ProductSliderImage,
      product: req.body.product,
      // Copie des champs du produit
      ProductName: product.ProductName,
      Description: product.Description,
      ProductImage: product.ProductImage,
      category: product.category,
    });

    res.status(201).json(newSlider);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put("/sliders/:id", async (req, res) => {
  try {
    // Vérifier que le slider existe
    const existingSlider = await Slider.findById(req.params.id);
    if (!existingSlider) {
      return res.status(404).json({ error: "Slider non trouvé" });
    }

    // Si le produit est modifié, vérifier qu'il existe
    let product = null;
    if (req.body.product) {
      product = await Products.findById(req.body.product);
      if (!product) {
        return res.status(404).json({ error: "Nouveau produit non trouvé" });
      }
    } else {
      product = await Products.findById(existingSlider.product);
    }

    // Mettre à jour le slider
    const updatedSlider = await Slider.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title || existingSlider.title,
        DescriptionSlider:
          req.body.DescriptionSlider || existingSlider.DescriptionSlider,
        ProductSliderImage:
          req.body.ProductSliderImage || existingSlider.ProductSliderImage,
        product: req.body.product || existingSlider.product,
        // Mettre à jour les données copiées si le produit a changé
        ProductName: product.ProductName,
        Description: product.Description,
        ProductImage: product.ProductImage,
        ProductLogoImage: product.ProductLogoImage,
        category: product.category,
      },
      { new: true }
    );

    res.status(200).json(updatedSlider);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete("/sliders/:id", async (req, res) => {
  try {
    await Slider.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// === Clients ===
app.get("/clients", async (req, res) => {
  try {
    const data = await Inscriptionclient.find();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/clients", async (req, res) => {
  try {
    const newClient = await Inscriptionclient.create(req.body);
    res.status(201).json(newClient);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete("/clients/:id", async (req, res) => {
  try {
    await Inscriptionclient.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

const Commande = require("./models/commande");

//Commande
app.post("/commandes", async (req, res) => {
  try {
    const commande = new Commande(req.body);
    await commande.save();
    res.status(201).json(commande);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all commandes (for admin panel)
app.get("/commandes", async (req, res) => {
  try {
    const commandes = await Commande.find().sort({ createdAt: -1 });
    res.json(commandes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update commande status (for admin panel)
app.patch("commandes/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    if (
      !["En cours de traitement", "Accepted", "Refused", "Livré"].includes(
        status
      )
    ) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const commande = await Commande.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!commande) {
      return res.status(404).json({ error: "Commande not found" });
    }

    res.json(commande);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
