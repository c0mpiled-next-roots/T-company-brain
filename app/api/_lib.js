// Claude API プロキシの共通ロジック。
// APIキーはサーバー側の環境変数 ANTHROPIC_API_KEY のみ。クライアントには渡さない。

const API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-haiku-4-5-20251001'; // デモは低遅延優先
const TIMEOUT_MS = 8000;

const PROMPTS = {
  // 報告書テキスト → 構造化レッスンJSON(ライブ抽出シーン)
  extract: (text) => ({
    system:
      'あなたは製造業設計のナレッジコンパイラ。入力される日本語のトラブル報告書から、設計チェック用の構造化レッスンを1件抽出し、JSONのみを出力する。フィールド: category(強度不足/干渉/加工性など), region(部位), operation(操作。例: 板厚変更), parameter(パラメータ名), threshold(数値条件。例: 板厚>=10mm), outcome(結果の一行要約), source_doc(報告書名), source_rev(関連△。不明ならnull), author(担当者), year(数値)。JSON以外の文字を一切出力しないこと。',
    user: text,
    maxTokens: 500,
  }),
  // フライホイール確認質問(一行)
  flywheel: (ctx, lang) => ({
    system:
      lang === 'en'
        ? 'You are a senior engineer AI watching over a designer. For the change the designer just made, output exactly ONE short English question confirming the reason for the change. Polite but concise. Output nothing but the question.'
        : 'あなたは設計者の後ろで見守る先輩AI。設計者が行った変更に対して、変更理由を一言で確認する質問を日本語で1文だけ出力する。丁寧だが簡潔に。質問文以外は出力しない。',
    user: `変更内容: ${ctx}`,
    maxTokens: 100,
  }),
};

export async function handleClaudeRequest({ task, text, lang }) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not configured');
  if (!PROMPTS[task]) throw new Error(`unknown task: ${task}`);

  const { system, user, maxTokens } = PROMPTS[task](String(text || '').slice(0, 8000), lang);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const resp = await fetch(API_URL, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: maxTokens,
        system,
        messages: [{ role: 'user', content: user }],
      }),
    });
    if (!resp.ok) throw new Error(`anthropic ${resp.status}: ${(await resp.text()).slice(0, 200)}`);
    const data = await resp.json();
    return { text: data.content?.[0]?.text ?? '' };
  } finally {
    clearTimeout(timer);
  }
}
