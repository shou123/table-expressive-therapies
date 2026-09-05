'use client';
/* oxlint-disable next/no-img-element, next/no-html-link-for-pages */

import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, ChevronUp, RefreshCw } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

type Story = {
  slug: string;
  date: string;
  year: string;
  eyebrow: string;
  title: string;
  zh: string;
  excerpt: string;
  image: string;
  tone: string;
  body: string[];
  sources: { label: string; href: string }[];
  published?: string;
};

type ArchiveEntry = {
  slug: string;
  published: string;
  url: string;
  title: string;
  excerpt: string;
  caption: string;
  image: string;
  tone: string;
};

type EditableContent = Record<string, Record<string, unknown>>;

type PageCopy = {
  heroLead: string;
  heroEmphasis: string;
  heroTail: string;
  heroZh: string;
  missionEn: string;
  missionZh: string;
  storiesIntroZh: string;
  activityEyebrow: string;
  activityTitle: string;
  activityZh: string;
  activityDetails: string;
  activityBody: string;
  activityImage: string;
  teamTitle: string;
  teamZh: string;
  teamEn: string;
  teamImage: string;
  footerEn: string;
  footerZh: string;
};

const stories: Story[] = [
  {
    slug: 'ai-and-therapy',
    date: 'AUGUST 17',
    year: '2026',
    eyebrow: 'REFLECTION · 省思',
    title: 'If AI can listen to me, do I still need a therapist?',
    zh: '人工智能可以陪我聊心事，那我還需要找諮商師嗎？',
    excerpt: 'AI 可以整理想法、提供可能；治療關係也在意問題背後的你，和那些沒有說出口的故事。',
    image: '/images/ai-therapist.jpg',
    tone: 'rose',
    body: [
      '小編平常也會和 ChatGPT 聊聊天。這次邀請大家做一個沒有標準答案的小實驗：用不同方式向 AI 詢問同一件事，觀察它的回答如何改變。',
      'AI 可以回應問題、協助整理想法，也能提供不同的可能。可是，問題以外還有「問問題的你」——你的感受、經驗、關係，與那些未必能被幾句提示詞完整描述的故事。',
      'I also chat with AI from time to time. This playful experiment asks what changes when we phrase the same concern in different ways—and why a professional therapeutic relationship can still matter when AI can already respond to so much of what we share.',
    ],
    sources: [{ label: 'View original on Instagram', href: 'https://www.instagram.com/etableble/p/DcJPhYykeyL/' }],
  },
  {
    slug: 'watercolor-clinical-work',
    date: 'AUGUST 3',
    year: '2026',
    eyebrow: 'ART THERAPY · 藝術治療',
    title: 'Clinical work is like wet-on-wet watercolor',
    zh: '臨床工作，就像畫一幅大渲染水彩',
    excerpt: '顏料、紙張與天氣都在變；治療師練習在變化裡保持彈性、敏銳、理性與自我覺察。',
    image: '/images/watercolor-clinical.jpg',
    tone: 'lilac',
    body: [
      '作為藝術治療師，我會把臨床工作比喻成大渲染水彩：顏料的彩度、明度與濃度每刻都在變，天氣和紙張也會影響畫面如何展開。',
      '每個人的經驗也與環境交織變化。治療工作需要在過程中保持彈性、敏銳與理性，仔細觀察、傾聽並留下紀錄。這聽起來簡單，卻需要持續累積經驗、練習與自我覺察。',
      'For me, clinical work resembles wet-on-wet watercolor: saturation, brightness and intensity keep changing. Our work is to stay open, observant and thoughtful—and to document what we notice and what we do not yet know.',
    ],
    sources: [{ label: 'View original on Instagram', href: 'https://www.instagram.com/etableble/p/DblxxUGCaKL/' }],
  },
  {
    slug: 'future-of-table',
    date: 'JULY 12',
    year: '2026',
    eyebrow: 'OUR TABLE · 我們的桌子',
    title: 'Imagining the future of Table',
    zh: '一起探索 Table Expressive Therapies 的未來',
    excerpt: '一張桌子讓人們圍坐相聚，也提醒我們持續創造安全、互信、文化包容的空間。',
    image: '/images/table-future.jpg',
    tone: 'sage',
    body: [
      '在六月與七月，團隊透過兩場會議共同探索 Table 的未來發展，重新看見目標與願景，也坦誠分享彼此不同的觀點。',
      '受到「一張桌子」讓人們圍坐相聚的理念啟發，我們持續致力於打造安全、互信、具文化包容性的空間。讓不同背景的參與者，都能透過語言與非語言方式，自由分享自己的觀點與經驗。',
      'During June and July, we met to reflect on our goals and aspirations. Inspired by a table where people gather, we remain committed to a safe, trusting and culturally inclusive space for many forms of expression.',
    ],
    sources: [{ label: 'View original on Instagram', href: 'https://www.instagram.com/etableble/p/Dat_44WDJXp/' }],
  },
  {
    slug: 'what-it-means-to-be-human',
    date: 'JUNE 28',
    year: '2026',
    eyebrow: 'READING · 閱讀',
    title: 'Four books that ask what it means to be human',
    zh: '何以為人？四本讓我們重新思考「人類」的書',
    excerpt: '從芝加哥博物館的恐龍化石出發，沿著演化、人性、障礙史與文學，繼續追問沒有標準答案的問題。',
    image: '/images/books-human.jpg',
    tone: 'butter',
    body: [
      '一次芝加哥之旅，在博物館裡看見壯觀的恐龍化石，也重新回顧物種的起源與滅絕：人類，究竟是什麼？',
      '這個問題沒有單一答案。四本近期閱讀的書分別從演化、人性、障礙史與文學出發，陪伴我們重新思考「何以為人」。',
      'There is no single answer. These four books approach the question from evolution, human nature, disability history and literature—each inviting a different way of looking at what it means to be human.',
    ],
    sources: [{ label: 'View the reading list on Instagram', href: 'https://www.instagram.com/etableble/p/DaJUjD7iQQJ/' }],
  },
  {
    slug: 'block-party-recap',
    date: 'JUNE 18',
    year: '2026',
    eyebrow: 'COMMUNITY · 社群',
    title: 'We built a little city together',
    zh: '謝謝每一位與我們一起建造這座城市的朋友',
    excerpt: '從空白藍圖到街道、家與公共空間，我們只是透過「玩」，便開始了一場深刻的對話。',
    image: '/images/block-party-recap.jpg',
    tone: 'clay',
    body: [
      '幾個小時前，小小模擬城市還只是一張空白藍圖；後來，它有了街道、一座座獨一無二的家，也有了大家溝通協調出的公共空間與自己的小天地。',
      '當參與者為了擺放小家去探索自己與他人、與環境的距離，分享對理想生活的想法，甚至想像能為社區創造什麼——那一刻，我們便在練習如何與世界產生連結。',
      'Thank you to everyone who came to our Block Party. We moved from an empty blueprint to a shared town, rediscovering the power of play, expression and participation along the way.',
    ],
    sources: [{ label: 'Watch the recap on Instagram', href: 'https://www.instagram.com/etableble/reel/DZtWgbMMzF6/' }],
  },
  {
    slug: 'block-party',
    date: 'JUNE 7',
    year: '2026',
    eyebrow: 'COMMUNITY ARCHIVE · 社區活動',
    title: 'Block Party: Build Our Town',
    zh: '社區同樂會：一起藝術創作、連結彼此、創造歸屬',
    excerpt: '一場免費、雙語、全齡的社區藝術活動：每個人做一座小房子，共同完成一張屬於大家的城市地圖。',
    image: '/images/block-party-poster.jpg',
    tone: 'sage',
    body: [
      '參與者創造自己的迷你房子，放進共同建造的社區地圖。隨著城市成形，大家透過創意挑戰、合作任務與互動遊戲，認識彼此、分享想法，也想像一個充滿連結、合作與歸屬感的社區。',
      '活動於 2026 年 6 月 7 日 11:00–16:00 在 9 Johnny Ct, Boston 舉行，普通話與英文皆可參與，免費並提供材料。活動由波士頓市政府 Office of Civic Organizing 資助。',
      'The all-ages, bilingual event invited each person to make a mini house and place it on a shared map. Art-making, playful missions and conversation helped the town—and its sense of belonging—take shape.',
      '此內容整合 Instagram 的活動介紹、資訊與短片，以及 Facebook 上同一場活動；重複資訊已合併。',
    ],
    sources: [
      { label: 'Event details on Instagram', href: 'https://www.instagram.com/etableble/p/DZBDVmniQWC/' },
      { label: 'Program introduction on Instagram', href: 'https://www.instagram.com/etableble/reel/DZAyYdOp0Hv/' },
      { label: 'Who we are on Instagram', href: 'https://www.instagram.com/etableble/p/DZA5uXXpeOJ/' },
      { label: 'Facebook event source', href: 'https://www.facebook.com/TableExpressiveTherapies/' },
    ],
  },
  {
    slug: 'reality-check',
    date: 'MAY 24',
    year: '2026',
    eyebrow: 'FIELD NOTE · 職場筆記',
    title: 'A gentle reality check for future art therapists',
    zh: '給對藝術治療與表達性治療有興趣的人，一點真實的職場參考',
    excerpt: '這不是勸退文，而是對「心理健康產業很有前景」之外的現實，誠實而仍然喜愛這份工作的分享。',
    image: '/images/reality-check.jpg',
    tone: 'rose',
    body: [
      '常常看到「心理健康產業很有前景」或「留學藝術治療最吃香」的文章。這不是勸退文，只是想為對藝術治療、表達性治療有興趣的人，提供比較真實的職場參考。',
      '每位藝術治療師的經驗都不同。即使有許多 reality check，我們仍然真心喜歡這份工作，也邀請同行分享不一樣的經驗。',
      'This is not meant to discourage anyone. It is one therapist’s honest glimpse into the field for people considering art therapy or expressive therapies—and an invitation for fellow therapists to add their own realities.',
    ],
    sources: [{ label: 'View original on Instagram', href: 'https://www.instagram.com/etableble/p/DYvljfxDG6O/' }],
  },
  {
    slug: 'what-is-expressive-therapy',
    date: 'SEPTEMBER 11',
    year: '2022',
    eyebrow: 'GUIDE · 入門',
    title: 'What is expressive arts therapy?',
    zh: '表達性藝術治療，和藝術治療、音樂治療有什麼不同？',
    excerpt: '一種綜合、多模式、從「玩」出發的方法，運用創作與想像力去探索、理解、釋放、表達和改變。',
    image: '/images/what-is-expressive-therapy.jpg',
    tone: 'butter',
    body: [
      '表達性藝術治療是一種綜合且多模式的方法。它希望重新定義「治療」：以玩的角度介入，透過藝術過程探索、理解、釋放、表達與改變。',
      '治療中可以依序或同時使用不同媒材，讓非語言的情緒、認知與行為有被看見的方式。寫作、音樂、視覺藝術、戲劇與舞蹈，都可能成為連結內在資源與個人成長的入口。',
      'Expressive arts therapy is comprehensive and multimodal. Writing, music, visual art, drama and dance can be combined to access inner resources, support growth and reveal creative responses to complex experiences.',
    ],
    sources: [{ label: 'View the full guide on Instagram', href: 'https://www.instagram.com/etableble/p/CiYmlZcJdec/' }],
  },
  {
    slug: 'lesley-university',
    date: 'SEPTEMBER 11',
    year: '2022',
    eyebrow: 'STUDY ABROAD · 留學',
    title: 'Expressive therapies at Lesley University',
    zh: '關於 Lesley University 的表達性治療學習',
    excerpt: '一所位於 Cambridge 的私立學校，以教育、諮商、表達性治療與人類服務見長，也鼓勵跨專業學習。',
    image: '/images/lesley.jpg',
    tone: 'lilac',
    body: [
      'Lesley University 位於麻州 Cambridge，校園就在 Harvard 對面。學校的專長領域包括教育、諮商、表達性治療與人類服務。',
      '表達性治療包含藝術治療、舞蹈／動作治療、戲劇治療、表達性藝術治療與音樂治療；課程強調社會正義、多元文化，也鼓勵跨系修課與實踐。',
      'Lesley’s expressive therapies programs span art therapy, dance/movement therapy, drama therapy, expressive arts therapy and music therapy, with an emphasis on social justice, multicultural learning and cross-disciplinary study.',
    ],
    sources: [{ label: 'View original on Instagram', href: 'https://www.instagram.com/etableble/p/CiYmENfp9Hz/' }],
  },
  {
    slug: 'meet-table',
    date: 'SEPTEMBER 7',
    year: '2022',
    eyebrow: 'HELLO · 初見',
    title: 'Hello, we are Table',
    zh: '大家好，我們是「臺波波 表達性治療」',
    excerpt: '六位在 Boston 學習表達性治療的研究生，從音樂、藝術、舞蹈／動作、戲劇與表達性藝術相遇。',
    image: '/images/meet-table.jpg',
    tone: 'clay',
    body: [
      '最初的 Table 由六位在 Lesley University 學習表達性治療的研究生組成：盈融與禹慈（音樂治療）、妤丞與琬儀（藝術治療）、泓安（表達性藝術治療）、姮秀（舞蹈／動作治療與戲劇治療）。',
      '我們希望分享表達性治療與留學生活，也讓這裡成為開放、可以交流的空間。',
      'We began as six graduate students in Boston studying music therapy, art therapy, expressive arts therapy, dance/movement therapy and drama therapy—sharing what we learn and making room for open conversation.',
    ],
    sources: [{ label: 'View our first post on Instagram', href: 'https://www.instagram.com/etableble/p/CiOodG9MctC/' }],
  },
];

