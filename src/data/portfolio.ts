export type InitiativeCategory = 'AI & Automation' | 'Operations' | 'Social Impact' | 'Commercial';

export interface InitiativeHighlight {
  label: string;
  value: string;
}

export interface InitiativeItem {
  id: string;
  title: string;
  category: InitiativeCategory;
  period: string;
  organization: string;
  role: string;
  summary: string;
  gridSpanClass: string;
  visualType: 'workflow' | 'impact' | 'pipeline' | 'retail';
  context: string;
  execution: string;
  toolsAndSkills: string[];
  highlights: InitiativeHighlight[];
}

export interface CapabilityItem {
  number: string;
  title: string;
  description: string;
  focusAreas: string[];
}

export interface ExperienceItem {
  period: string;
  role: string;
  company: string;
  bullets: string[];
}

export interface TrainingItem {
  period: string;
  title: string;
  issuer: string;
  icon?: string;
  iconAlt?: string;
  iconFit?: 'cover' | 'contain';
  details: string[];
}

export interface EducationItem {
  period: string;
  degree: string;
  institution: string;
  note: string;
}

export interface LeadershipItem {
  title: string;
  organization: string;
  description: string;
}

export interface PortfolioProfile {
  name: string;
  kicker: string;
  headline: string;
  bio: string;
  location: string;
  phone: string;
  availability: string;
  email: string;
  heroImage: string;
  heroImageAlt: string;
  cvUrl: string;
  linkedinUrl: string;
  facebookUrl: string;
}

export const DEFAULT_PROFILE: PortfolioProfile = {
  name: 'Sabbir Ahmed',
  kicker: 'CSE Graduate · Operations & AI Automation · Khulna, Bangladesh',
  headline: 'Bridging technical problem-solving with business execution.',
  bio: 'Analytical and operations-driven Computer Science & Engineering graduate with hands-on experience in customer management, retail sales, revenue-focused lead conversion, and frontline team coordination—equipped with practical training in AI workflow automation and data-driven business analysis.',
  location: 'Nirala R/A, Khulna, Bangladesh',
  phone: '+880 1302-428759',
  availability: 'Seeking Management Trainee, Operations & Commercial Leadership Roles',
  email: 'sab311238@gmail.com',
  heroImage: '/assets/aistudio/Confident_Corporate_Portrait_in_Black__1__bbcb45b2.png',
  heroImageAlt: 'Corporate studio portrait of Sabbir Ahmed in a black tailored suit and glasses',
  cvUrl: '/assets/aistudio/Sabbir_Ahmed_CV_Grameenphone_NBL_6d5fe1a6.pdf',
  linkedinUrl: 'https://www.linkedin.com/in/sabbir-ahmed-7a5527331',
  facebookUrl: 'https://www.facebook.com/sabbir.ahmed.956420',
};

export const HERO_METRICS = [
  { value: 'Top 25 / 4,000+', label: 'Merit Selection (~300/seat), DYD AI', targetId: 'experience' },
  { value: '300 Hours', label: 'AI & Workflow Automation Intensive', targetId: 'experience' },
  { value: 'BSc in CSE', label: 'North Western University (2026)', targetId: 'education' },
  { value: '3 Roles', label: 'Operations, Retail & Floor Leadership', targetId: 'work' },
];

