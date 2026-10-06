'use client';

/* eslint-disable @next/next/no-img-element -- 透明PNGを直接配信し、軌道図内でも同じ輪郭と比率を保つため。 */

import { useState } from 'react';

const guides = [
  {
    id: 'director',
    name: 'レン',
    role: '映像ディレクター',
    figure: '/assets/crew/future-director.png',
    accent: '#ff5538',
    message: '画面の前後を読み、物語の時間をつなぐ案内役。',
    firstStage: 0,
  },
  {
    id: 'lighting',
    name: 'アカリ',
    role: '照明プランナー',
    figure: '/assets/crew/future-lighting.png',
    accent: '#ffc64a',
    message: '光の向きと色から、場面の温度を設計する案内役。',
    firstStage: 1,
  },
  {
    id: 'sound',
    name: 'ソウ',
    role: '音響・進行担当',
    figure: '/assets/crew/future-sound.png',
    accent: '#42d9ff',
    message: '声、音、合図をそろえ、本番の流れを守る案内役。',
    firstStage: 2,
  },
] as const;

const stages = [
  {
    id: 'shooting',
    number: '1',
    name: '撮影スタジオ',
    shortName: '撮影',
    role: '撮影監督',
    guide: 0,
    accent: '#ff5538',
    x: 11,
    y: 72,
    summary: '違う時間に撮った映像を、1つの場面へつなぐ。',
    responsibility: '画面設計と撮影の進行',
    tool: 'カメラ、絵コンテ、記録表',
    question: '昼食の会話を、午後に別の角度から撮ります。俳優の演技は少し良くなり、コーヒーカップの量だけが午前のテイクと違います。限られた時間で、まずどの判断を共有しますか？',
    answers: [
      '演技が良ければ小道具の状態は気にせず、そのまま撮る',
      'つながる可能性のあるカットを確認し、動き・視線・小道具の状態を記録と照合する',
      '編集担当が気づいたときに、CGで直せるか検討する',
    ],
    correct: 1,
    reactions: [
      '演技の良さは大切ですが、つながるカットでは小道具の変化が観客の注意を奪うことがあります。',
      '演技の意図と画面のつながりを両方守るために、記録をもとに関係者で調整できます。',
      '後工程で直せる場合もありますが、追加費用や時間が必要です。撮影時の確認が最初の選択です。',
    ],
    keyword: 'つながりの管理',
    why: '映画の場面は、台本の順番どおりに撮るとは限りません。同じ数秒の会話でも、俳優ごとの寄り、全体、手元などを別々の時刻に撮影します。そのため、前のテイクの状態を記録して再現しなければ、編集した瞬間に動きや物の位置が飛んで見えます。',
    detail: '現場では、担当者が台本へ動作を書き込み、衣装、小道具、飲み物の量、髪の乱れ、照明の向きまで写真と文章で残します。次の画角を撮る前に、その記録と直前の映像を照合します。演技を縛るためではなく、俳優が安心して同じ時間を再現できるようにする仕組みです。',
    checkpoints: ['俳優の立ち位置と視線', '衣装・髪・小道具の状態', '動作を始める言葉と終える位置'],
    caseStudy: {
      title: '公開資料から：記録は部門をまたぐ共通言語',
      body: 'アカデミーの衣装デザイン教材では、衣装監督が脚本を連続性の観点で分解し、衣装の記録を監督・美術・俳優・ヘアメイクと共有する役割を紹介しています。細部の記録は、演技を縛るためではなく、複数の部門が同じ場面を再現するための土台です。',
      sourceLabel: 'Academyの教材を読む（英語）',
      sourceUrl: 'https://www.oscars.org/sites/oscars/files/teachersguide-costumedesign-2015.pdf',
    },
  },
  {
    id: 'lighting',
    number: '2',
    name: '照明リハーサル室',
    shortName: '照明',
    role: '照明プランナー',
    guide: 1,
    accent: '#ffc64a',
    x: 30,
    y: 34,
    summary: '光の変化で、舞台の時間と感情を動かす。',
    responsibility: '光の設計と合図の管理',
    tool: '照明卓、仕込み図、台本',
    question: '窓からの夕方の光に見える場面です。雲で外光が変わり、撮影時間も残り少ない状況。画の雰囲気と次のカットとのつながりを守るため、どの進め方が最も適切でしょう？',
    answers: [
      'その瞬間に一番きれいに見える自然光だけで、すぐ撮り切る',
      '求める光の方向・明るさ・色を共有し、必要なら再現できるようテストと記録をして撮る',
      '画面の全域を均一に明るくして、露出だけを安定させる',
    ],
    correct: 1,
    reactions: [
      '自然光の偶然性は魅力になりますが、別テイクや別画角とつながらない場合があります。',
      '物語に必要な光を言葉とテストで共有すれば、時間や天候が変わっても意図を保てます。',
      '技術的には安定しても、場面の焦点や時間帯の印象が薄くなることがあります。',
    ],
    keyword: '照明の合図',
    why: '舞台照明は、明るく見せるだけの仕事ではありません。俳優がどこへ動き、どのせりふで空気が変わるかを読み、光の方向、色、強さ、変化にかける時間を1つの流れとして設計します。',
    detail: '照明卓には、変化の組み合わせを番号ごとに記録できます。リハーサルでは舞台監督の合図を受け、俳優の速度や立ち位置と照明の変化が合うかを繰り返し確認します。急な変更があっても、全員が同じ番号を共有していれば、安全に修正できます。',
    checkpoints: ['俳優が光へ入る位置', '色と明るさを変える秒数', '舞台監督が出す合図の番号'],
    caseStudy: {
      title: '実例：『Barry Lyndon』（1975）の光づくり',
      body: '撮影監督ジョン・オルコットは、時代の室内光を感じさせるため、自然光を観察して再現し、必要に応じて撮影可能な明るさへ調整したと語っています。狙う印象を先に定め、テストして再現可能にする考え方の実例です。',
      sourceLabel: 'American Cinematographerの記事を読む（英語）',
      sourceUrl: 'https://theasc.com/article/flashback-barry-lyndon/',
    },
  },
  {
    id: 'sound',
    number: '3',
    name: '音響管制室',
    shortName: '音響',
    role: '音響・進行担当',
    guide: 2,
    accent: '#42d9ff',
    x: 50,
    y: 64,
    summary: '声、効果音、音楽を正しい順序で届ける。',
    responsibility: '音の設計と本番進行',
    tool: '音響卓、マイク、進行表',
    question: '俳優の小さなせりふ、ドアの効果音、次の場面の音楽が重なります。監督は「臨場感を残したい」と言い、撮影時間は限られています。最初にチームで決めるべきことは何でしょう？',
    answers: [
      '現場の空気感を優先し、音の役割分担は編集で決める',
      '現場で確実に収録する音、後で作る音、各音の合図と確認方法を進行表で共有する',
      '全てを同じ音量で収録し、聞き取りやすさは後で自動補正する',
    ],
    correct: 1,
    reactions: [
      '後工程の工夫は有効ですが、撮り直せないせりふや演技まで不確かにしてはいけません。',
      '現場収録と後処理の役割を先に決めることで、演技・進行・仕上げの全員が判断しやすくなります。',
      '音量をそろえるだけでは、せりふを守る優先順位やタイミングは決まりません。',
    ],
    keyword: '音の進行表',
    why: '本番では、音響だけが単独で動くわけではありません。効果音をきっかけに俳優が振り向き、音楽を合図に大道具が動くこともあります。誰が、どの言葉や動作を受けて音を出すかを事前に共有する必要があります。',
    detail: '進行表には、音源名、再生位置、音量、入り方、止め方、合図を記します。さらに本番前には、マイクの電池、予備音源、配線、客席での聞こえ方まで確認します。異常が起きたときに止める判断と、代わりの手段も決めておきます。',
    checkpoints: ['音を出すきっかけとなる言葉や動作', 'マイクと予備音源の状態', '舞台転換と干渉しない音量'],
    caseStudy: {
      title: '実例：『Maestro』（2023）の6分間ワンテイク',
      body: 'アカデミーの取材によると、イーリー大聖堂でロンドン交響楽団と合唱団を迎えた演奏場面は、6分間のワンテイクとして撮影されました。演奏・演技・録音のどれを現場で成立させるかを、撮影前からチームで整える必要があります。',
      sourceLabel: 'Academyの音響チーム取材を読む（英語）',
      sourceUrl: 'https://newsletter.oscars.org/features/maestro-sound-team-interview',
    },
  },
  {
    id: 'changeover',
    number: '4',
    name: '舞台転換ヤード',
    shortName: '転換',
    role: '舞台進行担当',
    guide: 2,
    accent: '#b688ff',
    x: 70,
    y: 30,
    summary: '暗い舞台で、人と大道具の動線を安全につなぐ。',
    responsibility: '転換手順と安全の管理',
    tool: '転換表、蓄光印、連絡装置',
    question: '暗転中に大きな装置を入れ替えます。演出上は10秒短くしたい一方、初回リハーサルでは通路が交差しました。次の判断として最も適切なのはどれでしょう？',
    answers: [
      '経験のあるスタッフに任せ、通路は当日その場で調整する',
      '転換の順番・通路・停止合図を固定し、明るい状態から安全に検証してから短縮を検討する',
      '演出のテンポを優先して、装置の移動人数を減らして走る',
    ],
    correct: 1,
    reactions: [
      '経験は大切ですが、暗転中の交差を個人の判断に任せると、再現性と安全性が下がります。',
      '安全な手順を確立してから時間を削ることで、演出意図と人の安全を両立できます。',
      '人数を減らす選択が有効な場合もありますが、検証なしに急ぐと負荷と危険が偏ります。',
    ],
    keyword: '転換表と安全確認',
    why: '暗転は観客から舞台が見えにくく、その反面、作業する側にも視界が少ない時間です。速さより先に、誰が何を持ち、どの経路を通り、どこで待つかを固定しなければなりません。',
    detail: '最初は作業灯をつけ、歩く速度で順番と干渉を確認します。次に明るさを落とし、蓄光印や小さな案内灯だけで同じ動きができるかを試します。装置が重い場合は、止める人と周囲を監視する人を分け、異常時に全員が止まる共通の合図も決めます。',
    checkpoints: ['人と装置の通路が交差しないこと', '暗くても見える停止位置', '異常時に全員が止まる共通合図'],
    caseStudy: {
      title: '現場で使う考え方：安全は「速さ」の前提',
      body: '転換の内容は作品ごとに異なります。だからこそ、危険が出やすい通路・重量・視界・停止合図を先に共有し、明るい状態で検証します。安全な手順が決まって初めて、演出上のテンポを改善する相談ができます。',
      sourceLabel: 'この教材での読み替え',
      sourceUrl: '#question',
    },
  },
  {
    id: 'editing',
    number: '5',
    name: '編集・保全室',
    shortName: '編集',
    role: '編集・データ担当',
    guide: 0,
    accent: '#75a8ff',
    x: 89,
    y: 62,
    summary: '撮影した時間を整理し、失わず、完成形へ導く。',
    responsibility: '素材の同期・整理・保全',
    tool: '編集機、記録媒体、照合表',
    question: '撮影最終日に、映像と別録り音声を受け取りました。急いで編集へ渡したい一方、カードは返却期限が迫っています。同期と保全の両方を守るには、どの順番で進めますか？',
    answers: [
      'まず編集を始め、バックアップは作品が完成してからまとめて作る',
      '取り込みと再生を確認し、同期の手がかりと命名規則を整えて、別の場所にも検証済みの複製を置く',
      '元カードを保管し、作業用のコピーは1台だけにして混乱を防ぐ',
    ],
    correct: 1,
    reactions: [
      '編集開始を急ぐほど、元データの確認と保全を先に済ませる価値が高まります。',
      '急ぐ場面でも、確認・整理・検証済みの複製を一連の作業として扱えば、次の担当へ安全に渡せます。',
      '整理は必要ですが、1台だけでは故障・紛失・誤操作に耐えられません。',
    ],
    keyword: '同期と2重化',
    why: '映像と音声は別々の時計で動くため、同じ瞬間を示す共通の手がかりが必要です。また、撮り直せない演技や公演記録は、1台の媒体へ置くだけでは安全とはいえません。',
    detail: '撮影開始時のカチンコや共通の時刻情報を手がかりに映像と音を合わせ、作品名、日付、場面、テイクが分かる規則で整理します。取り込み後は容量と再生を照合し、作業用と保全用を別の媒体へ保存します。複製は「作った」だけでなく、開けることまで確認して初めて完了です。',
    checkpoints: ['映像と音に共通する同期の手がかり', '誰が見ても分かる名前と整理規則', '物理的に離れた2か所以上の複製'],
    caseStudy: {
      title: '公開資料から：制作記録は作品の未来にも残る',
      body: 'アカデミーのコレクションには、脚本、絵コンテ、撮影記録、デジタルファイルなど制作の過程を示す資料が収蔵されています。日々の命名と保全は編集のためだけでなく、後から制作を振り返るための記録にもなります。',
      sourceLabel: 'Academy Collectionsを読む（英語）',
      sourceUrl: 'https://www.oscars.org/library/collections',
    },
  },
] as const;

