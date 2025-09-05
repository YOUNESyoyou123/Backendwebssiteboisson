const express = require("express");
const cors = require("cors");
const connectDB = require("./configurationBD/configurationbd");
const Products = require("./models/product");
const Slider = require("./models/slider");
const Inscriptionclient = require("./models/inscription");
const jwt = require("jsonwebtoken");
JWT_SECRET = "younes";
const app = express();
const PORT = 5000;
const Categorie = require("./models/categorie");
const Diposercv = require("./models/diposercv");

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

app.get("/products/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Products.findById(id);
    if (!product) {
      return res.status(404).json({ error: "Produit non trouvé" });
    }
    res.status(200).json(product);
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
    if (
      !req.body.fr?.title ||
      !req.body.product ||
      !req.body.ProductSliderImage
    ) {
      return res
        .status(400)
        .json({ error: "Champs requis manquants (titre FR, produit, image)" });
    }

    const product = await Products.findById(req.body.product);
    if (!product) {
      return res.status(404).json({ error: "Produit non trouvé" });
    }

    const newSlider = await Slider.create({
      // Champs communs (non spécifiques à la langue)
      ProductSliderImage: req.body.ProductSliderImage,
      product: req.body.product,

      // Champs spécifiques à chaque langue
      ar: {
        title: req.body.ar?.title || req.body.fr.title, // Utilise le titre FR si titre AR non fourni
        DescriptionSlider:
          req.body.ar?.DescriptionSlider ||
          req.body.fr?.DescriptionSlider ||
          "",
        ProductName: product.ar.ProductName,
        Description: product.ar.Description,
        category: product.ar.category,
        Gout: product.ar.Gout || "",
      },
      fr: {
        title: req.body.fr.title,
        DescriptionSlider: req.body.fr.DescriptionSlider || "",
        ProductName: product.fr.ProductName,
        Description: product.fr.Description,
        category: product.fr.category,
        Gout: product.fr.Gout || "",
      },
      en: {
        title: req.body.en?.title || req.body.fr.title, // Utilise le titre FR si titre EN non fourni
        DescriptionSlider:
          req.body.en?.DescriptionSlider ||
          req.body.fr?.DescriptionSlider ||
          "",
        ProductName: product.en.ProductName,
        Description: product.en.Description,
        category: product.en.category,
        Gout: product.en.Gout || "",
      },
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

app.post("/login", async (req, res) => {
  try {
    const { FullName, Password } = req.body;

    // Vérification des champs requis
    if (!FullName || !Password) {
      return res
        .status(400)
        .json({ error: "FullName et password sont requis." });
    }

    // Recherche de l'utilisateur
    const user = await Inscriptionclient.findOne({ FullName });
    if (!user) {
      return res.status(401).json({ error: "Nom ou mot de passe incorrect." });
    }

    // Comparaison directe du mot de passe
    if (Password !== user.Password) {
      return res.status(401).json({ error: "Nom ou mot de passe incorrect." });
    }

    // Génération du token JWT
    const token = jwt.sign(
      { id: user._id, name: user.FullName, role: user.Role },
      JWT_SECRET,
      { expiresIn: "4h" }
    );

    // Réponse avec le token
    return res.status(200).json({
      token,
      FullName: user.FullName,
      Role: user.Role,
    });
  } catch (error) {
    console.error("Erreur serveur :", error);
    return res.status(500).json({ error: "Erreur serveur." });
  }
});

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
// app.patch("commandes/:id/status", async (req, res) => {
//   try {
//     const { status } = req.body;
//     if (
//       !["En cours de traitement", "Accepted", "Refused", "Livré"].includes(
//         status
//       )
//     ) {
//       return res.status(400).json({ error: "Invalid status" });
//     }

//     const commande = await Commande.findByIdAndUpdate(
//       req.params.id,
//       { status },
//       { new: true }
//     );

//     if (!commande) {
//       return res.status(404).json({ error: "Commande not found" });
//     }

//     res.json(commande);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

app.patch("/commandes/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status, responsable } = req.body;

  try {
    const updated = await Commande.findByIdAndUpdate(
      id,
      { status, responsable },
      { new: true }
    );
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: "Update failed" });
  }
});

//inscription

//Categorie

app.post("/categories", async (req, res) => {
  try {
    const { CategorieName, LogoCategorie } = req.body;

    const existingCategorie = await Categorie.findOne({ CategorieName });
    if (existingCategorie) {
      return res.status(400).json({ message: "Cette categorie existe déjà" });
    }

    const newCategorie = new Categorie({
      CategorieName,
      LogoCategorie,
    });

    const savedCategorie = await newCategorie.save();
    res.status(201).json(savedCategorie);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la création de la categorie" });
  }
});

// Récupérer toutes les categories (READ)
app.get("/categories", async (req, res) => {
  try {
    const categories = await Categorie.find();
    res.json(categories);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des categories" });
  }
});

// Récupérer une categorie par ID (READ)
app.get("/categories/:id", async (req, res) => {
  try {
    const categorie = await Categorie.findById(req.params.id);
    if (!categorie) {
      return res.status(404).json({ message: "Categorie non trouvée" });
    }
    res.json(categorie);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération de la categorie" });
  }
});

app.put("/categories/:id", async (req, res) => {
  try {
    const { CategorieName, LogoCategorie } = req.body;

    const existingCategorie = await Categorie.findById(req.params.id);
    if (!existingCategorie) {
      return res.status(404).json({ message: "Categorie non trouvée" });
    }

    if (CategorieName !== existingCategorie.CategorieName) {
      const nameExists = await Categorie.findOne({ CategorieName });
      if (nameExists) {
        return res
          .status(400)
          .json({ message: "Ce nom de categorie est déjà utilisé" });
      }
    }

    const updatedCategorie = await Categorie.findByIdAndUpdate(
      req.params.id,
      { CategorieName, LogoCategorie },
      { new: true }
    );

    res.json(updatedCategorie);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour de la categorie" });
  }
});

// Supprimer une  (DELETE)
app.delete("/categories/:id", async (req, res) => {
  try {
    const deletedCategorie = await Categorie.findByIdAndDelete(req.params.id);
    if (!deletedCategorie) {
      return res.status(404).json({ message: "Categorie non trouvée" });
    }
    res.json({ message: "Categorie supprimée avec succès" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression de la categorie" });
  }
});

app.get("/diposercvs", async (req, res) => {
  try {
    const cvs = await Diposercv.find().sort({ createdAt: -1 });
    res.json(cvs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/diposercvs", async (req, res) => {
  try {
    const newCv = new Diposercv(req.body);
    await newCv.save();
    res.status(201).json(newCv);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.patch("/diposercvs/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status, responsable } = req.body;

    if (!["En cours de traitement", "Reserver"].includes(status)) {
      return res.status(400).json({ error: "Statut invalide" });
    }

    const updated = await Diposercv.findByIdAndUpdate(
      id,
      { status, responsable },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "CV non trouvé" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Supprimer un CV
app.delete("/diposercvs/:id", async (req, res) => {
  try {
    const deleted = await Diposercv.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "CV non trouvé" });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//category
// Nouvelle route pour les produits groupés par catégorie
app.get("/products-by-categories", async (req, res) => {
  try {
    // Récupérer toutes les catégories
    const categories = await Categorie.find();

    // Récupérer tous les produits
    const products = await Products.find();

    // Structurer les données
    const result = categories.map((category) => {
      return {
        _id: category._id,
        name: category.CategorieName,
        logo: category.LogoCategorie,
        products: products.filter(
          (product) => product.en.category === category.CategorieName
        ),
      };
    });

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
