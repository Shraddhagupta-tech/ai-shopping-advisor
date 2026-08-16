package com.luxora.ai.service

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import com.luxora.ai.model.Preferences
import com.luxora.ai.model.Product
import com.luxora.ai.model.RecommendationResponse
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import org.springframework.web.reactive.function.client.WebClient
import java.time.Duration
import java.util.regex.Pattern
import kotlin.math.max
import kotlin.math.min
import kotlin.random.Random

@Service
class RecommendationService(
    private val objectMapper: ObjectMapper,
    @Value("\${gemini.api.key}") private val apiKey: String
) {
    private val logger = LoggerFactory.getLogger(RecommendationService::class.java)
    private val webClient = WebClient.builder().build()

    private val categoryUnsplashMap = mapOf(
        "beauty" to listOf(
            "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1515688594390-b649af70d282?auto=format&fit=crop&w=600&q=80"
        ),
        "skincare" to listOf(
            "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=600&q=80"
        ),
        "fashion" to listOf(
            "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80"
        ),
        "electronics" to listOf(
            "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80"
        ),
        "smartphones" to listOf(
            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=600&q=80"
        ),
        "laptops" to listOf(
            "https://images.unsplash.com/photo-1496181130204-755241524eab?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80"
        ),
        "audio" to listOf(
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1484755560695-a4cf743c3d4e?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80"
        ),
        "home appliances" to listOf(
            "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&w=600&q=80"
        ),
        "fitness" to listOf(
            "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1576678927484-cc90795c7c11?auto=format&fit=crop&w=600&q=80"
        ),
        "travel" to listOf(
            "https://images.unsplash.com/photo-1553913861-c0fddf2619ee?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=600&q=80"
        )
    )

    fun getProductImage(category: String, index: Int): String {
        val normalized = category.lowercase().trim()
        val pool = categoryUnsplashMap[normalized] ?: categoryUnsplashMap["beauty"]!!
        return pool[index % pool.size]
    }

    fun hasApiKey(): Boolean {
        return apiKey.isNotBlank() && apiKey != "MY_GEMINI_API_KEY"
    }

    fun getRecommendations(query: String, preferences: Preferences?): RecommendationResponse {
        if (!hasApiKey()) {
            logger.info("No valid API Key. Delivering highly polished offline simulated responses.")
            return RecommendationResponse(
                products = getFallbackProducts(query, preferences),
                method = "simulated_local",
                message = "Luxora AI local simulation active. Configure GEMINI_API_KEY for dynamic real-time shopping suggestions."
            )
        }

        try {
            val budgetPref = preferences?.budgetPreference ?: "balanced"
            val genderPref = preferences?.gender ?: "Unisex"

            val systemPrompt = """
                You are "Luxora AI", a helpful, refined, and minimal AI shopping advisor designed exclusively for Indian consumers.
                Your tone is sophisticated, helpful, ultra-refined, and objective - mimicking Apple, designer magazines, and tech startups like Notion.

                The user has typed a natural language query for a product in India: "$query"
                User context: Budget preference: $budgetPref, Gender preference: $genderPref.

                This platform serves everyday Indian consumers. Do not prioritize luxury products by default. 
                Search and recommend products from budget, affordable, mid-range, premium, and luxury categories.

                Using the absolute newest information, evaluate the user's intent:
                1. Product Category (Must be exactly one of: Beauty, Skincare, Fashion, Electronics, Smartphones, Laptops, Audio, Home Appliances, Fitness, Travel)
                2. Accurate INR pricing (₹) for Indian stores (Amazon India, Flipkart, Myntra, Nykaa, etc.). Make sure prices are realistic.
                3. Desired features, budget caps (parsed from the text like "under ₹1000" or similar rules), and style constraints.

                IMPORTANT PRODUCT DISCOVERY RULES:
                1. DO NOT prioritize luxury brands by default. This platform serves everyday Indian consumers. Search across all available brands and price segments (Budget, Affordable, Mid-Range, Premium, and Luxury).
                2. ALWAYS provide recommendations from multiple price ranges to ensure diversity. Always include at least:
                   - One budget option (such as "💰 Best Budget Pick")
                   - One value-for-money option (such as "⭐ Best Value For Money")
                   - One premium option (such as "💎 Premium Pick")
                3. NEVER recommend only luxury products unless the user specifically and explicitly asks for luxury or premium products.
                4. For beauty products specifically, only search from and recommend the following designated brands for each pricing tier:
                   - Budget beauty brands: Elle 18, Blue Heaven, Insight, Mars Cosmetics
                   - Affordable beauty brands: Swiss Beauty, Faces Canada, Lakmé, Sugar, Nykaa Cosmetics
                   - Mid-Range beauty brands: Maybelline, L'Oréal Paris, Colorbar, Revlon
                   - Premium beauty brands: MAC, Huda Beauty, Bobbi Brown, Smashbox
                   - Luxury beauty brands: Charlotte Tilbury, Dior, Chanel, Estée Lauder
                5. Structure your output to contain EXACTLY 4 recommendations, each mapped to one of the following dynamic roles in the 'discoveryLabel' field:
                   - "🏆 Best Overall" (Hits the optimal point of ratings, balanced pricing, and extreme popularity)
                   - "💰 Best Budget Pick" (Value budget/lowest price tier option)
                   - "⭐ Best Value For Money" (Amazing specs and affordable/mid-range high value per Rupee)
                   - "💎 Premium Pick" (A premium or luxury status model with unmatched specs)

                Your response MUST be strict JSON matching the schema requested. Return Indian brand items or global staples available in India.
                Provide meaningful Pros/Cons and highly descriptive "spec" keys related to the product (e.g. shade, skin type, battery, RAM, size, material).
                Provide a dynamic English 'imageSearchTerm' (e.g. "matte red lipstick" or "silver mechanical keyboard") to retrieve a beautiful illustration.
            """.trimIndent()

            val schemaJson = """
                {
                  "type": "OBJECT",
                  "properties": {
                    "products": {
                      "type": "ARRAY",
                      "description": "A list of exactly 4 recommended product suggestions conforming to the multi-segment discovery rules.",
                      "items": {
                        "type": "OBJECT",
                        "properties": {
                          "name": { "type": "STRING", "description": "Official product model name" },
                          "brand": { "type": "STRING", "description": "Brand name" },
                          "category": { "type": "STRING", "description": "Must be exactly one of: Beauty, Skincare, Fashion, Electronics, Smartphones, Laptops, Audio, Home Appliances, Fitness, Travel" },
                          "price": { "type": "INTEGER", "description": "Realistic retail price in INR (₹) without commas" },
                          "matchScore": { "type": "INTEGER", "description": "90-100 score based on requirements" },
                          "reason": { "type": "STRING", "description": "Refined 1-2 sentence tailored reason targeting user constraints" },
                          "discoveryLabel": { "type": "STRING", "description": "Strictly must be exactly one of: '🏆 Best Overall', '💰 Best Budget Pick', '⭐ Best Value For Money', '💎 Premium Pick'" },
                          "pros": { "type": "ARRAY", "items": { "type": "STRING" }, "description": "2-3 short, highly descriptive advantages" },
                          "cons": { "type": "ARRAY", "items": { "type": "STRING" }, "description": "1-2 honest drawbacks" },
                          "description": { "type": "STRING", "description": "Sleek overview description" },
                          "features": { "type": "ARRAY", "items": { "type": "STRING" }, "description": "3-4 main specifications or product USPs" },
                          "rating": { "type": "NUMBER", "description": "Real retail rating out of 5 stars (e.g., 4.6)" },
                          "reviewsCount": { "type": "INTEGER", "description": "Total review count" },
                          "specs": {
                            "type": "OBJECT",
                            "description": "Key technical or product specifications as key-value items"
                          },
                          "reviewHighlights": { "type": "ARRAY", "items": { "type": "STRING" }, "description": "2-3 high-quality dynamic reviews" },
                          "imageSearchTerm": { "type": "STRING", "description": "A simple English product category/keyword for stock image loading (e.g. 'headphones')" }
                        },
                        "required": ["name", "brand", "category", "price", "matchScore", "reason", "discoveryLabel", "pros", "cons", "description", "features", "rating", "reviewsCount", "imageSearchTerm"]
                      }
                    }
                  },
                  "required": ["products"]
                }
            """.trimIndent()

            val requestBody = mapOf(
                "contents" to listOf(
                    mapOf(
                        "parts" to listOf(
                            mapOf("text" to systemPrompt)
                        )
                    )
                ),
                "generationConfig" to mapOf(
                    "responseMimeType" to "application/json",
                    "responseSchema" to objectMapper.readValue<Map<String, Any>>(schemaJson)
                )
            )

            // Hit Developer API endpoint with a 10s timeout
            val apiUri = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=$apiKey"
            val responseString = webClient.post()
                .uri(apiUri)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String::class.java)
                .timeout(Duration.ofSeconds(10))
                .block()

            val responseJson = objectMapper.readTree(responseString)
            val textContent = responseJson.path("candidates")
                .path(0)
                .path("content")
                .path("parts")
                .path(0)
                .path("text")
                .asText()

            val parsedRecommendations = objectMapper.readValue<Map<String, List<Map<String, Any>>>>(textContent.trim())
            val productsList = parsedRecommendations["products"] ?: emptyList()

            val processedProducts = productsList.mapIndexed { idx, prodMap ->
                val name = prodMap["name"] as String
                val brand = prodMap["brand"] as String
                val category = prodMap["category"] as String
                val price = (prodMap["price"] as Number).toInt()
                val matchScore = (prodMap["matchScore"] as Number).toInt()
                val reason = prodMap["reason"] as String
                val discoveryLabel = prodMap["discoveryLabel"] as String
                val pros = (prodMap["pros"] as List<*>).map { it.toString() }
                val cons = (prodMap["cons"] as List<*>).map { it.toString() }
                val description = prodMap["description"] as String
                val features = (prodMap["features"] as List<*>).map { it.toString() }
                val rating = (prodMap["rating"] as Number).toDouble()
                val reviewsCount = (prodMap["reviewsCount"] as Number).toInt()
                val specs = (prodMap["specs"] as? Map<*, *>)?.mapKeys { it.key.toString() }?.mapValues { it.value.toString() } ?: emptyMap()
                val reviewHighlights = (prodMap["reviewHighlights"] as? List<*>)?.map { it.toString() } ?: emptyList()
                val imageSearchTerm = prodMap["imageSearchTerm"] as String

                val cleanBrandId = brand.lowercase().replace(Regex("[^a-z0-9]"), "")
                val cleanNameId = name.lowercase().replace(Regex("[^a-z0-9]"), "")

                Product(
                    id = "$cleanBrandId-$cleanNameId-$idx",
                    name = name,
                    brand = brand,
                    category = category,
                    price = price,
                    matchScore = matchScore,
                    reason = reason,
                    discoveryLabel = discoveryLabel,
                    pros = pros,
                    cons = cons,
                    description = description,
                    features = features,
                    rating = rating,
                    reviewsCount = reviewsCount,
                    specs = specs,
                    reviewHighlights = reviewHighlights,
                    imageUrl = getProductImage(category, idx),
                    buyUrl = "https://www.google.com/search?tbm=shop&q=${brand.replace(" ", "+")}+${name.replace(" ", "+")}",
                    imageSearchTerm = imageSearchTerm
                )
            }

            return RecommendationResponse(
                products = processedProducts,
                method = "gemini_api",
                message = "Direct high-fidelity recommendations loaded dynamically from Google Gemini."
            )

        } catch (error: Exception) {
            logger.error("Error in Gemini advice routing, securing fallback response", error)
            return RecommendationResponse(
                products = getFallbackProducts(query, preferences),
                method = "simulated_local_error",
                message = "Secured safe fallback loading due to latency limitations or API restrictions."
            )
        }
    }

    private fun getFallbackProducts(query: String, preferences: Preferences?): List<Product> {
        val qLower = query.lowercase()
        var category = "Beauty"
        if (qLower.contains("skin") || qLower.contains("sun") || qLower.contains("moistur") || qLower.contains("serum")) category = "Skincare"
        else if (qLower.contains("shirt") || qLower.contains("kurta") || qLower.contains("jeans") || qLower.contains("shoe") || qLower.contains("wear")) category = "Fashion"
        else if (qLower.contains("phone") || qLower.contains("mobile") || qLower.contains("galaxy") || qLower.contains("iphone")) category = "Smartphones"
        else if (qLower.contains("laptop") || qLower.contains("macbook") || qLower.contains("engineering")) category = "Laptops"
        else if (qLower.contains("ear") || qLower.contains("headphone") || qLower.contains("sound") || qLower.contains("speaker") || qLower.contains("audio")) category = "Audio"
        else if (qLower.contains("tv") || qLower.contains("vacuum") || qLower.contains("purify") || qLower.contains("appliances")) category = "Home Appliances"
        else if (qLower.contains("fit") || qLower.contains("gym") || qLower.contains("smartwatch") || qLower.contains("pulse")) category = "Fitness"
        else if (qLower.contains("travel") || qLower.contains("bag") || qLower.contains("luggage")) category = "Travel"
        else if (qLower.contains("device") || qLower.contains("tech") || qLower.contains("keyboard") || qLower.contains("mouse") || qLower.contains("monitor")) category = "Electronics"

        var budgetLimit = 150000
        val priceMatcher = Pattern.compile("(?:under|below|₹|rs\\.?)\\s*(\\d+)", Pattern.CASE_INSENSITIVE).matcher(query)
        if (priceMatcher.find()) {
            try {
                budgetLimit = priceMatcher.group(1).toInt()
            } catch (e: Exception) {
                // ignore
            }
        }

        val budgetPref = preferences?.budgetPreference ?: "balanced"
        val limit = min(
            budgetLimit,
            when (budgetPref) {
                "budget" -> 3000
                "balanced" -> 25000
                "premium" -> 150000
                else -> 150000
            }
        )

        val brandsPool = mapOf(
            "Beauty" to mapOf(
                "budget" to listOf("Elle 18", "Blue Heaven", "Insight", "Mars Cosmetics"),
                "affordable" to listOf("Swiss Beauty", "Faces Canada", "Lakmé", "Sugar", "Nykaa Cosmetics"),
                "midRange" to listOf("Maybelline", "L'Oréal Paris", "Colorbar", "Revlon"),
                "premium" to listOf("MAC", "Huda Beauty", "Bobbi Brown", "Smashbox"),
                "luxury" to listOf("Charlotte Tilbury", "Dior", "Chanel", "Estée Lauder")
            ),
            "Skincare" to mapOf(
                "budget" to listOf("Himalaya", "Joy Herbals", "Aroma Magic"),
                "affordable" to listOf("Dot & Key", "Plum Goodness", "The Derma Co"),
                "midRange" to listOf("The Minimalist", "Neutrogena", "CeraVe India", "L'Oréal Paris Skincare"),
                "premium" to listOf("Laneige", "Innisfree", "Kama Ayurveda"),
                "luxury" to listOf("Forest Essentials", "Estée Lauder", "Kiehl's")
            ),
            "Fashion" to mapOf(
                "budget" to listOf("Max Fashion", "Souled Store", "Red Tape"),
                "affordable" to listOf("Westside", "Snitch", "Bewakoof"),
                "midRange" to listOf("Zara India", "H&M India", "Zara", "Marks & Spencer"),
                "premium" to listOf("Tommy Hilfiger", "Superdry", "Calvin Klein"),
                "luxury" to listOf("Ralph Lauren", "Armani Exchange", "Hugo Boss")
            ),
            "Smartphones" to mapOf(
                "budget" to listOf("Redmi", "Realme", "Poco"),
                "affordable" to listOf("Realme Pro", "Redmi Note Pro", "Motorola Edge"),
                "midRange" to listOf("OnePlus India", "Nothing India", "Samsung Galaxy FE"),
                "premium" to listOf("OnePlus Pro", "Samsung Galaxy Plus", "Google Pixel"),
                "luxury" to listOf("Apple iPhone Pro", "Samsung S24 Ultra", "Pixel Pro")
            ),
            "Laptops" to mapOf(
                "budget" to listOf("Acer Aspire", "Lenovo IdeaPad", "Infinix"),
                "affordable" to listOf("HP Pavilion", "ASUS Vivobook", "Dell Inspiron"),
                "midRange" to listOf("Lenovo Yoga", "Xiaomi Notebook Pro", "ASUS Zenbook"),
                "premium" to listOf("Apple MacBook Air", "HP Spectre", "Dell XPS"),
                "luxury" to listOf("Apple MacBook Pro", "ASUS ROG Zephyrus", "Lenovo ThinkPad X1")
            ),
            "Audio" to mapOf(
                "budget" to listOf("boAt", "Noise", "Boult Audio"),
                "affordable" to listOf("OnePlus Nord Buds", "JBL Wave", "Realme Buds Air"),
                "midRange" to listOf("Sony India", "JBL Tune", "Sennheiser HD"),
                "premium" to listOf("OnePlus Buds Pro", "Sony LinkBuds", "Bose QuietComfort"),
                "luxury" to listOf("Apple AirPods Pro", "Sennheiser Momentum", "Bang & Olufsen")
            ),
            "Home Appliances" to mapOf(
                "budget" to listOf("Bajaj", "Crompton", "Usha"),
                "affordable" to listOf("Morphy Richards", "Kent", "Havells"),
                "midRange" to listOf("Philips India", "Samsung Home", "LG India"),
                "premium" to listOf("Dyson India", "Bosch India", "Siemens"),
                "luxury" to listOf("Dyson Outsize", "Miele", "Sub-Zero")
            ),
            "Fitness" to mapOf(
                "budget" to listOf("Noise Fit", "Fire-Boltt", "Fastrack"),
                "affordable" to listOf("OnePlus Band", "Ambrane Active", "Redmi Smart Band"),
                "midRange" to listOf("Fitbit Inspire", "Amazfit GTR", "Cult.fit Active"),
                "premium" to listOf("Apple Watch SE", "Samsung Galaxy Watch", "Fitbit Charge"),
                "luxury" to listOf("Apple Watch Ultra", "Garmin Fenix", "Oura Ring")
            ),
            "Travel" to mapOf(
                "budget" to listOf("Safari", "Skybags", "Aristocrat"),
                "affordable" to listOf("American Tourister", "Wildcraft", "VIP Bag"),
                "midRange" to listOf("Mokobara Light", "Samsonite", "Nasher Miles"),
                "premium" to listOf("Mokobara Transit", "Tommy Hilfiger Luggage", "Delsey Paris"),
                "luxury" to listOf("Rimowa", "Tumi", "Louis Vuitton Carry-on")
            ),
            "Electronics" to mapOf(
                "budget" to listOf("Portronics", "Zebronics", "Ambrane"),
                "affordable" to listOf("Redgear", "Logitech Simple", "HP Desktop Accessories"),
                "midRange" to listOf("Logitech G", "Keychron India", "Razer India"),
                "premium" to listOf("SteelSeries", "Elgato", "Keychron Q Pro"),
                "luxury" to listOf("Wacom Cintiq", "Corsair Premium Setup", "Herman Miller Chair")
            )
        )

        val namesPool = mapOf(
            "Beauty" to mapOf(
                "budget" to "Color Pop Matte Eyeliner Kiss Proof",
                "affordable" to "Double Duty Velvet Liquid Lip Color",
                "midRange" to "SuperStay 24H Full Coverage Foundation",
                "premium" to "Prep + Prime Fixing Mineral Face Spray",
                "luxury" to "Airbrush Flawless Glow Complexion Powder"
            ),
            "Skincare" to mapOf(
                "budget" to "Purifying Daily Herbal Face Cleanser",
                "affordable" to "Glowing 10% Salicylic Niacinamide Ampoule",
                "midRange" to "Ultra Hydrating Ceramide Moisturizer SPF 30",
                "premium" to "Water Sleep Therapy Hydration Overnight Pack",
                "luxury" to "Soundarya Gold Infused Luminous Cream Blend"
            ),
            "Fashion" to mapOf(
                "budget" to "Relaxed Fit Cotton Solid Daily Tee",
                "affordable" to "Comfort Stretch Solid Handcrafted Casual Chino",
                "midRange" to "Linen Modern Cuban Collar Breathable Summer Kurta",
                "premium" to "Classic Pique Contrast Collar Luxury Polo",
                "luxury" to "Unstructured Tailored Italian Fit Blend Jacket"
            ),
            "Smartphones" to mapOf(
                "budget" to "PowerLite Neo 5G",
                "affordable" to "ProSpeed 5G Fluid AMOLED Screen Shield",
                "midRange" to "Nord Core 5G Elegant Oxygen",
                "premium" to "Galaxy S-Series Premium Slate Custom",
                "luxury" to "iPhone Ultimate Titanium Ceramic Frame"
            ),
            "Laptops" to mapOf(
                "budget" to "Aspire Lite Thin Portable Notebook",
                "affordable" to "Vivobook Slim Multitask Everyday Platform",
                "midRange" to "Yoga Edge Convertible touchscreen OLED",
                "premium" to "MacBook Air Silent Heat-Dissipation Edition",
                "luxury" to "MacBook Pro Studio Supreme Liquid Retina"
            ),
            "Audio" to mapOf(
                "budget" to "BassHeads Comfort Stereo Tangle-Free Earbuds",
                "affordable" to "Wave ANC Intelligent Noise Cancelling Buds",
                "midRange" to "WH-Series Over-Ear Crisp Acoustic Headset",
                "premium" to "QuietComfort Soundstage Immersive Headphones",
                "luxury" to "Grand Horizon Premium Stereo Speaker System"
            ),
            "Home Appliances" to mapOf(
                "budget" to "EasyKettle Electric Stainless Fast Boiler",
                "affordable" to "Multi-Slice Crisp Temperature Smart Toaster",
                "midRange" to "Essential Daily Digital Airfryer XL Touch",
                "premium" to "AeroVortex Silent Cordless Vacuum Cleaner",
                "luxury" to "IntelliPurify HEPA Active Carbon Large Purifier"
            ),
            "Fitness" to mapOf(
                "budget" to "Pulse Active Wrist Core Fitness Tracker",
                "affordable" to "FitBand Slim Waterproof Health Metric Tracker",
                "midRange" to "ActiveFit Luxe Hybrid Smart Sportwatch",
                "premium" to "Runners Pro Precise GPS Connected Heart Monitor",
                "luxury" to "Titanium Guard Multi-Sport Adventure Smartwatch"
            ),
            "Travel" to mapOf(
                "budget" to "SecureZip Rugged Cabin Polycarbonate Suitcase",
                "affordable" to "Vagabond Multi-Pocket Lightweight Travel Pack",
                "midRange" to "Nomad Spinner Smooth-Glide Rolling Case",
                "premium" to "Transit Luxury Full-Grain Leather Weekender Duffel",
                "luxury" to "Voyager Handcrafted Rigid Aluminum Flight Suitcase"
            ),
            "Electronics" to mapOf(
                "budget" to "ClickComfort Silent Cordless Everyday Mouse",
                "affordable" to "Mechanical Backlit Ergonomic Budget Keyboard",
                "midRange" to "Master Key Pro Wireless Aluminium Keyboard",
                "premium" to "StreamStream HD Dual-Condenser Studio Mic Setup",
                "luxury" to "Aesthetic Ergonomic Design High-Back Desk Mount"
            )
        )

        val catData = brandsPool[category] ?: brandsPool["Beauty"]!!
        val nameData = namesPool[category] ?: namesPool["Beauty"]!!

        val segments = listOf(
            mapOf(
                "discoveryLabel" to "🏆 Best Overall",
                "brand" to selectRandom(catData["midRange"]!!),
                "name" to nameData["midRange"]!!,
                "price" to max(899, (limit * 0.55).toInt()),
                "matchScore" to 98,
                "reason" to "The absolute best balance of features, performance and price segment, highly rated by Indian shoppers.",
                "pros" to listOf("Exceptional build quality and highly trusted brand support", "Perfect design tuned for modern aesthetic expectations", "Top rated regional customer success review logs")
            ),
            mapOf(
                "discoveryLabel" to "💰 Best Budget Pick",
                "brand" to selectRandom(catData["budget"]!!),
                "name" to nameData["budget"]!!,
                "price" to max(299, min((limit * 0.15).toInt(), 1500)),
                "matchScore" to 92,
                "reason" to "Outstanding budget-conscious pick offering the essential features without any premium surcharge.",
                "pros" to listOf("Incredibly cost effective and accessible brand choice", "Durable structure that beats everything in this price tier", "Highly practical and ready to use out of box")
            ),
            mapOf(
                "discoveryLabel" to "⭐ Best Value For Money",
                "brand" to selectRandom(catData["affordable"]!!),
                "name" to nameData["affordable"]!!,
                "price" to max(599, min((limit * 0.35).toInt(), 4500)),
                "matchScore" to 95,
                "reason" to "Hits the perfect price-to-performance sweet spot, giving you features typically reserved for high-end options.",
                "pros" to listOf("Superior value proposition with maximum specs per Rupee spent", "High ratings from budget buyers looking for elevated standard", "Extremely versatile design fit")
            ),
            mapOf(
                "discoveryLabel" to "💎 Premium Pick",
                "brand" to if (budgetPref == "premium" || budgetPref == "unlimited") catData["luxury"]!![0] else catData["premium"]!![0],
                "name" to if (budgetPref == "premium" || budgetPref == "unlimited") nameData["luxury"]!! else nameData["premium"]!!,
                "price" to max(1499, min((limit * 0.95).toInt(), limit)),
                "matchScore" to 97,
                "reason" to "Unparalleled premium craftsmanship and luxury performance for buyers who expect only the absolute finest.",
                "pros" to listOf("Exquisite elite materials with gorgeous tactile aesthetics", "Industry-leading premium features and advanced technologies", "Extended lifetime support and unmatched status symbol")
            )
        )

        val products = ArrayList<Product>()
        for (i in segments.indices) {
            val seg = segments[i]
            val brand = seg["brand"] as String
            val name = seg["name"] as String
            val price = seg["price"] as Int
            val matchScore = seg["matchScore"] as Int
            val reason = seg["reason"] as String
            val discoveryLabel = seg["discoveryLabel"] as String
            val pros = seg["pros"] as List<String>

            val cleanBrandId = brand.lowercase().replace(Regex("[^a-z0-9]"), "")
            val cleanNameId = name.lowercase().replace(Regex("[^a-z0-9]"), "")

            products.add(
                Product(
                    id = "${category.lowercase()}-${i + 1}",
                    name = "$brand $name",
                    brand = brand,
                    category = category,
                    price = if (price > 0) price else 899,
                    matchScore = matchScore,
                    reason = reason,
                    discoveryLabel = discoveryLabel,
                    pros = pros,
                    cons = listOf("High demand might lead to quick stockouts", "Slight premium compared to basic generic items"),
                    description = "A masterclass in modern hardware and lifestyle engineering, specifically designed to adapt to Indian habits.",
                    features = listOf("Warranty: 1 Year Domestic brand warranty", "Indian customized sizing and features", "Highly reviewed with top-tier ratings"),
                    rating = min(4.4 + (i * 0.12), 4.8),
                    reviewsCount = 142 + (i * 280),
                    buyUrl = "https://amazon.in",
                    specs = mapOf(
                        "Custom Variant" to "Indian Premium Classic",
                        "Color Theme" to "Lustrous Gold & Slate Accent",
                        "Weight" to "Ultra-lightweight ergonomic"
                    ),
                    similarProductIds = listOf("${category.lowercase()}-similar"),
                    reviewHighlights = listOf(
                        "Pure premium quality. Feels exactly like premium physical products!",
                        "Fastest delivery in major Indian cities. Excellent buy under ₹$limit",
                        "Must buy for anyone wanting an elite and minimalist lifestyle item."
                    ),
                    imageUrl = getProductImage(category, i)
                )
            )
        }
        return products
    }

    private fun selectRandom(list: List<String>): String {
        if (list.isEmpty()) return ""
        return list[Random.nextInt(list.size)]
    }
}
