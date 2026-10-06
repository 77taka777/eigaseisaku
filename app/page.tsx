'use client';

/* eslint-disable @next/next/no-img-element -- 透明PNGを直接配信し、軌道図内でも同じ輪郭と比率を保つため。 */

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { glossary } from '@/content/glossary';
import { program } from '@/content/program';
import { guides, pipeline, rankResults, selfCheck, stages } from '@/content/stages';
import { sendReport } from '@/lib/report';

const numerals = ['1', '2', '3'] as const;
const countLabels = ['0', '1', '2', '3', '4', '5'] as const;
const routeNames = ['one', 'two', 'three', 'four'] as const;
const scaleLabels = ['1', '2', '3', '4', '5'] as const;
const STORAGE_KEY = 'mirai-seisaku-roku:v2';

type Progress = {
  responses: Array<number | null>;
  before: number | null;
  after: number | null;
  interest: number | null;
  completedOn: string | null;
  reported: boolean;
};

const emptyProgress = (): Progress => ({
  responses: stages.map(() => null),
  before: null,
  after: null,
  interest: null,
  completedOn: null,
  reported: false,
});

const formatToday = () =>
  new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' });

const inRange = (value: unknown, max: number): value is number =>
  typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= max;

/** 端末に残した記録を読み込む。形が合わない値は捨てて、安全な初期値に戻す。 */
const readProgress = (): Progress | null => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as Partial<Progress>;
    if (!Array.isArray(data.responses) || data.responses.length !== stages.length) return null;
    return {
      responses: data.responses.map((value) => (inRange(value, 2) ? value : null)),
      before: inRange(data.before, 4) ? data.before : null,
      after: inRange(data.after, 4) ? data.after : null,
      interest: inRange(data.interest, 2) ? data.interest : null,
      completedOn: typeof data.completedOn === 'string' ? data.completedOn.slice(0, 20) : null,
      reported: data.reported === true,
    };
  } catch {
    return null;
  }
};

