const GITHUB_USERNAME = 'Nonanti';
const API_BASE = 'https://api.github.com';
const CORS_PROXY = '';

let allRepos = [];
let languageStats = {};

async function fetchGitHubData() {
    try {
        console.log('Fetching GitHub data for:', GITHUB_USERNAME);
        
        // Check if we're running locally (file:// protocol)
        const isLocal = window.location.protocol === 'file:';
        
        if (isLocal && typeof fallbackData !== 'undefined') {
            console.log('Using local fallback data');
            updateProfile(fallbackData.user);
            allRepos = fallbackData.repos;
            const pinnedRepos = allRepos.filter(repo => repo.pinned);
        displayRepositories(pinnedRepos.length > 0 ? pinnedRepos : allRepos.slice(0, 4));
            calculateLanguageStats();
            // Activity section removed
            return;
        }
        
        const userResponse = await fetch(`${CORS_PROXY}${API_BASE}/users/${GITHUB_USERNAME}`);
        
        if (!userResponse.ok) {
            throw new Error(`HTTP error! status: ${userResponse.status}`);
        }
        
        const userData = await userResponse.json();
        
        updateProfile(userData);
        
        const reposResponse = await fetch(`${CORS_PROXY}${API_BASE}/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`);
        allRepos = await reposResponse.json();
        
        const pinnedRepos = allRepos.filter(repo => repo.pinned);
        displayRepositories(pinnedRepos.length > 0 ? pinnedRepos : allRepos.slice(0, 4));
        calculateLanguageStats();
        
        const eventsResponse = await fetch(`${CORS_PROXY}${API_BASE}/users/${GITHUB_USERNAME}/events/public?per_page=10`);
        const events = await eventsResponse.json();
        // Activity section removed
        
    } catch (error) {
        console.error('Error fetching GitHub data:', error);
        console.error('Error details:', error.message);
        
        // Try to use fallback data if available
        if (typeof fallbackData !== 'undefined') {
            console.log('Using fallback data due to API error');
            updateProfile(fallbackData.user);
            allRepos = fallbackData.repos;
            const pinnedRepos = allRepos.filter(repo => repo.pinned);
        displayRepositories(pinnedRepos.length > 0 ? pinnedRepos : allRepos.slice(0, 4));
            calculateLanguageStats();
            // Activity section removed
        } else {
            showError();
        }
    }
}

function updateProfile(user) {
    document.getElementById('avatar').src = user.avatar_url;
    document.getElementById('name').textContent = user.name || user.login;
    document.getElementById('username').textContent = `@${user.login}`;
    document.getElementById('bio').textContent = user.bio || 'Building amazing things with code';
    document.getElementById('repos').textContent = user.public_repos;
    document.getElementById('followers').textContent = user.followers;
    document.getElementById('following').textContent = user.following;
    
    if (user.location) {
        document.getElementById('location').textContent = user.location;
        document.getElementById('location-item').style.display = 'flex';
    } else {
        document.getElementById('location-item').style.display = 'none';
    }
    
    if (user.company) {
        document.getElementById('company').textContent = user.company;
        document.getElementById('company-item').style.display = 'flex';
    } else {
        document.getElementById('company-item').style.display = 'none';
    }
    
    if (user.blog) {
        const blogUrl = user.blog.startsWith('http') ? user.blog : `https://${user.blog}`;
        document.getElementById('blog').href = blogUrl;
        document.getElementById('blog').textContent = user.blog.replace(/^https?:\/\//, '');
        document.getElementById('blog-item').style.display = 'flex';
    } else {
        document.getElementById('blog-item').style.display = 'none';
    }
    
    if (user.twitter_username) {
        document.getElementById('twitter').href = `https://twitter.com/${user.twitter_username}`;
        document.getElementById('twitter').textContent = `@${user.twitter_username}`;
        document.getElementById('twitter-item').style.display = 'flex';
    } else {
        document.getElementById('twitter-item').style.display = 'none';
    }
}

function displayRepositories(repos) {
    const reposGrid = document.getElementById('repos-grid');
    reposGrid.innerHTML = '';
    
    repos.forEach(repo => {
        const repoCard = document.createElement('a');
        repoCard.href = repo.html_url;
        repoCard.target = '_blank';
        repoCard.className = 'repo-card';
        
        const languageColor = getLanguageColor(repo.language);
        
        repoCard.innerHTML = `
            <div class="repo-name">${repo.name}</div>
            <p class="repo-description">${repo.description || 'No description provided'}</p>
            <div class="repo-stats">
                ${repo.language ? `
                    <span class="repo-stat">
                        <span class="language-dot" style="background-color: ${languageColor}"></span>
                        ${repo.language}
                    </span>
                ` : ''}
                <span class="repo-stat">
                    ${repo.stargazers_count} stars
                </span>
                <span class="repo-stat">
                    ${repo.forks_count} forks
                </span>
            </div>
        `;
        
        reposGrid.appendChild(repoCard);
    });
}

function calculateLanguageStats() {
    languageStats = {};
    let totalSize = 0;
    
    allRepos.forEach(repo => {
        if (repo.language) {
            languageStats[repo.language] = (languageStats[repo.language] || 0) + (repo.size || 1);
            totalSize += (repo.size || 1);
        }
    });
    
    const sortedLanguages = Object.entries(languageStats)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8);
    
    displayLanguageChart(sortedLanguages, totalSize);
}

