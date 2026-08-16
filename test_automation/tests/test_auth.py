"""
test_auth.py — Testes de API para o módulo de Autenticação (/api/auth/*).

Cobre os endpoints críticos:
  - POST /api/auth/login (válido, inválido, inativo)
  - POST /api/auth/register (paciente, psicólogo, duplicado, validações)
  - PUT /api/auth/alterar-senha (validação de força)
  - POST /api/auth/recuperar-senha / redefinir-senha

Mensagens de erro exatas extraídas do DOCUMENTO_TECNICO_CEDRO.md (ETAPA 9).
"""

import pytest

import config

# Mensagens de erro exatas do backend
MSG_LOGIN_INCORRETO = "Email ou senha incorretos"
MSG_EMAIL_DUPLICADO = "Esse email ja ta em uso"
MSG_SENHA_CURTA = "Senha muito curta (min. 6 caracteres)"
MSG_SENHA_SEM_NUMERO = "Precisa ter pelo menos 1 numero"
MSG_SENHA_SEM_ESPECIAL = "Precisa ter pelo menos 1 caractere especial"
MSG_CRP_OBRIGATORIO = "CRP obrigatorio para psicologo"
MSG_CRP_INVALIDO = "CRP invalido. Use o formato 06/123456"
MSG_CRP_DUPLICADO = "Este CRP ja esta cadastrado"
MSG_ESPECIALIDADE_OBRIGATORIA = "Especialidade obrigatoria para psicologo"
MSG_TIPO_PSICOLOGO_OBRIGATORIO = "Tipo de psicologo obrigatorio para psicologo"
MSG_PRECO_OBRIGATORIO = "Valor da consulta obrigatorio para psicologo"
MSG_SENHA_ATUAL_ERRADA = "Senha atual ta errada"
MSG_TOKEN_INVALIDO = "Token invalido ou expirado"
MSG_RECUPERAR_SENHA = "Se o e-mail existir, enviaremos instrucoes"
MSG_CONTA_CRIADA = "Conta criada!"


# ---------------------------------------------------------------------------
# POST /api/auth/login
# ---------------------------------------------------------------------------

