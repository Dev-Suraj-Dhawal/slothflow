import { 
  AIProvider, 
  ChatTidierResult, 
  VoiceRambleResult, 
  FridgeChefResult, 
  DreadedReplyResult, 
  BedtimeStoryResult 
} from '../types';

export interface ModelProgressCallback {
  (status: string, progress?: number): void;
}

// In-Browser Transformers Pipeline Singleton
let transformersPipeline: unknown = null;
let currentPipelineTask: string = '';

export class OpenAIService {
  private ollamaEndpoint: string = 'http://localhost:11434';
  private selectedOllamaModel: string = 'llama3.2';
  private hfApiKey: string = '';

  public setOllamaEndpoint(endpoint: string) {
    this.ollamaEndpoint = endpoint.replace(/\/+$/, '');
  }

  public getOllamaEndpoint(): string {
    return this.ollamaEndpoint;
  }

  public setSelectedOllamaModel(model: string) {
    this.selectedOllamaModel = model;
  }

  public getSelectedOllamaModel(): string {
    return this.selectedOllamaModel;
  }

  public setHfApiKey(key: string) {
    this.hfApiKey = key;
  }

  // Probe local Ollama server
  public async probeOllama(): Promise<{ online: boolean; models: string[]; error?: string }> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const res = await fetch(`${this.ollamaEndpoint}/api/tags`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const models = Array.isArray(data.models) 
        ? data.models.map((m: { name: string }) => m.name) 
        : [];
      return { online: true, models };
    } catch (err: unknown) {
      return { 
        online: false, 
        models: [], 
        error: (err as Error).message || 'Local Ollama not reachable at this endpoint' 
      };
    }
  }

  // Load in-browser open-weight pipeline via Transformers.js
  private async getTransformersPipeline(
    task: 'text2text-generation' | 'summarization' | 'text-generation' = 'text2text-generation',
    onProgress?: ModelProgressCallback
  ) {
    if (transformersPipeline && currentPipelineTask === task) {
      return transformersPipeline;
    }

    onProgress?.('Fetching open-weight model from Hugging Face...', 10);

    try {
      // Dynamic import of Transformers.js v3 via CDN or local runtime
      const hfUrl = 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.3.3';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const hf: any = await import(/* @vite-ignore */ hfUrl);
      const { pipeline, env } = hf;

      // Configure HuggingFace environment for browser
      if (env) {
        env.allowLocalModels = false;
        env.useBrowserCache = true;
      }

      onProgress?.('Initializing WebGPU / WASM runtime...', 40);

      // We use Xenova/distilbart-cnn-6-12 or Xenova/Qwen1.5-0.5B-Chat or Xenova/t5-small
      const modelId = task === 'summarization' 
        ? 'Xenova/distilbart-cnn-6-12' 
        : 'onnx-community/Qwen2.5-0.5B-Instruct';

      onProgress?.(`Loading open-weight: ${modelId}...`, 60);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pipe = await (pipeline as any)(task as any, modelId, {
        progress_callback: (p: { status: string; progress?: number }) => {
          if (p.status === 'progress' && typeof p.progress === 'number') {
            onProgress?.(`Downloading weights: ${Math.round(p.progress)}%`, 60 + Math.round(p.progress * 0.35));
          } else if (p.status === 'ready') {
            onProgress?.('Model ready in browser memory!', 100);
          }
        }
      });

      transformersPipeline = pipe;
      currentPipelineTask = task;
      return pipe;
    } catch (err) {
      console.warn('Transformers.js runtime failed or not supported, falling back to distilled offline engine:', err);
      return null;
    }
  }

  // Call Local Ollama
  private async queryOllama(prompt: string, systemPrompt?: string): Promise<string> {
    const res = await fetch(`${this.ollamaEndpoint}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.selectedOllamaModel,
        prompt: prompt,
        system: systemPrompt || 'You are Sloan, an ultra-chill sloth AI assistant that helps users eliminate effort and be lazy. Be concise, calming, and practical.',
        stream: false
      })
    });

    if (!res.ok) {
      throw new Error(`Ollama error: HTTP ${res.status}`);
    }

    const data = await res.json();
    return data.response;
  }

  // 1. CHAT TIDIER
  public async tidyChat(
    rawText: string, 
    provider: AIProvider,
    onProgress?: ModelProgressCallback
  ): Promise<ChatTidierResult> {
    const trimmed = rawText.trim();
    if (!trimmed) {
      throw new Error('Please paste some unread chat or email content.');
    }

    // Provider A: Local Ollama
    if (provider === 'local-ollama') {
      onProgress?.('Sending chat dump to local Ollama open model...', 50);
      try {
        const prompt = `Analyze this unread conversation/message dump for a very lazy user who wants to conserve energy:
${trimmed}

Respond ONLY with valid JSON in this exact structure:
{
  "twoLineBrief": "Two simple, punchy sentences summarizing what actually matters.",
  "urgencyLevel": "Chill (Ignore)" or "Low Effort" or "One Quick Action Needed",
  "suggestedReplies": ["short reply 1", "short reply 2", "short reply 3"],
  "extractedTasks": ["task 1", "task 2"]
}`;
        const output = await this.queryOllama(prompt);
        const jsonMatch = output.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch (err) {
        console.warn('Ollama call failed, falling back:', err);
      }
    }

    // Provider B: In-Browser Transformers Open-Weight
    if (provider === 'browser-transformers') {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pipe: any = await this.getTransformersPipeline('summarization', onProgress);
        if (pipe) {
          onProgress?.('Running open-weight summarization locally...', 85);
          const out = await pipe(trimmed, { max_length: 60, min_length: 20 });
          const summary = out[0]?.summary_text || 'Group is making plans; nothing requires your immediate stress.';
          return {
            twoLineBrief: summary,
            urgencyLevel: trimmed.toLowerCase().includes('urgent') || trimmed.toLowerCase().includes('asap') 
              ? 'One Quick Action Needed' 
              : 'Chill (Ignore)',
            suggestedReplies: [
              'Sounds good to me!',
              'Thanks for the heads up, checking this later tonight.',
              'Approved from my end 👍'
            ],
            extractedTasks: [
              'No critical blockers for you right now.',
              'Check final group consensus before tomorrow.'
            ]
          };
        }
      } catch (err) {
        console.warn('Browser transformer execution failed, switching to distilled heuristics:', err);
      }
    }

    // Fallback: Built-in Distilled Sloth Heuristics (instant, 100% offline, zero-network)
    onProgress?.('Generating instant distilled sloth summary...', 90);
    await new Promise((r) => setTimeout(r, 450));

    const lines = trimmed.split('\n').filter(Boolean);
    const mentionsUrgent = /urgent|asap|deadline|emergency|call me|important/i.test(trimmed);
    const mentionsQuestion = /\?/.test(trimmed);

    const urgencyLevel: ChatTidierResult['urgencyLevel'] = mentionsUrgent 
      ? 'One Quick Action Needed' 
      : mentionsQuestion 
        ? 'Low Effort' 
        : 'Chill (Ignore)';

    return {
      twoLineBrief: `Your group exchanged ${lines.length} updates regarding coordination and next steps. Sloan analyzed the chatter: nobody is waiting on a blocker from your side right now.`,
      urgencyLevel,
      suggestedReplies: [
        'Awesome, looks solid to me! 🦥',
        'Got it! Taking care of my part soon.',
        'Thanks for pinging! I will review the final doc later today.'
      ],
      extractedTasks: mentionsQuestion
        ? ['Drop a 1-sentence confirmation when you feel like it.', 'Let the rest of the team iron out the details.']
        : ['Nothing required from you right now. Stay lazy.']
    };
  }

  // 2. VOICE RAMBLE TO TASK PLAN
  public async processVoiceRamble(
    transcript: string,
    provider: AIProvider,
    onProgress?: ModelProgressCallback
  ): Promise<VoiceRambleResult> {
    const clean = transcript.trim();
    if (!clean) throw new Error('No voice transcript provided.');

    if (provider === 'local-ollama') {
      try {
        onProgress?.('Structuring voice ramble with local Ollama...', 50);
        const prompt = `Convert this lazy, half-asleep voice ramble into a clean, structured list:
"${clean}"

Respond ONLY with valid JSON:
{
  "transcript": "${clean.replace(/"/g, '\\"')}",
  "cleansedIntent": "One clean sentence of what the user wants to get done.",
  "bulletItems": ["clean item 1", "clean item 2", "clean item 3"],
  "category": "Tasks" or "Groceries" or "Random Shower Thought" or "Work Note"
}`;
        const output = await this.queryOllama(prompt);
        const jsonMatch = output.match(/\{[\s\S]*\}/);
        if (jsonMatch) return JSON.parse(jsonMatch[0]);
      } catch (e) {
        console.warn('Ollama voice processing failed:', e);
      }
    }

    onProgress?.('Extracting clean action items with local sloth intelligence...', 85);
    await new Promise((r) => setTimeout(r, 400));

    // Smart heuristic parser
    const isGrocery = /milk|eggs|bread|apples|grocery|store|butter|buy|vegetables|snack|coffee/i.test(clean);
    const isWork = /email|bug|client|pr|review|deploy|meeting|boss|jira/i.test(clean);

    // Split sentences into actionable bullet points
    const rawChunks = clean.split(/[.,;!?]|\band\b|\balso\b/gi)
      .map((s) => s.trim())
      .filter((s) => s.length > 3);

    const bullets = rawChunks.length > 0
      ? rawChunks.slice(0, 5).map((item) => `• ${item.charAt(0).toUpperCase() + item.slice(1)}`)
      : ['• Review core thought', '• File away for later'];

    return {
      transcript: clean,
      cleansedIntent: `Streamlined ${rawChunks.length} disjointed thoughts into an organized sloth roadmap.`,
      bulletItems: bullets,
      category: isGrocery ? 'Groceries' : isWork ? 'Work Note' : 'Tasks'
    };
  }

  // 3. FRIDGE CHEF (FRIDGE TO FEAST)
  public async generateFridgeMeal(
    ingredientsInput: string,
    dietary: string,
    provider: AIProvider,
    onProgress?: ModelProgressCallback
  ): Promise<FridgeChefResult> {
    const raw = ingredientsInput.trim() || 'eggs, bread, butter, cheese, leftover rice';

    if (provider === 'local-ollama') {
      try {
        onProgress?.('Consulting local open-source chef...', 50);
        const prompt = `A user wants an ultra-lazy, minimal-effort 10-minute meal using only these leftover ingredients: "${raw}".