export const INITIATIVES: InitiativeItem[] = [
  {
    id: 'ai-workflow-automation',
    title: 'AI Workflow & Business Intelligence Systems',
    category: 'AI & Automation',
    period: '2026 (Ongoing)',
    organization: 'Department of Youth Development (DYD)',
    role: 'Merit-Selected Trainee (Batch 2)',
    summary:
      'Automated operational pipelines with n8n, Zapier, Make, and Power Automate paired with AI-assisted KPI reporting.',
    gridSpanClass: 'lg:col-span-2',
    visualType: 'workflow',
    context:
      'Selected among the top 25 candidates out of 4,000+ total applicants (~300 candidates per seat) through a competitive written examination for a 300-hour, 2-month intensive program under the Ministry of Youth and Sports (conducted by e-Learning & Earning Ltd.).',
    execution:
      'Designed automated business workflows using n8n, Zapier, Make, and MS Power Automate to eliminate repetitive operational tasks. Applied ChatGPT Advanced Data Analysis, Copilot, and Gemini alongside Excel and Google Sheets for data preprocessing, formula automation, KPI reporting, and executive summaries, as well as AI-driven CRM and sentiment analysis workflows.',
    toolsAndSkills: ['n8n', 'Zapier & Make', 'MS Power Automate', 'Excel & Sheets', 'AI CRM & Sentiment'],
    highlights: [
      { value: '300 Hrs', label: 'Intensive Curriculum' },
      { value: 'Top 25', label: 'Out of 4,000+ Applicants (~300/seat)' },
      { value: '4 Tools', label: 'Automation Stack Mastered' },
    ],
  },
  {
    id: 'edutune-operations',
    title: 'Lead Pipeline & Enrollment Operations',
    category: 'Operations',
    period: 'May 2026 – June 2026',
    organization: 'EduTune',
    role: 'Operations In-Charge & Student Advisor',
    summary:
      'End-to-end management of inbound and outbound Facebook lead pipelines from inquiry to enrollment.',
    gridSpanClass: 'lg:col-span-1',
    visualType: 'pipeline',
    context:
      'Prospective students and parents required timely, clear advisory guidance across multiple touchpoints before committing to course enrollment, while internal teams needed tight handoffs.',
    execution:
      'Managed end-to-end inbound and outbound Facebook lead pipelines to convert inquiries into enrollments. Tailored advisory communication scripts to address customer needs and coordinated cross-functionally across academic, support, and administrative teams to streamline onboarding.',
    toolsAndSkills: ['Lead Conversion', 'Advisory Scripting', 'Cross-Functional Coordination', 'Student Onboarding'],
    highlights: [
      { value: 'End-to-End', label: 'Facebook Lead Pipeline' },
      { value: '3 Teams', label: 'Academic, Support & Admin' },
      { value: 'Primary', label: 'Student & Parent Advisor' },
    ],
  },
  {
    id: 'root-and-reed',
    title: 'Root & Reed — Bamboo Water Bottle Prototype',
    category: 'Social Impact',
    period: 'May 2026 – July 2026',
    organization: 'BRAC Youth Platform',
    role: 'Changemaker Co-Developer',
    summary:
      'Eco-friendly bamboo water bottle prototype addressing clean drinking water shortages in coastal Khulna.',
    gridSpanClass: 'lg:col-span-1',
    visualType: 'impact',
    context:
      'Recurring floods and river erosion in coastal Khulna create acute clean drinking water shortages and plastic waste challenges for vulnerable communities.',
    execution:
      'Under the Amra Notun Changemakers Training Program, co-developed the "Root & Reed" eco-friendly bamboo water bottle prototype through human-centered problem-solving, stakeholder collaboration, community leadership, and structured project pitching.',
    toolsAndSkills: ['Human-Centered Design', 'Stakeholder Alignment', 'Project Pitching', 'Community Leadership'],
    highlights: [
      { value: 'Coastal Khulna', label: 'Target Impact Region' },
      { value: 'BRAC', label: 'Changemakers Cohort' },
      { value: 'Prototype', label: 'Sustainable Bamboo Vessel' },
    ],
  },
  {
    id: 'commercial-floor-leadership',
    title: 'Consultative Retail & High-Volume Floor Leadership',
    category: 'Commercial',
    period: 'Feb 2025 – Dec 2025',
    organization: 'Twelve Clothing Limited & PizzaBurg',
    role: 'Sales Executive & Peer Leader',
    summary:
      'Driving daily retail sales targets, visual merchandising, peak-hour floor coordination, and conflict resolution.',
    gridSpanClass: 'lg:col-span-2',
    visualType: 'retail',
    context:
      'Both high-volume hospitality shifts and peak retail seasons demand calm real-time decision-making, proactive upselling, and consistent customer relationship standards.',
    execution:
      'As Peer Leader at PizzaBurg (Feb–Jun 2025), coordinated frontline floor operations during peak hours, resolved real-time customer concerns, and supported revenue growth via menu upselling. As Sales Executive at Twelve Clothing Limited (Aug–Dec 2025), drove daily retail targets through consultative recommendations, repeat-customer care, and disciplined stock merchandising.',
    toolsAndSkills: ['Retail & Telesales', 'Floor Coordination', 'Conflict Resolution', 'Visual Merchandising'],
    highlights: [
      { value: '11 Mos', label: 'Combined Frontline Execution' },
      { value: 'Peak Hours', label: 'Shift & Conflict Resolution' },
      { value: 'Consultative', label: 'Target-Driven Selling' },
    ],
  },
];

export const CAPABILITIES: CapabilityItem[] = [
  {
    number: '01.',
    title: 'Operations & Commercial Execution',
    description:
      'Hands-on ownership of customer pipelines, frontline shift coordination, and consultative sales—connecting daily service execution with measurable revenue and retention outcomes.',
    focusAreas: [
      'Customer Relationship Management (CRM)',
      'Retail & Telesales Execution',
      'Lead Conversion',
      'Cross-Functional Collaboration',
      'Conflict Resolution',
    ],
  },
  {
    number: '02.',
    title: 'Data, AI & Workflow Automation',
    description:
      'Designing practical no-code and AI-assisted business systems that eliminate manual bottlenecks, automate KPI reporting, and turn raw spreadsheets into executive clarity.',
    focusAreas: [
      'n8n, Zapier, Make & Power Automate',
      'Microsoft Excel & Google Sheets',
      'AI Prompt Engineering',
      'AI Data Insights & KPI Reporting',
    ],
  },
  {
    number: '03.',
    title: 'Technical Foundations & Languages',
    description:
      'Computer Science & Engineering grounding combined with digital media tools and bilingual communication for modern commercial and operational teams.',
    focusAreas: [
      'Python (Basic)',
      'HTML / CSS / JavaScript (Basic)',
      'Google Workspace & MS Office Suite',
      'Canva & CapCut',
      'Bengali (Native) · English (Professional)',
    ],
  },
];

