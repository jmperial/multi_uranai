以下の指示に従い、Flutterプロジェクト「multi_uranai」を新規作成し、全て実装してください。途中で確認を求めず、最後まで一気に進めてください。最後にXcode iOSシミュレータを起動して動作確認まで行ってください。

# 概要
生年月日を入力すると8種類の占術結果を一覧表示し、毎朝開きたくなるパーソナル運勢アプリ。バイオリズムグラフ（日次・月間・年間）で体調・感情・知性の波を可視化し、「今日は調子いい日！」がひと目でわかる。

# コンセプト
「毎朝開いて元気が出るアプリ」— 朝の占い習慣として、今日の運勢スコア・バイオリズム・ラッキーカラーをダッシュボードで一目把握。ポジティブな表現を心がけ、悪い結果でも前向きなアドバイスを添える。

# 技術スタック
- Flutter（最新stable）/ Dart
- 状態管理: Riverpod
- ローカル保存: shared_preferences
- フォント: google_fonts（Noto Sans JP）
- グラフ描画: fl_chart
- 日付処理: intl
- 対象: iOS 16+ / Android API 26+

# プロジェクト初期化

flutter create --org com.jmperial --project-name multi_uranai --platforms ios,android ~/multi_uranai/multi_uranai_app

pubspec.yamlに flutter_riverpod, shared_preferences, google_fonts, intl, fl_chart を追加し pub get。

# ディレクトリ構成
```
lib/
├── main.dart
├── app.dart
├── config/
│   ├── theme.dart
│   └── routes.dart
├── features/
│   ├── home/
│   │   ├── home_screen.dart          # 今日のダッシュボード
│   │   └── widgets/
│   │       ├── daily_score_card.dart  # 今日の総合スコア
│   │       ├── biorhythm_mini.dart   # バイオリズムミニグラフ
│   │       └── lucky_items.dart      # ラッキーカラー・アイテム
│   ├── input/
│   │   └── input_screen.dart
│   ├── result/
│   │   ├── result_screen.dart
│   │   └── widgets/
│   │       ├── fortune_card.dart
│   │       └── fortune_detail_screen.dart
│   ├── biorhythm/
│   │   ├── biorhythm_screen.dart     # バイオリズム詳細画面
│   │   └── widgets/
│   │       ├── daily_chart.dart      # 日次グラフ（±15日）
│   │       ├── monthly_chart.dart    # 月間グラフ（30日）
│   │       └── yearly_chart.dart     # 年間グラフ（365日）
│   └── settings/
│       └── settings_screen.dart
├── models/
│   ├── birth_data.dart
│   └── fortune_result.dart
├── services/
│   ├── fortune_engine.dart
│   ├── biorhythm_service.dart        # バイオリズム計算
│   ├── rokusei_service.dart
│   ├── numerology_service.dart
│   ├── kyusei_service.dart
│   ├── animal_service.dart
│   ├── maya_service.dart
│   ├── zero_gaku_service.dart
│   ├── shichuu_service.dart
│   └── western_astro_service.dart
└── utils/
    ├── calendar_utils.dart
    └── constants.dart
```

# バイオリズム機能（biorhythm_service.dart）— 最重要機能

## 計算式
- 誕生日からの経過日数: daysSince = (today - birthDate).inDays
- 身体(Physical): sin(2π × daysSince / 23) → 周期23日、色: #FF6B35
- 感情(Emotional): sin(2π × daysSince / 28) → 周期28日、色: #00F5FF
- 知性(Intellectual): sin(2π × daysSince / 33) → 周期33日、色: #BF00FF
- パーセンテージ: ((sin値 + 1) / 2 * 100).round() → 0〜100%
- 総合スコア: 3つの平均値

## グラフ表示（fl_chart使用）
1. 日次グラフ: 今日を中心に±15日（30日間）の3本波形。今日の位置に縦マーカー線
2. 月間グラフ: 当月1日〜末日。好調期（3値とも60%超）をハイライト背景
3. 年間グラフ: 1月〜12月。月平均値の推移をなめらかな曲線で

## 好調日・注意日の自動検出
- 好調日: 3サイクル全てが60%以上の日 → カレンダーに★マーク
- 要注意日: いずれかが20%以下 → カレンダーに△マーク
- 今月の好調日リストを「今月のラッキーデー」として表示

# ホーム画面（毎朝のダッシュボード）— home_screen.dart

## レイアウト（上から順に）
1. 挨拶ヘッダー: 「おはよう！○月○日（○）」+ 時間帯で変わる背景グラデーション
2. 今日の総合スコア: 大きな円形ゲージ（0-100）＋ 一言メッセージ
3. バイオリズムミニグラフ: ±7日の小さな波形3本。タップでバイオリズム詳細画面へ
4. ラッキーアイテム: ラッキーカラー（円形チップ）、ラッキーナンバー、ラッキー方位
5. 占い結果カード一覧: 横スクロールのカルーセル形式で8種をプレビュー

