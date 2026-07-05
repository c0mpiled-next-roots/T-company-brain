// 先輩カード — 警告UI。文言は lessons.json の事前生成テキスト(実行時LLMなし)。
// ja/en 両方の文言を事前生成で持ち、表示中の言語切り替えにも追従する。
import { getLang, onLangChange, t, tr } from './i18n.js';

export function createSenpaiCard(data, { onAction }) {
  const card = document.getElementById('senpai-card');
  const title = document.getElementById('senpai-title');
  const text = document.getElementById('senpai-text');
  const evidence = document.getElementById('senpai-evidence');
  const actionBtn = document.getElementById('senpai-action');
  const askBtn = document.getElementById('senpai-ask');
  const closeBtn = document.getElementById('senpai-close');

  let currentRule = null;

  function lessonById(id) {
    return data.lessons.find((l) => l.id === id);
  }

  function render(rule) {
    const en = getLang() === 'en' ? rule.en : null;

    title.textContent = `⚠ ${en?.title ?? rule.title}`;
    text.textContent = en?.senpai_text ?? rule.senpai_text;

    evidence.innerHTML = '';
    for (const id of rule.evidence) {
      const l = lessonById(id);
      if (!l) continue;
      const rev = document.createElement('span');
      rev.className = 'chip';
      rev.textContent = `△ ${tr('rev', l.source_rev ?? l.id)} — ${tr('categories', l.category)}`;
      rev.title = l.outcome;
      evidence.appendChild(rev);

      const doc = document.createElement('span');
      doc.className = 'chip doc';
      doc.textContent = `📄 ${tr('docs', l.source_doc)}(${tr('authors', l.author)})`;
      doc.title = l.outcome;
      evidence.appendChild(doc);
    }

    if (rule.action) {
      const label = en?.action_label ?? rule.action.label;
      actionBtn.textContent = `✓ ${label}${t('senpai.reco')}`;
      actionBtn.classList.remove('hidden');
    } else {
      actionBtn.classList.add('hidden');
    }

    if (rule.ask_person) {
      askBtn.textContent =
        getLang() === 'en'
          ? `💬 Ask ${en?.ask_person ?? rule.ask_person}`
          : `💬 ${rule.ask_person}に確認する`;
      askBtn.classList.remove('hidden');
    } else {
      askBtn.classList.add('hidden');
    }
  }

  function show(rule) {
    currentRule = rule;
    render(rule);
    card.classList.remove('hidden');
  }

  function hide() {
    card.classList.add('hidden');
    currentRule = null;
  }

  // 表示中に言語が切り替わったら再描画
  onLangChange(() => {
    if (currentRule && !card.classList.contains('hidden')) render(currentRule);
  });

  actionBtn.addEventListener('click', () => {
    if (currentRule?.action) onAction(currentRule);
    hide();
  });
  askBtn.addEventListener('click', () => {
    askBtn.textContent = t('senpai.sent');
    setTimeout(() => hide(), 900);
  });
  closeBtn.addEventListener('click', hide);

  return { show, hide };
}
