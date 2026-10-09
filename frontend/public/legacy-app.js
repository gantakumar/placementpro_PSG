
// ═══════════════════════════════════════
// DATA — 8 COMPANIES
// ═══════════════════════════════════════
const COMPANIES = {
  TCS:{name:"Tata Consultancy Services",logo:"TCS",color:"#003366",accent:"#00b4d8",difficulty:"Medium",difBadge:"badge-gd",rounds:["Aptitude","Technical","Coding","HR"],desc:"India's largest IT company. Focus on numerical ability and logical reasoning.",package:"₹3.5–7 LPA",slots:450},
  Infosys:{name:"Infosys Limited",logo:"INF",color:"#007cc3",accent:"#f5a623",difficulty:"Medium-Hard",difBadge:"badge-or",rounds:["Aptitude","Technical","Coding","HR"],desc:"Global IT leader. Strong verbal, logical & analytical skills needed.",package:"₹3.6–8 LPA",slots:320},
  Wipro:{name:"Wipro Technologies",logo:"WIP",color:"#341c5c",accent:"#9b59b6",difficulty:"Easy-Medium",difBadge:"badge-gn",rounds:["Aptitude","Technical","HR"],desc:"Technology company focused on digital transformation and IT services.",package:"₹3.5–6.5 LPA",slots:280},
  Zoho:{name:"Zoho Corporation",logo:"ZOH",color:"#c0392b",accent:"#e67e22",difficulty:"Hard",difBadge:"badge-rd",rounds:["Aptitude","Technical","Coding","HR"],desc:"Product-based company with rigorous technical & programming rounds.",package:"₹5–12 LPA",slots:120},
  Amazon:{name:"Amazon India",logo:"AMZ",color:"#FF9900",accent:"#232F3E",difficulty:"Very Hard",difBadge:"badge-rd",rounds:["Aptitude","Technical","Coding","HR"],desc:"World's largest e-commerce & cloud company. Deep DSA & system design focus.",package:"₹8–25 LPA",slots:60},
  Microsoft:{name:"Microsoft India",logo:"MSF",color:"#00A4EF",accent:"#7FBA00",difficulty:"Very Hard",difBadge:"badge-rd",rounds:["Technical","Coding","HR"],desc:"Global tech giant. Requires strong CS fundamentals, DSA & problem solving.",package:"₹12–40 LPA",slots:40},
  Accenture:{name:"Accenture Technology",logo:"ACC",color:"#A100FF",accent:"#7B2FBE",difficulty:"Medium",difBadge:"badge-gd",rounds:["Aptitude","Technical","HR"],desc:"Global consulting & IT services. Focus on communication and tech skills.",package:"₹4.5–8 LPA",slots:200},
  Cognizant:{name:"Cognizant Technology",logo:"CTS",color:"#1a6eb5",accent:"#00a0e0",difficulty:"Easy-Medium",difBadge:"badge-gn",rounds:["Aptitude","Technical","HR"],desc:"Global IT services leader. Strong aptitude and basic technical knowledge needed.",package:"₹4–7 LPA",slots:250},
  HCL:{name:"HCL Technologies",logo:"HCL",color:"#0077C8",accent:"#00b4f0",difficulty:"Easy-Medium",difBadge:"badge-gn",rounds:["Aptitude","Technical","HR"],desc:"India's 4th largest IT company. Focus on problem solving, teamwork and communication.",package:"₹3.5–6 LPA",slots:380},
  Capgemini:{name:"Capgemini India",logo:"CAP",color:"#0070AD",accent:"#12ABDB",difficulty:"Medium",difBadge:"badge-gd",rounds:["Aptitude","Technical","Coding","HR"],desc:"French MNC with massive India operations. Values analytical thinking and adaptability.",package:"₹4–7.5 LPA",slots:300},
  IBM:{name:"IBM India",logo:"IBM",color:"#1F70C1",accent:"#4589ff",difficulty:"Medium-Hard",difBadge:"badge-or",rounds:["Aptitude","Technical","HR"],desc:"Global technology & consulting giant. Focus on cloud, AI and enterprise software.",package:"₹5–10 LPA",slots:150},
  LTI:{name:"LTIMindtree",logo:"LTI",color:"#E63312",accent:"#f97316",difficulty:"Medium",difBadge:"badge-gd",rounds:["Aptitude","Technical","Coding","HR"],desc:"Fast-growing IT company, merged entity of L&T Infotech and Mindtree. Strong DSA focus.",package:"₹4.5–9 LPA",slots:180}
};

// Preferred programming languages + required skills per company (shown on the
// student home page next to each company's full name).
const COMPANY_STACK = {
  TCS:       {langs:["C","C++","Java","Python","SQL"],           skills:["Quantitative Aptitude","Logical Reasoning","DBMS","OOPs","Communication"]},
  Infosys:   {langs:["Java","Python","C#","JavaScript","SQL"],   skills:["Verbal Ability","Pseudocode","DBMS","OS Basics","Problem Solving"]},
  Wipro:     {langs:["C","Java","Python","SQL"],                 skills:["Aptitude","OOPs","Networking","Essay Writing","Teamwork"]},
  Zoho:      {langs:["C","C++","Java","Python"],                 skills:["Data Structures","Algorithms","OOP Design","Debugging","Logical Puzzles"]},
  Amazon:    {langs:["Java","C++","Python","Go"],                skills:["Advanced DSA","System Design","AWS Basics","Leadership Principles","Complexity Analysis"]},
  Microsoft: {langs:["C#","C++","Java","Python","TypeScript"],   skills:["DSA","System Design","OS & Networks","Azure Basics","Problem Solving"]},
  Accenture: {langs:["Java","Python","JavaScript","SQL"],        skills:["Aptitude","Cloud Basics","DBMS","Communication","Consulting Mindset"]},
  Cognizant: {langs:["C","Java","Python","SQL"],                 skills:["Aptitude","OOPs","DBMS","Automata Coding","Communication"]},
  HCL:       {langs:["C","Java","Python","SQL"],                 skills:["Aptitude","Networking","OS Basics","Troubleshooting","Teamwork"]},
  Capgemini: {langs:["Java","Python","JavaScript","SQL"],        skills:["Pseudocode","Game-based Aptitude","DBMS","Cloud Basics","Analytical Thinking"]},
  IBM:       {langs:["Java","Python","Go","SQL"],                skills:["Cloud & AI Basics","DBMS","DSA","Cognitive Ability","Communication"]},
  LTI:       {langs:["Java","Python","C++","SQL"],               skills:["DSA","OOPs","DBMS","Aptitude","Communication"]}
};

// Small inline chips: "Languages" (accent-tinted) + "Skills" (neutral).
function stackChips(key,co,opts){
  const st=COMPANY_STACK[key];if(!st)return '';
  const size=(opts&&opts.small)?'9px':'10px';
  const lang=st.langs.map(l=>`<span class="stack-chip stack-lang" style="font-size:${size};border-color:${co.accent}55;color:${co.accent};background:${co.accent}14">${l}</span>`).join('');
  const skill=st.skills.map(s=>`<span class="stack-chip stack-skill" style="font-size:${size}">${s}</span>`).join('');
  return `<div class="stack-row"><span class="stack-label">💻 Languages</span>${lang}</div>
  <div class="stack-row"><span class="stack-label">🎯 Skills</span>${skill}</div>`;
}

const COMPANY_QUESTIONS = {
  TCS:[
    {cat:"Aptitude",q:"If 6 workers can do a job in 10 days, how many workers needed in 3 days?",a:"20 workers. 6×10 = W×3 → W = 20.",diff:"Easy"},
    {cat:"Aptitude",q:"A train 250m long passes a pole in 10 seconds. Speed?",a:"25 m/s = 90 km/h. Speed = distance/time = 250/10.",diff:"Easy"},
    {cat:"Technical",q:"What is the difference between TCP and UDP?",a:"TCP is connection-oriented, reliable. UDP is connectionless, faster but unreliable.",diff:"Medium"},
    {cat:"Technical",q:"Explain ACID properties in databases.",a:"Atomicity, Consistency, Isolation, Durability — ensures reliable DB transactions.",diff:"Medium"},
    {cat:"Technical",q:"What is a deadlock? How is it prevented?",a:"Deadlock = processes waiting for each other indefinitely. Prevent via ordering, timeout, banker's algorithm.",diff:"Hard"},
    {cat:"Coding",q:"Find the second largest element in an array.",a:"Traverse once keeping track of max and second max. O(n) time, O(1) space.",diff:"Medium"},
    {cat:"Coding",q:"Detect a cycle in a linked list.",a:"Floyd's cycle detection (slow/fast pointer). If they meet, cycle exists.",diff:"Medium"},
    {cat:"HR",q:"Why do you want to join TCS?",a:"Highlight TCS's scale, global exposure, TCS iON, Digital programs.",diff:"Easy"},
    {cat:"HR",q:"Where do you see yourself in 5 years?",a:"Talk about skill growth, leadership aspirations aligned with TCS.",diff:"Easy"}
  ],
  Infosys:[
    {cat:"Aptitude",q:"Clock shows 3:00. Angle between hour and minute hand?",a:"90 degrees.",diff:"Easy"},
    {cat:"Aptitude",q:"Two pipes fill a tank in 12 and 15 hours together?",a:"20/3 ≈ 6.67 hours. 1/12 + 1/15 = 9/60 = 3/20.",diff:"Medium"},
    {cat:"Technical",q:"Abstract class vs interface in Java?",a:"Abstract class can have method implementations; interface only abstract methods (pre-Java 8).",diff:"Medium"},
    {cat:"Technical",q:"Explain database normalization.",a:"1NF (atomic values), 2NF (no partial dependency), 3NF (no transitive dependency).",diff:"Medium"},
    {cat:"Coding",q:"Check if a string is a pangram.",a:"A pangram contains every alphabet letter. Check set(s.lower()) covers a–z.",diff:"Easy"},
    {cat:"Coding",q:"Implement a stack using queues.",a:"Two queues — push to Q1, for pop dequeue all to Q2 except last element.",diff:"Hard"},
    {cat:"HR",q:"Describe a time you faced team conflict.",a:"Use STAR method. Emphasize communication, compromise, positive outcome.",diff:"Easy"}
  ],
  Wipro:[
    {cat:"Aptitude",q:"What percentage of 450 is 90?",a:"20%. (90/450)×100.",diff:"Easy"},
    {cat:"Aptitude",q:"Next in series: 2, 6, 12, 20, 30, ?",a:"42. Pattern: n(n+1). Differences: 4,6,8,10,12.",diff:"Medium"},
    {cat:"Technical",q:"What is polymorphism?",a:"One interface, multiple implementations. Overloading (compile-time) and overriding (runtime).",diff:"Medium"},
    {cat:"Technical",q:"What is a RESTful API?",a:"REST uses HTTP methods (GET, POST, PUT, DELETE) on resources identified by URLs.",diff:"Medium"},
    {cat:"Coding",q:"Reverse a linked list.",a:"Keep prev, curr, next pointers. At each step: next=curr.next, curr.next=prev, prev=curr.",diff:"Medium"},
    {cat:"HR",q:"Strengths and weaknesses?",a:"Give specific strength with example; weakness + what you're doing to improve.",diff:"Easy"}
  ],
  Zoho:[
    {cat:"Aptitude",q:"A and B complete work in 20 and 30 days. Together?",a:"12 days. 1/20 + 1/30 = 5/60 = 1/12.",diff:"Easy"},
    {cat:"Technical",q:"Process vs Thread?",a:"Process: independent memory. Thread: lightweight, shares memory within a process.",diff:"Medium"},
    {cat:"Technical",q:"Binary search tree properties?",a:"left < root < right. Operations: O(log n) average, O(n) worst.",diff:"Medium"},
    {cat:"Coding",q:"All permutations of a string.",a:"Recursive backtracking: fix first char, permute rest. Heap's algorithm for efficiency.",diff:"Hard"},
    {cat:"Coding",q:"Implement LRU Cache.",a:"HashMap + Doubly Linked List. O(1) get/put. Move accessed node to front.",diff:"Hard"},
    {cat:"Coding",q:"Two numbers summing to a target.",a:"HashSet: for each num check if (target-num) in set. O(n) time, O(n) space.",diff:"Medium"},
    {cat:"HR",q:"Why Zoho over service-based companies?",a:"Product culture, ownership, building real products, technical depth, innovation.",diff:"Easy"}
  ],
  Amazon:[
    {cat:"Technical",q:"What is the Leadership Principle 'Customer Obsession'?",a:"Start from customer and work backwards. Prioritize long-term customer trust over short-term profit.",diff:"Easy"},
    {cat:"Technical",q:"Explain CAP theorem.",a:"Consistency, Availability, Partition Tolerance — distributed systems can guarantee only 2 of 3.",diff:"Hard"},
    {cat:"Technical",q:"What is eventual consistency?",a:"System will eventually converge to a consistent state after writes stop. Used in DynamoDB, S3.",diff:"Hard"},
    {cat:"Coding",q:"Find the kth largest element in an array.",a:"Use a min-heap of size k. Iterate array — if element > heap.top(), replace. O(n log k).",diff:"Hard"},
    {cat:"Coding",q:"Merge K sorted linked lists.",a:"Use a min-heap of size K. Extract min, push next node. O(n log k) time.",diff:"Hard"},
    {cat:"Coding",q:"LRU Cache implementation.",a:"OrderedDict in Python or HashMap + DLL. O(1) get/put operations.",diff:"Hard"},
    {cat:"HR",q:"Tell me about a time you failed.",a:"Use STAR. Be honest, explain what you learned and how you improved.",diff:"Easy"},
    {cat:"HR",q:"Describe a time you took ownership.",a:"Highlight an instance where you went beyond your role to solve a problem.",diff:"Easy"}
  ],
  Microsoft:[
    {cat:"Technical",q:"Difference between process and thread in OS?",a:"Process: independent execution unit with own memory. Thread: lightweight, shares process memory. Context switch faster for threads.",diff:"Medium"},
    {cat:"Technical",q:"What is virtual memory?",a:"Extends RAM using disk space via paging/swapping. Allows programs larger than physical RAM.",diff:"Medium"},
    {cat:"Technical",q:"Explain object-oriented design principles (SOLID).",a:"Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion.",diff:"Hard"},
    {cat:"Coding",q:"Serialize and deserialize a binary tree.",a:"BFS or DFS traversal with null markers. Reconstruct using queue from serialized string.",diff:"Hard"},
    {cat:"Coding",q:"Find all paths in a matrix from top-left to bottom-right.",a:"DFS/backtracking with directions right and down. Track path array.",diff:"Hard"},
    {cat:"Coding",q:"Longest common subsequence.",a:"2D DP table. dp[i][j] = dp[i-1][j-1]+1 if match, else max(dp[i-1][j], dp[i][j-1]).",diff:"Hard"},
    {cat:"HR",q:"Why Microsoft?",a:"Mission (empower every person), culture of growth mindset, Azure + AI innovation.",diff:"Easy"}
  ],
  Accenture:[
    {cat:"Aptitude",q:"If A is 2 years older than B and B is 3 years older than C, and C is 20, how old is A?",a:"25. C=20, B=23, A=25.",diff:"Easy"},
    {cat:"Aptitude",q:"A cube of side 4 cm is painted. Cut into 1cm cubes. How many have exactly 1 face painted?",a:"24 cubes (6 faces × 4 cubes per face center).",diff:"Medium"},
    {cat:"Technical",q:"What is cloud computing? Name 3 types.",a:"Delivering computing services via internet. Types: IaaS (EC2), PaaS (Heroku), SaaS (Gmail).",diff:"Easy"},
    {cat:"Technical",q:"What is Agile methodology?",a:"Iterative development in sprints. Key values: working software, customer collaboration, responding to change.",diff:"Easy"},
    {cat:"Coding",q:"Count vowels and consonants in a string.",a:"Loop through string, check if each character is in 'aeiou' for vowels, else consonant.",diff:"Easy"},
    {cat:"HR",q:"Why Accenture?",a:"Emphasize scale, exposure to global clients, technology + consulting combination, learning culture.",diff:"Easy"}
  ],
  Cognizant:[
    {cat:"Aptitude",q:"Find the missing number: 3, 7, 13, 21, 31, ?",a:"43. Differences: 4, 6, 8, 10, 12 (increasing by 2).",diff:"Easy"},
    {cat:"Aptitude",q:"A shopkeeper buys at ₹200, sells at ₹250. Profit %?",a:"25%. Profit = 50, % = (50/200)×100.",diff:"Easy"},
    {cat:"Technical",q:"What is the difference between GET and POST?",a:"GET retrieves data (params in URL), POST sends data (params in body). GET is idempotent.",diff:"Easy"},
    {cat:"Technical",q:"What is normalization? Why is it important?",a:"Reduces data redundancy and improves integrity. 1NF, 2NF, 3NF, BCNF.",diff:"Medium"},
    {cat:"Coding",q:"Find duplicates in an array.",a:"Use HashSet: traverse array, if element exists in set it's a duplicate. O(n) time.",diff:"Easy"},
    {cat:"Coding",q:"Fibonacci using memoization.",a:"Store computed values in a dictionary/array. fib(n) = fib(n-1)+fib(n-2), fib(0)=0, fib(1)=1.",diff:"Medium"},
    {cat:"HR",q:"Introduce yourself.",a:"Cover background, education, skills, projects, and why you chose Cognizant.",diff:"Easy"}
  ],
  HCL:[
    {cat:"Aptitude",q:"A sum of ₹12,000 is invested at 10% per annum simple interest for 3 years. What is the amount?",a:"₹15,600. SI = 12000×10×3/100 = ₹3600. Amount = 12000+3600.",diff:"Easy"},
    {cat:"Aptitude",q:"In a class, 40% are girls. If there are 24 girls, how many boys are there?",a:"36 boys. 24 = 40% of total → total = 60. Boys = 60 - 24 = 36.",diff:"Easy"},
    {cat:"Aptitude",q:"Find the next term: 1, 4, 9, 16, 25, ?",a:"36. The series is n². 6² = 36.",diff:"Easy"},
    {cat:"Technical",q:"What is OOPS? Name the four pillars.",a:"Object-Oriented Programming. Pillars: Encapsulation, Inheritance, Polymorphism, Abstraction.",diff:"Easy"},
    {cat:"Technical",q:"What is a pointer in C? Give an example.",a:"A pointer stores the memory address of another variable. Example: int *p = &x; stores address of x.",diff:"Medium"},
    {cat:"Technical",q:"Difference between compiler and interpreter?",a:"Compiler translates entire code at once (C, Java). Interpreter translates line by line (Python, JS).",diff:"Easy"},
    {cat:"Coding",q:"Write a program to count occurrences of each character in a string.",a:"Use a HashMap/dictionary. Iterate string, increment count for each character.",diff:"Easy"},
    {cat:"HR",q:"Why HCL?",a:"Highlight HCL's product engineering focus, global scale, learning opportunities, and SuperGeek program.",diff:"Easy"},
    {cat:"HR",q:"Are you comfortable with relocation?",a:"Be positive. Mention flexibility and willingness to adapt to new environments.",diff:"Easy"}
  ],
  Capgemini:[
    {cat:"Aptitude",q:"If 8 men can build a wall in 12 days, how many men are needed to build it in 6 days?",a:"16 men. 8×12 = M×6 → M = 16.",diff:"Easy"},
    {cat:"Aptitude",q:"A car travels 120 km at 60 km/h and returns at 40 km/h. Average speed for whole journey?",a:"48 km/h. Total distance = 240 km. Total time = 2+3 = 5 hrs. Avg = 240/5.",diff:"Medium"},
    {cat:"Aptitude",q:"The ratio of milk to water is 3:2 in 20 liters. How much water to add to make it 3:4?",a:"8 liters. Milk = 12L, Water = 8L. For 3:4, water needed = 16L. Add 16-8 = 8L.",diff:"Medium"},
    {cat:"Technical",q:"What is cloud computing? Explain IaaS, PaaS, SaaS.",a:"Delivering computing via internet. IaaS: raw infrastructure (AWS EC2). PaaS: development platform (Heroku). SaaS: ready software (Gmail).",diff:"Easy"},
    {cat:"Technical",q:"What is a microservice architecture?",a:"Application built as small independent services communicating via APIs. Each service has its own DB and can be deployed independently.",diff:"Medium"},
    {cat:"Technical",q:"Explain SDLC phases.",a:"Software Development Life Cycle: Planning → Analysis → Design → Implementation → Testing → Deployment → Maintenance.",diff:"Easy"},
    {cat:"Coding",q:"Check if a number is prime.",a:"Iterate from 2 to sqrt(n). If any number divides evenly, not prime. O(sqrt n) time.",diff:"Easy"},
    {cat:"Coding",q:"Find the maximum subarray sum (Kadane's Algorithm).",a:"Track current_max and global_max. For each element: current_max = max(num, current_max+num). O(n) time.",diff:"Medium"},
    {cat:"HR",q:"What are your salary expectations?",a:"Research market rate, give a range based on skills and experience, express flexibility.",diff:"Easy"},
    {cat:"HR",q:"Why Capgemini?",a:"Emphasize Capgemini's global presence, tech + consulting, innovation labs and learning culture.",diff:"Easy"}
  ],
  IBM:[
    {cat:"Aptitude",q:"If 30% of a number is 90, what is 50% of that number?",a:"150. 30% of N = 90 → N = 300. 50% of 300 = 150.",diff:"Easy"},
    {cat:"Aptitude",q:"A boat travels 20 km upstream in 4 hours and 20 km downstream in 2 hours. Speed of boat in still water?",a:"7.5 km/h. Upstream = 5 km/h, Downstream = 10 km/h. Still water = (5+10)/2 = 7.5.",diff:"Medium"},
    {cat:"Technical",q:"What is Blockchain? How does it work?",a:"Decentralized distributed ledger where data is stored in blocks linked chronologically using cryptography. Immutable and transparent.",diff:"Medium"},
    {cat:"Technical",q:"What is the difference between SQL and NoSQL?",a:"SQL: structured, relational, ACID compliant (MySQL, PostgreSQL). NoSQL: flexible schema, scalable, eventual consistency (MongoDB, Cassandra).",diff:"Medium"},
    {cat:"Technical",q:"Explain DevOps and its key principles.",a:"DevOps bridges dev and ops teams. Key principles: CI/CD, automation, collaboration, monitoring, infrastructure as code.",diff:"Medium"},
    {cat:"Technical",q:"What is containerization? Docker vs VM?",a:"Containers package app + dependencies without full OS. Docker: lightweight, shared OS kernel. VM: heavy, full OS per instance.",diff:"Medium"},
    {cat:"Coding",q:"Implement binary search.",a:"Compare middle element with target. If equal: found. If less: search right half. If more: search left half. O(log n).",diff:"Easy"},
    {cat:"Coding",q:"Find all subsets of a set.",a:"Power set has 2^n subsets. Use bit masking or recursive backtracking. For n elements, generate all 2^n combinations.",diff:"Hard"},
    {cat:"HR",q:"Why IBM?",a:"Mention IBM's innovation legacy, AI/cloud focus (Watson, IBM Cloud), research culture, and consulting expertise.",diff:"Easy"},
    {cat:"HR",q:"Describe a situation where you showed initiative.",a:"Use STAR method. Describe a problem you spotted independently and the steps you took to solve it.",diff:"Easy"}
  ],
  LTI:[
    {cat:"Aptitude",q:"In how many ways can 5 people sit in a row?",a:"120 ways. 5! = 5×4×3×2×1 = 120.",diff:"Easy"},
    {cat:"Aptitude",q:"If the cost price is ₹1500 and loss is 10%, what is selling price?",a:"₹1350. SP = CP × (1 - loss%) = 1500 × 0.9 = 1350.",diff:"Easy"},
    {cat:"Technical",q:"What is REST vs SOAP?",a:"REST: lightweight, uses HTTP, JSON/XML, stateless. SOAP: protocol-heavy, XML only, built-in security. REST is preferred for modern web APIs.",diff:"Medium"},
    {cat:"Technical",q:"What is a design pattern? Name three.",a:"Reusable solution to common software problems. Examples: Singleton (single instance), Factory (object creation), Observer (event handling).",diff:"Medium"},
    {cat:"Technical",q:"What is JVM and how does Java achieve platform independence?",a:"JVM (Java Virtual Machine) interprets bytecode. Java compiles to .class bytecode, run on any platform with JVM. WORA: Write Once Run Anywhere.",diff:"Medium"},
    {cat:"Coding",q:"Detect if a linked list is a palindrome.",a:"Find middle using slow/fast pointers, reverse second half, compare both halves. Restore list. O(n) time, O(1) space.",diff:"Hard"},
    {cat:"Coding",q:"Find the longest increasing subsequence.",a:"Use DP: dp[i] = length of LIS ending at index i. For each j<i, if arr[j]<arr[i]: dp[i] = max(dp[i], dp[j]+1). O(n²) or O(n log n).",diff:"Hard"},
    {cat:"Coding",q:"Implement a queue using two stacks.",a:"Stack1 for enqueue. For dequeue: if Stack2 empty, pop all from Stack1 to Stack2, then pop from Stack2.",diff:"Medium"},
    {cat:"HR",q:"Why LTIMindtree?",a:"Highlight the merged entity's combined strength, product + service mix, Mindtree's innovation + LTI's engineering depth.",diff:"Easy"},
    {cat:"HR",q:"How do you handle tight deadlines?",a:"Prioritize tasks, communicate proactively, break work into milestones, avoid perfectionism for non-critical items.",diff:"Easy"}
  ]
};

