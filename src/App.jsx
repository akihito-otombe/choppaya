import React, { useState, useContext, createContext, forwardRef } from 'react';
import { motion } from 'framer-motion';
// MessageSquare と LineChart をインポート
import { FileUp, Upload, Send, CheckCircle, XCircle, Search, Download, MessageSquare, LineChart, TrendingUp, Users, PieChart, DollarSign, AlertTriangle, Check } from 'lucide-react';

// --- shadcn/uiの簡易的な代替コンポーネント ---
// ===== 修正: rounded-lg と shadow-sm を復活させ、メリハリをつける =====
const Card = ({ className, children }) => <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>{children}</div>;
const CardHeader = ({ className, children }) => <div className={`p-6 ${className}`}>{children}</div>;
const CardTitle = ({ className, children }) => <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>;
const CardContent = ({ className, children }) => <div className={`p-6 pt-0 ${className}`}>{children}</div>;

// ===== 修正: rounded-md を追加 =====
const Input = forwardRef(({ className, ...props }, ref) => (
  <input ref={ref} className={`border p-2 border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${className}`} {...props} />
));

const Textarea = forwardRef(({ className, ...props }, ref) => (
  <textarea ref={ref} className={`w-full border p-2 border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${className}`} {...props} />
));

// ===== 修正: 'ghost' variant を追加 =====
const Button = forwardRef(({ className, variant, size, ...props }, ref) => (
  <button
    ref={ref}
    className={`inline-flex items-center justify-center text-sm font-medium transition-colors gap-2 rounded-md
      ${variant === 'destructive' ? 'bg-red-600 text-white hover:bg-red-700' : ''}
      ${variant === 'outline' ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100' : ''}
      {/* ===== 修正: 'ghost' variant を追加 ===== */}
      ${variant === 'ghost' ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : ''}
      ${!variant ? 'bg-blue-600 text-white hover:bg-blue-700' : ''}
      ${size === 'sm' ? 'h-8 px-3 text-xs' : 'h-9 px-4 py-2'}
      ${className}`}
    {...props}
  />
));
const TabsContext = createContext({ value: '', setValue: (v) => {} });
const Tabs = ({ defaultValue, children, className }) => {
  const [value, setValue] = useState(defaultValue);
  return <TabsContext.Provider value={{ value, setValue }}><div className={className}>{children}</div></TabsContext.Provider>;
};
const TabsList = ({ className, children }) => <div className={className}>{children}</div>;
const TabsTrigger = ({ value, className, children }) => {
  const { value: selectedValue, setValue } = useContext(TabsContext);
  return <button onClick={() => setValue(value)} data-state={value === selectedValue ? 'active' : 'inactive'} className={className}>{children}</button>;
};
const TabsContent = ({ value, className, children }) => {
  const { value: selectedValue } = useContext(TabsContext);
  return value === selectedValue ? <div className={className}>{children}</div> : null;
};
// --- 代替コンポーネントここまで ---


function StepTitle({ step, title, desc }) {
  return (
    <div className="flex items-center gap-3 mb-1 border-l-4 border-blue-600 pl-3">
      {/* ===== 修正: モノトーン -> アクセントカラー (bg-blue-600) ===== */}
      <div className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white text-[10px] font-bold rounded-full">
        {step}
      </div>
      <div>
        <div className="font-semibold text-sm">{title}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
    </div>
  );
}

// ===== 経営ダッシュボード用のダミーデータ =====
const formatYen = (val) => `${(val / 10000).toLocaleString('ja-JP')} 万円`;
const formatYenSimple = (val) => `${(val).toLocaleString('ja-JP')} 円`;
// 利益と売上の増加は緑
const formatDiffPercent = (current, prev, reverseColor = false) => {
  const diff = current - prev;
  const percent = (diff / prev * 100).toFixed(1);
  let color = diff >= 0 ? 'text-green-600' : 'text-red-600';
  if (reverseColor) { // 経費の場合
    color = diff >= 0 ? 'text-red-600' : 'text-green-600';
  }
  return <span className={`text-sm ${color}`}>({diff >= 0 ? '+' : ''}{percent}%)</span>;
};
// ----- P/Lダッシュボード用データ -----
const plDashboardData = {
  kpi: {
    salesCurrent: 12500000,
    salesPrev: 11000000,
    profitCurrent: 3800000,
    profitPrev: 3200000,
    costCurrent: 8700000, // 原価＋販管費
    costPrev: 7800000,
  },
  monthlyTrend: [
    { name: '4月', sales: 9000000, profit: 2500000 },
    { name: '5月', sales: 9500000, profit: 2800000 },
    { name: '6月', sales: 10000000, profit: 3000000 },
    { name: '7月', sales: 10500000, profit: 3100000 },
    { name: '8月', sales: 10000000, profit: 2900000 },
    { name: '9月', sales: 11000000, profit: 3200000 },
    { name: '10月', sales: 12500000, profit: 3800000 },
  ],
  costBreakdown: [ // 費用内訳
    /* ===== 修正: Tailwindクラス (bg-*) から Hexコード (colorHex) に変更 ===== */
    /* (Tailwindの動的クラス名 'fill-*' が 'npm run dev' でパージされてしまう問題の対策) */
    { name: '仕入高', total: 4500000, colorHex: '#06b6d4' }, // bg-cyan-500
    { name: '人件費', total: 2000000, colorHex: '#6366f1' }, // bg-indigo-500
    { name: '広告宣伝費', total: 800000, colorHex: '#3b82f6' }, // bg-blue-500
    { name: '消耗品費', total: 450000, colorHex: '#0ea5e9' }, // bg-sky-500
    { name: 'その他販管費', total: 950000, colorHex: '#94a3b8' }, // bg-slate-400
  ]
};
const maxSalesTrend = Math.max(...plDashboardData.monthlyTrend.map(d => d.sales));
const totalCost = plDashboardData.costBreakdown.reduce((acc, item) => acc + item.total, 0);

// 簡易バーグラフ（月次推移用）
const MonthlyBarChart = ({ data, max }) => (
  <div className="w-full h-64 grid grid-cols-7 gap-4 items-end">
    {data.map(d => (
      // ===== 修正: h-full を追加し、flex-col が高さを埋めるようにします =====
      <div key={d.name} className="flex flex-col items-center gap-1 h-full">
        {/* ===== 修正: 売上の数字も明記 ===== */}
        <div className="text-xs text-cyan-600 font-semibold">{formatYen(d.sales)}</div>
        <div className="text-xs text-indigo-600 font-semibold">{formatYen(d.profit)}</div>
        {/* ===== 修正: h-full を flex-1 に変更し、残りの高さを埋めるようにします ===== */}
        {/* ===== 修正: rounded-t-md を追加 ===== */}
        <div className="w-full flex-1 bg-slate-100 flex flex-col justify-end overflow-hidden rounded-t-md">
          <div
            style={{ height: `${(d.profit / max) * 100}%` }}
            className="w-full bg-gradient-to-t from-indigo-500 to-indigo-400"
            title={`営業利益: ${formatYen(d.profit)}`}
          />
          <div
            style={{ height: `${((d.sales - d.profit) / max) * 100}%` }}
            className="w-full bg-gradient-to-t from-cyan-500 to-cyan-400 opacity-70"
            title={`売上: ${formatYen(d.sales)}`}
          />
        </div>
        <div className="text-xs font-medium text-slate-600">{d.name}</div>
      </div>
    ))}
  </div>
);
// 簡易円グラフ（内訳用）
const PieChartSVG = ({ data, total }) => {
  let accumulatedPercent = 0;
  const segments = data.map(d => {
    const percent = (d.total / total) * 100;
    const startAngle = (accumulatedPercent / 100) * 360;
    accumulatedPercent += percent;
    const endAngle = (accumulatedPercent / 100) * 360;
    const largeArcFlag = percent > 50 ? 1 : 0;
    
    const startX = 50 + 40 * Math.cos(Math.PI * startAngle / 180);
    const startY = 50 + 40 * Math.sin(Math.PI * startAngle / 180);
    const endX = 50 + 40 * Math.cos(Math.PI * endAngle / 180);
    const endY = 50 + 40 * Math.sin(Math.PI * endAngle / 180);
    
    return `M 50 50 L ${startX} ${startY} A 40 40 0 ${largeArcFlag} 1 ${endX} ${endY} Z`;
  });
  
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {segments.map((d, i) => (
        /* ===== 修正: className (fill-*) からインラインstyle (fill) に変更 ===== */
        <path key={i} d={d} style={{ fill: data[i].colorHex }} />
      ))}
    </svg>
  );
};

