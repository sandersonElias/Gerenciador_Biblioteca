package dev.sanderson.Back_End.config;

import jakarta.servlet.http.HttpServletRequest;

/**
 * Utilitario para extrair o IP real do cliente,
 * considerando proxies reversos (nginx, Railway, etc).
 */
public final class IpUtils {

    private IpUtils() {
    }

    public static String getClientIP(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isBlank()) {
            return xForwardedFor.split(",")[0].trim();
        }

        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isBlank()) {
            return xRealIp.trim();
        }

        return request.getRemoteAddr();
    }
}