const QBANK = {
  Aptitude:[
    {id:1,text:"A train travels 360 km in 4 hours. Speed in m/s?",opts:["20 m/s","25 m/s","22.5 m/s","30 m/s"],ans:1,exp:"90 km/h = 90×1000/3600 = 25 m/s"},
    {id:2,text:"15 workers complete a job in 12 days. 20 workers take?",opts:["8 days","9 days","10 days","11 days"],ans:1,exp:"15×12 = 20×d → d = 9"},
    {id:3,text:"Pipe fills tank in 6 hrs, another empties in 8 hrs. Both open: fill time?",opts:["20 hrs","24 hrs","18 hrs","30 hrs"],ans:1,exp:"Net = 1/6 − 1/8 = 1/24 → 24 hours"},
    {id:4,text:"Odd one out: 2, 5, 10, 17, 26, 37, 50, 64",opts:["37","50","64","26"],ans:2,exp:"Series is n²+1. 8²+1=65, not 64"},
    {id:5,text:"Simple interest on ₹8000 for 3 years at 5% p.a.?",opts:["₹1000","₹1200","₹1500","₹800"],ans:1,exp:"SI = 8000×5×3/100 = ₹1200"},
    {id:6,text:"Sell at 20% profit. Cost ₹500. SP is?",opts:["₹550","₹600","₹580","₹620"],ans:1,exp:"SP = 500 + 100 = ₹600"},
    {id:7,text:"Two numbers ratio 3:5, LCM 75. Sum?",opts:["32","40","45","50"],ans:1,exp:"15+25 = 40"},
    {id:8,text:"987×987 + 987×13 + 13×13 = ?",opts:["990000","1000000","980100","990100"],ans:1,exp:"(987+13)² = 1,000,000"},
    {id:9,text:"Avg of 5 numbers = 20. Remove one, avg = 18. Removed?",opts:["28","26","30","24"],ans:0,exp:"100 − 72 = 28"},
    {id:10,text:"Car covers 1/4 at 40 km/h, rest at 60 km/h. Avg speed?",opts:["48 km/h","50 km/h","52 km/h","54 km/h"],ans:1,exp:"Weighted harmonic ≈ 50 km/h"}
  ],
  Technical:[
    {id:1,text:"Which data structure uses LIFO?",opts:["Queue","Stack","Linked List","Tree"],ans:1,exp:"Stack: Last In, First Out"},
    {id:2,text:"Time complexity of Binary Search?",opts:["O(n)","O(log n)","O(n²)","O(1)"],ans:1,exp:"Halves space each step"},
    {id:3,text:"SQL command to retrieve data?",opts:["INSERT","UPDATE","SELECT","DELETE"],ans:2,exp:"SELECT queries data"},
    {id:4,text:"Encapsulation in OOP means?",opts:["Inheriting","Binding data & methods","Overriding","Creating objects"],ans:1,exp:"Bundles data with methods"},
    {id:5,text:"HTTP stands for?",opts:["HyperText Transfer Protocol","High Transfer Text","HyperText Transform","None"],ans:0,exp:"HyperText Transfer Protocol"},
    {id:6,text:"O(n log n) worst-case sort?",opts:["Bubble Sort","Quick Sort","Merge Sort","Insertion Sort"],ans:2,exp:"Merge Sort is always O(n log n)"},
    {id:7,text:"Foreign key in databases?",opts:["Primary key same table","References PK of another table","Index key","Unique key"],ans:1,exp:"Establishes table relationships"},
    {id:8,text:"CSS stands for?",opts:["Computer Style Sheets","Cascading Style Sheets","Creative Style Sheets","Colorful Style Sheets"],ans:1,exp:"Cascading Style Sheets"},
    {id:9,text:"NOT a JavaScript data type?",opts:["String","Boolean","Character","Undefined"],ans:2,exp:"JavaScript has no 'Character'"},
    {id:10,text:"Polymorphism means?",opts:["Single form","Multiple forms","No form","Abstract form"],ans:1,exp:"Poly=many, morph=forms"}
  ],
  Coding:[
    {id:1,text:"Write a function to reverse a string.",lang:"javascript",starter:`function reverseString(str) {\n  // Your solution here\n  \n}\nconsole.log(reverseString("hello")); // "olleh"`,hint:"Use .split('').reverse().join('')"},
    {id:2,text:"Write a function for factorial of n (handle n=0).",lang:"javascript",starter:`function factorial(n) {\n  // Your solution here\n  \n}\nconsole.log(factorial(5)); // 120\nconsole.log(factorial(0)); // 1`,hint:"Recursion: n * factorial(n-1), base case n<=1 returns 1"},
    {id:3,text:"Check if a string is a palindrome.",lang:"javascript",starter:`function isPalindrome(str) {\n  // Your solution here\n  \n}\nconsole.log(isPalindrome("racecar")); // true\nconsole.log(isPalindrome("hello")); // false`,hint:"Compare string with its reverse"}
  ],
  HR:[
    {id:1,text:"Tell me about yourself and your college journey.",placeholder:"Describe your background, skills, projects, and goals..."},
    {id:2,text:"Where do you see yourself in 5 years?",placeholder:"Describe career aspirations and professional growth..."},
    {id:3,text:"Why do you want to join this company?",placeholder:"Mention reasons aligned with company values and products..."},
    {id:4,text:"Describe a challenging situation you overcame.",placeholder:"Use STAR method: Situation, Task, Action, Result..."},
    {id:5,text:"Greatest strengths and weaknesses?",placeholder:"Be honest, back strengths with examples..."}
  ]
};

const EXAM_META = {
  Aptitude:{duration:30*60,label:"30 mins · 10 MCQs"},
  Technical:{duration:45*60,label:"45 mins · 10 MCQs"},
  Coding:{duration:60*60,label:"60 mins · 3 Problems"},
  HR:{duration:20*60,label:"20 mins · 5 Questions"}
};

const DEFAULT_EXPERIENCES = [
  {name:"Rahul Verma",company:"TCS",role:"Software Engineer",package:"6.5 LPA",avatar:"R",quote:"PlacementPro's aptitude section was spot-on with TCS questions. I practiced 3-4 tests daily and cracked it in the first attempt!",tips:["Focus on time management in aptitude","Practice verbal reasoning daily","TCS values communication skills in HR"],placed:"December 2024"},
  {name:"Priya Nair",company:"Infosys",role:"Systems Engineer",package:"4.2 LPA",avatar:"P",quote:"The technical question bank was incredibly helpful. I reviewed all DBMS and OOP concepts through the platform.",tips:["DBMS normalization is frequently asked","Know your resume projects","Infosys HR is very detailed — prepare STAR stories"],placed:"January 2025"},
  {name:"Aman Singh",company:"Zoho",role:"Software Developer",package:"8 LPA",avatar:"A",quote:"Zoho had 5 technical rounds. PlacementPro's coding section helped me think algorithmically.",tips:["Data structures are heavily tested","Write clean readable code","Zoho values problem-solving over bookish knowledge"],placed:"November 2024"},
  {name:"Sneha Reddy",company:"Wipro",role:"Project Engineer",package:"3.8 LPA",avatar:"S",quote:"Wipro's process was streamlined. I used PlacementPro for aptitude prep and the HR question bank was super helpful.",tips:["Wipro focuses on verbal ability","Be confident in HR round","Know basics of cloud and agile"],placed:"February 2025"},
  {name:"Karthik M",company:"Amazon",role:"SDE-1",package:"18 LPA",avatar:"K",quote:"Amazon's OA had hard DSA problems. PlacementPro's coding section prepared me well, and I solved 100+ LeetCode alongside.",tips:["Strong DSA is non-negotiable for Amazon","Study leadership principles deeply","System design basics matter in final rounds"],placed:"March 2025"},
  {name:"Divya Sharma",company:"Accenture",role:"Associate SE",package:"5.5 LPA",avatar:"D",quote:"Accenture's process was smooth. The aptitude and communication rounds were well-covered in PlacementPro.",tips:["Focus on communication skills","Accenture values teamwork stories","Basic cloud knowledge is a plus"],placed:"February 2025"}
];

// ═══════════════════════════════════════
// API CONFIG  &  STORAGE HELPERS
// ═══════════════════════════════════════

// ▸ Points at the new Express + MongoDB backend (see backend/server.js).
//   Override with REACT_APP_API_BASE in frontend/.env if needed.
const API_BASE = (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_BASE)
  ? process.env.REACT_APP_API_BASE
  : 'https://placementpro-psg-hud1.vercel.app/api';

// ── Token helpers (localStorage only stores the session token) ─
function getToken(){ return localStorage.getItem('pp_token'); }
function setToken(t){ localStorage.setItem('pp_token', t); }
function clearToken(){ localStorage.removeItem('pp_token'); }

