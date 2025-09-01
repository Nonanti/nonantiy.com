// Fallback data for local development
const fallbackData = {
    user: {
        login: 'Nonanti',
        name: 'Berkant Nonanti',
        avatar_url: 'https://avatars.githubusercontent.com/u/45326482?v=4',
        bio: 'dotnet developer, trying to learn Rust. Hope to be a good backend developer in the future.',
        public_repos: 25,
        followers: 17,
        following: 19,
        location: 'Kayseri, Turkey',
        blog: '',
        twitter_username: 'nonantiy',
        company: null,
        html_url: 'https://github.com/Nonanti'
    },
    repos: [
        {
            name: 'DataFlow',
            description: 'High-performance ETL pipeline library for .NET',
            html_url: 'https://github.com/Nonanti/DataFlow',
            language: 'C#',
            stargazers_count: 103,
            forks_count: 6,
            size: 2048,
            pinned: true
        },
        {
            name: 'mathcore',
            description: 'Symbolic math library and computer algebra system for Rust',
            html_url: 'https://github.com/Nonanti/mathcore',
            language: 'Rust',
            stargazers_count: 30,
            forks_count: 1,
            size: 1536,
            pinned: true
        },
        {
            name: 'gwf-cli',
            description: 'Git Workflow Automator - Streamline your Git workflows with ease',
            html_url: 'https://github.com/Nonanti/gwf-cli',
            language: 'Rust',
            stargazers_count: 3,
            forks_count: 0,
            size: 512,
            pinned: true
        },
        {
            name: 'MathFlow',
            description: 'C# math expression library with symbolic computation support',
            html_url: 'https://github.com/Nonanti/MathFlow',
            language: 'C#',
            stargazers_count: 41,
            forks_count: 2,
            size: 1024,
            pinned: true
        }
    ],
    pinnedRepos: ['DataFlow', 'mathcore', 'gwf-cli', 'MathFlow'],
    events: [
        {
            type: 'PushEvent',
            created_at: new Date().toISOString(),
            repo: { name: 'Nonanti/DataFlow' },
            payload: { commits: [{}, {}] }
        },
        {
            type: 'CreateEvent',
            created_at: new Date(Date.now() - 86400000).toISOString(),
            repo: { name: 'Nonanti/mathcore' },
            payload: { ref_type: 'branch', ref: 'feature/symbolic-computation' }
        },
        {
            type: 'PushEvent',
            created_at: new Date(Date.now() - 172800000).toISOString(),
            repo: { name: 'Nonanti/gwf-cli' },
            payload: { commits: [{}] }
        },
        {
            type: 'WatchEvent',
            created_at: new Date(Date.now() - 259200000).toISOString(),
            repo: { name: 'rust-lang/rust' },
            payload: {}
        },
        {
            type: 'PushEvent',
            created_at: new Date(Date.now() - 345600000).toISOString(),
            repo: { name: 'Nonanti/MathFlow' },
            payload: { commits: [{}, {}, {}] }
        }
    ]
};