const pageDefaults: PageCopy = {
  heroLead: 'A place to create,',
  heroEmphasis: 'connect',
  heroTail: 'and be heard.',
  heroZh: '在一張桌子旁，讓創作成為理解自己、連結彼此的方式。',
  missionEn: 'We promote healing and well-being through expressive arts-based and non-traditional therapeutic practice.',
  missionZh: '透過表達性藝術與非傳統治療實踐，創造安全、互信、具文化回應性的療癒空間。',
  storiesIntroZh: '依照時間閱讀我們關於藝術、心理健康、社群與學習的分享。點開每一則故事，可以看見完整內容與原始來源。',
  activityEyebrow: 'RECENT COMMUNITY ACTIVITY · 社區回顧',
  activityTitle: 'Block Party: Build Our Town',
  activityZh: '社區同樂會：一起藝術創作，連結彼此，創造歸屬',
  activityDetails: 'JUNE 7, 2026 · BOSTON · FREE & BILINGUAL',
  activityBody: 'Families and neighbors created miniature homes, shaped a shared city, and found new ways to connect through play. This all-ages gathering made room for art, conversation, teamwork, and a collective sense of belonging.',
  activityImage: '/images/activity-block-party.jpg',
  teamTitle: 'Six therapists.\nMany ways to connect.',
  teamZh: '我們是六位來自台灣、畢業於麻州 Lesley University 的表達性治療師，專長涵蓋藝術治療、音樂治療、戲劇治療、舞蹈／動作治療，以及表達性藝術治療。',
  teamEn: 'We create culturally responsive programs that support self-care and whole-person well-being, especially for Asian and immigrant communities.',
  teamImage: '/images/who-we-are.png',
  footerEn: 'There is a place for your story here.',
  footerZh: '有合作想法、活動邀請，或只是想和我們打聲招呼？',
};

