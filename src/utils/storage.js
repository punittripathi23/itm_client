// Storage Utility - Handles localStorage initialization with mock data and database operations

const DEFAULT_USERS = [
  {
    id: 'usr_1',
    name: 'Sonu Tripathi',
    email: 'user@test.com',
    password: 'password123', // In real app, this is hashed
    role: 'user',
    joinedDate: '2026-08-01',
    status: 'active'
  },
  {
    id: 'usr_2',
    name: 'Bakliwal Admin',
    email: 'admin@test.com',
    password: 'password123',
    role: 'admin',
    joinedDate: '2026-08-01',
    status: 'active'
  }
];

const DEFAULT_PAPERS = [
  {
    id: 'pap_1',
    title: 'A Machine Learning Approach to Scalable Grid Computing',
    authors: 'John Doe, Sonu Tripathi, Alice Smith',
    abstract: 'This paper proposes a novel framework utilizing advanced deep reinforcement learning models to dynamically balance computing loads in heterogeneous grid infrastructures. We demonstrate a 25% reduction in job latency compared to standard heuristic approaches, while maintaining stable node temperatures and power utilization.',
    year: '2026',
    conference: 'IEEE Global Cloud Conference 2026',
    category: 'Computer Science',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    downloads: 142,
    uploadedBy: 'usr_2',
    dateAdded: '2026-08-02'
  },
  {
    id: 'pap_2',
    title: 'Visual Representation Learning via Contrastive Clustering Networks',
    authors: 'Emily Watson, Marcus Brody',
    abstract: 'We present a self-supervised visual representation learning strategy that bridges contrastive instance-level learning with semantic clustering. By formulating clustering as an optimal transport problem, our method learns rich features that transfer seamlessly to downstream classification, detection, and segmentation tasks.',
    year: '2025',
    conference: 'International Vision Symposium 2025',
    category: 'Artificial Intelligence',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    downloads: 89,
    uploadedBy: 'usr_2',
    dateAdded: '2026-08-03'
  },
  {
    id: 'pap_3',
    title: 'Blockchain-Based Secure Data Sharing for Decentralized Health Networks',
    authors: 'Robert Chen, Clara Oswald, Arthur Dent',
    abstract: 'Decentralized healthcare networks suffer from lack of trust and potential security breaches. This research introduces a hybrid consensus blockchain network paired with cryptographic proxy-re-encryption. Patients retain complete control of medical record access while allowing medical researchers to compute aggregate stats securely.',
    year: '2026',
    conference: 'ACM HealthTech Summit 2026',
    category: 'Cybersecurity',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    downloads: 204,
    uploadedBy: 'usr_2',
    dateAdded: '2026-08-04'
  }
];

const DEFAULT_CONFERENCES = [
  {
    id: 'conf_1',
    title: 'IEEE Global Cloud Conference 2026',
    date: '2026-10-12',
    endDate: '2026-10-15',
    location: 'Mumbai, India (Hybrid)',
    description: 'The premier conference focusing on cloud infrastructure, virtualization, edge computing paradigms, and next-generation distributed systems architecture.',
    schedule: [
      { day: 'Day 1', time: '09:00 AM - 10:30 AM', event: 'Keynote Address: The Next Wave of Edge Infrastructure' },
      { day: 'Day 1', time: '11:00 AM - 12:30 PM', event: 'Technical Session: Machine Learning in Distributed Systems' },
      { day: 'Day 2', time: '10:00 AM - 01:00 PM', event: 'Paper Presentations: Grid and Serverless Paradigms' }
    ],
    status: 'upcoming'
  },
  {
    id: 'conf_2',
    title: 'International Vision Symposium 2025',
    date: '2025-07-22',
    endDate: '2025-07-25',
    location: 'Berlin, Germany',
    description: 'A global gathering showcasing research breakthroughs in computer vision, image processing, object detection, and multimodal models.',
    schedule: [],
    status: 'past'
  },
  {
    id: 'conf_3',
    title: 'ACM HealthTech Summit 2026',
    date: '2026-11-05',
    endDate: '2026-11-08',
    location: 'Chicago, USA',
    description: 'Focusing on artificial intelligence, privacy-preserving technology, and cryptographic ledgers designed for modern electronic health records and diagnostic tools.',
    schedule: [],
    status: 'upcoming'
  }
];