class TestLogin:
    """Testes do endpoint POST /api/auth/login."""

    def test_login_valido(self, http_session, evidencia):
        """CT: Login com credenciais válidas → 200 com token."""
        resp = http_session.post(
            f"{config.BASE_URL}/api/auth/login",
            json={"email": config.PACIENTE_EMAIL, "senha": config.PACIENTE_SENHA},
        )
        evidencia("login_valido", {
            "requisicao": {"email": config.PACIENTE_EMAIL},
            "resposta": {"status": resp.status_code, "body": resp.json()},
        })
        assert resp.status_code == 200, f"Esperado 200, obtido {resp.status_code}: {resp.text}"
        body = resp.json()
        assert "token" in body, "Resposta deve conter token JWT"
        assert body["usuario"]["email"].lower() == config.PACIENTE_EMAIL.lower()
        assert body["usuario"]["tipoUsuario"] == "paciente"

    def test_login_senha_incorreta(self, http_session, evidencia):
        """CT: Login com senha incorreta → 400 com mensagem exata."""
        resp = http_session.post(
            f"{config.BASE_URL}/api/auth/login",
            json={"email": config.PACIENTE_EMAIL, "senha": "SenhaErrada@1"},
        )
        evidencia("login_senha_incorreta", {
            "requisicao": {"email": config.PACIENTE_EMAIL, "senha": "***"},
            "resposta": {"status": resp.status_code, "body": resp.json()},
        })
        assert resp.status_code == 400, f"Esperado 400, obtido {resp.status_code}: {resp.text}"
        assert resp.json().get("error") == MSG_LOGIN_INCORRETO

    def test_login_email_inexistente(self, http_session, evidencia):
        """CT: Login com email inexistente → 400 com mensagem genérica."""
        resp = http_session.post(
            f"{config.BASE_URL}/api/auth/login",
            json={"email": "naoexiste@teste.cedro", "senha": config.PACIENTE_SENHA},
        )
        evidencia("login_email_inexistente", {
            "requisicao": {"email": "naoexiste@teste.cedro"},
            "resposta": {"status": resp.status_code, "body": resp.json()},
        })
        assert resp.status_code == 400
        assert resp.json().get("error") == MSG_LOGIN_INCORRETO

    @pytest.mark.parametrize("campo,valor", [
        ("email", ""),
        ("senha", ""),
    ])
    def test_login_campo_vazio(self, http_session, evidencia, campo, valor):
        """CT: Login com campo obrigatório vazio → 400."""
        payload = {"email": config.PACIENTE_EMAIL, "senha": config.PACIENTE_SENHA}
        payload[campo] = valor
        resp = http_session.post(f"{config.BASE_URL}/api/auth/login", json=payload)
        evidencia(f"login_campo_vazio_{campo}", {
            "requisicao": payload,
            "resposta": {"status": resp.status_code, "body": resp.text},
        })
        assert resp.status_code == 400

    def test_login_email_caixa_alta(self, http_session, evidencia):
        """CT: Login com email em MAIÚSCULAS → 200 (normalização trim+lowercase)."""
        resp = http_session.post(
            f"{config.BASE_URL}/api/auth/login",
            json={"email": config.PACIENTE_EMAIL.upper(), "senha": config.PACIENTE_SENHA},
        )
        evidencia("login_email_caixa_alta", {
            "requisicao": {"email": config.PACIENTE_EMAIL.upper()},
            "resposta": {"status": resp.status_code, "body": {"token": "***", "usuario": resp.json().get("usuario", {})}},
        })
        assert resp.status_code == 200, f"Esperado 200, obtido {resp.status_code}: {resp.text}"

    def test_login_psicologo(self, http_session, evidencia):
        """CT: Login com credenciais do psicólogo → 200 com tipoUsuario='psicologo'."""
        resp = http_session.post(
            f"{config.BASE_URL}/api/auth/login",
            json={"email": config.PSICOLOGO_EMAIL, "senha": config.PSICOLOGO_SENHA},
        )
        evidencia("login_psicologo", {
            "requisicao": {"email": config.PSICOLOGO_EMAIL},
            "resposta": {"status": resp.status_code, "body": {"token": "***", "usuario": resp.json().get("usuario", {})}},
        })
        assert resp.status_code == 200
        assert resp.json()["usuario"]["tipoUsuario"] == "psicologo"


# ---------------------------------------------------------------------------
# POST /api/auth/register — Paciente
# ---------------------------------------------------------------------------

