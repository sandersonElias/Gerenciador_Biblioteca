import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../context/ToastContext";
import { UserService } from "../../../services/user/UserService";
import {
  INITIAL_TROCAR_SENHA,
  TrocarSenhaFormData,
  validateTrocarSenha,
} from "../models/TrocarSenhaModel";

export const useTrocarSenhaViewModel = () => {
  const { user, marcarSenhaAlterada } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState<TrocarSenhaFormData>(INITIAL_TROCAR_SENHA);
  const [showAtual, setShowAtual] = useState(false);
  const [showNova, setShowNova] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: keyof TrocarSenhaFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateTrocarSenha(form);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      await UserService.trocarSenha({
        senhaAtual: form.senhaAtual,
        novaSenha: form.novaSenha,
        confirmacaoNovaSenha: form.confirmacao,
      });
      marcarSenhaAlterada();
      showToast("Senha alterada com sucesso!", "success");
      navigate("/", { replace: true });
    } catch (error: any) {
      const apiMessage = error?.response?.data?.message;
      showToast(
        apiMessage || "Não foi possível trocar a senha. Tente novamente.",
        "error",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    form,
    errors,
    isLoading,
    showAtual,
    showNova,
    showConfirm,
    handleChange,
    handleSubmit,
    toggleShowAtual: () => setShowAtual((v) => !v),
    toggleShowNova: () => setShowNova((v) => !v),
    toggleShowConfirm: () => setShowConfirm((v) => !v),
  };
};
