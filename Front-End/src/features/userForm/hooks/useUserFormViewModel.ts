import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../../context/ToastContext";
import { useLoading } from "../../../context/LoadingContext";
import { AuthService } from "../../../services/auth/AuthService";
import { Role } from "../../../services/user/types";
import {
  INITIAL_USER_FORM,
  UserFormFormData,
  validateUserForm,
  toUserRequest,
} from "../models/UserFormModel";

export const useUserFormViewModel = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { withLoading } = useLoading();

  const [form, setForm] = useState<UserFormFormData>(INITIAL_USER_FORM);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof UserFormFormData, value: string | Role) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateUserForm(form);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await withLoading(AuthService.register(toUserRequest(form)));
      showToast("Usuário cadastrado com sucesso!", "success");
      navigate("/admin");
    } catch (err: any) {
      showToast(
        err.response?.data?.message || "Erro ao cadastrar usuário",
        "error",
      );
    }
  };

  return {
    form,
    errors,
    showPassword,
    showConfirm,
    handleChange,
    handleSubmit,
    toggleShowPassword: () => setShowPassword((v) => !v),
    toggleShowConfirm: () => setShowConfirm((v) => !v),
    handleBack: () => navigate("/admin"),
  };
};