Dietary preferences: "${dietary || 'None'}".
No complicated cookware. Channel a sloth who hates washing dishes.

Respond ONLY with valid JSON:
{
  "recipeTitle": "Catchy Lazy Dish Name",
  "prepTimeMinutes": 10,
  "stepCount": 3,
  "ingredientsUsed": ["item 1", "item 2", "item 3"],
  "lazySteps": ["Step 1...", "Step 2...", "Step 3..."],
  "slothChefsTip": "A funny, ultra-lazy dishwashing or shortcut tip"
}`;
        const output = await this.queryOllama(prompt);
        const jsonMatch = output.match(/\{[\s\S]*\}/);
        if (jsonMatch) return JSON.parse(jsonMatch[0]);
      } catch (e) {
        console.warn('Ollama meal planning failed:', e);
      }
    }

    onProgress?.('Formulating 3-step zero-effort meal plan...', 85);
    await new Promise((r) => setTimeout(r, 450));

    const items = raw.split(/,|\n/).map((s) => s.trim()).filter(Boolean);
    const mainIngredient = items[0] || 'Leftovers';

    return {
      recipeTitle: `The "Zero-Dishes" ${mainIngredient} Sloth Skillet`,
      prepTimeMinutes: 8,
      stepCount: 3,
      ingredientsUsed: items.slice(0, 4),
      lazySteps: [
        `Toss ${items.slice(0, 2).join(' and ')} straight into a medium pan over medium heat. Do not bother cutting anything precisely.`,
        `Season with whatever salt, pepper, or sauce is within arm's reach. Let sizzle for 4 minutes without touching it.`,
        `Slide straight onto a plate (or eat directly from the pan like a champion to save washing a plate). You are done.`
      ],
      slothChefsTip: 'Use a paper towel as a placemat and eat with a single fork. Dishes saved: 4. Energy saved: maximum.'
    };
  }

  // 4. THE DREADED REPLY (PROCRASTINATION BREAKER)
  public async draftDreadedReply(
    dreadedMessage: string,
    tone: 'polite-delay' | 'warm-decline' | 'ultra-brief' | 'enthusiastic-delegate',
    provider: AIProvider,
    onProgress?: ModelProgressCallback
  ): Promise<DreadedReplyResult> {
    const raw = dreadedMessage.trim();

    if (provider === 'local-ollama') {
      try {
        onProgress?.('Drafting painless reply with local AI...', 50);
        const prompt = `The user has been putting off replying to this message for weeks:
"${raw}"

Draft a reply in the style of "${tone}". It must remove all guilt, be tactful, and require zero back-and-forth effort.

Respond ONLY with valid JSON:
{
  "tone": "${tone}",
  "draftReply": "The exact reply text ready to copy-paste",
  "whyItRelievesStress": "Why this completely solves the awkwardness in one stroke"
}`;
        const output = await this.queryOllama(prompt);
        const jsonMatch = output.match(/\{[\s\S]*\}/);
        if (jsonMatch) return JSON.parse(jsonMatch[0]);
      } catch (e) {
        console.warn('Ollama reply drafting failed:', e);
      }
    }

    onProgress?.('Crafting diplomatic anti-procrastination response...', 85);
    await new Promise((r) => setTimeout(r, 400));

    let draft = '';
    let why = '';

    switch (tone) {
      case 'polite-delay':
        draft = `Hi! Thanks so much for reaching out and for your patience. I've been heads-down catching up on high-priority items this week. I'll take a close look at this by Friday and circle back if anything is needed. Appreciate your understanding!`;
        why = 'Buys you a clean grace period without making you look disorganized.';
        break;
      case 'warm-decline':
        draft = `Hi there! Thank you for thinking of me with this. Unfortunately, my plate is completely full at the moment and I wouldn't be able to give it the time and attention it deserves. Wishing you all the best with it!`;
        why = 'A closed loop: polite, firm, and leaves no room for awkward follow-ups.';
        break;
      case 'ultra-brief':
        draft = `Thanks for sharing! Looks great from my end. Let's proceed as planned.`;
        why = '12 words. Total time spent: 4 seconds. Mental burden lifted immediately.';
        break;
      case 'enthusiastic-delegate':
        draft = `Thanks for this! This aligns well with the team's goals. I am looping in the group so we can move forward seamlessly.`;
        why = 'Hands off the hot potato smoothly while maintaining full goodwill.';
        break;
    }

    return {
      tone,
      draftReply: draft,
      whyItRelievesStress: why
    };
  }

  // 5. WIND-DOWN & SNOOZE COMPANION
  public async generateBedtimeStory(
    theme: string,
    provider: AIProvider,
    onProgress?: ModelProgressCallback
  ): Promise<BedtimeStoryResult> {
    const rawTheme = theme.trim() || 'A sleepy sloth in the misty Costa Rican cloud forest';

    if (provider === 'local-ollama') {
      try {
        onProgress?.('Generating ambient slow-cadence story...', 50);
        const prompt = `Write a soothing, slow-paced bedtime micro-story about: "${rawTheme}".
The sentences should be gentle, rhythmic, and hypnotic, helping the reader slow down their heart rate.

Respond ONLY with valid JSON:
{
  "title": "Gentle Story Title",
  "storyMarkdown": "3-4 paragraphs of soothing, tranquil prose",
  "breathingPacingSeconds": 8,
  "ambientRecommendation": "Brown Noise + Rain at 40% volume"
}`;
        const output = await this.queryOllama(prompt);
        const jsonMatch = output.match(/\{[\s\S]*\}/);
        if (jsonMatch) return JSON.parse(jsonMatch[0]);
      } catch (e) {
        console.warn('Ollama bedtime story failed:', e);
      }
    }

    onProgress?.('Synthesizing tranquil nocturnal narrative...', 80);
    await new Promise((r) => setTimeout(r, 500));

    return {
      title: 'The Canopy Lanterns of Monteverde',
      storyMarkdown: `The rainforest canopy does not hurry for anyone. High above the forest floor, Sloan nestled into the fork of an ancient cecropia tree, where the velvet moss had spent four hundred years growing into the shape of a pillow.

Below, the mist rolled through the broad leaves like warm silk. Each raindrop made a single, round note as it met the undergrowth — a steady, patient metronome that whispered to the earth that everything was already taken care of.

The evening breeze smelled of wild cedar and damp fern. Sloan blinked once, slowly, watching a single firefly weave a golden arc across the twilight. There was nowhere else to go. There was nothing left to accomplish today. The forest breathed in, held the cool night air, and let it go. And as the dark settled softly between the branches, sleep arrived like a warm blanket.`,
      breathingPacingSeconds: 8,
      ambientRecommendation: 'Forest Night Breeze + Rain (35% volume)'
    };
  }
}

export const openAiService = new OpenAIService();
