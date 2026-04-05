export const terminalConfig = {
  welcome: [
    { type: "success", text: "Welcome to Pawan's dev terminal v2.0.0" },
    { type: "muted", text: "Type 'help' to see available commands" },
    { type: "muted", text: "─────────────────────────────────────────────" },
  ],
  commands: {
    help: [
      { type: "highlight", text: "Available commands:" },
      { type: "output", text: "  whoami     →  Quick introduction" },
      { type: "output", text: "  about      →  Developer background" },
      { type: "output", text: "  skills     →  Technical skill list" },
      { type: "output", text: "  projects   →  All projects" },
      { type: "output", text: "  experience →  Work history" },
      { type: "output", text: "  education  →  Academic background" },
      { type: "output", text: "  contact    →  Get in touch" },
      { type: "output", text: "  social     →  Social media links" },
      { type: "output", text: "  resume     →  Download resume" },
      { type: "output", text: "  clear      →  Clear terminal" },
      { type: "muted", text: "─────────────────────────────────────────────" },
    ],
    whoami: [
      { type: "highlight", text: "Pawan Tiwari" },
      {
        type: "output",
        text: "Role     : Software Developer / MERN Stack Developer",
      },
      { type: "output", text: "Location : India 🇮🇳" },
      { type: "output", text: "Status   : Open to opportunities ✅" },
      {
        type: "output",
        text: "Stack    : React · Node · Sql · MongoDB · Java · Python",
      },
      { type: "muted", text: "─────────────────────────────────────────────" },
    ],
    about: [
      { type: "highlight", text: "// About Pawan" },
      {
        type: "output",
        text: "I'm a passionate software developer who loves",
      },
      {
        type: "output",
        text: "building scalable products. From real-time apps",
      },
      {
        type: "output",
        text: "to desktop software — clean code is my religion.",
      },
      { type: "output", text: "" },
      { type: "success", text: "📍 India  |  ✉️  pawantiwari8421@gmail.com" },
      { type: "muted", text: "─────────────────────────────────────────────" },
    ],
    education: [
      { type: "highlight", text: "// Education" },
      { type: "success", text: "B.Tech — Information Technology" },
      {
        type: "output",
        text: "College  : Shah & Anchor Kutchhi Engineering College",
      },
      { type: "output", text: "Period   : 2022 – 2026" },
      { type: "output", text: "CGPA     : 8.49 / 10.0" },
      { type: "muted", text: "─────────────────────────────────────────────" },
    ],
    skills: [
      { type: "highlight", text: "// Technical Skills" },
      {
        type: "success",
        text: "Languages  : JavaScript ★★★★★  Java ★★★★☆  Python ★★★★☆",
      },
      { type: "output", text: "Frontend   : React ★★★★★  HTML/CSS ★★★★★" },
      {
        type: "output",
        text: "Backend    : Node.js ★★★★★  Express ★★★★☆  Django ★★★☆☆",
      },
      { type: "output", text: "Database   : MongoDB ★★★★☆  SQL ★★★★☆" },
      { type: "output", text: "Tools      : Git ★★★★★  Linux ★★★☆☆" },
      { type: "muted", text: "─────────────────────────────────────────────" },
    ],
    projects: [
      { type: "highlight", text: "// Projects" },
      { type: "success", text: "1. Real-Time Chat App" },
      {
        type: "output",
        text: "   Stack : React, Node, Socket.IO, MongoDB, JWT",
      },
      {
        type: "output",
        text: "   URL   : https://github.com/pawanti8421/PrivateChat_Application",
      },
      { type: "success", text: "2. Weather Dashboard" },
      { type: "output", text: "   Stack : HTML, CSS, JS, OpenWeather API" },
      {
        type: "output",
        text: "   URL   : https://github.com/pawanti8421/Weather-website",
      },
      { type: "success", text: "3. Dental Clinic System" },
      { type: "output", text: "   Stack : Django, Python, SQLite" },
      {
        type: "output",
        text: "   URL   : https://github.com/pawanti8421/DentalClinicManagement",
      },
      { type: "muted", text: "─────────────────────────────────────────────" },
    ],
    experience: [
      { type: "highlight", text: "// Experience" },
      { type: "success", text: "Java Developer Intern @ Mindstein" },
      { type: "output", text: "Duration : Aug 2024 – Nov 2024" },
      {
        type: "output",
        text: "Built Java Swing app + JDBC + SQL optimization",
      },
      { type: "muted", text: "─────────────────────────────────────────────" },
    ],
    contact: [
      { type: "highlight", text: "// Contact" },
      { type: "success", text: "Email    : pawantiwari8421@gmail.com" },
      { type: "output", text: "Phone    : +91 74993 73180" },
      { type: "output", text: "Location : India 🇮🇳" },
      { type: "muted", text: "Type 'social' for social links" },
      { type: "muted", text: "─────────────────────────────────────────────" },
    ],
    social: [
      { type: "highlight", text: "// Social Links" },
      { type: "success", text: "GitHub   : https://github.com/pawanti8421" },
      {
        type: "output",
        text: "LinkedIn : https://www.linkedin.com/in/pawan-umesh-tiwari-a614b3259",
      },
      { type: "output", text: "Email    : pawantiwari8421@gmail.com" },
      { type: "muted", text: "─────────────────────────────────────────────" },
    ],
    resume: [
      { type: "success", text: "📄 Resume download initiated..." },
      { type: "output", text: "File     : Pawan_Tiwari_Resume.pdf" },
      { type: "output", text: "Size     : ~180 KB" },
      { type: "highlight", text: "✓ Download complete" },
      { type: "muted", text: "─────────────────────────────────────────────" },
    ],
  },
};