const curatedSourceUrls = new Set(stories.flatMap((story) => story.sources.map((source) => source.href)));
const TOTAL_STORIES = 121;

function mapArchive(entries: ArchiveEntry[]) {
  return entries
    .filter((entry) => !curatedSourceUrls.has(entry.url))
    .map<Story>((entry) => {
      const date = new Date(entry.published);
      return {
        slug: `archive-${entry.slug}`,
        date: new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', timeZone: 'UTC' }).format(date).toUpperCase(),
        year: String(date.getUTCFullYear()),
        eyebrow: 'INSTAGRAM ARCHIVE · 動態',
        title: entry.title,
        zh: entry.title,
        excerpt: entry.excerpt,
        image: entry.image,
        tone: entry.tone,
        body: [entry.caption],
        sources: [{ label: 'View original on Instagram', href: entry.url }],
        published: entry.published,
      };
    });
}

function sortStories(items: Story[]) {
  const time = (story: Story) => new Date(story.published ?? `${story.date} ${story.year}`).getTime();
  return [...items].sort((a, b) => time(b) - time(a));
}

function nonEmptyString(value: unknown) {
  return typeof value === 'string' && value.trim() ? value : undefined;
}

function applyStoryOverride(story: Story, payload?: Record<string, unknown>): Story {
  if (!payload) return story;
  const body = Array.isArray(payload.body)
    ? payload.body.filter((paragraph): paragraph is string => typeof paragraph === 'string' && Boolean(paragraph.trim()))
    : undefined;
  return {
    ...story,
    title: nonEmptyString(payload.title) ?? story.title,
    zh: nonEmptyString(payload.zh) ?? story.zh,
    excerpt: nonEmptyString(payload.excerpt) ?? story.excerpt,
    image: nonEmptyString(payload.image) ?? story.image,
    body: body?.length ? body : story.body,
  };
}

