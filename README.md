# Visualizador de Perfil do GitHub

Um projeto simples para buscar e exibir perfis do GitHub usando a API pública do GitHub.

## Sobre

Este visualizador permite pesquisar um usuário do GitHub pelo nome de usuário e exibir informações do perfil, incluindo avatar, bio, seguidores, seguindo, repositórios e outras informações públicas.

## Recursos

- Busca de usuários do GitHub por nome de usuário
- Exibição de perfil com avatar, nome, login, bio e estatísticas
- Exibição de número de seguidores, seguindo e repositórios públicos
- Listagem dos repositórios do usuário
- Ordenação e filtragem dos repositórios
- Suporte à tecla `Enter` para realizar a busca

## Estrutura do projeto

- `index.html` - página principal e interface do usuário
- `src/css/reset.css` - reset de estilos
- `src/css/styles.css` - estilos principais do projeto
- `src/css/animations.css` - animações e efeitos visuais
- `src/css/responsive.css` - ajustes de responsividade
- `src/css/js/index.js` - lógica JavaScript para buscar e renderizar dados da API do GitHub

## Como usar

1. Abra o arquivo `index.html` em um navegador moderno.
2. Digite o nome de usuário do GitHub no campo de busca.
3. Clique em `Buscar` ou pressione `Enter`.
4. Veja os dados do perfil e a lista de repositórios.

## Observações

- O projeto utiliza a API pública do GitHub, sem necessidade de autenticação para buscas básicas.
- A API pode impor limites de requisição para IPs não autenticados.
- Caso o usuário não seja encontrado, uma mensagem de erro será exibida.

## Publicação no GitHub Pages

Este projeto está preparado para publicação automática via GitHub Pages usando GitHub Actions.

- Um workflow está criado em `.github/workflows/pages.yml`
- Ao enviar mudanças para o branch `main`, o GitHub Pages deverá publicar o site automaticamente
- Caso necessário, ative o GitHub Pages nas configurações do repositório e configure para usar a branch `main`

## Melhorias possíveis

- Adicionar suporte a autenticação com token para aumentar o limite de requisições
- Adicionar paginação para exibir mais repositórios
- Melhorar o design e a responsividade para dispositivos móveis
- Exibir gráficos ou estatísticas adicionais dos repositórios
