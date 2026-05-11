PORT=3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/app
JWT_ACCESS_TOKEN=change-me-access-secret
JWT_REFRESH_SECRET=change-me-refresh-secret

Principais tipos de commit

feat
Nova funcionalidade.
feat(vehicle): cria endpoint de cadastro de veículos

fix
Correção de bug.
fix(upload): corrige erro no upload múltiplo

refactor
Refatoração sem mudar comportamento.
refactor(auth): reorganiza validação de token

style
Mudança visual/formatação.
style(ui): ajusta espaçamento do dashboard

docs
Documentação.
docs(readme): adiciona instruções docker

chore
Manutenção/configuração.
chore(eslint): adiciona regras typescript

test
Testes.
test(vehicle): adiciona testes do service