// ----- 経費ダッシュボード用データ -----
const costDashboardData = {
  kpi: {
    currentMonthTotal: 3850000,
    prevMonthTotal: 3500000,
    alerts: 3,
  },
  monthlyTrend: [
    { name: '4月', total: 3200000 },
    { name: '5月', total: 3100000 },
    { name: '6月', total: 3300000 },
    { name: '7月', total: 3400000 },
    { name: '8月', total: 3350000 },
    { name: '9月', total: 3500000 },
    { name: '10月', total: 3850000 },
  ],
  byAccount: [
    { name: '仕入高', total: 1200000, color: 'bg-cyan-500' },
    { name: '広告宣伝費', total: 800000, color: 'bg-indigo-500' },
    { name: '消耗品費', total: 450000, color: 'bg-blue-500' },
    { name: '交際費', total: 300000, color: 'bg-sky-500' },
    { name: '交通費', total: 200000, color: 'bg-teal-500' },
    { name: 'その他', total: 900000, color: 'bg-slate-400' },
  ],
  byDept: [
    { name: '営業部', total: 1500000, color: 'bg-cyan-500' },
    { name: '開発部', total: 1000000, color: 'bg-indigo-500' },
    { name: '管理部', total: 850000, color: 'bg-blue-500' },
    { name: 'マーケティング部', total: 500000, color: 'bg-sky-500' },
  ]
};
const maxCostMonthlyTrend = Math.max(...costDashboardData.monthlyTrend.map(d => d.total));
const totalByAccount = costDashboardData.byAccount.reduce((acc, item) => acc + item.total, 0);
const totalByDept = costDashboardData.byDept.reduce((acc, item) => acc + item.total, 0);

// 簡易バーグラフ（月次推移用）
const CostMonthlyBar = ({ name, total, max }) => (
  <div className="flex flex-col items-center gap-1">
    {/* ===== 修正: rounded-t-md を追加 ===== */}
    <div className="w-full h-40 bg-slate-100 flex items-end rounded-t-md overflow-hidden">
      <div
        style={{ height: `${(total / max) * 100}%` }}
        /* ===== 修正: グラデーションを 600 -> 500 に変更 (黒潰れ対策) ===== */
        className="w-full bg-gradient-to-t from-cyan-500 to-indigo-500"
      />
    </div>
    <div className="text-xs font-medium text-slate-600">{name}</div>
  </div>
);
// 簡易プログレスバー（内訳用）
const CostBreakdownBar = ({ name, total, max, color }) => (
  <div>
    <div className="flex justify-between text-sm mb-1">
      <span className="font-medium">{name}</span>
      <span className="text-slate-600">{formatYenSimple(total)}</span>
    </div>
    {/* ===== 修正: rounded-full を追加 ===== */}
    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
      <div style={{ width: `${(total / max) * 100}%` }} className={`h-2 ${color}`} />
    </div>
  </div>
);


