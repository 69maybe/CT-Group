/**
 * Nội dung tĩnh + ánh xạ URL slug (segment sau /business-sector/) → slug API (DB).
 */

export type BusinessSectorStatic = {
  id: string;
  number: string;
  title: string;
  subTitle: string;
  description: { vi: string; en: string };
  image: string;
  href: string;
  color: string;
};

/** Segment URL (vd. clean-food) → slug trong DB (vd. clean-food-healthcare) */
const PATH_SLUG_TO_API: Record<string, string> = {
  'clean-food': 'clean-food-healthcare',
  'digital-twin': 'national-digital-twin',
  robotic: 'robotic-house',
  space: 'space-technology',
  autonomous: 'autonomous-vehicle',
  ai: 'artificial-intelligence',
  crypto: 'green-crypto',
};

export function resolveBusinessSectorApiSlug(pathSlug: string): string {
  return PATH_SLUG_TO_API[pathSlug] ?? pathSlug;
}

const VI_MARK = /[àáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđ]/i;

export function pickSectorTitles(entry: BusinessSectorStatic) {
  if (VI_MARK.test(entry.subTitle)) {
    return {
      titleVi: entry.subTitle,
      titleEn: entry.title,
      subtitleVi: entry.title,
      subtitleEn: entry.title,
    };
  }
  return {
    titleVi: entry.title,
    titleEn: entry.title,
    subtitleVi: entry.subTitle,
    subtitleEn: entry.subTitle,
  };
}

export function getBusinessSectorFallback(pathSlug: string) {
  const underBs = `/business-sector/${pathSlug}`;
  const entry = BUSINESS_SECTOR_DETAILS.find(
    (s) => s.id === pathSlug || s.href === underBs || s.href === `/${pathSlug}`
  );
  if (!entry) return null;
  return { entry, titles: pickSectorTitles(entry) };
}