// ── Generic API call ──────────────────────────────────────────
async function api(endpoint, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['X-Token'] = token;
  try {
    const res = await fetch(API_BASE + endpoint, {
      headers,
      ...options,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
    const data = await res.json();
    return data;
  } catch (e) {
    return { success: false, message: 'Network error: ' + e.message };
  }
}

// ── Experience helpers (kept local for simplicity) ────────────
function getExperiences(){return JSON.parse(localStorage.getItem('pp_experiences')||JSON.stringify(DEFAULT_EXPERIENCES));}
function saveExperiences(e){localStorage.setItem('pp_experiences',JSON.stringify(e));}

// ── Stub kept so existing render calls don't break ────────────
function refreshCurrentUser(){ /* currentUser already in memory */ }
function initStorage(){
  if(!localStorage.getItem('pp_experiences')) saveExperiences(DEFAULT_EXPERIENCES);
}

// ═══════════════════════════════════════
// STATE
// ═══════════════════════════════════════
let currentUser=null,authMode='login',authPortal='student',activeView='',examState={},examTimer=null,qbankActiveTab='Aptitude',coQActiveTab='TCS';

// ═══════════════════════════════════════
// TOAST
// ═══════════════════════════════════════
function toast(msg,type='success'){
  const t=document.getElementById('toast');const el=document.createElement('div');
  el.className=`toast-item toast-${type}`;el.innerHTML=(type==='success'?'✅ ':'❌ ')+msg;
  t.appendChild(el);setTimeout(()=>el.remove(),3500);
}

// ═══════════════════════════════════════
// EXPERIENCES
// ═══════════════════════════════════════
function renderExperiences(){
  const exps=getExperiences();
  const coMap={TCS:'tcs',Infosys:'infosys',Wipro:'wipro',Zoho:'zoho',Amazon:'amazon',Microsoft:'microsoft',Accenture:'accenture',Cognizant:'cognizant'};
  document.getElementById('experiences-container').innerHTML=exps.map(e=>`
    <div class="exp-card ${coMap[e.company]||''}">
      <div class="row" style="gap:10px;margin-bottom:4px">
        <div class="exp-avatar">${e.avatar||e.name[0]}</div>
        <div><div style="font-weight:700;font-size:14px">${e.name}</div><div class="exp-meta">${e.role} · ${e.company} · ${e.placed||'2025'}</div></div>
        <span class="badge badge-gn" style="font-size:10px;margin-left:auto">✓ Placed</span>
      </div>
      <div style="margin-bottom:10px"><span class="badge badge-gd" style="font-size:11px">${e.package}</span></div>
      <div class="exp-quote">"${e.quote}"</div>
      <div style="font-size:10px;color:var(--tx3);font-weight:700;letter-spacing:.5px;margin-bottom:7px">KEY TIPS</div>
      ${(e.tips||[]).map(t=>`<div class="exp-tip">${t}</div>`).join('')}
    </div>`).join('');
}
function openShareModal(){
  if(!currentUser||currentUser.role!=='student'){toast('Login as a student to share experience','error');return;}
  document.getElementById('share-modal').classList.remove('hidden');
}
function closeShareModal(){document.getElementById('share-modal').classList.add('hidden')}
function submitExperience(){
  const co=document.getElementById('share-company').value;
  const role=document.getElementById('share-role').value.trim();
  const exp=document.getElementById('share-experience').value.trim();
  const tips=document.getElementById('share-tips').value.trim();
  const pkg=document.getElementById('share-package').value.trim();
  if(!role||!exp){toast('Please fill required fields','error');return;}
  const exps=getExperiences();
  exps.unshift({name:currentUser.name,company:co,role,package:pkg||'N/A',avatar:currentUser.name[0],quote:exp,tips:tips?tips.split('\n').filter(Boolean):[],placed:new Date().toLocaleDateString('en-IN',{month:'long',year:'numeric'})});
  saveExperiences(exps);renderExperiences();closeShareModal();toast('Experience shared!');
}


// ═══════════════════════════════════════
// ALUMNI LOGIN TYPE (asked at every alumni login)
// ═══════════════════════════════════════
let alumniField=null, pendingFieldUser=null;

const ALUMNI_FIELDS={
  'placement':{icon:'🏢',short:'Placement',label:'Placement & Corporate',color:'#7c6ff7',
    tagline:'Guide students into corporate placements and campus drives.',
    stats:[['🏢','Partner Companies','12'],['🎯','Focus','Campus Drives'],['📄','Core Skill','Aptitude + DSA'],['💬','Mentoring','Interview Prep']],
    focus:['Mock interviews and resume reviews for final-year students','Company-wise round guidance (Aptitude → Technical → Coding → HR)','Salary negotiation and offer comparison','Referral support for partner companies'],
    plan:['Publish upcoming drive calendar for the semester','Shortlist students by ranking and CGPA','Run weekly mock interview slots','Share feedback notes with the placement cell']},
  'entrepreneur':{icon:'🚀',short:'Entrepreneurship',label:'Entrepreneurship',color:'#f5c842',
    tagline:'Mentor student founders on building and funding startups.',
    stats:[['🚀','Track','Startup Building'],['💡','Focus','Idea → MVP'],['💰','Support','Funding Basics'],['🤝','Mentoring','Founder 1:1']],
    focus:['Validating ideas with real customer interviews','Building an MVP with a small budget','Registration, GST and basic compliance in India','Pitch decks, incubators and seed funding routes'],
    plan:['Host a monthly idea-pitch clinic','Review one student business plan each week','Connect founders with incubation cells','Share failure case studies and lessons']},
  'freelancing':{icon:'💻',short:'Freelancing',label:'Freelancing',color:'#38d9a9',
    tagline:'Help students earn independently with client work.',
    stats:[['💻','Track','Independent Work'],['🌐','Platforms','Upwork / Fiverr'],['📈','Focus','Portfolio'],['💵','Goal','First Client']],
    focus:['Choosing a niche: web dev, design, content, data','Building a portfolio that converts','Pricing, proposals and client communication','Invoicing, taxes and safe payment practices'],
    plan:['Review student portfolios every fortnight','Share live gig openings with the batch','Run a proposal-writing workshop','Track first-client milestones']},
  'research':{icon:'🔬',short:'Research',label:'Research & Science',color:'#4dabf7',
    tagline:'Support students pursuing research, higher studies and science careers.',
    stats:[['🔬','Track','Research'],['🎓','Focus','MS / PhD'],['📝','Output','Papers'],['🧪','Labs','Collaboration']],
    focus:['Choosing a research area and finding a guide','Writing and publishing your first paper','GATE / GRE / fellowship preparation','Applying to labs, internships and scholarships'],
    plan:['Run a paper-reading circle every month','Review SOPs and research proposals','Share open call-for-papers and fellowships','Connect students with lab internships']},
  'family-business':{icon:'🏪',short:'Family Business',label:'Parents / Family Business',color:'#ff922b',
    tagline:'Guide students who will join or modernise a family business.',
    stats:[['🏪','Track','Family Business'],['📦','Focus','Operations'],['📲','Goal','Digitisation'],['📊','Skill','Accounts']],
    focus:['Taking over responsibly: roles, boundaries and trust','Digitising billing, inventory and accounts','Taking the shop online: catalogues, delivery, payments','Managing staff, suppliers and cash flow'],
    plan:['Audit one family business per month with the student','Share simple GST and bookkeeping templates','Teach basic digital marketing for local shops','Plan a slow, phased handover roadmap']},
  'government':{icon:'🏛',short:'Govt Jobs',label:'Government Jobs',color:'#e64980',
    tagline:'Coach students preparing for government and PSU exams.',
    stats:[['🏛','Track','Govt / PSU'],['📚','Focus','Exam Prep'],['🗓','Cycle','Notifications'],['🎯','Goal','Selection']],
    focus:['Exam map: UPSC, SSC, Banking, Railways, State PSC, PSU via GATE','Building a realistic 12-month study timetable','Current affairs, previous papers and mock tests','Physical / interview stages and document readiness'],
    plan:['Post new notifications and last dates weekly','Share a curated booklist per exam','Run monthly full-length mock tests','Mentor toppers-in-making with 1:1 reviews']},
  'teaching':{icon:'📚',short:'Teaching',label:'Teaching Field',color:'#20c997',
    tagline:'Mentor students heading into teaching and academics.',
    stats:[['📚','Track','Teaching'],['🎓','Exams','NET / SET / B.Ed'],['🗣','Skill','Communication'],['🏫','Goal','Faculty Role']],
    focus:['Qualifications: B.Ed, M.Ed, NET/SET, PhD routes','Lesson planning and classroom management','Building teaching demos and sample lectures','School vs college vs edtech career paths'],
    plan:['Run monthly teaching-demo practice sessions','Share NET/SET syllabus and question banks','Review lesson plans and slide decks','Guide students on academic job applications']}
};

function openAlumniFieldModal(user){
  const sub=document.getElementById('alumni-type-sub');
  if(sub&&user) sub.textContent=`Hi ${user.name.split(' ')[0]} — choose the field you are logging in for`;
  document.getElementById('alumni-type-modal').classList.remove('hidden');
}
function selectAlumniField(key){
  if(!ALUMNI_FIELDS[key])return;
  alumniField=key;
  adminCompanyRole='';
  document.getElementById('alumni-type-modal').classList.add('hidden');
  const user=pendingFieldUser||currentUser;
  pendingFieldUser=null;
  if(user)showApp(user);
  toast(`${ALUMNI_FIELDS[key].icon} ${ALUMNI_FIELDS[key].label} portal opened`);
}

// Shared painter used by each field page's own render function.
function paintFieldPage(key){
  const f=ALUMNI_FIELDS[key];if(!f)return;
  const sub=document.getElementById('field-'+key+'-sub');
  if(sub)sub.textContent=f.tagline;
  const stats=document.getElementById('field-'+key+'-stats');
  if(stats)stats.innerHTML=f.stats.map(([i,l,v])=>statCard(i,l,v,f.color)).join('');
  const body=document.getElementById('field-'+key+'-body');
  if(!body)return;
  body.innerHTML=`
    <div class="g2">
      <div class="card">
        <h3 style="font-family:var(--ff-head);font-size:17px;font-weight:600;margin-bottom:16px">What you mentor on</h3>
        <div class="col" style="gap:12px">
          ${f.focus.map(t=>`<div style="display:flex;gap:10px;align-items:flex-start"><span style="color:${f.color}">●</span><span style="font-size:14px;color:var(--tx2)">${t}</span></div>`).join('')}
        </div>
      </div>
      <div class="card">
        <h3 style="font-family:var(--ff-head);font-size:17px;font-weight:600;margin-bottom:16px">Your action plan</h3>
        <div class="col" style="gap:12px">
          ${f.plan.map((t,i)=>`<div style="display:flex;gap:10px;align-items:flex-start"><span style="font-weight:700;color:${f.color}">${i+1}.</span><span style="font-size:14px;color:var(--tx2)">${t}</span></div>`).join('')}
        </div>
      </div>
    </div>
    <div class="card" style="margin-top:20px;display:flex;gap:10px;flex-wrap:wrap">
      <button class="btn btn-sm" style="background:${f.color}18;border:1px solid ${f.color}55;color:${f.color}" onclick="navigate('chat')">💬 Message Students</button>
      <button class="btn btn-ghost btn-sm" onclick="navigate('admin-students')">👥 View Students</button>
      <button class="btn btn-ghost btn-sm" onclick="navigate('admin-ranking')">🏆 Ranking</button>
      <button class="btn btn-ghost btn-sm" onclick="switchAlumniField()">🔄 Switch Login Type</button>
    </div>`;
}

function switchAlumniField(){
  alumniField=null;adminCompanyRole='';pendingFieldUser=currentUser;openAlumniFieldModal(currentUser);
}

// Separate page renderers — one per login type.
function renderFieldPlacement(){paintFieldPage('placement');}
function renderFieldEntrepreneur(){paintFieldPage('entrepreneur');}
function renderFieldFreelancing(){paintFieldPage('freelancing');}
function renderFieldResearch(){paintFieldPage('research');}
function renderFieldFamilyBusiness(){paintFieldPage('family-business');}
function renderFieldGovernment(){paintFieldPage('government');}
function renderFieldTeaching(){paintFieldPage('teaching');}

// ═══════════════════════════════════════
// AUTH
// ═══════════════════════════════════════
function showPortalSelector(){document.getElementById('portal-modal').classList.remove('hidden')}
function closePortal(){document.getElementById('portal-modal').classList.add('hidden')}
function openAuth(type){
  closePortal();
  authPortal=type.includes('student')?'student':type.includes('admin')?'admin':'holder';
  authMode=type.includes('register')?'register':'login';
  document.getElementById('auth-modal').classList.remove('hidden');
  updateAuthUI();
  document.getElementById('auth-email').value='';
  document.getElementById('auth-pass').value='';
  hideAuthError();
}
function closeAuth(){document.getElementById('auth-modal').classList.add('hidden')}
function toggleAuthMode(){authMode=authMode==='login'?'register':'login';updateAuthUI();hideAuthError();}

function updateAuthUI(){
  const isReg=authMode==='register';
  const colors={student:'var(--pu2)',admin:'var(--gn)',holder:'var(--gd)'};
  const labels={student:'Student Portal',admin:'Alumni Portal',holder:'Admin Portal'};
  const hints={student:'Demo → arjun@student.com / student123',admin:'Demo → admin@placementpro.com / admin123',holder:'Demo → holder@placementpro.com / holder123'};

  document.getElementById('auth-portal-badge').innerHTML=`<span class="badge" style="background:${colors[authPortal]}22;color:${colors[authPortal]};border:1px solid ${colors[authPortal]}44">${labels[authPortal]}</span>`;

  if(authPortal==='student'){
    document.getElementById('auth-title').textContent=isReg?'Create Student Account':'Student Login';
    document.getElementById('auth-sub').textContent=isReg?'Join PlacementPro today':'Sign in to continue your prep';
    document.getElementById('auth-submit-btn').textContent=isReg?'Create Account':'Sign In';
    document.getElementById('auth-register-fields').classList.toggle('hidden',!isReg);
    document.getElementById('auth-admin-reg-fields').classList.add('hidden');
    document.getElementById('auth-register-toggle').classList.remove('hidden');
    document.getElementById('auth-switch-text').textContent=isReg?'Already have an account?':"Don't have an account?";
    document.getElementById('auth-switch-btn').textContent=isReg?'Sign in':'Register';
    document.getElementById('auth-hint').textContent=!isReg?hints.student:'';
    document.getElementById('auth-hint').style.display=!isReg?'block':'none';
  } else if(authPortal==='admin'){
    document.getElementById('auth-title').textContent=isReg?'Create Alumni Account':'Alumni Login';
    document.getElementById('auth-sub').textContent=isReg?'Register as a new alumni':'Sign in to manage your portal';
    document.getElementById('auth-submit-btn').textContent=isReg?'Create Alumni Account':'Sign In';
    document.getElementById('auth-register-fields').classList.add('hidden');
    document.getElementById('auth-admin-reg-fields').classList.toggle('hidden',!isReg);
    document.getElementById('auth-register-toggle').classList.remove('hidden');
    document.getElementById('auth-switch-text').textContent=isReg?'Already have an account?':"New admin? Register here.";
    document.getElementById('auth-switch-btn').textContent=isReg?'Sign in':'Register';
    document.getElementById('auth-hint').textContent=!isReg?hints.admin:'';
    document.getElementById('auth-hint').style.display=!isReg?'block':'none';
  } else {
    document.getElementById('auth-title').textContent='Admin Login';
    document.getElementById('auth-sub').textContent='Admin access — sign in to manage the platform';
    document.getElementById('auth-submit-btn').textContent='Sign In';
    document.getElementById('auth-register-fields').classList.add('hidden');
    document.getElementById('auth-admin-reg-fields').classList.add('hidden');
    document.getElementById('auth-register-toggle').classList.add('hidden');
    document.getElementById('auth-hint').textContent=hints.holder;
    document.getElementById('auth-hint').style.display='block';
  }
}

function showAuthError(msg){const el=document.getElementById('auth-error');el.textContent='⚠ '+msg;el.classList.remove('hidden')}
function hideAuthError(){document.getElementById('auth-error').classList.add('hidden')}

// Alumni Portal is restricted to official college e-mail accounts.
const COLLEGE_EMAIL_DOMAIN='kongu.edu';
function isCollegeEmail(e){e=(e||'').toLowerCase();return e.endsWith('@'+COLLEGE_EMAIL_DOMAIN)||e.endsWith('.'+COLLEGE_EMAIL_DOMAIN);}

async function submitAuth(){
  const email=document.getElementById('auth-email').value.trim();
  const pass=document.getElementById('auth-pass').value;
  hideAuthError();
  if(!email||!pass){showAuthError('Please fill all required fields');return;}

  const btn=document.getElementById('auth-submit-btn');
  btn.disabled=true; btn.textContent='Please wait...';

  if(authMode==='login'){
    if(authPortal==='admin' && !isCollegeEmail(email)){
      btn.disabled=false; updateAuthUI();
      showAuthError('The Alumni Portal is restricted to official @'+COLLEGE_EMAIL_DOMAIN+' e-mail accounts');
      return;
    }
    const res = await api('/login.php', {
      method:'POST',
      body: { email, password: pass, portal: authPortal }
    });
    btn.disabled=false; updateAuthUI();
    if(!res.success){ showAuthError(res.message||'Invalid email or password'); return; }
    // Normalise field names (backend uses snake_case)
    const u = res.user;
    u.rollNo  = u.roll_no || u.rollNo || '';
    u.completedRounds = u.completedRounds || {};
    u.scores  = u.scores || {};
    setToken(res.token);
    loginUser(u);

  } else if(authMode==='register'){
    if(authPortal==='student'){
      const name=document.getElementById('reg-name').value.trim();
      const roll=document.getElementById('reg-roll').value.trim();
      const branch=document.getElementById('reg-branch').value.trim()||'Computer Science';
      const cgpa=parseFloat(document.getElementById('reg-cgpa').value)||0;
      const section=document.getElementById('reg-section').value.trim();
      const year=document.getElementById('reg-year').value.trim();
      if(!name||!roll){btn.disabled=false;updateAuthUI();showAuthError('Please fill all required fields');return;}
      const res = await api('/register.php', {
        method:'POST',
        body: { name, email, password: pass, roll_no: roll, branch, cgpa, section, year }
      });
      btn.disabled=false; updateAuthUI();
      if(!res.success){ showAuthError(res.message||'Registration failed'); return; }
      const u = res.user;
      u.rollNo = u.roll_no || u.rollNo || roll;
      u.completedRounds = {}; u.scores = {};
      setToken(res.token);
      loginUser(u);

    } else if(authPortal==='admin'){
      const name=document.getElementById('admin-reg-name').value.trim();
      const position=document.getElementById('admin-reg-position').value;
      const roll=document.getElementById('admin-reg-roll').value.trim();
      const gradYear=document.getElementById('admin-reg-gradyear').value.trim();
      const degree=document.getElementById('admin-reg-degree').value.trim();
      const dept=document.getElementById('admin-reg-dept').value.trim();
      const college=document.getElementById('admin-reg-college').value.trim()||'Kongu Engineering College';
      const fail=(m)=>{btn.disabled=false;updateAuthUI();showAuthError(m);};
      if(!name){fail('Please enter your name');return;}
      if(!isCollegeEmail(email)){fail('Alumni sign-up is only allowed with your official @'+COLLEGE_EMAIL_DOMAIN+' e-mail address');return;}
      if(!position){fail('Please select the role you will play');return;}
      if(!/^[A-Za-z0-9\/-]{6,20}$/.test(roll)){fail('Please enter your college register / roll number');return;}
      const thisYear=new Date().getFullYear();
      if(!/^\d{4}$/.test(gradYear)||+gradYear<1980||+gradYear>thisYear){fail('Please enter a valid year of graduation (1980-'+thisYear+')');return;}
      if(!degree){fail('Please enter your degree / branch');return;}
      if(!dept){fail('Please enter your department');return;}
      if(pass.length<6){fail('Password must be at least 6 characters');return;}
      const res = await api('/register.php', {
        method:'POST',
        body: { name, email, password: pass, roll_no: roll, branch: degree, dept, college, position, role:'admin', graduation_year: gradYear, degree }
      });
      btn.disabled=false; updateAuthUI();
      if(!res.success){ showAuthError(res.message||'Registration failed'); return; }
      if(res.pending){
        // Not logged in yet — the request now sits in the holder's pending
        // queue until it's approved.
        closeAuth();
        toast(res.message||'Registration submitted — awaiting admin approval.','success');
        return;
      }
      const u = res.user;
      u.rollNo = u.roll_no || u.rollNo || '';
      u.completedRounds = {}; u.scores = {};
      setToken(res.token);
      loginUser(u);
    }
  }
}

function loginUser(user){
  currentUser=user; closeAuth();
  startPresenceHeartbeat();
  document.getElementById('landing').classList.add('hidden');
  showApp(user);
  if(user.role==='student') document.getElementById('share-exp-btn').style.display='inline-flex';
  toast(`Welcome back, ${user.name.split(' ')[0]}!`);
}
async function logout(){
  await api('/logout.php', {method:'POST'});
  clearToken(); currentUser=null;
  document.getElementById('app').style.display='none';
  document.getElementById('app').classList.add('hidden');
  document.getElementById('landing').classList.remove('hidden');
  document.getElementById('share-exp-btn').style.display='none';
  clearInterval(examTimer); stopPendingAlumniPolling(); stopPresenceHeartbeat(); alumniField=null; pendingFieldUser=null; adminCompanyRole=''; toast('Signed out successfully');
}

document.getElementById('auth-modal').addEventListener('click',e=>{if(e.target===document.getElementById('auth-modal'))closeAuth();});
document.getElementById('portal-modal').addEventListener('click',e=>{if(e.target===document.getElementById('portal-modal'))closePortal();});
document.getElementById('share-modal').addEventListener('click',e=>{if(e.target===document.getElementById('share-modal'))closeShareModal();});

// ═══════════════════════════════════════
// APP INIT
// ═══════════════════════════════════════
function showApp(user){
  // Alumni must pick which field they are logging in for — asked EVERY login.
  if(user.role==='admin' && !alumniField){ pendingFieldUser=user; openAlumniFieldModal(user); return; }
  const app=document.getElementById('app');app.style.display='';app.classList.remove('hidden');
  document.getElementById('sidebar-user-name').textContent=user.name;
  paintAvatar(document.getElementById('sidebar-avatar'),user);
  document.getElementById('sidebar-user-email').textContent=user.email;
  const roleLabel={student:'STUDENT',admin:'ADMIN PANEL',holder:'OWNER PANEL'};
  document.getElementById('sidebar-role-label').textContent=roleLabel[user.role]||'PORTAL';
  const roleStyle={student:`<span class="badge badge-pu" style="font-size:10px">${user.branch||'CS'}</span>`,admin:`<span class="badge badge-gn" style="font-size:10px">ADMIN</span>`,holder:`<span class="badge badge-gd" style="font-size:10px">OWNER</span>`};
  document.getElementById('sidebar-user-badge').innerHTML=roleStyle[user.role]||'';
  buildNav(user.role);
  const defaultView={student:'dashboard',admin:alumniField?('field-'+alumniField):'admin-dashboard',holder:'holder-dashboard'};
  navigate(defaultView[user.role]||'dashboard');
  if(user.role==='holder'){
    refreshPendingAlumniBadge();
    stopPendingAlumniPolling();
    _pendingAlumniPollInt=setInterval(refreshPendingAlumniBadge,8000);
  }
}
function buildNav(role){
  const navMaps={
    student:[{id:'dashboard',icon:'⊞',label:'Dashboard'},{id:'companies',icon:'🏢',label:'Companies'},{id:'co-questions',icon:'📚',label:'Interview Q&A'},{id:'performance',icon:'📈',label:'Performance'},{id:'alumni',icon:'🎓',label:'Alumni Network'},{id:'mentorship',icon:'📅',label:'Mentorship'},{id:'experiences',icon:'📰',label:'Experiences'},{id:'referrals',icon:'🤝',label:'Referrals'},{id:'forum',icon:'❓',label:'Q&A Forum'},{id:'chat',icon:'💬',label:'Messages'},{id:'profile',icon:'👤',label:'Profile'}],
    admin:[{id:'admin-dashboard',icon:'⊞',label:'Dashboard'},{id:'admin-students',icon:'👥',label:'Students'},{id:'mentorship',icon:'📅',label:'My Slots'},{id:'referrals',icon:'🤝',label:'Referrals'},{id:'experiences',icon:'📰',label:'Experiences'},{id:'forum',icon:'❓',label:'Q&A Forum'},{id:'admin-ranking',icon:'🏆',label:'Ranking'},{id:'admin-companies',icon:'🏢',label:'Companies'},{id:'admin-questions',icon:'📝',label:'Questions'},{id:'admin-results',icon:'📊',label:'Results'},{id:'chat',icon:'💬',label:'Messages'},{id:'profile',icon:'👤',label:'Profile'}],
    holder:[{id:'holder-dashboard',icon:'⊞',label:'Dashboard'},{id:'holder-admins',icon:'🛡',label:'Alumni'},{id:'holder-students',icon:'👥',label:'All Students'},{id:'holder-ranking',icon:'🏆',label:'Ranking'},{id:'profile',icon:'👤',label:'Profile'}]
  };
  if(role==='admin'&&alumniField&&ALUMNI_FIELDS[alumniField]){
    const f=ALUMNI_FIELDS[alumniField];
    navMaps.admin=[{id:'field-'+alumniField,icon:f.icon,label:f.short},...navMaps.admin];
  }
  document.getElementById('nav-items').innerHTML=(navMaps[role]||navMaps.student).map(it=>`
    <button class="nav-item" id="nav-${it.id}" onclick="navigate('${it.id}')">
      <span class="nav-icon">${it.icon}</span>${it.label}
      <span id="nav-badge-${it.id}" class="chat-unread-dot hidden" style="margin-left:auto"></span>
    </button>`).join('');
}

// ═══════════════════════════════════════
// ALUMNI APPROVAL (Website Holder notifications)
// ═══════════════════════════════════════
let _pendingAlumniPollInt=null,_pendingAlumniIds=new Set();
function stopPendingAlumniPolling(){
  if(_pendingAlumniPollInt){clearInterval(_pendingAlumniPollInt);_pendingAlumniPollInt=null;}
}
async function refreshPendingAlumniBadge(){
  const res=await api('/admin_manage.php/pending');
  if(!res.success)return;
  const list=res.pending||[];
  // Toast once per newly-seen pending request so the holder is notified
  // even if they're sitting on a different page.
  const newIds=list.map(p=>p.id).filter(id=>!_pendingAlumniIds.has(id));
  if(_pendingAlumniIds.size>0 && newIds.length){
    const first=list.find(p=>p.id===newIds[0]);
    toast(`New alumni registration from ${first.name} — awaiting your approval`,'success');
  }
  _pendingAlumniIds=new Set(list.map(p=>p.id));
  const badge=document.getElementById('nav-badge-holder-admins');
  if(badge){
    if(list.length){badge.textContent=list.length;badge.classList.remove('hidden');}
    else{badge.classList.add('hidden');}
  }
  return list;
}
async function approveAlumni(id){
  const res=await api(`/admin_manage.php/${id}/approve`,{method:'POST'});
  if(!res.success){toast(res.message||'Could not approve request','error');return;}
  toast(res.message||'Alumni approved');
  refreshPendingAlumniBadge();
  renderHolderAdmins();
}
async function rejectAlumni(id){
  const res=await api(`/admin_manage.php/${id}/reject`,{method:'POST'});
  if(!res.success){toast(res.message||'Could not decline request','error');return;}
  toast(res.message||'Alumni request declined');
  refreshPendingAlumniBadge();
  renderHolderAdmins();
}
function navigate(view){
  if(activeView===view&&!['exam','result'].includes(view))return;
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  const page=document.getElementById('page-'+view);
  if(page){page.classList.add('active');activeView=view;}
  const navBtn=document.getElementById('nav-'+view);if(navBtn)navBtn.classList.add('active');
  const renders={'dashboard':renderDashboard,'companies':renderCompanies,'co-questions':renderCoQuestions,'performance':renderPerformance,'profile':renderProfile,'chat':renderChat,'admin-dashboard':renderAdminDashboard,'admin-students':renderAdminStudents,'admin-ranking':renderAdminRanking,'admin-companies':renderAdminCompanies,'admin-questions':renderAdminQuestions,'admin-results':renderAdminResults,'holder-dashboard':renderHolderDashboard,'holder-admins':renderHolderAdmins,'holder-students':renderHolderStudents,'holder-ranking':renderHolderRanking,
    'field-placement':renderFieldPlacement,'field-entrepreneur':renderFieldEntrepreneur,'field-freelancing':renderFieldFreelancing,'field-research':renderFieldResearch,'field-family-business':renderFieldFamilyBusiness,'field-government':renderFieldGovernment,'field-teaching':renderFieldTeaching,
    // Alumni Connect pages (see /connect-app.js)
    'alumni':typeof renderAlumniDirectory==='function'?renderAlumniDirectory:null,
    'mentorship':typeof renderMentorship==='function'?renderMentorship:null,
    'experiences':typeof renderExperienceFeed==='function'?renderExperienceFeed:null,
    'referrals':typeof renderReferrals==='function'?renderReferrals:null,
    'forum':typeof renderForum==='function'?renderForum:null};
  if(view!=='chat')stopChatPolling();
  if(renders[view])renders[view]();
}

// ═══════════════════════════════════════
// STUDENT DASHBOARD
// ═══════════════════════════════════════
function statCard(icon,label,val,color){return `<div class="stat-card"><div class="stat-icon">${icon}</div><div class="stat-num" style="color:${color}">${val}</div><div class="stat-label">${label}</div></div>`;}
function renderDashboard(){
  refreshCurrentUser();const u=currentUser;
  document.getElementById('dash-greeting').textContent=`Welcome back, ${u.name.split(' ')[0]}! 👋`;
  const scores=u.scores||{};const completed=Object.values(u.completedRounds||{}).flat().length;
  const allS=Object.values(scores);const avg=allS.length?Math.round(allS.reduce((a,b)=>a+b,0)/allS.length):0;
  const totalR=Object.keys(COMPANIES).reduce((s,k)=>s+COMPANIES[k].rounds.length,0);
  document.getElementById('dash-stats').innerHTML=`${statCard('✅','Rounds Done',completed,'var(--gn)')}${statCard('📈','Avg Score',avg+'%','var(--pu2)')}${statCard('🏢','Companies',Object.keys(COMPANIES).length,'var(--gd)')}${statCard('🎯','Progress',Math.round((completed/totalR)*100)+'%','var(--cy)')}`;
  document.getElementById('dash-company-tracks').innerHTML=Object.entries(COMPANIES).map(([k,co])=>{
    const done=(u.completedRounds?.[k]||[]);const pct=Math.round((done.length/co.rounds.length)*100);
    const roundBtns=co.rounds.map((r,idx)=>{
      const prev=idx>0?co.rounds[idx-1]:null;
      const unlocked=idx===0||done.includes(prev);
      const isDone=done.includes(r);
      const score=u.scores?.[`${k}_${r}`]??null;
      const icons={Aptitude:'🧮',Technical:'⚙️',Coding:'💻',HR:'🤝'};
      const bg=isDone?'rgba(56,217,169,.08)':unlocked?'rgba(255,255,255,.05)':'rgba(0,0,0,.1)';
      const bdr=isDone?'rgba(56,217,169,.3)':unlocked?'rgba(255,255,255,.07)':'rgba(255,255,255,.03)';
      const lbl=isDone&&score!==null?`Score: ${score}%`:unlocked?'Tap to start':'🔒 Complete '+prev+' first';
      const clr=isDone?'var(--gn)':unlocked?'var(--tx)':'var(--tx3)';
      const act=isDone?'✓ Done':unlocked?'▶':'🔒';
      const actClr=isDone?'var(--gn)':unlocked?co.accent:'var(--tx3)';
      return `<div onclick="${unlocked?`startExamFromDash('${k}','${r}')`:''}" style="display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:9px;cursor:${unlocked?'pointer':'not-allowed'};background:${bg};border:1px solid ${bdr};opacity:${unlocked?1:.45}">
        <span style="font-size:16px">${icons[r]||'📋'}</span>
        <div style="flex:1"><div style="font-size:12px;font-weight:700;color:${clr}">${r}</div><div style="font-size:10px;color:var(--tx3)">${lbl}</div></div>
        <span style="font-size:11px;font-weight:700;flex-shrink:0;color:${actClr}">${act}</span>
      </div>`;
    }).join('');
    return `<div id="track-${k}" style="background:var(--surf2);border-radius:11px;border:1px solid ${co.color}22;overflow:hidden">
      <div style="padding:13px 15px;cursor:pointer" onclick="toggleTrack('${k}','${co.color}')">
        <div style="display:flex;align-items:center;gap:10px">
          <div style="width:34px;height:34px;border-radius:8px;background:${co.color};display:flex;align-items:center;justify-content:center;font-family:var(--ff-head);font-weight:700;font-size:9px;color:#fff;flex-shrink:0">${co.logo}</div>
          <div style="flex:1"><div style="font-weight:700;font-size:13px">${k} <span style="font-weight:500;color:var(--tx2);font-size:11px">· ${co.name}</span></div><div style="font-size:10px;color:var(--tx3)">${co.package} · ${done.length}/${co.rounds.length} done</div></div>
          <span style="font-size:11px;color:var(--tx2);margin-right:6px">${pct}%</span>
          <span id="track-arrow-${k}" style="color:var(--tx3);font-size:11px;display:inline-block;transition:transform .25s">▼</span>
        </div>
        <div class="stack-box" style="margin-top:9px">${stackChips(k,co,{small:true})}</div>
        <div class="progress" style="margin-top:10px"><div class="progress-bar" style="background:linear-gradient(90deg,${co.color},${co.accent});width:${pct}%"></div></div>
      </div>
      <div id="track-rounds-${k}" style="max-height:0;overflow:hidden;transition:max-height .35s ease,padding .3s">
        <div style="padding:0 14px 14px;display:flex;flex-direction:column;gap:7px">${roundBtns}</div>
      </div>
    </div>`;
  }).join('');
  const entries=Object.entries(scores).slice(-5).reverse();
  document.getElementById('dash-recent').innerHTML=entries.length?entries.map(([k,sc])=>{const[co,rnd]=k.split('_');return `<div class="row-between" style="padding:8px 0;border-bottom:1px solid var(--bdr)"><div><div style="font-weight:600;font-size:13px">${co} – ${rnd}</div></div><span class="badge ${sc>=70?'badge-gn':sc>=50?'badge-gd':'badge-rd'}">${sc}%</span></div>`;}).join(''):'<div style="color:var(--tx3);font-size:13px;text-align:center;padding:18px">No tests taken yet</div>';
}

// ═══════════════════════════════════════
// COMPANIES
// ═══════════════════════════════════════
function renderCompanies(){
  refreshCurrentUser();
  document.getElementById('companies-list').style.display='';
  document.getElementById('company-detail').classList.add('hidden');
  const u=currentUser;
  document.getElementById('companies-list').innerHTML=Object.entries(COMPANIES).map(([k,co])=>{
    const done=(u.completedRounds?.[k]||[]);const pct=Math.round((done.length/co.rounds.length)*100);
    const pills=co.rounds.map(r=>{const d=done.includes(r);return `<span class="round-pill" style="background:${d?'rgba(56,217,169,.12)':'rgba(255,255,255,.04)'};color:${d?'var(--gn)':'var(--tx3)'};border:1px solid ${d?'rgba(56,217,169,.3)':'var(--bdr)'}">${d?'✓ ':''}${r}</span>`;}).join('');
    return `<div class="company-card" style="border:1px solid ${co.color}22;background:linear-gradient(135deg,${co.color}08,var(--surf))"
      onmouseenter="this.style.borderColor='${co.color}55';this.style.boxShadow='0 12px 40px ${co.color}1a'"
      onmouseleave="this.style.borderColor='${co.color}22';this.style.boxShadow=''"
      onclick="showCompanyDetail('${k}')">
      <div class="row-between" style="margin-bottom:14px;align-items:flex-start">
        <div class="co-logo" style="background:${co.color}">${co.logo}</div>
        <span class="badge ${co.difBadge}">${co.difficulty}</span>
      </div>
      <h3 style="font-family:var(--ff-head);font-size:20px;font-weight:700;margin-bottom:7px">${co.name}</h3>
      <div class="stack-box">${stackChips(k,co)}</div>
      <p style="font-size:12px;color:var(--tx3);margin-bottom:14px;line-height:1.6">${co.desc}</p>
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px">${pills}</div>
      <div class="row-between" style="margin-bottom:10px"><span style="font-size:12px;color:var(--tx2)">${pct}% Complete</span><span style="font-size:13px;color:var(--gd);font-weight:700">${co.package}</span></div>
      <div class="progress"><div class="progress-bar" style="background:linear-gradient(90deg,${co.color},${co.accent});width:${pct}%"></div></div>
    </div>`;
  }).join('');
}
function showCompanyDetail(key){
  refreshCurrentUser();const co=COMPANIES[key];const u=currentUser;
  document.getElementById('companies-list').style.display='none';
  const detail=document.getElementById('company-detail');detail.classList.remove('hidden');
  const roundCards=co.rounds.map((r,idx)=>{
    const prev=idx>0?co.rounds[idx-1]:null;
    const unlocked=idx===0||(u.completedRounds?.[key]||[]).includes(prev);
    const done=(u.completedRounds?.[key]||[]).includes(r);
    const score=u.scores?.[`${key}_${r}`]??null;
    const icons={Aptitude:'🧮',Technical:'⚙️',Coding:'💻',HR:'🤝'};
    const scoreBar=score!==null?`<div style="margin-bottom:14px"><div class="row-between" style="margin-bottom:6px;font-size:13px"><span style="color:var(--tx2)">Your Score</span><span style="font-weight:700;color:${score>=70?'var(--gn)':score>=50?'var(--gd)':'var(--rd)'}">${score}%</span></div><div class="progress"><div class="progress-bar" style="background:${score>=70?'linear-gradient(90deg,var(--gn),#6ee7b7)':score>=50?'linear-gradient(90deg,var(--gd),#fcd34d)':'linear-gradient(90deg,var(--rd),#fca5a5)'};width:${score}%"></div></div></div>`:'';
    return `<div class="card" style="opacity:${unlocked?1:.5};border:1px solid ${done?'rgba(56,217,169,.35)':'var(--bdr)'}">
      ${done?`<div style="margin-bottom:10px"><span class="badge badge-gn">✓ Completed</span></div>`:!unlocked?`<div style="margin-bottom:10px"><span class="badge" style="background:rgba(255,255,255,.04);color:var(--tx3);border:1px solid var(--bdr)">🔒 Locked</span></div>`:''}
      <div style="font-size:36px;margin-bottom:14px">${icons[r]}</div>
      <h3 style="font-family:var(--ff-head);font-size:18px;font-weight:700;margin-bottom:6px">${r} Round</h3>
      <p style="font-size:12px;color:var(--tx2);margin-bottom:16px">${EXAM_META[r].label}</p>
      ${scoreBar}
      <button class="btn ${unlocked?'btn-primary':'btn-ghost'} btn-block" ${unlocked?`onclick="startExam('${key}','${r}')"`:''}>${done?'🔄 Retake':unlocked?'▶ Start Exam':`🔒 Complete ${prev} first`}</button>
    </div>`;
  }).join('');
  detail.innerHTML=`
    <div class="row" style="gap:10px;margin-bottom:22px">
      <button class="btn btn-ghost btn-sm" onclick="renderCompanies()">← Back</button>
      <button class="btn btn-outline btn-sm" onclick="coQActiveTab='${key}';navigate('co-questions')">📚 View Questions</button>
    </div>
    <div class="card" style="margin-bottom:24px;background:linear-gradient(135deg,${co.color}15,var(--surf));border:1px solid ${co.color}44">
      <div class="row" style="gap:18px">
        <div class="co-logo" style="width:64px;height:64px;border-radius:16px;font-size:14px;background:${co.color};flex-shrink:0">${co.logo}</div>
        <div>
          <h1 style="font-family:var(--ff-head);font-size:22px;font-weight:700;margin-bottom:5px">${co.name}</h1>
          <p style="color:var(--tx2);font-size:13px;margin-bottom:10px">${co.desc}</p>
          <div class="row" style="gap:8px;flex-wrap:wrap">
            <span class="badge badge-gd">💰 ${co.package}</span>
            <span class="badge badge-cy">👥 ${co.slots} seats</span>
            <span class="badge ${co.difBadge}">⚡ ${co.difficulty}</span>
          </div>
        </div>
      </div>
    </div>
    <h3 style="font-family:var(--ff-head);font-size:17px;font-weight:600;margin-bottom:18px">Exam Rounds</h3>
    <div class="g2">${roundCards}</div>`;
}

// ═══════════════════════════════════════
// COMPANY QUESTIONS
// ═══════════════════════════════════════
function renderCoQuestions(){
  const tabs=document.getElementById('co-q-tabs');
  tabs.innerHTML=Object.keys(COMPANY_QUESTIONS).map(k=>`<button class="tab-btn ${coQActiveTab===k?'active':''}" onclick="coQActiveTab='${k}';renderCoQuestions()">${k}</button>`).join('');
  const qs=COMPANY_QUESTIONS[coQActiveTab];const co=COMPANIES[coQActiveTab];
  const catColors={Aptitude:'badge-gd',Technical:'badge-cy',Coding:'badge-pu',HR:'badge-gn'};
  const diffColors={Easy:'badge-gn',Medium:'badge-gd',Hard:'badge-rd'};
  document.getElementById('co-q-content').innerHTML=`
    <div class="card" style="margin-bottom:18px;background:linear-gradient(135deg,${co.color}10,var(--surf));border:1px solid ${co.color}33">
      <div class="row" style="gap:14px">
        <div style="width:48px;height:48px;border-radius:12px;background:${co.color};display:flex;align-items:center;justify-content:center;font-family:var(--ff-head);font-weight:700;font-size:11px;color:#fff;flex-shrink:0">${co.logo}</div>
        <div><h2 style="font-size:18px;font-weight:700;margin-bottom:3px">${co.name}</h2><p style="font-size:12px;color:var(--tx3)">${qs.length} interview questions</p></div>
      </div>
    </div>
    <div class="col" style="gap:10px">
      ${qs.map((q,i)=>`<div class="co-question-item">
        <div class="row" style="gap:7px;margin-bottom:9px">
          <span class="badge ${catColors[q.cat]||'badge-pu'}" style="font-size:10px">${q.cat}</span>
          <span class="badge ${diffColors[q.diff]||'badge-gd'}" style="font-size:10px">${q.diff}</span>
          <span style="font-size:11px;color:var(--tx3);margin-left:auto">Q${i+1}</span>
        </div>
        <div style="font-size:14px;font-weight:600;margin-bottom:10px">${q.q}</div>
        <div style="background:var(--surf3);border-radius:8px;padding:11px 13px;border-left:3px solid ${co.color}">
          <div style="font-size:10px;color:var(--tx3);font-weight:700;letter-spacing:.5px;margin-bottom:5px">ANSWER</div>
          <div style="font-size:13px;color:var(--tx2);line-height:1.7">${q.a}</div>
        </div>
      </div>`).join('')}
    </div>`;
}

// ═══════════════════════════════════════
// EXAM ENGINE
// ═══════════════════════════════════════
function startExam(company,round){
  clearInterval(examTimer);const meta=EXAM_META[round];
  examState={company,round,questions:QBANK[round],totalTime:meta.duration,timeLeft:meta.duration,answers:{},currentQ:0,submitted:false};
  navigate('exam');renderExam();startTimer();
}
function renderExam(){
  document.getElementById('exam-title').textContent=`${examState.company} — ${examState.round} Round`;
  renderQuestion();renderQNav();
}
function renderQuestion(){
  const s=examState;const q=s.questions[s.currentQ];const total=s.questions.length;
  document.getElementById('exam-q-counter').textContent=`Question ${s.currentQ+1} of ${total}`;
  document.getElementById('exam-prev-btn').disabled=s.currentQ===0;
  const isLast=s.currentQ===total-1;
  document.getElementById('exam-next-btn').textContent=isLast?'✓ Submit':'Next →';
  document.getElementById('exam-next-btn').className=isLast?'btn btn-success btn-sm':'btn btn-primary btn-sm';
  document.getElementById('exam-next-btn').onclick=isLast?()=>submitExam(false):()=>examNav(1);
  let html='';
  if(s.round==='Aptitude'||s.round==='Technical'){
    html=`<div class="row" style="gap:8px;margin-bottom:16px"><span class="badge badge-pu">Q${s.currentQ+1}</span><span class="badge badge-cy">${s.round}</span></div>
    <p class="q-text">${q.text}</p>
    ${q.opts.map((o,i)=>`<div class="option ${s.answers[s.currentQ]===i?'selected':''}" onclick="selectOption(${i})"><div class="opt-letter">${String.fromCharCode(65+i)}</div>${o}</div>`).join('')}`;
  } else if(s.round==='Coding'){
    const code=s.answers[`code_${s.currentQ}`]||q.starter||'';
    html=`<div class="row" style="gap:8px;margin-bottom:16px"><span class="badge badge-pu">Problem ${s.currentQ+1}</span><span class="badge badge-cy">Coding</span></div>
    <p class="q-text">${q.text}</p>
    <div style="background:rgba(245,200,66,.07);border:1px solid rgba(245,200,66,.2);border-radius:8px;padding:11px 14px;font-size:13px;color:var(--gd);margin-bottom:14px">💡 ${q.hint}</div>
    <div class="code-area"><div class="code-header"><span>📝 JavaScript</span><button style="background:none;color:var(--tx3);font-size:12px;cursor:pointer;font-family:var(--ff-body)" onclick="resetCode()">Reset</button></div>
    <textarea class="code-editor" id="code-editor" onchange="saveCode()" oninput="saveCode()">${code}</textarea></div>
    <div class="row" style="gap:10px;margin-bottom:12px">
      <button class="btn btn-primary btn-sm" id="run-btn" onclick="runCode()">▶ Run Code</button>
      <button class="btn btn-ghost btn-sm" onclick="document.getElementById('code-output').textContent=''">Clear</button>
    </div>
    <pre class="code-output" id="code-output">${s.answers[`output_${s.currentQ}`]||'Output will appear here...'}</pre>`;
  } else {
    html=`<div class="row" style="gap:8px;margin-bottom:16px"><span class="badge badge-pu">Q${s.currentQ+1}</span><span class="badge badge-gn">HR</span></div>
    <p class="q-text">${q.text}</p>
    <textarea class="inp" placeholder="${q.placeholder}" style="min-height:180px;line-height:1.75" oninput="saveHR(this.value)">${s.answers[s.currentQ]||''}</textarea>
    <div style="margin-top:8px;font-size:12px;color:var(--tx3)">Tip: Use STAR method. Write at least 80 words for full marks.</div>`;
  }
  document.getElementById('exam-q-area').innerHTML=html;
}
function selectOption(i){examState.answers[examState.currentQ]=i;renderQuestion();renderQNav();}
function saveCode(){const ta=document.getElementById('code-editor');if(ta)examState.answers[`code_${examState.currentQ}`]=ta.value;}
function resetCode(){examState.answers[`code_${examState.currentQ}`]=examState.questions[examState.currentQ].starter||'';renderQuestion();}
function saveHR(val){examState.answers[examState.currentQ]=val;}
async function runCode(){
  saveCode();const btn=document.getElementById('run-btn');const out=document.getElementById('code-output');
  if(!btn||!out)return;btn.disabled=true;btn.textContent='⟳ Running...';out.textContent='Running...';
  await new Promise(r=>setTimeout(r,800));
  const code=examState.answers[`code_${examState.currentQ}`]||'';
  try{
    const logs=[];const fn=new Function('console',code);fn({log:(...a)=>logs.push(a.map(String).join(' '))});
    const output=logs.join('\n')||'(no output)';
    out.textContent='✅ Output:\n'+output+'\n\nCompleted in 0.08s';
    examState.answers[`output_${examState.currentQ}`]='✅ Output:\n'+output;
    examState.answers[`code_done_${examState.currentQ}`]=true;
  }catch(e){out.textContent='❌ Error:\n'+e.message;examState.answers[`output_${examState.currentQ}`]='❌ '+e.message;}
  btn.disabled=false;btn.textContent='▶ Run Code';
}
function examNav(dir){
  const next=examState.currentQ+dir;if(next<0||next>=examState.questions.length)return;
  saveCode();examState.currentQ=next;renderQuestion();renderQNav();
}
function renderQNav(){
  const s=examState;const answered=Object.keys(s.answers).filter(k=>!k.startsWith('code_')&&!k.startsWith('output_')&&!k.startsWith('code_done_')).length;
  document.getElementById('nav-answered').textContent=`Answered (${answered})`;
  document.getElementById('nav-unanswered').textContent=`Unanswered (${s.questions.length-answered})`;
  document.getElementById('q-nav-grid').innerHTML=s.questions.map((_,i)=>{
    const cur=i===s.currentQ;const ans=s.answers[i]!==undefined||s.answers[`code_done_${i}`];
    return `<button class="q-nav-btn ${cur?'current':ans?'answered':''}" onclick="examNav(${i-s.currentQ})">${i+1}</button>`;
  }).join('');
}
function startTimer(){
  clearInterval(examTimer);updateTimerUI();
  examTimer=setInterval(()=>{examState.timeLeft--;updateTimerUI();if(examState.timeLeft<=0){clearInterval(examTimer);submitExam(true);}},1000);
}
function updateTimerUI(){
  const s=examState;const pct=(s.timeLeft/s.totalTime)*100;
  const m=Math.floor(s.timeLeft/60).toString().padStart(2,'0');const sec=(s.timeLeft%60).toString().padStart(2,'0');
  const timerEl=document.getElementById('exam-timer');const fillEl=document.getElementById('exam-timer-fill');
  if(!timerEl)return;timerEl.textContent=`${m}:${sec}`;
  timerEl.className='timer-display'+(pct<=15?' danger':pct<=40?' warn':'');
  if(fillEl){fillEl.style.width=pct+'%';fillEl.style.background=pct<=15?'var(--rd)':pct<=40?'var(--gd)':'var(--gn)';}
}
async function submitExam(auto){
  clearInterval(examTimer);if(examState.submitted)return;examState.submitted=true;
  const s=examState;let score=0;const total=s.questions.length;
  if(s.round==='Aptitude'||s.round==='Technical'){s.questions.forEach((q,i)=>{if(s.answers[i]===q.ans)score++;});}
  else if(s.round==='Coding'){s.questions.forEach((_,i)=>{if(s.answers[`code_done_${i}`])score++;});}
  else{s.questions.forEach((_,i)=>{if(s.answers[i]&&s.answers[i].length>50)score++;});}
  const pct=Math.round((score/total)*100);const passed=pct>=50;

  // ── Save to DB ──────────────────────────────────────────────
  if(currentUser && currentUser.role==='student'){
    const res = await api('/save_result.php',{
      method:'POST',
      body:{ company:s.company, round:s.round, score:pct,
             total_q:total, correct_q:score, passed }
    });
    if(res.success){
      // Update in-memory user object
      currentUser.completedRounds = currentUser.completedRounds||{};
      currentUser.completedRounds[s.company]=[...new Set([...(currentUser.completedRounds[s.company]||[]),s.round])];
      currentUser.scores = currentUser.scores||{};
      currentUser.scores[`${s.company}_${s.round}`]=pct;
    }
  }
  navigate('result');
  document.getElementById('result-emoji').textContent=pct>=70?'🏆':pct>=50?'✅':'📚';
  document.getElementById('result-title').textContent=passed?'Round Cleared!':'Keep Practicing!';
  document.getElementById('result-sub').textContent=auto?'Time expired — auto-submitted':`${s.company} · ${s.round} Round`;
  document.getElementById('result-pct').textContent=pct+'%';
  document.getElementById('result-pct-label').textContent='SCORE';
  const ring=document.getElementById('result-ring');
  ring.style.background=pct>=70?'rgba(56,217,169,.12)':pct>=50?'rgba(245,200,66,.12)':'rgba(249,106,106,.12)';
  ring.style.border=`3px solid ${pct>=70?'var(--gn)':pct>=50?'var(--gd)':'var(--rd)'}`;
  document.getElementById('result-pct').style.color=pct>=70?'var(--gn)':pct>=50?'var(--gd)':'var(--rd)';
  document.getElementById('result-status-badge').innerHTML=`<span class="badge ${passed?'badge-gn':'badge-rd'}">${passed?'✓ PASSED':'✗ FAILED'}</span>`;
  document.getElementById('result-score-text').textContent=`${score} / ${total} ${s.round==='HR'?'answered':'correct'}`;
  if(passed)document.getElementById('result-unlock-msg').classList.remove('hidden');
  else document.getElementById('result-unlock-msg').classList.add('hidden');
}

// ═══════════════════════════════════════
// PERFORMANCE
// ═══════════════════════════════════════
function renderPerformance(){
  refreshCurrentUser();const u=currentUser;const scores=u.scores||{};const el=document.getElementById('perf-content');
  if(!Object.keys(scores).length){el.innerHTML=`<div class="card" style="text-align:center;padding:60px"><div style="font-size:60px;margin-bottom:18px">📊</div><h3 style="font-size:20px;margin-bottom:10px">No Data Yet</h3><p style="color:var(--tx2)">Complete mock exams to see analytics.</p><button class="btn btn-primary" style="margin-top:18px" onclick="navigate('companies')">Start a Test</button></div>`;return;}
  const allV=Object.values(scores);const avg=Math.round(allV.reduce((a,b)=>a+b,0)/allV.length);const best=Math.max(...allV);
  el.innerHTML=`<div class="g3" style="margin-bottom:24px">${statCard('📋','Tests Taken',allV.length,'var(--pu2)')}${statCard('🏆','Best Score',best+'%','var(--gn)')}${statCard('📈','Average',avg+'%','var(--gd)')}</div>
  <div class="g2">${Object.entries(COMPANIES).map(([k,co])=>{
    const cs=co.rounds.map(r=>({r,s:scores[`${k}_${r}`]})).filter(x=>x.s!==undefined);
    if(!cs.length)return'';const ca=Math.round(cs.reduce((a,b)=>a+b.s,0)/cs.length);
    return `<div class="card" style="border:1px solid ${co.color}33">
      <div class="row-between" style="margin-bottom:18px">
        <div class="row" style="gap:12px"><div style="width:40px;height:40px;border-radius:10px;background:${co.color};display:flex;align-items:center;justify-content:center;font-family:var(--ff-head);font-weight:700;font-size:10px;color:#fff;flex-shrink:0">${co.logo}</div><div><div style="font-weight:700;font-size:16px">${k}</div><div style="font-size:11px;color:var(--tx3)">${cs.length}/${co.rounds.length} rounds</div></div></div>
        <div style="font-family:var(--ff-head);font-weight:700;font-size:20px;color:${ca>=70?'var(--gn)':ca>=50?'var(--gd)':'var(--rd)'}">${ca}%</div>
      </div>
      ${cs.map(({r,s})=>`<div class="perf-bar-wrap"><div class="perf-bar-label"><span>${r}</span><span style="font-weight:700;color:${s>=70?'var(--gn)':s>=50?'var(--gd)':'var(--rd)'}">${s}%</span></div><div class="progress"><div class="progress-bar" style="background:${s>=70?'linear-gradient(90deg,var(--gn),#6ee7b7)':s>=50?'linear-gradient(90deg,var(--gd),#fcd34d)':'linear-gradient(90deg,var(--rd),#fca5a5)'};width:${s}%"></div></div></div>`).join('')}
    </div>`;
  }).filter(Boolean).join('')}</div>`;
}

// ═══════════════════════════════════════
// PROFILE
// ═══════════════════════════════════════
// Paint an avatar element: profile picture when set, otherwise the initial.
function paintAvatar(el,u){
  if(!el||!u)return;
  if(u.avatar){
    el.innerHTML=`<img src="${u.avatar}" alt="${(u.name||'User')} profile picture" style="width:100%;height:100%;object-fit:cover;border-radius:50%;display:block"/>`;
  }else{
    el.textContent=(u.name||'U').trim()[0].toUpperCase();
  }
}

let _pendingAvatar=null; // data-URL staged before "Save Changes"

// Read a picked image, downscale it to a 320px square and stage it.
function onAvatarPicked(ev){
  const file=ev.target.files&&ev.target.files[0];
  ev.target.value='';
  if(!file)return;
  if(!/^image\/(png|jpeg|jpg|webp|gif)$/.test(file.type)){toast('Please choose a PNG, JPG, WEBP or GIF image','error');return;}
  if(file.size>8*1024*1024){toast('That image is too big (max 8 MB)','error');return;}
  const reader=new FileReader();
  reader.onload=()=>{
    const img=new Image();
    img.onload=()=>{
      const size=320,cv=document.createElement('canvas');
      cv.width=size;cv.height=size;
      const ctx=cv.getContext('2d');
      const side=Math.min(img.width,img.height);
      ctx.drawImage(img,(img.width-side)/2,(img.height-side)/2,side,side,0,0,size,size);
      _pendingAvatar=cv.toDataURL('image/jpeg',0.85);
      paintAvatar(document.getElementById('profile-avatar'),{name:currentUser.name,avatar:_pendingAvatar});
      toast('Picture ready — click Save Changes to apply');
    };
    img.onerror=()=>toast('Could not read that image','error');
    img.src=reader.result;
  };
  reader.onerror=()=>toast('Could not read that image','error');
  reader.readAsDataURL(file);
}

function removeAvatar(){
  _pendingAvatar='';
  paintAvatar(document.getElementById('profile-avatar'),{name:currentUser.name,avatar:''});
  toast('Picture removed — click Save Changes to apply');
}

function updateBioCount(){
  const v=document.getElementById('pf-bio').value;
  document.getElementById('pf-bio-count').textContent=v.length;
}

function renderProfile(){
  refreshCurrentUser();const u=currentUser;
  _pendingAvatar=null;
  paintAvatar(document.getElementById('profile-avatar'),u);
  document.getElementById('pf-avatar-remove').style.display=u.avatar?'':'none';
  document.getElementById('profile-name-display').textContent=u.name;
  document.getElementById('profile-email-display').textContent=u.email;
  const roleLabel={student:'STUDENT',admin:'ALUMNI',holder:'WEBSITE HOLDER'}[u.role]||u.role;
  const badges=[];
  if(u.role==='student'&&u.rollNo)badges.push(`<span class="badge badge-pu">${u.rollNo}</span>`);
  badges.push(`<span class="badge badge-cy">${roleLabel}</span>`);
  if(u.role==='admin'&&u.position)badges.push(`<span class="badge badge-gn">${u.position}</span>`);
  if(u.role==='admin'&&u.graduation_year)badges.push(`<span class="badge badge-gd">Batch ${u.graduation_year}</span>`);
  document.getElementById('profile-badges').innerHTML=badges.join('');
  document.getElementById('profile-bio-display').textContent=u.bio?`\u201C${u.bio}\u201D`:'';
  document.getElementById('pf-name').value=u.name;document.getElementById('pf-email').value=u.email;
  document.getElementById('pf-branch').value=u.branch||u.degree||'';document.getElementById('pf-cgpa').value=u.cgpa||'';
  document.getElementById('pf-roll').value=u.rollNo||'';document.getElementById('pf-phone').value=u.phone||'';
  document.getElementById('pf-bio').value=u.bio||'';
  updateBioCount();
  // Roll number & CGPA only make sense for students.
  const studentOnly=u.role==='student';
  ['pf-cgpa','pf-roll'].forEach(id=>{
    const wrap=document.getElementById(id).closest('.field');
    if(wrap)wrap.style.display=studentOnly?'':'none';
  });
  // Alumni Connect profile block (company, role, skills, availability)
  if(typeof renderConnectProfile==='function')renderConnectProfile(u);
}

async function saveProfile(){
  const name   = document.getElementById('pf-name').value.trim();
  const branch = document.getElementById('pf-branch').value.trim();
  const cgpa   = parseFloat(document.getElementById('pf-cgpa').value)||null;
  const phone  = document.getElementById('pf-phone').value.trim();
  const bio    = document.getElementById('pf-bio').value.trim().slice(0,300);
  const body   = {name,branch,cgpa,phone,bio};
  if(typeof connectProfileBody==='function')Object.assign(body, connectProfileBody());
  if(_pendingAvatar!==null)body.avatar=_pendingAvatar;
  const res = await api('/profile.php',{method:'POST', body});
  if(res.success){
    currentUser.name=name||currentUser.name;
    currentUser.branch=branch; currentUser.cgpa=cgpa; currentUser.phone=phone;
    currentUser.bio=res.bio!==undefined?res.bio:bio;
    if(res.avatar!==undefined)currentUser.avatar=res.avatar;
    else if(_pendingAvatar!==null)currentUser.avatar=_pendingAvatar;
    _pendingAvatar=null;
    renderProfile();
    document.getElementById('sidebar-user-name').textContent=currentUser.name;
    paintAvatar(document.getElementById('sidebar-avatar'),currentUser);
    toast('Profile saved!');
  } else {
    toast(res.message||'Could not save profile','error');
  }
}

// ═══════════════════════════════════════
// CHAT (Student ↔ Alumni messaging)
// ═══════════════════════════════════════
let _chatContacts=[],_chatActiveId=null,_chatPollInt=null,_chatThreadPollInt=null,_chatThreadSig=null;

function chatInitials(name){return (name||'?').trim().split(/\s+/).map(p=>p[0]).slice(0,2).join('').toUpperCase();}
function chatTime(iso){
  if(!iso)return'';
  const d=new Date(iso),now=new Date();
  const sameDay=d.toDateString()===now.toDateString();
  return sameDay?d.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}):d.toLocaleDateString([],{month:'short',day:'numeric'});
}