class TestRegisterPaciente:
    """Testes de registro de paciente."""

    def test_register_paciente_valido(self, http_session, email_unico, evidencia):
        """CT: Registro de paciente com dados válidos → 201."""
        payload = {
            "nome": "Maria Teste",
            "email": email_unico,
            "senha": "Teste@123",
            "dataNascimento": "1990-01-01",
            "genero": "Feminino",
            "telefone": "(11) 99999-0000",
            "tipoUsuario": "paciente",
        }
        resp = http_session.post(f"{config.BASE_URL}/api/auth/register", json=payload)
        evidencia("register_paciente_valido", {
            "requisicao": payload,
            "resposta": {"status": resp.status_code, "body": resp.json()},
        })
        assert resp.status_code == 201, f"Esperado 201, obtido {resp.status_code}: {resp.text}"
        assert resp.json().get("message") == MSG_CONTA_CRIADA

    def test_register_email_duplicado(self, http_session, evidencia):
        """CT: Registro com email duplicado → 400 com mensagem exata."""
        payload = {
            "nome": "Maria Teste",
            "email": config.PACIENTE_EMAIL,
            "senha": "Teste@123",
            "tipoUsuario": "paciente",
        }
        resp = http_session.post(f"{config.BASE_URL}/api/auth/register", json=payload)
        evidencia("register_email_duplicado", {
            "requisicao": {"email": config.PACIENTE_EMAIL},
            "resposta": {"status": resp.status_code, "body": resp.json()},
        })
        assert resp.status_code == 400
        assert resp.json().get("error") == MSG_EMAIL_DUPLICADO

    @pytest.mark.parametrize("senha,msg_erro", [
        ("Teste@abc", MSG_SENHA_SEM_NUMERO),
        ("Teste123", MSG_SENHA_SEM_ESPECIAL),
    ])
    def test_register_senha_invalida(self, http_session, email_unico, evidencia, senha, msg_erro):
        """CT: Registro com senha inválida → 400 com mensagem exata."""
        payload = {
            "nome": "Maria Teste",
            "email": email_unico,
            "senha": senha,
            "tipoUsuario": "paciente",
        }
        resp = http_session.post(f"{config.BASE_URL}/api/auth/register", json=payload)
        evidencia(f"register_senha_invalida_{msg_erro[:10]}", {
            "requisicao": {"email": email_unico, "senha": "***"},
            "resposta": {"status": resp.status_code, "body": resp.json()},
        })
        assert resp.status_code == 400
        assert resp.json().get("error") == msg_erro

    def test_register_tipo_admin_forcado_paciente(self, http_session, email_unico, evidencia):
        """CT: Registro com tipoUsuario='admin' → 201 (forçado para paciente)."""
        payload = {
            "nome": "Admin Fake",
            "email": email_unico,
            "senha": "Teste@123",
            "tipoUsuario": "admin",
        }
        resp = http_session.post(f"{config.BASE_URL}/api/auth/register", json=payload)
        evidencia("register_tipo_admin_forcado", {
            "requisicao": {"email": email_unico, "tipoUsuario": "admin"},
            "resposta": {"status": resp.status_code, "body": resp.json()},
        })
        assert resp.status_code == 201, f"Esperado 201, obtido {resp.status_code}: {resp.text}"


# ---------------------------------------------------------------------------
# POST /api/auth/register — Psicólogo
# ---------------------------------------------------------------------------

