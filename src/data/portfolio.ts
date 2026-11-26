
/**
 * The Inventor's Workshop — Portfolio Data
 * Owner: Ammar Faisal
 *
 * This file is the source of truth for AmmarOS.
 *
 * Rules:
 * - Do not invent achievements, metrics, or URLs.
 * - Keep planned projects clearly identified.
 * - Add new projects without changing UI components.
 * - Only display links that have been confirmed.
 */

export type VerifiedLink = {
  url: string;
  verified: true;
};

export type ProjectStatus =
  | "Completed"
  | "In development"
  | "Needs review";

export type Project = {
  id: string;
  name: string;
  category: string;
  summary: string;
  detail: string;
  stack: string[];
  status: ProjectStatus;
  featured?: boolean;
  context?: string;
  problem?: string;
  contribution?: string;
  workflow?: string[];
  challenges?: {
    challenge: string;
    solution: string;
  }[];
  outcome?: string;
  screenshot?: {
    src: string;
    alt: string;
    caption?: string;
  };
  links?: {
    github?: VerifiedLink;
    demo?: VerifiedLink;
    devpost?: VerifiedLink;
  };
};

// ============================================================
// PROJECTS
// ============================================================

export const projects: Project[] = [
  {
    id: "skillforge",
    name: "SkillForge",
    category: "Artificial Intelligence",
    summary:
      "An AI-powered platform that learns practical tasks from expert demonstrations and helps others follow them.",

    status: "Completed",
    featured: true,
    context:
      "Solo hackathon project | Hack the Valley 11 | October 2026",

    detail:
      "SkillForge explores a different approach to practical education: instead of requiring experts to manually write tutorials, an AI system observes their demonstrations and turns them into guided learning experiences. The project focuses on hands-on activities such as electronics repair, supporting the broader idea of right to repair.",

    problem:
      "Practical skills are often difficult to learn from static written instructions. Creating detailed tutorials also requires significant effort from experts.",

    contribution:
      "Independently developed and demonstrated the SkillForge hackathon concept. Worked on integrating AI vision, video capture, task checkpoints, and guidance for learners.",

    workflow: [
      "An expert demonstrates a practical task through video.",
      "Visual observations are analyzed using Gemini's multimodal capabilities.",
      "The learning workflow organizes the task into recognizable checkpoints.",
      "The learner follows guidance associated with those checkpoints.",
      "Visual capture can provide context while the learner performs the task.",
    ],

    challenges: [
      {
        challenge:
          "Capturing useful visual information from wearable devices.",
        solution:
          "Explored Meta Ray-Ban integration and alternative video capture workflows, including a WhatsApp-based approach when direct SDK access was restricted.",
      },
      {
        challenge:
          "Turning a continuous demonstration into manageable learning steps.",
        solution:
          "Designed a checkpoint-oriented workflow in which visual observations support practical step-by-step guidance.",
      },
    ],

    outcome:
      "Developed and demonstrated SkillForge as a solo hackathon project at Hack the Valley 11. Production deployment and complete wearable-device integration have not been verified.",

    stack: [
      "Gemini Vision",
      "AI / Multimodal Processing",
      "Video Capture",
      "ScreenCaptureKit",
    ],
  },

  {
    id: "neurogait",
    name: "NeuroGait",
    category: "Computer Vision / Full Stack",
    summary:
      "A real-time computer vision system that analyzes walking movements and visualizes gait patterns.",

    status: "Completed",
    featured: true,
    context: "TerraHacks 2025",

    detail:
      "NeuroGait is a camera-based movement analysis application that uses computer vision to detect body landmarks and examine gait characteristics. It combines live video processing, annotated visual feedback, and movement graphs in a web application.",

    problem:
      "Understanding gait patterns from ordinary video is difficult without tools that identify and visualize body movement over time.",

    contribution:
      "Worked on a full-stack system combining camera input, pose estimation, real-time communication, and movement visualization.",

    workflow: [
      "Camera frames are collected from the user's device.",
      "OpenCV processes the incoming video frames.",
      "MediaPipe detects body landmarks used in movement analysis.",
      "Python and NumPy support the processing of movement data.",
      "FastAPI and WebSockets support communication with the frontend.",
      "The interface displays annotated video and visualizations of stride and arm movement.",
    ],

    challenges: [
      {
        challenge:
          "Displaying computer vision analysis while video is being processed.",
        solution:
          "Used a real-time application architecture with FastAPI and WebSockets to support annotated frame delivery.",
      },
      {
        challenge:
          "Making movement-analysis results understandable.",
        solution:
          "Combined pose overlays with graphs representing stride and arm-swing characteristics.",
      },
    ],

    outcome:
      "Implemented a hackathon prototype with real-time annotated video and gait visualizations. Local processing was the default approach; clinical accuracy has not been established.",

    stack: [
      "React",
      "Next.js",
      "Python",
      "FastAPI",
      "WebSockets",
      "OpenCV",
      "MediaPipe",
      "NumPy",
      "Matplotlib",
    ],
  },

  {
    id: "dash2dorm",
    name: "Dash2Dorm",
    category: "Full Stack / Applied AI",
    summary:
      "A campus delivery platform exploring AI-assisted dynamic pricing and delivery incentives.",

    status: "Completed",
    featured: true,
    context: "Hack the 6ix 2025",

    detail:
      "Dash2Dorm is a campus-focused delivery platform designed around student deliveries and on-campus walkers. Its pricing concept considers changes in demand, weather, available couriers, and estimated delivery time to recommend incentives.",

    problem:
      "Campus delivery demand and courier availability can fluctuate, making fixed delivery incentives less responsive to actual conditions.",

    contribution:
      "Worked on the platform's dynamic pricing concept and its integration with application services, weather information, and AI-assisted incentive recommendations.",

    workflow: [
      "Collect contextual inputs such as time and weather.",
      "Consider temperature, demand level, available walkers, and estimated delivery duration.",
      "Supply structured information to the pricing workflow using Gemini through Vellum.ai.",
      "Generate a suggested walker incentive under defined pricing constraints.",
      "Use application services such as Supabase and Stripe for the platform's supporting workflows.",
    ],

    challenges: [
      {
        challenge:
          "Determining incentives when delivery conditions vary.",
        solution:
          "Designed a structured pricing workflow using multiple contextual factors instead of relying solely on fixed pricing.",
      },
      {
        challenge:
          "Preventing unreasonable incentive recommendations.",
        solution:
          "Included a planned incentive ceiling of $7 in the pricing design.",
      },
    ],

    outcome:
      "Developed as a Hack the 6ix 2025 project. Production usage and business outcomes have not been verified.",

    stack: [
      "Supabase",
      "Stripe",
      "Gemini",
      "Vellum.ai",
      "Open-Meteo",
      "REST APIs",
    ],
  },

  {
    id: "clarus",
    name: "Clarus",
    category: "Artificial Intelligence",
    summary:
      "An AI-focused project with additional technical details to be documented.",

    status: "Needs review",
    featured: false,

    detail:
      "Clarus is an AI project in my portfolio. Its complete feature set, architecture, implementation details, and outcomes still need to be documented before publication.",

    stack: [],
  },

  {
    id: "eunoiahub",
    name: "EunoiaHub",
    category: "Full Stack / Artificial Intelligence",
    summary:
      "A personal productivity and reflection platform with journaling, task management, and AI-powered assistance.",

    status: "Completed",
    featured: false,

    detail:
      "EunoiaHub combines daily journaling, task organization, mood tracking, personal reflections, and coping strategies in a web application. It also incorporates a Gemini-powered chatbot for conversational support.",

    problem:
      "Personal productivity, reflection, and everyday wellness activities often require switching between separate tools.",

    contribution:
      "Developed application features involving React, Appwrite authentication and data services, and Gemini chatbot integration.",

    workflow: [
      "Users access the application through Appwrite authentication.",
      "Journaling and task features support personal organization.",
      "Reflection and mood-related tools provide additional ways to record information.",
      "A Gemini-powered chatbot provides conversational assistance.",
    ],

    outcome:
      "Implemented a web application combining productivity, reflection, and AI-assisted features.",

    stack: [
      "React",
      "Appwrite",
      "Gemini",
      "JavaScript",
    ],
  },

  {
    id: "pawnvision",
    name: "pawnVision",
    category: "Computer Vision / Hardware",
    summary:
      "A developing computer vision project for recognizing a custom chessboard and analyzing moves.",

    status: "In development",
    featured: false,

    context: "Personal project | In development",

    detail:
      "pawnVision aims to recognize a physical marble chess set using computer vision, determine the board state, and connect the recognized position to Stockfish for move analysis. A wearable display is also being explored as a potential interface.",

    problem:
      "Traditional chess engines operate on digital board positions, while custom physical chess sets require an additional perception system to identify the pieces and their locations.",

    contribution:
      "Designing the computer vision pipeline and exploring approaches for detecting the board, recognizing custom pieces, and connecting position data to a chess engine.",

    workflow: [
      "Capture the physical chessboard using a camera.",
      "Detect the board boundaries and square positions.",
      "Recognize the custom marble chess pieces.",
      "Convert the recognized board into a position representation.",
      "Use Stockfish to analyze the position and suggest a move.",
      "Explore displaying analysis through wearable hardware.",
    ],

    challenges: [
      {
        challenge:
          "Recognizing custom chess pieces with unusual materials and shapes.",
        solution:
          "Exploring image collection and computer vision training approaches for the specific marble chess set.",
      },
    ],

    stack: [
      "Python",
      "OpenCV",
      "Stockfish",
      "Computer Vision",
    ],
  },
];

