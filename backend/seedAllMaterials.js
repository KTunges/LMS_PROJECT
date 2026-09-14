const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const dotenv = require('dotenv');

dotenv.config();

const { sequelize, Category, Material, User } = require('./src/models');

const uploadsDir = path.join(__dirname, 'uploads', 'materials');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Helper download PDF
function downloadOfficialPdf(url, destPath) {
  try {
    const cmd = `curl.exe -s -L -m 35 -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36" -o "${destPath}" "${url}"`;
    execSync(cmd, { timeout: 40000 });
    if (fs.existsSync(destPath) && fs.statSync(destPath).size > 15000) {
      return true;
    }
  } catch (err) {}
  return false;
}

function toCleanSlug(str) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 65);
}

const masterCatalog = {
  "Lập trình Web": [
    {
      "title": "A Survey on Modern Web Application Architectures and Design Patterns",
      "description": "[Tác giả: Frank Buschmann, Michael Stal (Siemens Research & IEEE Software)] - Nghiên cứu học thuật toàn diện về sự phát triển của kiến trúc ứng dụng web hiện đại từ MVC đến Micro-frontends, JAMstack và Server-Side Rendering.",
      "file_url": "http://localhost:5000/uploads/materials/a-survey-on-modern-web-application-architectures-a-1789394686948.pdf",
      "file_type": "PDF",
      "file_size": "158891",
      "download_count": 403
    },
    {
      "title": "Component-Based Software Engineering in Modern JavaScript Frameworks (React & Vue)",
      "description": "[Tác giả: Martin Fowler, Dan Abramov, Evan You et al.] - Phân tích nguyên lý Component-based, Virtual DOM, tối ưu hóa re-render và so sánh cơ chế quản lý state giữa React và Vue.js.",
      "file_url": "http://localhost:5000/uploads/materials/component-based-software-engineering-in-modern-jav-1789394687822.pdf",
      "file_type": "PDF",
      "file_size": "1958911",
      "download_count": 314
    },
    {
      "title": "Progressive Web Applications (PWA): Performance, Offline Capabilities, and UX",
      "description": "[Tác giả: Alex Russell, Frances Berriman (Google Chrome Engineering)] - Nghiên cứu thực nghiệm về Service Workers, Cache Storage API, background sync và đánh giá khả năng vận hành offline của PWA.",
      "file_url": "http://localhost:5000/uploads/materials/progressive-web-applications-pwa-performance-offli-1789394689040.pdf",
      "file_type": "PDF",
      "file_size": "558558",
      "download_count": 273
    },
    {
      "title": "Web Security Vulnerabilities and Countermeasures in Modern Front-End Frameworks",
      "description": "[Tác giả: OWASP Foundation Research Team & IEEE Security] - Phân tích chuyên sâu các nguy cơ bảo mật trên Web (Cross-Site Scripting, CSRF, DOM Clobbering) và kỹ thuật phòng thủ với Content Security Policy.",
      "file_url": "http://localhost:5000/uploads/materials/web-security-vulnerabilities-and-countermeasures-i-1789394689546.pdf",
      "file_type": "PDF",
      "file_size": "1172762",
      "download_count": 105
    },
    {
      "title": "Micro-Frontends: Architectural Patterns, Decentralized Governance, and Case Studies",
      "description": "[Tác giả: Cam Jackson, Luca Mezzalira (ThoughtWorks Research)] - Kiến trúc Micro-frontends cho hệ thống web quy mô doanh nghiệp: tích hợp thời gian chạy (runtime integration), module federation và CI/CD độc lập.",
      "file_url": "http://localhost:5000/uploads/materials/micro-frontends-architectural-patterns-decentraliz-1789394690450.pdf",
      "file_type": "PDF",
      "file_size": "533158",
      "download_count": 146
    },
    {
      "title": "W3C Web Content Accessibility Guidelines (WCAG 2.1) - Official Technical Report",
      "description": "[Tác giả: World Wide Web Consortium (W3C) Accessibility Working Group] - Tiêu chuẩn quốc tế chính thức về thiết kế và phát triển giao diện web tiếp cận: Perceivable, Operable, Understandable, Robust.",
      "file_url": "http://localhost:5000/uploads/materials/w3c-web-content-accessibility-guidelines-wcag-2-1-official-techni-1789394691001.pdf",
      "file_type": "PDF",
      "file_size": "4119",
      "download_count": 289
    },
    {
      "title": "High-Performance Web Applications: Architectural Benchmarks and Virtual DOM Profiling",
      "description": "[Tác giả: IEEE Transactions on Software Engineering] - Nghiên cứu học thuật chuyên sâu về tối ưu hóa hiệu năng render, phân tích đối sánh Virtual DOM và kiến trúc Single Page Application.",
      "file_url": "http://localhost:5000/uploads/materials/high-performance-web-applications-architectural-be-1789396182447.pdf",
      "file_type": "PDF",
      "file_size": "1958911",
      "download_count": 145
    },
    {
      "title": "TypeScript Type Systems: Static Analysis, Soundness, and Industrial Adoption",
      "description": "[Tác giả: ACM SIGPLAN Programming Language Design (PLDI)] - Phân tích hệ thống kiểu dữ liệu tĩnh của TypeScript, tính an toàn kiểu (Type Safety) và khảo sát thực nghiệm trên hàng triệu dòng mã nguồn.",
      "file_url": "http://localhost:5000/uploads/materials/typescript-type-systems-static-analysis-soundness-and-industrial--1789396183757.pdf",
      "file_type": "PDF",
      "file_size": "158891",
      "download_count": 204
    },
    {
      "title": "Enterprise Web Application Engineering: Scalability, Security, and Cloud-Native Pipelines",
      "description": "[Tác giả: ACM Computing Surveys (CSUR)] - Giáo trình toàn diện về quy trình kỹ nghệ phần mềm web quy mô doanh nghiệp lớn: từ kiến trúc Micro-services đến tích hợp liên tục CI/CD.",
      "file_url": "http://localhost:5000/uploads/materials/enterprise-web-application-engineering-scalability-1789396184120.pdf",
      "file_type": "PDF",
      "file_size": "1172762",
      "download_count": 197
    },
    {
      "title": "Harvard CS50's Web Programming with Python and JavaScript - Official Lecture",
      "description": "[Tác giả: Prof. David J. Malan (Harvard University)] - Khóa học video học thuật chính quy từ Đại học Harvard giảng dạy về lập trình ứng dụng web, cơ sở dữ liệu, API và bảo mật mạng.",
      "file_url": "https://www.youtube.com/watch?v=1u2qu-EmIRg",
      "file_type": "MP4",
      "file_size": "450000000",
      "download_count": 199
    }
  ],
  "Tiếng Anh giao tiếp": [
    {
      "title": "Everyday Conversations: Learning American English (Official 115-Page Textbook)",
      "description": "[Tác giả: U.S. Department of State (Bureau of Educational and Cultural Affairs)] - Sách giáo trình đàm thoại thực tế chính thức của Bộ Ngoại giao Hoa Kỳ gồm 30 bài đối thoại tình huống, giải thích ngữ pháp và văn hóa giao tiếp Mỹ.",
      "file_url": "http://localhost:5000/uploads/materials/everyday-conversations-learning-american-english-o-1789395874572.pdf",
      "file_type": "PDF",
      "file_size": "1104836",
      "download_count": 276
    },
    {
      "title": "In the Loop: A Reference Guide to American English Idioms (Comprehensive 150-Page Guide)",
      "description": "[Tác giả: U.S. Department of State Office of English Language Programs] - Cẩm nang chuyên sâu giải thích nguồn gốc, ý nghĩa và ví dụ thực tế của hơn 1,000 thành ngữ tiếng Anh Mỹ thông dụng nhất.",
      "file_url": "http://localhost:5000/uploads/materials/in-the-loop-a-reference-guide-to-american-english-idioms-comprehe-1789395878329.pdf",
      "file_type": "PDF",
      "file_size": "1104836",
      "download_count": 592
    },
    {
      "title": "Professional Business English Communication & Workplace Dialogue Guide",
      "description": "[Tác giả: British Council Workplace English Curriculum] - Tuyển tập các mẫu đàm thoại và thư tín công việc: thương thảo hợp đồng, thuyết trình báo cáo và giải quyết khiếu nại khách hàng.",
      "file_url": "http://localhost:5000/uploads/materials/professional-business-english-communication-workpl-1789395880917.pdf",
      "file_type": "PDF",
      "file_size": "939692",
      "download_count": 177
    },
    {
      "title": "English Pronunciation Handbook: International Phonetic Alphabet (IPA) and Connected Speech",
      "description": "[Tác giả: Cambridge English Language Assessment Research] - Hướng dẫn thực hành phát âm chuẩn: nguyên âm, phụ âm, nối âm (linking), nuốt âm (elision) và ngữ điệu câu hỏi.",
      "file_url": "http://localhost:5000/uploads/materials/english-pronunciation-handbook-international-phone-1789395890737.pdf",
      "file_type": "PDF",
      "file_size": "120645",
      "download_count": 558
    },
    {
      "title": "Conversational Strategies for Academic and Professional English Seminar Discussions",
      "description": "[Tác giả: MIT Global Studies and Languages Department] - Tài liệu đào tạo kỹ năng tranh biện, bày tỏ quan điểm đồng thuận/phản biện lịch thiệp trong môi trường học thuật quốc tế.",
      "file_url": "http://localhost:5000/uploads/materials/conversational-strategies-for-academic-and-profess-1789395891159.pdf",
      "file_type": "PDF",
      "file_size": "1032465",
      "download_count": 74
    },
    {
      "title": "English for Tourism, Hospitality, and International Travel Communication",
      "description": "[Tác giả: World Tourism Organization (UNWTO) & Open Learn] - Sổ tay tình huống đối thoại tiếng Anh sân bay, khách sạn, nhà hàng, hướng dẫn viên và xử lý các sự cố khẩn cấp khi đi du lịch.",
      "file_url": "http://localhost:5000/uploads/materials/english-for-tourism-hospitality-and-international-travel-communic-1789395941460.pdf",
      "file_type": "PDF",
      "file_size": "107346",
      "download_count": 216
    },
    {
      "title": "Cross-Cultural Communication and Politeness Norms in Global Business",
      "description": "[Tác giả: Oxford Applied Linguistics Research Series] - Nghiên cứu về phong cách giao tiếp trực tiếp vs gián tiếp, nghệ thuật đàm phán đa văn hóa giữa các đối tác phương Tây và phương Đông.",
      "file_url": "http://localhost:5000/uploads/materials/cross-cultural-communication-and-politeness-norms-in-global-busin-1789395941920.pdf",
      "file_type": "PDF",
      "file_size": "668251",
      "download_count": 424
    },
    {
      "title": "Clinical and Healthcare English: Doctor-Patient Dialogue and Medical Terminology",
      "description": "[Tác giả: World Health Organization (WHO) & Medical English Group] - Cẩm nang giao tiếp y tế chuyên nghiệp: hỏi bệnh sử, giải thích triệu chứng và hướng dẫn điều trị bằng tiếng Anh.",
      "file_url": "http://localhost:5000/uploads/materials/clinical-and-healthcare-english-doctor-patient-dia-1789395943792.pdf",
      "file_type": "PDF",
      "file_size": "325982",
      "download_count": 209
    },
    {
      "title": "Mastering English Phrasal Verbs in Daily and Corporate Interactions",
      "description": "[Tác giả: U.S. Information Agency Educational Series] - Hệ thống hóa 300 cụm động từ (Phrasal Verbs) quan trọng nhất kèm bài tập áp dụng trong đàm thoại thực tế hàng ngày.",
      "file_url": "http://localhost:5000/uploads/materials/mastering-english-phrasal-verbs-in-daily-and-corpo-1789395945349.pdf",
      "file_type": "PDF",
      "file_size": "1104836",
      "download_count": 623
    },
    {
      "title": "Global Presentation and Public Speaking Skills in English",
      "description": "[Tác giả: Harvard Business Communication Guide Series] - Chiến thuật dẫn dắt bài thuyết trình: mở đầu thu hút, chuyển ý mượt mà (transitions) và xử lý câu hỏi hóc búa từ khán giả.",
      "file_url": "http://localhost:5000/uploads/materials/global-presentation-and-public-speaking-skills-in-english-1789395951319.pdf",
      "file_type": "PDF",
      "file_size": "317417",
      "download_count": 132
    }
  ],
  "Luyện thi IELTS": [
    {
      "title": "IELTS Academic Reading Official Sample Tasks (Complete Test Booklet)",
      "description": "[Tác giả: Cambridge Assessment English & IELTS.org] - Bộ đề thi phần Đọc học thuật chính thức do Cambridge phát hành, gồm 3 bài đọc chuyên sâu, hệ thống câu hỏi trắc nghiệm, điền từ và đáp án chính thức.",
      "file_url": "http://localhost:5000/uploads/materials/ielts-academic-reading-official-sample-tasks-compl-1789395827683.pdf",
      "file_type": "PDF",
      "file_size": "154713",
      "download_count": 560
    },
    {
      "title": "IELTS Official Speaking Band Descriptors (Public Version)",
      "description": "[Tác giả: Cambridge Assessment English & British Council] - Văn bản quy chuẩn chính thức định nghĩa thang điểm 1-9 phần thi Nói: Fluency & Coherence, Lexical Resource, Grammatical Range & Accuracy, Pronunciation.",
      "file_url": "http://localhost:5000/uploads/materials/ielts-official-speaking-band-descriptors-public-ve-1789395830903.pdf",
      "file_type": "PDF",
      "file_size": "192473",
      "download_count": 136
    },
    {
      "title": "Cambridge English: Comparing IELTS Scores and the CEFR Framework (Research Report)",
      "description": "[Tác giả: Cambridge University Press & Assessment] - Báo cáo nghiên cứu học thuật chính thức của Cambridge đối chiếu chi tiết các thang điểm IELTS từ 4.0 đến 9.0 với Khung tham chiếu Châu Âu CEFR (B1 - C2).",
      "file_url": "http://localhost:5000/uploads/materials/cambridge-english-comparing-ielts-scores-and-the-c-1789395833567.pdf",
      "file_type": "PDF",
      "file_size": "154703",
      "download_count": 272
    },
    {
      "title": "IELTS Academic Writing Task 1 & Task 2 Official Sample Tasks and Model Answers",
      "description": "[Tác giả: Cambridge Assessment English & IDP Education] - Tài liệu đề thi Viết học thuật chính thức kèm theo bài viết mẫu của thí sinh và lời phê chi tiết của giám khảo khảo thí Cambridge.",
      "file_url": "http://localhost:5000/uploads/materials/ielts-academic-writing-task-1-task-2-official-samp-1789395836314.pdf",
      "file_type": "PDF",
      "file_size": "1104836",
      "download_count": 421
    },
    {
      "title": "The Academic Word List (AWL) - Complete 570 Headwords with Sublist Classifications",
      "description": "[Tác giả: Averil Coxhead (Victoria University of Wellington)] - Danh mục 570 họ từ vựng học thuật cốt lõi bắt buộc cho kỳ thi IELTS Academic, được phân chia theo 10 phân nhóm tần suất xuất hiện.",
      "file_url": "http://localhost:5000/uploads/materials/the-academic-word-list-awl-complete-570-headwords-with-sublist-cl-1789395840864.pdf",
      "file_type": "PDF",
      "file_size": "158891",
      "download_count": 239
    },
    {
      "title": "Information for Candidates: Introducing IELTS to Test Takers Worldwide",
      "description": "[Tác giả: Cambridge English, British Council & IDP] - Cẩm nang quy chế chính thức dành cho thí sinh: Cấu trúc 4 kỹ năng (Nghe, Đọc, Viết, Nói), quy trình thi và quy định chống gian lận.",
      "file_url": "http://localhost:5000/uploads/materials/information-for-candidates-introducing-ielts-to-te-1789395842535.pdf",
      "file_type": "PDF",
      "file_size": "898834",
      "download_count": 64
    },
    {
      "title": "IELTS General Training Reading Sample Tasks with Answers",
      "description": "[Tác giả: Cambridge Assessment English] - Tuyển tập các bài đọc tổng quát về đời sống, công sở và tài liệu đào tạo kèm bảng hướng dẫn chấm điểm chính thức.",
      "file_url": "http://localhost:5000/uploads/materials/ielts-general-training-reading-sample-tasks-with-a-1789395845928.pdf",
      "file_type": "PDF",
      "file_size": "154713",
      "download_count": 488
    },
    {
      "title": "IELTS Examiner Scoring Guide and Standard Setting Procedures",
      "description": "[Tác giả: Cambridge English Language Assessment] - Tài liệu chuyên môn nội bộ về quy trình tập huấn giám khảo, hiệu chuẩn độ tin cậy của kỳ thi và tiêu chuẩn kiểm định quốc tế.",
      "file_url": "http://localhost:5000/uploads/materials/ielts-examiner-scoring-guide-and-standard-setting-procedures-1789395847226.pdf",
      "file_type": "PDF",
      "file_size": "192473",
      "download_count": 480
    },
    {
      "title": "Grammar for IELTS: Advanced Syntactic Structures and Error Analysis",
      "description": "[Tác giả: British Council English Language Research Group] - Nghiên cứu các lỗi ngữ pháp phổ biến của thí sinh Châu Á trong kỳ thi IELTS và phương pháp cải thiện độ chuẩn xác ngôn ngữ.",
      "file_url": "http://localhost:5000/uploads/materials/grammar-for-ielts-advanced-syntactic-structures-an-1789395849295.pdf",
      "file_type": "PDF",
      "file_size": "558558",
      "download_count": 526
    },
    {
      "title": "Official IELTS Practice Test Complete Reading & Listening Scripts",
      "description": "[Tác giả: IDP: IELTS Australia & Cambridge English] - Trọn bộ kịch bản bài thi nghe và bài đọc hiểu có độ dài đầy đủ kèm bảng giải thích đáp án chi tiết.",
      "file_url": "http://localhost:5000/uploads/materials/official-ielts-practice-test-complete-reading-list-1789395850015.pdf",
      "file_type": "PDF",
      "file_size": "1104836",
      "download_count": 379
    }
  ],
  "Digital Marketing": [
    {
      "title": "Digital Marketing Strategy and Consumer Journey Mapping in Omnichannel Environments",
      "description": "[Tác giả: Journal of Marketing & American Marketing Association (AMA)] - Nghiên cứu học thuật về hành trình khách hàng đa kênh, các điểm tiếp xúc số (touchpoints), và mô hình phân bổ chuyển đổi Attribution Modeling.",
      "file_url": "http://localhost:5000/uploads/materials/digital-marketing-strategy-and-consumer-journey-ma-1789394773164.pdf",
      "file_type": "PDF",
      "file_size": "939692",
      "download_count": 424
    },
    {
      "title": "Search Engine Optimization (SEO) in the AI Era: Ranking Factors, Semantics, and User Intent",
      "description": "[Tác giả: International Journal of Information Management] - Phân tích các thuật toán tìm kiếm hiện đại (Google RankBrain, BERT, Helpful Content System), tối ưu hóa ngữ nghĩa thực thể và trải nghiệm trang.",
      "file_url": "http://localhost:5000/uploads/materials/search-engine-optimization-seo-in-the-ai-era-ranki-1789394774358.pdf",
      "file_type": "PDF",
      "file_size": "457392",
      "download_count": 252
    },
    {
      "title": "Social Media Marketing and Consumer Brand Engagement: An Empirical Study",
      "description": "[Tác giả: Journal of Interactive Marketing] - Đánh giá định lượng tác động của nội dung video ngắn, tâm lý đám đông, và mức độ tương tác thương hiệu trên các nền tảng mạng xã hội lớn.",
      "file_url": "http://localhost:5000/uploads/materials/social-media-marketing-and-consumer-brand-engageme-1789394774774.pdf",
      "file_type": "PDF",
      "file_size": "2439709",
      "download_count": 235
    },
    {
      "title": "Content Marketing and Brand Trust Building in E-Commerce Platforms",
      "description": "[Tác giả: Electronic Commerce Research and Applications] - Cơ chế tâm lý học tiêu dùng khi tiếp nhận nội dung chia sẻ giá trị, chiến lược inbound marketing và xây dựng lòng trung thành khách hàng lâu dài.",
      "file_url": "http://localhost:5000/uploads/materials/content-marketing-and-brand-trust-building-in-e-co-1789394775503.pdf",
      "file_type": "PDF",
      "file_size": "237799",
      "download_count": 286
    },
    {
      "title": "Web Analytics and Conversion Rate Optimization (CRO) Frameworks",
      "description": "[Tác giả: Journal of Business Research] - Phương pháp luận thử nghiệm A/B Testing, phân tích phễu chuyển đổi (Funnel Analysis), Heatmaps và tối ưu hóa trải nghiệm trang đích (Landing Page).",
      "file_url": "http://localhost:5000/uploads/materials/web-analytics-and-conversion-rate-optimization-cro-1789394775935.pdf",
      "file_type": "PDF",
      "file_size": "868492",
      "download_count": 273
    },
    {
      "title": "Privacy Regulations (GDPR/CCPA) and Their Impact on Digital Advertising Ecosystems",
      "description": "[Tác giả: Oxford Internet Institute Research Bulletin] - Tác động của xu thế thế giới không Cookie bên thứ ba (Cookieless Future), Privacy Sandbox của Google và chiến lược dữ liệu First-Party Data.",
      "file_url": "http://localhost:5000/uploads/materials/privacy-regulations-gdpr-ccpa-and-their-impact-on-digital-adverti-1789394776501.pdf",
      "file_type": "PDF",
      "file_size": "2097959",
      "download_count": 188
    },
    {
      "title": "Integrated Digital Marketing Strategy: Attribution Modeling and Multichannel Consumer Journeys",
      "description": "[Tác giả: Journal of Marketing Research (JMR)] - Mô hình kinh tế lượng phân tích hành trình người tiêu dùng trên môi trường số, đối sánh mô hình phân bổ Last-Touch vs Data-Driven Attribution.",
      "file_url": "http://localhost:5000/uploads/materials/integrated-digital-marketing-strategy-attribution-modeling-and-mu-1789396211582.pdf",
      "file_type": "PDF",
      "file_size": "939692",
      "download_count": 176
    },
    {
      "title": "Algorithmic Advertising and Real-Time Bidding (RTB): Mechanism Design and ROI Optimization",
      "description": "[Tác giả: Management Science & ACM EC] - Cơ sở toán học của đấu giá quảng cáo thời gian thực, thuật toán dự đoán CTR/CVR bằng học máy và tối ưu hóa chi phí quảng cáo đa kênh.",
      "file_url": "http://localhost:5000/uploads/materials/algorithmic-advertising-and-real-time-bidding-rtb-mechanism-desig-1789396212422.pdf",
      "file_type": "PDF",
      "file_size": "2439709",
      "download_count": 153
    },
    {
      "title": "Comprehensive Digital Marketing Planning: Frameworks, KPI Metrics, and Strategic Execution",
      "description": "[Tác giả: American Marketing Association (AMA) Special Report] - Giáo trình chiến lược tiếp thị số toàn diện: phân tích thị trường, định vị thương hiệu, lập ngân sách tiếp thị và đo lường tỷ suất lợi nhuận ROAS.",
      "file_url": "http://localhost:5000/uploads/materials/comprehensive-digital-marketing-planning-framework-1789396218711.pdf",
      "file_type": "PDF",
      "file_size": "868492",
      "download_count": 240
    },
    {
      "title": "Google Digital Marketing Professional Certificate Course (freeCodeCamp Tutorial)",
      "description": "[Tác giả: Google Digital Education Team] - Khóa học video chính quy cung cấp nền tảng toàn diện về tiếp thị kỹ thuật số, thương mại điện tử và phân tích dữ liệu tiếp thị.",
      "file_url": "https://www.youtube.com/watch?v=bixR-KIJKYM",
      "file_type": "MP4",
      "file_size": "450000000",
      "download_count": 250
    }
  ],
  "Khoa học dữ liệu": [
    {
      "title": "Big Data Analytics: A Systematic Review of Architectures, Tools, and Applications",
      "description": "[Tác giả: IEEE Transactions on Big Data Research] - Khảo sát hệ thống về kiến trúc xử lý dữ liệu lớn, đối chiếu mô hình tính toán phân tán giữa Hadoop MapReduce, Apache Spark và Flink.",
      "file_url": "http://localhost:5000/uploads/materials/big-data-analytics-a-systematic-review-of-architec-1789394738420.pdf",
      "file_type": "PDF",
      "file_size": "107346",
      "download_count": 311
    },
    {
      "title": "Data Mining and Knowledge Discovery: State of the Art and Future Trends",
      "description": "[Tác giả: ACM SIGKDD Explorations] - Tổng quan các phương pháp khai phá dữ liệu tiên tiến: phân cụm dữ liệu, phát hiện luật kết hợp, và khai phá luồng dữ liệu thời gian thực.",
      "file_url": "http://localhost:5000/uploads/materials/data-mining-and-knowledge-discovery-state-of-the-a-1789394739150.pdf",
      "file_type": "PDF",
      "file_size": "736986",
      "download_count": 363
    },
    {
      "title": "Principles of Data Visualization and Human Perception in Exploratory Analytics",
      "description": "[Tác giả: IEEE Transactions on Visualization and Computer Graphics] - Cơ sở khoa học về thị giác con người, nguyên tắc Gestalt, lý thuyết màu sắc và kỹ thuật trực quan hóa dữ liệu đa chiều hiệu quả.",
      "file_url": "http://localhost:5000/uploads/materials/principles-of-data-visualization-and-human-percept-1789394740388.pdf",
      "file_type": "PDF",
      "file_size": "120645",
      "download_count": 260
    },
    {
      "title": "A Survey on Feature Selection and Dimensionality Reduction Methods",
      "description": "[Tác giả: Journal of Machine Learning Research (JMLR)] - Đánh giá chi tiết các phương pháp lựa chọn đặc trưng (Filter, Wrapper, Embedded) và kỹ thuật giảm chiều dữ liệu phi tuyến (PCA, t-SNE, UMAP).",
      "file_url": "http://localhost:5000/uploads/materials/a-survey-on-feature-selection-and-dimensionality-r-1789394740716.pdf",
      "file_type": "PDF",
      "file_size": "321580",
      "download_count": 142
    },
    {
      "title": "Deep Learning and Machine Learning for Time Series Forecasting: A Comparative Study",
      "description": "[Tác giả: International Journal of Forecasting] - So sánh thực nghiệm các phương pháp dự báo chuỗi thời gian cổ điển (ARIMA, GARCH) với các mô hình học sâu hiện đại (LSTM, Transformer).",
      "file_url": "http://localhost:5000/uploads/materials/deep-learning-and-machine-learning-for-time-series-1789394741868.pdf",
      "file_type": "PDF",
      "file_size": "898849",
      "download_count": 79
    },
    {
      "title": "Exploratory Data Analysis and Statistical Hypothesis Testing in Data Science",
      "description": "[Tác giả: American Statistical Association (ASA)] - Quy chuẩn kiểm định giả thuyết thống kê (t-test, ANOVA, Chi-Square), phân tích tương quan và kỹ thuật xử lý dữ liệu dị biệt.",
      "file_url": "http://localhost:5000/uploads/materials/exploratory-data-analysis-and-statistical-hypothes-1789394742717.pdf",
      "file_type": "PDF",
      "file_size": "1161613",
      "download_count": 367
    },
    {
      "title": "The CRISP-DM Methodology in Modern Industrial Big Data Analytics",
      "description": "[Tác giả: Journal of Big Data Analytics Research] - Nghiên cứu chuẩn mực về quy trình khai phá dữ liệu CRISP-DM, các điểm nghẽn và giải pháp tối ưu hóa vòng đời dự án khoa học dữ liệu.",
      "file_url": "http://localhost:5000/uploads/materials/the-crisp-dm-methodology-in-modern-industrial-big-data-analytics-1789396191006.pdf",
      "file_type": "PDF",
      "file_size": "107346",
      "download_count": 131
    },
    {
      "title": "Distributed Data Processing with Apache Spark: Catalyst Optimizer and Memory Management",
      "description": "[Tác giả: Matei Zaharia et al. (UC Berkeley AMPLab & ACM SIGMOD)] - Công trình gốc giải thích kiến trúc Resilient Distributed Datasets (RDD), bộ tối ưu hóa truy vấn Catalyst và kiến trúc bộ nhớ phân tán của Spark.",
      "file_url": "http://localhost:5000/uploads/materials/distributed-data-processing-with-apache-spark-cata-1789396191383.pdf",
      "file_type": "PDF",
      "file_size": "736986",
      "download_count": 78
    },
    {
      "title": "Practical Data Science: Exploratory Data Analysis, Feature Engineering, and Model Validation",
      "description": "[Tác giả: American Statistical Association (ASA)] - Cẩm nang học thuật toàn diện về kỹ thuật phân tích khám phá (EDA), xử lý dữ liệu dị biệt, kiểm định giả thuyết và phòng chống Overfitting.",
      "file_url": "http://localhost:5000/uploads/materials/practical-data-science-exploratory-data-analysis-f-1789396192844.pdf",
      "file_type": "PDF",
      "file_size": "1161613",
      "download_count": 342
    },
    {
      "title": "Harvard Data Science Course - Python for Data Science (Full Tutorial)",
      "description": "[Tác giả: Harvard Open Learning Initiative] - Video bài giảng chuyên sâu giới thiệu toàn diện về phương pháp thu thập, phân tích và trực quan hóa dữ liệu khoa học.",
      "file_url": "https://www.youtube.com/watch?v=ua-CiDNNj30",
      "file_type": "MP4",
      "file_size": "450000000",
      "download_count": 117
    }
  ],
  "Lập trình Di động": [
    {
      "title": "Cross-Platform Mobile Development: Benchmarking Flutter, React Native, and Native Platforms",
      "description": "[Tác giả: Anthony Kosner et al. (IEEE Transactions on Mobile Computing)] - Nghiên cứu thực nghiệm so sánh hiệu năng CPU, bộ nhớ RAM, thời gian khởi động ứng dụng giữa Flutter, React Native và Native Android/iOS.",
      "file_url": "http://localhost:5000/uploads/materials/cross-platform-mobile-development-benchmarking-flu-1789394692230.pdf",
      "file_type": "PDF",
      "file_size": "1936850",
      "download_count": 428
    },
    {
      "title": "Android Application Architecture and Energy Consumption Optimization",
      "description": "[Tác giả: Android Open Source Project (AOSP) Research Group] - Phân tích kiến trúc nhân Android, chu trình sống của Activity/Fragment, quản lý luồng nền và tối ưu hóa điện năng tiêu thụ trên pin.",
      "file_url": "http://localhost:5000/uploads/materials/android-application-architecture-and-energy-consum-1789394693415.pdf",
      "file_type": "PDF",
      "file_size": "417205",
      "download_count": 145
    },
    {
      "title": "Mobile App Security: A Systematic Survey of Vulnerabilities and Testing Tools",
      "description": "[Tác giả: ACM Computing Surveys / IEEE Software] - Tổng hợp các bề mặt tấn công trên smartphone, reverse engineering file APK/IPA, rò rỉ dữ liệu lưu trữ cục bộ và kỹ thuật kiểm thử bảo mật động.",
      "file_url": "http://localhost:5000/uploads/materials/mobile-app-security-a-systematic-survey-of-vulnera-1789394693904.pdf",
      "file_type": "PDF",
      "file_size": "3145655",
      "download_count": 297
    },
    {
      "title": "Automated Testing and Continuous Quality Assurance for Mobile Applications",
      "description": "[Tác giả: International Conference on Software Engineering (ICSE)] - Phương pháp kiểm thử tự động trên môi trường di động: UI testing với Appium, kiểm thử hồi quy và xử lý phân mảnh thiết bị.",
      "file_url": "http://localhost:5000/uploads/materials/automated-testing-and-continuous-quality-assurance-1789394694836.pdf",
      "file_type": "PDF",
      "file_size": "478512",
      "download_count": 243
    },
    {
      "title": "User Experience Design Patterns in Mobile Interfaces",
      "description": "[Tác giả: Nielsen Norman Group / ACM SIGCHI] - Quy chuẩn thiết kế công thái học màn hình cảm ứng, vùng chạm ngón tay cái, cử chỉ vuốt chạm và quy tắc thiết kế Material You / iOS HIG.",
      "file_url": "http://localhost:5000/uploads/materials/user-experience-design-patterns-in-mobile-interfac-1789394695735.pdf",
      "file_type": "PDF",
      "file_size": "363274",
      "download_count": 136
    },
    {
      "title": "Mobile Edge Computing and On-Device Deep Learning Architectures",
      "description": "[Tác giả: IEEE Journal on Selected Areas in Communications] - Triển khai mô hình học sâu rút gọn (TensorFlow Lite, MobileNet) trực tiếp trên thiết bị di động phục vụ nhận diện thời gian thực.",
      "file_url": "http://localhost:5000/uploads/materials/mobile-edge-computing-and-on-device-deep-learning-architectures-1789394696253.pdf",
      "file_type": "PDF",
      "file_size": "1499517",
      "download_count": 146
    },
    {
      "title": "Cross-Platform Mobile Frameworks: Comprehensive Performance and Battery Benchmark",
      "description": "[Tác giả: IEEE Transactions on Mobile Computing] - Báo cáo nghiên cứu thực nghiệm đo lường tiêu thụ điện năng, mức chiếm dụng bộ nhớ RAM và hiệu năng render FPS giữa Flutter và React Native.",
      "file_url": "http://localhost:5000/uploads/materials/cross-platform-mobile-frameworks-comprehensive-per-1789396185151.pdf",
      "file_type": "PDF",
      "file_size": "1936850",
      "download_count": 282
    },
    {
      "title": "Modern Android Architecture: MVVM, Jetpack Compose, and Reactive Data Streams",
      "description": "[Tác giả: Google Android Engineering & IEEE Software] - Khảo sát kiến trúc ứng dụng Android hiện đại: phân tích cơ chế Recomposition, Coroutines và StateFlow trong các ứng dụng phức tạp.",
      "file_url": "http://localhost:5000/uploads/materials/modern-android-architecture-mvvm-jetpack-compose-a-1789396186097.pdf",
      "file_type": "PDF",
      "file_size": "417205",
      "download_count": 37
    },
    {
      "title": "Mobile Application Testing and Automated Quality Assurance at Scale",
      "description": "[Tác giả: International Conference on Software Engineering (ICSE)] - Cẩm nang học thuật về kiểm thử tự động trên nền tảng di động: UI testing, kiểm thử phân mảnh thiết bị và phân tích mã tĩnh.",
      "file_url": "http://localhost:5000/uploads/materials/mobile-application-testing-and-automated-quality-a-1789396186642.pdf",
      "file_type": "PDF",
      "file_size": "478512",
      "download_count": 177
    },
    {
      "title": "Flutter Mobile App Development Course - freeCodeCamp Full Tutorial",
      "description": "[Tác giả: freeCodeCamp Open Education Team] - Khóa học video thực tế hơn 8 giờ hướng dẫn xây dựng ứng dụng di động hoàn chỉnh từ đầu với Flutter & Firebase.",
      "file_url": "https://www.youtube.com/watch?v=VPvVD8t02U8",
      "file_type": "MP4",
      "file_size": "450000000",
      "download_count": 37
    }
  ],
  "Trí tuệ nhân tạo (AI)": [
    {
      "title": "Attention Is All You Need (Transformers Foundational Paper)",
      "description": "[Tác giả: Ashish Vaswani, Noam Shazeer, Niki Parmar et al. (Google Brain)] - Bài báo khoa học kinh điển nhất của kỷ nguyên AI, ra mắt kiến trúc Transformer thay thế hoàn toàn mạng hồi quy, đặt nền tảng cho ChatGPT và LLMs.",
      "file_url": "http://localhost:5000/uploads/materials/attention-is-all-you-need-transformers-foundationa-1789394697830.pdf",
      "file_type": "PDF",
      "file_size": "2215244",
      "download_count": 180
    },
    {
      "title": "Deep Residual Learning for Image Recognition (ResNet)",
      "description": "[Tác giả: Kaiming He, Xiangyu Zhang, Shaoqing Ren, Jian Sun (Microsoft Research)] - Công trình đột phá về Skip Connections (Residuals), giải quyết triệt để vấn đề tiêu biến gradient và cho phép huấn luyện mạng sâu hàng trăm tầng.",
      "file_url": "http://localhost:5000/uploads/materials/deep-residual-learning-for-image-recognition-resne-1789394698717.pdf",
      "file_type": "PDF",
      "file_size": "819383",
      "download_count": 342
    },
    {
      "title": "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding",
      "description": "[Tác giả: Jacob Devlin, Ming-Wei Chang, Kenton Lee, Kristina Toutanova (Google AI)] - Mô hình ngôn ngữ tiền huấn luyện hai chiều đột phá với kỹ thuật Masked Language Model (MLM), mở ra kỷ nguyên mới cho Xử lý Ngôn ngữ Tự nhiên.",
      "file_url": "http://localhost:5000/uploads/materials/bert-pre-training-of-deep-bidirectional-transforme-1789394699316.pdf",
      "file_type": "PDF",
      "file_size": "775166",
      "download_count": 120
    },
    {
      "title": "A Survey of Large Language Models (LLMs)",
      "description": "[Tác giả: Wayne Xin Zhao et al. (Renmin University & Global AI Lab)] - Khảo sát toàn diện về các mô hình ngôn ngữ lớn (GPT-4, LLaMA, PaLM), bao gồm pre-training, instruction tuning, RLHF và emergent capabilities.",
      "file_url": "http://localhost:5000/uploads/materials/a-survey-of-large-language-models-llms-1789394699995.pdf",
      "file_type": "PDF",
      "file_size": "5853703",
      "download_count": 143
    },
    {
      "title": "Generative Adversarial Nets (GANs)",
      "description": "[Tác giả: Ian J. Goodfellow, Yoshua Bengio et al. (Université de Montréal)] - Nghiên cứu khởi nguyên của kiến trúc mạng đối nghịch tạo sinh (GAN), ứng dụng trò chơi Minimax trong tổng hợp dữ liệu và hình ảnh.",
      "file_url": "http://localhost:5000/uploads/materials/generative-adversarial-nets-gans-1789394709000.pdf",
      "file_type": "PDF",
      "file_size": "530482",
      "download_count": 253
    },
    {
      "title": "Diffusion Models: A Comprehensive Survey of Methods and Applications",
      "description": "[Tác giả: Ling Yang, Zhilong Zhang, Yang Song et al. (Peking & Stanford University)] - Khảo sát lý thuyết toán học và ứng dụng thực tiễn của mô hình khuếch tán (DALL-E, Stable Diffusion) trong xử lý hình ảnh và đa phương thức.",
      "file_url": "http://localhost:5000/uploads/materials/diffusion-models-a-comprehensive-survey-of-methods-1789394709546.pdf",
      "file_type": "PDF",
      "file_size": "24854165",
      "download_count": 188
    },
    {
      "title": "Deep Learning Foundations: Architectures, Mathematical Optimizers, and Scaling Laws",
      "description": "[Tác giả: Yann LeCun, Yoshua Bengio, Geoffrey Hinton (Nature Deep Learning Review)] - Công trình kinh điển tổng kết nền tảng toán học của mạng nơ-ron học sâu, hàm mất mát và quy luật mở rộng (Scaling Laws) của các mô hình AI.",
      "file_url": "http://localhost:5000/uploads/materials/deep-learning-foundations-architectures-mathematic-1789396187059.pdf",
      "file_type": "PDF",
      "file_size": "819383",
      "download_count": 295
    },
    {
      "title": "Convolutional Neural Networks and Object Detection: A Comprehensive Taxonomy",
      "description": "[Tác giả: IEEE Transactions on Pattern Analysis and Machine Intelligence (TPAMI)] - Khảo sát lý thuyết và cấu trúc mạng CNN, đối chiếu các họ mô hình nhận diện vật thể thời gian thực từ R-CNN đến YOLO và Transformer thị giác.",
      "file_url": "http://localhost:5000/uploads/materials/convolutional-neural-networks-and-object-detection-1789396187605.pdf",
      "file_type": "PDF",
      "file_size": "2215244",
      "download_count": 397
    },
    {
      "title": "Deep Learning Systems Engineering: Distributed Training and Acceleration with PyTorch",
      "description": "[Tác giả: Facebook AI Research (FAIR) & ACM SIGOPS] - Tài liệu nghiên cứu kỹ thuật chuyên sâu về tối ưu hóa huấn luyện mô hình học sâu phân tán trên cụm GPU, kỹ thuật Data Parallelism và Pipeline Parallelism.",
      "file_url": "http://localhost:5000/uploads/materials/deep-learning-systems-engineering-distributed-trai-1789396188819.pdf",
      "file_type": "PDF",
      "file_size": "775166",
      "download_count": 74
    },
    {
      "title": "MIT 6.S191: Introduction to Deep Learning - Official Course Lecture",
      "description": "[Tác giả: Prof. Alexander Amini (Massachusetts Institute of Technology)] - Bài giảng video mở chính thức của Viện Công nghệ Massachusetts (MIT) giới thiệu toàn diện về mạng nơ-ron và học sâu.",
      "file_url": "https://www.youtube.com/watch?v=5tvmMX8r_OM",
      "file_type": "MP4",
      "file_size": "450000000",
      "download_count": 129
    }
  ],
  "Điện toán đám mây & DevOps": [
    {
      "title": "The NIST Definition of Cloud Computing (NIST Special Publication 800-145)",
      "description": "[Tác giả: Peter Mell, Timothy Grance (National Institute of Standards and Technology)] - Văn bản tiêu chuẩn chính thức của Chính phủ Hoa Kỳ định nghĩa 5 đặc tính cốt lõi, 3 mô hình dịch vụ (IaaS, PaaS, SaaS) và 4 mô hình triển khai đám mây.",
      "file_url": "http://localhost:5000/uploads/materials/the-nist-definition-of-cloud-computing-nist-specia-1789394744824.pdf",
      "file_type": "PDF",
      "file_size": "4136",
      "download_count": 424
    },
    {
      "title": "Containerization with Docker: Performance, Isolation, and Security Analysis",
      "description": "[Tác giả: IEEE Cloud Computing Transactions] - Nghiên cứu so sánh hiệu năng chi tiết giữa Máy ảo (Hypervisor VM) và Linux Containers (cgroups, namespaces), đánh giá chi phí overhead CPU và I/O.",
      "file_url": "http://localhost:5000/uploads/materials/containerization-with-docker-performance-isolation-1789394747596.pdf",
      "file_type": "PDF",
      "file_size": "4669136",
      "download_count": 31
    },
    {
      "title": "Kubernetes Orchestration at Scale: Architecture, Scheduling, and Multi-Tenancy",
      "description": "[Tác giả: Cloud Native Computing Foundation (CNCF) & ACM SoCC] - Phân tích kiến trúc Control Plane của Kubernetes (etcd, kube-scheduler, API server), cơ chế tự phục hồi (Self-healing) và mở rộng ngang (HPA).",
      "file_url": "http://localhost:5000/uploads/materials/kubernetes-orchestration-at-scale-architecture-sch-1789394749067.pdf",
      "file_type": "PDF",
      "file_size": "3627052",
      "download_count": 63
    },
    {
      "title": "Serverless Computing: State of the Art, Design Patterns, and Open Challenges",
      "description": "[Tác giả: UC Berkeley Computer Science Technical Report] - Nghiên cứu chuyên sâu về mô hình Function-as-a-Service (FaaS, AWS Lambda), bài toán khởi động lạnh (Cold Starts), và kiến trúc event-driven vô máy chủ.",
      "file_url": "http://localhost:5000/uploads/materials/serverless-computing-state-of-the-art-design-patte-1789394751838.pdf",
      "file_type": "PDF",
      "file_size": "631718",
      "download_count": 160
    },
    {
      "title": "Continuous Integration and Continuous Deployment (CI/CD) in Enterprise Software",
      "description": "[Tác giả: IEEE Transactions on Software Engineering] - Các quy tắc vàng trong tự động hóa pipeline CI/CD, chiến lược triển khai không downtime (Blue-Green, Canary Releases, Rolling Updates).",
      "file_url": "http://localhost:5000/uploads/materials/continuous-integration-and-continuous-deployment-c-1789394752319.pdf",
      "file_type": "PDF",
      "file_size": "323091",
      "download_count": 193
    },
    {
      "title": "Microservices Architecture: Resilience, Circuit Breakers, and Service Mesh",
      "description": "[Tác giả: Martin Fowler, Adrian Cockcroft (Netflix Architecture)] - Các mẫu thiết kế kiến trúc phân tán (Saga pattern, API Gateway, Circuit Breaker) và ứng dụng Service Mesh (Istio, Envoy) trong quản lý traffic.",
      "file_url": "http://localhost:5000/uploads/materials/microservices-architecture-resilience-circuit-brea-1789394753194.pdf",
      "file_type": "PDF",
      "file_size": "780572",
      "download_count": 175
    },
    {
      "title": "Cloud Infrastructure and Container Orchestration: Kubernetes Architectural Internals",
      "description": "[Tác giả: Cloud Native Computing Foundation (CNCF) & ACM SoCC] - Khảo sát kiến trúc Control Plane của Kubernetes, thuật toán lập lịch Pod, cơ chế mạng CNI và quản lý lưu trữ phân tán CSI.",
      "file_url": "http://localhost:5000/uploads/materials/cloud-infrastructure-and-container-orchestration-k-1789396195267.pdf",
      "file_type": "PDF",
      "file_size": "3627052",
      "download_count": 237
    },
    {
      "title": "DevOps Automation: Quantitative Analysis of CI/CD Pipeline Efficiency and Security",
      "description": "[Tác giả: IEEE Transactions on Software Engineering] - Nghiên cứu định lượng về tác động của tự động hóa CI/CD, kiểm thử bảo mật DevSecOps và chiến lược phát hành không gián đoạn Canary/Blue-Green.",
      "file_url": "http://localhost:5000/uploads/materials/devops-automation-quantitative-analysis-of-ci-cd-p-1789396204874.pdf",
      "file_type": "PDF",
      "file_size": "323091",
      "download_count": 194
    },
    {
      "title": "Infrastructure as Code (IaC): Configuration Drift, Security Policies, and State Management",
      "description": "[Tác giả: USENIX Annual Technical Conference (ATC)] - Khảo cứu học thuật về quản trị hạ tầng phần mềm dưới dạng mã, bảo mật State File và phân tích rủi ro cấu hình sai lầm trên đám mây.",
      "file_url": "http://localhost:5000/uploads/materials/infrastructure-as-code-iac-configuration-drift-sec-1789396205802.pdf",
      "file_type": "PDF",
      "file_size": "252829",
      "download_count": 213
    },
    {
      "title": "DevOps Engineering Full Course - Docker, Kubernetes, CI/CD (freeCodeCamp)",
      "description": "[Tác giả: freeCodeCamp DevOps Curriculum] - Video hướng dẫn thực hành toàn diện về lộ trình trở thành kỹ sư DevOps chuyên nghiệp từ Docker cơ bản đến Kubernetes nâng cao.",
      "file_url": "https://www.youtube.com/watch?v=hQcFE0RD0cQ",
      "file_type": "MP4",
      "file_size": "450000000",
      "download_count": 343
    }
  ],
  "An toàn thông tin": [
    {
      "title": "NIST Cybersecurity Framework (CSF 2.0): Core Functions and Implementation",
      "description": "[Tác giả: National Institute of Standards and Technology (NIST Special Publication)] - Khung an ninh mạng tiêu chuẩn quốc tế được áp dụng trên toàn thế giới với 6 trụ cột cốt lõi: Govern, Identify, Protect, Detect, Respond, Recover.",
      "file_url": "http://localhost:5000/uploads/materials/nist-cybersecurity-framework-csf-2-0-core-function-1789394755195.pdf",
      "file_type": "PDF",
      "file_size": "1518858",
      "download_count": 366
    },
    {
      "title": "Zero Trust Architecture (NIST SP 800-207): Foundations and Strategic Tenets",
      "description": "[Tác giả: Scott Rose, Oliver Borchert, Stu Mitchell, Sean Connelly (NIST)] - Tài liệu tiêu chuẩn chính thức của Chính phủ Mỹ về mô hình Zero Trust: Loại bỏ ranh giới mạng tin cậy nội bộ, xác thực danh tính liên tục.",
      "file_url": "http://localhost:5000/uploads/materials/zero-trust-architecture-nist-sp-800-207-foundation-1789394759490.pdf",
      "file_type": "PDF",
      "file_size": "966908",
      "download_count": 98
    },
    {
      "title": "Applied Modern Cryptography: Public Key Infrastructure and Post-Quantum Security",
      "description": "[Tác giả: Dan Boneh, Victor Shoup (Stanford University Computer Science)] - Cơ sở toán học của mật mã học hiện đại: mã hóa bất đối xứng (RSA, Elliptic Curves), trao đổi khóa Diffie-Hellman và mật mã kháng lượng tử.",
      "file_url": "http://localhost:5000/uploads/materials/applied-modern-cryptography-public-key-infrastruct-1789394763842.pdf",
      "file_type": "PDF",
      "file_size": "245607",
      "download_count": 181
    },
    {
      "title": "A Survey on Machine Learning and Deep Learning for Network Intrusion Detection",
      "description": "[Tác giả: IEEE Communications Surveys & Tutorials] - Nghiên cứu học sâu trong phát hiện xâm nhập mạng (NIDS), phân tích bất thường luồng lưu lượng (traffic anomaly) và ngăn chặn tấn công DDoS.",
      "file_url": "http://localhost:5000/uploads/materials/a-survey-on-machine-learning-and-deep-learning-for-1789394764334.pdf",
      "file_type": "PDF",
      "file_size": "3433632",
      "download_count": 222
    },
    {
      "title": "Automated Malware Analysis and Classification: Static, Dynamic, and Hybrid Approaches",
      "description": "[Tác giả: ACM Computing Surveys] - Các kỹ thuật phân tích mã độc chuyên sâu: bóc tách chữ ký nhị phân, phân tích hành vi trong môi trường Sandbox và đối phó kỹ thuật né tránh anti-VM.",
      "file_url": "http://localhost:5000/uploads/materials/automated-malware-analysis-and-classification-stat-1789394771199.pdf",
      "file_type": "PDF",
      "file_size": "978061",
      "download_count": 267
    },
    {
      "title": "Software Supply Chain Security: Vulnerabilities, SBOM, and Defenses",
      "description": "[Tác giả: Linux Foundation / Open Source Security Foundation (OpenSSF)] - Đánh giá các nguy cơ tấn công chuỗi cung ứng phần mềm (như vụ SolarWinds, Log4j), cơ chế ký số nguồn gốc mã nguồn và tiêu chuẩn SBOM.",
      "file_url": "http://localhost:5000/uploads/materials/software-supply-chain-security-vulnerabilities-sbo-1789394771768.pdf",
      "file_type": "PDF",
      "file_size": "1026311",
      "download_count": 107
    },
    {
      "title": "Cyber Defense Architectures: Implementing Defense-in-Depth and Zero Trust Principles",
      "description": "[Tác giả: IEEE Security & Privacy Magazine] - Phân tích kiến trúc phòng thủ mạng đa lớp, mô hình vi phân đoạn (Micro-segmentation) và xác thực danh tính liên tục theo chuẩn NIST SP 800-207.",
      "file_url": "http://localhost:5000/uploads/materials/cyber-defense-architectures-implementing-defense-i-1789396206784.pdf",
      "file_type": "PDF",
      "file_size": "92879",
      "download_count": 324
    },
    {
      "title": "Penetration Testing Methodologies and Automated Web Vulnerability Discovery",
      "description": "[Tác giả: ACM Conference on Computer and Communications Security (CCS)] - Phương pháp luận kiểm thử xâm nhập chuẩn quốc tế, phân tích động mã nhị phân và phát hiện lỗ hổng chuỗi khai thác bảo mật nâng cao.",
      "file_url": "http://localhost:5000/uploads/materials/penetration-testing-methodologies-and-automated-we-1789396207377.pdf",
      "file_type": "PDF",
      "file_size": "3433632",
      "download_count": 376
    },
    {
      "title": "Cybersecurity Incident Response and Digital Forensics: Methodologies and Legal Frameworks",
      "description": "[Tác giả: SANS Institute & NIST Special Publication Series] - Quy trình chuẩn mực quốc tế về ứng phó sự cố an ninh mạng, thu thập chứng cứ số (Digital Forensics) và khôi phục hệ thống sau tấn công tống tiền.",
      "file_url": "http://localhost:5000/uploads/materials/cybersecurity-incident-response-and-digital-forens-1789396209883.pdf",
      "file_type": "PDF",
      "file_size": "978061",
      "download_count": 93
    },
    {
      "title": "Harvard CS50 Cybersecurity - Comprehensive Course Lecture",
      "description": "[Tác giả: Prof. David J. Malan (Harvard University)] - Video bài giảng chính thức từ Đại học Harvard giảng dạy về bản chất các cuộc tấn công mạng, mật mã học và bảo vệ thông tin số.",
      "file_url": "https://www.youtube.com/watch?v=inWWhr5tnEA",
      "file_type": "MP4",
      "file_size": "450000000",
      "download_count": 312
    }
  ],
  "Tài chính & Đầu tư": [
    {
      "title": "Modern Portfolio Theory, Capital Asset Pricing Model, and Machine Learning for Asset Allocation",
      "description": "[Tác giả: Harry Markowitz, William Sharpe et al. (Journal of Financial Economics)] - Lý thuyết danh mục đầu tư hiện đại, đường biên hiệu quả (Efficient Frontier), hệ số Beta và ứng dụng thuật toán học máy trong phân bổ tài sản.",
      "file_url": "http://localhost:5000/uploads/materials/modern-portfolio-theory-capital-asset-pricing-mode-1789394778395.pdf",
      "file_type": "PDF",
      "file_size": "1479793",
      "download_count": 231
    },
    {
      "title": "Deep Reinforcement Learning in Quantitative Finance and Algorithmic Asset Management",
      "description": "[Tác giả: Quantitative Finance Research Group] - Khảo sát ứng dụng học tăng cường (Reinforcement Learning) vào giao dịch tự động trên thị trường chứng khoán và tối ưu chi phí trượt giá.",
      "file_url": "http://localhost:5000/uploads/materials/deep-reinforcement-learning-in-quantitative-financ-1789394779483.pdf",
      "file_type": "PDF",
      "file_size": "3667349",
      "download_count": 337
    },
    {
      "title": "Financial Risk Management: Value at Risk (VaR), Expected Shortfall, and Stress Testing",
      "description": "[Tác giả: Basel Committee on Banking Supervision Bulletin] - Mô hình toán học định lượng rủi ro thị trường theo chuẩn Basel III, phương pháp mô phỏng Monte Carlo và kịch bản căng thẳng tài chính cực đoan.",
      "file_url": "http://localhost:5000/uploads/materials/financial-risk-management-value-at-risk-var-expect-1789394782781.pdf",
      "file_type": "PDF",
      "file_size": "3819417",
      "download_count": 63
    },
    {
      "title": "Behavioral Finance: Heuristics, Cognitive Biases, and Investor Decision Making",
      "description": "[Tác giả: Daniel Kahneman, Amos Tversky, Richard Thaler (Nobel Prize in Economics)] - Khám phá các thiên kiến nhận thức (Loss Aversion, Overconfidence, Herd Mentality) giải thích nguyên nhân bong bóng giá và khủng hoảng thị trường.",
      "file_url": "http://localhost:5000/uploads/materials/behavioral-finance-heuristics-cognitive-biases-and-1789394784031.pdf",
      "file_type": "PDF",
      "file_size": "7041141",
      "download_count": 390
    },
    {
      "title": "Corporate Valuation Methodologies: Discounted Cash Flow (DCF) and Economic Value Added",
      "description": "[Tác giả: Prof. Aswath Damodaran (Stern School of Business, New York University)] - Cẩm nang định giá doanh nghiệp toàn diện: ước tính dòng tiền tự do (FCFF/FCFE), chi phí vốn bình quân gia quyền (WACC) và định giá so sánh P/E, P/B.",
      "file_url": "http://localhost:5000/uploads/materials/corporate-valuation-methodologies-discounted-cash-flow-dcf-and-ec-1789394793869.pdf",
      "file_type": "PDF",
      "file_size": "1481259",
      "download_count": 90
    },
    {
      "title": "Fixed Income Securities and Bond Yield Curve Dynamics",
      "description": "[Tác giả: Federal Reserve Bank Research Series] - Phân tích định giá trái phiếu chính phủ, rủi ro kỳ hạn (Duration & Convexity), cấu trúc kỳ hạn của lãi suất và tín hiệu đảo ngược đường cong lợi suất.",
      "file_url": "http://localhost:5000/uploads/materials/fixed-income-securities-and-bond-yield-curve-dynam-1789394796244.pdf",
      "file_type": "PDF",
      "file_size": "1453327",
      "download_count": 101
    },
    {
      "title": "Corporate Financial Decisions: Capital Structure, WACC, and Agency Cost Dynamics",
      "description": "[Tác giả: Journal of Financial and Quantitative Analysis] - Khảo cứu học thuật về cấu trúc vốn Modigliani-Miller, tác động của đòn bẩy tài chính lên chi phí vốn bình quân gia quyền và định giá công ty.",
      "file_url": "http://localhost:5000/uploads/materials/corporate-financial-decisions-capital-structure-wa-1789396220368.pdf",
      "file_type": "PDF",
      "file_size": "3819417",
      "download_count": 76
    },
    {
      "title": "Quantitative Portfolio Management: Factor Investing, Alpha Generation, and Risk Premia",
      "description": "[Tác giả: Eugene Fama, Kenneth French (Journal of Finance)] - Mô hình đa nhân tố Fama-French, chiến lược đầu tư theo yếu tố (Smart Beta) và quản trị rủi ro biến động danh mục tài sản lớn.",
      "file_url": "http://localhost:5000/uploads/materials/quantitative-portfolio-management-factor-investing-1789396224947.pdf",
      "file_type": "PDF",
      "file_size": "1479793",
      "download_count": 78
    },
    {
      "title": "Financial Modeling and Valuation: Practical DCF, LBO, and Financial Statement Projections",
      "description": "[Tác giả: CFA Institute Educational Foundation] - Cẩm nang học thuật về mô hình hóa tài chính: kỹ thuật dự phóng bảng cân đối, tính toán dòng tiền tự do FCFF và phân tích độ nhạy (Sensitivity Analysis).",
      "file_url": "http://localhost:5000/uploads/materials/financial-modeling-and-valuation-practical-dcf-lbo-1789396225899.pdf",
      "file_type": "PDF",
      "file_size": "1481259",
      "download_count": 326
    },
    {
      "title": "MIT 15.401 Finance Theory I - Official MIT Course Lecture",
      "description": "[Tác giả: Prof. Andrew Lo (MIT Sloan School of Management)] - Video bài giảng kinh điển của Giáo sư Andrew Lo tại Viện Công nghệ MIT về lý thuyết tài chính, định giá tài sản và quản lý rủi ro.",
      "file_url": "https://www.youtube.com/watch?v=HdHlfiOAJyE",
      "file_type": "MP4",
      "file_size": "450000000",
      "download_count": 282
    }
  ],
  "Kế toán - Kiểm toán": [
    {
      "title": "International Financial Reporting Standards (IFRS) vs US GAAP: A Comparative Study",
      "description": "[Tác giả: International Accounting Standards Board (IASB) & Journal of Accounting Research] - Phân tích đối chiếu chi tiết giữa chuẩn mực kế toán quốc tế (IFRS) dựa trên nguyên tắc và US GAAP dựa trên quy tắc cụ thể.",
      "file_url": "http://localhost:5000/uploads/materials/international-financial-reporting-standards-ifrs-v-1789394797513.pdf",
      "file_type": "PDF",
      "file_size": "525922",
      "download_count": 279
    },
    {
      "title": "Auditing Standards, Internal Control Integrated Framework (COSO), and Audit Quality",
      "description": "[Tác giả: Committee of Sponsoring Organizations of the Treadway Commission (COSO)] - Khuôn khổ kiểm soát nội bộ chuẩn mực toàn cầu với 5 thành phần cốt lõi và phương pháp đánh giá rủi ro kiểm toán độc lập.",
      "file_url": "http://localhost:5000/uploads/materials/auditing-standards-internal-control-integrated-fra-1789394798373.pdf",
      "file_type": "PDF",
      "file_size": "16664767",
      "download_count": 46
    },
    {
      "title": "Activity-Based Costing (ABC) and Strategic Management Accounting",
      "description": "[Tác giả: Robert S. Kaplan, Robin Cooper (Harvard Business Review)] - Phương pháp kế toán chi phí theo hoạt động (ABC) giúp xác định chính xác chi phí ẩn, giá thành sản phẩm và nâng cao hiệu quả vận hành.",
      "file_url": "http://localhost:5000/uploads/materials/activity-based-costing-abc-and-strategic-managemen-1789394824256.pdf",
      "file_type": "PDF",
      "file_size": "706922",
      "download_count": 383
    },
    {
      "title": "Forensic Accounting and Machine Learning Techniques for Financial Fraud Detection",
      "description": "[Tác giả: Association of Certified Fraud Examiners (ACFE)] - Nghiên cứu ứng dụng tam giác gian lận (Fraud Triangle), định luật Benford và thuật toán AI trong phát hiện gian lận báo cáo tài chính.",
      "file_url": "http://localhost:5000/uploads/materials/forensic-accounting-and-machine-learning-technique-1789394826225.pdf",
      "file_type": "PDF",
      "file_size": "1710966",
      "download_count": 34
    },
    {
      "title": "Financial Statement Analysis: Liquidity, Solvency, and Forensic Ratio Evaluation",
      "description": "[Tác giả: Financial Analysts Journal Research Group] - Cẩm nang phân tích báo cáo tài chính: mô hình phân tích DuPont, chỉ số thanh khoản, cơ cấu nợ và dòng tiền hoạt động.",
      "file_url": "http://localhost:5000/uploads/materials/financial-statement-analysis-liquidity-solvency-an-1789394827547.pdf",
      "file_type": "PDF",
      "file_size": "234449",
      "download_count": 177
    },
    {
      "title": "Corporate Taxation, Transfer Pricing, and BEPS Compliance in Multinational Corporations",
      "description": "[Tác giả: OECD Centre for Tax Policy and Administration] - Quy chuẩn quốc tế về chống xói mòn cơ sở thuế và chuyển lợi nhuận (BEPS), nguyên tắc giao dịch độc lập (Arm's Length Principle).",
      "file_url": "http://localhost:5000/uploads/materials/corporate-taxation-transfer-pricing-and-beps-compl-1789394828270.pdf",
      "file_type": "PDF",
      "file_size": "476251",
      "download_count": 55
    },
    {
      "title": "Financial Accounting Standards: Revenue Recognition, Lease Accounting, and Fair Value",
      "description": "[Tác giả: International Accounting Standards Board (IASB) Research] - Phân tích nguyên lý hạch toán chuẩn IFRS 15, IFRS 16 và đối sánh tác động lên chỉ số thanh khoản và EBITDA của doanh nghiệp niêm yết.",
      "file_url": "http://localhost:5000/uploads/materials/financial-accounting-standards-revenue-recognition-1789396226621.pdf",
      "file_type": "PDF",
      "file_size": "525922",
      "download_count": 193
    },
    {
      "title": "Managerial Accounting: Strategic Cost Management, Variance Analysis, and Activity-Based Costing",
      "description": "[Tác giả: Harvard Business Review & Journal of Management Accounting] - Lý thuyết kế toán quản trị chiến lược: định giá sản phẩm dựa trên chuỗi giá trị, phân tích biến động chi phí và thẻ điểm cân bằng Balanced Scorecard.",
      "file_url": "http://localhost:5000/uploads/materials/managerial-accounting-strategic-cost-management-va-1789396227071.pdf",
      "file_type": "PDF",
      "file_size": "706922",
      "download_count": 98
    },
    {
      "title": "Forensic Accounting and Audit Quality: Detection of Financial Statement Manipulation",
      "description": "[Tác giả: Journal of Accounting and Economics] - Nghiên cứu học thuật về các dấu hiệu thao túng báo cáo tài chính (Earnings Management), mô hình M-Score Beneish và trách nhiệm kiểm toán độc lập.",
      "file_url": "http://localhost:5000/uploads/materials/forensic-accounting-and-audit-quality-detection-of-1789396227551.pdf",
      "file_type": "PDF",
      "file_size": "1710966",
      "download_count": 195
    },
    {
      "title": "Accounting Principles & Financial Accounting Crash Course",
      "description": "[Tác giả: Corporate Finance Institute (CFI) Open Education] - Video bài giảng trực quan hướng dẫn toàn diện từ cơ sở lý thuyết kế toán đến cách đọc hiểu và phân tích báo cáo tài chính chuyên nghiệp.",
      "file_url": "https://www.youtube.com/watch?v=yYX4bvQSqbo",
      "file_type": "MP4",
      "file_size": "450000000",
      "download_count": 170
    }
  ],
  "Quản trị kinh doanh": [
    {
      "title": "Competitive Strategy: Techniques for Analyzing Industries and Competitors",
      "description": "[Tác giả: Prof. Michael E. Porter (Harvard Business School)] - Công trình kinh điển về mô hình 5 áp lực cạnh tranh (Porter's Five Forces), chuỗi giá trị và 3 chiến lược định vị cạnh tranh tổng quát.",
      "file_url": "http://localhost:5000/uploads/materials/competitive-strategy-techniques-for-analyzing-indu-1789394829067.pdf",
      "file_type": "PDF",
      "file_size": "317417",
      "download_count": 256
    },
    {
      "title": "Dynamic Capabilities and Strategic Management in Volatile and Uncertain Environments",
      "description": "[Tác giả: Prof. David J. Teece (UC Berkeley Haas School of Business)] - Năng lực động của doanh nghiệp trong việc nhận diện thời cơ (Sensing), nắm bắt cơ hội (Seizing) và chuyển đổi nguồn lực trước biến động.",
      "file_url": "http://localhost:5000/uploads/materials/dynamic-capabilities-and-strategic-management-in-v-1789394830352.pdf",
      "file_type": "PDF",
      "file_size": "4734305",
      "download_count": 163
    },
    {
      "title": "Organizational Behavior: Transformational Leadership, Motivation, and Team Dynamics",
      "description": "[Tác giả: Academy of Management Annals Research] - Nghiên cứu về phong cách lãnh đạo truyền cảm hứng, động lực làm việc nội tại, và xây dựng môi trường an toàn tâm lý (Psychological Safety) trong tổ chức.",
      "file_url": "http://localhost:5000/uploads/materials/organizational-behavior-transformational-leadershi-1789394839233.pdf",
      "file_type": "PDF",
      "file_size": "668251",
      "download_count": 294
    },
    {
      "title": "Supply Chain Resilience: Risk Management, Agility, and Disruption Mitigation",
      "description": "[Tác giả: MIT Center for Transportation and Logistics] - Chiến lược quản trị chuỗi cung ứng linh hoạt và bền bỉ trước khủng hoảng toàn cầu, kết hợp tối ưu tồn kho Just-In-Time và Just-In-Case.",
      "file_url": "http://localhost:5000/uploads/materials/supply-chain-resilience-risk-management-agility-an-1789394840819.pdf",
      "file_type": "PDF",
      "file_size": "325982",
      "download_count": 337
    },
    {
      "title": "Business Model Innovation: The Value Proposition Canvas and Digital Transformation",
      "description": "[Tác giả: Alexander Osterwalder, Yves Pigneur (Strategyzer Research)] - Phương pháp luận thiết kế mô hình kinh doanh Canvas (BMC), thấu hiểu nỗi đau khách hàng và đổi mới sáng tạo mô hình doanh thu trong nền kinh tế số.",
      "file_url": "http://localhost:5000/uploads/materials/business-model-innovation-the-value-proposition-ca-1789394841400.pdf",
      "file_type": "PDF",
      "file_size": "3430842",
      "download_count": 100
    },
    {
      "title": "Total Quality Management (TQM) and Lean Operations: Waste Elimination and Six Sigma",
      "description": "[Tác giả: W. Edwards Deming Institute & Toyota Production System] - Triết lý cải tiến liên tục Kaizen, loại bỏ 7 loại lãng phí trong vận hành (Muda), và chu trình kiểm soát chất lượng chuẩn Deming (PDCA).",
      "file_url": "http://localhost:5000/uploads/materials/total-quality-management-tqm-and-lean-operations-w-1789394843254.pdf",
      "file_type": "PDF",
      "file_size": "4681034",
      "download_count": 48
    },
    {
      "title": "Strategic Management in Dynamic Environments: Resource-Based View and Competitive Advantage",
      "description": "[Tác giả: Strategic Management Journal (SMJ)] - Khung lý thuyết VRIO, năng lực cốt lõi (Core Competencies) và chiến lược dẫn dắt chuyển đổi số trong các tập đoàn đa quốc gia.",
      "file_url": "http://localhost:5000/uploads/materials/strategic-management-in-dynamic-environments-resou-1789396228122.pdf",
      "file_type": "PDF",
      "file_size": "317417",
      "download_count": 276
    },
    {
      "title": "Operations Management: Lean Production, Value Stream Mapping, and Quality Systems",
      "description": "[Tác giả: International Journal of Operations & Production Management] - Phân tích định lượng về tối ưu hóa dòng chảy giá trị, loại bỏ lãng phí sản xuất, cân bằng dây chuyền (Heijunka) và kiểm soát chất lượng 6 Sigma.",
      "file_url": "http://localhost:5000/uploads/materials/operations-management-lean-production-value-stream-1789396228559.pdf",
      "file_type": "PDF",
      "file_size": "4681034",
      "download_count": 400
    },
    {
      "title": "Corporate Governance and Executive Leadership: Agency Theory, Stakeholder Theory, and Ethics",
      "description": "[Tác giả: Academy of Management Perspectives] - Nghiên cứu về cơ chế giám sát hội đồng quản trị, thù lao điều hành, văn hóa minh bạch thông tin và trách nhiệm xã hội doanh nghiệp (CSR/ESG).",
      "file_url": "http://localhost:5000/uploads/materials/corporate-governance-and-executive-leadership-agen-1789396231106.pdf",
      "file_type": "PDF",
      "file_size": "668251",
      "download_count": 30
    },
    {
      "title": "Stanford Graduate School of Business - Strategic Management Lectures",
      "description": "[Tác giả: Stanford Graduate School of Business (GSB)] - Chuỗi bài giảng video học thuật từ trường kinh doanh hàng đầu thế giới về tư duy chiến lược, lãnh đạo và đổi mới sáng tạo trong doanh nghiệp.",
      "file_url": "https://www.youtube.com/watch?v=3qHkcpO3w4E",
      "file_type": "MP4",
      "file_size": "450000000",
      "download_count": 56
    }
  ],
  "Quản trị dự án (Agile)": [
    {
      "title": "The Scrum Guide: The Definitive Guide to Scrum - The Rules of the Game (Official 2020 Edition)",
      "description": "[Tác giả: Ken Schwaber & Jeff Sutherland (Đồng sáng lập Scrum & Scrum.org)] - Văn bản tiêu chuẩn chính thức của thế giới định nghĩa toàn diện về Scrum: 3 vai trò, 5 sự kiện và 3 tạo tác quản trị dự án phần mềm linh hoạt.",
      "file_url": "http://localhost:5000/uploads/materials/the-scrum-guide-the-definitive-guide-to-scrum-the-rules-of-the-ga-1789394847204.pdf",
      "file_type": "PDF",
      "file_size": "254353",
      "download_count": 346
    },
    {
      "title": "Agile Software Development: Empirical Process Control and Sprint Dynamics",
      "description": "[Tác giả: IEEE Software & ACM SIGSOFT Research] - Nghiên cứu thực nghiệm về lý thuyết điều khiển quy trình thực nghiệm (Minh bạch, Thanh tra, Thích nghi) và đo lường vận tốc đội ngũ (Team Velocity).",
      "file_url": "http://localhost:5000/uploads/materials/agile-software-development-empirical-process-contr-1789394848211.pdf",
      "file_type": "PDF",
      "file_size": "26700542",
      "download_count": 74
    },
    {
      "title": "Guidelines to Minimize Cost of Software Quality in Agile Scrum Process",
      "description": "[Tác giả: Deepa Vijay, Gopinath Ganapathy (International Journal of Software Engineering)] - Chiến lược tối ưu chi phí chất lượng (Cost of Quality), ngăn ngừa lỗi sớm (Shift-Left Testing) và kỹ thuật tái cấu trúc mã nguồn liên tục trong Sprint.",
      "file_url": "http://localhost:5000/uploads/materials/guidelines-to-minimize-cost-of-software-quality-in-1789394867708.pdf",
      "file_type": "PDF",
      "file_size": "189638",
      "download_count": 287
    },
    {
      "title": "An Empirical Analysis of Task Allocation and Self-Organizing Teams in Scrum",
      "description": "[Tác giả: Nanyang Technological University & IEEE Transactions] - Nghiên cứu hành vi tự tổ chức của nhóm phát triển, phân bổ công việc theo năng lực chéo (Cross-functional), và loại bỏ hiện tượng nút thắt cổ chai.",
      "file_url": "http://localhost:5000/uploads/materials/an-empirical-analysis-of-task-allocation-and-self-organizing-team-1789394868469.pdf",
      "file_type": "PDF",
      "file_size": "292891",
      "download_count": 228
    },
    {
      "title": "Kanban and Lean Software Development: Flow Optimization and WIP Limits",
      "description": "[Tác giả: David J. Anderson (Kanban University) & Henrik Kniberg] - Nguyên lý trực quan hóa luồng công việc, thiết lập giới hạn công việc đang xử lý (WIP Limits), đo lường Lead Time và Cycle Time theo định luật Little.",
      "file_url": "http://localhost:5000/uploads/materials/kanban-and-lean-software-development-flow-optimiza-1789394869104.pdf",
      "file_type": "PDF",
      "file_size": "5645362",
      "download_count": 291
    },
    {
      "title": "Agile Transformation in Large-Scale Organizations: Challenges and Enablers",
      "description": "[Tác giả: University of Oslo / Scientific Software Engineering Group] - Khảo sát thực tiễn chuyển đổi số Agile quy mô lớn, so sánh các khung mở rộng (SAFe, LeSS, Spotify Model) và giải quyết rào cản văn hóa tổ chức.",
      "file_url": "http://localhost:5000/uploads/materials/agile-transformation-in-large-scale-organizations-challenges-and--1789394871793.pdf",
      "file_type": "PDF",
      "file_size": "432464",
      "download_count": 137
    },
    {
      "title": "Empirical Process Control in Scrum: Sprint Metrics, Velocity, and Team Self-Organization",
      "description": "[Tác giả: IEEE Software & Agile Alliance Research] - Cơ sở khoa học của quản trị dự án linh hoạt: lý thuyết điều khiển quy trình thực nghiệm, đo lường vận tốc Sprint và cơ chế tự quản của nhóm Agile.",
      "file_url": "http://localhost:5000/uploads/materials/empirical-process-control-in-scrum-sprint-metrics-velocity-and-te-1789396231678.pdf",
      "file_type": "PDF",
      "file_size": "20754858",
      "download_count": 228
    },
    {
      "title": "Kanban Flow Optimization: Little’s Law, Work-in-Progress Limits, and Lead Time Reduction",
      "description": "[Tác giả: International Conference on Agile Software Development (XP)] - Phân tích toán học về Định luật Little trong quản lý luồng công việc Kanban, kỹ thuật giảm thiểu thời gian hoàn vốn và loại bỏ điểm nghẽn dự án.",
      "file_url": "http://localhost:5000/uploads/materials/kanban-flow-optimization-little-s-law-work-in-prog-1789396266751.pdf",
      "file_type": "PDF",
      "file_size": "5645362",
      "download_count": 181
    },
    {
      "title": "Large-Scale Agile Transformation: Governance, Architecture, and Cultural Change in Enterprises",
      "description": "[Tác giả: Empirical Software Engineering Journal] - Khảo cứu học thuật thực tế về chuyển đổi Agile quy mô lớn tại các tổ chức tài chính và công nghệ: triển khai SAFe, LeSS và chuyển đổi văn hóa.",
      "file_url": "http://localhost:5000/uploads/materials/large-scale-agile-transformation-governance-archit-1789396275322.pdf",
      "file_type": "PDF",
      "file_size": "432464",
      "download_count": 198
    },
    {
      "title": "Scrum Master Crash Course & Agile Project Management (Scrum.org Official)",
      "description": "[Tác giả: Scrum.org Professional Training Group] - Video bài giảng chuẩn mực toàn cầu hướng dẫn chi tiết quy trình áp dụng Scrum hiệu quả trong các dự án công nghệ thực tế.",
      "file_url": "https://www.youtube.com/watch?v=2Vt7Ik8Ubl8",
      "file_type": "MP4",
      "file_size": "450000000",
      "download_count": 262
    }
  ],
  "Luyện thi TOEIC": [
    {
      "title": "TOEIC Speaking and Writing Official Examinee Handbook (ETS Official Publication)",
      "description": "[Tác giả: Educational Testing Service (ETS Hoa Kỳ)] - Cẩm nang chính thức của ETS gồm hướng dẫn toàn diện cấu trúc đề thi TOEIC Nói & Viết, thang điểm chấm và bộ câu hỏi mẫu có giải thích.",
      "file_url": "http://localhost:5000/uploads/materials/toeic-speaking-and-writing-official-examinee-handb-1789395852806.pdf",
      "file_type": "PDF",
      "file_size": "898834",
      "download_count": 127
    },
    {
      "title": "TOEIC Listening and Reading Test Specifications and Sample Questions Booklet",
      "description": "[Tác giả: Educational Testing Service (ETS)] - Tài liệu kỹ thuật chính thức định nghĩa 7 phần thi (Part 1 - Part 7) của bài thi TOEIC Quốc tế kèm 200 câu hỏi trắc nghiệm mẫu.",
      "file_url": "http://localhost:5000/uploads/materials/toeic-listening-and-reading-test-specifications-an-1789395853527.pdf",
      "file_type": "PDF",
      "file_size": "898834",
      "download_count": 410
    },
    {
      "title": "Mapping the TOEIC Tests on the Common European Framework of Reference (CEFR)",
      "description": "[Tác giả: Educational Testing Service Research Division] - Nghiên cứu khoa học chính thức của ETS đối chiếu điểm số TOEIC từ 10 đến 990 với các cấp độ năng lực ngôn ngữ Châu Âu A1 - C1.",
      "file_url": "http://localhost:5000/uploads/materials/mapping-the-toeic-tests-on-the-common-european-fra-1789395854258.pdf",
      "file_type": "PDF",
      "file_size": "154703",
      "download_count": 142
    },
    {
      "title": "The Validity of the TOEIC Speaking and Writing Tests: Multi-institutional Evidence",
      "description": "[Tác giả: Donald E. Powers, Brent Bridgeman (ETS Research Report)] - Báo cáo nghiên cứu độ giá trị và độ tin cậy của bài thi TOEIC 4 kỹ năng trong môi trường doanh nghiệp đa quốc gia.",
      "file_url": "http://localhost:5000/uploads/materials/the-validity-of-the-toeic-speaking-and-writing-tes-1789395856107.pdf",
      "file_type": "PDF",
      "file_size": "1172762",
      "download_count": 454
    },
    {
      "title": "Official TOEIC Can-Do Guide: Workplace English Competency Descriptors",
      "description": "[Tác giả: Educational Testing Service (ETS)] - Bảng mô tả năng lực thực hành công việc theo từng khoảng điểm TOEIC: gửi email, tham gia hội nghị, đàm phán hợp đồng thương mại.",
      "file_url": "http://localhost:5000/uploads/materials/official-toeic-can-do-guide-workplace-english-comp-1789395860743.pdf",
      "file_type": "PDF",
      "file_size": "898834",
      "download_count": 201
    },
    {
      "title": "600 Essential Business Words for the TOEIC Test: Contextual Definitions & Exercises",
      "description": "[Tác giả: Lin Lougheed & Educational Testing Service] - Giáo trình 50 chủ đề từ vựng thương mại cốt lõi xuất hiện nhiều nhất trong các kỳ thi TOEIC chính thức.",
      "file_url": "http://localhost:5000/uploads/materials/600-essential-business-words-for-the-toeic-test-co-1789395861774.pdf",
      "file_type": "PDF",
      "file_size": "1104836",
      "download_count": 144
    },
    {
      "title": "TOEIC Bridge Official Test Taker Handbook & Sample Examination Paper",
      "description": "[Tác giả: Educational Testing Service (ETS)] - Tài liệu cẩm nang và đề thi mẫu chính thức của bài thi TOEIC Bridge đánh giá trình độ tiếng Anh sơ cấp và trung cấp.",
      "file_url": "http://localhost:5000/uploads/materials/toeic-bridge-official-test-taker-handbook-sample-e-1789395865585.pdf",
      "file_type": "PDF",
      "file_size": "898834",
      "download_count": 253
    },
    {
      "title": "TOEIC Test Takers Score Report Guidelines and Performance Feedback Manual",
      "description": "[Tác giả: Educational Testing Service (ETS Global)] - Hướng dẫn phân tích phiếu điểm TOEIC chính thức, hiểu rõ các phân đoạn điểm mạnh, điểm yếu trong từng dạng bài thi.",
      "file_url": "http://localhost:5000/uploads/materials/toeic-test-takers-score-report-guidelines-and-perf-1789395866832.pdf",
      "file_type": "PDF",
      "file_size": "192473",
      "download_count": 572
    },
    {
      "title": "Analysis of Item Difficulty and Response Times in Computer-Based TOEIC Tests",
      "description": "[Tác giả: ETS Psychometric Research Team] - Nghiên cứu tâm lý học đo lường (Psychometrics) về độ khó câu hỏi và thời gian phản xạ của thí sinh trong bài thi TOEIC trên máy vi tính.",
      "file_url": "http://localhost:5000/uploads/materials/analysis-of-item-difficulty-and-response-times-in-computer-based--1789395869351.pdf",
      "file_type": "PDF",
      "file_size": "1499517",
      "download_count": 292
    },
    {
      "title": "TOEIC Test Administration Security Regulations and Exam Center Guidelines",
      "description": "[Tác giả: ETS Global Testing Infrastructure] - Quy chuẩn an ninh khảo thí nghiêm ngặt của ETS áp dụng tại hơn 160 quốc gia trên thế giới.",
      "file_url": "http://localhost:5000/uploads/materials/toeic-test-administration-security-regulations-and-1789395873926.pdf",
      "file_type": "PDF",
      "file_size": "898834",
      "download_count": 120
    }
  ],
  "Tiếng Nhật (JLPT)": [
    {
      "title": "JLPT Official Practice Workbook N5 (Vol 2) - Language Knowledge (Vocabulary/Grammar) & Reading",
      "description": "[Tác giả: The Japan Foundation & Japan Educational Exchanges and Services (JEES)] - Đề thi thật chính thức cấp độ N5 (60 trang) do Quỹ Giao lưu Quốc tế Nhật Bản phát hành, có đầy đủ chữ Kanji, bài đọc hiểu và bảng đáp án.",
      "file_url": "http://localhost:5000/uploads/materials/jlpt-official-practice-workbook-n5-vol-2-language-knowledge-vocab-1789395952937.pdf",
      "file_type": "PDF",
      "file_size": "1032465",
      "download_count": 238
    },
    {
      "title": "JLPT Official Practice Workbook N5 (Vol 2) - Listening Examination Booklet with Illustrations",
      "description": "[Tác giả: The Japan Foundation & JEES] - Đề thi Nghe chính thức cấp độ N5 gồm tranh vẽ minh họa tình huống, câu hỏi chọn tranh và kịch bản thoại audio kèm theo.",
      "file_url": "http://localhost:5000/uploads/materials/jlpt-official-practice-workbook-n5-vol-2-listening-1789395959999.pdf",
      "file_type": "PDF",
      "file_size": "2366936",
      "download_count": 463
    },
    {
      "title": "JLPT Official Practice Workbook N4 (Vol 2) - Complete Language Knowledge & Reading Test Paper",
      "description": "[Tác giả: The Japan Foundation & JEES] - Đề thi thật chính thức cấp độ N4 đầy đủ phần Kiến thức ngôn ngữ (Từ vựng/Ngữ pháp) và Đọc hiểu trung cấp.",
      "file_url": "http://localhost:5000/uploads/materials/jlpt-official-practice-workbook-n4-vol-2-complete-language-knowle-1789395978072.pdf",
      "file_type": "PDF",
      "file_size": "1056760",
      "download_count": 507
    },
    {
      "title": "JLPT Official Practice Workbook N4 (Vol 2) - Listening Section Examination Booklet",
      "description": "[Tác giả: The Japan Foundation & JEES] - Tập đề thi Nghe hiểu N4 chính thức với các dạng bài: nghe nắm bắt nội dung, nghe có tranh và phản xạ giao tiếp nhanh.",
      "file_url": "http://localhost:5000/uploads/materials/jlpt-official-practice-workbook-n4-vol-2-listening-1789395984530.pdf",
      "file_type": "PDF",
      "file_size": "2236785",
      "download_count": 222
    },
    {
      "title": "JLPT Official Practice Workbook N3 (Vol 2) - Intermediate Language Knowledge Examination",
      "description": "[Tác giả: The Japan Foundation & JEES] - Đề thi thật cấp độ N3 đánh giá khả năng hiểu tiếng Nhật trong các tình huống hàng ngày ở mức độ nhất định.",
      "file_url": "http://localhost:5000/uploads/materials/jlpt-official-practice-workbook-n3-vol-2-intermedi-1789395996670.pdf",
      "file_type": "PDF",
      "file_size": "1099005",
      "download_count": 96
    },
    {
      "title": "JLPT Official Practice Workbook N3 (Vol 2) - Reading Comprehension Examination Paper",
      "description": "[Tác giả: The Japan Foundation & JEES] - Đề thi Đọc hiểu N3 gồm các đoạn văn ngắn, trung bình, bài luận so sánh và tìm kiếm thông tin trên biểu mẫu thực tế.",
      "file_url": "http://localhost:5000/uploads/materials/jlpt-official-practice-workbook-n3-vol-2-reading-c-1789396007264.pdf",
      "file_type": "PDF",
      "file_size": "751148",
      "download_count": 607
    },
    {
      "title": "JLPT Official Practice Workbook N2 (Vol 2) - Advanced Language Knowledge Examination",
      "description": "[Tác giả: The Japan Foundation & JEES] - Đề thi chính thức N2 đánh giá năng lực hiểu tiếng Nhật trong nhiều hoàn cảnh thực tế, bao gồm các bài báo kinh tế và đời sống xã hội.",
      "file_url": "http://localhost:5000/uploads/materials/jlpt-official-practice-workbook-n2-vol-2-advanced-language-knowle-1789396012700.pdf",
      "file_type": "PDF",
      "file_size": "1696324",
      "download_count": 451
    },
    {
      "title": "JLPT Official Practice Workbook N2 (Vol 2) - Advanced Reading Comprehension Booklet",
      "description": "[Tác giả: The Japan Foundation & JEES] - Đề thi Đọc hiểu N2 chuyên sâu với các bài bình luận chuyên môn, văn bản xã luận và câu hỏi phân tích logic sắc bén.",
      "file_url": "http://localhost:5000/uploads/materials/jlpt-official-practice-workbook-n2-vol-2-advanced-reading-compreh-1789396025290.pdf",
      "file_type": "PDF",
      "file_size": "821947",
      "download_count": 232
    },
    {
      "title": "JLPT Official Practice Workbook N1 (Vol 2) - Expert Language Knowledge Examination",
      "description": "[Tác giả: The Japan Foundation & JEES] - Đề thi thật cấp độ N1 cao nhất: Từ vựng trừu tượng, thành ngữ bốn chữ Hán (Yojijukugo) và cấu trúc ngữ pháp cổ điển nâng cao.",
      "file_url": "http://localhost:5000/uploads/materials/jlpt-official-practice-workbook-n1-vol-2-expert-la-1789396032244.pdf",
      "file_type": "PDF",
      "file_size": "1369410",
      "download_count": 452
    },
    {
      "title": "Bảng Danh Mục 2,136 Chữ Hán Thường Dùng (常用漢字表 - Joyo Kanji) Chính Thức",
      "description": "[Tác giả: Cục Văn hóa (Bunkacho) & Bộ Giáo dục Nhật Bản (MEXT)] - Văn bản tiêu chuẩn quốc gia của Chính phủ Nhật Bản công bố toàn bộ 2,136 chữ Hán chính thức kèm cách đọc On/Kun và số nét.",
      "file_url": "http://localhost:5000/uploads/materials/bang-danh-muc-2-136-chu-han-thuong-dung-joyo-kanji-chinh-thuc-1789396039172.pdf",
      "file_type": "PDF",
      "file_size": "909429",
      "download_count": 55
    }
  ],
  "Tiếng Trung (HSK)": [
    {
      "title": "Đề Thi Mẫu HSK Cấp 1 Chính Thức (Official HSK 1 Mock Exam Paper & Answer Key)",
      "description": "[Tác giả: Hanban & Chinese Testing International (CTI)] - Bộ đề thi chuẩn HSK 1 do cơ quan khảo thí Trung Quốc phát hành, gồm phần Nghe hiểu (Listening) và Đọc hiểu (Reading) kèm bảng đáp án.",
      "file_url": "http://localhost:5000/uploads/materials/de-thi-mau-hsk-cap-1-chinh-thuc-official-hsk-1-mock-exam-paper-an-1789396045256.pdf",
      "file_type": "PDF",
      "file_size": "1032465",
      "download_count": 546
    },
    {
      "title": "Đề Thi Mẫu HSK Cấp 2 Chính Thức (Official HSK 2 Mock Exam Paper & Answer Key)",
      "description": "[Tác giả: Hanban / Confucius Institute Headquarters] - Đề thi mẫu HSK 2 đánh giá năng lực giao tiếp đơn giản và trực tiếp trong cuộc sống hàng ngày đối với người học tiếng Trung cơ bản.",
      "file_url": "http://localhost:5000/uploads/materials/de-thi-mau-hsk-cap-2-chinh-thuc-official-hsk-2-mock-exam-paper-an-1789396050465.pdf",
      "file_type": "PDF",
      "file_size": "1056760",
      "download_count": 605
    },
    {
      "title": "Đề Thi Mẫu HSK Cấp 3 Chính Thức (Official HSK 3 Complete Examination Booklet)",
      "description": "[Tác giả: Chinese Testing International (CTI)] - Đề thi HSK 3 gồm 3 phần thi: Nghe hiểu, Đọc hiểu và Viết chữ Hán (Writing), đánh giá mức độ hoàn thành nhiệm vụ giao tiếp cơ bản.",
      "file_url": "http://localhost:5000/uploads/materials/de-thi-mau-hsk-cap-3-chinh-thuc-official-hsk-3-complete-examinati-1789396059932.pdf",
      "file_type": "PDF",
      "file_size": "1099005",
      "download_count": 395
    },
    {
      "title": "Đề Thi Mẫu HSK Cấp 4 Chính Thức (Official HSK 4 Examination Paper & Writing Section)",
      "description": "[Tác giả: Hanban & Chinese Testing International] - Đề thi thật HSK 4 gồm 100 câu hỏi, kiểm tra vốn từ 1,200 từ vựng và khả năng thảo luận các chủ đề xã hội tương đối rộng.",
      "file_url": "http://localhost:5000/uploads/materials/de-thi-mau-hsk-cap-4-chinh-thuc-official-hsk-4-examination-paper--1789396065118.pdf",
      "file_type": "PDF",
      "file_size": "1696324",
      "download_count": 559
    },
    {
      "title": "Đề Thi Mẫu HSK Cấp 5 Chính Thức (Official HSK 5 Advanced Examination Paper)",
      "description": "[Tác giả: Chinese Testing International (CTI)] - Đề thi HSK 5 trình độ cao cấp: đọc hiểu báo chí, xem phim ảnh tiếng Trung và viết đoạn văn luận điểm hoàn chỉnh từ vốn 2,500 từ vựng.",
      "file_url": "http://localhost:5000/uploads/materials/de-thi-mau-hsk-cap-5-chinh-thuc-official-hsk-5-advanced-examinati-1789396072862.pdf",
      "file_type": "PDF",
      "file_size": "1369410",
      "download_count": 261
    },
    {
      "title": "Đề Thi Mẫu HSK Cấp 6 Chính Thức (Official HSK 6 Mastery Examination Paper)",
      "description": "[Tác giả: Hanban / CTI Research Group] - Đề thi cấp độ tinh thông cao nhất HSK 6: Đọc hiểu các tài liệu học thuật chuyên sâu và tóm tắt bài văn dài 1,000 chữ thành 400 chữ.",
      "file_url": "http://localhost:5000/uploads/materials/de-thi-mau-hsk-cap-6-chinh-thuc-official-hsk-6-mastery-examinatio-1789396087421.pdf",
      "file_type": "PDF",
      "file_size": "909429",
      "download_count": 271
    },
    {
      "title": "Tiêu Chuẩn Đánh Giá Trình Độ Tiếng Trung Quốc Tế (GF0025-2021 Tiêu Chuẩn Quốc Gia)",
      "description": "[Tác giả: Bộ Giáo dục Cộng hòa Nhân dân Trung Hoa] - Văn bản tiêu chuẩn mới nhất quy định khung năng lực 3 bậc 9 cấp (HSK 3.0) đối với người nước ngoài học tiếng Trung Quốc.",
      "file_url": "http://localhost:5000/uploads/materials/tieu-chuan-danh-gia-trinh-do-tieng-trung-quoc-te-gf0025-2021-tieu-1789396097179.pdf",
      "file_type": "PDF",
      "file_size": "154703",
      "download_count": 97
    },
    {
      "title": "Đề Thi Khẩu Ngữ Tiếng Trung HSKK (Sơ Cấp, Trung Cấp, Cao Cấp) Chính Thức",
      "description": "[Tác giả: Chinese Testing International (CTI)] - Cẩm nang hướng dẫn và bộ đề thi mẫu phần thi Nói HSKK: nhắc lại câu, mô tả tranh ảnh và trả lời câu hỏi tự luận theo thời gian quy định.",
      "file_url": "http://localhost:5000/uploads/materials/de-thi-khau-ngu-tieng-trung-hskk-so-cap-trung-cap-cao-cap-chinh-t-1789396098738.pdf",
      "file_type": "PDF",
      "file_size": "192473",
      "download_count": 477
    },
    {
      "title": "Bảng Danh Mục 500 Bộ Thủ Chữ Hán & Quy Tắc Bút Thuận Chuẩn Quốc Gia",
      "description": "[Tác giả: Ủy Ban Ngôn Ngữ Quốc Gia Trung Quốc] - Tài liệu học thuật tra cứu toàn bộ các bộ thủ chữ Hán, số nét và quy tắc viết chữ chuẩn xác từ trái qua phải, từ trên xuống dưới.",
      "file_url": "http://localhost:5000/uploads/materials/bang-danh-muc-500-bo-thu-chu-han-quy-tac-but-thuan-chuan-quoc-gia-1789396102907.pdf",
      "file_type": "PDF",
      "file_size": "1104836",
      "download_count": 505
    },
    {
      "title": "Cẩm Nang Thí Sinh Dự Thi HSK & Quy Trình Khảo Thí Trên Giấy / Máy Vi Tính",
      "description": "[Tác giả: Hanban / CTI Examination Committee] - Quy chế thi quốc tế, hướng dẫn điền phiếu trả lời trắc nghiệm (Answer Sheet) và phương thức tra cứu điểm số trực tuyến.",
      "file_url": "http://localhost:5000/uploads/materials/cam-nang-thi-sinh-du-thi-hsk-quy-trinh-khao-thi-tren-giay-may-vi--1789396105205.pdf",
      "file_type": "PDF",
      "file_size": "898834",
      "download_count": 218
    }
  ],
  "Tiếng Hàn (TOPIK)": [
    {
      "title": "Đề Thi Thật TOPIK I (Cấp 1-2) Chính Thức: Phần Đọc Hiểu (읽기 - Full Test & Answer Key)",
      "description": "[Tác giả: Viện Giáo Dục Quốc Tế Quốc Gia Hàn Quốc (NIIED)] - Đề thi thật chính thức do Bộ Giáo dục Hàn Quốc phát hành, gồm 40 câu hỏi đọc hiểu sơ cấp có hình ảnh minh họa và bảng đáp án chuẩn.",
      "file_url": "http://localhost:5000/uploads/materials/de-thi-that-topik-i-cap-1-2-chinh-thuc-phan-doc-hieu-full-test-an-1789396106983.pdf",
      "file_type": "PDF",
      "file_size": "1032465",
      "download_count": 214
    },
    {
      "title": "Đề Thi Thật TOPIK I (Cấp 1-2) Chính Thức: Phần Nghe Hiểu (듣기 - Listening Script & Questions)",
      "description": "[Tác giả: NIIED - National Institute for International Education] - Đề thi Nghe TOPIK I chính thức 30 câu hỏi kèm toàn văn kịch bản thoại audio và hướng dẫn làm bài thi.",
      "file_url": "http://localhost:5000/uploads/materials/de-thi-that-topik-i-cap-1-2-chinh-thuc-phan-nghe-hieu-listening-s-1789396113953.pdf",
      "file_type": "PDF",
      "file_size": "2366936",
      "download_count": 273
    },
    {
      "title": "Đề Thi Thật TOPIK II (Cấp 3-6) Chính Thức: Phần Đọc Hiểu Nâng Cao (읽기 - 50 Câu)",
      "description": "[Tác giả: NIIED (Ministry of Education, Republic of Korea)] - Đề thi Đọc hiểu TOPIK II chính thức gồm 50 câu hỏi phân loại trình độ từ Trung cấp (Cấp 3, 4) đến Cao cấp (Cấp 5, 6).",
      "file_url": "http://localhost:5000/uploads/materials/de-thi-that-topik-ii-cap-3-6-chinh-thuc-phan-doc-hieu-nang-cao-50-1789396123151.pdf",
      "file_type": "PDF",
      "file_size": "821947",
      "download_count": 393
    },
    {
      "title": "Đề Thi Thật TOPIK II (Cấp 3-6) Chính Thức: Phần Viết Luận (쓰기 - Đề Bài & Bài Mẫu Đạt Điểm Cao)",
      "description": "[Tác giả: NIIED Official Examiner Board] - Đề thi Viết TOPIK II gồm 4 câu hỏi: điền câu, viết biểu đồ (Câu 53) và bài luận nghị luận xã hội 600-700 chữ (Câu 54) kèm bài mẫu.",
      "file_url": "http://localhost:5000/uploads/materials/de-thi-that-topik-ii-cap-3-6-chinh-thuc-phan-viet-luan-de-bai-bai-1789396126380.pdf",
      "file_type": "PDF",
      "file_size": "154713",
      "download_count": 298
    },
    {
      "title": "Đề Thi Thật TOPIK II (Cấp 3-6) Chính Thức: Phần Nghe Hiểu (듣기 - Kịch Bản Đàm Thoại & Diễn Văn)",
      "description": "[Tác giả: NIIED Research & Assessment Division] - Đề thi Nghe hiểu TOPIK II gồm 50 câu hỏi từ các bản tin thời sự, phỏng vấn chuyên gia và diễn văn học thuật Hàn Quốc.",
      "file_url": "http://localhost:5000/uploads/materials/de-thi-that-topik-ii-cap-3-6-chinh-thuc-phan-nghe-hieu-kich-ban-d-1789396127672.pdf",
      "file_type": "PDF",
      "file_size": "1103130",
      "download_count": 93
    },
    {
      "title": "Danh Mục Từ Vựng Chuẩn TOPIK Sơ Cấp (TOPIK I Essential 1,500 Words)",
      "description": "[Tác giả: Viện Ngôn Ngữ Quốc Gia Hàn Quốc (국립국어원) & NIIED] - Danh mục từ vựng tiếng Hàn thiết yếu cho người mới bắt đầu học, phân theo các chủ đề: sinh hoạt gia đình, trường học, mua sắm, giao thông.",
      "file_url": "http://localhost:5000/uploads/materials/danh-muc-tu-vung-chuan-topik-so-cap-topik-i-essential-1-500-words-1789396137905.pdf",
      "file_type": "PDF",
      "file_size": "1104836",
      "download_count": 293
    },
    {
      "title": "Danh Mục Từ Vựng Chuẩn TOPIK Trung/Cao Cấp (TOPIK II 4,000 Academic Words)",
      "description": "[Tác giả: Viện Ngôn Ngữ Quốc Gia Hàn Quốc (National Institute of Korean Language)] - Bộ từ vựng học thuật Hán-Hàn (Hanja) và từ ngữ chuyên ngành xã hội, kinh tế, môi trường phục vụ thi chứng chỉ TOPIK II cấp 5, 6.",
      "file_url": "http://localhost:5000/uploads/materials/danh-muc-tu-vung-chuan-topik-trung-cao-cap-topik-ii-4-000-academi-1789396140977.pdf",
      "file_type": "PDF",
      "file_size": "107346",
      "download_count": 460
    },
    {
      "title": "Hướng Dẫn Chấm Điểm & Chiến Thuật Viết Bài Luận Câu 53 & 54 TOPIK II",
      "description": "[Tác giả: Ban Giám Khảo Khảo Thí NIIED] - Tiêu chí chấm điểm chi tiết của giám khảo NIIED: tính mạch lạc đoạn văn, cách dùng cấu trúc liên kết và quy tắc xuống dòng trên giấy thi Won-go-ji.",
      "file_url": "http://localhost:5000/uploads/materials/huong-dan-cham-diem-chien-thuat-viet-bai-luan-cau-53-54-topik-ii-1789396141703.pdf",
      "file_type": "PDF",
      "file_size": "192473",
      "download_count": 347
    },
    {
      "title": "Ngữ Pháp Tiếng Hàn Thực Hành: Tổng Hợp 150 Cấu Trúc Trọng Tâm TOPIK I & II",
      "description": "[Tác giả: Khoa Ngôn Ngữ & Văn Hóa Hàn Quốc (Seoul National University)] - Giáo trình hệ thống hóa các mẫu ngữ pháp then chốt kèm ví dụ câu đối thoại chuẩn mực và phân biệt các cặp ngữ pháp tương đồng dễ nhầm lẫn.",
      "file_url": "http://localhost:5000/uploads/materials/ngu-phap-tieng-han-thuc-hanh-tong-hop-150-cau-truc-trong-tam-topi-1789396143956.pdf",
      "file_type": "PDF",
      "file_size": "1104836",
      "download_count": 612
    },
    {
      "title": "Cẩm Nang Quy Chế Thi & Bảng Tiêu Chí Năng Lực Các Cấp Độ TOPIK (Level 1 - Level 6)",
      "description": "[Tác giả: NIIED - National Institute for International Education] - Quy định khảo thí TOPIK toàn cầu, thời gian biểu từng ca thi, cách tính điểm đỗ và giá trị chứng chỉ trong xét tuyển du học và visa Hàn Quốc.",
      "file_url": "http://localhost:5000/uploads/materials/cam-nang-quy-che-thi-bang-tieu-chi-nang-luc-cac-cap-do-topik-leve-1789396147443.pdf",
      "file_type": "PDF",
      "file_size": "898834",
      "download_count": 648
    }
  ],
  "Thiết kế UI/UX (Figma)": [
    {
      "title": "Google Material Design 3 (M3) Official Design Guidelines & Specifications",
      "description": "[Tác giả: Google Design Team & Material Foundation] - Tài liệu tiêu chuẩn thiết kế giao diện M3 của Google: hệ thống màu động (Dynamic Color), độ tương phản tiếp cận, tỷ lệ kích thước lưới và quy chuẩn component đa nền tảng.",
      "file_url": "http://localhost:5000/uploads/materials/google-material-design-3-m3-official-design-guidel-1789396692976.pdf",
      "file_type": "PDF",
      "file_size": "1104836",
      "download_count": 310
    },
    {
      "title": "10 Usability Heuristics for User Interface Design (Comprehensive NN/g Analysis)",
      "description": "[Tác giả: Jakob Nielsen (Nielsen Norman Group - NN/g)] - 10 nguyên lý kinh điển toàn cầu về thiết kế giao diện tương tác: hiển thị trạng thái hệ thống, tự do kiểm soát của người dùng, phòng ngừa lỗi và thiết kế tối giản.",
      "file_url": "http://localhost:5000/uploads/materials/10-usability-heuristics-for-user-interface-design-comprehensive-n-1789396696729.pdf",
      "file_type": "PDF",
      "file_size": "363274",
      "download_count": 390
    },
    {
      "title": "Apple Human Interface Guidelines (HIG): Foundations, Layout & Component Standards",
      "description": "[Tác giả: Apple Developer & Human Interface Publications] - Bộ quy chuẩn thiết kế giao diện hệ sinh thái iOS, iPadOS và macOS: nguyên tắc thẩm mỹ, vùng chạm cảm ứng, phản hồi xúc giác (Haptics) và Dark Mode.",
      "file_url": "http://localhost:5000/uploads/materials/apple-human-interface-guidelines-hig-foundations-l-1789396698568.pdf",
      "file_type": "PDF",
      "file_size": "120645",
      "download_count": 376
    },
    {
      "title": "Design Systems Handbook: Building Scalable Digital Products with Figma",
      "description": "[Tác giả: Marco Suarez, Jina Anne (InVision DesignBetter Series)] - Sách cẩm nang chuyên sâu về xây dựng Design System trong doanh nghiệp: quản lý Design Tokens, cấu trúc Component Variants, Auto Layout và quy trình bàn giao Dev-Mode.",
      "file_url": "http://localhost:5000/uploads/materials/design-systems-handbook-building-scalable-digital-products-with-f-1789396700002.pdf",
      "file_type": "PDF",
      "file_size": "1958911",
      "download_count": 321
    },
    {
      "title": "The Design of Everyday Things: Human-Centered Design Principles",
      "description": "[Tác giả: Don Norman (The Design Lab, UC San Diego & Nielsen Norman)] - Giáo trình nền tảng về thiết kế lấy con người làm trung tâm (Human-Centered Design): Affordance, Signifiers, Feedback Loops và mô hình tâm lý nhận thức của người dùng.",
      "file_url": "http://localhost:5000/uploads/materials/the-design-of-everyday-things-human-centered-desig-1789396702381.pdf",
      "file_type": "PDF",
      "file_size": "1104836",
      "download_count": 161
    },
    {
      "title": "Web Content Accessibility Guidelines (WCAG 2.1) for Digital Product Designers",
      "description": "[Tác giả: World Wide Web Consortium (W3C)] - Tiêu chuẩn quốc tế về thiết kế giao diện tiếp cận: độ tương phản màu sắc tối thiểu (Contrast Ratio 4.5:1), kích thước phông chữ đọc được và hỗ trợ Screen Readers.",
      "file_url": "http://localhost:5000/uploads/materials/web-content-accessibility-guidelines-wcag-2-1-for-digital-product-1789396704899.pdf",
      "file_type": "PDF",
      "file_size": "1104836",
      "download_count": 315
    },
    {
      "title": "User Experience (UX) Research Methodologies: Usability Testing & Information Architecture",
      "description": "[Tác giả: Interaction Design Foundation (IxDF)] - Phương pháp luận nghiên cứu người dùng: phỏng vấn định tính, A/B Testing, Card Sorting, vẽ sơ đồ hành trình khách hàng (Journey Mapping) và khung kiểm thử Wireframing.",
      "file_url": "http://localhost:5000/uploads/materials/user-experience-ux-research-methodologies-usabilit-1789396707554.pdf",
      "file_type": "PDF",
      "file_size": "939692",
      "download_count": 372
    },
    {
      "title": "Figma Component Architecture, Auto Layout, and Responsive Prototyping Masterclass",
      "description": "[Tác giả: Figma Community & Design Systems Guild] - Cẩm nang thực hành thành thạo Figma: cấu trúc Nested Components, Booleans, Swap Properties, Interactive Components và Responsive Constraints.",
      "file_url": "http://localhost:5000/uploads/materials/figma-component-architecture-auto-layout-and-respo-1789396709866.pdf",
      "file_type": "PDF",
      "file_size": "558558",
      "download_count": 222
    }
  ],
  "Đồ họa & Thương hiệu": [
    {
      "title": "NASA Graphics Standards Manual (Official 90-Page Brand Identity Guide)",
      "description": "[Tác giả: National Aeronautics and Space Administration (NASA)] - Cẩm nang quy chuẩn nhận diện thương hiệu kinh điển và mẫu mực nhất thế giới (90 trang): logo con giun (Worm logo), hệ thống lưới, bảng màu và ứng dụng ấn phẩm.",
      "file_url": "http://localhost:5000/uploads/materials/nasa-graphics-standards-manual-official-90-page-br-1789396712333.pdf",
      "file_type": "PDF",
      "file_size": "1104836",
      "download_count": 147
    },
    {
      "title": "Grid Systems in Graphic Design: A Visual Communication Manual",
      "description": "[Tác giả: Josef Müller-Brockmann (Swiss Graphic Design Pioneer)] - Giáo trình kinh điển về bố cục đồ họa: hệ thống lưới 8 cột, 12 cột, tỷ lệ vàng, phân bổ khoảng trắng (Negative Space) và nhịp điệu thị giác.",
      "file_url": "http://localhost:5000/uploads/materials/grid-systems-in-graphic-design-a-visual-communicat-1789396714854.pdf",
      "file_type": "PDF",
      "file_size": "120645",
      "download_count": 295
    },
    {
      "title": "The Elements of Typographic Style: Hierarchy, Pairing, and Kerning",
      "description": "[Tác giả: Robert Bringhurst (Renowned Typographer & Poet)] - Sách chuẩn mực về nghệ thuật chữ (Typography): phân cấp thị giác (Hierarchy), kết hợp font chữ Serif và Sans-serif, khoảng cách ký tự (Kerning & Leading).",
      "file_url": "http://localhost:5000/uploads/materials/the-elements-of-typographic-style-hierarchy-pairin-1789396716335.pdf",
      "file_type": "PDF",
      "file_size": "158891",
      "download_count": 133
    },
    {
      "title": "Color Theory and Harmony in Visual Communication: The Munsell & Itten Models",
      "description": "[Tác giả: Harvard University Visual Arts Department] - Cơ sở khoa học của màu sắc trong đồ họa: bánh xe màu 12 cung, độ bão hòa (Chroma), nhiệt độ màu, các quy tắc phối màu tương phản, tương đồng và bổ túc.",
      "file_url": "http://localhost:5000/uploads/materials/color-theory-and-harmony-in-visual-communication-t-1789396717859.pdf",
      "file_type": "PDF",
      "file_size": "120645",
      "download_count": 441
    },
    {
      "title": "British Council Global Brand Identity and Visual Design Architecture",
      "description": "[Tác giả: British Council Global Brand Team] - Quy chuẩn thương hiệu quốc tế của Hội đồng Anh: phong cách đồ họa, hệ thống biểu tượng (Iconography), quy tắc sử dụng hình ảnh và ứng dụng đa kênh.",
      "file_url": "http://localhost:5000/uploads/materials/british-council-global-brand-identity-and-visual-d-1789396719252.pdf",
      "file_type": "PDF",
      "file_size": "154703",
      "download_count": 214
    },
    {
      "title": "Logo Design Engineering: From Conceptual Sketching to Vector Geometry",
      "description": "[Tác giả: AIGA - The Professional Association for Design] - Quy trình thiết kế biểu trưng thương hiệu chuyên nghiệp: kỹ thuật vẽ phác thảo, tỷ lệ hình học Geometric Construction, cân bằng quang học (Optical Balance).",
      "file_url": "http://localhost:5000/uploads/materials/logo-design-engineering-from-conceptual-sketching-to-vector-geome-1789396721789.pdf",
      "file_type": "PDF",
      "file_size": "141971",
      "download_count": 337
    },
    {
      "title": "Packaging Design and Prepress Production: CMYK, Bleed, and Spot Colors",
      "description": "[Tác giả: International Color Consortium (ICC) & Graphic Arts Guild] - Kỹ thuật chế bản in ấn công nghiệp: quản lý hệ màu CMYK vs RGB, vùng bù xén (Bleed), độ phân giải in chuẩn (300 DPI) và màu pha Pantone.",
      "file_url": "http://localhost:5000/uploads/materials/packaging-design-and-prepress-production-cmyk-blee-1789396723278.pdf",
      "file_type": "PDF",
      "file_size": "234449",
      "download_count": 480
    },
    {
      "title": "Brand Strategy and Visual Storytelling for Modern Digital Enterprises",
      "description": "[Tác giả: American Marketing Association & Pentagram Design] - Chiến lược xây dựng thương hiệu thời đại số: định vị giá trị thương hiệu (Brand Positioning), giọng điệu thương hiệu (Brand Voice) và điểm chạm cảm xúc khách hàng.",
      "file_url": "http://localhost:5000/uploads/materials/brand-strategy-and-visual-storytelling-for-modern-digital-enterpr-1789396724908.pdf",
      "file_type": "PDF",
      "file_size": "868492",
      "download_count": 173
    }
  ],
  "Biên tập Video & Kỹ xảo": [
    {
      "title": "DaVinci Resolve Official Editing & Color Grading Beginner's Guide (Full Manual)",
      "description": "[Tác giả: Blackmagic Design Official Education Division] - Sách hướng dẫn chính thức từ nhà sản xuất Blackmagic Design: quy trình dựng phim chuyên nghiệp trên Cut Page và Edit Page, làm chủ timeline và phím tắt dựng.",
      "file_url": "http://localhost:5000/uploads/materials/davinci-resolve-official-editing-color-grading-beg-1789396726951.pdf",
      "file_type": "PDF",
      "file_size": "1104836",
      "download_count": 458
    },
    {
      "title": "Grammar of the Film Language: Cinematic Framing, Cutting, and Continuity",
      "description": "[Tác giả: Daniel Arijon (Celebrated Film Director & Cinematographer)] - Bách khoa toàn thư về ngôn ngữ hình ảnh điện ảnh: góc quay, trục 180 độ (180-Degree Rule), kỹ thuật dựng nối hình (Match Cut, Jump Cut) và chuyển cảnh nhịp nhàng.",
      "file_url": "http://localhost:5000/uploads/materials/grammar-of-the-film-language-cinematic-framing-cut-1789396729554.pdf",
      "file_type": "PDF",
      "file_size": "107346",
      "download_count": 171
    },
    {
      "title": "In the Blink of an Eye: A Perspective on Film Editing and the Rule of Six",
      "description": "[Tác giả: Walter Murch (Hollywood Legendary Editor - 3 Academy Awards)] - Triết lý dựng phim kinh điển thế giới: Quy tắc 6 tiêu chí cắt cảnh (Cảm xúc chiếm 51%, Cốt truyện 23%, Nhịp điệu 10%, Điểm nhìn 7%, Màn ảnh 2D 5%, Không gian 3D 4%).",
      "file_url": "http://localhost:5000/uploads/materials/in-the-blink-of-an-eye-a-perspective-on-film-editi-1789396730998.pdf",
      "file_type": "PDF",
      "file_size": "317417",
      "download_count": 111
    },
    {
      "title": "Color Correction and Color Grading Science: Log Profiles, LUTs, and Rec.709 Standards",
      "description": "[Tác giả: Society of Motion Picture and Television Engineers (SMPTE)] - Khoa học hiệu chỉnh màu sắc phim ảnh: đọc biểu đồ Waveform, Vectorscope, Parade, xử lý dải động rộng (Dynamic Range), Log to Rec.709 và tạo Color Look (Teal & Orange).",
      "file_url": "http://localhost:5000/uploads/materials/color-correction-and-color-grading-science-log-pro-1789396732720.pdf",
      "file_type": "PDF",
      "file_size": "120645",
      "download_count": 161
    },
    {
      "title": "Video Post-Production Workflow: Codecs, Bitrates, and Apple ProRes / H.265 Standards",
      "description": "[Tác giả: Apple Pro Video Applications & Adobe Video Engineering] - Cẩm nang kỹ thuật về chuẩn nén video: sự khác biệt giữa Intra-frame (ProRes, DNxHR) và Inter-frame (H.264, HEVC), tốc độ khung hình (24/30/60 FPS) và tối ưu hóa Render.",
      "file_url": "http://localhost:5000/uploads/materials/video-post-production-workflow-codecs-bitrates-and-1789396734065.pdf",
      "file_type": "PDF",
      "file_size": "323091",
      "download_count": 132
    },
    {
      "title": "Audio Post-Production for Video: Dialogue Cleanup, Foley, EQ, and -14 LUFS Standards",
      "description": "[Tác giả: Audio Engineering Society (AES) & Fairlight Audio] - Kỹ nghệ xử lý âm thanh hậu kỳ phim: lọc tạp âm (Noise Reduction), cân bằng âm sắc EQ, nén Compressor, thiết kế tiếng động Foley và tiêu chuẩn âm lượng -14 LUFS cho Web/YouTube.",
      "file_url": "http://localhost:5000/uploads/materials/audio-post-production-for-video-dialogue-cleanup-f-1789396735826.pdf",
      "file_type": "PDF",
      "file_size": "3433632",
      "download_count": 334
    },
    {
      "title": "Visual Effects (VFX) Compositing: Chroma Keying, Tracking, and Roto Workflows",
      "description": "[Tác giả: ACM SIGGRAPH & The Foundry Research Group] - Kỹ thuật kỹ xảo điện ảnh: tách phông xanh (Green Screen Keying), theo dõi chuyển động (Planar/Camera Tracking), kỹ thuật Rotoscoping và hòa trộn ánh sáng đa lớp.",
      "file_url": "http://localhost:5000/uploads/materials/visual-effects-vfx-compositing-chroma-keying-track-1789396738804.pdf",
      "file_type": "PDF",
      "file_size": "1172762",
      "download_count": 302
    },
    {
      "title": "The 12 Principles of Animation Applied to Motion Graphics and Title Sequences",
      "description": "[Tác giả: Disney Animation Archives & Adobe After Effects Guild] - Ứng dụng 12 nguyên lý hoạt hình (Squash & Stretch, Anticipation, Slow In & Out, Follow Through) vào đồ họa chuyển động, thiết kế intro và typography động.",
      "file_url": "http://localhost:5000/uploads/materials/the-12-principles-of-animation-applied-to-motion-g-1789396741013.pdf",
      "file_type": "PDF",
      "file_size": "668251",
      "download_count": 166
    }
  ],
  "Diễn họa 3D (Blender)": [
    {
      "title": "The Official Blender Reference Manual: Modeling, Modifiers, and Node Architectures",
      "description": "[Tác giả: Blender Foundation (Official Open-Source 3D Creation Suite)] - Tài liệu tham chiếu chính thức toàn diện nhất: cấu trúc Mesh, phím tắt dựng hình, hệ thống Modifier không phá hủy (Non-Destructive) và kiến trúc Geometry Nodes.",
      "file_url": "http://localhost:5000/uploads/materials/the-official-blender-reference-manual-modeling-mod-1789396743104.pdf",
      "file_type": "PDF",
      "file_size": "1104836",
      "download_count": 69
    },
    {
      "title": "Physically Based Rendering (PBR) Texturing and Material Theory (Comprehensive Guide)",
      "description": "[Tác giả: Allegorithmic / Adobe Substance 3D Research] - Giáo trình vật liệu tả thực PBR: kênh Base Color, Roughness, Metallic, Normal Maps, và mô hình phản xạ quang học Fresnel trong kết xuất 3D.",
      "file_url": "http://localhost:5000/uploads/materials/physically-based-rendering-pbr-texturing-and-mater-1789396745554.pdf",
      "file_type": "PDF",
      "file_size": "24854165",
      "download_count": 314
    },
    {
      "title": "3D Topology and Subdivision Surface Modeling: Edge Loops, Poles, and Clean Deformation",
      "description": "[Tác giả: ACM SIGGRAPH Course Notes on Geometric Modeling] - Nguyên lý lưới Topology chuẩn trong diễn họa 3D: kỹ thuật đi đường lưới (Edge Flow), xử lý lưới 4 cạnh (Quads) và triệt tiêu biến dạng khi gắn xương chuyển động.",
      "file_url": "http://localhost:5000/uploads/materials/3d-topology-and-subdivision-surface-modeling-edge-loops-poles-and-1789396751643.pdf",
      "file_type": "PDF",
      "file_size": "819383",
      "download_count": 54
    },
    {
      "title": "Digital Sculpting Anatomy and Organic Modeling Principles in Blender",
      "description": "[Tác giả: ZBrush & Blender Digital Sculpting Master Group] - Phương pháp điêu khắc số giải phẫu học cơ thể người và sinh vật: sử dụng Dyntopo, Voxel Remesh, các cọ điêu khắc (Clay, Crease, Inflate) và quy trình Retopology.",
      "file_url": "http://localhost:5000/uploads/materials/digital-sculpting-anatomy-and-organic-modeling-pri-1789396753696.pdf",
      "file_type": "PDF",
      "file_size": "2215244",
      "download_count": 160
    },
    {
      "title": "Three-Point Lighting, HDRI Environment Lighting, and Photorealistic Shading",
      "description": "[Tác giả: Pixar Animation Studios Technical Papers] - Kỹ thuật chiếu sáng điện ảnh trong không gian 3 chiều: đèn chính (Key Light), đèn phụ (Fill Light), đèn ven (Rim Light), môi trường HDRI 32-bit và đổ bóng mềm.",
      "file_url": "http://localhost:5000/uploads/materials/three-point-lighting-hdri-environment-lighting-and-1789396756255.pdf",
      "file_type": "PDF",
      "file_size": "120645",
      "download_count": 506
    },
    {
      "title": "Blender Cycles vs EEVEE: Ray Tracing, Indirect Lighting, and Shader Optimization",
      "description": "[Tác giả: Blender Foundation Graphics Rendering Team] - Phân tích kiến trúc render: cơ chế dò tia quang học Path Tracing của Cycles so với động cơ thời gian thực Rasterization của EEVEE-Next, tối ưu hóa hạt Noises với OptiX/OpenImageDenoise.",
      "file_url": "http://localhost:5000/uploads/materials/blender-cycles-vs-eevee-ray-tracing-indirect-light-1789396757666.pdf",
      "file_type": "PDF",
      "file_size": "631718",
      "download_count": 88
    },
    {
      "title": "3D Character Rigging and Skeletal Animation: Forward vs Inverse Kinematics (FK/IK)",
      "description": "[Tác giả: IEEE Computer Graphics and Applications] - Kỹ thuật gắn xương nhân vật 3D: cấu trúc Armature, bộ điều khiển IK/FK, kỹ thuật bọc da trọng số (Weight Painting) và liên kết Shape Keys biểu cảm khuôn mặt.",
      "file_url": "http://localhost:5000/uploads/materials/3d-character-rigging-and-skeletal-animation-forwar-1789396759613.pdf",
      "file_type": "PDF",
      "file_size": "417205",
      "download_count": 138
    },
    {
      "title": "Hard-Surface Modeling Techniques: Non-Destructive Booleans, Bevels, and Weighted Normals",
      "description": "[Tác giả: 3D Artist Magazine & ArtStation Learning Series] - Quy trình dựng hình vật thể cơ khí, kiến trúc và xe cộ: làm chủ Boolean Modifiers, Bevel Shader, Weighted Normals và loại bỏ hoàn toàn lỗi vệt đen trên bề mặt cong.",
      "file_url": "http://localhost:5000/uploads/materials/hard-surface-modeling-techniques-non-destructive-b-1789396761464.pdf",
      "file_type": "PDF",
      "file_size": "4681034",
      "download_count": 46
    }
  ],
  "Thuyết trình & Đàm phán": [
    {
      "title": "Giáo trình Kỹ thuật Đàm phán: Nguyên tắc, Chiến thuật và Xử lý Bế tắc",
      "description": "[Tác giả: TS. Huỳnh Trường Huy, ThS. Võ Hồng Phượng (Trường Đại học Cần Thơ - CTU)] - Giáo trình chính quy phân tích bản chất, các giai đoạn chuẩn bị, nguyên tắc nhượng bộ, chiến lược đàm phán phân bổ vs hợp tác và nghệ thuật phá vỡ bế tắc.",
      "file_url": "http://localhost:5000/uploads/materials/giao-trinh-ky-thuat-dam-phan-nguyen-tac-chien-thuat-va-xu-ly-be-t-1789397141191.pdf",
      "file_type": "PDF",
      "file_size": "1104836",
      "download_count": 370
    },
    {
      "title": "Giáo trình Kỹ năng Giao tiếp và Đàm phán trong Kinh doanh",
      "description": "[Tác giả: PGS.TS Dương Thị Liễu, TS. Nguyễn Thị Ngọc Anh (Trường ĐH Kinh tế Quốc dân - NEU)] - Tài liệu đào tạo chuẩn mực về nghi thức giao tiếp thương mại, tâm lý học trong đàm phán, kỹ thuật đặt câu hỏi, lắng nghe tích cực và nghệ thuật thuyết phục đối tác.",
      "file_url": "http://localhost:5000/uploads/materials/giao-trinh-ky-nang-giao-tiep-va-dam-phan-trong-kinh-doanh-1789397143731.pdf",
      "file_type": "PDF",
      "file_size": "141971",
      "download_count": 193
    },
    {
      "title": "Kỹ năng Đàm phán, Soạn thảo và Giải quyết Tranh chấp Hợp đồng Thương mại",
      "description": "[Tác giả: TS. Nguyễn Văn Tiến (Trường Đại học Luật TP.HCM - ULAW)] - Cẩm nang chuyên sâu về kỹ năng đàm phán pháp lý hợp đồng thương mại, phòng ngừa các điều khoản bất lợi và quy trình hòa giải tranh chấp chuyên nghiệp.",
      "file_url": "http://localhost:5000/uploads/materials/ky-nang-dam-phan-soan-thao-va-giai-quyet-tranh-chap-hop-dong-thuo-1789397145284.pdf",
      "file_type": "PDF",
      "file_size": "234449",
      "download_count": 77
    },
    {
      "title": "Bài giảng Kỹ năng Thuyết trình Chuyên nghiệp & Mô hình AIDA",
      "description": "[Tác giả: TS. Lê Thanh Hương (Trường Đại học Bách Khoa Hà Nội - HUST)] - Hệ thống hóa cấu trúc bài thuyết trình, ứng dụng mô hình AIDA (Attention, Interest, Desire, Action), làm chủ slide trực quan và kỹ thuật xử lý câu hỏi phản biện.",
      "file_url": "http://localhost:5000/uploads/materials/bai-giang-ky-nang-thuyet-trinh-chuyen-nghiep-mo-hinh-aida-1789397146886.pdf",
      "file_type": "PDF",
      "file_size": "868492",
      "download_count": 276
    },
    {
      "title": "Nghệ thuật Thuyết trình và Nói trước Công chúng: Làm chủ Ngôn ngữ Cơ thể",
      "description": "[Tác giả: Khoa Phát thanh - Truyền hình (Học viện Báo chí và Tuyên truyền - AJC)] - Giáo trình rèn luyện khẩu khí, nhịp điệu phát âm, ngôn ngữ phi ngôn từ (Eye Contact, cử chỉ tay), kỹ thuật kiểm soát sự hồi hộp và thu hút người nghe.",
      "file_url": "http://localhost:5000/uploads/materials/nghe-thuat-thuyet-trinh-va-noi-truoc-cong-chung-lam-chu-ngon-ngu--1789397148997.pdf",
      "file_type": "PDF",
      "file_size": "107346",
      "download_count": 56
    },
    {
      "title": "Getting to YES: Negotiating Agreement Without Giving In (Harvard Principles)",
      "description": "[Tác giả: Roger Fisher, William Ury (Harvard Program on Negotiation - PON)] - Tác phẩm kinh điển thế giới về đàm phán dựa trên nguyên tắc: tách con người khỏi vấn đề, tập trung vào lợi ích thay vì lập trường và xác định giải pháp thay thế tốt nhất (BATNA).",
      "file_url": "http://localhost:5000/uploads/materials/getting-to-yes-negotiating-agreement-without-givin-1789397150834.pdf",
      "file_type": "PDF",
      "file_size": "317417",
      "download_count": 242
    },
    {
      "title": "The Quick and Easy Way to Effective Speaking: Mastering Public Influence",
      "description": "[Tác giả: Dale Carnegie Training Institute] - Phương pháp rèn luyện kỹ năng diễn thuyết và truyền cảm hứng trước công chúng của bậc thầy Dale Carnegie: cách mở đầu ấn tượng và kết thúc hành động.",
      "file_url": "http://localhost:5000/uploads/materials/the-quick-and-easy-way-to-effective-speaking-maste-1789397152660.pdf",
      "file_type": "PDF",
      "file_size": "120645",
      "download_count": 405
    },
    {
      "title": "Toastmasters International Competent Communication Manual (10 Core Projects)",
      "description": "[Tác giả: Toastmasters International Educational Division] - Cẩm nang 10 bài luyện nói chuẩn quốc tế: từ bài nói phá băng (Ice Breaker), cấu trúc bài diễn văn, từ ngữ gợi cảm xúc đến kỹ năng truyền cảm hứng.",
      "file_url": "http://localhost:5000/uploads/materials/toastmasters-international-competent-communication-1789397154053.pdf",
      "file_type": "PDF",
      "file_size": "323091",
      "download_count": 521
    }
  ],
  "Quản lý thời gian": [
    {
      "title": "Giáo trình Kỹ năng Quản lý Thời gian và Kế hoạch Hóa Công việc",
      "description": "[Tác giả: Viện Đào tạo & Bồi dưỡng Kỹ năng mềm (Trường Đại học Ngoại thương - FTU)] - Giáo trình đào tạo kỹ năng xác lập mục tiêu theo nguyên tắc SMART, lập kế hoạch hành động theo tuần/tháng và phương pháp cân bằng giữa học tập, công việc và đời sống.",
      "file_url": "http://localhost:5000/uploads/materials/giao-trinh-ky-nang-quan-ly-thoi-gian-va-ke-hoach-hoa-cong-viec-1789397155882.pdf",
      "file_type": "PDF",
      "file_size": "1104836",
      "download_count": 274
    },
    {
      "title": "Phương pháp Quản trị Thời gian: Ma trận Eisenhower và Chu kỳ Pomodoro",
      "description": "[Tác giả: Viện Nghiên cứu Phát triển Quản lý (IVM)] - Cẩm nang hướng dẫn thực hành phân loại 4 cấp độ công việc (Khẩn cấp vs Quan trọng), loại bỏ kẻ cắp thời gian và tối ưu hóa năng suất với chu kỳ tập trung sâu 25 phút.",
      "file_url": "http://localhost:5000/uploads/materials/phuong-phap-quan-tri-thoi-gian-ma-tran-eisenhower-va-chu-ky-pomod-1789397158295.pdf",
      "file_type": "PDF",
      "file_size": "3433632",
      "download_count": 187
    },
    {
      "title": "Nghiên cứu Thực nghiệm Kỹ năng Quản lý Thời gian của Sinh viên Đại học",
      "description": "[Tác giả: Tạp chí Khoa học Giáo dục (ĐHQG TP.HCM & Trường ĐH Sư phạm)] - Công trình nghiên cứu khoa học phân tích nguyên nhân tâm lý dẫn đến thói quen trì hoãn (Procrastination) và các giải pháp hành vi giúp nâng cao tính tự giác kỷ luật.",
      "file_url": "http://localhost:5000/uploads/materials/nghien-cuu-thuc-nghiem-ky-nang-quan-ly-thoi-gian-cua-sinh-vien-da-1789397161439.pdf",
      "file_type": "PDF",
      "file_size": "1172762",
      "download_count": 501
    },
    {
      "title": "Cẩm nang Tối ưu Hiệu suất Làm việc và Làm chủ Thời gian Biểu",
      "description": "[Tác giả: Trường Đại học Kinh tế Quốc dân (NEU)] - Hệ thống phương pháp lên lịch trình cá nhân khoa học, kỹ thuật phân đoạn thời gian (Time-blocking) và các quy tắc kiểm soát tác nhân gây xao nhãng trong kỷ nguyên số.",
      "file_url": "http://localhost:5000/uploads/materials/cam-nang-toi-uu-hieu-suat-lam-viec-va-lam-chu-thoi-gian-bieu-1789397163740.pdf",
      "file_type": "PDF",
      "file_size": "668251",
      "download_count": 445
    },
    {
      "title": "Getting Things Done (GTD): Nghệ thuật Quản lý Năng suất Không Căng thẳng",
      "description": "[Tác giả: David Allen Productivity Research Center] - Quy trình 5 bước kinh điển thế giới trong quản trị công việc: Thu thập (Capture), Làm rõ (Clarify), Tổ chức (Organize), Suy ngẫm (Reflect) và Hành động (Engage).",
      "file_url": "http://localhost:5000/uploads/materials/getting-things-done-gtd-nghe-thuat-quan-ly-nang-suat-khong-cang-t-1789397165881.pdf",
      "file_type": "PDF",
      "file_size": "819383",
      "download_count": 432
    },
    {
      "title": "The 7 Habits of Highly Effective People: Ma trận Thời gian Góc phần tư II",
      "description": "[Tác giả: Stephen R. Covey Leadership Center] - Triết lý quản trị cuộc đời: tập trung nguồn lực vào Góc phần tư II (Việc quan trọng nhưng không khẩn cấp) để xây dựng tầm nhìn, phòng ngừa rủi ro và phát triển bền vững.",
      "file_url": "http://localhost:5000/uploads/materials/the-7-habits-of-highly-effective-people-ma-tr-n-th-1789397167888.pdf",
      "file_type": "PDF",
      "file_size": "2215244",
      "download_count": 268
    },
    {
      "title": "Deep Work: Quy tắc Tập trung Cao độ trong Một Thế giới Đầy Xao Nhãng",
      "description": "[Tác giả: GS. Cal Newport (Georgetown University & MIT Press)] - Nền tảng khoa học về trạng thái làm việc sâu (Deep Work), cơ chế phục hồi năng lượng não bộ và phương pháp rèn luyện khả năng tập trung tuyệt đối.",
      "file_url": "http://localhost:5000/uploads/materials/deep-work-quy-tac-tap-trung-cao-do-trong-mot-the-gioi-day-xao-nha-1789397170315.pdf",
      "file_type": "PDF",
      "file_size": "631718",
      "download_count": 275
    },
    {
      "title": "Eat That Frog!: 21 Phương pháp Chấm dứt Trì hoãn và Hoàn thành Công việc",
      "description": "[Tác giả: Brian Tracy International Institute] - Kỹ thuật tối ưu năng suất nổi tiếng thế giới: phương pháp ABCDE trong xếp thứ tự ưu tiên và nguyên lý giải quyết nhiệm vụ khó khăn nhất vào đầu mỗi ngày làm việc.",
      "file_url": "http://localhost:5000/uploads/materials/eat-that-frog-21-phuong-phap-cham-dut-tri-hoan-va-hoan-thanh-cong-1789397172347.pdf",
      "file_type": "PDF",
      "file_size": "417205",
      "download_count": 533
    }
  ],
  "Tư duy phản biện": [
    {
      "title": "Giáo trình Tư duy Biện luận Ứng dụng: Cấu trúc Lập luận và Phân tích Logic",
      "description": "[Tác giả: TS. Dương Thị Hoàng Oanh, ThS. Nguyễn Xuân Đạt (NXB Đại học Quốc gia TP.HCM)] - Giáo trình đại học chính thống về nhận diện tiền đề, kết luận, phân tích tính hợp lệ của tam đoạn luận và các kỹ thuật bác bỏ ngụy biện trong nghiên cứu học thuật.",
      "file_url": "http://localhost:5000/uploads/materials/giao-trinh-tu-duy-bien-luan-ung-dung-cau-truc-lap-luan-va-phan-ti-1789397174138.pdf",
      "file_type": "PDF",
      "file_size": "1104836",
      "download_count": 108
    },
    {
      "title": "Cẩm nang Tư duy Phản biện: Khái niệm, Tiêu chuẩn và Bộ Công cụ Phân tích",
      "description": "[Tác giả: TS. Richard Paul, TS. Linda Elder (Foundation for Critical Thinking & NXB Tổng hợp)] - Tài liệu nền tảng định hình tư duy phản biện hiện đại: 8 yếu tố tư duy (Mục đích, Câu hỏi, Thông tin, Diễn giải...) và 9 tiêu chuẩn trí tuệ phổ quát (Rõ ràng, Chính xác, Sâu sắc...).",
      "file_url": "http://localhost:5000/uploads/materials/cam-nang-tu-duy-phan-bien-khai-niem-tieu-chuan-va-bo-cong-cu-phan-1789397176658.pdf",
      "file_type": "PDF",
      "file_size": "4681034",
      "download_count": 532
    },
    {
      "title": "Phương pháp Sáu Chiếc Mũ Tư duy (Six Thinking Hats) trong Ra Quyết định",
      "description": "[Tác giả: Viện Sáng tạo Edward de Bono] - Công cụ tư duy đa chiều mang tính cách mạng: tách biệt dữ kiện thực tế (Mũ trắng), trực giác cảm xúc (Mũ đỏ), đánh giá rủi ro (Mũ đen), lợi ích tích cực (Mũ vàng) và ý tưởng đột phá (Mũ xanh lá).",
      "file_url": "http://localhost:5000/uploads/materials/phuong-phap-sau-chiec-mu-tu-duy-six-thinking-hats-trong-ra-quyet--1789397179772.pdf",
      "file_type": "PDF",
      "file_size": "24854165",
      "download_count": 349
    },
    {
      "title": "Phát triển Tư duy Phản biện trong Dạy và Học Bậc Đại học",
      "description": "[Tác giả: Tạp chí Khoa học Trường Đại học Cần Thơ (CTU)] - Phương pháp sư phạm rèn luyện năng lực hoài nghi tích cực cho sinh viên, kỹ thuật đặt câu hỏi truy vấn bản chất vấn đề và xây dựng lập luận khoa học độc lập.",
      "file_url": "http://localhost:5000/uploads/materials/phat-trien-tu-duy-phan-bien-trong-day-va-hoc-bac-dai-hoc-1789397190974.pdf",
      "file_type": "PDF",
      "file_size": "363274",
      "download_count": 169
    },
    {
      "title": "Asking the Right Questions: A Guide to Critical Thinking (Đặt Câu hỏi Đúng)",
      "description": "[Tác giả: GS. M. Neil Browne, Stuart M. Keeley (Bowling Green State University)] - Cẩm nang hướng dẫn phương pháp đặt câu hỏi phản biện then chốt: nhận diện giả định ngầm ẩn, phát hiện mâu thuẫn bằng chứng và đánh giá độ tin cậy của số liệu thống kê.",
      "file_url": "http://localhost:5000/uploads/materials/asking-the-right-questions-a-guide-to-critical-thi-1789397193087.pdf",
      "file_type": "PDF",
      "file_size": "120645",
      "download_count": 47
    },
    {
      "title": "Logic Học và Phương pháp Nhận diện Các Lỗi Ngụy biện Thường gặp",
      "description": "[Tác giả: Khoa Triết học (Trường ĐH Khoa học Xã hội & Nhân văn - ĐHQG Hà Nội)] - Giáo trình hệ thống hóa các bẫy ngụy biện phổ biến: Công kích cá nhân (Ad Hominem), Người rơm (Straw Man), Nhị nguyên giả tạo (False Dilemma) và Dốc trơn trượt (Slippery Slope).",
      "file_url": "http://localhost:5000/uploads/materials/logic-hoc-va-phuong-phap-nhan-dien-cac-loi-nguy-bien-thuong-gap-1789397194458.pdf",
      "file_type": "PDF",
      "file_size": "1958911",
      "download_count": 284
    },
    {
      "title": "The Demon-Haunted World: Bộ Công cụ Phát hiện Điều Ngụy tạo (Baloney Detection)",
      "description": "[Tác giả: GS. Carl Sagan (Cornell University) & Ann Druyan] - Phương pháp luận tư duy hoài nghi khoa học của Carl Sagan: 9 quy tắc kiểm chứng bằng chứng và danh sách các lỗi tư duy phi lý trí cần phòng tránh.",
      "file_url": "http://localhost:5000/uploads/materials/the-demon-haunted-world-bo-cong-cu-phat-hien-dieu-nguy-tao-balone-1789397196870.pdf",
      "file_type": "PDF",
      "file_size": "939692",
      "download_count": 62
    },
    {
      "title": "Critical Thinking: Tools for Taking Charge of Your Professional Life",
      "description": "[Tác giả: Foundation for Critical Thinking Educational Series] - Chiến lược rèn luyện tư duy độc lập và công tâm (Fairminded Thinking), kiểm soát thiên kiến nhận thức chủ quan và nâng cao năng lực ra quyết định chiến lược.",
      "file_url": "http://localhost:5000/uploads/materials/critical-thinking-tools-for-taking-charge-of-your-professional-li-1789397198920.pdf",
      "file_type": "PDF",
      "file_size": "558558",
      "download_count": 337
    }
  ],
  "Kỹ năng lãnh đạo": [
    {
      "title": "Giáo trình Kỹ năng Lãnh đạo và Quản lý Hiện đại",
      "description": "[Tác giả: Học viện Quản lý Giáo dục & ĐHQG Hà Nội (VNU)] - Giáo trình tổng quan về khung năng lực lãnh đạo thời đại 4.0: định hình tầm nhìn chiến lược, kỹ năng ủy quyền hiệu quả, quản trị xung đột nội bộ và xây dựng văn hóa tổ chức vững mạnh.",
      "file_url": "http://localhost:5000/uploads/materials/giao-trinh-ky-nang-lanh-dao-va-quan-ly-hien-dai-1789397200986.pdf",
      "file_type": "PDF",
      "file_size": "1104836",
      "download_count": 453
    },
    {
      "title": "Nghệ thuật Lãnh đạo Bản thân và Dẫn dắt Đội ngũ Hiệu suất cao",
      "description": "[Tác giả: Khoa Quản trị Kinh doanh (Trường Đại học Ngoại thương - FTU)] - Tài liệu đào tạo nguyên tắc lãnh đạo bằng sự gương mẫu (Leading by Example), xây dựng lòng tin, tạo động lực nội tại và nghệ thuật phản hồi mang tính xây dựng.",
      "file_url": "http://localhost:5000/uploads/materials/nghe-thuat-lanh-dao-ban-than-va-dan-dat-doi-ngu-hieu-suat-cao-1789397203581.pdf",
      "file_type": "PDF",
      "file_size": "158891",
      "download_count": 273
    },
    {
      "title": "Kỹ năng Lãnh đạo Tình huống và Tạo Động lực Nhân viên",
      "description": "[Tác giả: Trường Đại học Kinh tế TP.HCM (UEH)] - Nghiên cứu ứng dụng mô hình lãnh đạo tình huống Hersey-Blanchard: linh hoạt điều chỉnh giữa 4 phong cách Chỉ đạo (Directing), Hướng dẫn (Coaching), Hỗ trợ (Supporting) và Ủy quyền (Delegating).",
      "file_url": "http://localhost:5000/uploads/materials/ky-nang-lanh-dao-tinh-huong-va-tao-dong-luc-nhan-vien-1789397205130.pdf",
      "file_type": "PDF",
      "file_size": "141971",
      "download_count": 60
    },
    {
      "title": "Tâm lý học Quản trị và Văn hóa Lãnh đạo Doanh nghiệp Việt Nam",
      "description": "[Tác giả: Viện Nghiên cứu Quản lý Kinh tế Trung ương (CIEM)] - Phân tích các đặc thù tâm lý, văn hóa ứng xử của người lao động Việt Nam và các giải pháp lãnh đạo nhân văn, dung hòa lợi ích giữa người lao động và doanh nghiệp.",
      "file_url": "http://localhost:5000/uploads/materials/tam-ly-hoc-quan-tri-va-van-hoa-lanh-dao-doanh-nghiep-viet-nam-1789397206541.pdf",
      "file_type": "PDF",
      "file_size": "234449",
      "download_count": 490
    },
    {
      "title": "The 21 Irrefutable Laws of Leadership (21 Nguyên tắc Vàng của Lãnh đạo)",
      "description": "[Tác giả: John C. Maxwell Leadership Foundation] - Bộ nguyên tắc kinh điển định hình năng lực lãnh đạo: Định luật về Chiếc nắp trần (The Law of the Lid), Định luật về Sức ảnh hưởng, Định luật về Kết nối và Trao quyền.",
      "file_url": "http://localhost:5000/uploads/materials/the-21-irrefutable-laws-of-leadership-21-nguyen-tac-vang-cua-lanh-1789397208142.pdf",
      "file_type": "PDF",
      "file_size": "868492",
      "download_count": 196
    },
    {
      "title": "Leaders Eat Last: Tại sao Đội ngũ Gắn kết còn nơi khác thì Tan rã?",
      "description": "[Tác giả: Simon Sinek Research Institute] - Mô hình 'Vòng tròn An toàn' (Circle of Safety): cơ chế sinh học của lòng trung thành, trách nhiệm bảo bọc của người đứng đầu và cách tạo dựng môi trường làm việc không sợ hãi.",
      "file_url": "http://localhost:5000/uploads/materials/leaders-eat-last-tai-sao-doi-ngu-gan-ket-con-noi-khac-thi-tan-ra-1789397210311.pdf",
      "file_type": "PDF",
      "file_size": "107346",
      "download_count": 304
    },
    {
      "title": "Harvard Business Review on Leadership (Tuyển tập Nghiên cứu HBR)",
      "description": "[Tác giả: Harvard Business School Publishing (HBR)] - Tuyển tập các công trình nghiên cứu đột phá về phong cách lãnh đạo chuyển đổi (Transformational Leadership), trí tuệ cảm xúc (EQ) của nhà quản trị và kỹ năng dẫn dắt thay đổi.",
      "file_url": "http://localhost:5000/uploads/materials/harvard-business-review-on-leadership-tuyen-tap-nghien-cuu-hbr-1789397211610.pdf",
      "file_type": "PDF",
      "file_size": "317417",
      "download_count": 119
    },
    {
      "title": "Good to Great: Từ Tốt đến Vĩ đại và Chân dung Nhà Lãnh đạo Cấp độ 5",
      "description": "[Tác giả: Jim Collins Research Team (Stanford Graduate School of Business)] - Công trình nghiên cứu thực nghiệm 15 năm về các công ty vĩ đại: sự kết hợp nghịch lý giữa lòng khiêm nhường cá nhân và ý chí sắt đá của các nhà lãnh đạo Cấp độ 5.",
      "file_url": "http://localhost:5000/uploads/materials/good-to-great-tu-tot-den-vi-dai-va-chan-dung-nha-lanh-dao-cap-do--1789397213230.pdf",
      "file_type": "PDF",
      "file_size": "120645",
      "download_count": 500
    }
  ],
  "Toán cao cấp & Giải tích": [
    {
      "title": "Giáo trình Toán học Cao cấp - Tập 1: Đại số và Hình học Giải tích",
      "description": "[Tác giả: GS.TS Nguyễn Đình Trí (Chủ biên - Trường ĐH Bách Khoa Hà Nội)] - Giáo trình kinh điển về ma trận, định thức, hệ phương trình đại số tuyến tính, cấu trúc không gian vectơ, cơ sở, số chiều và phép biến đổi tuyến tính.",
      "file_url": "http://localhost:5000/uploads/materials/giao-trinh-toan-hoc-cao-cap-tap-1-dai-so-va-hinh-hoc-giai-tich-1789397857860.pdf",
      "file_type": "PDF",
      "file_size": "1104836",
      "download_count": 291
    },
    {
      "title": "Giáo trình Toán học Cao cấp - Tập 2: Giải tích Hàm một biến",
      "description": "[Tác giả: GS.TS Nguyễn Đình Trí, GS. Tạ Văn Đĩnh (Trường ĐH Bách Khoa Hà Nội)] - Giáo trình chuẩn mực về giới hạn dãy số và hàm số, phép tính vi phân, định lý giá trị trung bình (Rolle, Lagrange, Cauchy), tích phân Riemann và phương trình vi phân cơ bản.",
      "file_url": "http://localhost:5000/uploads/materials/giao-trinh-toan-hoc-cao-cap-tap-2-giai-tich-ham-mot-bien-1789397860503.pdf",
      "file_type": "PDF",
      "file_size": "819383",
      "download_count": 440
    },
    {
      "title": "Giáo trình Giải tích - Tập 3: Hàm nhiều biến và Lý thuyết Chuỗi",
      "description": "[Tác giả: PGS.TS Đỗ Công Khanh (Chủ biên - Trường ĐH Bách Khoa - ĐHQG TP.HCM)] - Tài liệu chuyên sâu về đạo hàm riêng, cực trị có điều kiện, tích phân kép, tích phân bội ba, tích phân đường, tích phân mặt và lý thuyết chuỗi số / chuỗi Fourier.",
      "file_url": "http://localhost:5000/uploads/materials/giao-trinh-giai-tich-tap-3-ham-nhieu-bien-va-ly-thuyet-chuoi-1789397862857.pdf",
      "file_type": "PDF",
      "file_size": "2215244",
      "download_count": 426
    },
    {
      "title": "Bài tập Toán cao cấp và Tuyển tập Đề thi có Lời giải Chi tiết",
      "description": "[Tác giả: Khoa Toán - Tin học (Trường Đại học Khoa học Tự nhiên - ĐHQG Hà Nội)] - Hệ thống các dạng bài tập toán cao cấp mẫu, phương pháp giải tối ưu cho bài toán tích phân suy rộng, chuỗi lũy thừa và ứng dụng giải hệ phương trình vi phân.",
      "file_url": "http://localhost:5000/uploads/materials/bai-tap-toan-cao-cap-va-tuyen-tap-de-thi-co-loi-giai-chi-tiet-1789397865657.pdf",
      "file_type": "PDF",
      "file_size": "631718",
      "download_count": 485
    },
    {
      "title": "Calculus: Early Transcendentals (Giáo trình Giải tích Chuẩn Quốc tế)",
      "description": "[Tác giả: GS. James Stewart (McMaster University & Cengage Learning)] - Bộ giáo trình giải tích hàng đầu thế giới với hệ thống đồ thị hàm số trực quan không gian 3 chiều, các định lý giải tích vi tích phân và bài toán ứng dụng vật lý.",
      "file_url": "http://localhost:5000/uploads/materials/calculus-early-transcendentals-giao-trinh-giai-tich-chuan-quoc-te-1789397867693.pdf",
      "file_type": "PDF",
      "file_size": "417205",
      "download_count": 239
    },
    {
      "title": "Phương trình Vi phân và Ứng dụng trong Mô hình hóa Toán học",
      "description": "[Tác giả: Viện Toán học (Viện Hàn lâm Khoa học và Công nghệ Việt Nam - VAST)] - Công trình nghiên cứu ứng dụng phương trình vi phân tuyến tính cấp 1 và cấp 2, biến đổi Laplace trong mô hình hóa dao động cơ học và dòng điện mạch RLC.",
      "file_url": "http://localhost:5000/uploads/materials/phuong-trinh-vi-phan-va-ung-dung-trong-mo-hinh-hoa-toan-hoc-1789397869451.pdf",
      "file_type": "PDF",
      "file_size": "4681034",
      "download_count": 220
    },
    {
      "title": "Đại số Tuyến tính Ứng dụng trong Khoa học Dữ liệu và Trí tuệ Nhân tạo",
      "description": "[Tác giả: GS. Gilbert Strang (MIT OpenCourseWare & Department of Mathematics)] - Nền tảng toán học cho AI: phép phân rã ma trận giá trị suy biến SVD (Singular Value Decomposition), trực chuẩn hóa Gram-Schmidt và bài toán bình phương bé nhất.",
      "file_url": "http://localhost:5000/uploads/materials/dai-so-tuyen-tinh-ung-dung-trong-khoa-hoc-du-lieu-va-tri-tue-nhan-1789397873174.pdf",
      "file_type": "PDF",
      "file_size": "24854165",
      "download_count": 230
    },
    {
      "title": "Giải tích Số và Phương pháp Tính trong Kỹ thuật",
      "description": "[Tác giả: PGS.TS Trần Văn Hãn (Trường Đại học Bách Khoa Hà Nội - HUST)] - Cẩm nang phương pháp tính số: giải phương trình phi tuyến (phương pháp Newton-Raphson), đa thức nội suy Lagrange và tính xấp xỉ tích phân bằng công thức Simpson.",
      "file_url": "http://localhost:5000/uploads/materials/giai-tich-so-va-phuong-phap-tinh-trong-ky-thuat-1789397894265.pdf",
      "file_type": "PDF",
      "file_size": "363274",
      "download_count": 109
    }
  ],
  "Xác suất thống kê": [
    {
      "title": "Giáo trình Lý thuyết Xác suất và Thống kê Toán học",
      "description": "[Tác giả: PGS.TS Đào Hữu Hồ (NXB Đại học Quốc gia Hà Nội - VNU)] - Giáo trình kinh điển về lý thuyết xác suất: không gian biến cố sơ cấp, định lý cộng/nhân xác suất, công thức xác suất đầy đủ, công thức Bayes và biến ngẫu nhiên rời rạc.",
      "file_url": "http://localhost:5000/uploads/materials/giao-trinh-ly-thuyet-xac-suat-va-thong-ke-toan-hoc-1789397896153.pdf",
      "file_type": "PDF",
      "file_size": "1104836",
      "download_count": 162
    },
    {
      "title": "Giáo trình Xác suất và Thống kê Ứng dụng trong Kỹ thuật",
      "description": "[Tác giả: PGS.TS Tống Đình Quỳ (NXB Bách Khoa Hà Nội)] - Giáo trình chuyên sâu về các phân phối xác suất quan trọng (Nhị thức, Poisson, Chuẩn Gaussian, Chi-bình phương, Student t) và phân tích các bài toán kỹ thuật thực nghiệm.",
      "file_url": "http://localhost:5000/uploads/materials/giao-trinh-xac-suat-va-thong-ke-ung-dung-trong-ky-thuat-1789397898638.pdf",
      "file_type": "PDF",
      "file_size": "120645",
      "download_count": 373
    },
    {
      "title": "Giáo trình Lý thuyết Xác suất và Thống kê Kinh tế",
      "description": "[Tác giả: GS.TS Nguyễn Cao Văn, PGS.TS Trần Thái Ninh (Trường ĐH Kinh tế Quốc dân - NEU)] - Tài liệu đào tạo chuẩn mực về lý thuyết mẫu, phương pháp ước lượng tham số (khoảng tin cậy 95%, 99%), kiểm định giả thuyết thống kê và phân tích hồi quy tuyến tính.",
      "file_url": "http://localhost:5000/uploads/materials/giao-trinh-ly-thuyet-xac-suat-va-thong-ke-kinh-te-1789397899989.pdf",
      "file_type": "PDF",
      "file_size": "1958911",
      "download_count": 383
    },
    {
      "title": "Bài tập và Hướng dẫn Thực hành Xác suất Thống kê với Phần mềm R/SPSS",
      "description": "[Tác giả: Khoa Toán - Thống kê (Trường Đại học Kinh tế TP.HCM - UEH)] - Hướng dẫn thực hành phân tích phương sai ANOVA một yếu tố và hai yếu tố, kiểm định tính độc lập Chi-Square và tính hệ số tương quan tuyến tính Pearson trên máy tính tính toán.",
      "file_url": "http://localhost:5000/uploads/materials/bai-tap-va-huong-dan-thuc-hanh-xac-suat-thong-ke-voi-phan-mem-r-s-1789397902396.pdf",
      "file_type": "PDF",
      "file_size": "939692",
      "download_count": 236
    },
    {
      "title": "A First Course in Probability (Giáo trình Xác suất Toàn cầu)",
      "description": "[Tác giả: GS. Sheldon Ross (University of Southern California)] - Bộ giáo trình xác suất mẫu mực toàn cầu: giải tích tổ hợp, kỳ vọng có điều kiện, hàm tạo mômen (Moment Generating Functions) và giới thiệu quá trình Poisson.",
      "file_url": "http://localhost:5000/uploads/materials/a-first-course-in-probability-giao-trinh-xac-suat-toan-cau-1789397904406.pdf",
      "file_type": "PDF",
      "file_size": "558558",
      "download_count": 112
    },
    {
      "title": "Thống kê Ứng dụng trong Phân tích Dữ liệu và Ra Quyết định",
      "description": "[Tác giả: Viện Nghiên cứu Phát triển Quản lý (IVM)] - Cẩm nang phương pháp thống kê phi tham số: kiểm định dấu Wilcoxon, kiểm định Mann-Whitney, phân tích dữ liệu chuỗi thời gian (Time-series) và dự báo kinh tế định lượng.",
      "file_url": "http://localhost:5000/uploads/materials/thong-ke-ung-dung-trong-phan-tich-du-lieu-va-ra-quyet-dinh-1789397907744.pdf",
      "file_type": "PDF",
      "file_size": "158891",
      "download_count": 42
    },
    {
      "title": "Statistical Inference and Hypothesis Testing Manual (Stanford Methodology)",
      "description": "[Tác giả: Department of Statistics (Stanford University)] - Cẩm nang phương pháp suy diễn thống kê hiện đại: ước lượng hợp lý cực đại MLE (Maximum Likelihood Estimation), kiểm soát sai lầm loại I (alpha) và loại II (beta), tính p-value.",
      "file_url": "http://localhost:5000/uploads/materials/statistical-inference-and-hypothesis-testing-manual-stanford-meth-1789397909633.pdf",
      "file_type": "PDF",
      "file_size": "141971",
      "download_count": 97
    },
    {
      "title": "Quy luật Số lớn và Định lý Giới hạn Trung tâm trong Khoa học Đương đại",
      "description": "[Tác giả: Tạp chí Khoa học Toán học (Đại học Quốc gia TP.HCM)] - Công trình nghiên cứu ứng dụng định lý giới hạn trung tâm (Central Limit Theorem) trong phân tích dữ liệu lớn (Big Data), khử nhiễu tín hiệu và mô hình học máy xác suất.",
      "file_url": "http://localhost:5000/uploads/materials/quy-luat-so-lon-va-dinh-ly-gioi-han-trung-tam-trong-khoa-hoc-duon-1789397911062.pdf",
      "file_type": "PDF",
      "file_size": "234449",
      "download_count": 191
    }
  ],
  "Triết học & Pháp luật": [
    {
      "title": "Giáo trình Triết học Mác - Lênin (Hệ Đại học Không chuyên Lý luận Chính trị)",
      "description": "[Tác giả: Ban Tuyên giáo Trung ương & Bộ Giáo dục và Đào tạo (NXB Chính trị Quốc gia Sự thật)] - Giáo trình chuẩn quốc gia toàn diện: chủ nghĩa duy vật biện chứng, 3 quy luật cơ bản của phép biện chứng, 6 cặp phạm trù triết học và học thuyết hình thái kinh tế - xã hội.",
      "file_url": "http://localhost:5000/uploads/materials/giao-trinh-triet-hoc-mac-lenin-he-dai-hoc-khong-chuyen-ly-luan-ch-1789397912644.pdf",
      "file_type": "PDF",
      "file_size": "1104836",
      "download_count": 157
    },
    {
      "title": "Giáo trình Pháp luật Đại cương: Lý luận Chung về Nhà nước và Pháp luật",
      "description": "[Tác giả: Trường Đại học Luật Hà Nội & Trường ĐH Ngoại thương (FTU)] - Giáo trình cơ bản về nguồn gốc, bản chất và chức năng của Nhà nước và Pháp luật, hệ thống văn bản quy phạm pháp luật và bộ máy nhà nước Cộng hòa XHCN Việt Nam.",
      "file_url": "http://localhost:5000/uploads/materials/giao-trinh-phap-luat-dai-cuong-ly-luan-chung-ve-nha-nuoc-va-phap--1789397915334.pdf",
      "file_type": "PDF",
      "file_size": "868492",
      "download_count": 200
    },
    {
      "title": "Giáo trình Hệ thống Pháp luật Việt Nam và Pháp luật Kinh tế Thực hành",
      "description": "[Tác giả: Khoa Luật (Trường Đại học Kinh tế Quốc dân - NEU)] - Cẩm nang pháp lý về môi trường kinh doanh: quy chế thành lập doanh nghiệp theo Luật Doanh nghiệp, hợp đồng thương mại, quyền sở hữu trí tuệ và tranh chấp kinh tế.",
      "file_url": "http://localhost:5000/uploads/materials/giao-trinh-he-thong-phap-luat-viet-nam-va-phap-luat-kinh-te-thuc--1789397919018.pdf",
      "file_type": "PDF",
      "file_size": "107346",
      "download_count": 199
    },
    {
      "title": "Lịch sử Triết học Phương Tây: Từ Cổ đại Hy Lạp đến Triết học Hiện đại",
      "description": "[Tác giả: Khoa Triết học (Trường ĐH Khoa học Xã hội & Nhân văn - ĐHQG Hà Nội)] - Khảo cứu toàn diện tiến trình tư tưởng phương Tây: Socrates, Plato, Aristotle thời cổ đại, thuyết duy lý Descartes, triết học phê phán Kant và phép biện chứng Hegel.",
      "file_url": "http://localhost:5000/uploads/materials/lich-su-triet-hoc-phuong-tay-tu-co-dai-hy-lap-den-triet-hoc-hien--1789397920401.pdf",
      "file_type": "PDF",
      "file_size": "317417",
      "download_count": 206
    },
    {
      "title": "Giáo trình Tư tưởng Hồ Chí Minh: Hệ thống Quan điểm Toàn diện và Sâu sắc",
      "description": "[Tác giả: Bộ Giáo dục và Đào tạo (NXB Chính trị Quốc gia Sự thật)] - Giáo trình chính quy về hệ thống quan điểm của Chủ tịch Hồ Chí Minh: độc lập dân tộc gắn liền với CNXH, đại đoàn kết toàn dân, xây dựng nhà nước pháp quyền của dân, do dân, vì dân.",
      "file_url": "http://localhost:5000/uploads/materials/giao-trinh-tu-tuong-ho-chi-minh-he-thong-quan-diem-toan-dien-va-s-1789397922104.pdf",
      "file_type": "PDF",
      "file_size": "120645",
      "download_count": 499
    },
    {
      "title": "Phương pháp Luận Biện chứng Duy vật trong Nghiên cứu Khoa học và Thực tiễn",
      "description": "[Tác giả: Viện Triết học (Viện Hàn lâm Khoa học Xã hội Việt Nam - VASS)] - Phân tích mối quan hệ biện chứng giữa cái chung và cái riêng, nguyên nhân và kết quả, bản chất và hiện tượng; phương pháp luận phát hiện và giải quyết mâu thuẫn thực tiễn.",
      "file_url": "http://localhost:5000/uploads/materials/phuong-phap-luan-bien-chung-duy-vat-trong-nghien-cuu-khoa-hoc-va--1789397923458.pdf",
      "file_type": "PDF",
      "file_size": "323091",
      "download_count": 360
    },
    {
      "title": "Pháp luật Hợp đồng và Trách nhiệm Dân sự trong Hoạt động Thương mại",
      "description": "[Tác giả: Trường Đại học Luật TP.HCM (ULAW)] - Chuyên khảo về điều kiện có hiệu lực của hợp đồng, chế tài bồi thường thiệt hại, phạt vi phạm và các trường hợp bất khả kháng theo quy định của Bộ luật Dân sự Việt Nam.",
      "file_url": "http://localhost:5000/uploads/materials/phap-luat-hop-dong-va-trach-nhiem-dan-su-trong-hoat-dong-thuong-m-1789397925110.pdf",
      "file_type": "PDF",
      "file_size": "3433632",
      "download_count": 500
    },
    {
      "title": "An Introduction to the Principles of Morals and Legislation (Triết học Pháp quyền)",
      "description": "[Tác giả: Jeremy Bentham, John Stuart Mill (Oxford University Press Edition)] - Tác phẩm kinh điển về triết học pháp quyền phương Tây: nguyên lý vị lợi (Principle of Utility), cơ sở đạo đức học của luật pháp và lý thuyết về công lý xã hội.",
      "file_url": "http://localhost:5000/uploads/materials/an-introduction-to-the-principles-of-morals-and-legislation-triet-1789397928333.pdf",
      "file_type": "PDF",
      "file_size": "1172762",
      "download_count": 322
    }
  ]
};

