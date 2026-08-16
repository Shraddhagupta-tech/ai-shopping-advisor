package com.luxora.ai.model

import com.fasterxml.jackson.annotation.JsonIgnoreProperties

@JsonIgnoreProperties(ignoreUnknown = true)
data class Product(
    val id: String? = null,
    val name: String,
    val brand: String,
    val category: String,
    val price: Int,
    val matchScore: Int,
    val reason: String,
    val pros: List<String>,
    val cons: List<String>,
    val description: String,
    val features: List<String>,
    val rating: Double,
    val reviewsCount: Int,
    val buyUrl: String? = null,
    val specs: Map<String, String> = emptyMap(),
    val similarProductIds: List<String>? = null,
    val reviewHighlights: List<String>? = null,
    val discoveryLabel: String? = null,
    val imageUrl: String? = null,
    val imageSearchTerm: String? = null
)

data class Preferences(
    val budgetPreference: String? = "balanced",
    val gender: String? = "Unisex",
    val focus: List<String>? = emptyList()
)

data class RecommendationRequest(
    val query: String,
    val preferences: Preferences? = null
)

data class RecommendationResponse(
    val products: List<Product>,
    val method: String,
    val message: String
)

data class HealthResponse(
    val status: String,
    val hasApiKey: Boolean,
    val timestamp: String
)