export const EXPERIENCE: ExperienceItem[] = [
  {
    period: 'May 2026 – June 2026',
    role: 'Operations In-Charge & Student Advisor',
    company: 'EduTune',
    bullets: [
      'Managed end-to-end inbound and outbound Facebook lead pipelines, driving course inquiries from initial contact through enrollment conversion.',
      'Acted as primary advisor for prospective students and parents, tailoring communication scripts to address customer needs and improve conversion efficiency.',
      'Coordinated cross-functionally between academic, support, and administrative teams to streamline student onboarding and maintain service quality.',
    ],
  },
  {
    period: 'Aug 2025 – Dec 2025',
    role: 'Sales Executive',
    company: 'Twelve Clothing Limited',
    bullets: [
      'Drove daily retail sales targets through consultative customer assistance, product recommendations, and floor merchandising.',
      'Built repeat customer relationships and maintained high visual presentation and stock organization standards across peak retail periods.',
    ],
  },
  {
    period: 'Feb 2025 – June 2025',
    role: 'Peer Leader',
    company: 'PizzaBurg',
    bullets: [
      'Coordinated frontline floor operations in a high-volume, fast-paced service environment to ensure speed, accuracy, and customer satisfaction.',
      'Resolved real-time customer concerns and supported team conflict resolution, maintaining smooth shift execution during peak operational hours.',
      'Supported outlet revenue growth through proactive customer engagement and menu upselling.',
    ],
  },
];

export const TRAININGS: TrainingItem[] = [
  {
    period: 'Ongoing (Batch 2)',
    title: 'AI Basic Technology Training (300 Hours, 2-Month Intensive)',
    issuer: 'Department of Youth Development (DYD), Ministry of Youth and Sports · e-Learning & Earning Ltd.',
    icon: '/assets/aistudio/image-300769-1754914972_fd6afb10.jpg',
    iconAlt: 'Department of Youth Development (DYD) logo',
    iconFit: 'contain',
    details: [
      'Merit-Based Selection: Selected among the top 25 candidates out of 4,000+ total applicants (around 300 candidates per seat) through a competitive written examination.',
      'Business Intelligence & Data Analysis: ChatGPT Advanced Data Analysis, Copilot, Gemini, Excel & Google Sheets for KPI reporting.',
      'Workflow & Process Automation: Designing automated business workflows using n8n, Zapier, Make, and MS Power Automate.',
      'Customer & Commercial Operations: AI-driven CRM concepts, chatbots, sentiment analysis, and persuasive communication tools.',
    ],
  },
  {
    period: 'May 2026 – July 2026',
    title: 'Amra Notun Changemakers Training Program',
    issuer: 'BRAC Youth Platform',
    icon: '/assets/aistudio/brac-logo-png_seeklogo-313020_0b5fb9bf.png',
    iconAlt: 'BRAC logo',
    details: [
      'Social Impact Project "Root & Reed": Co-developed an eco-friendly bamboo water bottle prototype addressing clean drinking water shortages in coastal Khulna.',
      'Completed intensive training in human-centered problem-solving, stakeholder collaboration, project pitching, and community leadership.',
    ],
  },
  {
    period: 'Certification',
    title: 'Advanced Python Programming Course',
    issuer: 'Bangladesh Computer Council (BCC) – EDGE Program',
    icon: '/assets/aistudio/bcc_logo_0_4c2393ef.jpg',
    iconAlt: 'Bangladesh Computer Council logo',
    iconFit: 'contain',
    details: [
      'Gained foundational knowledge in Python syntax, logical problem-solving, and structured task automation.',
    ],
  },
];

export const EDUCATION: EducationItem[] = [
  {
    period: '2022 – 2026',
    degree: 'Bachelor of Science (BSc) in Computer Science & Engineering (CSE)',
    institution: 'North Western University, Khulna',
    note: 'Thesis Defended: May 2026 (Final Transcript Pending Publication)',
  },
  {
    period: '2019',
    degree: 'Higher Secondary Certificate (HSC) — Science',
    institution: 'Govt. Sundarban Adarsha College, Khulna',
    note: 'GPA: 4.50',
  },
  {
    period: '2017',
    degree: 'Secondary School Certificate (SSC) — Science',
    institution: 'Shahid Suhrawardy High School, Khulna',
    note: 'GPA: 5.00',
  },
];

export const LEADERSHIP: LeadershipItem[] = [
  {
    title: 'Team Captain — Runner-Up, University-Level Valorant Tournament',
    organization: 'CSE Fest',
    description:
      'Led a 6-member squad through competitive knockout rounds, managing team strategy, role delegation, real-time communication, and composure under high-pressure conditions.',
  },
  {
    title: 'Volunteer',
    organization: 'Rupantar Social Organization',
    description:
      'Coordinated campus awareness campaigns, field logistics, and community support initiatives.',
  },
];