export default function App() {
  // ===== 小物：役割/セクションタブ、添付プレビュー =====
  // ===== 修正: スタイル変更 (下線 -> アクセントカラー) =====
  const RoleTabsTrigger = ({ value, children }) => (
    <TabsTrigger 
      value={value} 
      // ===== 修正: ヘッダー青背景対応 (白文字・白下線) =====
      className="text-sm font-semibold px-4 py-3 text-blue-100 hover:text-white data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white"
    >
      {children}
    </TabsTrigger>
  );
  // ===== 修正: スタイル変更 (下線 -> アクセントカラー) =====
  const SectionTabsTrigger = ({ value, children }) => (
    <TabsTrigger value={value} className="text-sm font-semibold border-b-2 border-transparent px-3 py-2 text-gray-500 hover:text-blue-700 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600">{children}</TabsTrigger>
  );
  // ===== 修正: rounded-lg を追加 =====
  const AttachmentPreview = ({ file }) => (
    <div className="border overflow-hidden rounded-lg">
      <div className="h-44 bg-slate-100 flex items-center justify-center text-sm text-muted-foreground">
        {file.kind === 'pdf' ? 'PDFプレビュー（ダミー）' : '画像プレビュー（ダミー）'}：{file.name}
      </div>
      <div className="p-2 flex gap-2">
        <Button variant="outline" className="h-8 px-3 text-xs">原本を開く</Button>
        <Button variant="outline" className="h-8 px-3 text-xs">ダウンロード</Button>
      </div>
    </div>
  );

  // ===== 申請者の業務カテゴリを分離 =====
  // ===== 修正: 「請求書」を「発行（販売）」「受領（仕入）」に分離 =====
  // ===== 修正: 「(仕入側)」「(販売側)」を削除 =====
  // ===== 修正: 「請求書発行」を左側に移動 =====
  const applicationTypes = ['請求書発行', '仕入請求書', '経費精算', '交通費精算', '稟議・購買', '出張申請', '出張旅費精算'];

  // ===== 申請者 state =====
  // ===== 修正: selectedType のデフォルトを「受領」に変更 =====
  // ===== 修正: デフォルトを「仕入請求書」に変更 =====
  // ===== 修正: デフォルトを「請求書発行」に変更 =====
  const [selectedType, setSelectedType] = useState('請求書発行');
  const [appHistQuery, setAppHistQuery] = useState('');
  const [appHistKind, setAppHistKind] = useState('すべて');

  // ===== 追加: 請求書受領（仕入側）のAI検知リスト state =====
  const [receivedInvoices, setReceivedInvoices] = useState([
    { id: 'R-001', vendor: '株式会社メディカルサプライ', amount: 125000, receivedDate: '2025-10-30', aiGuess: '仕入高', status: '検知済' },
    { id: 'R-002', vendor: '○○ビル管理会社', amount: 78000, receivedDate: '2025-10-28', aiGuess: '地代家賃 (定常)', status: 'スキップ済 (自動登録)' },
    { id: 'R-003', vendor: '△△広告代理店', amount: 350000, receivedDate: '2025-10-29', aiGuess: '広告宣伝費 (変動)', status: '確認中' },
    { id: 'R-004', vendor: '不明な送信元 (添付あり)', amount: null, receivedDate: '2025-10-30', aiGuess: '要確認', status: '検知済' },
  ]);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const selectedInvoice = receivedInvoices.find(inv => inv.id === selectedInvoiceId);

  // === 交通費ウィザード（単票 & 月末まとめ） ===
  const [routeFrom, setRouteFrom] = useState('新宿');
  const [routeTo, setRouteTo] = useState('品川');
  const [routeVia, setRouteVia] = useState('');
  const [routeDate, setRouteDate] = useState('2025-10-31');
  const [deductPass, setDeductPass] = useState(true);
  const [calcResult, setCalcResult] = useState(null);
  const runCalc = () => {
    const base = 200; // ダミー
    const after = deductPass ? 0 : base;
    setCalcResult({ summary: `${routeFrom} → ${routeTo}${routeVia ? `（経由：${routeVia}）` : ''} / ${routeDate}` , fare: base, after });
  };
  const [transportRows, setTransportRows] = useState([
    {date:'2025-10-01',from:'新宿',to:'品川',via:'',fare:200,after:0,note:'定期内'},
    {date:'2025-10-02',from:'新宿',to:'品川',via:'',fare:200,after:0,note:'定期内'},
  ]);
  const updateTransport = (i, k, v)=>{
    setTransportRows(prev=> prev.map((r,idx)=> idx===i? {...r,[k]:v}: r));
  };
  const pasteExampleRows = ()=>{
    setTransportRows([
      {date:'2025-10-10',from:'渋谷',to:'大手町',via:'',fare:240,after:240,note:''},
      {date:'2025-10-11',from:'渋谷',to:'大手町',via:'神保町',fare:260,after:260,note:'打合せ2件'},
      {date:'2025-10-15',from:'新宿',to:'品川',via:'',fare:200,after:0,note:'定期内'},
    ])
  };

  // ===== 承認者 state =====
  const approverHistoryData = [
    { id: 'A-201', type: '支払承認（仕入）', title: '仕入先A 9月分 請求書', amount: 254000, action: '承認', date: '2025-10-05' },
    { id: 'A-202', type: '交通費精算', title: '営業交通費（9/28〜10/2）', amount: 12840, action: '差戻', date: '2025-10-15' },
  ];
  const applicantHistoryData = [
    // ===== 修正: typeを「支払承認（仕入）」 -> 「仕入請求書」に変更 =====
    { id: 'H-101', type: '仕入請求書', title: '仕入先A 9月分 請求書', amount: 254000, status: '承認→登録済', date: '2025-10-05' },
    { id: 'H-102', type: '交通費精算', title: '出張交通費（9/12）', amount: 8420, status: '差戻→再申請中', date: '2025-10-15' },
    { id: 'H-103', type: '経費精算', title: '文具購入', amount: 2980, status: '承認→登録済', date: '2025-10-22' },
  ];

  const [requests, setRequests] = useState([
    {
      // ===== 修正: 「請求書」 -> 「支払承認（仕入）」、内容を「変動仕入」に調整 =====
      id: 'REQ-24001', type: '支払承認（仕入）', title: '仕入先A 10月分 請求書（変動）', vendor: '仕入先A株式会社', amount: 286000, currency: 'JPY',
      whoName: 'AI-BPO (検知)', whoDept: '経理部', what: '部材費の支払い（発注#PO-1024 ／ 10月納品分）', when: '2025-10-31', whereTo: '経理部長 佐藤 宛', why: '月次契約に基づく支払 (変動あり)', how: '銀行振込（翌月末）',
      attachments: [ { name: 'invoice_a_oct.pdf', kind: 'pdf' } ], 
      // ===== 修正: riskとconfidenceを調整 =====
      risk: '中 (変動)', confidence: 0.85, status: '待ち',
      checklist: [ { k: '発注情報(PO-1024)との一致', ok: true }, { k: '金額・税区分の妥当性', ok: true }, { k: '支払先口座の変更有無', ok: true }, { k: '過去の同月比 (変動 +15%)', ok: false } ],
      // ===== 修正: 申請日とアラートフラグを追加 =====
      receivedDate: '2025-10-28', 
      isUrgent: true,
    },
    {
      // ===== 追加: 定常仕入（家賃）のダミーデータ。AIが自動承認候補とする =====
      id: 'REQ-24004', type: '支払承認（仕入）', title: 'ビル管理費 10月分（定常）', vendor: '○○ビル管理', amount: 78000, currency: 'JPY',
      whoName: 'AI-BPO (検知)', whoDept: '管理部', what: '事務所家賃（10月分）', when: '2025-10-31', whereTo: '管理部長 井上 宛', why: '月次賃貸契約', how: '銀行振込（翌月末）',
      attachments: [ { name: 'invoice_rent_oct.pdf', kind: 'pdf' } ], 
      risk: '低 (定常)', confidence: 0.99, status: '待ち',
      checklist: [ { k: '過去の支払パターンと完全一致', ok: true }, { k: '金額・税区分の妥当性', ok: true }, { k: '支払先口座の変更有無', ok: true } ],
      receivedDate: '2025-10-28', 
      isUrgent: false,
    },
    {
      id: 'REQ-24002', type: '交通費精算', title: '営業交通費（9/28〜10/2）', vendor: '—', amount: 12840, currency: 'JPY',
      whoName: '鈴木 花子', whoDept: '営業部', what: '訪問時の交通費（電車・バス）精算', when: '2025-10-03', whereTo: '営業部MGR 田村 宛', why: '顧客訪問（案件#S-221）', how: '立替清算（給与合算）',
      attachments: [ ], risk: '中', confidence: 0.78, status: '待ち',
      checklist: [ { k: 'IC明細の有無', ok: true }, { k: '定期区間控除の適用', ok: true }, { k: '同一日の重複なし', ok: true } ],
      // ===== 修正: 申請日とアラートフラグを追加 =====
      receivedDate: '2025-10-27', 
      isUrgent: false,
    },
    {
      id: 'REQ-24003', type: '経費精算', title: '文具購入（メモ帳/ペン）', vendor: '—', amount: 2980, currency: 'JPY',
      whoName: '山本 健', whoDept: '管理部', what: '消耗品の購入精算', when: '2025-10-25', whereTo: '管理部長 井上 宛', why: '備品不足のため', how: '立替清算',
      attachments: [ { name: 'stationery_receipt.jpg', kind: 'image' } ], risk: '低', confidence: 0.88, status: '待ち',
      checklist: [ { k: '領収書の読取可否', ok: true }, { k: '科目の妥当性', ok: true } ],
      // ===== 修正: 申請日とアラートフラグを追加 =====
      receivedDate: '2025-10-26', 
      isUrgent: false,
    },
  ]);
  const [selectedId, setSelectedId] = useState('REQ-24001');
  const selected = requests.find((r) => r.id === selectedId) || requests[0];
  const [comment, setComment] = useState('');

  const [approverViewMode, setApproverViewMode] = useState('list'); // 'list' or 'detail'

  // フィルタ・検索
  const [inboxQuery, setInboxQuery] = useState('');
  const [inboxKind, setInboxKind] = useState('すべて');
  const filteredInbox = requests.filter(r => (inboxKind === 'すべて' || r.type === inboxKind) && (inboxQuery === '' || r.title.includes(inboxQuery)));

  const [apprHistQuery, setApprHistQuery] = useState('');
  const [apprHistKind, setApprHistKind] = useState('すべて');
  // ===== エラー修正: `appQuery` -> `appHistQuery` に修正 =====
  const filteredAppHist = applicantHistoryData.filter(r => (appHistKind === 'すべて' || r.type === appHistKind) && (appHistQuery === '' || r.title.includes(appHistQuery)));
  const filteredApprHist = approverHistoryData.filter(r => (apprHistKind === 'すべて' || r.type === apprHistKind) && (apprHistQuery === '' || r.title.includes(apprHistQuery)));

  // 承認操作
  const approve = () => setRequests((prev) => prev.map((r) => (r.id === selectedId ? { ...r, status: '承認' } : r)));
  const reject = () => setRequests((prev) => prev.map((r) => (r.id === selectedId ? { ...r, status: '却下' } : r)));

  // 一括承認用の選択状態
  const [bulkSelected, setBulkSelected] = useState(new Set());
  const toggleBulk = (id) => setBulkSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const bulkApprove = () => setRequests(prev => prev.map(r => bulkSelected.has(r.id) ? { ...r, status: '承認' } : r));
  const bulkReject = () => setRequests(prev => prev.map(r => bulkSelected.has(r.id) ? { ...r, status: '却下' } : r));

  // CSV 出力
  const exportCSV = (rows, filename) => {
    const csv = rows.map((r) => r.map((x) => `"${String(x).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url);
  };

  // 小物：受信行と一括承認バー
  const InboxRow = ({ r, selected, onToggle, onClickTitle }) => (
    // ===== 修正: rounded-lg を追加, selected時のスタイルを調整 (青色) =====
    <div className={`w-full text-left p-3 border transition rounded-lg ${selected ? 'border-blue-500 ring-1 ring-blue-500/30 bg-blue-50/50' : r.isUrgent ? 'border-amber-400 bg-amber-50/50' : 'border-slate-200'} hover:bg-gray-100`}>
      <div className="flex items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={selected} onChange={onToggle} />
          {/* ===== 修正: rounded-full を追加 ===== */}
          <span className="px-2 py-0.5 bg-slate-200 text-slate-700 text-xs rounded-full">{r.type}</span>
        </label>
        <button onClick={onClickTitle} className="flex-1 text-left font-medium truncate pr-2 hover:underline">{r.title}</button>
        <div className="text-sm text-slate-500 whitespace-nowrap">{r.vendor !== '—' ? r.vendor + ' ・ ' : ''}{r.amount.toLocaleString()} {r.currency}</div>
        
        {/* ===== 修正: 申請日とアラート表示を追加 ===== */}
        <div className="flex flex-col items-end text-xs text-slate-500 min-w-[90px]">
          <div>受付: {r.receivedDate}</div>
          {r.isUrgent ? (
            <div className="flex items-center gap-1 text-amber-600 font-semibold">
              <AlertTriangle size={14} />
              {/* ===== 修正: 「対応要」 -> 「急ぎ」 ===== */}
              <span>急ぎ</span>
            </div>
          ) : (
             <div className="h-[20px]"></div> // 高さを揃えるためのスペーサー
          )}
        </div>
      </div>
    </div>
  );
  // ===== 修正: rounded-lg を追加, bg-gray-50 -> bg-slate-50 =====
  const BulkApproveBar = ({ selectedIds, onApprove, onReject }) => selectedIds.size === 0 ? null : (
    <div className="flex items-center justify-between p-2 border bg-slate-50 rounded-lg">
      <div className="text-sm">選択中：<span className="font-semibold">{selectedIds.size}</span> 件</div>
      <div className="flex gap-2">
        <Button className="h-9 bg-green-600 hover:bg-green-700 text-white" onClick={onApprove}><CheckCircle size={16}/> 一括承認</Button>
        <Button variant="destructive" className="h-9" onClick={onReject}><XCircle size={16}/> 一括却下</Button>
      </div>
    </div>
  );

  return (
    // ===== 修正: 全体背景を bg-white -> bg-slate-50 (薄いグレー) に変更 =====
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }} className="min-h-screen bg-slate-50 font-sans">
      {/* ===== 構造修正 =====
        Tabsコンポーネントをヘッダーの外側に配置し、
        ヘッダー(sticky)とコンテンツ(TabsContent)が分離できるようにする
      */}
      <Tabs defaultValue="applicant">
        {/* 役割タブ（タイトルの上） */}
        {/* ===== 修正: ヘッダーの背景を bg-blue-600 に変更 ===== */}
        <div className="sticky top-0 z-30 bg-blue-600 text-white shadow-md">
          {/* ===== 修正: pt-3 (上の余白) を削除し、px-6 のみ残す ===== */}
          <div className="max-w-6xl mx-auto px-6">
            
            {/* =====【UI修正1】: タイトルと役割タブを横並びにする ===== */}
            <motion.div 
              initial={{ y: -6, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              transition={{ delay: 0.1 }} 
              /* ===== 修正: py-2 -> py-1 (さらに細く) に変更 ===== */
              className="flex items-center justify-between py-1"
            >
              {/* ===== 修正: h1の背景色(bg-blue-600)を削除（親要素で指定） ===== */}
              <h1 className="text-xl font-bold">
                チョッパヤ for BackOffice
              </h1>
              <TabsList className="flex flex-wrap justify-center gap-2">
                <RoleTabsTrigger value="applicant">申請者</RoleTabsTrigger>
                <RoleTabsTrigger value="approver">承認者</RoleTabsTrigger>
                <RoleTabsTrigger value="cost_dashboard">経費ダッシュボード</RoleTabsTrigger>
                <RoleTabsTrigger value="pl_dashboard">経営ダッシュボード</RoleTabsTrigger>
              </TabsList>
            </motion.div>
            {/* =====【UI修正1】: ここまで ===== */}

            {/* ===== 修正: タイトル帯のデザイン変更 (border-b のみ) ===== */}
            {/* この <motion.div> は上記の修正で TabsList と統合されたため不要 */}
            {/* <motion.div 
              initial={{ y: -6, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              transition={{ delay: 0.1 }} 
              className="flex items-center justify-between py-4 px-6 border-b"
            >
              <h1 className="text-xl font-bold text-slate-900">
                チョッパヤ for BackOffice
              </h1>
            </motion.div>
            */}

          {/* ===== 構造修正 =====
             ヘッダー(sticky)と、ヘッダー内のラッパー(max-w-6xl)をここで閉じる
          */}
          </div>
        </div>

        {/* ===== 構造修正 =====
             TabsContent (ページの全コンテンツ) をヘッダーの外側に配置
        */}

        {/* ===== 申請者画面 ===== */}
        {/* ===== 修正: pt-6 を追加 ===== */}
            <TabsContent value="applicant" className="max-w-6xl mx-auto space-y-6 px-6 pb-12 pt-6">
              <Tabs defaultValue="new">
                <div className="flex items-center justify-between border-b">
                  <TabsList className="bg-transparent p-0"><SectionTabsTrigger value="new">新規申請</SectionTabsTrigger></TabsList>
                  <TabsList className="bg-transparent p-0"><SectionTabsTrigger value="history">申請履歴を見る</SectionTabsTrigger></TabsList>
                </div>

                {/* 新規申請 */}
                {/* ===== 修正: pt-5 を追加 ===== */}
                <TabsContent value="new" className="space-y-5 pt-5">
                  
                  <Tabs defaultValue="chat">
                    {/* ===== 修正: bg-gray-100 -> bg-slate-200, rounded-lg ===== */}
                    <TabsList className="grid grid-cols-2 gap-2 p-1 bg-slate-200 rounded-lg">
                      {/* ===== 修正: アクティブ時 (白) -> (青 + 白文字) に変更、rounded-md ===== */}
                      <TabsTrigger value="chat" className="text-sm font-semibold px-3 h-10 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm text-slate-700 hover:bg-slate-300/70 rounded-md">
                        ① チャットで申請 (AIが自動解析)
                      </TabsTrigger>
                      {/* ===== 修正: アクティブ時 (白) -> (青 + 白文字) に変更、rounded-md ===== */}
                      <TabsTrigger value="form" className="text-sm font-semibold px-3 h-10 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm text-slate-700 hover:bg-slate-300/70 rounded-md">
                        ② フォームから申請 (業務を選択)
                      </TabsTrigger>
                    </TabsList>
                    
                    {/* ① チャットで申請 */}
                    <TabsContent value="chat" className="mt-5 space-y-5">
                      {/* ===== 修正: Cardコンポーネント側で shadow, rounded 対応 ===== */}
                      <Card>
                        {/* ===== 修正: step={"💬"} -> step={"1"} ===== */}
                        <CardHeader><StepTitle step={"1"} title="チャットで申請（自然言語）" desc="請求書を添付し「仕入先Aに支払い」と入力するだけでAIが解析します。" /></CardHeader>
                        <CardContent className="space-y-3">
                          {/* ===== 修正: w-full を削除 (Textarea側で対応) ===== */}
                          <Textarea placeholder="例：仕入先A 10月分 請求書（ファイルを添付）" rows={3} />
                          <div className="flex justify-between items-center">
                            {/* ===== 修正: rounded-md を適用 (Button側) ===== */}
                            <Button variant="outline" className="h-10"><FileUp size={16}/> ファイルを添付</Button>
                            <div className="text-sm text-slate-500">（AIが解析し、下で確認します）</div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      {/* ===== 修正: Cardコンポーネント側で shadow, rounded 対応 ===== */}
                      <Card>
                        <CardHeader className="p-6 pb-2"><StepTitle step={2} title="AI転記結果の確認・修正" desc="AIが抽出した内容を確認し、必要に応じて修正してください。" /></CardHeader>
                        <CardContent className="p-6 pt-2 space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {/* ===== 修正: rounded-md を適用 (Input側) ===== */}
                            <Input placeholder="金額（AI）" className="h-11" />
                            <Input placeholder="日付（AI）" className="h-11" />
                             <select className="h-11 border px-3 text-sm bg-white border-gray-300 rounded-md">
                                <option>勘定科目（AI推奨）</option>
                                <option>仕入高</option>
                                <option>消耗品費</option>
                             </select>
                          </div>
                          {/* ===== 修正: w-full をコンポーネント定義側に移動 ===== */}
                          <Textarea placeholder="備考・メモ（差戻対策など）" />
                          {/* ===== 修正: グラデーションを削除 (Button側で対応) ===== */}
                          <div className="flex items-center gap-3"><Button className="flex items-center gap-2 h-11"><Send size={18}/> 申請を送信</Button></div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    {/* ② フォームから申請 */}
                    <TabsContent value="form" className="mt-5 space-y-5">
                      {/* ===== 修正: Cardコンポーネント側で shadow, rounded 対応 ===== */}
                      <Card>
                        <CardHeader className="p-6 pb-2"><StepTitle step={1} title="業務選択（フォーム）" desc="対象の業務カテゴリを選んでください。" /></CardHeader>
                        <CardContent className="p-6 pt-2 flex flex-wrap gap-2">
                          {applicationTypes.map((type) => (
                            // =====【UI修正2】: 選択状態を明確化 (outline -> ghost) =====
                            <Button key={type} variant={selectedType === type ? undefined : 'ghost'} onClick={() => setSelectedType(type)}>{type}</Button>
                          ))}
                        </CardContent>
                      </Card>

                      {/* ===== 修正: 「請求書発行（販売側）」の場合のみファイルアップロード ===== */}
                      {/* ===== 修正: 「請求書発行」に変更 ===== */}
                      {(selectedType === '請求書発行' || selectedType === '経費精算' || selectedType === '出張旅費精算') && (
                        // ===== 修正: Cardコンポーネント側で shadow, rounded 対応 =====
                        <Card>
                          <CardHeader className="p-6 pb-2"><StepTitle step={2} title="ファイルアップロード & AI解析" desc="領収書や請求書をドラッグ＆ドロップ。手動選択も可能です。" /></CardHeader>
                          <CardContent className="p-6 pt-2">
                            {/* ===== 修正: rounded-lg を追加 ===== */}
                            <motion.div whileHover={{ scale: 1.01 }} className="border-2 border-dashed p-8 bg-slate-100 text-center cursor-pointer hover:bg-slate-200 rounded-lg">
                              <Upload className="opacity-60 mx-auto" />
                              <div className="text-sm mt-2">ここにファイルをドラッグ＆ドロップ</div>
                              <div className="text-xs text-muted-foreground">PDF / 画像（JPG, PNG）</div>
                              {/* ===== 修正: rounded-md を適用 (Button側) ===== */}
                              <Button variant="outline" className="mt-3 h-10"><FileUp size={16}/> ファイルを選択</Button>
                            </motion.div>
                          </CardContent>
                        </Card>
                      )}

                      {/* ===== 追加: 請求書受領（仕入側）のAI検知リスト ===== */}
                      {/* ===== 修正: 「仕入請求書」に変更 ===== */}
                      {selectedType === '仕入請求書' && (
                        <>
                          <Card>
                            <CardHeader className="p-6 pb-2">
                              <StepTitle 
                                step={2} 
                                title="AI受領検知リスト（仕入請求書）" 
                                desc="メールや連携SaaSからAIが自動検知した請求書です。内容を確認してください。" 
                              />
                            </CardHeader>
                            <CardContent className="p-6 pt-2 space-y-2">
                              <div className="grid grid-cols-5 gap-3 text-xs font-medium text-muted-foreground px-2 py-1">
                                <div>受領日</div>
                                <div className="col-span-2">取引先名</div>
                                <div>金額</div>
                                <div>状態 / AI推測</div>
                              </div>
                              {receivedInvoices.map(inv => (
                                <button 
                                  key={inv.id} 
                                  onClick={() => setSelectedInvoiceId(inv.id)}
                                  className={`w-full text-left grid grid-cols-5 gap-3 border p-3 rounded-lg transition ${selectedInvoiceId === inv.id ? 'bg-blue-50 border-blue-400 ring-1 ring-blue-300' : 'hover:bg-gray-100'}`}
                                >
                                  <div className="text-sm">{inv.receivedDate}</div>
                                  <div className="text-sm font-medium col-span-2 truncate">{inv.vendor}</div>
                                  <div className="text-sm">{inv.amount ? inv.amount.toLocaleString() + '円' : <span className="text-gray-400">N/A</span>}</div>
                                  <div className="text-xs">
                                    {inv.status === 'スキップ済 (自動登録)' ? (
                                      <span className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-800 rounded-full">
                                        <Check size={14}/> {inv.status}
                                      </span>
                                    ) : (
                                      <span className={`px-2 py-0.5 rounded-full ${inv.status === '確認中' ? 'bg-yellow-100 text-yellow-800' : 'bg-slate-200 text-slate-700'}`}>
                                        {inv.status}
                                      </span>
                                    )}
                                    <div className="mt-1 text-slate-500 truncate">AI: {inv.aiGuess}</div>
                                  </div>
                                </button>
                              ))}
                              <div className="flex justify-end gap-2 pt-2">
                                <Button variant="outline" className="h-10">AI検知リストを更新</Button>
                                <Button className="h-10 bg-green-600 hover:bg-green-700">
                                  <CheckCircle size={16}/> {receivedInvoices.filter(i => i.status === '確認中').length}件を仕訳登録へ
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                          
                          {/* 選択した請求書の確認・修正フォーム */}
                          {selectedInvoice && (
                            <Card>
                              <CardHeader className="p-6 pb-2">
                                <StepTitle 
                                  step={3} 
                                  title={`[${selectedInvoice.vendor}] の確認・修正`}
                                  desc="AIが抽出した内容を確認し、必要に応じて修正してください。" 
                                />
                              </CardHeader>
                              <CardContent className="p-6 pt-2 space-y-3">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                  <Input placeholder="金額（AI）" value={selectedInvoice.amount || ''} className="h-11" />
                                  <Input placeholder="日付（AI）" value={selectedInvoice.receivedDate || ''} className="h-11" />
                                  <select className="h-11 border px-3 text-sm bg-white border-gray-300 rounded-md">
                                    <option>{selectedInvoice.aiGuess}（AI推奨）</option>
                                    <option>仕入高</option>
                                    <option>地代家賃</option>
                                    <option>広告宣伝費</option>
                                    <option>消耗品費</option>
                                  </select>
                                </div>
                                <Textarea placeholder="備考・メモ（例：PO-1025紐付け）" />
                                <div className="flex items-center gap-3">
                                  <Button className="flex items-center gap-2 h-11"><Send size={18}/> この内容で仕訳登録</Button>
                                  <Button variant="destructive" className="flex items-center gap-2 h-11"><XCircle size={18}/> この検知は無視</Button>
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </>
                      )}

                      {/* === 交通費精算（ウィザードのみ） === */}
                      {/* 最終：AI転記の汎用フォーム（請求書発行・経費精算のみ表示） */}
                      {/* ===== 修正: 「請求書」 -> 「請求書発行（販売側）」 ===== */}
                      {/* ===== 修正: 「請求書発行」に変更 ===== */}
                      {(selectedType === '請求書発行' || selectedType === '経費精算') && (
                        // ===== 修正: Cardコンポーネント側で shadow, rounded 対応 =====
                        <Card>
                          {/* ===== 修正: Step 2 -> 3 に変更（発行側はファイルアップがStep 2のため） ===== */}
                          <CardHeader className="p-6 pb-2"><StepTitle step={3} title="AI転記結果の確認・修正" desc="AIが抽出した内容を確認し、必要に応じて修正してください。" /></CardHeader>
                          <CardContent className="p-6 pt-2 space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              {/* ===== 修正: (Input側で対応) ===== */}
                              <Input placeholder="金額（AI）" className="h-11" />
                              <Input placeholder="日付（AI）" className="h-11" />
                              <select className="h-11 border px-3 text-sm bg-white border-gray-300 rounded-md">
                                <option>勘定科目（AI推奨）</option>
                                {/* ===== 修正: 「請求書発行」に変更 ===== */}
                                {selectedType === '請求書発行' && <option>売上高</option>}
                                {selectedType === '経費精算' && <option>消耗品費</option>}
                              </select>
                            </div>
                            {/* ===== 修正: w-full をコンポーネント定義側に移動 ===== */}
                            <Textarea placeholder="備考・メモ（差戻対策など）" />
                            {/* ===== 修正: (Button側で対応) ===== */}
                            <div className="flex items-center gap-3"><Button className="flex items-center gap-2 h-11"><Send size={18}/> 申請を送信</Button></div>
                          </CardContent>
                        </Card>
                      )}
                    </TabsContent>
                  </Tabs>

                  {/* 参考：申請後のAI BPO処理 */}
                  {/* ===== 修正: bg-gray-50 -> bg-slate-100, Card側で rounded, shadow ===== */}
                  <Card className="bg-slate-100 border border-slate-200">
                    <CardHeader className="p-6 pb-2"><CardTitle className="text-base font-semibold">📄 参考：申請後に行われるAIチョッパヤの処理</CardTitle></CardHeader>
                    <CardContent className="p-6 pt-2">
                      <ul className="list-disc pl-5 text-sm leading-6 text-slate-600">
                        <li>AIが内容を照合し、承認要否を判定（信頼度判定）</li>
                        <li>高確度は自動登録、低確度はBPOまたは承認者へ分岐</li>
                        <li>結果と進捗はSlackに通知</li>
                        <li>差戻・修正情報を学習データとして再学習</li>
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* 申請履歴 */}
                {/* ===== 修正: pt-5 を追加 ===== */}
                <TabsContent value="history" className="space-y-4 pt-5">
                  {/* ===== 修正: Cardコンポーネント側で shadow, rounded 対応 ===== */}
                  {/* ===== エラー修正: 申請履歴(applicant)のCardタグ内が破損していたため修復 ===== */}
                  <Card>
                    <CardHeader className="p-6 pb-3 flex justify-between items-center">
                      <CardTitle className="text-lg font-semibold">申請履歴</CardTitle>
                      <Button 
                        variant="outline" 
                        onClick={() => exportCSV([
                          ['ID','種類','件名','金額','状態','日付']
                        ].concat(filteredAppHist.map(h => [h.id,h.type,h.title,h.amount,h.status,h.date])), 'applicant_history.csv')} 
                        className="gap-2 h-10">
                        <Download size={16}/> CSV出力
                      </Button>
                    </CardHeader>
                    <CardContent className="p-6 pt-2 space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1 min-w-[200px]"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"/><Input value={appHistQuery} onChange={(e)=>setAppHistQuery(e.target.value)} placeholder="件名で検索" className="pl-9 h-10 w-full"/></div>
                        <select value={appHistKind} onChange={(e)=>setAppHistKind(e.target.value)} className="h-10 border px-3 text-sm bg-white border-gray-300 rounded-md min-w-[130px]">
                          <option>すべて</option>
                          {/* ===== 修正: 履歴フィルタにも「発行」「受領」を反映 ===== */}
                          {/* ===== 修正: 「(仕入側)」「(販売側)」を削除 ===== */}
                          <option>仕入請求書</option>
                          <option>請求書発行</option>
                          <option>経費精算</option><option>交通費精算</option><option>稟議・購買</option><option>出張申請</option><option>出張旅費精算</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-5 gap-2 text-xs font-medium text-muted-foreground px-1"><div>ID</div><div>種類</div><div>件名</div><div>金額</div><div>状態/日付</div></div>
                      <div className="mt-1 space-y-2">
                        {filteredAppHist.map(h => (
                          // ===== 修正: rounded-lg を追加, hover:bg-gray-100 =====
                          <div key={h.id} className="grid grid-cols-5 gap-2 text-sm border p-2 hover:bg-gray-100 rounded-lg">
                            <div>{h.id}</div><div>{h.type}</div><div className="truncate">{h.title}</div><div>{h.amount.toLocaleString()}円</div><div>{h.status}（{h.date}）</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </TabsContent>

            {/* ===== 承認者画面（まとめ承認対応） ===== */}
            {/* ===== 修正: pt-6 を追加 ===== */}
            <TabsContent value="approver" className="max-w-6xl mx-auto space-y-6 px-6 pb-12 pt-6">
              <Tabs defaultValue="inbox">
                {/* ===== 修正: pt-4 を削除 ===== */}
                <div className="flex items-center justify-between border-b">
                  <TabsList className="bg-transparent p-0"><SectionTabsTrigger value="inbox">承認待ち一覧</SectionTabsTrigger></TabsList>
                  <TabsList className="bg-transparent p-0"><SectionTabsTrigger value="history">承認履歴を見る</SectionTabsTrigger></TabsList>
                </div>

                {/* ===== 修正: pt-5 を追加 ===== */}
                <TabsContent value="inbox" className="space-y-5 pt-5">
                  {/* ===== 修正: Master-Detail UIを廃止し、viewModeで切り替え ===== */}
                  
                  {/* リスト表示 (approverViewMode === 'list') */}
                  {approverViewMode === 'list' && (
                    <div className="space-y-3">
                      {/* ===== 修正: Cardコンポーネント側で shadow, rounded 対応 ===== */}
                      <Card>
                        <CardHeader className="p-6 pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-semibold">承認待ち一覧</CardTitle>
                            <div className="flex gap-2">
                              {/* ===== 修正: (Button側で対応) ===== */}
                              {/* ===== エラー修正: ButtonのonClickが壊れていたのを修正 ===== */}
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="gap-2" 
                                onClick={() => exportCSV([
                                  ['ID','種類','件名','金額','状態']
                                ].concat(filteredInbox.map(r => [r.id, r.type, r.title, r.amount, r.status])), 'inbox_list.csv')}
                              >
                                <Download size={16}/> CSV出力
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-6 pt-2 space-y-3">
                          <div className="flex items-center gap-2">
                            {/* ===== 修正: (Input側で対応) ===== */}
                            <div className="relative flex-1"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"/><Input value={inboxQuery} onChange={(e)=>setInboxQuery(e.target.value)} placeholder="件名で検索" className="pl-9 h-10 w-full"/></div>
                            {/* ===== 修正: フィルタに「支払承認（仕入）」を追加 ===== */}
                            <select value={inboxKind} onChange={(e)=>setInboxKind(e.target.value)} className="h-10 border px-3 text-sm bg-white border-gray-300 rounded-md min-w-[130px]">
                              <option>すべて</option>
                              <option>支払承認（仕入）</option>
                              <option>経費精算</option>
                              <option>交通費精算</option>
                              <option>稟議・購買</option>
                              <option>出張申請</option>
                              <option>出張旅費精算</option>
                            </select>
                          </div>
                          {/* 一括承認バー */}
                          <BulkApproveBar selectedIds={bulkSelected} onApprove={bulkApprove} onReject={bulkReject} />
                          {filteredInbox.map((r) => (
                            <InboxRow 
                              key={r.id} 
                              r={r} 
                              selected={bulkSelected.has(r.id)} 
                              onToggle={() => toggleBulk(r.id)} 
                              onClickTitle={() => { setSelectedId(r.id); setApproverViewMode('detail'); }} 
                            />
                          ))}
                        </CardContent>
                      </Card>
                    </div>
                  )}
                  
                  {/* 詳細表示 (approverViewMode === 'detail') */}
                  {approverViewMode === 'detail' && (
                    <div className="space-y-4">
                      {/* ===== 修正: (Button側で対応) ===== */}
                      <Button variant="outline" className="mb-4" onClick={() => setApproverViewMode('list')}>← 一覧に戻る</Button>
                      
                      {/* ===== 修正: Cardコンポーネント側で shadow, rounded 対応 ===== */}
                      <Card>
                        <CardHeader className="p-6 pb-1 relative">
                          {/* ===== 修正: rounded-full を追加 ===== */}
                          <span className="absolute top-4 right-4 px-3 py-1 bg-cyan-100 text-cyan-800 text-xs font-semibold rounded-full">
                            {selected.type}
                          </span>
                          <StepTitle step={1} title="申請内容を確認" desc="申請情報と証憑を確認し、判断してください。" />
                        </CardHeader>
                        <CardContent className="p-6 pt-2 space-y-4">
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {/* ===== 修正: rounded-lg, bg-slate-50 を追加 ===== */}
                            {/* =====【UI修正3】: 5W1Hの背景色を bg-slate-100 に変更 ===== */}
                            <div className="p-3 bg-slate-100 border rounded-lg"><div className="text-[10px] uppercase text-muted-foreground">Who</div><div className="text-sm">{selected.whoName}（{selected.whoDept}）</div></div>
                            <div className="p-3 bg-slate-100 border rounded-lg"><div className="text-[10px] uppercase text-muted-foreground">To</div><div className="text-sm">{selected.whereTo}</div></div>
                            <div className="p-3 bg-slate-100 border rounded-lg"><div className="text-[10px] uppercase text-muted-foreground">What</div><div className="text-sm">{selected.what}</div></div>
                            <div className="p-3 bg-slate-100 border rounded-lg"><div className="text-[10px] uppercase text-muted-foreground">When</div><div className="text-sm">{selected.when}</div></div>
                            <div className="p-3 bg-slate-100 border rounded-lg"><div className="text-[10px] uppercase text-muted-foreground">Why</div><div className="text-sm">{selected.why}</div></div>
                            <div className="p-3 bg-slate-100 border rounded-lg"><div className="text-[10px] uppercase text-muted-foreground">How</div><div className="text-sm">{selected.how}</div></div>
                          </div>
                          
                          {/* ===== エラー修正: ここから ===== */}
                          {/* seleccion.attachments.length のブロックが破損していました */}
                          {selected.attachments.length > 0 && (
                            <div>
                              <div className="text-sm font-medium mb-2">添付ファイル</div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {selected.attachments.map((f, idx) => (<AttachmentPreview key={idx} file={f} />))}
                              </div>
                            </div>
                          )}
                          <div className="flex flex-wrap items-center gap-2 text-sm">
                            {/* ===== 修正: rounded-full を追加 ===== */}
                            <span className="px-2 py-0.5 text-xs bg-slate-200 rounded-full">金額：{selected.amount.toLocaleString()} {selected.currency}</span>
                            {selected.vendor !== '—' && <span className="px-2 py-0.5 text-xs bg-slate-200 rounded-full">取引先：{selected.vendor}</span>}
                            {/* ===== 修正: リスク判定のロジックを微調整 ===== */}
                            <span className={`px-2 py-0.5 text-xs rounded-full ${selected.risk.includes('低') ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-900'}`}>リスク：{selected.risk}</span>
                            <span className="px-2 py-0.5 text-xs bg-slate-200 rounded-full">AI確度：{Math.round(selected.confidence*100)}%</span>
                          </div>
                          {/* ===== エラー修正: ここまで ===== */}

                        </CardContent>
                      </Card>

                      {/* ===== 修正: Cardコンポーネント側で shadow, rounded 対応 ===== */}
                      <Card>
                        <CardHeader className="p-6 pb-2"><StepTitle step={2} title="チェックリスト" desc="AI+BPOの事前確認項目です。必要に応じて目視確認してください。" /></CardHeader>
                        <CardContent className="p-6 pt-2 space-y-2">
                          {selected.checklist.map((c, i) => (
                            // ===== 修正: rounded-lg を追加, rounded-full (タグ) =====
                            <div key={i} className="flex items-center justify-between border p-2 rounded-lg">
                              <span className="text-sm">{c.k}</span>
                              {/* ===== 修正: ok=false の場合（アラート）のスタイルを調整 ===== */}
                              <span className={`text-xs px-2 py-0.5 rounded-full ${c.ok ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-900 font-semibold'}`}>{c.ok ? 'OK' : '要確認'}</span>
                            </div>
                          ))}
                        </CardContent>
                      </Card>

                      {/* ===== 修正: bg-slate-100, Card側で rounded, shadow ===== */}
                      <Card className="bg-slate-100 border-slate-200">
                        <CardHeader className="p-6 pb-0"><StepTitle step={3} title="承認または却下" desc="操作を選択し、必要ならコメントを残してください。" /></CardHeader>
                        <CardContent className="flex flex-col gap-3 py-4 p-6 pt-2">
                          <div className="flex gap-3">
                            {/* ===== 修正: (Button側で対応) ===== */}
                            <Button onClick={approve} className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white"><CheckCircle size={18}/> 承認</Button>
                            <Button onClick={reject} variant="destructive" className="flex items-center gap-1"><XCircle size={18}/> 却下</Button>
                          </div>
                          {/* ===== 修正: (Textarea側で対応) ===== */}
                          <Textarea placeholder="コメント（却下時は必須）" value={comment} onChange={(e)=>setComment(e.target.value)} />
                        </CardContent>
                      </Card>

                      {/* ===== 修正: bg-slate-100, Card側で rounded, shadow ===== */}
                      <Card className="bg-slate-100 border border-slate-200">
                        <CardHeader className="p-6 pb-2"><CardTitle className="text-base font-semibold">⚙️ 参考：承認後に行われるAIチョッパヤの処理</CardTitle></CardHeader>
                        <CardContent className="p-6 pt-2">
                          <ul className="list-disc pl-5 text-sm leading-6 text-slate-600">
                            <li>SaaS登録（freee / バクラク / SmartHR 等）</li>
                            <li>Drive保存と監査ログログ生成</li>
                            <li>AIモデル再学習とリスク推定更新</li>
                            <li>Slackへの承認通知・履歴反映</li>
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </TabsContent>
                {/* ===== 修正: pt-5 を追加 ===== */}
                <TabsContent value="history" className="space-y-4 pt-5">
                  {/* ===== 修正: Cardコンポーネント側で shadow, rounded 対応 ===== */}
                  <Card>
                    <CardHeader className="p-6 pb-3 flex justify-between items-center"><CardTitle className="text-lg font-semibold">承認履歴</CardTitle><Button variant="outline" onClick={() => exportCSV([
                    ].concat(filteredApprHist.map(h => [h.id,h.type,h.title,h.amount,h.action,h.date])), 'approver_history.csv')} className="gap-2 h-10"><Download size={16}/> CSV出力</Button></CardHeader>
                    <CardContent className="p-6 pt-2 space-y-3">
                      <div className="flex items-center gap-2">
                        {/* ===== 修正: (Input側で対応) ===== */}
                        <div className="relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"/><Input value={apprHistQuery} onChange={(e)=>setApprHistQuery(e.target.value)} placeholder="件名で検索" className="pl-9 h-10 w-56"/></div>
                        {/* ===== 修正: 履歴フィルタにも「支払承認（仕入）」を追加 ===== */}
                        <select value={apprHistKind} onChange={(e)=>setApprHistKind(e.target.value)} className="h-10 border px-3 text-sm bg-white border-gray-300 rounded-md min-w-[130px]">
                          <option>すべて</option>
                          <option>支払承認（仕入）</option>
                          <option>経費精算</option>
                          <option>交通費精算</option>
                          <option>稟議・購買</option>
                          <option>出張申請</option>
                          <option>出張旅費精算</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-6 gap-2 text-xs font-medium text-muted-foreground px-1"><div>ID</div><div>種類</div><div>件名</div><div>金額</div><div>操作</div><div>日付</div></div>
                      <div className="mt-1 space-y-2">
                        {filteredApprHist.map(h => (
                          // ===== 修正: rounded-lg を追加, hover:bg-gray-100 =====
                          <div key={h.id} className="grid grid-cols-6 gap-2 text-sm border p-2 hover:bg-gray-100 rounded-lg">
                            <div>{h.id}</div><div>{h.type}</div><div className="truncate">{h.title}</div><div>{h.amount.toLocaleString()}円</div><div>{h.action}</div><div>{h.date}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </TabsContent>
            
            {/* 「経費ダッシュボード」タブ（独立） */}
            {/* ===== 修正: pt-6 を追加 ===== */}
            <TabsContent value="cost_dashboard" className="max-w-6xl mx-auto space-y-6 px-6 pb-12 pt-6">
              {/* ===== 修正: Cardコンポーネント側で shadow, rounded 対応 ===== */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-bold flex items-center gap-2"><LineChart className="text-cyan-600" />経費ダッシュボード（10月度）</CardTitle>
                   <p className="text-sm text-slate-500 pt-2">
                     ※このダッシュボードは「チョッパヤ」で収集した経費・請求データのみを表示しています。<span className="font-semibold text-cyan-700">SaaS連携を行うと「経営ダッシュボード」タブで売上を含めた経営全体の可視化が可能です。</span>
                   </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* KPIカード (経費のみ) */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* ===== 修正: Cardコンポーネント側で shadow, rounded 対応 ===== */}
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">当月経費 合計</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{formatYen(costDashboardData.kpi.currentMonthTotal)}</div>
                        <div className="text-slate-500">
                          前月比: {formatDiffPercent(costDashboardData.kpi.currentMonthTotal, costDashboardData.kpi.prevMonthTotal, true)}
                        </div>
                      </CardContent>
                    </Card>
                    {/* ===== 修正: Cardコンポーネント側で shadow, rounded 対応 ===== */}
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">前月経費 合計</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{formatYen(costDashboardData.kpi.prevMonthTotal)}</div>
                         <div className="text-sm text-slate-500">&nbsp;</div>
                      </CardContent>
                    </Card>
                    {/* ===== 修正: Cardコンポーネント側で shadow, rounded 対応 ===== */}
                    <Card className="bg-yellow-50 border-yellow-200">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-yellow-800">AIによるアラート件数</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-yellow-900">{costDashboardData.kpi.alerts} <span className="text-lg">件</span></div>
                        <div className="text-sm text-yellow-700">（通常パターンからの逸脱）</div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* 月次経費推移 */}
                  {/* ===== 修正: Cardコンポーネント側で shadow, rounded 対応 ===== */}
                  <Card>
                    <CardHeader className="pb-4">
                      <CardTitle className="text-base font-semibold flex items-center gap-2"><TrendingUp size={18} />月次経費（販管費＋原価）推移</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-7 gap-4">
                        {costDashboardData.monthlyTrend.map(d => (
                          <CostMonthlyBar key={d.name} name={d.name} total={d.total} max={maxCostMonthlyTrend} />
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* 内訳 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* ===== 修正: Cardコンポーネント側で shadow, rounded 対応 ===== */}
                    <Card>
                      <CardHeader className="pb-4">
                        <CardTitle className="text-base font-semibold flex items-center gap-2"><PieChart size={18} />勘定科目別 内訳（当月）</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {costDashboardData.byAccount.map(d => (
                          <CostBreakdownBar key={d.name} name={d.name} total={d.total} max={totalByAccount} color={d.color} />
                        ))}
                      </CardContent>
                    </Card>
                    {/* ===== 修正: Cardコンポーネント側で shadow, rounded 対応 ===== */}
                    <Card>
                      <CardHeader className="pb-4">
                        <CardTitle className="text-base font-semibold flex items-center gap-2"><Users size={18} />部門別 内訳（当月）</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {costDashboardData.byDept.map(d => (
                          <CostBreakdownBar key={d.name} name={d.name} total={d.total} max={totalByDept} color={d.color} />
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* 経営ダッシュボード */}
            {/* ===== 修正: pt-6 を追加 ===== */}
            <TabsContent value="pl_dashboard" className="max-w-6xl mx-auto space-y-6 px-6 pb-12 pt-6">
              {/* ===== 修正: Cardコンポーネント側で shadow, rounded 対応 ===== */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-bold flex items-center gap-2"><LineChart className="text-indigo-600" />経営ダッシュボード（10月度）</CardTitle>
                   <p className="text-sm text-slate-500 pt-2">
                     ※このP/Lは、freee（会計）およびSquare（POS）とのSaaS連携をAIが自動整流化した想定のデモです。
                   </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* KPIカード */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* ===== 修正: Cardコンポーネント側で shadow, rounded 対応 ===== */}
                    <Card className="bg-white border-cyan-200">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-cyan-800 flex items-center gap-1"><DollarSign size={16} />当月売上</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{formatYen(plDashboardData.kpi.salesCurrent)}</div>
                        <div className="text-slate-500">
                          前月比: {formatDiffPercent(plDashboardData.kpi.salesCurrent, plDashboardData.kpi.salesPrev)}
                        </div>
                      </CardContent>
                    </Card>
                    {/* ===== 修正: Cardコンポーネント側で shadow, rounded 対応 ===== */}
                    <Card className="bg-white border-indigo-200">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-indigo-800 flex items-center gap-1"><TrendingUp size={16} />当月営業利益</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{formatYen(plDashboardData.kpi.profitCurrent)}</div>
                        <div className="text-slate-500">
                           前月比: {formatDiffPercent(plDashboardData.kpi.profitCurrent, plDashboardData.kpi.profitPrev)}
                        </div>
                      </CardContent>
                    </Card>
                    {/* ===== 修正: Cardコンポーネント側で shadow, rounded 対応 ===== */}
                    <Card className="bg-yellow-50 border-yellow-200">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-yellow-800 flex items-center gap-1"><AlertTriangle size={16} />当月総費用</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-yellow-900">{formatYen(plDashboardData.kpi.costCurrent)}</div>
                        <div className="text-slate-500">
                          前月比: {formatDiffPercent(plDashboardData.kpi.costCurrent, plDashboardData.kpi.costPrev, true)}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* ===== 修正: ラベル変更 `月次P/L推移` -> `月次経営成績推移`, Card側で shadow, rounded ===== */}
                  <Card>
                    <CardHeader className="pb-4">
                      <CardTitle className="text-base font-semibold flex items-center gap-2">月次経営成績推移</CardTitle>
                      <div className="flex gap-4 text-sm mt-2">
                        {/* ===== 修正: rounded を追加 ===== */}
                        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-cyan-400 rounded"/> 売上</div>
                        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-indigo-400 rounded"/> 営業利益</div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {/* このグラフはダミーデータで描画されます */}
                      <MonthlyBarChart data={plDashboardData.monthlyTrend} max={maxSalesTrend} />
                    </CardContent>
                  </Card>

                  {/* 費用内訳 */}
                  {/* ===== 修正: Cardコンポーネント側で shadow, rounded 対応 ===== */}
                  <Card>
                    <CardHeader className="pb-4">
                      <CardTitle className="text-base font-semibold flex items-center gap-2"><PieChart size={18} />総費用 内訳（当月）</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                      <div className="w-full max-w-[300px] mx-auto">
                        <PieChartSVG data={plDashboardData.costBreakdown} total={totalCost} />
                      </div>
                      <div className="space-y-3">
                        {plDashboardData.costBreakdown.map(d => (
                           <div key={d.name} className="flex items-center justify-between text-sm">
                             <div className="flex items-center gap-2">
                               {/* ===== 修正: rounded-full を追加 ===== */}
                               {/* ===== 修正: className (bg-*) からインラインstyle (backgroundColor) に変更 ===== */}
                               <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: d.colorHex }} />
                               <span className="font-medium">{d.name}</span>
                             </div>
                             <span className="font-medium text-slate-600">{formatYen(d.total)}</span>
                           </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </TabsContent>

          {/* ===== 構造修正 =====
             外側に移動した Tabs コンポーネントの閉じタグ
          */}
          </Tabs>
        {/* </div> */} {/* 削除: この div は 490行目 (ヘッダーの終わり) に移動した */}
      {/* </div> */} {/* 削除: この div は 491行目 (ヘッダーの終わり) に移動した */}
    </motion.div>
  );
}

{/* ===== エラー修正: ファイル末尾の重複した export default function App() { ... を削除 ===== */}