// ── Presence (Online / Offline) ─────────────────────────────────
// Works for every portal (Student & Admin/Alumni): a heartbeat keeps the
// logged-in user marked online, and the chat header shows the contact's
// live status.
let _presenceInt=null;
function startPresenceHeartbeat(){
  stopPresenceHeartbeat();
  api('/chat.php/presence/ping',{method:'POST'}).catch(()=>{});
  _presenceInt=setInterval(()=>{
    if(!currentUser)return;
    api('/chat.php/presence/ping',{method:'POST'}).catch(()=>{});
  },30000);
}
function stopPresenceHeartbeat(){
  if(_presenceInt){clearInterval(_presenceInt);_presenceInt=null;}
}
function presenceText(c){
  if(c&&c.online)return 'Online';
  if(c&&c.last_seen)return 'Offline · last seen '+chatTime(c.last_seen);
  return 'Offline';
}
function presencePill(c){
  const on=!!(c&&c.online);
  return `<span class="presence-pill ${on?'presence-on':'presence-off'}"><span class="presence-dot"></span>${presenceText(c)}</span>`;
}

async function renderChat(){
  document.getElementById('chat-page-title').textContent=currentUser.role==='student'?'Messages':'Messages — Students';
  document.getElementById('chat-page-subtitle').textContent=currentUser.role==='student'?'Chat directly with placement alumni':'Chat directly with students';
  await loadChatContacts();
  stopChatPolling();
  _chatPollInt=setInterval(loadChatContacts,5000);
}