## 一言メッセージのロジック
- 90-100: 「最高の一日になりそう！✨」
- 70-89: 「いい調子！自信を持って進もう 💪」
- 50-69: 「穏やかな一日。マイペースでOK 🌿」
- 30-49: 「少し控えめに。充電日にしよう 🔋」
- 0-29: 「ゆっくり過ごそう。明日はきっと良くなる 🌅」

# 実装する占術8種

## 1. 六星占術（rokusei_service.dart）
★重要: 以下の計算式は実際のテストケースで検証済み。変更しないこと。
- 節分判定: month==1 または (month==2 && day<4) なら前年扱い
- 運命数算出: base = (adjustedYear % 100) + month + day + 2  ← +2の定数が重要
- birthNumber: ((base - 1) % 12) + 1 → 範囲1〜12
- 運命星: starIndex = (birthNumber - 1) % 6 → 0=土星人, 1=金星人, 2=火星人, 3=天王星人, 4=木星人, 5=水星人
- 陰陽: birthNumber >= 7 → 陽(プラス)、1〜6 → 陰(マイナス)
- 年運: cyclePos = ((currentYear - birthYear) % 12 + 12) % 12
- 12フェーズ: [種, 芽吹き, 成長, 開花, 実り, 乱気, 停止, 減退, 整理, 陰影, 停止, 大殺界]
- 検証: 1974/11/29 → (74+11+29+2)=116 → birthNumber=8 → starIndex=1 → 金星人(+) ✓

## 2. 数秘術（numerology_service.dart）
- ピタゴリアン方式: YYYYMMDDの全桁を合計し、1桁になるまで繰り返し加算
- マスターナンバー 11, 22, 33 は加算せず保持
- 例: 1990/05/15 → 1+9+9+0+0+5+1+5=30 → 3+0=3
- 各ナンバー(1-9,11,22,33)の性格・運勢テキストを内蔵

## 3. 九星気学（kyusei_service.dart）
★重要: 以下の計算式は検証済み。
- 節分判定: month==1 または (month==2 && day<4) なら前年扱い
- 本命星: starNum = (12 - ((adjustedYear - 1900) % 9)) % 9、結果が0なら9
- 九星: 1=一白水星 〜 9=九紫火星
- 検証: 1961→五黄土星(5), 1999→三碧木星(3), 2000→二黒土星(2) ✓

## 4. 動物占い（animal_service.dart）
- 生年月日→60干支番号を算出（calendar_utils.dartの共通関数を使用）
- 60干支番号→12動物にマッピング（対応テーブルをハードコード）
- 12動物: 狼,こじか,猿,チータ,黒ひょう,ライオン,虎,たぬき,コアラ,ゾウ,ひつじ,ペガサス
- さらに5色（レッド,ブルー,オレンジ,ブラウン,パープル/ゴールド）で60分類
- 各動物キャラの性格テキストを内蔵

## 5. マヤ暦（maya_service.dart）
- KINナンバー(1〜260): グレゴリオ暦日数差から算出
- 基準日: 2012/12/21 = KIN 207
- 太陽の紋章(20種): (KIN - 1) % 20 で決定（赤い竜=0〜黄色い太陽=19）
- ウェイブスペル(20種): ((KIN - 1) ~/ 13) % 20 で決定
- 銀河の音(1〜13): ((KIN - 1) % 13) + 1
- 各紋章の意味テキストを内蔵

## 6. 0学占い（zero_gaku_service.dart）
- 生年月日から支配星(12種)を算出
- 支配星: 水王星,木王星,月王星,火王星,金王星,土王星,氷王星,海王星,魚王星,冥王星,天王星,真王星
- 12年周期の運命グラフの現在位置を表示

## 7. 四柱推命 簡易版（shichuu_service.dart）
★重要: 以下の計算式は検証済み。
- 年柱: yearOffset = (adjustedYear - 4 + 1200) % 60。立春(2/4)前は前年扱い
- 月柱: branch = TWELVE_BRANCHES[month % 12]。stemBase = ((yearOffset % 5) * 2 + 2) % 10
- 日柱: 基準日 1900/1/1=甲子(offset 0)。dayOffset = ((dayDiff % 60) + 60) % 60
- 時柱: 出生時刻不明のため「出生時刻が必要です」と表示
- 天干: 甲乙丙丁戊己庚辛壬癸（10）
- 地支: 子丑寅卯辰巳午未申酉戌亥（12）
- 五行: 甲乙=木, 丙丁=火, 戊己=土, 庚辛=金, 壬癸=水

## 8. 西洋占星術 簡易版（western_astro_service.dart）
- 太陽星座のみ判定。月日境界テーブル:
  1/20→水瓶座, 2/19→魚座, 3/21→牡羊座, 4/20→牡牛座, 5/21→双子座, 6/21→蟹座
  7/23→獅子座, 8/23→乙女座, 9/23→天秤座, 10/23→蠍座, 11/22→射手座, 12/22→山羊座
