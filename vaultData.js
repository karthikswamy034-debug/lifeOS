// Pre-loaded realistic PDF knowledge vault content & utilities
export const INITIAL_FOLDERS = ['College', 'Career', 'Personal'];

export const INITIAL_DOCUMENTS = [
  {
    id: 'doc-os',
    name: 'Operating Systems.pdf',
    folder: 'College',
    size: '2.4 MB',
    pages: 42,
    uploadDate: '2026-09-15',
    tags: ['OS', 'Deadlock', 'Concurrency', 'Memory Paging'],
    summary: 'Comprehensive notes covering CPU scheduling algorithms, Process Synchronization, Deadlock conditions & Banker\'s Algorithm, and Virtual Memory management.',
    content: `
# OPERATING SYSTEMS COMPREHENSIVE LECTURE NOTES

## UNIT 1: PROCESS MANAGEMENT & SCHEDULING
A process is a program in execution. The Process Control Block (PCB) contains process state, program counter, CPU registers, CPU-scheduling information, memory-management information, accounting information, and I/O status.
- Context Switching: The process of saving the state of the current process and restoring the state of the new process. Overhead depends strictly on hardware support.
- CPU Scheduling Algorithms: First-Come First-Served (FCFS), Shortest Job First (SJF - optimal average waiting time), Round Robin (time quantum based), Priority Scheduling (can cause starvation, solved by aging).

## UNIT 2: PROCESS SYNCHRONIZATION & CRITICAL SECTION
The Critical Section Problem requires three conditions to be satisfied:
1. Mutual Exclusion: If process Pi is executing in its critical section, no other processes can execute in their critical sections.
2. Progress: If no process is executing in its critical section and there exist some processes wishing to enter, selection cannot be postponed indefinitely.
3. Bounded Waiting: A bound must exist on the number of times that other processes are allowed to enter their critical sections after a process has made a request to enter and before that request is granted.

- Semaphores: Integer variables accessed only through two standard atomic operations: wait() [P] and signal() [V]. Counting semaphores vs Binary semaphores (mutex).
- Classic Problems: Bounded-Buffer (Producer-Consumer) Problem, Readers-Writers Problem, Dining Philosophers Problem.

## UNIT 3: DEADLOCKS (CRITICAL TOPIC)
A deadlock is a situation where a set of processes are blocked because each process is holding a resource and waiting for another resource acquired by some other process.

### The Four Necessary and Sufficient Coffman Conditions for Deadlock:
1. Mutual Exclusion: At least one resource must be held in a non-shareable mode. Only one process can use the resource at any given time.
2. Hold and Wait: A process must be currently holding at least one resource and requesting additional resources that are being held by other processes.
3. No Preemption: Resources cannot be preempted; a resource can be released only voluntarily by the process holding it, after that process has completed its task.
4. Circular Wait: A closed chain of processes exists, such that each process holds at least one resource that is needed by the next process in the chain (P0 -> P1 -> P2 -> ... -> Pn -> P0).

### Deadlock Handling Strategies:
1. Deadlock Prevention: Negate one of the four necessary conditions. (e.g. impose a total ordering of all resource types to prevent circular wait).
2. Deadlock Avoidance: Requires the system to have prior information on resource requests. Banker's Algorithm uses Safe State analysis (Safe sequence: <P1, P3, P0, P2>).
3. Deadlock Detection and Recovery: Allow deadlocks to occur, detect via Resource Allocation Graph (RAG) cycle detection or Wait-For Graph, then recover by process termination or resource preemption.
4. Deadlock Ignorance: The Ostrich Algorithm (sticking your head in the sand), used by most modern general-purpose operating systems like Linux and Windows due to low frequency and high overhead of continuous detection.

## UNIT 4: MEMORY MANAGEMENT & VIRTUAL MEMORY
- Paging: Physical memory broken into fixed-sized frames; logical memory into fixed-sized pages. Page Table converts logical to physical addresses.
- Translation Lookaside Buffer (TLB): High-speed hardware associative cache to reduce memory access time from 2 cycles to near 1 cycle.
- Page Replacement Algorithms: FIFO, Optimal (Belady's anomaly free), LRU (Least Recently Used), Second-Chance (Clock).
- Thrashing: A state where the CPU spends more time paging than executing instructions because total working set exceeds physical memory.
    `,
    flashcards: [
      { q: 'What are the 4 Coffman conditions for deadlock?', a: '1. Mutual Exclusion\n2. Hold and Wait\n3. No Preemption\n4. Circular Wait' },
      { q: 'What is the difference between Deadlock Prevention and Avoidance?', a: 'Prevention eliminates at least one of the 4 Coffman conditions beforehand. Avoidance dynamically tests whether granting a resource request keeps the system in a "Safe State" (e.g. Banker\'s Algorithm).' },
      { q: 'What is Thrashing in Virtual Memory?', a: 'Thrashing occurs when high paging activity causes the CPU to spend more time swapping pages in and out than executing processes.' },
      { q: 'What is the purpose of the Translation Lookaside Buffer (TLB)?', a: 'It acts as an associative cache for the page table, drastically speeding up logical-to-physical address translation.' }
    ],
    examQuestions: [
      {
        question: 'Explain the four conditions necessary for a deadlock to occur and describe how Deadlock Prevention works.',
        marks: 10,
        hint: 'Detail Mutual Exclusion, Hold & Wait, No Preemption, and Circular Wait.'
      },
      {
        question: 'Apply Banker\'s Algorithm to determine if a system is in a safe state with Allocation, Max, and Available matrices.',
        marks: 10,
        hint: 'Calculate Need Matrix = Max - Allocation, then find safe execution sequence.'
      },
      {
        question: 'Compare FCFS, SJF, and Round Robin scheduling algorithms with regard to turnaround time and convoy effect.',
        marks: 8,
        hint: 'Mention SJF optimality and FCFS susceptibility to convoy effect.'
      }
    ]
  },
  {
    id: 'doc-dsa',
    name: 'DSA Notes.pdf',
    folder: 'College',
    size: '3.8 MB',
    pages: 58,
    uploadDate: '2026-09-18',
    tags: ['DSA', 'Algorithms', 'Trees', 'Graphs', 'Dynamic Programming'],
    summary: 'Core Data Structures and Algorithms revision guide. Covers Big-O complexity, Arrays, Binary Search Trees, Graph Traversals (BFS/DFS), Dijkstra, and DP patterns.',
    content: `
# DATA STRUCTURES & ALGORITHMS ADVANCED HANDBOOK

## 1. TIME & SPACE COMPLEXITY ANALYSIS
- Big-O Notation: Upper bound of runtime.
  - Constant: O(1) - Hash Map lookup, array index
  - Logarithmic: O(log n) - Binary Search, Balanced BST operations
  - Linear: O(n) - Array traversal
  - Linearithmic: O(n log n) - Merge Sort, Quick Sort (average), Heap Sort
  - Quadratic: O(n^2) - Bubble/Selection/Insertion Sort, nested loops
  - Exponential: O(2^n) - Recursive Fibonacci, Subsets generation

## 2. ARRAYS & TWO POINTERS / SLIDING WINDOW
- Two Pointers: Fast & Slow pointers for cycle detection (Floyd's Tortoise and Hare), opposite-end pointers for sorted array pair sum (Two Sum II).
- Sliding Window: Fixed size vs Dynamic size. Optimal for substring/subarray problems like Longest Substring Without Repeating Characters, Minimum Window Substring.

## 3. LINKED LISTS & REVERSAL
- Singly vs Doubly Linked Lists. Reversing a linked list iteratively in O(n) time and O(1) auxiliary space:
  prev = null, curr = head; while (curr) { next = curr.next; curr.next = prev; prev = curr; curr = next; } return prev;

## 4. TREES & BINARY SEARCH TREES (BST)
- Tree Traversals:
  - Inorder (Left, Root, Right) -> Yields sorted order for BST
  - Preorder (Root, Left, Right) -> Useful for tree serialization
  - Postorder (Left, Right, Root) -> Useful for deleting trees and bottom-up DP
  - Level-Order (BFS) -> Uses Queue
- Balanced Trees: AVL Trees (balance factor -1, 0, 1 with rotations), Red-Black Trees (guarantees O(log n) height).

## 5. GRAPHS: TRAVERSALS & SHORTEST PATHS
- Breadth-First Search (BFS): Queue-based, finds shortest path in unweighted graphs. Time: O(V + E).
- Depth-First Search (DFS): Stack/Recursion-based, detects cycles, topological sort, connected components. Time: O(V + E).
- Dijkstra's Algorithm: Greedy shortest path in weighted graphs with non-negative weights using Min-Heap. Time: O((V + E) log V).
- Topological Sort: Kahn's Algorithm (indegree array + queue) or DFS with post-order reversal. Valid only for Directed Acyclic Graphs (DAG).

## 6. DYNAMIC PROGRAMMING PATTERNS
- 0/1 Knapsack Pattern: Either include or exclude current item.
- Unbounded Knapsack: Coin Change, Rod Cutting.
- Longest Common Subsequence (LCS): String matching, edit distance.
- Longest Increasing Subsequence (LIS): O(n log n) via Patience Sorting with binary search.
    `,
    flashcards: [
      { q: 'What is the average and worst-case time complexity of QuickSort?', a: 'Average: O(n log n)\nWorst case: O(n²) (when pivot is repeatedly the smallest or largest element)' },
      { q: 'How does Floyd\'s Cycle Detection (Tortoise & Hare) work?', a: 'Slow pointer advances 1 step, fast pointer advances 2 steps. If a cycle exists, they must collide inside the cycle.' },
      { q: 'When should Dijkstra\'s algorithm NOT be used?', a: 'When the graph contains negative edge weights (use Bellman-Ford or Floyd-Warshall instead).' },
      { q: 'Why does BST Inorder traversal produce elements in sorted order?', a: 'Because Inorder visits Left subtree (< Root), then Root, then Right subtree (> Root).' }
    ],
    examQuestions: [
      {
        question: 'Explain Dijkstra\'s algorithm step-by-step and calculate the shortest paths from source vertex A.',
        marks: 10,
        hint: 'Use priority queue relaxation: if dist[u] + weight < dist[v] then update dist[v].'
      },
      {
        question: 'Solve the 0/1 Knapsack Problem using Dynamic Programming. Write both recurrence relation and bottom-up tabular approach.',
        marks: 10,
        hint: 'dp[i][w] = max(dp[i-1][w], val[i-1] + dp[i-1][w - wt[i-1]])'
      }
    ]
  },
  {
    id: 'doc-security',
    name: 'Cyber Security.pdf',
    folder: 'College',
    size: '1.9 MB',
    pages: 35,
    uploadDate: '2026-09-20',
    tags: ['Security', 'Cryptography', 'AES', 'OWASP'],
    summary: 'Network security fundamentals, symmetric vs asymmetric encryption, RSA mathematics, authentication protocols, and OWASP Top 10 vulnerabilities.',
    content: `
# CYBER SECURITY ESSENTIALS

## 1. THE CIA TRIAD
- Confidentiality: Protecting data from unauthorized viewing (Encryption, Access Control).
- Integrity: Ensuring data is accurate and untampered (Cryptographic Hashes like SHA-256, HMAC).
- Availability: Ensuring authorized users have reliable access (DDoS mitigation, Redundancy, Failover).

## 2. CRYPTOGRAPHY
- Symmetric Encryption: Single shared key for encryption and decryption (AES-256, ChaCha20). Fast, ideal for bulk data.
- Asymmetric Encryption: Key pair (Public key to encrypt, Private key to decrypt). RSA, Elliptic Curve Cryptography (ECC). Used for key exchange and digital signatures.
- Diffie-Hellman Key Exchange: Allows two parties to establish a shared secret over an insecure channel.

## 3. WEB APPLICATION SECURITY (OWASP TOP 10)
- SQL Injection (SQLi): Attackers insert malicious SQL queries via unvalidated user input. Prevention: Prepared Statements / Parameterized Queries.
- Cross-Site Scripting (XSS): Injecting client-side scripts into web pages viewed by other users (Stored, Reflected, DOM-based). Prevention: Context-aware output encoding and Content Security Policy (CSP).
- Cross-Site Request Forgery (CSRF): Trick user into executing unwanted actions on authenticated web app. Prevention: SameSite cookies, CSRF tokens.
    `,
    flashcards: [
      { q: 'What is the primary difference between AES and RSA?', a: 'AES is symmetric (same key for encrypt/decrypt, very fast). RSA is asymmetric (public key to encrypt, private key to decrypt, mathematically heavier).' },
      { q: 'How do Parameterized Queries prevent SQL Injection?', a: 'They treat user input strictly as data literals rather than executable SQL commands, preventing command injection.' }
    ],
    examQuestions: [
      {
        question: 'Explain the RSA algorithm with mathematical key generation, encryption, and decryption steps.',
        marks: 10,
        hint: 'p, q primes, n = p*q, phi(n) = (p-1)*(q-1), choose e coprime to phi, d = e^-1 mod phi.'
      }
    ]
  },
  {
    id: 'doc-resume',
    name: 'Resume.pdf',
    folder: 'Career',
    size: '420 KB',
    pages: 2,
    uploadDate: '2026-09-10',
    tags: ['Career', 'CV', 'Software Engineer', 'Full-Stack'],
    summary: 'Alex Mercer - Full Stack Software Engineer resume. Specialties in Java Spring Boot, React, Distributed Systems, Cloud Architecture, and Machine Learning integration.',
    content: `
# ALEX MERCER - SOFTWARE ENGINEER RESUME

- Email: alex.mercer.dev@lifeos.internal
- Portfolio: https://github.com/alex-lifeos
- Location: San Francisco, CA / Remote

## SUMMARY
Innovative Full-Stack Software Engineer with strong expertise in Java Spring Boot, React, High-Performance Microservices, and AI workflow automation. Passionate about building resilient distributed systems and ultra-clean user experiences.

## TECHNICAL SKILLS
- Languages: Java (17/21), TypeScript, JavaScript, Python, SQL, C++
- Frameworks & Libraries: Spring Boot 3, Spring Data JPA, React 18, Tailwind CSS, Framer Motion, Next.js
- Databases & Storage: PostgreSQL, Redis, MongoDB, AWS S3
- Cloud & DevOps: Docker, Kubernetes, AWS (EC2, ECS, Lambda), CI/CD GitHub Actions, Vercel

## EXPERIENCE
### Senior Full Stack Developer - Nexus Systems (2024 - Present)
- Designed and maintained high-throughput REST APIs in Java Spring Boot handling 20,000+ RPS.
- Architected AI document search engine utilizing vector embeddings and local LLM caching.
- Reduced frontend bundle size by 42% and achieved 99+ Lighthouse performance score.

### Software Engineer - Horizon Tech (2022 - 2024)
- Developed responsive React web applications with real-time WebSocket state management.
- Migrated monolithic database to sharded PostgreSQL cluster with zero downtime.

## EDUCATION
- B.S. in Computer Science - University of Technology (GPA: 3.9/4.0)
    `,
    flashcards: [
      { q: 'What is Alex\'s primary backend and frontend tech stack?', a: 'Java Spring Boot 3 and React 18 / TypeScript with Tailwind CSS.' },
      { q: 'What throughput was achieved at Nexus Systems?', a: '20,000+ requests per second on Spring Boot microservices.' }
    ],
    examQuestions: []
  },
  {
    id: 'doc-certificates',
    name: 'Certificates.pdf',
    folder: 'Career',
    size: '890 KB',
    pages: 4,
    uploadDate: '2026-08-25',
    tags: ['Career', 'Credentials', 'AWS', 'Java'],
    summary: 'Verified professional certifications including AWS Certified Solutions Architect and Oracle Certified Java Professional.',
    content: `
# PROFESSIONAL CERTIFICATIONS & CREDENTIALS

1. AWS Certified Solutions Architect - Associate
   - Credential ID: AWS-SAA-839219
   - Verification: Amazon Web Services Training & Certification
   - Skills: VPC peering, S3 lifecycle rules, ECS Fargate, DynamoDB, RDS Multi-AZ.

2. Oracle Certified Professional: Java SE 17 Developer
   - Credential ID: OCP-JAVA-99210
   - Verification: Oracle University
   - Skills: Concurrency, Virtual Threads, Stream API, Generics, Memory profiling.
    `,
    flashcards: [],
    examQuestions: []
  },
  {
    id: 'doc-goals',
    name: 'Goals.pdf',
    folder: 'Personal',
    size: '310 KB',
    pages: 3,
    uploadDate: '2026-09-01',
    tags: ['Personal', 'Milestones', 'Growth', 'Vision'],
    summary: '2026 Personal and Professional Vision roadmap. Focus areas: Engineering mastery, mental clarity, physical endurance, and intellectual independence.',
    content: `
# 2026 VISION & LIFE OS MILESTONES

## 1. ENGINEERING MASTERY
- Master System Design: Complete 50 architecture deep-dives (Distributed Caching, Event-Driven Messaging, Raft Consensus).
- Solve 300 LeetCode problems with focus on Medium/Hard Graph & DP patterns.
- Ship LifeOS to open-source community with 1,000+ stars.

## 2. HEALTH & ENDURANCE
- Run a Half Marathon (21 km) in under 1 hr 50 mins.
- Maintain consistent 4x weekly resistance training routine.
- Deep sleep average above 7.5 hours nightly.

## 3. INTELLECTUAL & MINDFULNESS
- Read 24 non-fiction books spanning philosophy, neuroscience, and macroeconomics.
- Daily 15-minute mindfulness breathwork meditation every morning before screen time.
    `,
    flashcards: [],
    examQuestions: []
  },
  {
    id: 'doc-plans',
    name: 'Plans.pdf',
    folder: 'Personal',
    size: '280 KB',
    pages: 2,
    uploadDate: '2026-09-05',
    tags: ['Personal', 'Routine', 'Productivity', 'Daily Plan'],
    summary: 'The Sovereign Day protocol: High-yield morning routine, 90-minute ultradian deep work blocks, and evening shutdown checklist.',
    content: `
# THE SOVEREIGN DAY PROTOCOL

## MORNING CADENCE (06:30 - 08:30)
1. 06:30 - Hydration (500ml water + electrolytes) & 15 mins sunlight exposure.
2. 07:00 - Physical Activation: Calisthenics or morning zone 2 run.
3. 07:45 - High-protein breakfast + green tea. Zero notification checks.

## DEEP WORK BLOCK 1 (09:00 - 11:30)
- Core High-Leverage Task: Algorithm practice, system architecture, or core Java programming.
- Phone in Do Not Disturb in another room. LifeOS ambient soundscapes enabled.

## REVISION & COLLABORATION BLOCK (14:00 - 17:00)
- College coursework, Operating Systems notes revision, and code reviews.

## EVENING SHUTDOWN (21:30 - 22:30)
- Review today's LifeOS productivity score.
- Set tomorrow's Top 3 Non-Negotiable Tasks.
- Screen off 45 minutes prior to sleep.
    `,
    flashcards: [],
    examQuestions: []
  }
];
