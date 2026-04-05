export const projects = [
  {
    id: "chat-app",
    title: "Real-Time Chat Application",
    subtitle: "Full-stack messaging platform",
    description:
      "Production-grade real-time chat application with WebSocket-based live messaging, JWT authentication, persistent MongoDB storage, and a polished React UI featuring message threads.",
    emoji: "💬",
    gradient: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
    accent: "#38bdf8",
    featured: true,
    tech: [
      "React",
      "Node.js",
      "Express",
      "Socket.IO",
      "MongoDB",
      "JWT",
      "CSS3",
    ],
    links: {
      github: "https://github.com/pawanti8421/PrivateChat_Application",
      live: "https://privatechat-client.onrender.com",
    },
    metrics: ["< 50ms latency", "JWT secured", "Real-time sync"],
  },
  {
    id: "dental",
    title: "Dental Clinic Management",
    subtitle: "Full clinic management system",
    description:
      "Comprehensive Django-based clinic system with patient records, appointment scheduling, and treatment history tracking, improving operational efficiency and reducing manual errors. Designed for real clinic workflows.",
    emoji: "🦷",
    gradient: "linear-gradient(135deg, #0a0f1e, #0d1b2a, #1b2838)",
    accent: "#a78bfa",
    featured: false,
    tech: ["Django", "Python", "HTML5", "CSS3", "SQLite"],
    links: {
      github: "https://github.com/pawanti8421/DentalClinicManagement",
      live: "https://dentalclinicsystem.onrender.com",
    },
    metrics: ["Patient records", "Appointment system", "Django admin"],
  },
  {
    id: "weather",
    title: "Weather Dashboard",
    subtitle: "Real-time weather & forecasts",
    description:
      "Built a responsive weather website using HTML, CSS, and JavaScript, integrating the OpenWeatherMap API to fetch and display real-time weather data and forecasts for user-specified locations.",
    emoji: "🌤️",
    gradient: "linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)",
    accent: "#fbbf24",
    featured: false,
    tech: ["HTML5", "CSS3", "JavaScript", "OpenWeather API"],
    links: {
      github: "https://github.com/pawanti8421/Weather-website",
      live: "https://pawanti8421.github.io/Weather-website/",
    },
    metrics: [
      "real-time weather data",
      "multi-day forecast",
      "city-based search",
    ],
  },
];
