// DOM Elements
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const profileContainer = document.getElementById("profile-container");
const reposContainer = document.getElementById("repos-container");
const errorContainer = document.getElementById("error-container");

// Constants
const GITHUB_API_BASE = "https://api.github.com/users";
const REPOS_LIMIT = 30;
let currentRepos = [];
let currentSortOption = "updated";

// Utility Functions
function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
}

function clearContainers() {
  profileContainer.innerHTML = "";
  reposContainer.innerHTML = "";
  errorContainer.innerHTML = "";
}

function showError(message) {
  errorContainer.innerHTML = `<p style="color: red; text-align: center;"><strong>⚠️ Erro:</strong> ${message}</p>`;
}

// Sorting Functions
function sortReposByStars(repos) {
  return [...repos].sort((a, b) => b.stargazers_count - a.stargazers_count);
}

function sortReposByForks(repos) {
  return [...repos].sort((a, b) => b.forks_count - a.forks_count);
}

function sortReposByUpdated(repos) {
  return [...repos].sort(
    (a, b) => new Date(b.updated_at) - new Date(a.updated_at),
  );
}

function sortReposByName(repos) {
  return [...repos].sort((a, b) => a.name.localeCompare(b.name));
}

function getUniqueLanguages(repos) {
  const languages = repos
    .map((repo) => repo.language)
    .filter((lang) => lang !== null);
  return [...new Set(languages)].sort();
}

// API Functions
async function fetchUserData(username) {
  const response = await fetch(`${GITHUB_API_BASE}/${username}`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Usuário não encontrado. Tente outro nome.");
    }
    throw new Error("Erro ao buscar dados na API GitHub.");
  }

  return response.json();
}

async function fetchUserRepos(username, sort = "updated") {
  const validSorts = ["updated", "stars", "forks", "name"];
  const sortParam = validSorts.includes(sort) ? sort : "updated";

  const response = await fetch(
    `${GITHUB_API_BASE}/${username}/repos?sort=${sortParam}&per_page=${REPOS_LIMIT}&type=owner`,
  );

  if (!response.ok) {
    throw new Error("Erro ao buscar repositórios.");
  }

  return response.json();
}

// Render Functions
function renderUser(user) {
  const {
    avatar_url,
    login,
    name,
    bio,
    followers,
    following,
    public_repos,
    location,
    company,
    blog,
    created_at,
  } = user;

  const joinDate = new Date(created_at).toLocaleDateString("pt-BR");

  profileContainer.innerHTML = `
    <div class="user-card">
      <img src="${avatar_url}" alt="Avatar de ${login}" width="150">
      <h2>${name || login}</h2>
      <p class="username">@${login}</p>
      <p class="bio">${bio || "Sem biografia."}</p>
      
      <div class="stats-container">
        <div class="stat">
          <strong class="stat-value">${formatNumber(followers)}</strong>
          <span class="stat-label">👥 Seguidores</span>
        </div>
        <div class="stat">
          <strong class="stat-value">${formatNumber(following)}</strong>
          <span class="stat-label">👤 Seguindo</span>
        </div>
        <div class="stat">
          <strong class="stat-value">${public_repos}</strong>
          <span class="stat-label">📦 Repositórios</span>
        </div>
      </div>

      <div class="user-info">
        ${location ? `<p>📍 ${location}</p>` : ""}
        ${company ? `<p>🏢 ${company}</p>` : ""}
        ${blog ? `<p>🔗 <a href="${blog}" target="_blank">${blog}</a></p>` : ""}
        <p>📅 Membro desde ${joinDate}</p>
      </div>
    </div>
  `;
}

