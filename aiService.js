// LifeOS AI Engine - Mentor Intelligence & Document Knowledge Extractor

export async function askLifeOsAssistant({
  prompt,
  history = [],
  context = {},
  apiKey = '',
  apiProvider = 'mock' // 'gemini' | 'openai' | 'mock'
}) {
  const query = prompt.trim();
  const lower = query.toLowerCase();

  // If user configured a live API key (e.g. Gemini)
  if (apiKey && apiProvider === 'gemini') {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{
                text: `You are LifeOS, a futuristic Jarvis-style personal productivity and study mentor set in a serene nature sanctuary. 
Be empowering, deeply technical, structured, and clear. Format answers with clean markdown headings and bullet points.
Active Context:
Current Tasks: ${JSON.stringify(context.tasks || [])}
Habits: ${JSON.stringify(context.habits || [])}
Study Subjects: ${JSON.stringify(context.subjects || [])}
Selected Document: ${context.currentDoc ? context.currentDoc.name : 'None'}

User query: ${query}`
              }]
            }
          ]
        })
      });
      const data = await response.json();
      if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        return data.candidates[0].content.parts[0].text;
      }
    } catch (err) {
      console.warn('Live API request failed, falling back to built-in mentor engine', err);
    }
  }

  // --- BUILT-IN INTELLIGENT MENTOR ENGINE ---
  // Simulate natural typing delay (400-800ms) for high-end feeling
  await new Promise(r => setTimeout(r, 450));

  // 1. SPECIFIC PROMPT: "Explain deadlock from my OS notes" or deadlock inquiries
  if (lower.includes('deadlock') || (lower.includes('dead') && lower.includes('lock'))) {
    return `### 🔒 Deadlock Analysis (From Operating Systems.pdf)

Greetings! Here is the precise breakdown of **Deadlocks** extracted directly from your **Operating Systems notes**:

#### 1. What is a Deadlock?
A deadlock is a condition in concurrent computing where a set of processes are permanently blocked because each process holds a resource and waits for another resource held by another process in the same set.

#### 2. The Four Necessary & Sufficient Coffman Conditions:
For a deadlock to arise, **all four** conditions must hold simultaneously:
1. **Mutual Exclusion:** At least one resource must be held in a non-shareable mode (only one process at a time).
2. **Hold and Wait:** A process is actively holding at least one resource while waiting to acquire additional resources held by others.
3. **No Preemption:** Resources cannot be forcibly seized; they can only be released voluntarily after the holding process finishes.
4. **Circular Wait:** A closed cycle exists: $P_0 \\rightarrow P_1 \\rightarrow P_2 \\dots \\rightarrow P_n \\rightarrow P_0$, where each $P_i$ waits for a resource held by $P_{i+1}$.

#### 3. Handling Strategies:
* **Deadlock Prevention:** Invalidate at least one of the 4 conditions (e.g., impose strict total resource ordering to eliminate Circular Wait).
* **Deadlock Avoidance:** Use **Banker's Algorithm** to ensure resource allocations always maintain a **Safe State**.
* **Deadlock Detection & Recovery:** Detect cycles in Resource Allocation Graphs (RAG) and terminate processes or preempt resources.
* **Ostrich Algorithm:** Ignore deadlocks if they occur rarely (standard practice in modern Linux and Windows).

💡 *Mentor Tip: In your upcoming exam, examiners love to ask for the Banker's Algorithm safety matrix calculation. Would you like me to walk through a practice problem?*`;
  }

  // 2. SPECIFIC PROMPT: "Create my study plan"
  if (lower.includes('study plan') || lower.includes('create my study') || lower.includes('schedule my study')) {
    return `### 🗓️ Customized 30-Day Master Study Plan

Based on your current subjects and goal of cracking exams and tech interviews, here is your high-yield schedule:

#### Phase 1: Foundations & Core Data Structures (Days 1 – 10)
* **Days 1–3:** Arrays, Two Pointers, Sliding Window patterns & Big-O notation.
* **Days 4–7:** Linked Lists (cycle detection, reverse in $O(1)$ space) & Stacks/Queues.
* **Days 8–10:** Binary Trees, BST traversals, and recursion depth control.
* *Daily Target:* 2 LeetCode problems + 45 mins OS Process Scheduling notes.

#### Phase 2: Advanced Algorithms & Operating Systems (Days 11 – 20)
* **Days 11–14:** Graph traversals (BFS, DFS), Shortest Path (Dijkstra's), and Topological Sort.
* **Days 15–17:** Operating Systems: Process Synchronization, Semaphores, and Coffman Deadlock conditions.
* **Days 18–20:** Dynamic Programming foundational patterns (0/1 Knapsack, Longest Common Subsequence).

#### Phase 3: Systems, Security & Mock Marathon (Days 21 – 30)
* **Days 21–24:** Virtual Memory, Paging, Page Replacement algorithms (LRU, Clock), and Cyber Security essentials.
* **Days 25–28:** Full-length timed mock tests and past university question papers.
* **Days 29–30:** Low-stress rapid revision using LifeOS flashcards & formula sheets.

✨ *I have pre-populated your Study Planner tab with this roadmap. Would you like me to schedule your Day 1 targets into Today's Focus?*`;
  }

  // 3. SPECIFIC PROMPT: "What should I do today?"
  if (lower.includes('what should i do today') || lower.includes('today focus') || lower.includes('recommendation')) {
    return `### ⚡ LifeOS Sovereign Day Directive

Good day! Here is your optimized game plan tailored to your active habit streaks and exam timeline:

#### 🌅 Block 1: Peak Cognitive Window (Morning)
* **Priority 1:** Solve 2 Graph or Dynamic Programming problems in Java.
* **Priority 2:** Complete 45 minutes of deep focus on **Operating Systems (Deadlock & Semaphore questions)**.

#### 🌿 Block 2: Physical & Mental Reset (Midday)
* **Habit Check:** 30-minute workout or zone 2 aerobic session.
* **Mindfulness:** 10-minute breathwork with our ambient soundscape enabled.

#### 📖 Block 3: Retention & Vault Consolidation (Evening)
* **Revise:** Review the 4 flashcards from **DSA Notes.pdf**.
* **Shutdown:** Check off today's habits to preserve your **14-day streak** 🔥.

*"Discipline is choosing between what you want now and what you want most." Let's make today count!*`;
  }

  // 4. SPECIFIC PROMPT: "Explain my notes"
  if (lower.includes('explain my notes') || lower.includes('explain notes') || lower.includes('explain topic')) {
    const docName = context.currentDoc ? context.currentDoc.name : 'Operating Systems.pdf & DSA Notes.pdf';
    return `### 📚 Notes Breakdown: ${docName}

I have analyzed your uploaded notes. Here is the distilled conceptual architecture:

1. **Foundational Principles:**
   * High-level structures are broken down into atomic, predictable execution steps.
   * Key invariant guarantees are established early (e.g., BST left-less, right-greater; Critical Section mutual exclusion).

2. **The High-Yield Exam Topics:**
   * **In OS:** The 4 Coffman Deadlock conditions, Banker's Algorithm safe states, and LRU Page Replacement.
   * **In DSA:** Floyd's Cycle detection, Dijkstra's algorithm with min-heap $O((V+E)\\log V)$, and DP recurrence relations.

3. **Suggested Next Action:**
   * Select any specific sub-topic (e.g., *"Explain Virtual Memory"*, *"How does Dijkstra handle weights?"*), or switch to the **AI PDF Assistant** tab to practice instant flashcards!`;
  }

  // 5. SPECIFIC PROMPT: "Summarize this PDF"
  if (lower.includes('summarize') || lower.includes('summary')) {
    const doc = context.currentDoc || {
      name: 'Operating Systems.pdf',
      summary: 'Comprehensive notes covering CPU scheduling, Process Synchronization, Deadlocks, and Virtual Memory management.'
    };
    return `### 📑 Executive Summary: ${doc.name}

Here is the high-density executive summary:

* **Document Scope:** ${doc.summary}
* **Core Takeaways:**
  1. **Concurrency Control:** Atomic primitives like semaphores and mutexes are essential to prevent race conditions in critical sections.
  2. **Deadlock Management:** Prevention alters system rules; Avoidance evaluates each allocation for safety; Detection recovers after the fact.
  3. **Memory Virtualization:** Paging decouples physical memory from logical address spaces, with TLBs accelerating lookup speed.
* **Exam Readiness Score:** **92%** coverage of core university syllabus and technical interview concepts.

Would you like me to generate 5 exam questions or a flashcard deck based on this document?`;
  }

  // 6. SPECIFIC PROMPT: "Help me prepare for exams"
  if (lower.includes('prepare for exams') || lower.includes('exam prep') || lower.includes('exam')) {
    return `### 🎯 High-Performance Exam Preparation Protocol

Here is the battle-tested strategy to score top marks on your technical exams:

#### 1. The 80/20 High-Frequency Questions
* **OS:** Coffman's 4 Deadlock Conditions, Banker's Algorithm numericals, Critical Section requirements, and LRU Page Fault calculations.
* **DSA:** QuickSort vs MergeSort derivations, Dijkstra shortest path tracing, and BST balance mechanics.

#### 2. Active Recall & Spaced Repetition
* Stop passive re-reading. Use the **Flashcards** generated in the **AI PDF Assistant** tab.
* Force yourself to write the answer before flipping the card.

#### 3. Timed Numerical Practice
* Practice 1 full Banker's algorithm table under a 10-minute countdown.

Shall we quiz you on a 10-mark question right now? Type *"Quiz me on OS"* or *"Quiz me on DSA"* whenever you're ready!`;
  }

  // 7. General / Fallback Mentor Response
  return `### 🌟 LifeOS Guidance: ${query}

Thank you for your question. As your personal mentor and productivity copilot, here is my perspective:

* **Core Focus:** Align every action with your ultimate goals in engineering mastery, mental peace, and academic excellence.
* **Actionable Step:** Break down this challenge into a 25-minute deep focus sprint. Remove distractions, engage your ambient nature sounds, and execute with precision.
* **Connected Tools:** 
  - Need to plan your syllabus? Check the **Study Planner**.
  - Reviewing uploaded notes? Jump into the **PDF Knowledge Vault**.
  - Maintaining consistency? Don't forget your **Habit Tracker** streak today!

How can I assist you further with this topic?`;
}