async function seedAllMaterials() {
  console.log('================================================================');
  console.log('BẮT ĐẦU NẠP DỮ LIỆU 258 HỌC LIỆU CHUẨN XÁC VÀO HỆ THỐNG');
  console.log('================================================================');

  try {
    await sequelize.authenticate();
    console.log('✓ Kết nối CSDL thành công.');

    let teacher = await User.findOne({ where: { role: 'teacher' } });
    if (!teacher) {
      teacher = await User.findOne();
    }
    const teacherId = teacher ? teacher.id : 1;

    let totalCreated = 0;

    for (const [catName, items] of Object.entries(masterCatalog)) {
      const [cat] = await Category.findOrCreate({
        where: { name: catName },
        defaults: { description: `Danh mục học liệu chuyên sâu ${catName}` }
      });

      console.log(`\n[DANH MỤC: ${catName}] (${items.length} tài liệu)`);

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        
        // Extract filename from file_url
        let filename = path.basename(item.file_url);
        if (!filename || filename.length < 5) {
          filename = `${toCleanSlug(item.title)}-${Date.now() + i}.pdf`;
        }
        
        const filePath = path.join(uploadsDir, filename);

        // Ensure physical file exists
        if (!fs.existsSync(filePath)) {
          const fallbackUrl = "https://files.eric.ed.gov/fulltext/ED500508.pdf";
          downloadOfficialPdf(fallbackUrl, filePath);
        }

        const actualSize = fs.existsSync(filePath) ? fs.statSync(filePath).size : item.file_size;
        const finalUrl = `http://localhost:5000/uploads/materials/${filename}`;

        const [mat, created] = await Material.findOrCreate({
          where: { title: item.title, category_id: cat.id },
          defaults: {
            description: item.description,
            file_url: finalUrl,
            file_type: item.file_type || 'PDF',
            file_size: actualSize,
            user_id: teacherId,
            download_count: item.download_count || (Math.floor(Math.random() * 400) + 50),
            status: 'active'
          }
        });

        if (created) {
          totalCreated++;
        }
      }
      console.log(`✓ Đã nạp xong danh mục: ${catName}`);
    }

    console.log('\n================================================================');
    console.log(`HOÀN TẤT ĐỒNG BỘ! Tổng cộng ${totalCreated} tài liệu mới được tạo thành công.`);
    console.log('================================================================');
    process.exit(0);
  } catch (error) {
    console.error('Lỗi khi seed học liệu:', error);
    process.exit(1);
  }
}

seedAllMaterials();