function renderRepos(repos) {
  if (repos.length === 0) {
    reposContainer.innerHTML =
      "<p style='text-align: center; color: #666;'>Este usuário não possui repositórios públicos.</p>";
    return;
  }

  currentRepos = repos;
  const languages = getUniqueLanguages(repos);

  const filterHTML = `
    <div class="repos-filters">
      <div class="filter-group">
        <label for="sort-select">Ordenar por:</label>
        <select id="sort-select">
          <option value="updated">📅 Atualizados Recentemente</option>
          <option value="stars">⭐ Mais Estrelas</option>
          <option value="forks">🍴 Mais Forks</option>
          <option value="name">📝 Nome (A-Z)</option>
        </select>
      </div>
      ${
        languages.length > 0
          ? `
        <div class="filter-group">
          <label for="language-filter">Filtrar por linguagem:</label>
          <select id="language-filter">
            <option value="">Todas as linguagens</option>
            ${languages.map((lang) => `<option value="${lang}">${lang}</option>`).join("")}
          </select>
        </div>
      `
          : ""
      }
    </div>
  `;

  let displayRepos = repos;
  const sortedRepos = repos.map((repo) => repo);
  const reposHTML = sortedRepos
    .map(
      (repo) => `
      <div class="repo-card">
        <div class="repo-header">
          <h3>
            <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">
              ${repo.name}
            </a>
          </h3>
          ${repo.fork ? '<span class="fork-badge">🔀 Fork</span>' : ""}
        </div>
        ${repo.description ? `<p class="repo-description">${repo.description}</p>` : ""}
        <div class="repo-info">
          ${repo.language ? `<span class="language">💻 ${repo.language}</span>` : ""}
          <span class="stars">⭐ ${formatNumber(repo.stargazers_count)}</span>
          <span class="forks">🍴 ${formatNumber(repo.forks_count)}</span>
          ${repo.open_issues_count > 0 ? `<span class="issues">📋 ${repo.open_issues_count}</span>` : ""}
        </div>
        ${repo.topics && repo.topics.length > 0 ? `<div class="topics">${repo.topics.map((t) => `<span class="topic">${t}</span>`).join("")}</div>` : ""}
      </div>
    `,
    )
    .join("");

  reposContainer.innerHTML = `
    <div class="repos-section">
      <h3>Repositórios (${repos.length} encontrados)</h3>
      ${filterHTML}
      <div class="repos-list">${reposHTML}</div>
    </div>
  `;

  // Add event listeners for filters
  const sortSelect = document.getElementById("sort-select");
  const languageFilter = document.getElementById("language-filter");

  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      const sortBy = e.target.value;
      let sorted = [...currentRepos];

      switch (sortBy) {
        case "stars":
          sorted = sortReposByStars(sorted);
          break;
        case "forks":
          sorted = sortReposByForks(sorted);
          break;
        case "name":
          sorted = sortReposByName(sorted);
          break;
        default:
          sorted = sortReposByUpdated(sorted);
      }

      if (languageFilter && languageFilter.value) {
        sorted = sorted.filter((r) => r.language === languageFilter.value);
      }

      renderReposOnly(sorted);
    });
  }

  if (languageFilter) {
    languageFilter.addEventListener("change", (e) => {
      const language = e.target.value;
      let filtered = [...currentRepos];

      if (language) {
        filtered = filtered.filter((r) => r.language === language);
      }

      const sortBy = sortSelect ? sortSelect.value : "updated";
      switch (sortBy) {
        case "stars":
          filtered = sortReposByStars(filtered);
          break;
        case "forks":
          filtered = sortReposByForks(filtered);
          break;
        case "name":
          filtered = sortReposByName(filtered);
          break;
        default:
          filtered = sortReposByUpdated(filtered);
      }

      renderReposOnly(filtered);
    });
  }
}

function renderReposOnly(repos) {
  const reposHTML = repos
    .map(
      (repo) => `
      <div class="repo-card">
        <div class="repo-header">
          <h3>
            <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">
              ${repo.name}
            </a>
          </h3>
          ${repo.fork ? '<span class="fork-badge">🔀 Fork</span>' : ""}
        </div>
        ${repo.description ? `<p class="repo-description">${repo.description}</p>` : ""}
        <div class="repo-info">
          ${repo.language ? `<span class="language">💻 ${repo.language}</span>` : ""}
          <span class="stars">⭐ ${formatNumber(repo.stargazers_count)}</span>
          <span class="forks">🍴 ${formatNumber(repo.forks_count)}</span>
          ${repo.open_issues_count > 0 ? `<span class="issues">📋 ${repo.open_issues_count}</span>` : ""}
        </div>
        ${repo.topics && repo.topics.length > 0 ? `<div class="topics">${repo.topics.map((t) => `<span class="topic">${t}</span>`).join("")}</div>` : ""}
      </div>
    `,
    )
    .join("");

  const reposList = document.querySelector(".repos-list");
  if (reposList) {
    reposList.innerHTML =
      reposHTML ||
      "<p>Nenhum repositório encontrado com os filtros selecionados.</p>";
  }
}

// Event Listeners
searchBtn.addEventListener("click", handleSearch);
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") handleSearch();
});

// Main Search Handler
async function handleSearch() {
  const username = searchInput.value.trim();

  if (!username) {
    showError("Por favor, digite um nome de usuário.");
    return;
  }

  clearContainers();

  try {
    const userData = await fetchUserData(username);
    renderUser(userData);

    const reposData = await fetchUserRepos(username, "updated");
    renderRepos(reposData);
  } catch (error) {
    showError(error.message);
  }
}