function stopChatPolling(){
  if(_chatPollInt){clearInterval(_chatPollInt);_chatPollInt=null;}
  if(_chatThreadPollInt){clearInterval(_chatThreadPollInt);_chatThreadPollInt=null;}
}

async function loadChatContacts(){
  const res=await api('/chat.php/contacts');
  if(!res.success){
    document.getElementById('chat-contacts').innerHTML=`<div style="padding:20px;color:var(--tx3);font-size:13px">${res.message||'Could not load contacts'}</div>`;
    return;
  }
  _chatContacts=res.contacts;
  renderChatContacts();
}

function renderChatContacts(){
  const box=document.getElementById('chat-contacts');
  if(!_chatContacts.length){
    box.innerHTML=`<div style="padding:20px;color:var(--tx3);font-size:13px;text-align:center">No contacts yet</div>`;
    return;
  }
  box.innerHTML=_chatContacts.map(c=>`
    <div class="chat-contact-item ${c.id===_chatActiveId?'active':''}" onclick="openChatThread('${c.id}')">
      <div class="avatar-wrap">
        <div class="avatar-sm">${chatInitials(c.name)}</div>
        <span class="presence-dot presence-dot-avatar ${c.online?'presence-on':'presence-off'}" title="${c.online?'Online':'Offline'}"></span>
      </div>
      <div style="flex:1;min-width:0">
        <div class="row-between" style="gap:6px">
          <span class="chat-contact-name">${c.name}</span>
          ${c.last_at?`<span style="font-size:10px;color:var(--tx3);flex-shrink:0">${chatTime(c.last_at)}</span>`:''}
        </div>
        <div class="chat-contact-preview">${c.last_message?c.last_message:(c.branch||'Say hello 👋')}</div>
      </div>
      ${c.unread?`<span class="chat-unread-dot">${c.unread}</span>`:''}
    </div>`).join('');
}