export default function Home() {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState<Progress>(emptyProgress);
  const [loaded, setLoaded] = useState(false);
  const [nickname, setNickname] = useState('');
  const { responses, before, after, interest, completedOn } = progress;

  // 端末に残した記録を、画面の表示後に読み込む（サーバー側の描画と食い違わないようにするため）。
  useEffect(() => {
    const saved = readProgress();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 保存済みの記録を初回だけ反映する。
    if (saved) setProgress(saved);
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // 保存できない環境でも、体験はそのまま続けられる。
    }
  }, [loaded, progress]);

  const stage = stages[current];
  const guide = guides[stage.guide];
  const answer = responses[current];
  const answeredCount = responses.filter((value) => value !== null).length;
  const correctCount = responses.reduce<number>((total, value, index) => total + (value === stages[index].correct ? 1 : 0), 0);
  const allAnswered = answeredCount === stages.length;
  const answeredLabel = countLabels[answeredCount];
  const correctLabel = countLabels[correctCount];
  const rankResult = rankResults[correctCount];

  const focusSection = (selector: string, block: 'start' | 'center' = 'start') => {
    window.setTimeout(() => {
      const target = document.querySelector<HTMLElement>(selector);
      target?.scrollIntoView({ behavior: 'smooth', block });
      target?.focus({ preventScroll: true });
    }, 70);
  };

  const chooseStage = (index: number, scroll = false) => {
    setCurrent(index);
    if (scroll) {
      focusSection('#map-title');
    }
  };

  const chooseAnswer = (index: number) => {
    const today = formatToday();
    setProgress((previous) => {
      const next = previous.responses.map((value, itemIndex) => (itemIndex === current ? index : value));
      const done = next.every((value) => value !== null);
      return { ...previous, responses: next, completedOn: done ? previous.completedOn ?? today : null };
    });
    window.setTimeout(() => document.querySelector('#answer')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 70);
  };

  /** ふり返りの2問がそろった時点で、匿名の結果を1度だけ送る（送信先が未設定なら何もしない）。 */
  const recordReflection = (nextAfter: number | null, nextInterest: number | null) => {
    const ready = allAnswered && nextAfter !== null && nextInterest !== null && !progress.reported;
    if (ready) {
      sendReport({
        completedAt: new Date().toISOString().slice(0, 10),
        correct: correctCount,
        total: stages.length,
        before: before === null ? null : before + 1,
        after: nextAfter + 1,
        interest: nextInterest,
      });
    }
    setProgress((previous) => ({ ...previous, after: nextAfter, interest: nextInterest, reported: previous.reported || ready }));
  };

  const moveNext = () => {
    if (allAnswered) {
      focusSection('#completion-title');
      return;
    }

    const nextUnanswered = stages
      .map((_, offset) => (current + offset + 1) % stages.length)
      .find((index) => responses[index] === null);

    if (nextUnanswered !== undefined) {
      setCurrent(nextUnanswered);
      focusSection('#question-title');
    }
  };

  const resetJourney = () => {
    setProgress(emptyProgress());
    setNickname('');
    setCurrent(0);
    focusSection('#map-title');
  };

  return (
    <main className="site" id="top" style={{ '--accent': stage.accent } as React.CSSProperties}>
      <header className="site-header">
        <a className="site-name" href="#top">未来制作録</a>
        <nav aria-label="ページ内メニュー">
          <a href="#crew">案内役</a>
          <a href="#map">制作軌道図</a>
          <a href="#question">5つの問い</a>
          <a href="#glossary">用語集</a>
        </nav>
        <a className="header-action" href="#map">軌道図へ</a>
      </header>

      <section className="hero" aria-labelledby="hero-title">
        <div className="star-field" aria-hidden="true" />
        <div className="time-lens" aria-hidden="true"><i /><i /><i /><i /></div>
        <div className="energy-trails" aria-hidden="true"><i /><i /><i /><i /><i /></div>
        <div className="horizon-grid" aria-hidden="true" />
        <div className="hero-copy">
          <p className="hero-organizer">
            <span>{program.organizer.name}</span>
            <b>{program.csr.label}</b>
            {program.organizer.sample && <i>サンプル表記</i>}
          </p>
          <p className="hero-kicker">映画と舞台の制作をめぐる5つの問い</p>
          <h1 className="cinema-title" id="hero-title">未来制作録</h1>
          <p className="hero-statement">物語が、<em>生まれる瞬間へ。</em></p>
          <p className="hero-lead">3人の制作スタッフとともに、撮影から編集まで5つの現場を巡ります。正しい判断を選び、未来へ残す現場の知恵を集めてください。</p>
          <a className="future-button" href="#crew"><span>案内役に会う</span><i aria-hidden="true">→</i></a>
        </div>
        <div className="hero-reel" aria-hidden="true">
          <span className="reel-ring" /><span className="reel-core" /><b>5</b><small>つの現場</small>
        </div>
      </section>

      <div className="signal-strip" aria-hidden="true">
        <span>撮影　・　照明　・　音響　・　舞台転換　・　編集　・　撮影　・　照明　・　音響　・　舞台転換　・　編集</span>
      </div>

      <section className="about" id="about" aria-labelledby="about-title">
        <div className="about-orbit" aria-hidden="true"><i /><i /></div>
        <div className="about-heading">
          <p>制作の舞台裏</p>
          <h2 id="about-title">スクリーンの向こうで、<br />未来は何度もつくり直される。</h2>
        </div>
        <div className="about-copy">
          <p>映画や舞台は、1度きりのひらめきで完成するものではありません。カメラの位置、光の変化、音を出す時機、安全な転換、素材の保全。担当する人たちが試し、記録し、情報をつなぐことで、まだ存在しない場面が形になります。</p>
          <p>軌道図から5つの現場を選び、制作現場を想定した問いに答えてください。選んだあとは、判断の理由、実際の手順、その仕事に就く道すじ、自分で試せる課題まで読めます。</p>
        </div>
      </section>


      <section className="learn-section" id="learn" aria-labelledby="learn-title">
        <div className="learn-heading">
          <p>このプログラムで学ぶこと</p>
          <h2 id="learn-title">観る側から、<br />つくる側の目へ。</h2>
          <dl className="learn-meta">
            <div><dt>対象</dt><dd>{program.learning.audience}</dd></div>
            <div><dt>時間</dt><dd>{program.learning.duration}</dd></div>
            <div><dt>参加</dt><dd>{program.learning.cost}</dd></div>
          </dl>
        </div>

        <ol className="learn-goals">
          {program.learning.objectives.map((item, index) => (
            <li key={item}><span>{numerals[index]}</span><p>{item}</p></li>
          ))}
        </ol>

        <div className="pipeline" aria-labelledby="pipeline-title">
          <h3 id="pipeline-title">作品ができるまで</h3>
          <p>このサイトで体験できるのは、光っている段階です。企画や宣伝など、ほかにも多くの仕事が作品を支えています。</p>
          <ol>
            {pipeline.map((phase) => {
              const linked = stages.map((item, index) => ({ item, index })).filter(({ item }) => item.phase === phase.id);
              return (
                <li className={linked.length > 0 ? 'live' : undefined} key={phase.id}>
                  <b>{phase.name}</b>
                  <p>{phase.text}</p>
                  <small>{phase.roles}</small>
                  {linked.length > 0 && (
                    <div>
                      {linked.map(({ item, index }) => (
                        <button type="button" key={item.id} onClick={() => chooseStage(index, true)}>{item.shortName}</button>
                      ))}
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </div>

        <div className="self-check" role="group" aria-labelledby="before-title">
          <p>はじめる前に</p>
          <h3 id="before-title">{selfCheck.question}</h3>
          <div className="scale">
            {selfCheck.scale.map((label, index) => (
              <button
                type="button"
                key={label}
                className={before === index ? 'selected' : undefined}
                aria-pressed={before === index}
                onClick={() => setProgress((previous) => ({ ...previous, before: index }))}
              >
                <span>{scaleLabels[index]}</span><small>{label}</small>
              </button>
            ))}
          </div>
          <small>答えなくても進めます。最後にもう1度たずねるので、自分の変化をくらべられます。</small>
        </div>
      </section>

      <section className="crew-section" id="crew" aria-labelledby="crew-title">
        <div className="section-heading">
          <p>未来制作クルー</p>
          <h2 id="crew-title">3人の案内役。</h2>
          <span>キャラクターを選ぶと、担当する最初の現場へ移動します。</span>
        </div>
        <div className="crew-grid">
          {guides.map((item, index) => (
            <button
              className={stage.guide === index ? 'crew-card active' : 'crew-card'}
              type="button"
              key={item.id}
              onClick={() => chooseStage(item.firstStage, true)}
              style={{ '--guide-accent': item.accent } as React.CSSProperties}
            >
              <span className="crew-halo" aria-hidden="true" />
              <img src={item.figure} alt={`${item.role}の${item.name}`} width={1024} height={1536} loading="lazy" decoding="async" />
              <span className="crew-copy"><small>{item.role}</small><b>{item.name}</b><i>{item.message}</i></span>
            </button>
          ))}
        </div>
      </section>

      <section className="map-section" id="map" aria-labelledby="map-title">
        <div className="map-heading">
          <div><p>制作軌道図</p><h2 id="map-title" tabIndex={-1}>5つの現場を巡る。</h2></div>
          <div className={`map-progress${allAnswered ? ' complete' : ''}`}>
            <span>{allAnswered ? '全地点の回答完了' : '回答した現場'}</span>
            <b>{answeredLabel}／5</b>
            <progress value={answeredCount} max={stages.length} aria-label={`回答進捗、全5問中${answeredLabel}問を回答済み`} />
          </div>
        </div>

        <span className="sr-only" aria-live="polite">全5問中{answeredLabel}問を回答済み。判断成功は{correctLabel}問です。</span>

        <p className="map-swipe-hint">横に動かして5つの現場を見る<span aria-hidden="true">→</span></p>

        <div className="map-scroll" aria-label="横に動かして制作軌道図を見る">
          <div className={`studio-map${allAnswered ? ' complete' : ''}`}>
            <div className="map-stars" aria-hidden="true" />
            <div className="map-grid" aria-hidden="true" />
            <div className="map-skyline" aria-hidden="true"><i /><i /><i /><i /><i /></div>
            {routeNames.map((routeName, index) => (
              <div
                className={`route-line route-${routeName}${responses[index] !== null && responses[index + 1] !== null ? ' connected' : ''}`}
                aria-hidden="true"
                key={routeName}
              />
            ))}

            {stages.map((item, index) => {
              const nodeAnswer = responses[index];
              const nodeStatus = nodeAnswer === null ? '未回答' : nodeAnswer === item.correct ? '判断成功' : '要確認';
              const nodeState = nodeAnswer === null ? '' : nodeAnswer === item.correct ? ' correct-state' : ' review-state';

              return (
                <button
                  type="button"
                  key={item.id}
                  className={`map-node${current === index ? ' active' : ''}${nodeAnswer !== null ? ' visited' : ''}${nodeState}`}
                  onClick={() => chooseStage(index)}
                  aria-label={`${item.number}、${item.name}、${nodeStatus}`}
                  aria-current={current === index ? 'step' : undefined}
                  style={{ '--node-x': `${item.x}%`, '--node-y': `${item.y}%`, '--node-color': item.accent } as React.CSSProperties}
                >
                  <span>{item.number}</span><b>{item.shortName}</b><small>{nodeStatus}</small>
                </button>
              );
            })}

            <div
              className="map-avatar"
              style={{ '--avatar-x': `${stage.x}%`, '--avatar-y': `${stage.y}%`, '--avatar-color': guide.accent } as React.CSSProperties}
              aria-hidden="true"
            >
              <span><img src={guide.figure} alt="" width={1024} height={1536} loading="lazy" decoding="async" /></span>
            </div>
          </div>
        </div>

        <article className="map-brief" key={stage.id}>
          <div className="brief-character"><span aria-hidden="true" /><img src={guide.figure} alt={`${guide.name}の全身像`} width={1024} height={1536} loading="lazy" decoding="async" /></div>
          <div className="brief-copy">
            <p className="role-label">第{stage.number}地点　案内役：{guide.name}</p>
            <h3>{stage.name}</h3>
            <p className="role-summary">{stage.summary}</p>
            <p className="stage-objective"><b>この地点のねらい</b>{stage.objective}</p>
            <dl>
              <div><dt>今回の担当</dt><dd>{stage.role}</dd></div>
              <div><dt>受け持つこと</dt><dd>{stage.responsibility}</dd></div>
              <div><dt>主な道具</dt><dd>{stage.tool}</dd></div>
            </dl>
            <a className="future-button" href="#question"><span>この問いに挑む</span><i aria-hidden="true">↓</i></a>
          </div>
        </article>
      </section>

      <section className="question-section" id="question" aria-labelledby="question-title">
        <div className="question-grid" aria-hidden="true" />
        <div className="question-header">
          <div><p>現場からの問い</p><h2 id="question-title" tabIndex={-1}>{stage.name}</h2></div>
          <span>第{stage.number}問／全5問</span>
        </div>

        <div className="question-card" key={stage.id}>
          <div className="scan-line" aria-hidden="true" />
          <div className="question-guide"><img src={guide.figure} alt="" width={1024} height={1536} loading="lazy" decoding="async" /><span>{guide.name}からの問い</span></div>
          <p className="question-label">判断してください</p>
          <h3>{stage.question}</h3>
          <div className="answer-list" aria-label="答えを選ぶ">
            {stage.answers.map((choice, index) => {
              const chosen = answer === index;
              const state = chosen ? (index === stage.correct ? ' correct' : ' incorrect') : '';
              return (
                <button type="button" className={`answer-choice${state}`} key={choice} onClick={() => chooseAnswer(index)} aria-pressed={chosen}>
                  <span>{numerals[index]}</span><b>{choice}</b><i aria-hidden="true">→</i>
                </button>
              );
            })}
          </div>
        </div>

        {answer !== null && (
          <div className="answer-note" id="answer" aria-live="polite">
            <div className="answer-state">
              <span>{answer === stage.correct ? '判断成功' : '別の判断を確認しよう'}</span>
              <b>{stage.reactions[answer]}</b>
            </div>
            <div className="field-note">
              <p>未来へ残す現場の知恵</p>
              <h3>{stage.keyword}</h3>
              {answer !== stage.correct && <p className="correct-choice">適切な判断は「{stage.answers[stage.correct]}」です。</p>}
              <p className="why-copy">{stage.why}</p>
              <div className="detail-grid">
                <section><h4>現場では、こう動く</h4><p>{stage.detail}</p></section>
                <section><h4>確認する3つの要点</h4><ul>{stage.checkpoints.map((item) => <li key={item}>{item}</li>)}</ul></section>
              </div>

              <div className="learn-extra">
                <section className="career-card">
                  <p>この仕事を知る</p>
                  <h4>{stage.role}</h4>
                  <dl>
                    <div><dt>どんな仕事</dt><dd>{stage.career.work}</dd></div>
                    <div><dt>向いている人</dt><dd>{stage.career.fit}</dd></div>
                    <div><dt>なるには</dt><dd>{stage.career.path}</dd></div>
                  </dl>
                </section>

                {stage.staffVoice && (
                  <figure className="staff-voice">
                    <figcaption><b>現場の声</b>{stage.staffVoice.title}　{stage.staffVoice.name}</figcaption>
                    <blockquote>{stage.staffVoice.text}</blockquote>
                  </figure>
                )}

                <section className="try-card">
                  <p>やってみよう</p>
                  <h4>{stage.tryIt.title}</h4>
                  <p>{stage.tryIt.steps}</p>
                  <dl>
                    <div><dt>用意するもの</dt><dd>{stage.tryIt.items}</dd></div>
                    <div><dt>気をつけること</dt><dd>{stage.tryIt.care}</dd></div>
                  </dl>
                </section>

                <section className="talk-card">
                  <p>話し合いの問い</p>
                  <h4>{stage.discussion}</h4>
                </section>
              </div>
            </div>
            <button type="button" onClick={moveNext}>{allAnswered ? '完成した軌道を見る' : '次の未回答地点へ'}<span aria-hidden="true">→</span></button>
          </div>
        )}
      </section>

      {allAnswered && (
        <section className="completion-section" id="completion" aria-labelledby="completion-title">
          <div className="completion-orbit" aria-hidden="true"><i /><i /><i /><i /><i /></div>
          <div className="completion-copy">
            <p>制作記録　同期完了</p>
            <h2 id="completion-title" tabIndex={-1}>5つの時間が、<br />1つにつながった。</h2>
            <p className="completion-lead">5つの現場で得た知恵が、1つの制作記録になりました。判断に迷った地点も、軌道図から何度でも詳しい解説を見直せます。</p>

            <div className="completion-rank" data-rank={rankResult.rank} aria-label={`総合ランク${rankResult.rank}、${rankResult.title}`}>
              <span className="rank-badge"><small>総合ランク</small><b>{rankResult.rank}</b></span>
              <div className="rank-copy"><p>あなたの制作称号</p><h3>{rankResult.title}</h3><p>{rankResult.message}</p></div>
            </div>

            <div className="completion-score" aria-label="今回の結果">
              <span><small>回答した現場</small><b>5／5</b></span>
              <span><small>判断成功</small><b>{correctLabel}／5</b></span>
            </div>

            <ul className="completion-keywords" aria-label="集めた現場の知恵">
              {stages.map((item) => <li key={item.id}><span>{item.number}</span>{item.keyword}</li>)}
            </ul>

            <div className="reflection" role="group" aria-labelledby="after-title">
              <p>ふり返り</p>
              <h3 id="after-title">{selfCheck.postQuestion}</h3>
              <div className="scale">
                {selfCheck.scale.map((label, index) => (
                  <button
                    type="button"
                    key={label}
                    className={after === index ? 'selected' : undefined}
                    aria-pressed={after === index}
                    onClick={() => recordReflection(index, interest)}
                  >
                    <span>{scaleLabels[index]}</span><small>{label}</small>
                  </button>
                ))}
              </div>
              {before !== null && after !== null && (
                <p className="growth" aria-live="polite">
                  はじめ <b>{scaleLabels[before]}</b><i aria-hidden="true">→</i>いま <b>{scaleLabels[after]}</b>
                  <span>{after > before ? '知っていることが増えました。' : after === before ? '知っていることを、確かめ直せました。' : '知らないことの広さに気づけたのも、大きな1歩です。'}</span>
                </p>
              )}
              <h3>{selfCheck.interestQuestion}</h3>
              <div className="interest">
                {selfCheck.interest.map((label, index) => (
                  <button
                    type="button"
                    key={label}
                    className={interest === index ? 'selected' : undefined}
                    aria-pressed={interest === index}
                    onClick={() => recordReflection(after, index)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="completion-actions">
              <a href="#map">軌道図で回答を見直す<span aria-hidden="true">↑</span></a>
              <button type="button" onClick={resetJourney}>回答を消して最初から挑戦<span aria-hidden="true">↻</span></button>
            </div>
          </div>

          <div className="completion-crew" aria-label="3人の案内役">
            <span aria-hidden="true" />
            {guides.map((item) => (
              <img src={item.figure} alt={`${item.name}、${item.role}`} width={1024} height={1536} loading="lazy" decoding="async" key={item.id} />
            ))}
          </div>
        </section>
      )}


      {allAnswered && program.certificate.enabled && (
        <section className="certificate-section" id="certificate" aria-labelledby="certificate-title">
          <div className="certificate-tools">
            <p>学びの記録を持ち帰る</p>
            <h2 id="certificate-title">修了証をつくる。</h2>
            <label htmlFor="nickname">修了証に入れる名前（ニックネームで大丈夫です）</label>
            <input
              id="nickname"
              type="text"
              value={nickname}
              maxLength={20}
              autoComplete="off"
              placeholder="例：みらい"
              onChange={(event) => setNickname(event.target.value)}
            />
            <small>入力した名前は保存も送信もされません。印刷するか、画面を保存してお使いください。</small>
            <button type="button" className="future-button" onClick={() => window.print()}><span>修了証を印刷する</span><i aria-hidden="true">→</i></button>
          </div>

          <article className="certificate" aria-label="修了証の見本">
            <p className="certificate-program">{program.title}　{program.csr.label}</p>
            <h3>{program.certificate.heading}</h3>
            <p className="certificate-name">{nickname.trim() || '　'}<span>さん</span></p>
            <p className="certificate-body">{program.certificate.body}</p>
            <p className="certificate-rank"><small>制作称号</small><b>{rankResult.title}</b></p>
            <ul>{stages.map((item) => <li key={item.id}>{item.keyword}</li>)}</ul>
            <p className="certificate-foot">
              <span>{completedOn}</span>
              <span>{program.organizer.name}{program.organizer.sample && '（サンプル表記）'}</span>
            </p>
          </article>
        </section>
      )}

      <section className="glossary-section" id="glossary" aria-labelledby="glossary-title">
        <div className="section-heading">
          <p>現場のことば</p>
          <h2 id="glossary-title">用語集。</h2>
          <span>問いと解説に出てくる言葉を、読みがなつきでまとめました。</span>
        </div>
        <dl className="glossary-list">
          {glossary.map((item) => (
            <div key={item.term}>
              <dt>{item.reading ? <ruby>{item.term}<rt>{item.reading}</rt></ruby> : item.term}</dt>
              <dd>{item.text}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="closing" aria-labelledby="closing-title">
        <div className="closing-flare" aria-hidden="true" />
        <p>物語を未来へ送るために</p>
        <h2 id="closing-title">つくる仕事は、<br />時間をつなぐ仕事。</h2>
        <div>
          <p>撮影、照明、音響、舞台転換、編集。それぞれの専門が情報を渡し合い、同じ瞬間を目指すことで、映画や舞台は観客のもとへ届きます。</p>
          <a href="#top">最初の時間へ戻る<span aria-hidden="true">↑</span></a>
        </div>
      </section>

      <footer className="csr-footer">
        <div className="csr-brand">
          <p className="csr-title">{program.title}</p>
          <p className="csr-organizer">
            {program.organizer.name}　{program.organizer.department}
            {program.organizer.sample && <i>サンプル表記</i>}
          </p>
          <p className="csr-label">{program.csr.label}</p>
        </div>
        <div className="csr-info">
          <p>{program.csr.statement}</p>
          <p>{program.privacy}</p>
          {program.supervisors.length > 0 && (
            <p>監修：{program.supervisors.map((item) => `${item.role}　${item.name}`).join('／')}</p>
          )}
        </div>
        <nav className="csr-links" aria-label="関連ページ">
          <Link href="/teacher">先生・主催者の方へ<span aria-hidden="true">→</span></Link>
          {program.organizer.url && <a href={program.organizer.url} rel="noopener">社会貢献活動について<span aria-hidden="true">→</span></a>}
          {program.organizer.contact && <a href={program.organizer.contact}>お問い合わせ<span aria-hidden="true">→</span></a>}
        </nav>
      </footer>
    </main>
  );
}
