'use client';
/* oxlint-disable next/no-img-element, next/no-html-link-for-pages */

import { useMemo, useState } from 'react';
import { ArrowUpRight, Check, ImagePlus, LoaderCircle, Plus, Save } from 'lucide-react';
import type { ChatGPTUser } from '@/app/chatgpt-auth';

type ContentRow = {
  key: string;
  payload: Record<string, unknown>;
  updatedAt: string;
  updatedBy: string;
};

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
  pastActivityEyebrow: string;
  pastActivityTitle: string;
  pastActivityZh: string;
  pastActivityDetails: string;
  pastActivityBody: string;
  pastActivityImage: string;
  teamTitle: string;
  teamZh: string;
  teamEn: string;
  teamImage: string;
  footerEn: string;
  footerZh: string;
};

type StoryDraft = {
  title: string;
  zh: string;
  excerpt: string;
  image: string;
  bodyText: string;
};

type NewStoryDraft = StoryDraft & {
  slug: string;
  published: string;
  eyebrow: string;
  tone: string;
};

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
  pastActivityEyebrow: 'PAST ACTIVITY · 2025 ARCHIVE',
  pastActivityTitle: 'The Power of Play: Eggy Block Party',
  pastActivityZh: '和 Eggy 一起找回玩心，創作自己的小小蛋守護者',
  pastActivityDetails: 'SEPTEMBER 14, 2025 · BOSTON · COMMUNITY BLOCK PARTY',
  pastActivityBody: 'At this playful community gathering, participants made their own little Eggy guardians and rediscovered how curiosity, silliness, and hands-on art can help us learn, grow, and connect with the world around us.',
  pastActivityImage: '/images/archive/DOmYmikibkR.jpg',
  teamTitle: 'Six therapists.\nMany ways to connect.',
  teamZh: '我們是六位來自台灣、畢業於麻州 Lesley University 的表達性治療師，專長涵蓋藝術治療、音樂治療、戲劇治療、舞蹈／動作治療，以及表達性藝術治療。',
  teamEn: 'We create culturally responsive programs that support self-care and whole-person well-being, especially for Asian and immigrant communities.',
  teamImage: '/images/who-we-are-v3.png',
  footerEn: 'There is a place for your story here.',
  footerZh: '有合作想法、活動邀請，或只是想和我們打聲招呼？',
};

const curatedStories = [
  ['ai-and-therapy', 'If AI can listen to me, do I still need a therapist?'],
  ['watercolor-clinical-work', 'Clinical work is like wet-on-wet watercolor'],
  ['future-of-table', 'Imagining the future of Table'],
  ['what-it-means-to-be-human', 'Four books that ask what it means to be human'],
  ['block-party-recap', 'We built a little city together'],
  ['block-party', 'Block Party: Build Our Town'],
  ['reality-check', 'A gentle reality check for future art therapists'],
  ['what-is-expressive-therapy', 'What is expressive arts therapy?'],
  ['lesley-university', 'Expressive therapies at Lesley University'],
  ['meet-table', 'Hello, we are Table'],
] as const;

const emptyStory: StoryDraft = { title: '', zh: '', excerpt: '', image: '', bodyText: '' };
const emptyNewStory: NewStoryDraft = {
  ...emptyStory,
  slug: '',
  published: new Date().toISOString().slice(0, 10),
  eyebrow: 'FROM OUR TABLE · 我們的分享',
  tone: 'sage',
};

function text(value: unknown) {
  return typeof value === 'string' ? value : '';
}

function storyFromPayload(payload?: Record<string, unknown>): StoryDraft {
  return {
    title: text(payload?.title),
    zh: text(payload?.zh),
    excerpt: text(payload?.excerpt),
    image: text(payload?.image),
    bodyText: Array.isArray(payload?.body) ? payload.body.filter((item): item is string => typeof item === 'string').join('\n\n') : '',
  };
}