- デフォルト（1/1〜1/19）は山羊座
- 四元素: 火(牡羊,獅子,射手), 土(牡牛,乙女,山羊), 風(双子,天秤,水瓶), 水(蟹,蠍,魚)

# 共通ユーティリティ（calendar_utils.dart）
- 60干支番号: 日の干支 = 基準日1900/1/1=甲子(0)からの日数差 % 60
- 年の干支: (西暦 - 4) % 60
- 節分判定: month==1 || (month==2 && day<4) → 前年扱い
- 月の節入り日テーブル（固定）: 1月:6日, 2月:4日, 3月:6日, 4月:5日, 5月:6日, 6月:6日, 7月:7日, 8月:7日, 9月:8日, 10月:8日, 11月:7日, 12月:7日

# UI/デザイン — 全面刷新・カッコいい新デザイン

## テーマ（theme.dart）
- ダークテーマ基調だが、朝に元気が出る温かみのある宇宙テーマ
- 背景: #0A0E21（深い宇宙紺）
- カード背景: グラスモーフィズム（半透明 + ブラー）Colors.white.withOpacity(0.08) + BackdropFilter
- メインアクセント: #00D2FF（明るいシアン）→ #7B2FF7（パープル）のグラデーション
- ポジティブ色: #00FFA3（グリーン）
- 警告色: #FF6B6B（ソフトレッド）
- テキスト: #EAEAEA
- サブテキスト: #8B8FA3
- フォント: Noto Sans JP (google_fonts)
- 全体的に角丸 16-24px、余白たっぷり、高級感のあるミニマルデザイン

## ホーム画面デザイン
- 上部: 時間帯で変わるグラデーション背景（朝=暖色オレンジ→紺、昼=シアン→紺、夜=紫→紺）
- 総合スコア: 円形プログレスゲージ（グラデーション）中央に大きな数字
- カード: グラスモーフィズム + 微細なボーダー光彩
- アニメーション: スコアゲージのカウントアップ、カードのフェードイン

## 結果カードデザイン
- 各占術ごとにアクセントカラーを変える
- カード上部に占術名 + 絵文字、結果キーワードを大きく表示
- タップで詳細画面へ（Hero遷移アニメーション）

## 各占術のアイコンとアクセントカラー
- 六星占術: 🪐 #FFD700
- 数秘術: 🔢 #FF6B9D
- 九星気学: ⭐ #00D2FF
- 動物占い: 🐾 #FF8C42
- マヤ暦: 🏛️ #7B2FF7
- 0学占い: 🔮 #00FFA3
- 四柱推命: 📜 #FF5252
- 西洋占星術: ♈ #4FC3F7

# バイオリズム詳細画面デザイン
- タブ切り替え: 日次 / 月間 / 年間
- fl_chartのLineChart使用
- 3本の波形を半透明のグラデーション fill 付きで表示
- 今日の位置にインタラクティブなドットマーカー
- 好調日を背景色で可視化（薄い緑のハイライト帯）
- グラフの下に「今月の好調日」リスト

# モデル定義

## birth_data.dart
```dart
enum Gender { male, female, notSelected }

class BirthData {
  final DateTime birthDate;
  final Gender gender;
  const BirthData({required this.birthDate, this.gender = Gender.notSelected});
}
```

## fortune_result.dart
```dart
class FortuneResult {
  final String fortuneType;
  final String title;
  final String icon;
  final Color accentColor;
  final String keyword;
  final String summary;
  final String detail;
  final bool hasTimePrecision;
  const FortuneResult({...});
}
```

# fortune_engine.dart
```dart
class FortuneEngine {
  List<FortuneResult> divine(BirthData birthData) {
    return [
      RokuseiService().divine(birthData),
      NumerologyService().divine(birthData),
      KyuseiService().divine(birthData),
      AnimalService().divine(birthData),
      MayaService().divine(birthData),
      ZeroGakuService().divine(birthData),
      ShichuuService().divine(birthData),
      WesternAstroService().divine(birthData),
    ];
  }
}
```

# テスト
- test/ 配下に各占術サービスのユニットテストを作成
- テストケース:
  - 1974/11/29（男性）→ 六星占術=金星人(+) を必ず検証
  - 2000/01/01（男性）→ 九星気学=二黒土星 を必ず検証
  - 1990/07/15（女性）, 1985/12/25（男性）も検証
- 各テストで結果のkeywordがnullでないこと、期待値と一致すること

# ビルド・実行
全実装完了後、以下を順に実行:
1. flutter analyze でエラー0であること
2. flutter test で全テストパスすること
3. flutter build ios --debug --no-codesign が成功すること
4. iOSシミュレータを起動して実機動作確認:
   open -a Simulator
   flutter run
5. シミュレータで: 生年月日入力 → 占い結果が8種全カード表示されること → バイオリズムグラフが表示されることを確認

以上を全て実装してください。