const confirmationTest = [
  {
    question: '撮影・照明・音響の担当が「急いでいるから、細かい共有は後で」と言っています。最初に確認するべきことは何でしょう？',
    choices: ['各担当が自分の作業を先に終え、最後にまとめて確認する', '作品に必要な状態、合図、記録の担当を短くても同じ言葉でそろえる', '一番経験のある人の記憶だけを基準に進める'],
    answer: 1,
    trap: 2,
    why: '現場の専門は異なっても、次の担当へ渡す情報は共通です。完璧な会議より、何を誰がいつ確認するかを先にそろえることが、手戻りを減らします。',
    trapNote: '経験は重要ですが、個人の記憶だけでは引き継ぎや再現が難しくなります。',
  },
  {
    question: '演出上のテンポを上げるため、準備時間を削る提案が出ました。制作チームの判断として最もよいものはどれでしょう？',
    choices: ['安全と品質の確認点を保ったうえで、手順を試し、短縮できる部分を検証する', '本番で一度だけ試し、うまくいかなければ次回から元に戻す', '安全担当の確認は後にして、観客に見える部分だけ先に仕上げる'],
    answer: 0,
    trap: 1,
    why: '速さは目的ではなく、作品を確実に届けるための工夫です。止める基準や安全確認を残したまま、リハーサルで改善を試します。',
    trapNote: '本番は検証の場ではありません。失敗を前提にした進め方は、人と作品の両方を危険にさらします。',
  },
  {
    question: '素材を次の担当へ渡す直前に、再生できるコピーが1つだけできました。納期を考えるとどうしますか？',
    choices: ['まず渡して作業を始めてもらい、複製は空いた時間に作る', 'ファイル名だけを変え、元カードを返却して完了にする', '再生確認できる複製を別の場所にも置き、何を渡したか記録してから引き継ぐ'],
    answer: 2,
    trap: 0,
    why: 'データは一度失うと撮り直せないことがあります。引き継ぎ前の確認と複製は、納期を守るための作業でもあります。',
    trapNote: '早く動き出すことは魅力的ですが、唯一のコピーを渡す状態では、故障や誤操作に備えられません。',
  },
] as const;

