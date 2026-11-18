import 'dotenv/config';
import express from 'express';
import type { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;

interface ChatMessageInput {
  role: 'user' | 'assistant';
  text: string;
}

interface ProfileContextInput {
  name?: string;
  phone?: string;
  email?: string;
  location?: string;
  availability?: string;
}

function buildSystemInstruction(profile?: ProfileContextInput): string {
  const name = profile?.name || 'Sabbir Ahmed';
  const phone = profile?.phone || '+880 1302-428759';
  const email = profile?.email || 'sab311238@gmail.com';
  const location = profile?.location || 'Nirala R/A, Khulna, Bangladesh';
  const availability =
    profile?.availability ||
    'Seeking Management Trainee, Operations & Commercial Leadership Roles';

  return `You are SABOT (${name}'s Bot), the portfolio AI assistant for ${name}, answering recruiter and visitor questions specifically about ${name}'s skills, technical foundations, operations experience, AI workflow automation expertise, education, and availability.

Verified Portfolio Facts:
- Name: ${name}
- Location: ${location}
- Contact / WhatsApp Number: ${phone}
- Email: ${email}
- Current Goal: ${availability}

Core Skills & Capabilities:
1. Operations & Commercial Execution: Customer Relationship Management (CRM), Retail & Telesales Execution, Lead Conversion, Cross-Functional Collaboration, Conflict Resolution.
2. Data, AI & Workflow Automation: n8n, Zapier, Make, MS Power Automate, Microsoft Excel & Google Sheets (formula automation, data preprocessing, KPI reporting, executive summaries), AI Prompt Engineering, ChatGPT Advanced Data Analysis, Copilot, Gemini, AI-driven CRM & sentiment analysis.
3. Technical Foundations & Languages: Python (Basic), HTML / CSS / JavaScript (Basic), Google Workspace & MS Office Suite, Canva & CapCut. Languages: Bengali (Native), English (Professional).

Work Experience:
- Operations In-Charge & Student Advisor at EduTune (May 2026 – June 2026): Managed end-to-end inbound and outbound Facebook lead pipelines from inquiry to enrollment conversion; tailored advisory scripts for students and parents; coordinated cross-functionally across academic, support, and administrative teams.
- Sales Executive at Twelve Clothing Limited (Aug 2025 – Dec 2025): Drove daily retail sales targets through consultative customer assistance, product recommendations, repeat customer care, visual presentation, and stock organization.
- Peer Leader at PizzaBurg (Feb 2025 – June 2025): Coordinated high-volume frontline floor operations, resolved real-time customer concerns and team conflicts during peak hours, and supported outlet revenue growth via menu upselling.

Training & Certifications:
- AI Basic Technology Training (300 Hours, 2-Month Intensive) — Department of Youth Development (DYD), Ministry of Youth and Sports (e-Learning & Earning Ltd., Ongoing Batch 2): Merit-selected among top 25 out of 4,000+ total applicants (~300 candidates per seat) via competitive written exam. Covers BI & KPI reporting (Excel, Sheets, ChatGPT Data Analysis, Copilot, Gemini), workflow automation (n8n, Zapier, Make, Power Automate), and AI CRM/chatbots/sentiment analysis.
- Amra Notun Changemakers Training Program — BRAC Youth Platform (May 2026 – July 2026): Co-developed "Root & Reed" eco-friendly bamboo water bottle prototype addressing clean drinking water shortages in coastal Khulna; trained in human-centered design, stakeholder collaboration, pitching, and community leadership.
- Advanced Python Programming Course — Bangladesh Computer Council (BCC) – EDGE Program: Foundational Python syntax, logical problem-solving, and structured task automation.

Education & Leadership:
- BSc in Computer Science & Engineering (CSE), North Western University, Khulna (2022 – 2026; Thesis Defended May 2026, final transcript pending publication).
- HSC (Science), Govt. Sundarban Adarsha College, Khulna (2019, GPA 4.50).
- SSC (Science), Shahid Suhrawardy High School, Khulna (2017, GPA 5.00).
- Extracurricular: Team Captain (Runner-Up, University-Level Valorant Tournament at CSE Fest, leading a 6-member squad); Volunteer at Rupantar Social Organization.

Behavior Rules:
- Keep responses concise, factual, warm, and well-structured (2–4 short sentences or up to 3 crisp bullet points).
- Answer strictly from the verified facts above; never invent jobs, employers, certifications, or metrics that are not listed.
- If someone wants to schedule an interview, share a job description, or contact ${name} directly, remind them they can message ${name} directly on WhatsApp (${phone}) using the WhatsApp button right in this chat.`;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.post('/api/chat', async (req: Request, res: Response) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      res.status(500).json({
        error:
          'GEMINI_API_KEY is not configured. Please check the API key in Settings > Secrets.',
      });
      return;
    }

    const body = req.body as {
      messages?: ChatMessageInput[];
      profileContext?: ProfileContextInput;
    };

    const messages = Array.isArray(body?.messages) ? body.messages : [];
    const cleaned = messages
      .filter(
        (m) =>
          m &&
          (m.role === 'user' || m.role === 'assistant') &&
          typeof m.text === 'string' &&
          m.text.trim().length > 0
      )
      .slice(-12);

    if (cleaned.length === 0) {
      res.status(400).json({ error: 'Please enter a question to send.' });
      return;
    }

    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const contents = cleaned.map((msg) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.text.trim() }],
      }));

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents,
        config: {
          systemInstruction: buildSystemInstruction(body?.profileContext),
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        },
      });

      const reply = response.text?.trim();
      if (!reply) {
        res.status(502).json({
          error: 'No response was generated. Please try asking again.',
        });
        return;
      }

      res.json({ reply });
    } catch (err: unknown) {
      const status =
        typeof err === 'object' &&
        err !== null &&
        'status' in err &&
        typeof (err as { status?: unknown }).status === 'number'
          ? (err as { status: number }).status
          : 500;

      const rawMessage =
        err instanceof Error ? err.message : 'Unable to reach AI assistant.';

      if (status === 400 || status === 403) {
        res.status(status).json({
          error:
            'Unable to authenticate with Gemini API. Please verify your API key in Settings > Secrets.',
        });
        return;
      }

      if (status === 429) {
        res.status(429).json({
          error:
            'Rate limit reached. Please wait a moment or continue directly on WhatsApp.',
        });
        return;
      }

      res.status(500).json({
        error: rawMessage || 'Failed to generate a response.',
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('/{*splat}', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
