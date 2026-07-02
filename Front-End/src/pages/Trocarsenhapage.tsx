import React from "react";
import { useTrocarSenhaViewModel } from "../features/trocarSenha/hooks/useTrocarSenhaViewModel";
import { MIN_PASSWORD_LENGTH } from "../features/trocarSenha/models/TrocarSenhaModel";
import TrocarSenhaHeader from "../features/trocarSenha/components/TrocarSenhaHeader";
import PasswordField from "../features/trocarSenha/components/PasswordField";
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
          <PasswordField
            id="senhaAtual"
            label="Senha atual"
            value={vm.form.senhaAtual}
            onChange={(v) => vm.handleChange("senhaAtual", v)}
            show={vm.showAtual}
            onToggleShow={vm.toggleShowAtual}
            error={vm.errors.senhaAtual}
            placeholder={
              vm.user?.senhaAlterada ? "Sua senha atual" : "Sua matrícula"
            }
            autoComplete="current-password"
          />

          <PasswordField
            id="novaSenha"
            label="Nova senha"
            value={vm.form.novaSenha}
            onChange={(v) => vm.handleChange("novaSenha", v)}
            show={vm.showNova}
            onToggleShow={vm.toggleShowNova}
            error={vm.errors.novaSenha}
            placeholder={`Mínimo ${MIN_PASSWORD_LENGTH} caracteres`}
            autoComplete="new-password"
          />

          <PasswordField
            id="confirmacao"
            label="Confirmar nova senha"
            value={vm.form.confirmacao}
            onChange={(v) => vm.handleChange("confirmacao", v)}
            show={vm.showConfirm}
            onToggleShow={vm.toggleShowConfirm}
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