const numerals = ['1', '2', '3'] as const;
const countLabels = ['0', '1', '2', '3', '4', '5'] as const;
const routeNames = ['one', 'two', 'three', 'four'] as const;
const rankResults = [
  {
    rank: 'E',
    title: '開幕を待つ見習いクルー',
    message: '今回は準備回。解説を手がかりにもう1度挑めば、次の合図がきっと見つかります。',
  },
  {
    rank: 'D',
    title: '最初の合図をつかんだ新人',
    message: '1つの確かな判断が、舞台裏を知る大事な最初の1歩になりました。',
  },
  {
    rank: 'C',
    title: '伸び盛りのアシスタント',
    message: '2つの大切な判断をつかみ、次のリハーサルでさらに腕を磨けます。',
  },
  {
    rank: 'B',
    title: '息の合った制作クルー',
    message: '現場の要所をしっかり押さえ、作品づくりの流れが見えてきました。',
  },
  {
    rank: 'A',
    title: '本番を支えるチーフクルー',
    message: 'ほぼすべての合図を的確につかみ、チームを頼もしく導ける判断力です。',
  },
  {
    rank: 'S',
    title: '未来をつなぐ総合演出家',
    message: 'すべての現場判断が見事にそろい、物語を最高の形で未来へ送り出しました。',
  },
] as const;

