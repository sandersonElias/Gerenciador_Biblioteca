package dev.sanderson.Back_End.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Recursos estáticos da aplicação
        registry.addResourceHandler("/static/**")
                .addResourceLocations("classpath:/static/")
                .resourceChain(false);

        // Webjars (usado pelo swagger-ui)
        registry.addResourceHandler("/webjars/**")
                .addResourceLocations("classpath:/META-INF/resources/webjars/")
                .resourceChain(false);

        // Se você tem arquivos públicos em /public, exponha com padrão específico
        registry.addResourceHandler("/public/**")
                .addResourceLocations("classpath:/public/")
                .resourceChain(false);
    }
}