function titleSizeClass(title: string) {
  const length = Array.from(title).length;
  if (length > 96) return 'title-xlong';
  if (length > 54) return 'title-long';
  if (length > 20) return 'title-medium';
  return 'title-short';
}

function mapCustomStories(content: EditableContent): Story[] {
  return Object.entries(content)
    .filter(([key]) => key.startsWith('custom-story:'))
    .flatMap(([key, payload]) => {
      const title = nonEmptyString(payload.title);
      const published = nonEmptyString(payload.published);
      if (!title || !published) return [];
      const dateValue = new Date(`${published}T12:00:00Z`);
      if (Number.isNaN(dateValue.getTime())) return [];
      const tone = nonEmptyString(payload.tone);
      const validTone = tone && ['rose', 'clay', 'lilac', 'sage', 'butter'].includes(tone) ? tone : 'sage';
      return [{
        slug: `custom-${nonEmptyString(payload.slug) ?? key.slice('custom-story:'.length)}`,
        date: new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', timeZone: 'UTC' }).format(dateValue).toUpperCase(),
        year: String(dateValue.getUTCFullYear()),
        eyebrow: nonEmptyString(payload.eyebrow) ?? 'FROM OUR TABLE · 我們的分享',
        title,
        zh: nonEmptyString(payload.zh) ?? title,
        excerpt: nonEmptyString(payload.excerpt) ?? '',
        image: nonEmptyString(payload.image) ?? '/images/meet-table.jpg',
        tone: validTone,
        body: Array.isArray(payload.body)
          ? payload.body.filter((paragraph): paragraph is string => typeof paragraph === 'string' && Boolean(paragraph.trim()))
          : [],
        sources: [],
        published,
      } satisfies Story];
    });
}