export default function Home() {
  const [current, setCurrent] = useState(0);
  const [responses, setResponses] = useState<Array<number | null>>(() => stages.map(() => null));
  const [checkAnswers, setCheckAnswers] = useState<Array<number | null>>(() => confirmationTest.map(() => null));
  const stage = stages[current];
  const guide = guides[stage.guide];
  const answer = responses[current];
  const answeredCount = responses.filter((value) => value !== null).length;
  const correctCount = responses.reduce<number>((total, value, index) => total + (value === stages[index].correct ? 1 : 0), 0);
  const allAnswered = answeredCount === stages.length;
  const answeredLabel = countLabels[answeredCount];
  const correctLabel = countLabels[correctCount];
  const rankResult = rankResults[correctCount];
  const checkedCount = checkAnswers.filter((value) => value !== null).length;
  const checkCorrectCount = checkAnswers.reduce<number>((total, value, index) => total + (value === confirmationTest[index].answer ? 1 : 0), 0);
  const allChecksAnswered = checkedCount === confirmationTest.length;

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
    if (responses[current] !== null) return;
    setResponses((previous) => previous.map((value, itemIndex) => (itemIndex === current ? index : value)));
    window.setTimeout(() => document.querySelector('#answer')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 70);
  };

  const chooseCheckAnswer = (questionIndex: number, choiceIndex: number) => {
    if (checkAnswers[questionIndex] !== null) return;
    setCheckAnswers((previous) => previous.map((value, index) => (index === questionIndex ? choiceIndex : value)));
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
    setResponses(stages.map(() => null));
    setCheckAnswers(confirmationTest.map(() => null));
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
        </nav>
        <a className="header-action" href="#map">軌道図へ</a>
      </header>

      <section className="hero" aria-labelledby="hero-title">
        <div className="star-field" aria-hidden="true" />
        <div className="time-lens" aria-hidden="true"><i /><i /><i /><i /></div>
        <div className="energy-trails" aria-hidden="true"><i /><i /><i /><i /><i /></div>
        <div className="horizon-grid" aria-hidden="true" />
        <div className="hero-copy">
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
          <p>軌道図から5つの現場を選び、制作現場を想定した問いに答えてください。選んだあとは、理由、実際の手順、確認項目まで詳しく読めます。</p>
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
                <button type="button" className={`answer-choice${state}`} key={choice} onClick={() => chooseAnswer(index)} aria-pressed={chosen} disabled={answer !== null}>
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
              <aside className="case-study">
                <p>実例を手がかりに考える</p>
                <h4>{stage.caseStudy.title}</h4>
                <p>{stage.caseStudy.body}</p>
                <a href={stage.caseStudy.sourceUrl} target={stage.caseStudy.sourceUrl.startsWith('http') ? '_blank' : undefined} rel={stage.caseStudy.sourceUrl.startsWith('http') ? 'noreferrer' : undefined}>{stage.caseStudy.sourceLabel}<span aria-hidden="true">↗</span></a>
              </aside>
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

            <div className="completion-actions">
              <a href="#map">軌道図で回答を見直す<span aria-hidden="true">↑</span></a>
              <a href="#confirmation">確認テストを受ける<span aria-hidden="true">↓</span></a>
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

      {allAnswered && (
        <section className="confirmation-section" id="confirmation" aria-labelledby="confirmation-title">
          <div className="confirmation-heading">
            <p>仕上げの確認テスト</p>
            <h2 id="confirmation-title">制作の判断を、<br />自分の言葉で確かめる。</h2>
            <span>全3問　答えは一度だけ選べます</span>
          </div>
          <p className="confirmation-lead">現場ごとの知識ではなく、引き継ぎ・安全・保全という共通の考え方を確かめます。正解は唯一の手法を示すものではなく、この教材で優先する判断基準です。</p>

          <div className="confirmation-list">
            {confirmationTest.map((item, questionIndex) => {
              const chosen = checkAnswers[questionIndex];
              return (
                <article className="check-card" key={item.question}>
                  <p>確認 {questionIndex + 1}／{confirmationTest.length}</p>
                  <h3>{item.question}</h3>
                  <div className="check-choices" aria-label={`確認テスト${questionIndex + 1}の答えを選ぶ`}>
                    {item.choices.map((choice, choiceIndex) => {
                      const state = chosen === choiceIndex ? (choiceIndex === item.answer ? ' correct' : ' incorrect') : '';
                      return <button type="button" key={choice} className={`check-choice${state}`} onClick={() => chooseCheckAnswer(questionIndex, choiceIndex)} disabled={chosen !== null} aria-pressed={chosen === choiceIndex}><span>{numerals[choiceIndex]}</span>{choice}</button>;
                    })}
                  </div>
                  {chosen !== null && (
                    <div className="check-feedback" aria-live="polite">
                      <b>{chosen === item.answer ? '理解できています' : 'ここを見直そう'}</b>
                      {chosen !== item.answer && <p className="check-correct">この教材での判断は「{item.choices[item.answer]}」です。</p>}
                      <p>{item.why}</p>
                      {chosen === item.trap && <p className="trap-note">ありがちな思い込み：{item.trapNote}</p>}
                    </div>
                  )}
                </article>
              );
            })}
          </div>

          <div className={`check-result${allChecksAnswered ? ' ready' : ''}`} aria-live="polite">
            {allChecksAnswered ? <><p>確認テスト完了</p><b>{checkCorrectCount}／{confirmationTest.length} 問 正解</b><span>{checkCorrectCount === confirmationTest.length ? '制作の判断基準を、次の現場へ説明できる状態です。' : '解説を読み返し、迷った判断を軌道図でもう一度確かめましょう。'}</span></> : <><p>確認テスト進行中</p><b>{checkedCount}／{confirmationTest.length} 問 回答済み</b><span>すべて選ぶと、結果と振り返りが表示されます。</span></>}
          </div>
        </section>
      )}

      <section className="closing" aria-labelledby="closing-title">
        <div className="closing-flare" aria-hidden="true" />
        <p>物語を未来へ送るために</p>
        <h2 id="closing-title">つくる仕事は、<br />時間をつなぐ仕事。</h2>
        <div>
          <p>撮影、照明、音響、舞台転換、編集。それぞれの専門が情報を渡し合い、同じ瞬間を目指すことで、映画や舞台は観客のもとへ届きます。</p>
          <a href="#top">最初の時間へ戻る<span aria-hidden="true">↑</span></a>
        </div>
      </section>

      <footer><p>未来制作録</p><p>映画と舞台の仕事を知るための自主制作サイト</p></footer>
    </main>
  );
}