export default function AdminEditor({
  user,
  initialRows,
  signOutPath,
}: {
  user: ChatGPTUser;
  initialRows: ContentRow[];
  signOutPath: string;
}) {
  const initialContent = useMemo(
    () => Object.fromEntries(initialRows.map((row) => [row.key, row.payload])),
    [initialRows],
  );
  const [savedContent, setSavedContent] = useState<Record<string, Record<string, unknown>>>(initialContent);
  const [pageCopy, setPageCopy] = useState<PageCopy>({ ...pageDefaults, ...initialContent.page });
  const [selectedSlug, setSelectedSlug] = useState(curatedStories[0][0] as string);
  const [storyDrafts, setStoryDrafts] = useState<Record<string, StoryDraft>>(() =>
    Object.fromEntries(curatedStories.map(([slug]) => [slug, storyFromPayload(initialContent[`story:${slug}`])])),
  );
  const [newStory, setNewStory] = useState<NewStoryDraft>(emptyNewStory);
  const [status, setStatus] = useState('Ready');
  const [busy, setBusy] = useState(false);

  const save = async (key: string, payload: Record<string, unknown>) => {
    setBusy(true);
    setStatus('Saving…');
    try {
      const response = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ key, payload }),
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error ?? 'Unable to save');
      setSavedContent((current) => ({ ...current, [key]: payload }));
      setStatus('Saved — the website is updated');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Unable to save');
    } finally {
      setBusy(false);
    }
  };

  const upload = async (file: File | undefined, onUploaded: (url: string) => void) => {
    if (!file) return;
    setBusy(true);
    setStatus('Uploading original image…');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      const result = await response.json() as { url?: string; error?: string };
      if (!response.ok || !result.url) throw new Error(result.error ?? 'Unable to upload');
      onUploaded(result.url);
      setStatus('Image uploaded — save this section to publish it');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Unable to upload');
    } finally {
      setBusy(false);
    }
  };

  const currentStory = storyDrafts[selectedSlug];
  const setCurrentStory = (field: keyof StoryDraft, value: string) => {
    setStoryDrafts((current) => ({
      ...current,
      [selectedSlug]: { ...current[selectedSlug], [field]: value },
    }));
  };

  const saveStory = () => save(`story:${selectedSlug}`, {
    ...currentStory,
    body: currentStory.bodyText.split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean),
    bodyText: undefined,
  });

  const publishNewStory = async () => {
    const slug = newStory.slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    if (!slug || !newStory.title || !newStory.published) {
      setStatus('Add a URL name, English title, and date first');
      return;
    }
    await save(`custom-story:${slug}`, {
      ...newStory,
      slug,
      body: newStory.bodyText.split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean),
      bodyText: undefined,
    });
    setNewStory(emptyNewStory);
  };

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <div>
          <p className="admin-kicker">TABLE · ADMIN STUDIO</p>
          <h1>Edit the table,<br /><em>gently.</em></h1>
          <p>Update English and Chinese copy, stories, and original-color images.</p>
        </div>
        <div className="admin-account">
          <span>{user.displayName}</span>
          <a href="/" target="_blank" rel="noreferrer">View website <ArrowUpRight size={14} /></a>
          <a href={signOutPath}>Sign out</a>
        </div>
      </header>

      <div className="admin-status" aria-live="polite">
        {busy ? <LoaderCircle size={15} className="admin-spin" /> : <Check size={15} />}
        <span>{status}</span>
      </div>

      <section className="admin-card">
        <div className="admin-card-intro">
          <p className="admin-number">01</p>
          <h2>Homepage words</h2>
          <p>Edit the main English message and its Chinese companion text.</p>
        </div>
        <div className="admin-fields">
          {([
            ['heroLead', 'Hero — opening line'],
            ['heroEmphasis', 'Hero — highlighted word'],
            ['heroTail', 'Hero — closing line'],
            ['heroZh', 'Hero — Chinese'],
            ['missionEn', 'Mission — English'],
            ['missionZh', 'Mission — Chinese'],
            ['storiesIntroZh', 'Stories introduction — Chinese'],
            ['footerEn', 'Footer invitation — English'],
            ['footerZh', 'Footer invitation — Chinese'],
          ] as const).map(([field, label]) => (
            <label key={field}>
              <span>{label}</span>
              {field.includes('mission') || field.includes('stories') ? (
                <textarea value={pageCopy[field]} onChange={(event) => setPageCopy({ ...pageCopy, [field]: event.target.value })} />
              ) : (
                <input value={pageCopy[field]} onChange={(event) => setPageCopy({ ...pageCopy, [field]: event.target.value })} />
              )}
            </label>
          ))}
          <button className="admin-primary" type="button" disabled={busy} onClick={() => save('page', pageCopy)}><Save size={16} /> Save homepage</button>
        </div>
      </section>

      <section className="admin-card">
        <div className="admin-card-intro">
          <p className="admin-number">02</p>
          <h2>Featured activity</h2>
          <p>Update the Activities section and upload its original poster or event image.</p>
        </div>
        <div className="admin-fields">
          <label><span>Category line</span><input value={pageCopy.activityEyebrow} onChange={(event) => setPageCopy({ ...pageCopy, activityEyebrow: event.target.value })} /></label>
          <label><span>English title</span><input value={pageCopy.activityTitle} onChange={(event) => setPageCopy({ ...pageCopy, activityTitle: event.target.value })} /></label>
          <label><span>Chinese title</span><input value={pageCopy.activityZh} onChange={(event) => setPageCopy({ ...pageCopy, activityZh: event.target.value })} /></label>
          <label><span>Date, place, and access details</span><input value={pageCopy.activityDetails} onChange={(event) => setPageCopy({ ...pageCopy, activityDetails: event.target.value })} /></label>
          <label><span>Activity introduction</span><textarea value={pageCopy.activityBody} onChange={(event) => setPageCopy({ ...pageCopy, activityBody: event.target.value })} /></label>
          <label><span>Image path</span><input value={pageCopy.activityImage} onChange={(event) => setPageCopy({ ...pageCopy, activityImage: event.target.value })} /></label>
          <label className="admin-upload"><ImagePlus size={18} /><span>Upload original activity image<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(event) => upload(event.target.files?.[0], (url) => setPageCopy((current) => ({ ...current, activityImage: url })))} /></span><small>JPG, PNG, WebP or GIF · up to 8 MB</small></label>
          {pageCopy.activityImage && <img className="admin-preview" src={pageCopy.activityImage} alt="Activity preview" />}
          <h3 className="admin-subheading">Past activity · 2025 archive</h3>
          <label><span>Category line</span><input value={pageCopy.pastActivityEyebrow} onChange={(event) => setPageCopy({ ...pageCopy, pastActivityEyebrow: event.target.value })} /></label>
          <label><span>English title</span><input value={pageCopy.pastActivityTitle} onChange={(event) => setPageCopy({ ...pageCopy, pastActivityTitle: event.target.value })} /></label>
          <label><span>Chinese title</span><input value={pageCopy.pastActivityZh} onChange={(event) => setPageCopy({ ...pageCopy, pastActivityZh: event.target.value })} /></label>
          <label><span>Date and activity details</span><input value={pageCopy.pastActivityDetails} onChange={(event) => setPageCopy({ ...pageCopy, pastActivityDetails: event.target.value })} /></label>
          <label><span>Activity introduction</span><textarea value={pageCopy.pastActivityBody} onChange={(event) => setPageCopy({ ...pageCopy, pastActivityBody: event.target.value })} /></label>
          <label><span>Image path</span><input value={pageCopy.pastActivityImage} onChange={(event) => setPageCopy({ ...pageCopy, pastActivityImage: event.target.value })} /></label>
          <label className="admin-upload"><ImagePlus size={18} /><span>Upload past activity image<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(event) => upload(event.target.files?.[0], (url) => setPageCopy((current) => ({ ...current, pastActivityImage: url })))} /></span><small>JPG, PNG, WebP or GIF · up to 8 MB</small></label>
          {pageCopy.pastActivityImage && <img className="admin-preview" src={pageCopy.pastActivityImage} alt="Past activity preview" />}
          <button className="admin-primary" type="button" disabled={busy} onClick={() => save('page', pageCopy)}><Save size={16} /> Save activity</button>
        </div>
      </section>

      <section className="admin-card">
        <div className="admin-card-intro">
          <p className="admin-number">03</p>
          <h2>Who we are</h2>
          <p>Edit the team introduction and replace the six-person group image.</p>
        </div>
        <div className="admin-fields">
          <label><span>Team headline · use a new line for a line break</span><textarea value={pageCopy.teamTitle} onChange={(event) => setPageCopy({ ...pageCopy, teamTitle: event.target.value })} /></label>
          <label><span>Chinese introduction</span><textarea value={pageCopy.teamZh} onChange={(event) => setPageCopy({ ...pageCopy, teamZh: event.target.value })} /></label>
          <label><span>English introduction</span><textarea value={pageCopy.teamEn} onChange={(event) => setPageCopy({ ...pageCopy, teamEn: event.target.value })} /></label>
          <label><span>Image path</span><input value={pageCopy.teamImage} onChange={(event) => setPageCopy({ ...pageCopy, teamImage: event.target.value })} /></label>
          <label className="admin-upload"><ImagePlus size={18} /><span>Upload six-person team image<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(event) => upload(event.target.files?.[0], (url) => setPageCopy((current) => ({ ...current, teamImage: url })))} /></span><small>JPG, PNG, WebP or GIF · up to 8 MB</small></label>
          {pageCopy.teamImage && <img className="admin-preview" src={pageCopy.teamImage} alt="Team preview" />}
          <button className="admin-primary" type="button" disabled={busy} onClick={() => save('page', pageCopy)}><Save size={16} /> Save team section</button>
        </div>
      </section>

      <section className="admin-card">
        <div className="admin-card-intro">
          <p className="admin-number">04</p>
          <h2>Edit a story</h2>
          <p>Leave a field blank to keep its original website value. Uploaded images are shown without filters.</p>
        </div>
        <div className="admin-fields">
          <label><span>Choose story</span><select value={selectedSlug} onChange={(event) => setSelectedSlug(event.target.value)}>{curatedStories.map(([slug, title]) => <option key={slug} value={slug}>{title}</option>)}</select></label>
          <label><span>English title</span><input value={currentStory.title} placeholder="Keep original" onChange={(event) => setCurrentStory('title', event.target.value)} /></label>
          <label><span>Chinese title</span><input value={currentStory.zh} placeholder="保留原文" onChange={(event) => setCurrentStory('zh', event.target.value)} /></label>
          <label><span>Short introduction</span><textarea value={currentStory.excerpt} placeholder="Keep original" onChange={(event) => setCurrentStory('excerpt', event.target.value)} /></label>
          <label><span>Full story · separate paragraphs with a blank line</span><textarea className="admin-tall" value={currentStory.bodyText} placeholder="Keep original" onChange={(event) => setCurrentStory('bodyText', event.target.value)} /></label>
          <label><span>Image path</span><input value={currentStory.image} placeholder="Keep original" onChange={(event) => setCurrentStory('image', event.target.value)} /></label>
          <label className="admin-upload"><ImagePlus size={18} /><span>Upload original image<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(event) => upload(event.target.files?.[0], (url) => setStoryDrafts((current) => ({ ...current, [selectedSlug]: { ...current[selectedSlug], image: url } })))} /></span><small>JPG, PNG, WebP or GIF · up to 8 MB</small></label>
          {currentStory.image && <img className="admin-preview" src={currentStory.image} alt="Story preview" />}
          <button className="admin-primary" type="button" disabled={busy} onClick={saveStory}><Save size={16} /> Save story</button>
        </div>
      </section>

      <section className="admin-card">
        <div className="admin-card-intro">
          <p className="admin-number">05</p>
          <h2>Add a new story</h2>
          <p>New stories appear in Ideas around the table and in the date-sorted timeline.</p>
        </div>
        <div className="admin-fields">
          <div className="admin-field-pair">
            <label><span>URL name</span><input value={newStory.slug} placeholder="community-art-day" onChange={(event) => setNewStory({ ...newStory, slug: event.target.value })} /></label>
            <label><span>Publication date</span><input type="date" value={newStory.published} onChange={(event) => setNewStory({ ...newStory, published: event.target.value })} /></label>
          </div>
          <label><span>Category line</span><input value={newStory.eyebrow} onChange={(event) => setNewStory({ ...newStory, eyebrow: event.target.value })} /></label>
          <label><span>English title</span><input value={newStory.title} onChange={(event) => setNewStory({ ...newStory, title: event.target.value })} /></label>
          <label><span>Chinese title</span><input value={newStory.zh} onChange={(event) => setNewStory({ ...newStory, zh: event.target.value })} /></label>
          <label><span>Short introduction</span><textarea value={newStory.excerpt} onChange={(event) => setNewStory({ ...newStory, excerpt: event.target.value })} /></label>
          <label><span>Full story</span><textarea className="admin-tall" value={newStory.bodyText} onChange={(event) => setNewStory({ ...newStory, bodyText: event.target.value })} /></label>
          <div className="admin-field-pair">
            <label><span>Image path</span><input value={newStory.image} onChange={(event) => setNewStory({ ...newStory, image: event.target.value })} /></label>
            <label><span>Color accent</span><select value={newStory.tone} onChange={(event) => setNewStory({ ...newStory, tone: event.target.value })}><option value="sage">Sage</option><option value="rose">Rose</option><option value="butter">Butter</option><option value="lilac">Lilac</option><option value="clay">Clay</option></select></label>
          </div>
          <label className="admin-upload"><ImagePlus size={18} /><span>Upload the new story image<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(event) => upload(event.target.files?.[0], (url) => setNewStory((current) => ({ ...current, image: url })))} /></span><small>JPG, PNG, WebP or GIF · up to 8 MB</small></label>
          {newStory.image && <img className="admin-preview" src={newStory.image} alt="New story preview" />}
          <button className="admin-primary" type="button" disabled={busy} onClick={publishNewStory}><Plus size={16} /> Publish new story</button>
        </div>
      </section>

      <footer className="admin-footer">
        <span>{Object.keys(savedContent).length} saved content modules</span>
        <a href="/">Back to Table Expressive Therapies</a>
      </footer>
    </main>
  );
}