const DEFAULT_WORKSHOPS = [
  {
    id: 'work_1',
    title: 'Hands-on Deep Reinforcement Learning for System Design',
    speaker: 'Dr. Emily Watson',
    date: '2026-10-13',
    time: '02:00 PM - 05:00 PM',
    location: 'Cloud Conference - Seminar Hall A',
    description: 'An interactive workshop covering policy-gradient, Q-learning algorithms and their practical applications in optimizing network routers and cloud clusters.'
  },
  {
    id: 'work_2',
    title: 'Practical Zero Knowledge Proofs for Privacy-Preserving Applications',
    speaker: 'Robert Chen',
    date: '2026-11-06',
    time: '10:00 AM - 01:00 PM',
    location: 'HealthTech Summit - Tech Center B',
    description: 'Learn how to implement zk-SNARKs and zk-STARKs in decentralized architectures to verify computations without sharing underlying sensitive patient data.'
  }
];

const DEFAULT_GALLERY = [
  {
    id: 'gal_1',
    title: 'IEEE Cloud Conference Highlights',
    type: 'image',
    coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80',
    items: [
      { id: 'item_1_1', url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80', caption: 'Opening Keynote Session' },
      { id: 'item_1_2', url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80', caption: 'Panel Discussion on Serverless Computing' },
      { id: 'item_1_3', url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop&q=80', caption: 'Interactions at the Poster Presentation Booths' }
    ]
  },
  {
    id: 'gal_2',
    title: 'Keynote & Speaker Interviews',
    type: 'video',
    coverImage: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&auto=format&fit=crop&q=80',
    items: [
      { id: 'item_2_1', url: 'https://www.w3schools.com/html/mov_bbb.mp4', caption: 'Keynote Address Highlights (Video)' },
      { id: 'item_2_2', url: 'https://www.w3schools.com/html/movie.mp4', caption: 'Panel Session Recap (Video)' }
    ]
  }
];

const DEFAULT_CMS = {
  announcements: [
    { id: 'ann_1', text: 'Call for papers for IEEE Global Cloud Conference 2026 is now open. Submit by September 1, 2026.', date: '2026-08-04' },
    { id: 'ann_2', text: 'ITM-JET journal portal launched officially today.', date: '2026-08-02' }
  ],
  homeHeroTitle: 'Empowering Research, Digitally Accessing Knowledge',
  homeHeroSubtitle: 'The central gateway for premier academic publications, workshops, and scholarly conferences.',
  aboutUsText: 'ITM Journal of Engineering & Technology (ITM-JET) is a scholarly journal platform dedicated to sharing engineering and technology research.',
  contactEmail: 'contact@bakliwal.edu',
  contactPhone: '+91 98765 43210',
  contactAddress: 'Bakliwal Campus, Sector 5, Pune, Maharashtra, India'
};

const DEFAULT_LOGS = [
  { id: 'log_1', userEmail: 'user@test.com', paperTitle: 'A Machine Learning Approach to Scalable Grid Computing', date: '2026-08-04 14:22:10' },
  { id: 'log_2', userEmail: 'user@test.com', paperTitle: 'Blockchain-Based Secure Data Sharing for Decentralized Health Networks', date: '2026-08-05 10:15:33' }
];

// Initialize DB if not present
export const initializeStorage = () => {
  if (!localStorage.getItem('cpp_users')) localStorage.setItem('cpp_users', JSON.stringify(DEFAULT_USERS));
  if (!localStorage.getItem('cpp_papers')) localStorage.setItem('cpp_papers', JSON.stringify(DEFAULT_PAPERS));
  if (!localStorage.getItem('cpp_conferences')) localStorage.setItem('cpp_conferences', JSON.stringify(DEFAULT_CONFERENCES));
  if (!localStorage.getItem('cpp_workshops')) localStorage.setItem('cpp_workshops', JSON.stringify(DEFAULT_WORKSHOPS));
  if (!localStorage.getItem('cpp_gallery')) localStorage.setItem('cpp_gallery', JSON.stringify(DEFAULT_GALLERY));
  if (!localStorage.getItem('cpp_cms')) localStorage.setItem('cpp_cms', JSON.stringify(DEFAULT_CMS));
  if (!localStorage.getItem('cpp_logs')) localStorage.setItem('cpp_logs', JSON.stringify(DEFAULT_LOGS));
};

// Generic storage accessors
export const getStorageItem = (key, defaultValue) => {
  initializeStorage();
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
};

export const setStorageItem = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};