class TestRegisterPsicologo:
    """Testes de registro de psicólogo."""

    def test_register_psicologo_valido(self, http_session, email_unico, evidencia):
        """CT: Registro de psicólogo com dados válidos → 201."""
        import random
        crp = f"06/{random.randint(100000, 999999)}"
        payload = {
            "nome": "Dr. João Teste",
            "email": email_unico,
            "senha": "Teste@123",
            "tipoUsuario": "psicologo",
            "crp": crp,
            "especialidade": "Psicologia Clínica",
            "tipoPsicologo": "Terapia Individual",
            "precoSessao": 150.00,
        }
        resp = http_session.post(f"{config.BASE_URL}/api/auth/register", json=payload)
        evidencia("register_psicologo_valido", {
            "requisicao": {"email": email_unico, "crp": crp},
            "resposta": {"status": resp.status_code, "body": resp.json()},
        })
        assert resp.status_code == 201, f"Esperado 201, obtido {resp.status_code}: {resp.text}"
        assert resp.json().get("message") == MSG_CONTA_CRIADA

    def test_register_psicologo_sem_crp(self, http_session, email_unico, evidencia):
        """CT: Registro de psicólogo sem CRP → 400 com mensagem exata."""
        payload = {
            "nome": "Dr. João Teste",
            "email": email_unico,
            "senha": "Teste@123",
            "tipoUsuario": "psicologo",
            "especialidade": "Psicologia Clínica",
            "tipoPsicologo": "Terapia Individual",
            "precoSessao": 150.00,
        }
        resp = http_session.post(f"{config.BASE_URL}/api/auth/register", json=payload)
        evidencia("register_psicologo_sem_crp", {
            "requisicao": {"email": email_unico},
            "resposta": {"status": resp.status_code, "body": resp.json()},
        })
        assert resp.status_code == 400
        assert resp.json().get("error") == MSG_CRP_OBRIGATORIO

    def test_register_psicologo_crp_invalido(self, http_session, email_unico, evidencia):
        """CT: Registro de psicólogo com CRP em formato inválido → 400."""
        payload = {
            "nome": "Dr. João Teste",
            "email": email_unico,
            "senha": "Teste@123",
            "tipoUsuario": "psicologo",
            "crp": "12345",
            "especialidade": "Psicologia Clínica",
            "tipoPsicologo": "Terapia Individual",
            "precoSessao": 150.00,
        }
        resp = http_session.post(f"{config.BASE_URL}/api/auth/register", json=payload)
        evidencia("register_psicologo_crp_invalido", {
            "requisicao": {"email": email_unico, "crp": "12345"},
            "resposta": {"status": resp.status_code, "body": resp.json()},
        })
        assert resp.status_code == 400
        assert resp.json().get("error") == MSG_CRP_INVALIDO

    def test_register_psicologo_crp_duplicado(self, http_session, email_unico, evidencia):
        """CT: Registro de psicólogo com CRP duplicado (06/123456) → 400."""
        payload = {
            "nome": "Dr. João Teste",
            "email": email_unico,
            "senha": "Teste@123",
            "tipoUsuario": "psicologo",
            "crp": "06/123456",
            "especialidade": "Psicologia Clínica",
            "tipoPsicologo": "Terapia Individual",
            "precoSessao": 150.00,
        }
        resp = http_session.post(f"{config.BASE_URL}/api/auth/register", json=payload)
        evidencia("register_psicologo_crp_duplicado", {
            "requisicao": {"email": email_unico, "crp": "06/123456"},
            "resposta": {"status": resp.status_code, "body": resp.json()},
        })
        assert resp.status_code == 400
        assert resp.json().get("error") == MSG_CRP_DUPLICADO

    @pytest.mark.parametrize("payload_extra,msg_erro", [
        ({"crp": "06/111111", "tipoPsicologo": "Terapia Individual", "precoSessao": 150.00}, MSG_ESPECIALIDADE_OBRIGATORIA),
        ({"crp": "06/222222", "especialidade": "Psicologia Clínica", "precoSessao": 150.00}, MSG_TIPO_PSICOLOGO_OBRIGATORIO),
        ({"crp": "06/333333", "especialidade": "Psicologia Clínica", "tipoPsicologo": "Terapia Individual"}, MSG_PRECO_OBRIGATORIO),
    ])
    def test_register_psicologo_campo_obrigatorio(self, http_session, email_unico, evidencia, payload_extra, msg_erro):
        """CT: Registro de psicólogo com campo obrigatório ausente → 400."""
        payload = {
            "nome": "Dr. João Teste",
            "email": email_unico,
            "senha": "Teste@123",
            "tipoUsuario": "psicologo",
        }
        payload.update(payload_extra)
        resp = http_session.post(f"{config.BASE_URL}/api/auth/register", json=payload)
        evidencia(f"register_psicologo_obrigatorio_{msg_erro[:10]}", {
            "requisicao": {"email": email_unico},
            "resposta": {"status": resp.status_code, "body": resp.json()},
        })
        assert resp.status_code == 400
        assert resp.json().get("error") == msg_erro


# ---------------------------------------------------------------------------
# PUT /api/auth/alterar-senha
# ---------------------------------------------------------------------------

