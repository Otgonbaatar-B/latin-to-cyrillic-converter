"use client";

import { useState, ChangeEvent } from "react";
import { Copy, RotateCcw, ArrowRight } from "lucide-react";

export default function Home() {
  const [latinText, setLatinText] = useState<string>("");
  const [cyrillicText, setCyrillicText] = useState<string>("");
  const [showAlert, setShowAlert] = useState(false);

  // Unicode mappings
  const MONGOLIAN_VOWELS = {
    MASCULINE: ["\u0430", "\u043E", "\u0443"], // а, о, у
    FEMININE: ["\u044D", "\u0438", "\u04E9", "\u04AF"], // э, и, ө, ү
  };

  const commonWords: { [key: string]: string } = {
    ni: "нь",
    yu: "ю",
    yum: "юм",
    ug: "үг",
    odor: "өдөр",
    onoodor: "өнөөдөр",
    ondog: "өндөг",
    manai: "манай",
    gert: "гэрт",
    shuudangiin: "шуудангийн",
    hurgelt: "хүргэлт",
    irsen: "ирсэн",
    zuir: "зүйр",
    tsetsen: "цэцэн",
    buleehen: "бүлээхэн",
    huiten: "хүйтэн",
    holduu: "хөлдүү",
    dagval: "дагвал",
    gerel: "гэрэл",
    mongol: "монгол",
  };

  const basicMapping: { [key: string]: string } = {
    a: "\u0430", // а
    b: "\u0431", // б
    v: "\u0432", // в
    g: "\u0433", // г
    d: "\u0434", // д
    ye: "\u0435", // е
    yo: "\u0451", // ё
    j: "\u0436", // ж
    z: "\u0437", // з
    i: "\u0438", // и
    k: "\u043A", // к
    l: "\u043B", // л
    m: "\u043C", // м
    n: "\u043D", // н
    p: "\u043F", // п
    r: "\u0440", // р
    s: "\u0441", // с
    t: "\u0442", // т
    f: "\u0444", // ф
    h: "\u0445", // х
    ts: "\u0446", // ц
    ch: "\u0447", // ч
    sh: "\u0448", // ш
    yu: "\u044E", // ю
    ya: "\u044F", // я
    e: "\u044D", // э
    o: "\u043E", // о
    u: "\u0443", // у
    uu: "\u0443\u0443", // уу
    ee: "\u044D\u044D", // ээ
    aa: "\u0430\u0430", // аа
    oo: "\u043E\u043E", // оо
    ө: "\u04E9", // ө
    ү: "\u04AF", // ү
  };

  const isMasculineWord = (word: string): boolean => {
    const vowels = word.match(/[aeiouөү]/g) || [];
    return vowels.some((v) => ["a", "o", "u"].includes(v));
  };

  const suffixes: { [key: string]: string } = {
    oi: "ой",
    ui: "уй",
    ei: "эй",
    ai: "ай",
    ya: "я",
    iyaa: "ья",
    iye: "ье",
    iyaatai: "ьяатай",
    tai: "тай",
    tei: "тэй",
    toi: "той",
    iig: "ийг",
    iin: "ийн",
    nii: "ний",
    giin: "гийн",
  };

  const convertSuffix = (word: string): string => {
    for (const [suffix, replacement] of Object.entries(suffixes)) {
      if (word.endsWith(suffix)) {
        const base = word.slice(0, -suffix.length);
        const convertedBase = convertWord(base);
        return (
          convertedBase +
          (isMasculineWord(convertedBase)
            ? replacement.replace(/[эү]/g, (match) =>
                match === "э" ? "а" : "у"
              )
            : replacement)
        );
      }
    }
    return word;
  };

  const convertWord = (word: string): string => {
    // Handle common words first
    if (commonWords[word]) {
      return commonWords[word];
    }

    let result = word.toLowerCase();

    // Handle "ai" to "ай" conversion
    result = result.replace(/ai/g, "ай");
    result = result.replace(/ei/g, "эй");
    result = result.replace(/ii/g, "ий");
    result = result.replace(/ya/g, "я");
    result = result.replace(/iyaa/g, "ья");
    result = result.replace(/iye/g, "ье");

    // Handle compound characters
    result = result.replace(/sh/g, "ш");
    result = result.replace(/ch/g, "ч");
    result = result.replace(/ts/g, "ц");
    result = result.replace(/yu/g, "ю");

    // Determine word gender using vowel harmony (masculine or feminine)
    const isMasculine = isMasculineWord(result);

    // Apply vowel harmony based on gender
    if (isMasculine) {
      // Masculine: 'o' -> 'о', 'u' -> 'у'
      result = result.replace(/o/g, "\u043E"); // 'о' (Cyrillic O)
      result = result.replace(/u/g, "\u0443"); // 'у' (Cyrillic U)
      result = result.replace(/ui/g, "уй");
      result = result.replace(/oi/g, "ой");
    } else {
      // Feminine: 'o' -> 'ө', 'u' -> 'ү'
      result = result.replace(/o/g, "\u04E9"); // 'ө' (Cyrillic O with hook)
      result = result.replace(/u/g, "\u04AF"); // 'ү' (Cyrillic U with hook)
      result = result.replace(/ui/g, "үй");
      result = result.replace(/oi/g, "өй");
    }

    // Convert ii endings based on word gender
    if (result.endsWith("ii")) {
      result = result.slice(0, -2) + (isMasculine ? "ы" : "ий");
    }

    // Convert remaining characters based on basicMapping
    result = result
      .split("")
      .map((char) => basicMapping[char] || char)
      .join("");

    return result;
  };

  const convertToCyrillic = (text: string): string => {
    let result = text
      .toLowerCase()
      .split(/\s+/)
      .map((word) => {
        if (word === "ni") return "нь";
        return convertWord(word);
      })
      .join(" ");

    // Handle punctuation
    result = result.replace(/\./g, ".");
    result = result.replace(/\,/g, ",");

    return result;
  };

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    const text = e.target.value;
    setLatinText(text);
    setCyrillicText(convertToCyrillic(text));
  };

  const handleCopyToClipboard = async (): Promise<void> => {
    await navigator.clipboard.writeText(cyrillicText);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 2000);
  };

  const handleClear = (): void => {
    setLatinText("");
    setCyrillicText("");
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      {showAlert && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-500 text-green-800 px-4 py-3 rounded shadow-lg">
          Хөрвүүлэгдсэн текст амжилттай хуулагдлаа!
        </div>
      )}

      <div className="w-full max-w-6xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Латин - Кирилл хөрвүүлэгч
          </h1>
          <p className="text-gray-600">
            Латин үсгээр бичсэн текстээ Монгол Кирилл үсэг рүү хөрвүүлээрэй
          </p>
        </div>

        <div className="grid md:grid-cols-[1fr,auto,1fr] gap-6 items-start">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Латин текст
            </label>
            <textarea
              value={latinText}
              onChange={handleInputChange}
              placeholder="Латин текстээ энд оруулна уу..."
              className="w-full h-64 p-4 rounded-lg border border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 resize-none"
            />
          </div>

          <div className="hidden md:flex items-center justify-center h-64">
            <ArrowRight className="w-8 h-8 text-gray-400" />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Кирилл текст
            </label>
            <div className="relative">
              <textarea
                value={cyrillicText}
                readOnly
                className="w-full h-64 p-4 rounded-lg border border-gray-200 bg-gray-50 shadow-sm resize-none"
              />
              <div className="absolute bottom-4 right-4 space-x-2">
                <button
                  onClick={handleCopyToClipboard}
                  className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition duration-200"
                  title="Хуулж авах"
                >
                  <Copy className="w-5 h-5" />
                </button>
                <button
                  onClick={handleClear}
                  className="p-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600 transition duration-200"
                  title="Арилгах"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
