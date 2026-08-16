package com.luxora.ai.controller

import com.luxora.ai.model.HealthResponse
import com.luxora.ai.model.RecommendationRequest
import com.luxora.ai.model.RecommendationResponse
import com.luxora.ai.service.RecommendationService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.time.Instant

@RestController
@RequestMapping("/api")
class RecommendationController(private val recommendationService: RecommendationService) {

    @GetMapping("/health")
    fun healthCheck(): HealthResponse {
        return HealthResponse(
            status = "ok",
            hasApiKey = recommendationService.hasApiKey(),
            timestamp = Instant.now().toString()
        )
    }

    @PostMapping("/recommend")
    fun recommend(@RequestBody request: RecommendationRequest): ResponseEntity<Any> {
        val query = request.query.trim()
        if (query.isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(mapOf("error" to "Missing or invalid search query."))
        }

        val response = recommendationService.getRecommendations(query, request.preferences)
        return ResponseEntity.ok(response)
    }
}

/**
 * Controller to handle SPA routing by forwarding all non-API paths back to index.html
 */
@Controller
class SpaForwardingController {
    @RequestMapping("/{*path}")
    fun forward(): String {
        return "forward:/"
    }
}