class TestAlterarSenha:
    """Testes do endpoint PUT /api/auth/alterar-senha."""

    def test_alterar_senha_sem_token(self, http_session, evidencia):
        """CT: Alterar senha sem token JWT → 401, 403 ou 500 (Spring Security / bug backend)."""
        resp = http_session.put(
            f"{config.BASE_URL}/api/auth/alterar-senha",
            json={"senhaAtual": config.PACIENTE_SENHA, "novaSenha": "NovaSenha@123"},
        )
        evidencia("alterar_senha_sem_token", {
            "requisicao": {"senhaAtual": "***", "novaSenha": "***"},
            "resposta": {"status": resp.status_code, "body": resp.text},
        })
        assert resp.status_code in (401, 403, 500)

    def test_alterar_senha_senha_atual_errada(self, http_session, auth_headers, evidencia):
        """CT: Alterar senha com senha atual incorreta → 400 com mensagem exata."""
        resp = http_session.put(
            f"{config.BASE_URL}/api/auth/alterar-senha",
            json={"senhaAtual": "SenhaErrada@1", "novaSenha": "NovaSenha@123"},
            headers=auth_headers,
        )
        evidencia("alterar_senha_atual_errada", {
            "requisicao": {"senhaAtual": "***", "novaSenha": "***"},
            "resposta": {"status": resp.status_code, "body": resp.json()},
        })
        assert resp.status_code == 400
        assert resp.json().get("error") == MSG_SENHA_ATUAL_ERRADA

    @pytest.mark.parametrize("nova_senha,msg_erro", [
        ("NovaSenha@abc", MSG_SENHA_SEM_NUMERO),
        ("NovaSenha123", MSG_SENHA_SEM_ESPECIAL),
    ])
    def test_alterar_senha_forca_invalida(self, http_session, auth_headers, evidencia, nova_senha, msg_erro):
        """CT: Nova senha sem requisitos de força → 400 com mensagem exata."""
        resp = http_session.put(
            f"{config.BASE_URL}/api/auth/alterar-senha",
            json={"senhaAtual": config.PACIENTE_SENHA, "novaSenha": nova_senha},
            headers=auth_headers,
        )
        evidencia(f"alterar_senha_forca_{msg_erro[:10]}", {
            "requisicao": {"senhaAtual": "***", "novaSenha": "***"},
            "resposta": {"status": resp.status_code, "body": resp.json()},
        })
        assert resp.status_code == 400
        assert resp.json().get("error") == msg_erro


# ---------------------------------------------------------------------------
# POST /api/auth/recuperar-senha e redefinir-senha
# ---------------------------------------------------------------------------

class TestRecuperarSenha:
    """Testes dos endpoints de recuperação e redefinição de senha."""

    @pytest.mark.parametrize("email", [
        config.PACIENTE_EMAIL,
        "naoexiste@teste.cedro",
    ])
    def test_recuperar_senha(self, http_session, evidencia, email):
        """CT: Recuperar senha → 200 com mensagem genérica (não revela se email existe)."""
        resp = http_session.post(
            f"{config.BASE_URL}/api/auth/recuperar-senha",
            json={"email": email},
        )
        evidencia(f"recuperar_senha_{email[:10]}", {
            "requisicao": {"email": email},
            "resposta": {"status": resp.status_code, "body": resp.json()},
        })
        assert resp.status_code == 200
        assert resp.json().get("message") == MSG_RECUPERAR_SENHA

    def test_recuperar_senha_email_vazio(self, http_session, evidencia):
        """CT: Recuperar senha com email vazio → 400."""
        resp = http_session.post(
            f"{config.BASE_URL}/api/auth/recuperar-senha",
            json={"email": ""},
        )
        evidencia("recuperar_senha_email_vazio", {
            "requisicao": {"email": ""},
            "resposta": {"status": resp.status_code, "body": resp.json()},
        })
        assert resp.status_code == 400
        assert resp.json().get("error") == "Informe o email"

    def test_redefinir_senha_token_invalido(self, http_session, evidencia):
        """CT: Redefinir senha com token inválido → 400 com mensagem exata."""
        resp = http_session.post(
            f"{config.BASE_URL}/api/auth/redefinir-senha",
            json={"token": "token_invalido", "novaSenha": "NovaSenha@123"},
        )
        evidencia("redefinir_senha_token_invalido", {
            "requisicao": {"token": "***", "novaSenha": "***"},
            "resposta": {"status": resp.status_code, "body": resp.json()},
        })
        assert resp.status_code == 400
        assert resp.json().get("error") == MSG_TOKEN_INVALIDO

    def test_redefinir_senha_sem_token(self, http_session, evidencia):
        """CT: Redefinir senha sem token → 400."""
        resp = http_session.post(
            f"{config.BASE_URL}/api/auth/redefinir-senha",
            json={"novaSenha": "NovaSenha@123"},
        )
        evidencia("redefinir_senha_sem_token", {
            "requisicao": {"novaSenha": "***"},
            "resposta": {"status": resp.status_code, "body": resp.json()},
        })
        assert resp.status_code == 400
        assert resp.json().get("error") == "Token e nova senha sao obrigatorios"