// ============================================================
// PROFESSIONAL EXPERIENCE
// ============================================================

export type Experience = {
  role: string;
  organization: string;
  date?: string;
  description: string;
  highlights?: string[];
  technologies?: string[];
};

export const experience: Experience[] = [
  {
    role: "IT Systems Analyst",
    organization: "Ontario Public Service",

    description:
      "Worked in an IT systems support environment, gaining practical experience with technical troubleshooting, problem solving, and supporting users and systems.",

    highlights: [
      "Supported technical troubleshooting and investigation of IT issues.",
      "Gained experience communicating technical information in a professional environment.",
      "Worked with IT systems and user-support processes.",
    ],
  },

  {
    role: "Program Mentor",
    organization: "K2i Academy | York University",

    date: "May 2025 – August 2025",

    description:
      "Facilitated STEM learning experiences through York University's Bringing STEM to Life work-integrated learning program.",

    highlights: [
      "Supported student engagement in robotics, coding, and hands-on engineering activities.",
      "Facilitated virtual and in-person learning experiences.",
      "Helped students use educational hardware and programming tools.",
      "Supported activities and demonstrations involving micro:bit, Maqueen/Cutebot, and HuskyLens.",
      "Contributed to workshop preparation and student project showcases.",
    ],

    technologies: [
      "micro:bit",
      "MakeCode",
      "Maqueen/Cutebot",
      "HuskyLens",
      "Robotics",
    ],
  },

  {
    role: "Sales Associate",
    organization: "Best Buy",

    description:
      "Customer-facing retail experience involving technology products, customer communication, and helping customers understand product options.",
  },

  {
    role: "Team Lead",
    organization: "FIRST Robotics Competition | Team 6378",

    description:
      "Helped lead a student robotics team through collaborative engineering and technical problem solving.",

    highlights: [
      "Held a leadership role within a team of approximately 17 students.",
      "Participated in collaborative robotics development and problem solving.",
    ],
  },

  {
    role: "Team Lead",
    organization: "FIRST Tech Challenge | Team 19483",

    description:
      "Student robotics team leadership involving engineering collaboration and competition preparation.",

    highlights: [
      "Led a student robotics team of approximately seven members.",
      "Supported coordination and collaboration on robotics activities.",
    ],
  },
];

