import React, { useState, useEffect } from "react";
import { Button } from "./components/ui/button";
import { RadioGroup, RadioGroupItem } from "./components/ui/radio-group";

// 🟨 메인 컴포넌트
export default function App() {
  const [mode, setMode] = useState(null);
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  if (mode === "custom")
    return <WaffleCustomizer onBack={() => setMode(null)} />;
  if (mode === "recommended") {
    return (
      <RecommendedMenu
        selected={selectedRecommendation}
        onSelect={setSelectedRecommendation}
        onSubmit={() => setSubmitted(true)}
        submitted={submitted}
        onBack={() => setMode(null)}
      />
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-xl mx-auto text-center">
      <h1 className="text-2xl font-bold">🧇 와플 주문 방식 선택</h1>
      <div className="space-x-4">
        <Button onClick={() => setMode("recommended")}>추천 메뉴 선택</Button>
        <Button onClick={() => setMode("custom")}>나만의 와플 만들기</Button>
      </div>
    </div>
  );
}

// 🟨 추천 메뉴 컴포넌트
function RecommendedMenu({ selected, onSelect, onSubmit, submitted, onBack }) {
  const [finalNote, setFinalNote] = useState({});

  const recommended = [
    "플레인 + 생크림 + 사과잼",
    "카카오 + 누텔라 + 생크림",
    "카카오 + 누텔라 + 딸기 아이스크림",
    "플레인 + 요거트 아이스크림 + 사과잼",
  ];

  const generateInitialNotes = (item) => {
    const newNote = {};
    if (item.includes("누텔라")) {
      newNote["초코칩 추가해주세요"] = false;
      newNote["초코시럽 빼주세요"] = false;
    }
    if (item.includes("생크림") || item.includes("요거트 생크림")) {
      newNote["생크림 많이 (4덩이)"] = false;
      newNote["생크림 적게 (2덩이)"] = false;
      newNote["생크림 아주 적게 (한 면에 펴서)"] = false;
    }
    if (item.includes("잼")) {
      newNote["잼 조금만 뿌려주세요"] = false;
    }
    return newNote;
  };

  const handleMenuSelect = (item) => {
    onSelect(item);
    const notes = generateInitialNotes(item);
    setFinalNote(notes);
  };

  const handleSubmit = () => {
    onSubmit(); // 상태 유지
  };

  return (
    <div className="p-6 space-y-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-center">🥞 추천 와플 선택</h1>

      <div className="space-y-2">
        {recommended.map((item, idx) => (
          <label
            key={idx}
            className={`block p-4 border rounded cursor-pointer ${
              selected === item ? "bg-yellow-100" : ""
            }`}
            onClick={() => handleMenuSelect(item)}
          >
            <input
              type="radio"
              name="recommendation"
              checked={selected === item}
              onChange={() => {}}
              className="mr-2"
            />
            {item}
          </label>
        ))}
      </div>

      <div className="space-y-4 mt-4">
        <div>
          <h2 className="font-semibold">STEP 4. 추가 요청사항 (선택)</h2>
          <div className="space-y-2">
            {Object.keys(finalNote)
              .filter((k) => k !== "기타")
              .map((item) => (
                <label
                  key={item}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={!!finalNote[item]}
                    onChange={() =>
                      setFinalNote({ ...finalNote, [item]: !finalNote[item] })
                    }
                  />
                  <span>{item}</span>
                </label>
              ))}
            <textarea
              placeholder="기타 요청사항이 있다면 입력해주세요"
              className="w-full p-2 border rounded"
              value={finalNote["기타"] || ""}
              onChange={(e) =>
                setFinalNote({ ...finalNote, 기타: e.target.value })
              }
            />
          </div>
        </div>
        <Button variant="outline" onClick={onBack}>
          ← 돌아가기
        </Button>
        <Button onClick={handleSubmit} disabled={!selected}>
          주문하기
        </Button>
      </div>

      {submitted && selected && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h2 className="text-lg font-bold mb-2">🧾 주문표</h2>
          <p>
            <strong>선택한 메뉴:</strong> {selected}
          </p>
          <p>
            <strong>요청사항:</strong>{" "}
            {Object.entries(finalNote)
              .map(([k, v]) => (v && k !== "기타" ? k : null))
              .filter(Boolean)
              .join(", ") || "없음"}
          </p>
          {finalNote["기타"] && (
            <p>
              <strong>기타:</strong> {finalNote["기타"]}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export function WaffleCustomizer({ onBack }) {
  const [step1, setStep1] = useState("");
  const [step1_1, setStep1_1] = useState({});
  const [step2, setStep2] = useState({});
  const [step2_1, setStep2_1] = useState([]);
  const [step3, setStep3] = useState({});
  const [finalNote, setFinalNote] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // ✅ 요청사항 자동 생성 및 유지
  useEffect(() => {
    const newNote = {};
    const spreads = Object.keys(step1_1);
    const hasNutella = spreads.includes("누텔라");
    const creams = Object.keys(step2).filter((k) =>
      ["생크림", "요거트 생크림"].includes(k)
    );
    const hasJam = Object.keys(step3).length > 0;

    if (hasNutella) {
      newNote["초코칩 추가해주세요"] =
        finalNote["초코칩 추가해주세요"] || false;
      newNote["초코시럽 빼주세요"] = finalNote["초코시럽 빼주세요"] || false;
    }
    if (creams.length > 0) {
      newNote["생크림 많이 (4덩이)"] =
        finalNote["생크림 많이 (4덩이)"] || false;
      newNote["생크림 적게 (2덩이)"] =
        finalNote["생크림 적게 (2덩이)"] || false;
      newNote["생크림 아주 적게 (한 면에 펴서)"] =
        finalNote["생크림 아주 적게 (한 면에 펴서)"] || false;
    }
    if (hasJam) {
      newNote["잼 조금만 뿌려주세요"] =
        finalNote["잼 조금만 뿌려주세요"] || false;
    }

    if (finalNote["기타"]) {
      newNote["기타"] = finalNote["기타"];
    }

    setFinalNote(newNote);
  }, [step1_1, step2, step3]);

  const getTotalCount = (obj) => Object.values(obj).reduce((a, b) => a + b, 0);

  const handleQuantityChange = (state, setState, item, delta, maxTotal) => {
    const current = state[item] || 0;
    const total = getTotalCount(state);
    const updated = current + delta;
    if (updated < 0) return;
    if (updated === 0) {
      const { [item]: _, ...rest } = state;
      setState(rest);
    } else if (total - current + updated <= maxTotal && updated <= 2) {
      setState({ ...state, [item]: updated });
    }
  };

  const handleStep2Quantity = (item, delta) => {
    handleQuantityChange(step2, setStep2, item, delta, 2);
  };

  const renderQuantityControls = (state, setState, item, maxTotal) => (
    <div className="flex items-center space-x-2">
      <Button
        onClick={() =>
          handleQuantityChange(state, setState, item, -1, maxTotal)
        }
      >
        -
      </Button>
      <span>{state[item] || 0}</span>
      <Button
        onClick={() => handleQuantityChange(state, setState, item, 1, maxTotal)}
      >
        +
      </Button>
    </div>
  );

  const toggleExclusiveMultiSelect = (list, setter, item, max) => {
    if (list.includes(item)) {
      setter(list.filter((i) => i !== item));
    } else if (list.length < max) {
      setter([...list, item]);
    }
  };

  const handleSubmit = () => setSubmitted(true);

  const format = (obj) =>
    Object.entries(obj)
      .filter(([, v]) => v > 0)
      .map(([k, v]) => `${k}${v > 1 ? ` x${v}` : ""}`)
      .join(", ");

  return (
    <div className="p-6 space-y-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-center">🛠️ 나만의 와플 만들기</h1>

      {/* STEP 1 */}
      <div>
        <h2 className="font-semibold">STEP 1. 와플 빵 선택 (1개)</h2>
        <RadioGroup value={step1} onValueChange={setStep1}>
          {["플레인", "카카오", "크런치"].map((item) => (
            <RadioGroupItem key={item} value={item} label={item} />
          ))}
        </RadioGroup>
      </div>

      {/* STEP 1-1 */}
      <div>
        <h2 className="font-semibold">STEP 1-1. 스프레드 선택 (최대 2개)</h2>
        <div className="grid grid-cols-2 gap-2">
          {[
            "슈가버터",
            "누텔라",
            "로투스",
            "땅콩버터",
            "크림치즈",
            "블루베리잼",
          ].map((item) => (
            <div key={item} className="flex items-center justify-between">
              <span>{item}</span>
              {renderQuantityControls(step1_1, setStep1_1, item, 2)}
            </div>
          ))}
        </div>
      </div>

      {/* STEP 2 */}
      <div>
        <h2 className="font-semibold">STEP 2. 메인 토핑 선택 (최대 2개)</h2>
        <div className="grid grid-cols-2 gap-2">
          {[
            "생크림",
            "요거트 생크림",
            "요거트 아이스크림",
            "초코 아이스크림",
            "딸기 아이스크림",
          ].map((item) => (
            <div key={item} className="flex items-center justify-between">
              <span>{item}</span>
              {renderQuantityControls(step2, setStep2, item, 2)}
            </div>
          ))}
        </div>
      </div>

      {/* STEP 2-1 */}
      <div>
        <h2 className="font-semibold">STEP 2-1. 추가 토핑 선택 (최대 3개)</h2>
        <div className="grid grid-cols-2 gap-2">
          {[
            "생과일(믹스)",
            "딸기",
            "바나나",
            "오레오",
            "초코칩",
            "콘푸로스트",
            "땅콩 크런치",
          ].map((item) => (
            <label
              key={item}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={step2_1.includes(item)}
                onChange={() =>
                  toggleExclusiveMultiSelect(step2_1, setStep2_1, item, 3)
                }
              />
              <span>{item}</span>
            </label>
          ))}
        </div>
      </div>

      {/* STEP 3 */}
      <div>
        <h2 className="font-semibold">STEP 3. 잼 선택 (최대 2개)</h2>
        <div className="grid grid-cols-2 gap-2">
          {["사과잼", "딸기잼", "초코시럽", "카라멜시럽"].map((item) => (
            <div key={item} className="flex items-center justify-between">
              <span>{item}</span>
              {renderQuantityControls(step3, setStep3, item, 2)}
            </div>
          ))}
        </div>
      </div>

      {/* STEP 4 */}
      <div>
        <h2 className="font-semibold">STEP 4. 추가 요청사항 (선택)</h2>
        <div className="space-y-2">
          {Object.keys(finalNote)
            .filter((k) => k !== "기타")
            .map((item) => (
              <label
                key={item}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={!!finalNote[item]}
                  onChange={() =>
                    setFinalNote({ ...finalNote, [item]: !finalNote[item] })
                  }
                />
                <span>{item}</span>
              </label>
            ))}
          <textarea
            placeholder="기타 요청사항이 있다면 입력해주세요"
            className="w-full p-2 border rounded"
            value={finalNote["기타"] || ""}
            onChange={(e) =>
              setFinalNote({ ...finalNote, 기타: e.target.value })
            }
          />
        </div>
      </div>

      {/* Submit + Summary */}
      <div className="text-center space-x-2">
        <Button variant="outline" onClick={onBack}>
          ← 돌아가기
        </Button>
        <Button onClick={handleSubmit}>주문하기</Button>
      </div>

      {submitted && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h2 className="text-lg font-bold mb-2">🧾 주문표</h2>
          <p>
            <strong>빵:</strong> {step1 || "선택 안 함"}
          </p>
          <p>
            <strong>스프레드:</strong> {format(step1_1) || "없음"}
          </p>
          <p>
            <strong>메인 토핑:</strong> {format(step2) || "없음"}
          </p>
          <p>
            <strong>추가 토핑:</strong> {step2_1.join(", ") || "없음"}
          </p>
          <p>
            <strong>잼:</strong> {format(step3) || "없음"}
          </p>
          <p>
            <strong>요청사항:</strong>{" "}
            {Object.entries(finalNote)
              .filter(([k, v]) => v === true && k !== "기타")
              .map(([k]) => k)
              .join(", ") || "없음"}
          </p>
          {finalNote["기타"] && (
            <p>
              <strong>기타:</strong> {finalNote["기타"]}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
