export const profile = {
  name: "Milan Ajder",
  role: "Software Engineer",
  location: "Novi Sad, Serbia",
  intro: "I like building things end to end and seeing the results.",
  bio: "I'm a software engineer at CodeBridge, working on AI-native software. What I enjoy most is taking an idea and turning it into something people can use.",
  about: [
    "I like getting to the heart of a problem, working out a practical solution, and seeing it through. That's taken me across frontend, backend, mobile apps, and cloud infrastructure, using React and Next.js, Angular, Java and Spring Boot, TypeScript, Kotlin, and AWS along the way.",
  ],
  experience: {
    years: "4",
    label: "Years of professional software engineering experience",
  },
  history: [
    {
      year: "2000",
      code: "Origin",
      title: "Born",
      detail: "A huge LEGO lover was born",
    },
    {
      year: "2015",
      code: "Mathematics",
      title: "Specialist mathematics programme",
      detail: "Jovan Jovanović Zmaj Grammar School · programme for mathematically gifted students.",
    },
    {
      year: "2019-2023",
      code: "Bachelor",
      title: "Software Engineering, BSc",
      detail: "Faculty of Technical Sciences · University of Novi Sad.",
    },
    {
      year: "2026",
      code: "Master",
      title: "Software Engineering, MSc",
      detail: "Thesis on how AI assistants affect developer productivity, cognitive load, and deep concentration.",
    },
  ],
  education: [
    {
      institution: "Faculty of Technical Sciences, University of Novi Sad",
      field: "Software Engineering",
      studies: "Bachelor’s and Master’s studies",
    },
  ],
  certifications: ["AWS Certified Developer – Associate"],
  technologies: [
    "React", "Next.js", "TypeScript", "Node.js", "Angular", "Java", "Spring Boot", "Kotlin", "Android", "Jetpack Compose", "Firebase", "Databases", "AWS",
  ],
  interests: ["AI-assisted software development", "Developer productivity", "Cognitive load", "Deep concentration", "Software product development"],
  links: {
    github: "https://github.com/mmmajder",
    linkedin: "https://www.linkedin.com/in/milan-ajder-0221801b9/",
    email: "milan@ajder.dev",
  },
} as const;