// ============================================================
// TECHNICAL SKILLS
// ============================================================

export const skills = {
  Languages: [
    "Python",
    "Java",
    "JavaScript",
    "TypeScript",
    "C",
    "SQL",
    "HTML",
    "CSS",
  ],

  Frontend: [
    "React",
    "Next.js",
    "Tailwind CSS",
  ],

  Backend: [
    "Node.js",
    "Express",
    "FastAPI",
    "REST APIs",
    "WebSockets",
  ],

  "AI / Computer Vision": [
    "Gemini",
    "OpenCV",
    "MediaPipe",
    "NumPy",
    "Matplotlib",
  ],

  "Databases / Services": [
    "Supabase",
    "Appwrite",
  ],

  "Developer Tools": [
    "Git",
    "JUnit",
    "Jest",
  ],

  "APIs / Integrations": [
    "Stripe",
    "Vellum.ai",
    "Open-Meteo",
  ],

  "Hardware / Robotics": [
    "Arduino",
    "micro:bit",
    "MakeCode",
    "HuskyLens",
    "Maqueen",
    "Cutebot",
    "Sensors",
    "3D Printing",
  ],
};

export const skillNotes: Partial<
  Record<keyof typeof skills, string>
> = {
  Languages:
    "Programming and web technologies used across coursework and projects.",

  Frontend:
    "Building interactive web applications and interfaces.",

  Backend:
    "APIs, application logic, and real-time communication.",

  "AI / Computer Vision":
    "AI-powered applications, image processing, and movement analysis.",

  "Databases / Services":
    "Authentication, storage, and application data services.",

  "Developer Tools":
    "Version control and software testing tools.",

  "APIs / Integrations":
    "Payment, weather, and AI workflow integrations.",

  "Hardware / Robotics":
    "Physical computing, educational robotics, and prototyping.",
};