export const BUSINESS_SECTOR_DETAILS: BusinessSectorStatic[] = [
  {
    id: 'smart-city',
    number: '01',
    title: 'Smart City',
    subTitle: 'Thành phố thông minh',
    description: {
      vi: 'Giải pháp thành phố thông minh toàn diện, tích hợp IoT, AI và dữ liệu lớn để nâng cao chất lượng cuộc sống đô thị.',
      en: 'Comprehensive smart city solutions integrating IoT, AI and big data to enhance urban quality of life.',
    },
    image: '/images/ctgroup/KV_Nganh-1.png',
    href: '/business-sector/smart-city',
    color: '#1b86c8',
  },
  {
    id: 'infrastructure',
    number: '02',
    title: 'Infrastructure',
    subTitle: 'Hạ tầng giao thông & xã hội',
    description: {
      vi: 'Phát triển hạ tầng giao thông, hạ tầng xã hội và hạ tầng logistic xanh.',
      en: 'Developing transportation infrastructure, social infrastructure and green logistics infrastructure.',
    },
    image: '/images/ctgroup/KV_Nganh-2.png',
    href: '/business-sector/infrastructure',
    color: '#e82429',
  },
  {
    id: 'clean-food',
    number: '03',
    title: 'Clean Food & Healthcare',
    subTitle: 'Thực phẩm sạch & Chăm sóc sức khỏe',
    description: {
      vi: 'Cung cấp thực phẩm sạch, dịch vụ chăm sóc sức khỏe và giải pháp y tế tiên tiến.',
      en: 'Providing clean food, healthcare services and advanced medical solutions.',
    },
    image: '/images/ctgroup/KV_Nganh-3.png',
    href: '/business-sector/clean-food',
    color: '#28a745',
  },
  {
    id: 'uav',
    number: '04',
    title: 'Unmanned Aerial Vehicles',
    subTitle: 'Máy bay không người lái',
    description: {
      vi: 'Nghiên cứu và phát triển công nghệ UAV cho các ứng dụng dân dụng và công nghiệp.',
      en: 'Research and development of UAV technology for civil and industrial applications.',
    },
    image: '/images/ctgroup/KV_Nganh-4.png',
    href: '/business-sector/uav',
    color: '#6f42c1',
  },
  {
    id: 'lae',
    number: '05',
    title: 'Low Altitude Economy',
    subTitle: 'Kinh tế hàng không thấp',
    description: {
      vi: 'Khai thác và phát triển kinh tế hàng không thấp, bao gồm drone và eVTOL.',
      en: 'Exploiting and developing low altitude economy including drones and eVTOL.',
    },
    image: '/images/ctgroup/KV_Nganh-5.png',
    href: '/low-altitude-economy',
    color: '#fd7e14',
  },
  {
    id: 'digital-twin',
    number: '06',
    title: '15-Layer Digital Twin',
    subTitle: 'Mô hình số 15 tầng quốc gia',
    description: {
      vi: 'Xây dựng mô hình số quốc gia 15 tầng, số hóa toàn diện đất nước.',
      en: 'Building 15-layer national digital twin model, comprehensive digitization of the country.',
    },
    image: '/images/ctgroup/KV_Nganh-6.png',
    href: '/business-sector/digital-twin',
    color: '#20c997',
  },
  {
    id: 'robotic',
    number: '07',
    title: 'Robotic House',
    subTitle: 'Nhà Robot',
    description: {
      vi: 'Phát triển và ứng dụng robot trong gia đình và công nghiệp.',
      en: 'Developing and applying robots in households and industry.',
    },
    image: '/images/ctgroup/KV_Nganh-7.png',
    href: '/business-sector/robotic',
    color: '#e83e8c',
  },
  {
    id: 'biotechnology',
    number: '08',
    title: 'Biotechnology',
    subTitle: 'Công nghệ sinh học',
    description: {
      vi: 'Nghiên cứu và ứng dụng công nghệ sinh học tiên tiến trong nông nghiệp, y tế và môi trường.',
      en: 'Research and application of advanced biotechnology in agriculture, healthcare and environment.',
    },
    image: '/images/ctgroup/KV_Nganh-8-TA.png',
    href: '/business-sector/biotechnology',
    color: '#6610f2',
  },
  {
    id: 'innovation-hub',
    number: '09',
    title: 'CT Innovation Hub 4.0',
    subTitle: 'Trung tâm đổi mới sáng tạo',
    description: {
      vi: 'Trung tâm đổi mới sáng tạo 4.0, hỗ trợ startups và doanh nghiệp công nghệ.',
      en: 'Innovation Hub 4.0, supporting startups and technology enterprises.',
    },
    image: '/images/ctgroup/KV_Nganh-9.png',
    href: '/business-sector/innovation-hub',
    color: '#17a2b8',
  },
  {
    id: 'carbon-credits',
    number: '10',
    title: 'Carbon Credits',
    subTitle: 'Tín chỉ Carbon',
    description: {
      vi: 'Phát triển và giao dịch tín chỉ carbon, hướng tới nền kinh tế carbon thấp.',
      en: 'Developing and trading carbon credits, towards low-carbon economy.',
    },
    image: '/images/ctgroup/KV_Nganh-10.png',
    href: '/carbon-credits',
    color: '#28a745',
  },
  {
    id: 'semiconductor',
    number: '11',
    title: 'Semiconductor Chip',
    subTitle: 'Chip bán dẫn',
    description: {
      vi: 'Nghiên cứu và phát triển công nghệ chip bán dẫn, vi mạch và linh kiện điện tử.',
      en: 'Research and development of semiconductor chip technology, microchips and electronic components.',
    },
    image: '/images/ctgroup/KV_Nganh-11.png',
    href: '/business-sector/semiconductor',
    color: '#007bff',
  },
  {
    id: 'space-tech',
    number: '12',
    title: 'Space Technology',
    subTitle: 'Công nghệ không gian',
    description: {
      vi: 'Nghiên cứu và ứng dụng công nghệ vũ trụ trong viễn thông và quan sát Trái Đất.',
      en: 'Research and application of space technology in telecommunications and Earth observation.',
    },
    image: '/images/ctgroup/KV_Nganh-12.png',
    href: '/business-sector/space',
    color: '#6c757d',
  },
  {
    id: 'autonomous',
    number: '13',
    title: 'Autonomous Vehicle',
    subTitle: 'Xe tự hành',
    description: {
      vi: 'Phát triển công nghệ xe tự hành cho giao thông thông minh.',
      en: 'Developing autonomous vehicle technology for smart transportation.',
    },
    image: '/images/ctgroup/KV_Nganh-1.png',
    href: '/business-sector/autonomous',
    color: '#343a40',
  },
  {
    id: 'ai',
    number: '14',
    title: 'Artificial Intelligence',
    subTitle: 'Trí tuệ nhân tạo',
    description: {
      vi: 'Nghiên cứu và phát triển các giải pháp AI cho doanh nghiệp và cuộc sống.',
      en: 'Research and development of AI solutions for businesses and life.',
    },
    image: '/images/ctgroup/KV_Nganh-2.png',
    href: '/business-sector/ai',
    color: '#dc3545',
  },
  {
    id: 'crypto',
    number: '15',
    title: 'Green Cryptocurrency',
    subTitle: 'Tiền mã hóa xanh',
    description: {
      vi: 'Phát triển cryptocurrency xanh, thân thiện với môi trường.',
      en: 'Developing green, environmentally friendly cryptocurrency.',
    },
    image: '/images/ctgroup/KV_Nganh-3.png',
    href: '/business-sector/crypto',
    color: '#ffc107',
  },
  {
    id: 'iot',
    number: '16',
    title: 'IoT',
    subTitle: 'Internet of Things',
    description: {
      vi: 'Nền tảng IoT cho nhà máy/đô thị thông minh, thu thập dữ liệu thiết bị theo thời gian thực và vận hành tối ưu.',
      en: 'IoT platforms for smart factories/cities with real-time device data collection and operational optimization.',
    },
    image: '/images/ctgroup/KV_Nganh-1.png',
    href: '/business-sector/iot',
    color: '#1b86c8',
  },
  {
    id: 'chatbot-ai',
    number: '17',
    title: 'Chatbot AI',
    subTitle: 'Conversational AI',
    description: {
      vi: 'Xây dựng chatbot/voicebot cho CSKH, bán hàng và trợ lý nội bộ với tích hợp hệ thống doanh nghiệp.',
      en: 'Build chatbot/voicebot for customer support, sales, and internal assistants with enterprise integrations.',
    },
    image: '/images/ctgroup/KV_Nganh-2.png',
    href: '/business-sector/chatbot-ai',
    color: '#dc3545',
  },
  {
    id: 'drone-uav',
    number: '18',
    title: 'Drone (UAV)',
    subTitle: 'Survey · Monitoring',
    description: {
      vi: 'Ứng dụng drone/UAV cho khảo sát, giám sát, nông nghiệp và kiểm tra hạ tầng công nghiệp.',
      en: 'Drone/UAV applications for surveying, monitoring, agriculture, and industrial infrastructure inspection.',
    },
    image: '/images/ctgroup/KV_Nganh-4.png',
    href: '/business-sector/drone-uav',
    color: '#6f42c1',
  },
  {
    id: 'cnc-controller',
    number: '19',
    title: 'CNC Controller',
    subTitle: 'Motion Control',
    description: {
      vi: 'Giải pháp điều khiển CNC, motion control và tích hợp dây chuyền sản xuất.',
      en: 'CNC control solutions, motion control, and production line integration.',
    },
    image: '/images/ctgroup/KV_Nganh-11.png',
    href: '/business-sector/cnc-controller',
    color: '#007bff',
  },
  {
    id: 'industrial-robot',
    number: '20',
    title: 'Industrial Robot',
    subTitle: 'Automation',
    description: {
      vi: 'Robot công nghiệp cho tự động hóa sản xuất: gắp đặt, hàn, đóng gói, kiểm tra chất lượng.',
      en: 'Industrial robots for manufacturing automation: pick-and-place, welding, packaging, and quality inspection.',
    },
    image: '/images/ctgroup/KV_Nganh-7.png',
    href: '/business-sector/industrial-robot',
    color: '#e83e8c',
  },
];