const prompts = [
  ['今天的心情，如果是一種顏色，會是什麼？', 'If today had a color, what would it be?'],
  ['身體的哪一個地方，正在請你慢一點？', 'Where is your body asking you to slow down?'],
  ['用一個動作，說出此刻沒有說出口的話。', 'Let one small movement say what words cannot.'],
  ['如果安全感是一個房間，裡面會有什麼？', 'If safety were a room, what would be inside?'],
];

function StoryDialog({ story, children }: { story: Story; children: React.ReactNode }) {
  const dialogStartRef = useRef<HTMLDivElement>(null);
  return (
    <Dialog>
      <DialogTrigger render={<button type="button" className="story-trigger" aria-label={`Read ${story.title}`} />}>{children}</DialogTrigger>
      <DialogContent className="story-dialog" showCloseButton initialFocus={dialogStartRef}>
        <div className={`dialog-visual tone-${story.tone}`} ref={dialogStartRef} tabIndex={-1}>
          <div
            className="dialog-art"
            aria-hidden="true"
            style={{ backgroundImage: `url(${JSON.stringify(story.image)})` }}
          />
          <span>{story.date}<br />{story.year}</span>
        </div>
        <div className="dialog-copy">
          <DialogHeader>
            <p className="kicker">{story.eyebrow}</p>
            <DialogTitle className={titleSizeClass(story.title)}>{story.title}</DialogTitle>
            <DialogDescription>{story.zh}</DialogDescription>
          </DialogHeader>
          <div className="dialog-body">{story.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
          {story.sources.length > 0 && <div className="dialog-sources">
            {story.sources.map((source) => (
              <a href={source.href} target="_blank" rel="noreferrer" key={source.href}>{source.label}<ArrowUpRight size={15} /></a>
            ))}
          </div>}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function StoryCard({ story, size = 'regular' }: { story: Story; size?: 'large' | 'regular' | 'compact' }) {
  return (
    <article className={`story-card story-${size}`}>
      <StoryDialog story={story}>
        <span className={`story-image tone-${story.tone}`}>
          <img src={story.image} alt={story.zh} />
          <span className="image-orbit" aria-hidden="true">Read</span>
        </span>
        <span className="story-meta"><span>{story.eyebrow}</span><time>{story.date} · {story.year}</time></span>
        <span className="story-title">{story.title}</span>
        <span className="story-zh">{story.zh}</span>
        {size !== 'compact' && <span className="story-excerpt">{story.excerpt}</span>}
      </StoryDialog>
    </article>
  );
}

export default function Home() {
  const railRef = useRef<HTMLDivElement>(null);
  const [showAll, setShowAll] = useState(false);
  const [archiveStories, setArchiveStories] = useState<Story[]>([]);
  const [archiveStatus, setArchiveStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [promptIndex, setPromptIndex] = useState(0);
  const [editableContent, setEditableContent] = useState<EditableContent>({});
  const pageCopy = useMemo(() => {
    const saved = editableContent.page ?? {};
    return Object.fromEntries(
      Object.entries(pageDefaults).map(([key, fallback]) => [key, nonEmptyString(saved[key]) ?? fallback]),
    ) as PageCopy;
  }, [editableContent]);
  const liveStories = useMemo(
    () => stories.map((story) => applyStoryOverride(story, editableContent[`story:${story.slug}`])),
    [editableContent],
  );
  const customStories = useMemo(() => mapCustomStories(editableContent), [editableContent]);
  const allStories = sortStories([...liveStories, ...customStories, ...archiveStories]);
  const activityStory = useMemo(() => ({
    ...liveStories[5],
    eyebrow: pageCopy.activityEyebrow,
    title: pageCopy.activityTitle,
    zh: pageCopy.activityZh,
    excerpt: pageCopy.activityBody,
    image: pageCopy.activityImage,
    body: [pageCopy.activityBody, liveStories[5].body[1]],
  }), [liveStories, pageCopy]);

  useEffect(() => {
    fetch('/api/content')
      .then((response) => response.ok ? response.json() : Promise.reject(new Error('Content unavailable')))
      .then((value) => {
        const result = value as { content?: EditableContent };
        setEditableContent(result.content ?? {});
      })
      .catch(() => setEditableContent({}));
  }, []);

  const scrollRail = (direction: number) => {
    railRef.current?.scrollBy({ left: direction * Math.min(420, window.innerWidth * .82), behavior: 'smooth' });
  };

  const loadArchive = async () => {
    setArchiveStatus('loading');
    try {
      const response = await fetch('/archive-data.json');
      if (!response.ok) throw new Error('Archive unavailable');
      const entries = await response.json() as ArchiveEntry[];
      setArchiveStories(mapArchive(entries));
      setShowAll(true);
      setArchiveStatus('idle');
    } catch {
      setArchiveStatus('error');
    }
  };

  return (
    <main>
      <nav className="site-nav" aria-label="Main navigation">
        <a className="wordmark" href="#top" aria-label="Table Expressive Therapies home">
          <span className="wordmark-cn">臺波波</span><span>TABLE</span><small>EXPRESSIVE THERAPIES</small>
        </a>
        <div className="nav-links">
          <a href="#mission">Our Mission</a>
          <a href="#express">Express</a>
          <a href="#latest-stories">Latest Stories</a>
          <a href="#in-depth">In Depth</a>
          <a href="#all-stories">All Stories</a>
          <a href="#activities">Activities</a>
          <a href="#who-we-are">Who We Are</a>
        </div>
        <div className="nav-socials">
          <a href="https://www.instagram.com/etableble/" target="_blank" rel="noreferrer" aria-label="Instagram"><span aria-hidden="true">IG</span></a>
          <a href="https://www.facebook.com/TableExpressiveTherapies/" target="_blank" rel="noreferrer" aria-label="Facebook"><span aria-hidden="true">f</span></a>
        </div>
      </nav>

      <header className="hero" id="top">
        <p className="kicker">BOSTON · TAIWAN · EXPRESSIVE ARTS</p>
        <h1>{pageCopy.heroLead}<br /><em>{pageCopy.heroEmphasis}</em> {pageCopy.heroTail}</h1>
        <p className="hero-cn">{pageCopy.heroZh}</p>
        <a className="scroll-cue" href="#latest-stories">Explore our stories <ArrowDownRight size={18} /></a>
      </header>

      <section className="mission-strip" id="mission">
        <p>OUR MISSION</p>
        <h2>{pageCopy.missionEn}</h2>
        <p className="mission-cn">{pageCopy.missionZh}</p>
      </section>

      <section className="modalities" id="express">
        <div className="section-heading section-heading-tight">
          <div><p className="kicker">WAYS OF EXPRESSING</p><h2>More than<br />words alone</h2></div>
          <p>表達性藝術治療是一種多模式的方法。不同媒材可以單獨發生，也能在同一段歷程中彼此流動。</p>
        </div>
        <div className="modality-list">
          {[
            ['01', 'Visual Art', '視覺藝術', 'rose'],
            ['02', 'Music', '音樂', 'butter'],
            ['03', 'Drama & Writing', '戲劇與書寫', 'lilac'],
            ['04', 'Dance / Movement', '舞蹈與動作', 'sage'],
          ].map(([no, en, zh, tone]) => (
            <div className={`modality tone-${tone}`} key={no}><span>{no}</span><h3>{en}</h3><p>{zh}</p><i aria-hidden="true" /></div>
          ))}
        </div>
      </section>

      <section className="stories" id="latest-stories">
        <div className="section-heading">
          <div><p className="kicker">FROM OUR TABLE</p><h2>Stories, notes<br />& shared moments</h2></div>
          <p>{pageCopy.storiesIntroZh}</p>
        </div>
        <div className="feature-grid">
          <StoryCard story={liveStories[0]} size="large" />
          <StoryCard story={liveStories[1]} />
        </div>
      </section>

      <section className="in-depth" id="in-depth">
        <div className="rail-heading">
          <div><p className="kicker">IN DEPTH · 深入閱讀</p><h2>Ideas around the table</h2></div>
          <div className="rail-buttons">
            <button type="button" onClick={() => scrollRail(-1)} aria-label="Previous stories"><ArrowLeft /></button>
            <button type="button" onClick={() => scrollRail(1)} aria-label="Next stories"><ArrowRight /></button>
          </div>
        </div>
        <div className="story-rail" ref={railRef}>
          {[...customStories, ...liveStories.slice(2)].map((story) => <StoryCard story={story} size="compact" key={story.slug} />)}
        </div>
      </section>

      <section className="prompt-section">
        <div className="prompt-orbit" aria-hidden="true"><span /><span /><span /></div>
        <p className="kicker">A SMALL PAUSE · 停一下</p>
        <p className="prompt-zh">{prompts[promptIndex][0]}</p>
        <h2>{prompts[promptIndex][1]}</h2>
        <button type="button" onClick={() => setPromptIndex((promptIndex + 1) % prompts.length)}>
          Another prompt <RefreshCw size={15} />
        </button>
      </section>

      <section className="timeline-section" id="all-stories">
        <div className="timeline-intro">
          <p className="kicker">ALL STORIES · 完整時間線</p>
          <p className="timeline-count"><strong>{showAll ? allStories.length : 5}</strong><span>{showAll ? 'stories in the archive' : 'latest stories'}</span></p>
        </div>
        <div className="timeline-list">
          {allStories.slice(0, showAll ? allStories.length : 5).map((story, index) => (
            <StoryDialog story={story} key={story.slug}>
              <span className="timeline-index">{String(index + 1).padStart(2, '0')}</span>
              <span className="timeline-date">{story.date}<small>{story.year}</small></span>
              <span className={`timeline-title ${titleSizeClass(story.title)}`}><strong>{story.title}</strong><em>{story.zh}</em></span>
              <span className={`timeline-dot tone-${story.tone}`}><ArrowUpRight size={18} /></span>
            </StoryDialog>
          ))}
          {!showAll && (
            <button type="button" className="view-all" onClick={loadArchive} disabled={archiveStatus === 'loading'}>
              {archiveStatus === 'loading' ? 'Gathering the archive…' : `View all ${TOTAL_STORIES} stories`} <ArrowDownRight size={18} />
            </button>
          )}
          {showAll && (
            <button type="button" className="view-all collapse-all" onClick={() => {
              setShowAll(false);
              document.querySelector('#all-stories')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}>
              Show fewer stories <ChevronUp size={18} />
            </button>
          )}
          {archiveStatus === 'error' && <p className="archive-error">The archive could not be opened. Please try again.</p>}
        </div>
      </section>

      <section className="activities" id="activities">
        <div className="activity-heading">
          <p className="kicker">ACTIVITIES · 近期活動</p>
          <h2>Gather, create<br />& connect.</h2>
        </div>
        <div className="activity-card">
          <figure className="activity-poster"><img src={pageCopy.activityImage} alt={pageCopy.activityTitle} /></figure>
          <div className="activity-copy">
            <p className="kicker">{pageCopy.activityEyebrow}</p>
            <h3>{pageCopy.activityTitle}</h3>
            <p className="activity-zh">{pageCopy.activityZh}</p>
            <p className="activity-details">{pageCopy.activityDetails}</p>
            <p className="activity-body">{pageCopy.activityBody}</p>
            <StoryDialog story={activityStory}>
              <span className="activity-read">Read activity note <ArrowUpRight size={17} /></span>
            </StoryDialog>
          </div>
        </div>
      </section>

      <section className="about-table" id="who-we-are">
        <div className="about-photo tone-clay"><img src={pageCopy.teamImage} alt="Six members of Table Expressive Therapies gathered together" /><span>EST. 2022</span></div>
        <div className="about-copy">
          <p className="kicker">WHO WE ARE · 關於我們</p>
          <h2>{pageCopy.teamTitle.split('\n').map((line, index) => <span key={line}>{index > 0 && <br />}{line}</span>)}</h2>
          <p>{pageCopy.teamZh}</p>
          <p>{pageCopy.teamEn}</p>
          <div className="disciplines"><span>ART</span><span>MUSIC</span><span>DRAMA</span><span>MOVEMENT</span><span>WRITING</span><span>PLAY</span></div>
        </div>
      </section>

      <footer>
        <div><p className="kicker">PULL UP A CHAIR</p><h2>{pageCopy.footerEn}</h2></div>
        <div className="footer-contact">
          <p>{pageCopy.footerZh}</p>
          <a href="mailto:tableexpressivetherapy@gmail.com">tableexpressivetherapy@gmail.com <ArrowUpRight size={16} /></a>
          <div><a href="https://www.instagram.com/etableble/" target="_blank" rel="noreferrer">Instagram</a><a href="https://www.facebook.com/TableExpressiveTherapies/" target="_blank" rel="noreferrer">Facebook</a><a href="/admin">Admin</a></div>
        </div>
        <p className="copyright">© {new Date().getFullYear()} TABLE EXPRESSIVE THERAPIES, INC. · BOSTON, MA</p>
      </footer>
    </main>
  );
}
