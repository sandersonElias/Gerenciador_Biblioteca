// src/services/solicitacao/SolicitacaoService.ts
import { SolicitacaoPendenteDto, SolicitacaoRenovacaoResponse } from "./types";
import apiClient from "../api/api";

export class SolicitacaoService {
  static async solicitar(emprestimoId: number, email: string): Promise<SolicitacaoRenovacaoResponse> {
    const response = await apiClient.post(
      `/solicitacoes-renovacao/${encodeURIComponent(email)}`,
      { emprestimoId }
    );
    return response.data;
  }

  static async getPendentes(): Promise<SolicitacaoPendenteDto[]> {
    const response = await apiClient.get('/solicitacoes-renovacao/pendentes');
    return response.data;
  }

  static async aprovar(id: number, email: string): Promise<void> {
    await apiClient.put(`/solicitacoes-renovacao/${id}/aprovar/${encodeURIComponent(email)}`);
  }

  static async rejeitar(id: number, email: string, observacao?: string): Promise<void> {
    await apiClient.put(`/solicitacoes-renovacao/${id}/rejeitar/${encodeURIComponent(email)}`, { observacao });
  }

  // ── Endpoints seguros (usam email do JWT) ──────────────────────────────────
  
  static async solicitarSeguro(emprestimoId: number): Promise<SolicitacaoRenovacaoResponse> {
    const response = await apiClient.post('/solicitacoes-renovacao', { emprestimoId });
    return response.data;
  }

  static async aprovarSeguro(id: number): Promise<void> {
    await apiClient.put(`/solicitacoes-renovacao/${id}/aprovar`);
  }

  static async rejeitarSeguro(id: number, observacao?: string): Promise<void> {
    await apiClient.put(`/solicitacoes-renovacao/${id}/rejeitar`, { observacao });
  }
}