async function openChatThread(userId){
  _chatActiveId=userId;
  _chatThreadSig=null;
  renderChatContacts();
  await loadChatThread(true);
  if(_chatThreadPollInt)clearInterval(_chatThreadPollInt);
  _chatThreadPollInt=setInterval(()=>loadChatThread(false),4000);
}

async function loadChatThread(scrollDown){
  if(!_chatActiveId)return;
  const res=await api('/chat.php/thread/'+_chatActiveId);
  if(!res.success){toast(res.message||'Could not load conversation','error');return;}
  const panel=document.getElementById('chat-panel');

  // Polling refreshes this thread every few seconds. Preserve the current
  // draft, selection, focus AND scroll position before replacing the panel
  // markup so typing/reading is never interrupted or jumped to the top.
  const oldInput=document.getElementById('chat-input');
  const draft=oldInput?oldInput.value:'';
  const inputHadFocus=oldInput===document.activeElement;
  const selectionStart=oldInput?oldInput.selectionStart:null;
  const selectionEnd=oldInput?oldInput.selectionEnd:null;

  const oldBox=document.getElementById('chat-messages');
  const oldScrollTop=oldBox?oldBox.scrollTop:null;
  const wasAtBottom=oldBox?(oldBox.scrollHeight-oldBox.scrollTop-oldBox.clientHeight<40):true;

  // Skip re-rendering entirely when nothing changed — this is what caused the
  // panel to jump while the user was typing or reading older messages.
  const signature=_chatActiveId+'|'+res.contact.name+'|'+(res.contact.online?'on':'off')+'|'+res.messages.map(m=>m.id+':'+m.text+':'+m.created_at).join('~');
  if(oldBox && signature===_chatThreadSig){
    if(scrollDown===true)oldBox.scrollTop=oldBox.scrollHeight;
    return;
  }
  _chatThreadSig=signature;

  panel.innerHTML=`
    <div class="chat-panel-header">
      <div class="avatar-wrap">
        <div class="avatar-sm">${chatInitials(res.contact.name)}</div>
        <span class="presence-dot presence-dot-avatar ${res.contact.online?'presence-on':'presence-off'}"></span>
      </div>
      <div>
        <div class="row" style="align-items:center;gap:8px"><span style="font-weight:700;font-size:15px">${res.contact.name}</span>${presencePill(res.contact)}</div>
        <div style="font-size:12px;color:var(--tx3)">${res.contact.branch||res.contact.email}</div>
      </div>
    </div>
    <div class="chat-messages" id="chat-messages">
      ${res.messages.length?res.messages.map(m=>`
        <div class="chat-bubble ${m.from_me?'chat-bubble-mine':'chat-bubble-theirs'}">
          <div>${(m.text||'').replace(/</g,'&lt;')}</div>
          <div class="chat-bubble-time">${chatTime(m.created_at)}</div>
        </div>`).join(''):'<div style="color:var(--tx3);text-align:center;font-size:13px;margin:auto">No messages yet — say hello 👋</div>'}
    </div>
    <div class="chat-input-row">
      <input class="inp" id="chat-input" placeholder="Type a message..." onkeydown="if(event.key==='Enter')sendChatMessage()"/>
      <button class="btn btn-primary" onclick="sendChatMessage()">Send</button>
    </div>`;

  const newInput=document.getElementById('chat-input');
  if(newInput){
    newInput.value=draft;
    if(inputHadFocus){
      newInput.focus();
      if(selectionStart!==null&&selectionEnd!==null){
        newInput.setSelectionRange(selectionStart,selectionEnd);
      }
    }
  }

  const box=document.getElementById('chat-messages');
  if(box){
    if(scrollDown===true||wasAtBottom){
      box.scrollTop=box.scrollHeight;
    } else if(oldScrollTop!==null){
      box.scrollTop=oldScrollTop;
    }
  }
  const idx=_chatContacts.findIndex(c=>c.id===_chatActiveId);
  if(idx>-1)_chatContacts[idx].unread=0;
}


async function sendChatMessage(){
  const input=document.getElementById('chat-input');
  const text=input.value.trim();
  if(!text||!_chatActiveId)return;
  input.value='';
  const res=await api('/chat.php/send',{method:'POST',body:{to:_chatActiveId,text}});
  if(res.success){
    await loadChatThread(true);
    await loadChatContacts();
  } else {
    toast(res.message||'Could not send message','error');
    const currentInput=document.getElementById('chat-input');
    if(currentInput){
      currentInput.value=text;
      currentInput.focus();
    }
  }
}