function displayLanguageChart(languages, total) {
    const chartContainer = document.getElementById('languages-chart');
    
    const languageBar = document.createElement('div');
    languageBar.className = 'language-bar';
    
    languages.forEach(([lang, size]) => {
        const percentage = (size / total) * 100;
        const segment = document.createElement('div');
        segment.className = 'language-segment';
        segment.style.width = `${percentage}%`;
        segment.style.backgroundColor = getLanguageColor(lang);
        segment.title = `${lang}: ${percentage.toFixed(1)}%`;
        languageBar.appendChild(segment);
    });
    
    const languageList = document.createElement('div');
    languageList.className = 'language-list';
    
    languages.forEach(([lang, size]) => {
        const percentage = (size / total) * 100;
        const item = document.createElement('div');
        item.className = 'language-item';
        item.innerHTML = `
            <span class="language-dot" style="background-color: ${getLanguageColor(lang)}"></span>
            <span>${lang}</span>
            <span style="color: var(--text-secondary)">${percentage.toFixed(1)}%</span>
        `;
        languageList.appendChild(item);
    });
    
    chartContainer.innerHTML = '';
    chartContainer.appendChild(languageBar);
    chartContainer.appendChild(languageList);
}

// Activity display function removed

function getLanguageColor(language) {
    const colors = {
        'JavaScript': '#f1e05a',
        'TypeScript': '#3178c6',
        'Python': '#3572A5',
        'Java': '#b07219',
        'C++': '#f34b7d',
        'C': '#555555',
        'C#': '#178600',
        'PHP': '#4F5D95',
        'Ruby': '#701516',
        'Go': '#00ADD8',
        'Swift': '#FA7343',
        'Kotlin': '#A97BFF',
        'Rust': '#dea584',
        'HTML': '#e34c26',
        'CSS': '#563d7c',
        'Shell': '#89e051',
        'Vue': '#41b883',
        'React': '#61dafb',
        'Dart': '#00B4AB',
        'Objective-C': '#438eff',
        'Scala': '#c22d40',
        'R': '#198CE7',
        'Perl': '#0298c3',
        'Lua': '#000080',
        'Vim script': '#199f4b',
        'Haskell': '#5e5086',
        'CoffeeScript': '#244776',
        'PowerShell': '#012456',
        'Elixir': '#6e4a7e',
        'Clojure': '#db5855',
        'Jupyter Notebook': '#DA5B0B'
    };
    
    return colors[language] || '#8b949e';
}

function showError() {
    const container = document.querySelector('.container');
    container.innerHTML = `
        <div style="text-align: center; padding: 4rem 2rem;">
            <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: var(--error); margin-bottom: 1rem;"></i>
            <h2 style="margin-bottom: 1rem;">Unable to Load GitHub Data</h2>
            <p style="color: var(--text-secondary);">Please check your internet connection and try again.</p>
            <button class="btn btn-primary" onclick="location.reload()" style="margin-top: 2rem;">
                <i class="fas fa-redo"></i> Retry
            </button>
        </div>
    `;
}

document.getElementById('repos-btn').addEventListener('click', () => {
    const reposSection = document.getElementById('repos-section');
    const reposGrid = document.getElementById('repos-grid');
    const pinnedRepos = allRepos.filter(repo => repo.pinned);
    const displayRepos = pinnedRepos.length > 0 ? pinnedRepos : allRepos.slice(0, 4);
    
    if (reposGrid.children.length === displayRepos.length && allRepos.length > displayRepos.length) {
        displayRepositories(allRepos);
        document.getElementById('repos-btn').innerHTML = '<i class="fas fa-compress"></i> show less';
    } else {
        displayRepositories(displayRepos);
        document.getElementById('repos-btn').innerHTML = '<i class="fas fa-folder"></i> all projects';
    }
    
    reposSection.scrollIntoView({ behavior: 'smooth' });
});

const themeBtn = document.getElementById('theme-btn');
const currentTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', currentTheme);
themeBtn.innerHTML = currentTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';

themeBtn.addEventListener('click', () => {
    const theme = document.documentElement.getAttribute('data-theme');
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    themeBtn.innerHTML = newTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
});

fetchGitHubData();

setInterval(fetchGitHubData, 300000);