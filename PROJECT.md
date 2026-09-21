# Casamento Comunitário

Aplicação de inscrição e triagem para o casamento comunitário da Carvalhos de Justiça.

## Rotas

- `/` — formulário público de inscrição do casal
- `/login` — acesso administrativo
- `/admin` — painel de triagem protegido por login

## Funcionalidades

- Validação de nome completo para os dois integrantes do casal
- Máscaras para telefone e valores em reais
- Formulário responsivo para celular
- Painel administrativo com edição, aprovação e reprovação
- Atalhos de WhatsApp para os telefones cadastrados

## Variáveis de ambiente

Configure fora do repositório:

```text
ADMIN_LOGIN=
ADMIN_PASSWORD=
ADMIN_SESSION_SECRET=
TURSO_DATABASE_URL=
TURSO_AUTH_TOKEN=
```