// ═══════════════════════════════════════
// ADMIN
// ═══════════════════════════════════════
async function renderAdminDashboard(){
  const res = await api('/admin_students.php');
  const students = res.success ? res.students.map(s=>({...s, rollNo:s.roll_no||s.rollNo||''})) : [];
  _allStudents = students; // keep cache in sync so openStudentDetail can find this student too
  const totalExams=students.reduce((s,u)=>s+Object.keys(u.scores||{}).length,0);
  const totalQ=Object.values(QBANK).reduce((s,q)=>s+q.length,0);
  document.getElementById('admin-stats').innerHTML=`${statCard('👥','Students',students.length,'var(--pu2)')}${statCard('🏢','Companies',Object.keys(COMPANIES).length,'var(--gd)')}${statCard('📝','Questions',totalQ,'var(--cy)')}${statCard('✅','Exams',totalExams,'var(--gn)')}`;
  const recent=students.slice(-5).reverse().map(s=>`<div class="row-between" style="padding:10px 0;border-bottom:1px solid var(--bdr)">
    <div class="row" style="gap:10px"><div style="width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,var(--pu),#8b5cf6);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;flex-shrink:0">${s.name[0]}</div>
    <div><div style="font-weight:600;font-size:13px">${s.name}</div><div style="font-size:11px;color:var(--tx3)">${s.rollNo} · ${s.branch||'CS'}</div></div></div>
    <button class="btn btn-ghost btn-sm" onclick="openStudentDetail('${s.id}')">View</button>
  </div>`).join('');
  document.getElementById('admin-overview').innerHTML=`
    <div class="card"><h3 style="font-family:var(--ff-head);font-size:16px;font-weight:600;margin-bottom:16px">Recent Students</h3>${recent||'<div style="color:var(--tx3);text-align:center;padding:20px">No students yet</div>'}</div>
    <div class="card"><h3 style="font-family:var(--ff-head);font-size:16px;font-weight:600;margin-bottom:16px">Question Bank</h3>
    ${Object.entries(QBANK).map(([t,qs])=>`<div style="margin-bottom:12px"><div class="row-between" style="margin-bottom:6px;font-size:13px"><span style="font-weight:600">${t}</span><span style="color:var(--tx2)">${qs.length} questions</span></div><div class="progress"><div class="progress-bar" style="width:${Math.round((qs.length/10)*100)}%"></div></div></div>`).join('')}</div>`;
}
let _allStudents = [];
let _adminRanking = [], _holderRanking = [];
async function renderAdminStudents(){
  document.getElementById('admin-students-count').textContent='Loading...';
  const res = await api('/admin_students.php');
  if(res.success){
    _allStudents = res.students.map(s=>({...s, rollNo:s.roll_no||s.rollNo||''}));
    document.getElementById('admin-students-count').textContent=_allStudents.length+' registered students';
    renderStudentsTable(_allStudents);
  } else {
    document.getElementById('admin-students-count').textContent='Failed to load';
  }
}
function filterStudents(){
  const q=document.getElementById('student-search').value.toLowerCase();
  renderStudentsTable(_allStudents.filter(s=>
    s.name.toLowerCase().includes(q)||s.email.toLowerCase().includes(q)||(s.rollNo||'').toLowerCase().includes(q)
  ));
}
function renderStudentsTable(students){
  const rows=students.map(s=>{
    const tests=Object.keys(s.scores||{}).length;const avg=tests?Math.round(Object.values(s.scores).reduce((a,b)=>a+b,0)/tests):0;
    return `<tr><td><div class="row" style="gap:9px"><div style="width:30px;height:30px;border-radius:50%;background:linear-gradient(135deg,var(--pu),#8b5cf6);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px;flex-shrink:0">${s.name[0]}</div><div><div style="font-weight:600">${s.name}</div><div style="font-size:11px;color:var(--tx3)">${s.email}</div></div></div></td>
    <td>${s.roll_no||s.rollNo||'—'}</td><td>${s.branch||'CS'}</td><td>${s.cgpa||'—'}</td><td>${tests}</td>
    <td>${tests?`<span class="badge ${avg>=70?'badge-gn':avg>=50?'badge-gd':'badge-rd'}">${avg}%</span>`:'—'}</td>
    <td><button class="btn btn-ghost btn-sm" onclick="openStudentDetail('${s.id}')">Details</button></td></tr>`;
  }).join('');
  document.getElementById('students-table').innerHTML=`<thead><tr><th>Student</th><th>Roll No</th><th>Branch</th><th>CGPA</th><th>Tests</th><th>Avg</th><th>Action</th></tr></thead><tbody>${rows||'<tr><td colspan="7" style="text-align:center;padding:36px;color:var(--tx3)">No students found</td></tr>'}</tbody>`;
}
function openStudentDetail(id){
  const s=_allStudents.find(u=>String(u.id)===String(id));if(!s)return;
  const scoreVals=Object.values(s.scores||{}).map(x=>typeof x==='object'?x.score:x);
  const tests=scoreVals.length;const avg=tests?Math.round(scoreVals.reduce((a,b)=>a+b,0)/tests):0;
  const scoreRows=Object.entries(s.scores||{}).map(([k,v])=>{const sc=typeof v==='object'?v.score:v;const[co,rnd]=k.split('_');return `<div class="row-between" style="padding:8px 0;border-bottom:1px solid var(--bdr)"><div><span style="font-weight:600;font-size:13px">${co}</span><span style="color:var(--tx3);font-size:12px"> — ${rnd}</span></div><span class="badge ${sc>=70?'badge-gn':sc>=50?'badge-gd':'badge-rd'}">${sc}%</span></div>`;}).join('');
  document.getElementById('student-detail-content').innerHTML=`
    <div class="row" style="gap:14px;margin-bottom:18px">
      <div style="width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,var(--pu),#8b5cf6);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:22px;color:#fff;flex-shrink:0">${s.name[0]}</div>
      <div><div style="font-size:18px;font-weight:700">${s.name}</div><div style="color:var(--tx2);font-size:12px">${s.email}</div></div>
    </div>
    <div class="student-detail-grid">
      <div class="detail-item"><div class="di-label">Roll Number</div><div class="di-val">${s.roll_no||s.rollNo||'—'}</div></div>
      <div class="detail-item"><div class="di-label">Branch</div><div class="di-val">${s.branch||'—'}</div></div>
      <div class="detail-item"><div class="di-label">CGPA</div><div class="di-val">${s.cgpa||'—'}</div></div>
      <div class="detail-item"><div class="di-label">Phone</div><div class="di-val">${s.phone||'—'}</div></div>
      <div class="detail-item"><div class="di-label">Tests Taken</div><div class="di-val" style="color:var(--pu2)">${tests}</div></div>
      <div class="detail-item"><div class="di-label">Average Score</div><div class="di-val" style="color:${avg>=70?'var(--gn)':avg>=50?'var(--gd)':'var(--rd)'}">${tests?avg+'%':'—'}</div></div>
    </div>
    ${tests?`<div style="margin-top:18px"><div style="font-size:12px;font-weight:700;color:var(--tx3);letter-spacing:.5px;margin-bottom:10px">EXAM RESULTS</div>${scoreRows}</div>`:'<div style="text-align:center;padding:20px;color:var(--tx3)">No exams taken yet</div>'}`;
  document.getElementById('student-detail-modal').classList.remove('hidden');
}
// ── Alumni Portal: role → companies mapping ──────────────────
// Extra companies that only make sense for certain alumni roles
// (start-ups / product houses for Entrepreneurship, R&D labs for
// Higher Studies). They use the exact same card shape as COMPANIES.
const ROLE_EXTRA_COMPANIES = {
  Freshworks:{name:"Freshworks Inc.",logo:"FRS",color:"#0f7c5a",accent:"#25c16f",difficulty:"Hard",difBadge:"badge-rd",rounds:["Aptitude","Technical","Coding","HR"],desc:"Chennai-born SaaS unicorn — a classic student-to-founder success story.",package:"₹8–18 LPA",slots:70},
  Razorpay:{name:"Razorpay Software Pvt Ltd",logo:"RZP",color:"#0b3fa8",accent:"#3b82f6",difficulty:"Hard",difBadge:"badge-rd",rounds:["Technical","Coding","System Design","HR"],desc:"Fintech unicorn founded by campus graduates. Strong product & payments focus.",package:"₹10–24 LPA",slots:45},
  Zerodha:{name:"Zerodha Broking Ltd",logo:"ZER",color:"#387ed1",accent:"#60a5fa",difficulty:"Hard",difBadge:"badge-rd",rounds:["Technical","Coding","HR"],desc:"Bootstrapped fintech giant — a model case study for self-funded entrepreneurship.",package:"₹9–20 LPA",slots:30},
  CRED:{name:"CRED (Dreamplug Technologies)",logo:"CRD",color:"#111827",accent:"#a78bfa",difficulty:"Very Hard",difBadge:"badge-rd",rounds:["Technical","Coding","Design","HR"],desc:"Design-led consumer start-up. Great exposure to zero-to-one product building.",package:"₹12–30 LPA",slots:25},
  Ather:{name:"Ather Energy",logo:"ATH",color:"#0d5c46",accent:"#34d399",difficulty:"Hard",difBadge:"badge-rd",rounds:["Technical","Coding","HR"],desc:"EV start-up building hardware + software in-house. Deep-tech entrepreneurship.",package:"₹7–16 LPA",slots:35},
  ISRO:{name:"Indian Space Research Organisation",logo:"ISR",color:"#1d4ed8",accent:"#f59e0b",difficulty:"Very Hard",difBadge:"badge-rd",rounds:["Written","Technical","Interview"],desc:"National space agency — research-heavy roles for higher-studies aspirants.",package:"₹7–12 LPA",slots:20},
  DRDO:{name:"Defence Research & Development Organisation",logo:"DRD",color:"#14532d",accent:"#65a30d",difficulty:"Very Hard",difBadge:"badge-rd",rounds:["Written","Technical","Interview"],desc:"Defence R&D labs. Ideal for M.Tech/PhD-bound alumni and researchers.",package:"₹8–14 LPA",slots:18},
  Toptal:{name:"Toptal (Freelance Network)",logo:"TPL",color:"#204ecf",accent:"#60a5fa",difficulty:"Hard",difBadge:"badge-rd",rounds:["Screening","Technical","Live Project"],desc:"Curated freelance network — top 3% talent, great for independent developers.",package:"$25–70 /hr",slots:40},
  Upwork:{name:"Upwork Global Inc.",logo:"UPW",color:"#14a800",accent:"#4ade80",difficulty:"Medium",difBadge:"badge-gd",rounds:["Profile Review","Client Interview"],desc:"World's largest freelancing marketplace for first client wins.",package:"₹20k–2L /month",slots:100},
  Fiverr:{name:"Fiverr International",logo:"FVR",color:"#1dbf73",accent:"#34d399",difficulty:"Easy",difBadge:"badge-gn",rounds:["Gig Setup","Client Orders"],desc:"Gig-based marketplace — ideal to build a portfolio and recurring clients.",package:"₹10k–1L /month",slots:120},
  Byjus:{name:"BYJU'S (Think & Learn)",logo:"BYJ",color:"#4c2a86",accent:"#a78bfa",difficulty:"Medium",difBadge:"badge-gd",rounds:["Demo Class","Subject Test","HR"],desc:"EdTech major hiring subject experts and academic mentors.",package:"₹4–9 LPA",slots:80},
  Unacademy:{name:"Unacademy (Sorting Hat Technologies)",logo:"UNA",color:"#08bd80",accent:"#34d399",difficulty:"Medium",difBadge:"badge-gd",rounds:["Demo Lecture","Subject Test","HR"],desc:"Live-learning platform for educators across academic and exam tracks.",package:"₹5–12 LPA",slots:60},
  SBI:{name:"State Bank of India",logo:"SBI",color:"#22409a",accent:"#60a5fa",difficulty:"Hard",difBadge:"badge-rd",rounds:["Prelims","Mains","Interview"],desc:"Largest public sector bank — PO/Clerk recruitment through national exams.",package:"₹8–12 LPA",slots:200},
  BHEL:{name:"Bharat Heavy Electricals Ltd",logo:"BHE",color:"#b91c1c",accent:"#f87171",difficulty:"Hard",difBadge:"badge-rd",rounds:["GATE Score","Technical","Interview"],desc:"Maharatna PSU recruiting engineers through GATE.",package:"₹9–14 LPA",slots:50},
  IndianRailways:{name:"Indian Railways (RRB)",logo:"RRB",color:"#0f766e",accent:"#2dd4bf",difficulty:"Medium-Hard",difBadge:"badge-or",rounds:["CBT 1","CBT 2","Document Verification"],desc:"Largest government employer — technical and non-technical exam cycles.",package:"₹5–9 LPA",slots:300},
  Amul:{name:"Amul (GCMMF)",logo:"AML",color:"#e11d48",accent:"#fb7185",difficulty:"Medium",difBadge:"badge-gd",rounds:["Aptitude","Interview"],desc:"Cooperative FMCG giant — a model for family and community-run businesses.",package:"₹4–8 LPA",slots:60},
  Nykaa:{name:"Nykaa (FSN E-Commerce)",logo:"NYK",color:"#e91e63",accent:"#f9a8d4",difficulty:"Medium-Hard",difBadge:"badge-or",rounds:["Aptitude","Technical","HR"],desc:"Founder-led D2C brand — great reference for taking a shop online.",package:"₹6–14 LPA",slots:40}
};

// Every company card the Alumni Portal can show.
const ALL_COMPANIES = Object.assign({}, COMPANIES, ROLE_EXTRA_COMPANIES);

// Which companies each alumni role should see.
const ROLE_COMPANIES = {
  'Placement Coordinator':        {note:'High-volume campus recruiters you coordinate drives with.', keys:['TCS','Infosys','Wipro','Cognizant','HCL','Capgemini','Accenture','LTI']},
  'Alumni Mentor':                {note:'Product companies where mentoring on DSA & interviews matters most.', keys:['Amazon','Microsoft','Zoho','IBM','LTI','Freshworks','Razorpay']},
  'Guest Lecturer':               {note:'Technology-deep companies whose stacks make great lecture material.', keys:['Microsoft','IBM','Amazon','Zoho','Accenture','ISRO']},
  'Training & Placement Officer': {note:'The full placement partner list across every category.', keys:Object.keys(ALL_COMPANIES)},
  'Entrepreneurship':             {note:'Start-ups, unicorns and product houses built by founders.', keys:['Zoho','Freshworks','Razorpay','Zerodha','CRED','Ather','Nykaa']},
  'Higher Studies / Research':    {note:'Research labs and R&D-heavy organisations for higher-studies paths.', keys:['ISRO','DRDO','IBM','Microsoft','Amazon']},
  'Freelancing':                  {note:'Marketplaces and product companies that hire independent talent.', keys:['Upwork','Fiverr','Toptal','CRED','Razorpay','Zoho']},
  'Parents / Family Business':    {note:'Businesses and platforms useful for modernising a family business.', keys:['Amul','Nykaa','Amazon','Zoho','Razorpay']},
  'Government Jobs':              {note:'PSUs and government bodies recruiting through national exams.', keys:['ISRO','DRDO','BHEL','SBI','IndianRailways']},
  'Teaching Field':               {note:'Schools, edtech platforms and academia-facing employers.', keys:['Byjus','Unacademy','IBM','Zoho','Microsoft']}
};

// Alumni login field (chosen at login) → Companies page role.
const FIELD_TO_COMPANY_ROLE = {
  'placement':'Placement Coordinator',
  'entrepreneur':'Entrepreneurship',
  'freelancing':'Freelancing',
  'research':'Higher Studies / Research',
  'family-business':'Parents / Family Business',
  'government':'Government Jobs',
  'teaching':'Teaching Field'
};

let adminCompanyRole = '';

function setAdminCompanyRole(role){
  adminCompanyRole = role;
  renderAdminCompanies();
}

function renderAdminCompanies(){
  const roles = Object.keys(ROLE_COMPANIES);

  // The role chosen on the Alumni page always wins and is applied directly —
  // no second click needed, and no unrelated role tabs are shown.
  const fromField = alumniField && FIELD_TO_COMPANY_ROLE[alumniField];
  const locked = !!(fromField && ROLE_COMPANIES[fromField]);
  if(locked){
    adminCompanyRole = fromField;
  } else if(!adminCompanyRole){
    const mine = currentUser && currentUser.position;
    adminCompanyRole = (mine && ROLE_COMPANIES[mine]) ? mine : roles[0];
  }
  const conf = ROLE_COMPANIES[adminCompanyRole] || ROLE_COMPANIES[roles[0]];

  const sel = document.getElementById('admin-companies-role');
  if(sel){
    const opts = locked ? [adminCompanyRole] : roles;
    sel.innerHTML = opts.map(r=>`<option value="${r}"${r===adminCompanyRole?' selected':''}>${r}</option>`).join('');
    const selWrap = sel.closest('.field') || sel;
    selWrap.style.display = locked ? 'none' : '';
  }

  const tabs = document.getElementById('admin-companies-roletabs');
  if(tabs){
    tabs.style.display = locked ? 'none' : '';
    tabs.innerHTML = locked ? '' : roles.map(r=>`<button class="btn btn-sm ${r===adminCompanyRole?'btn-primary':'btn-ghost'}" onclick="setAdminCompanyRole('${r.replace(/'/g,"\\'")}')">${r}</button>`).join('');
  }

  const sub = document.getElementById('admin-companies-sub');
  if(sub) sub.textContent = `${adminCompanyRole} · ${conf.note}`;


  const entries = conf.keys.filter(k=>ALL_COMPANIES[k]).map(k=>[k,ALL_COMPANIES[k]]);
  document.getElementById('admin-companies-grid').innerHTML = entries.length ? entries.map(([k,co])=>`

    <div class="card" style="border:1px solid ${co.color}33">
      <div class="row" style="gap:14px;margin-bottom:18px">
        <div class="co-logo" style="width:50px;height:50px;border-radius:13px;background:${co.color};font-size:11px;flex-shrink:0">${co.logo}</div>
        <div><h3 style="font-family:var(--ff-head);font-size:16px;font-weight:700;margin-bottom:3px">${co.name}</h3><p style="font-size:12px;color:var(--tx3)">${co.desc}</p></div>
      </div>
      <div class="g2" style="margin-bottom:14px">
        <div style="background:var(--surf2);border-radius:9px;padding:12px"><div style="font-size:10px;color:var(--tx3);margin-bottom:5px;font-weight:700;letter-spacing:.5px">PACKAGE</div><div style="font-weight:700;color:var(--gd);font-size:14px">${co.package}</div></div>
        <div style="background:var(--surf2);border-radius:9px;padding:12px"><div style="font-size:10px;color:var(--tx3);margin-bottom:5px;font-weight:700;letter-spacing:.5px">SEATS</div><div style="font-weight:700;font-size:14px">${co.slots}</div></div>
        <div style="background:var(--surf2);border-radius:9px;padding:12px"><div style="font-size:10px;color:var(--tx3);margin-bottom:5px;font-weight:700;letter-spacing:.5px">DIFFICULTY</div><span class="badge ${co.difBadge}" style="font-size:10px">${co.difficulty}</span></div>
        <div style="background:var(--surf2);border-radius:9px;padding:12px"><div style="font-size:10px;color:var(--tx3);margin-bottom:5px;font-weight:700;letter-spacing:.5px">ROUNDS</div><div style="font-weight:700;font-size:14px">${co.rounds.length}</div></div>
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap">${co.rounds.map(r=>`<span class="round-pill" style="background:${co.color}20;color:${co.accent};border:1px solid ${co.color}40">${r}</span>`).join('')}</div>
    </div>`).join('') : '<div class="card" style="text-align:center;color:var(--tx3);padding:26px">No companies mapped to this role yet.</div>';
}
function renderAdminQuestions(){
  document.getElementById('qbank-tabs').innerHTML=Object.keys(QBANK).map(t=>`<button class="btn ${qbankActiveTab===t?'btn-primary':'btn-ghost'} btn-sm" onclick="qbankActiveTab='${t}';renderAdminQuestions()">${t} (${QBANK[t].length})</button>`).join('');
  document.getElementById('qbank-list').innerHTML=QBANK[qbankActiveTab].map((q,i)=>{
    const isCode=q.lang,isHR=q.placeholder;
    return `<div class="card card-sm"><div class="row" style="gap:8px;margin-bottom:10px"><span class="badge badge-pu">Q${i+1}</span><span class="badge badge-cy">${qbankActiveTab}</span>${isCode?'<span class="badge badge-gd">Coding</span>':isHR?'<span class="badge badge-gn">HR</span>':'<span class="badge badge-or">MCQ</span>'}</div>
    <p style="font-size:14px;font-weight:500;margin-bottom:${q.opts?12:0}px">${q.text||q.text}</p>
    ${q.opts?`<div style="display:flex;gap:7px;flex-wrap:wrap">${q.opts.map((o,idx)=>`<span style="padding:4px 11px;border-radius:8px;font-size:12px;background:${idx===q.ans?'rgba(56,217,169,.12)':'var(--surf2)'};border:1px solid ${idx===q.ans?'rgba(56,217,169,.4)':'var(--bdr)'};color:${idx===q.ans?'var(--gn)':'var(--tx2)'}">${String.fromCharCode(65+idx)}: ${o}</span>`).join('')}</div>${q.exp?`<div style="margin-top:9px;font-size:12px;color:var(--tx3)">💡 ${q.exp}</div>`:''}`:''}
    </div>`;
  }).join('');
}
async function renderAdminResults(){
  document.getElementById('results-count').textContent='Loading...';
  const res = await api('/admin_results.php');
  if(!res.success){ document.getElementById('results-count').textContent='Failed to load'; return; }
  const all = res.results;
  document.getElementById('results-count').textContent=all.length+' total exam records';
  const rows=all.map(r=>{
    const co=r.company; const sc=r.score;
    return `<tr><td style="font-weight:600">${r.name}</td><td style="color:var(--tx2)">${r.roll_no||'—'}</td>
    <td><div class="row" style="gap:7px"><div style="width:22px;height:22px;border-radius:5px;background:${COMPANIES[co]?.color||'#555'};display:flex;align-items:center;justify-content:center;font-size:8px;font-weight:800;color:#fff;flex-shrink:0">${COMPANIES[co]?.logo||co[0]}</div>${co}</div></td>
    <td><span class="badge badge-pu" style="font-size:10px">${r.round}</span></td>
    <td><span class="badge ${sc>=70?'badge-gn':sc>=50?'badge-gd':'badge-rd'}">${sc}%</span></td>
    <td><span class="badge ${sc>=50?'badge-gn':'badge-rd'}" style="font-size:10px">${sc>=50?'PASS':'FAIL'}</span></td>
    <td style="font-size:11px;color:var(--tx3)">${r.taken_at?r.taken_at.slice(0,10):'—'}</td></tr>`;
  }).join('');
  document.getElementById('results-table').innerHTML=`<thead><tr><th>Student</th><th>Roll</th><th>Company</th><th>Round</th><th>Score</th><th>Status</th><th>Date</th></tr></thead><tbody>${rows||'<tr><td colspan="7" style="text-align:center;padding:36px;color:var(--tx3)">No results yet</td></tr>'}</tbody>`;
}