// ============================================================
// PUBLIC LINKS
// ============================================================

/**
 * Do not guess URLs.
 *
 * Example:
 *
 * github: {
 *   url: "https://github.com/CONFIRMED_USERNAME",
 *   verified: true
 * }
 */

export const publicLinks: {
  github?: VerifiedLink;
  linkedin?: VerifiedLink;
  devpost?: VerifiedLink;
  email?: {
    address: string;
    verified: true;
  };
  resume?: VerifiedLink;
} = {};

// ============================================================
// PROFILE
// ============================================================

export const profile: {
  name: string;
  role: string;
  introduction: string;
  about: string;
  interests: string[];

  education: {
    degree: string;
    institution: string;
    school: string;
    started: string;
    graduation?: string;
  };
} = {
  name: "Ammar Faisal",

  role: "Software Engineering Student & Developer",

  introduction:
    "I'm a Software Engineering student at York University who enjoys building software that interacts with the real world, from AI-powered applications to computer vision systems and robotics.",

  about:
    "I've always enjoyed figuring out how things work and building things of my own. Whether it's experimenting with robotics, developing a computer vision application, or creating an AI-powered learning platform at a hackathon, I like turning interesting ideas into functioning projects. I'm particularly interested in software engineering, artificial intelligence, and the intersection between software and hardware.",

  education: {
    degree: "Bachelor of Engineering | Software Engineering",
    institution: "York University",
    school: "Lassonde School of Engineering",
    started: "September 2023",
    graduation: "Expected May 2027",
  },

  interests: [
    "Artificial Intelligence",
    "Computer Vision",
    "Robotics",
    "Hardware Engineering",
    "3D Printing",
    "Full-Stack Development",
    "Hackathons",
    "Chess",
  ],
};
