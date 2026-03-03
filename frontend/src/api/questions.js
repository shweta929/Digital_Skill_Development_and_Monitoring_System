// Simulated API to fetch all 50 questions
export const getQuestions = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const questions = [
        {
          id: 1,
          question: "Which diagram style you like?",
          options: [
            "memory map",
            "architecture blueprint",
            "workflow chart",
            "research graph",
          ],
        },
        {
          id: 2,
          question: "What impresses you more?",
          options: [
            "speed benchmarks",
            "scale reliability",
            "automation coverage",
            "prediction accuracy",
          ],
        },
        {
          id: 3,
          question: "If you had to pick a Friday night passion project:",
          options: [
            "mini OS",
            "microservice app",
            "CI/CD pipeline",
            "stock predictor",
          ],
        },
        {
          id: 4,
          question: "Which scares you more (but also excites)?",
          options: [
            "undefined pointer",
            "distributed data consistency",
            "servers breaking",
            "tuning hyperparameters",
          ],
        },
        {
          id: 5,
          question: "Which talk you’d attend first?",
          options: ["compilers", "Kubernetes", "GitOps", "Transformers (AI)"],
        },
        {
          id: 6,
          question: "Which output feels sexy to you?",
          options: [
            "faster runtime",
            "smooth UI user flow",
            "automated job",
            "prediction chart",
          ],
        },
        {
          id: 7,
          question: "Which field feels 'my tribe'?",
          options: [
            "hardcore engineering",
            "enterprise solution engineering",
            "infrastructure nerds",
            "data wizards",
          ],
        },
        {
          id: 8,
          question: "Which requires your respect?",
          options: [
            "bitwise ops",
            "scalability patterns",
            "automation culture",
            "statistical learning",
          ],
        },
        {
          id: 9,
          question: "What’s your taste in reading?",
          options: [
            "how CPU internals work",
            "system architecture patterns",
            "scripting tricks",
            "research papers",
          ],
        },
        {
          id: 10,
          question: "Which you’d rather hack on?",
          options: [
            "firmware",
            "large backend",
            "pipelines",
            "LLM fine-tuning",
          ],
        },
        {
          id: 11,
          question: "Which is more 'you'?",
          options: [
            "engineering the engine itself",
            "engineering the car",
            "engineering the roads",
            "engineering the maps",
          ],
        },
        {
          id: 12,
          question: "You appreciate tools that:",
          options: [
            "run faster than your brain",
            "scale 100 million users",
            "automate repeat tasks",
            "learn from data",
          ],
        },
        {
          id: 13,
          question: "You prefer problems that are:",
          options: [
            "deterministic",
            "structural",
            "operational",
            "probabilistic",
          ],
        },
        {
          id: 14,
          question: "Which language vibe?",
          options: [
            "closer to machine",
            "enterprise stable",
            "scripting + flexible",
            "math heavy",
          ],
        },
        {
          id: 15,
          question: "When reading code you look first at:",
          options: [
            "pointer logic",
            "API contracts",
            "glue code",
            "vectorization",
          ],
        },
        {
          id: 16,
          question: "Your annual KPI goal:",
          options: [
            "lower latency",
            "improve throughput",
            "remove manual work",
            "smarter predictions",
          ],
        },
        {
          id: 17,
          question: "Job title that sounds fire?",
          options: [
            "systems engineer",
            "cloud solution engineer",
            "automation engineer",
            "applied ML engineer",
          ],
        },
        {
          id: 18,
          question: "You love solving:",
          options: [
            "compilers / internals",
            "distributed systems",
            "pipeline orchestration",
            "model training",
          ],
        },
        {
          id: 19,
          question: "Which stack feels sexy day 1?",
          options: [
            "C / C++",
            "Java + Spring",
            "Python automation",
            "Python ML",
          ],
        },
        {
          id: 20,
          question: "What’s your energy?",
          options: [
            "hardcore logic",
            "enterprise integration",
            "make infra invisible",
            "intelligence at scale",
          ],
        },
        {
          id: 21,
          question: "Choose one meeting:",
          options: [
            "memory allocation strategy",
            "microservice resilience",
            "DevOps roadmap",
            "model alignment",
          ],
        },
        {
          id: 22,
          question: "Your brain defaults to:",
          options: ["bytes", "APIs", "scripts", "probabilities"],
        },
        {
          id: 23,
          question: "Which podcast you’d binge?",
          options: [
            "reverse engineering",
            "cloud economics",
            "automation culture",
            "AI governance",
          ],
        },
        {
          id: 24,
          question: "Which career feels more main character energy?",
          options: [
            "performance engineering",
            "cloud computing",
            "DevOps / SecOps",
            "ML / Data",
          ],
        },
        {
          id: 25,
          question: "Which side quest is fun?",
          options: [
            "microcontrollers",
            "scaling databases",
            "CICD optimization",
            "building predictive dashboards",
          ],
        },
        {
          id: 26,
          question: "Which industry excites?",
          options: [
            "core tech",
            "fintech / enterprise SaaS",
            "infra tooling companies",
            "AI labs",
          ],
        },
        {
          id: 27,
          question: "Which KPI you flex on LinkedIn?",
          options: [
            "latency drop",
            "uptime guaranteed",
            "automation %",
            "model lift",
          ],
        },
        {
          id: 28,
          question: "What’s your debug culture?",
          options: [
            "memory introspection",
            "API logs",
            "pipeline logs",
            "model metrics",
          ],
        },
        {
          id: 29,
          question: "What’s satisfying?",
          options: [
            "zero runtime crash",
            "TPS handling spike",
            "zero manual deployments",
            "lower model loss",
          ],
        },
        {
          id: 30,
          question: "Which will you sacrifice least?",
          options: ["speed", "reliability", "maintainability", "accuracy"],
        },
        {
          id: 31,
          question: "What is 'success' to you?",
          options: ["performance", "scalability", "automation", "intelligence"],
        },
        {
          id: 32,
          question: "Which type of documentation excites you?",
          options: [
            "assembly guides",
            "system design docs",
            "pipeline runbooks",
            "ML research papers",
          ],
        },
        {
          id: 33,
          question: "Your ideal hackathon:",
          options: [
            "kernel development",
            "enterprise app",
            "CI/CD automation",
            "AI modeling",
          ],
        },
        {
          id: 34,
          question: "Preferred debugging tool?",
          options: [
            "gdb",
            "logs & metrics",
            "automation dashboard",
            "tensorboard / jupyter",
          ],
        },
        {
          id: 35,
          question: "Favorite coding challenge?",
          options: [
            "bit manipulation",
            "scalable system design",
            "workflow automation",
            "data analysis / ML problem",
          ],
        },
        {
          id: 36,
          question: "Ideal project team?",
          options: [
            "low-level engineers",
            "enterprise architects",
            "DevOps engineers",
            "ML / data scientists",
          ],
        },
        {
          id: 37,
          question: "Which library/framework excites you most?",
          options: [
            "C/C++ STL",
            "Spring Boot",
            "Ansible / Terraform",
            "PyTorch / TensorFlow",
          ],
        },
        {
          id: 38,
          question: "Favorite performance metric?",
          options: [
            "latency",
            "uptime",
            "automation coverage",
            "prediction accuracy",
          ],
        },
        {
          id: 39,
          question: "Which problem would you solve first?",
          options: [
            "memory leak",
            "load balancing",
            "pipeline optimization",
            "model tuning",
          ],
        },
        {
          id: 40,
          question: "Preferred IDE?",
          options: [
            "VS Code / CLion",
            "IntelliJ IDEA",
            "VS Code + scripts",
            "Jupyter / VS Code",
          ],
        },
        {
          id: 41,
          question: "Which tech blog would you read?",
          options: [
            "OS internals",
            "Cloud patterns",
            "Automation blogs",
            "ML / AI research",
          ],
        },
        {
          id: 42,
          question: "Favorite type of code review?",
          options: [
            "low-level optimizations",
            "architecture review",
            "pipeline review",
            "data model review",
          ],
        },
        {
          id: 43,
          question: "Favorite system to maintain?",
          options: [
            "embedded systems",
            "enterprise backend",
            "automation infra",
            "ML pipelines",
          ],
        },
        {
          id: 44,
          question: "Which problem excites you?",
          options: [
            "race conditions",
            "scalability issues",
            "deployment failures",
            "model convergence issues",
          ],
        },
        {
          id: 45,
          question: "Preferred learning style?",
          options: [
            "reading assembly",
            "design docs",
            "automation tutorials",
            "ML papers",
          ],
        },
        {
          id: 46,
          question: "Favorite tech conference?",
          options: [
            "KernelConf",
            "AWS re:Invent",
            "DevOpsDays",
            "NeurIPS / ICML",
          ],
        },
        {
          id: 47,
          question: "Which challenge feels rewarding?",
          options: [
            "debugging OS",
            "enterprise migrations",
            "automation orchestration",
            "ML accuracy improvement",
          ],
        },
        {
          id: 48,
          question: "Which output gives satisfaction?",
          options: [
            "fastest runtime",
            "reliable service",
            "automated pipelines",
            "accurate predictions",
          ],
        },
        {
          id: 49,
          question: "Which is more exciting?",
          options: [
            "optimization at machine level",
            "large scale enterprise design",
            "pipeline automation",
            "ML model design",
          ],
        },
        {
          id: 50,
          question: "Ultimate goal in career?",
          options: [
            "high-performance systems",
            "enterprise leadership",
            "seamless automation",
            "intelligent AI solutions",
          ],
        },
      ];
      resolve(questions);
    }, 500);
  });
};
