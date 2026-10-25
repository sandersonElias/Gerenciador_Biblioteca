package dev.sanderson.Back_End.config;

import com.zaxxer.hikari.HikariDataSource;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.core.env.Environment;

import javax.sql.DataSource;
import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

@Configuration
public class DatabaseConfig {

    @Bean
    @Primary
    @ConditionalOnProperty(name = "DATABASE_URL")
    public DataSource renderDataSource(Environment environment) {
        String databaseUrl = environment.getProperty("DATABASE_URL");
        URI uri = URI.create(normalizarUrl(databaseUrl));

        String username = "postgres";
        String password = "";

        if (uri.getRawUserInfo() != null) {
            String[] credentials = uri.getRawUserInfo().split(":", 2);
            username = URLDecoder.decode(credentials[0], StandardCharsets.UTF_8);
            if (credentials.length > 1) {
                password = URLDecoder.decode(credentials[1], StandardCharsets.UTF_8);
            }
        }

        int port = uri.getPort() == -1 ? 5432 : uri.getPort();
        String database = uri.getPath().replaceFirst("^/", "");
        String jdbcUrl = "jdbc:postgresql://" + uri.getHost() + ":" + port + "/" + database;

        if (uri.getQuery() != null && !uri.getQuery().isBlank()) {
            jdbcUrl += "?" + uri.getQuery();
        }

        HikariDataSource dataSource = new HikariDataSource();
        dataSource.setJdbcUrl(jdbcUrl);
        dataSource.setUsername(username);
        dataSource.setPassword(password);
        dataSource.setDriverClassName("org.postgresql.Driver");
        dataSource.setMaximumPoolSize(5);
        dataSource.setMinimumIdle(1);
        return dataSource;
    }

    private String normalizarUrl(String databaseUrl) {
        if (databaseUrl.startsWith("postgres://")) {
            return "postgresql://" + databaseUrl.substring("postgres://".length());
        }
        return databaseUrl;
    }
}
