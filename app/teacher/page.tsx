import type { Metadata } from 'next';
import Link from 'next/link';
import { program } from '@/content/program';
import { stages } from '@/content/stages';
import { PrintButton } from './print-button';

export const metadata: Metadata = {
  title: '先生・主催者の方へ｜未来制作録',
  description: '授業やワークショップで「未来制作録」を使うための進行案、話し合いの問い、体験課題、配慮事項をまとめた手引き。',
};

const lesson = [
  { time: '5分', name: '導入', text: '好きな映画や舞台を1つ思い浮かべ、「終わりに流れる名前は何人くらいいたか」を問いかけます。はじめの自己評価に答えてもらいます。' },
  { time: '20分', name: '体験', text: '1人または2人組で、5つの現場の問いに挑みます。正解を急がず、選んだ理由を口に出すよう声をかけます。' },
  { time: '15分', name: '話し合い', text: '各地点の「話し合いの問い」から1〜2つを選び、4人ほどの班で話します。自分たちの生活や学校行事と結びつけるのがねらいです。' },
  { time: '10分', name: 'ふり返り', text: 'ふり返りの自己評価に答え、はじめとの変化を確かめます。「記録・共有・安全は、ほかのどんな場面で役立つか」を全体で共有し、修了証を印刷します。' },
];

const scenes = [
  'キャリア教育、職業調べの導入',
  '総合的な学習（探究）の時間',
  '美術、情報、国語（表現）の発展学習',
  '放送部、演劇部、映像系の部活動',
  '図書館、公民館、映画館での地域向けワークショップ',
  '撮影所・劇場見学の事前学習',
];

const cares = [
  'このサイトは、名前や連絡先などの個人情報を集めません。記録は各自の端末の中だけに残ります。',
  '体験課題で人を撮るときは、写る本人の同意を取り、学校や施設の決まりに従ってください。撮った素材を外へ公開する課題にはしていません。',
  '音楽や映像には権利があります。利用が許可された音源か、自分たちで出した音を使うよう伝えてください。',
  'ライトを目に向けない、転換の課題では走らない、「止まれ」の合図を先に決める、の3点を始める前に確認してください。',
  '総合ランクは学びのきっかけです。成績や評価には使わず、解説を読み直す動機として扱ってください。',
];

export default function TeacherGuide() {
  return (
    <main className="guide">
      <header className="guide-header">
        <p>{program.organizer.name}　{program.csr.label}{program.organizer.sample && '（サンプル表記）'}</p>
        <h1>先生・主催者の方へ</h1>
        <p className="guide-lead">「{program.title}」を授業やワークショップで使うための手引きです。準備は、参加者の端末とネットワークだけ。費用と登録は不要です。</p>
        <div className="guide-actions">
          <PrintButton />
          <Link href="/">体験サイトを開く</Link>
        </div>
      </header>

      <section>
        <h2>学びのねらい</h2>
        <ol>{program.learning.objectives.map((item) => <li key={item}>{item}</li>)}</ol>
        <dl className="guide-meta">
          <div><dt>対象</dt><dd>{program.learning.audience}</dd></div>
          <div><dt>時間</dt><dd>{program.learning.duration}</dd></div>
          <div><dt>参加</dt><dd>{program.learning.cost}</dd></div>
        </dl>
      </section>

      <section>
        <h2>50分の進行案</h2>
        <table>
          <thead><tr><th scope="col">時間</th><th scope="col">段階</th><th scope="col">進め方</th></tr></thead>
          <tbody>{lesson.map((item) => <tr key={item.name}><td>{item.time}</td><th scope="row">{item.name}</th><td>{item.text}</td></tr>)}</tbody>
        </table>
        <p className="guide-note">90分とれる場合は、話し合いのあとに「やってみよう」を1つ加えてください。教室で行いやすいのは、第1地点の「つながり」実験と、第4地点の30秒転換です。</p>
      </section>

      <section>
        <h2>5つの現場の要点</h2>
        <div className="guide-stages">
          {stages.map((item) => (
            <article key={item.id}>
              <h3><span>{item.number}</span>{item.name}<small>{item.role}</small></h3>
              <dl>
                <div><dt>ねらい</dt><dd>{item.objective}</dd></div>
                <div><dt>持ち帰る言葉</dt><dd>{item.keyword}</dd></div>
                <div><dt>話し合いの問い</dt><dd>{item.discussion}</dd></div>
                <div><dt>やってみよう</dt><dd><b>{item.tryIt.title}</b>　{item.tryIt.steps}<br />用意するもの：{item.tryIt.items}<br />気をつけること：{item.tryIt.care}</dd></div>
              </dl>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2>活用しやすい場面</h2>
        <ul>{scenes.map((item) => <li key={item}>{item}</li>)}</ul>
      </section>

      <section>
        <h2>配慮していただきたいこと</h2>
        <ul>{cares.map((item) => <li key={item}>{item}</li>)}</ul>
      </section>

      <footer className="guide-footer">
        <p>{program.csr.statement}</p>
        {program.organizer.contact && <p>お問い合わせ：<a href={program.organizer.contact}>{program.organizer.contact}</a></p>}
      </footer>
    </main>
  );
}
