/**
 * プログラム設定
 * ------------------------------------------------------------
 * 主催する映画会社の情報、社会貢献活動としての位置づけ、修了証、
 * 効果測定の送信先をここで設定します。画面側のコードは触らずに、
 * このファイルだけで導入先に合わせられます。
 *
 * `sample: true` の間は、画面に「サンプル表記」と表示されます。
 * 実際の社名・部署名を入れたら `sample: false` にしてください。
 */

export type Supervisor = {
  /** 例：撮影監修 */
  role: string;
  /** 例：〇〇撮影所　撮影部　山田 太郎 */
  name: string;
};

export type Program = {
  title: string;
  tagline: string;
  organizer: { sample: boolean; name: string; department: string; url: string; contact: string };
  csr: { label: string; statement: string };
  supervisors: Supervisor[];
  learning: { audience: string; duration: string; cost: string; objectives: string[] };
  certificate: { enabled: boolean; heading: string; body: string };
  privacy: string;
  report: { endpoint: string };
};

export const program: Program = {
  title: '未来制作録',
  tagline: '物語が、生まれる瞬間へ。',

  organizer: {
    sample: true,
    name: '〇〇映画株式会社',
    department: 'サステナビリティ推進室',
    /** 社会貢献活動の紹介ページなど。空なら表示しません。 */
    url: '',
    /** 学校・団体からの問い合わせ窓口。空なら表示しません。 */
    contact: '',
  },

  csr: {
    label: '社会貢献プログラム',
    statement:
      '映画や舞台をつくる仕事の知恵を、次の世代へひらく。作品の裏側にある専門職と、その判断の理由を、だれでも無料で学べる形で公開しています。',
  },

  /** 内容を確認した現場スタッフ。空配列の間は監修欄を表示しません。 */
  supervisors: [],

  learning: {
    audience: '中学生から大人まで',
    duration: '約20分（話し合いを入れると50分）',
    cost: '無料・登録なし',
    objectives: [
      '1本の作品が、多くの専門職の連携でできていることを知る。',
      '現場の判断には必ず「理由」があることを、問いを通して体験する。',
      '記録・共有・安全という、どんな仕事にも通じる考え方を持ち帰る。',
    ],
  },

  certificate: {
    enabled: true,
    heading: '修了証',
    body: '映画と舞台の制作をめぐる5つの現場を巡り、つくる仕事の知恵を学んだことを証します。',
  },

  privacy:
    'このサイトは名前や連絡先を集めません。回答とふり返りの記録は、お使いの端末の中だけに保存されます。修了証に入れる名前も、どこにも送信されません。',

  /**
   * 効果測定（任意）
   * endpoint を設定すると、修了時に「正解数・学習前後の自己評価・興味の変化」
   * だけを匿名で送信します。名前や端末を特定する情報は含みません。
   * 空のままなら何も送信しません。
   */
  report: {
    endpoint: '',
  },
};
