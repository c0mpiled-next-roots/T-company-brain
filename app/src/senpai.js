// 先輩カード — 警告UI。文言は lessons.json の事前生成テキスト(実行時LLMなし)。
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

  function show(rule) {
    currentRule = rule;
    title.textContent = `⚠ ${rule.title}`;
    text.textContent = rule.senpai_text;

    evidence.innerHTML = '';
    for (const id of rule.evidence) {
      const l = lessonById(id);
      if (!l) continue;
      const rev = document.createElement('span');
      rev.className = 'chip';
      rev.textContent = `△ ${l.source_rev ?? l.id} — ${l.category}`;
      rev.title = l.outcome;
      evidence.appendChild(rev);

      const doc = document.createElement('span');
      doc.className = 'chip doc';
      doc.textContent = `📄 ${l.source_doc}(${l.author})`;
      doc.title = l.outcome;
      evidence.appendChild(doc);
    }

    if (rule.action) {
      actionBtn.textContent = `✓ ${rule.action.label}(推奨)`;
      actionBtn.classList.remove('hidden');
    } else {
      actionBtn.classList.add('hidden');
    }

    if (rule.ask_person) {
      askBtn.textContent = `💬 ${rule.ask_person}に確認する`;
      askBtn.classList.remove('hidden');
    } else {
      askBtn.classList.add('hidden');
    }

    card.classList.remove('hidden');
  }

  function hide() {
    card.classList.add('hidden');
    currentRule = null;
  }

  actionBtn.addEventListener('click', () => {
    if (currentRule?.action) onAction(currentRule);
    hide();
  });
  askBtn.addEventListener('click', () => {
    askBtn.textContent = '✉ 送信しました(デモ)';
    setTimeout(() => hide(), 900);
  });
  closeBtn.addEventListener('click', hide);

  return { show, hide };
}
