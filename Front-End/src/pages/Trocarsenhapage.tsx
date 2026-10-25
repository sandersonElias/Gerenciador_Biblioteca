import React from "react";
import { useTrocarSenhaViewModel } from "../features/trocarSenha/hooks/useTrocarSenhaViewModel";
import { MIN_PASSWORD_LENGTH } from "../features/trocarSenha/models/TrocarSenhaModel";
import TrocarSenhaHeader from "../features/trocarSenha/components/TrocarSenhaHeader";
import PasswordInput from "../components/common/PasswordInput";
import Button from "../components/common/Button";
import "./Trocarsenhapage.scss";

const TrocarSenhaPage: React.FC = () => {
  const vm = useTrocarSenhaViewModel();

  return (
    <div className="trocar-senha-page">
      <div className="trocar-senha-card">
        <TrocarSenhaHeader senhaAlterada={vm.user?.senhaAlterada} />

        <form
          onSubmit={vm.handleSubmit}
          className="trocar-senha-form"
          noValidate
        >
          <PasswordInput
            id="senhaAtual"
            label="Senha atual"
            value={vm.form.senhaAtual}
            onChange={(v) => vm.handleChange("senhaAtual", v)}
            showPassword={vm.showAtual}
            onToggleVisibility={vm.toggleShowAtual}
            error={vm.errors.senhaAtual}
            placeholder={
              vm.user?.senhaAlterada ? "Sua senha atual" : "Sua matrícula"
            }
            autoComplete="current-password"
          />

          <PasswordInput
            id="novaSenha"
            label="Nova senha"
            value={vm.form.novaSenha}
            onChange={(v) => vm.handleChange("novaSenha", v)}
            showPassword={vm.showNova}
            onToggleVisibility={vm.toggleShowNova}
            error={vm.errors.novaSenha}
            placeholder={`Mínimo ${MIN_PASSWORD_LENGTH} caracteres`}
            autoComplete="new-password"
          />

          <PasswordInput
            id="confirmacao"
            label="Confirmar nova senha"
            value={vm.form.confirmacao}
            onChange={(v) => vm.handleChange("confirmacao", v)}
            showPassword={vm.showConfirm}
            onToggleVisibility={vm.toggleShowConfirm}
            error={vm.errors.confirmacao}
            placeholder="Repita a nova senha"
            autoComplete="new-password"
          />

          <div className="trocar-senha-form__actions">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={vm.isLoading}
            >
              Alterar senha
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TrocarSenhaPage;