// ═══════════════════════════════════════
// STUDENT RANKING (Alumni + Admin portals)
// Divides all students into 4 tiers by average exam score —
// mirrors the "360 students ÷ 4 = 90 per tier" leaderboard idea.
// ═══════════════════════════════════════
function tierColor(key){return {high:'var(--gn)',second:'var(--cy)',third:'var(--gd)',low:'var(--rd)'}[key]||'var(--pu2)';}
async function renderAdminRanking(){await loadRanking('admin');}
async function renderHolderRanking(){await loadRanking('holder');}
async function loadRanking(prefix){
  document.getElementById(prefix+'-ranking-count').textContent='Loading...';
  const branch=document.getElementById(prefix+'-ranking-branch').value.trim();
  const section=document.getElementById(prefix+'-ranking-section').value.trim();
  const year=document.getElementById(prefix+'-ranking-year').value.trim();
  const params=new URLSearchParams();
  if(branch)params.set('branch',branch); if(section)params.set('section',section); if(year)params.set('year',year);
  const qs=params.toString();
  const res=await api('/ranking.php'+(qs?('?'+qs):''));
  if(!res.success){document.getElementById(prefix+'-ranking-count').textContent='Failed to load';return;}
  if(prefix==='admin')_adminRanking=res.ranking; else _holderRanking=res.ranking;
  document.getElementById(prefix+'-ranking-count').textContent=`${res.total} ranked student${res.total===1?'':'s'}${res.not_attempted?(' · '+res.not_attempted+' yet to attempt an exam'):''}`;
  document.getElementById(prefix+'-ranking-tiers').innerHTML=res.tiers.map(t=>statCard(t.emoji,t.short,t.count,tierColor(t.key))).join('');
  renderRankingGrid(prefix,res.ranking);
}
function filterRanking(prefix){
  const q=document.getElementById(prefix+'-ranking-search').value.toLowerCase();
  const source=prefix==='admin'?_adminRanking:_holderRanking;
  renderRankingGrid(prefix,source.filter(s=>s.name.toLowerCase().includes(q)||(s.roll_no||'').toLowerCase().includes(q)));
}
function renderRankingGrid(prefix,list){
  document.getElementById(prefix+'-ranking-grid').innerHTML=list.map(s=>`
    <div class="card">
      <div class="row-between" style="margin-bottom:12px">
        <span class="badge ${s.tier_badge}" style="font-size:11px">${s.tier_emoji} ${s.tier_label}</span>
        <span style="font-size:11px;color:var(--tx3);font-weight:700">#${s.rank}</span>
      </div>
      <div class="row" style="gap:12px;margin-bottom:12px">
        <div style="width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,var(--pu),#8b5cf6);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:17px;color:#fff;flex-shrink:0">${s.name[0]}</div>
        <div><div style="font-weight:700;font-size:14px">${s.name}</div><div style="font-size:11px;color:var(--tx3)">${s.roll_no||'—'} · ${s.branch||'—'}${s.section?(' · Sec '+s.section):''}</div></div>
      </div>
      <div class="row-between" style="font-size:12px">
        <span style="color:var(--tx3)">${s.year?('Year '+s.year):''}</span>
        <span style="font-weight:700;color:var(--pu2)">Avg ${s.avg_score}%</span>
      </div>
    </div>`).join('')||'<div style="color:var(--tx3);grid-column:1/-1;text-align:center;padding:40px">No students match yet — they need to take at least one exam to appear on the leaderboard.</div>';
}
function exportRankingCSV(prefix){
  const list=prefix==='admin'?_adminRanking:_holderRanking;
  if(!list.length){toast('Nothing to export yet','error');return;}
  const header=['Rank','Name','Roll No','Branch','Section','Year','Avg Score','Tier'];
  const rows=list.map(s=>[s.rank,s.name,s.roll_no,s.branch,s.section,s.year,s.avg_score,s.tier_label]);
  const csv=[header,...rows].map(r=>r.map(v=>`"${String(v??'').replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob=new Blob([csv],{type:'text/csv'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');a.href=url;a.download='student_ranking.csv';a.click();
  URL.revokeObjectURL(url);
}

// ═══════════════════════════════════════
// WEBSITE HOLDER
// ═══════════════════════════════════════
async function renderHolderDashboard(){
  const [adminRes, studentRes, pendingList] = await Promise.all([api('/admin_manage.php'), api('/admin_students.php'), refreshPendingAlumniBadge()]);
  const admins = adminRes.success ? adminRes.admins : [];
  const students = studentRes.success ? studentRes.students : [];
  const pending = pendingList||[];
  const totalExams=students.reduce((s,u)=>s+Object.keys(u.scores||{}).length,0);
  document.getElementById('holder-stats').innerHTML=`${statCard('🛡','Alumni',admins.length,'var(--gn)')}${statCard('⏳','Pending Approval',pending.length,pending.length?'var(--gd)':'var(--tx3)')}${statCard('👥','Students',students.length,'var(--pu2)')}${statCard('🏢','Companies',Object.keys(COMPANIES).length,'var(--gd)')}`;
  document.getElementById('holder-summary').innerHTML=`<div class="g2">
    <div>
      <div style="font-size:12px;color:var(--tx3);font-weight:700;letter-spacing:.5px;margin-bottom:12px">REGISTERED ADMINS</div>
      ${admins.map(a=>`<div class="row-between" style="padding:9px 0;border-bottom:1px solid var(--bdr)">
        <div class="row" style="gap:9px"><div style="width:30px;height:30px;border-radius:50%;background:linear-gradient(135deg,var(--gn),#6ee7b7);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px;flex-shrink:0;color:#0a2a1f">${a.name[0]}</div>
        <div><div style="font-weight:600;font-size:13px">${a.name}</div><div style="font-size:11px;color:var(--tx3)">${a.dept||'Administration'}</div></div></div>
        <span class="badge badge-gn" style="font-size:10px">Active</span>
      </div>`).join('')||'<div style="color:var(--tx3);text-align:center;padding:18px">No admins yet</div>'}
    </div>
    <div>
      <div style="font-size:12px;color:var(--tx3);font-weight:700;letter-spacing:.5px;margin-bottom:12px">COMPANY ACTIVITY</div>
      ${Object.entries(COMPANIES).map(([k,co])=>{const n=students.filter(s=>Object.keys(s.scores||{}).some(key=>key.startsWith(k))).length;return `<div style="margin-bottom:10px"><div class="row-between" style="margin-bottom:5px"><span style="font-size:13px;font-weight:600">${k}</span><span style="font-size:11px;color:var(--tx2)">${n} students</span></div><div class="progress"><div class="progress-bar" style="background:linear-gradient(90deg,${co.color},${co.accent});width:${Math.min(100,n*15)}%"></div></div></div>`;}).join('')}
    </div>
  </div>`;
}
async function renderHolderAdmins(){
  const [res, pending] = await Promise.all([api('/admin_manage.php'), refreshPendingAlumniBadge()]);
  const admins = res.success ? res.admins : [];
  document.getElementById('holder-admins-count').textContent=admins.length+' admins registered'+(pending.length?` · ${pending.length} pending approval`:'');
  const pendingBox=document.getElementById('holder-pending-requests');
  if(pendingBox){
    pendingBox.innerHTML = pending.length ? `
      <div style="font-size:12px;color:var(--tx3);font-weight:700;letter-spacing:.5px;margin-bottom:12px">PENDING ALUMNI REQUESTS</div>
      <div class="g3" style="margin-bottom:26px">
      ${pending.map(p=>`
        <div class="holder-admin-card">
          <div class="row" style="gap:12px;margin-bottom:14px">
            <div style="width:46px;height:46px;border-radius:50%;background:linear-gradient(135deg,var(--gd),#fde68a);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:18px;color:#3b2f0a;flex-shrink:0">${p.name[0]}</div>
            <div><div style="font-weight:700;font-size:15px">${p.name}</div><div style="font-size:12px;color:var(--tx3)">${p.email}</div></div>
          </div>
          <div class="col" style="gap:7px">
            <div class="row-between" style="font-size:12px"><span style="color:var(--tx3)">Role</span><span>${p.position||'—'}</span></div>
            <div class="row-between" style="font-size:12px"><span style="color:var(--tx3)">Register No</span><span>${p.roll_no||'—'}</span></div>
            <div class="row-between" style="font-size:12px"><span style="color:var(--tx3)">Graduated</span><span>${p.graduation_year||'—'}</span></div>
            <div class="row-between" style="font-size:12px"><span style="color:var(--tx3)">Degree</span><span>${p.degree||'—'}</span></div>
            <div class="row-between" style="font-size:12px"><span style="color:var(--tx3)">College e-mail</span><span style="color:${p.college_email_verified?'var(--gn)':'var(--rd)'}">${p.college_email_verified?'✓ @kongu.edu verified':'✕ not verified'}</span></div>
            <div class="row-between" style="font-size:12px"><span style="color:var(--tx3)">Department</span><span>${p.dept||'—'}</span></div>
            <div class="row-between" style="font-size:12px"><span style="color:var(--tx3)">College</span><span>${p.college||'—'}</span></div>
            <div class="row-between" style="font-size:12px"><span style="color:var(--tx3)">Requested</span><span>${new Date(p.requestedAt).toLocaleDateString()}</span></div>
          </div>
          <div style="margin-top:14px;display:flex;gap:8px">
            <button class="btn btn-success btn-sm" style="flex:1" onclick="approveAlumni('${p.id}')">✓ Approve</button>
            <button class="btn btn-danger btn-sm" style="flex:1" onclick="rejectAlumni('${p.id}')">✕ Decline</button>
          </div>
        </div>`).join('')}
      </div>` : '';
  }
  document.getElementById('admins-grid').innerHTML=admins.map(a=>`
    <div class="holder-admin-card">
      <div class="row" style="gap:12px;margin-bottom:14px">
        <div style="width:46px;height:46px;border-radius:50%;background:linear-gradient(135deg,var(--gn),#6ee7b7);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:18px;color:#0a2a1f;flex-shrink:0">${a.name[0]}</div>
        <div><div style="font-weight:700;font-size:15px">${a.name}</div><div style="font-size:12px;color:var(--tx3)">${a.email}</div></div>
      </div>
      <div class="col" style="gap:7px">
        <div class="row-between" style="font-size:12px"><span style="color:var(--tx3)">Role</span><span>${a.position||'—'}</span></div>
        <div class="row-between" style="font-size:12px"><span style="color:var(--tx3)">Department</span><span>${a.dept||'Administration'}</span></div>
        <div class="row-between" style="font-size:12px"><span style="color:var(--tx3)">College</span><span>${a.college||'—'}</span></div>
        <div class="row-between" style="font-size:12px"><span style="color:var(--tx3)">Joined</span><span>${new Date(a.joinedAt).toLocaleDateString()}</span></div>
      </div>
      <div style="margin-top:12px;display:flex;gap:7px"><span class="badge badge-gn" style="font-size:10px">✓ Active</span><span class="badge badge-pu" style="font-size:10px">ADMIN</span></div>
    </div>`).join('')||'<div style="color:var(--tx3);grid-column:1/-1;text-align:center;padding:40px">No admins yet</div>';
}
async function renderHolderStudents(){
  const res = await api('/admin_students.php');
  const students = res.success ? res.students : [];
  const rows=students.map(s=>{
    const t=Object.keys(s.scores||{}).length;
    const vals=Object.values(s.scores||{}).map(x=>typeof x==='object'?x.score:x);
    const avg=t?Math.round(vals.reduce((a,b)=>a+b,0)/t):0;
    return `<tr><td><div style="font-weight:600">${s.name}</div><div style="font-size:11px;color:var(--tx3)">${s.email}</div></td><td>${s.roll_no||'—'}</td><td>${s.branch||'—'}</td><td>${s.cgpa||'—'}</td><td>${t}</td><td>${t?`<span class="badge ${avg>=70?'badge-gn':avg>=50?'badge-gd':'badge-rd'}">${avg}%</span>`:'—'}</td><td style="font-size:11px;color:var(--tx3)">${s.created_at?s.created_at.slice(0,10):'—'}</td></tr>`;
  }).join('');
  document.getElementById('holder-students-table').innerHTML=`<thead><tr><th>Student</th><th>Roll</th><th>Branch</th><th>CGPA</th><th>Tests</th><th>Avg</th><th>Joined</th></tr></thead><tbody>${rows||'<tr><td colspan="7" style="text-align:center;padding:36px;color:var(--tx3)">No students yet</td></tr>'}</tbody>`;
}
async function addNewAdmin(){
  const name=document.getElementById('new-admin-name').value.trim();
  const email=document.getElementById('new-admin-email').value.trim();
  const pass=document.getElementById('new-admin-pass').value;
  const dept=document.getElementById('new-admin-dept').value.trim();
  if(!name||!email||!pass){toast('Please fill all required fields','error');return;}
  const res = await api('/admin_manage.php',{method:'POST',body:{name,email,password:pass,dept}});
  if(res.success){
    document.getElementById('add-admin-modal').classList.add('hidden');
    renderHolderAdmins(); toast('Alumni added successfully!');
    ['new-admin-name','new-admin-email','new-admin-pass','new-admin-dept'].forEach(id=>document.getElementById(id).value='');
  } else {
    toast(res.message||'Could not add admin','error');
  }
}

// ═══════════════════════════════════════
// DASHBOARD COMPANY TRACK HELPERS
// ═══════════════════════════════════════
function toggleTrack(key, color) {
  const panel = document.getElementById('track-rounds-' + key);
  const arrow = document.getElementById('track-arrow-' + key);
  const card  = document.getElementById('track-' + key);
  const isOpen = panel.style.maxHeight !== '0px' && panel.style.maxHeight !== '';
  // Close all others first
  Object.keys(COMPANIES).forEach(k => {
    const p = document.getElementById('track-rounds-' + k);
    const a = document.getElementById('track-arrow-' + k);
    const c = document.getElementById('track-' + k);
    if (p && k !== key) { p.style.maxHeight = '0'; if(a) a.style.transform = 'rotate(0deg)'; if(c) c.style.borderColor = COMPANIES[k].color + '22'; }
  });
  if (isOpen) {
    panel.style.maxHeight = '0';
    arrow.style.transform = 'rotate(0deg)';
    card.style.borderColor = color + '22';
  } else {
    panel.style.maxHeight = panel.scrollHeight + 240 + 'px';
    arrow.style.transform = 'rotate(180deg)';
    card.style.borderColor = color + '55';
  }
}

function startExamFromDash(company, round) {
  // Navigate to companies page, show detail, start exam
  navigate('companies');
  setTimeout(() => { startExam(company, round); }, 80);
}

// ═══════════════════════════════════════
// BOOT
// ═══════════════════════════════════════
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&!document.getElementById('auth-modal').classList.contains('hidden'))submitAuth();});
initStorage();
renderExperiences();

// ── Auto-restore session from stored token ────────────────────
(async () => {
  const token = getToken();
  if (token) {
    const res = await api('/profile.php');
    if (res.success) {
      const u = res.user;
      u.rollNo = u.roll_no || u.rollNo || '';
      u.completedRounds = u.completedRounds || {};
      u.scores = u.scores || {};
      currentUser = u;
      startPresenceHeartbeat();
      document.getElementById('landing').classList.add('hidden');
      showApp(u);
      if(u.role==='student') document.getElementById('share-exp-btn').style.display='inline-flex';
    } else {
      clearToken();   // token expired or invalid
    }
  }
})();

// ═══════════════════════════════════════
// DELETE ACCOUNT LOGIC
// ═══════════════════════════════════════
function confirmDeleteAccount() {
  document.getElementById('delete-confirm-input').value = '';
  document.getElementById('confirm-delete-btn').disabled = true;
  document.getElementById('confirm-delete-btn').style.opacity = '.4';
  document.getElementById('confirm-delete-btn').style.cursor = 'not-allowed';
  document.getElementById('delete-account-modal').classList.remove('hidden');
}

function closeDeleteModal() {
  document.getElementById('delete-account-modal').classList.add('hidden');
}

function validateDeleteInput() {
  const val = document.getElementById('delete-confirm-input').value.trim();
  const btn = document.getElementById('confirm-delete-btn');
  const isValid = val === 'DELETE';
  btn.disabled = !isValid;
  btn.style.opacity = isValid ? '1' : '.4';
  btn.style.cursor = isValid ? 'pointer' : 'not-allowed';
}

async function executeDeleteAccount() {
  if (!currentUser) return;
  const btn = document.getElementById('confirm-delete-btn');
  btn.disabled = true; btn.textContent = 'Deleting...';
  const res = await api('/delete_account.php', {method:'POST'});
  if(res.success){
    clearToken(); closeDeleteModal(); currentUser = null;
    document.getElementById('app').style.display = 'none';
    document.getElementById('app').classList.add('hidden');
    document.getElementById('landing').classList.remove('hidden');
    document.getElementById('share-exp-btn').style.display = 'none';
    clearInterval(examTimer);
    toast('Your account has been permanently deleted.');
  } else {
    btn.disabled = false; btn.textContent = '🗑 Delete Forever';
    toast(res.message||'Could not delete account','error');
  }
}

document.getElementById('delete-account-modal').addEventListener('click', e => {
  if (e.target === document.getElementById('delete-account-modal')) closeDeleteModal();
});
