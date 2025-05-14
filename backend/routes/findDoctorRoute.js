const express = require("express");
const axios = require("axios");
require("dotenv").config();
const router = express.Router();

router.post("/", async (req, res) => {
  const { specialist, location } = req.body;

  //console.log(req.body);

  try {
    // First: Get coordinates from location
    const geoResp = await axios.get(
      `https://nominatim.openstreetmap.org/search`,
      {
        params: {
          q: location,
          format: "json",
          limit: 1,
        },
      }
    );

    if (!geoResp.data.length) {
      return res.status(400).json({ error: "Invalid location" });
    }

    const { lat, lon } = geoResp.data[0];

    // Second: Query Foursquare Places API
    const fsqUrl = `https://api.foursquare.com/v3/places/search`;
    const response = await axios.get(fsqUrl, {
      headers: {
        Authorization: process.env.FOURSQUARE_API_KEY,
      },
      params: {
        query: specialist,
        ll: `${lat},${lon}`,
        radius: 5000, // 5km search radius
        limit: 10,
      },
    });

    //console.log(response.data.results);

    const results = response.data.results.map((place) => ({
      name: place.name,
      address: place.location.formatted_address || place.location.address || "",
      category: place.categories?.[0]?.name || "",
      lat: place.geocodes.main.latitude,
      lon: place.geocodes.main.longitude,
    }));

    res.json({ doctors: results });
  } catch (err) {
    console.error("Foursquare API error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
