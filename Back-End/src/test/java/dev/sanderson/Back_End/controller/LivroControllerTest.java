package dev.sanderson.Back_End.controller;

import dev.sanderson.Back_End.dto.LivroDtos.LivroResponse;
import dev.sanderson.Back_End.security.TokenService;
import dev.sanderson.Back_End.service.LivroService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;

import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = LivroController.class)
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
class LivroControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private LivroService livroService;

    @MockitoBean
    private TokenService tokenService;

    @Test
    void listarTodos_shouldReturnOk() throws Exception {
        // Arrange
        when(livroService.listarTodos()).thenReturn(Collections.emptyList());

        // Act & Assert
        mockMvc.perform(get("/livro/todos"))
                .andExpect(status().isOk());
    }

    @Test
    void listarPopulares_shouldReturnOk() throws Exception {
        // Arrange
        when(livroService.listarMaisPopulares(anyInt())).thenReturn(Collections.emptyList());

        // Act & Assert
        mockMvc.perform(get("/livro/populares"))
                .andExpect(status().isOk());
    }

    @Test
    void buscarPorFiltro_invalidFilter_shouldReturnBadRequest() throws Exception {
        // Act & Assert
        mockMvc.perform(get("/livro/buscar/invalido/termo"))
                .andExpect(status().isBadRequest());
    }
}