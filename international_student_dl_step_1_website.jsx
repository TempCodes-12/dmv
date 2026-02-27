import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Circle, Search, MapPin, Phone } from "lucide-react";

type DmvOffice = { name: string; address: string; phone: string };

type CommentItem = {
  type: "General Comment" | "Request to Edit Steps";
  text: string;
  createdAt: number;
};

function filterDmvs(permitDmvs: DmvOffice[], query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return permitDmvs;
  return permitDmvs.filter((d) =>
    `${d.name} ${d.address} ${d.phone}`.toLowerCase().includes(q)
  );
}

function CommentSection() {
  const STORAGE_KEY = "stl_intl_dl_comments_v1";
  const [type, setType] = useState<CommentItem["type"]>("General Comment");
  const [text, setText] = useState("");
  const [comments, setComments] = useState<CommentItem[]>([]);

  // Load saved comments (client-side) so they persist after refresh.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return;
      // Basic shape check
      const safe = parsed
        .filter(
          (x: any) =>
            x &&
            (x.type === "General Comment" || x.type === "Request to Edit Steps") &&
            typeof x.text === "string" &&
            typeof x.createdAt === "number"
        )
        .slice(0, 200);
      setComments(safe);
    } catch {
      // ignore
    }
  }, []);

  // Save comments on change.
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(comments));
    } catch {
      // ignore
    }
  }, [comments]);

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setComments((prev) => [{ type, text: trimmed, createdAt: Date.now() }, ...prev]);
    setText("");
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <select
          value={type}
          onChange={(e) => setType(e.target.value as CommentItem["type"])}
          className="border rounded-2xl px-3 py-2 text-sm w-full bg-white"
        >
          <option>General Comment</option>
          <option>Request to Edit Steps</option>
        </select>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write your comment here…"
          className="border rounded-2xl px-3 py-2 text-sm w-full min-h-[100px] bg-white"
        />

        <Button
          onClick={handleSubmit}
          className="rounded-2xl bg-sky-600 hover:bg-sky-700 text-white"
        >
          Submit Comment
        </Button>
      </div>

      <div className="space-y-3">
        {comments.length === 0 && (
          <p className="text-sm text-gray-500">No comments yet. Be the first to contribute.</p>
        )}
        {comments.map((c, index) => (
          <div key={`${c.createdAt}-${index}`} className="p-3 border rounded-2xl bg-white/70">
            <div className="text-xs font-semibold text-gray-500">{c.type}</div>
            <div className="text-sm">{c.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function STLInternationalDLGuide() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [dmvQuery, setDmvQuery] = useState("");

  const toggleCheck = (item: string) => {
    setChecked((prev) => ({ ...prev, [item]: !prev[item] }));
  };

  const ChecklistItem = ({ id, label }: { id: string; label: string }) => (
    <div
      onClick={() => toggleCheck(id)}
      className="flex items-start gap-3 cursor-pointer p-2 hover:bg-gray-100/70 rounded-xl"
      role="checkbox"
      aria-checked={!!checked[id]}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggleCheck(id);
        }
      }}
    >
      <div className="pt-0.5">
        {checked[id] ? (
          <CheckCircle className="text-green-600" />
        ) : (
          <Circle className="text-gray-400" />
        )}
      </div>
      <span className="text-sm md:text-base leading-snug">{label}</span>
    </div>
  );

  const progressTotal = 5;
  const progressDone = ["nossn", "passport", "visa", "i94", "address"].filter(
    (k) => checked[k]
  ).length;

  const permitDmvs: DmvOffice[] = [
    { name: "AFTON (003)", address: "9513 Gravois Rd, Afton", phone: "(314) 631-1311" },
    { name: "ARNOLD (133)", address: "108 Richardson Crossing, Arnold", phone: "(636) 461-0846" },
    { name: "BRIDGETON (160)", address: "11977 St Charles Rock Rd Suite 111, Bridgeton", phone: "(314) 298-0127" },
    { name: "CENTRAL WEST END (052)", address: "4041 Lindell Blvd, St Louis", phone: "(314) 925-8330" },
    { name: "CHESTERFIELD (114)", address: "14838 Clayton Road, Chesterfield", phone: "(636) 386-5177" },
    { name: "CLAYTON (162)", address: "141 N Meramec Ave Ste 201, Clayton", phone: "(314) 499-7223" },
    { name: "CREVE COEUR (142)", address: "12933 Olive Blvd, St Louis", phone: "(314) 878-2110" },
    { name: "DES PERES (147)", address: "1080 Old Des Peres Road, Des Peres", phone: "(314) 909-1514" },
    { name: "FLORISSANT (035)", address: "650 N Hwy 67, Florissant", phone: "(314) 474-5045" },
    { name: "HARVESTER (148)", address: "4217-19 Old Hwy 94 South, Saint Charles", phone: "(636) 441-6074" },
    { name: "HIGH RIDGE (122)", address: "1684 Gravois Road, High Ridge", phone: "(636) 677-5339" },
    { name: "IMPERIAL (133)", address: "1238 Main St, Imperial", phone: "(636) 464-3330" },
    { name: "MAPLEWOOD (204)", address: "3238 Laclede Station Road, Maplewood", phone: "(314) 645-1044" },
    { name: "OAKVILLE (166)", address: "3164 Telegraph Road, St Louis", phone: "(314) 887-1050" },
    { name: "OFALLON (173)", address: "2421 Highway K, O Fallon", phone: "(636) 271-5300" },
    { name: "OLIVETTE (171)", address: "9652 Olive Blvd, St Louis", phone: "(314) 692-8222" },
    { name: "OVERLAND (118)", address: "10292 Page Avenue, St Louis", phone: "(314) 890-0880" },
    { name: "PACIFIC (017)", address: "730 Osage, Pacific", phone: "(636) 393-4011" },
    { name: "SAINT CHARLES (050)", address: "1982 Zumbehl Rd, St Charles", phone: "(636) 946-4456" },
    { name: "SOUTH COUNTY (154)", address: "111 Concord Plaza Shopping Center, St Louis", phone: "(314) 843-5223" },
    { name: "SOUTH KINGSHIGHWAY (200)", address: "4628 South Kingshighway, St Louis", phone: "(314) 752-3177" },
    { name: "WEST COUNTY (149)", address: "15533 Manchester Road, Ballwin", phone: "(636) 230-5041" },
  ];

  const filteredDmvs = useMemo(() => filterDmvs(permitDmvs, dmvQuery), [permitDmvs, dmvQuery]);

  const testSites = [
    { name: "Hazelwood", address: "7232 N. Lindbergh Blvd, Hazelwood, MO 63042", phone: "314-731-4418", note: "" },
    { name: "Manchester", address: "703 Big Bend Rd, Ballwin, MO 63021", phone: "636-300-2899", note: "" },
    { name: "St. Peters", address: "580 N. Service Rd, St. Peters, MO 63376", phone: "636-278-2925", note: "" },
    { name: "St. Louis (Koch Rd)", address: "3180 Koch Rd, St. Louis, MO 63125", phone: "314-416-2180", note: "" },
    { name: "Chouteau", address: "3101 Chouteau Ave, St Louis, MO 63103", phone: "314-933-7292", note: "Mondays only" },
    { name: "Jefferson / Festus", address: "1255 N Truman Blvd, Crystal City, MO 63019", phone: "636-543-4383", note: "Wednesdays & Thursdays only" },
  ];

  const roadTestSites = [
    { name: "Manchester", address: "703 Big Bend Rd", phone: "636-300-2899" },
    { name: "Koch Rd (South County)", address: "3180 Koch Rd", phone: "314-416-2180" },
    { name: "Hazelwood", address: "7232 N. Lindbergh", phone: "314-731-4418" },
    { name: "St. Peters", address: "580 N Service Rd", phone: "636-278-2925" },
    { name: "St. Charles", address: "2495 Raymond Rd", phone: "636-940-3320" },
    { name: "Festus", address: "1255 N Truman", phone: "636-300-2874" },
    { name: "Chouteau (Mon & Tue only)", address: "3101 Chouteau Ave", phone: "314-933-7292" },
    { name: "Jennings (Mon & Tue only)", address: "8501 Lucas and Hunt", phone: "314-877-2222" },
    { name: "South Travel", address: "Call for location", phone: "573-934-0235" },
    {
      name: "North Travel",
      address: "Tue @ St. Clair | Wed @ Troy | Thu @ Warrenton (1,3,5) | Thu @ BG (2,4) | Fri @ Washington",
      phone: "636-221-5269",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-purple-50">
      <div className="p-6 max-w-5xl mx-auto space-y-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/70 border border-sky-100 px-3 py-1 text-xs text-sky-700 w-fit">
            <span className="h-2 w-2 rounded-full bg-sky-500" />
            Missouri • St. Louis Area • International Students
          </div>
          <h1 className="text-3xl font-bold text-slate-900">St. Louis Driver’s License Guide for International Students</h1>
          <p className="text-sm text-gray-600">Built as a simple checklist you can follow step-by-step.</p>
          <div className="flex items-center gap-3 text-sm">
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-sky-600 to-purple-600 h-2"
                style={{ width: `${Math.round((progressDone / progressTotal) * 100)}%` }}
              />
            </div>
            <span className="min-w-[90px] text-gray-600">{progressDone}/{progressTotal} ready</span>
          </div>
        </div>

        {/* STEP 1 */}
        <Card className="rounded-2xl shadow-md bg-white/80">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">Step 1: Prepare Required Documents</h2>
            <p className="text-sm text-gray-600">
              Most international students do NOT have an SSN. Start with the <span className="font-medium">No SSN letter</span>.
            </p>

            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 text-sm">
              <div className="font-semibold">Study before you go</div>
              <p className="mt-1">Before taking your permit test, study the Missouri Driver Guide.</p>
              <a
                href="https://driving-tests.org/wp-content/uploads/2025/09/MO_Driver-Guide.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium underline"
              >
                Download Missouri Driver Guide (PDF)
              </a>
            </div>

            <div className="space-y-2">
              <ChecklistItem id="nossn" label="No SSN Letter (needed if you don’t have a Social Security Number)" />
              <ChecklistItem id="passport" label="Passport" />
              <ChecklistItem id="visa" label="Recent/valid F-1 Visa" />
              <ChecklistItem id="i94" label="I-94 (arrival/departure record from when you entered the U.S.)" />
              <ChecklistItem id="address" label="Proof of address (lease, utility bill, or bank mail with your name + date)" />
            </div>
          </CardContent>
        </Card>

        {/* STEP 2 */}
        <Card className="rounded-2xl shadow-md bg-white/80">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">Step 2: Take the Permit Test</h2>
            <p className="text-sm text-red-600 font-medium">Check locations before going. Some may be closed due to staffing issues.</p>
            <p className="text-sm text-gray-600">Testing website: statepatrol.dps.mo.gov</p>

            <div className="grid md:grid-cols-2 gap-4">
              <Card className="rounded-2xl">
                <CardContent className="p-4 space-y-2">
                  <div className="font-semibold">How the test works</div>
                  <ul className="list-disc pl-6 space-y-1 text-sm md:text-base">
                    <li>25 multiple choice questions</li>
                    <li>Need at least 20 correct</li>
                    <li>If you miss more than 5 → automatic fail</li>
                    <li>You can take up to 2 tests per day</li>
                    <li>After the written permit exam, you will also take a <span className="font-medium">vision test</span>.</li>
                    <li>Study <span className="font-medium">road signs</span> — they show up often.</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="rounded-2xl">
                <CardContent className="p-4 space-y-2">
                  <div className="font-semibold">Bring with you</div>
                  <ul className="list-disc pl-6 space-y-1 text-sm md:text-base">
                    <li>Passport + F-1 Visa</li>
                    <li>I-94</li>
                    <li>Proof of address</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card className="rounded-2xl">
              <CardContent className="p-4 space-y-3">
                <div className="font-semibold">Social Security Requirement (VERY IMPORTANT)</div>
                <ul className="list-disc pl-6 space-y-2 text-sm md:text-base">
                  <li>
                    <span className="font-medium">If you HAVE an SSN:</span>
                    <ul className="list-disc pl-6 mt-1 space-y-1">
                      <li>Bring your original Social Security Card (not laminated).</li>
                      <li>Name must match your passport and immigration documents.</li>
                      <li>If your SSN was previously verified in Missouri, you may sometimes provide the number verbally — but bringing the card is safest.</li>
                    </ul>
                  </li>
                  <li>
                    <span className="font-medium">If you DO NOT have an SSN (most F-1 students):</span>
                    <ul className="list-disc pl-6 mt-1 space-y-1">
                      <li>Get a <span className="font-medium">No SSN Verification Letter</span> from the Social Security Administration (SSA).</li>
                      <li>
                        Find your nearest SSA office: <a href="https://www.ssa.gov/locator" target="_blank" rel="noopener noreferrer" className="font-medium underline">ssa.gov/locator</a>
                      </li>
                      <li>Every SSA office may have different procedures — <span className="font-medium">call the office first</span> and confirm what documents they require.</li>
                      <li>Bring passport, valid F-1 visa, and I-94 when requesting the letter.</li>
                      <li>The letter must be original and recently issued.</li>
                    </ul>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-4 pt-2">
              {testSites.map((s) => (
                <div key={`${s.name}-${s.phone}`} className="p-4 rounded-2xl border bg-white/60">
                  <div className="font-semibold flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> {s.name}{" "}
                    {s.note ? <span className="text-xs text-gray-500 font-normal">({s.note})</span> : null}
                  </div>
                  <div className="text-sm text-gray-700">{s.address}</div>
                  <div className="text-sm text-gray-700 flex items-center gap-2">
                    <Phone className="w-4 h-4" /> {s.phone}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* STEP 3 */}
        <Card className="rounded-2xl shadow-md bg-white/80">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">Step 3: Get Your Learner’s Permit Card (DMV)</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <Card className="rounded-2xl">
                <CardContent className="p-4 space-y-2">
                  <div className="font-semibold">What to expect</div>
                  <ul className="list-disc pl-6 space-y-1 text-sm md:text-base">
                    <li>Go to a Missouri DMV office</li>
                    <li>Pay about <span className="font-medium">$16–$20</span></li>
                    <li>Cash is recommended (cards may have extra fees)</li>
                    <li>You will receive a <span className="font-medium">paper permit</span> you can use as proof of permit + ID</li>
                    <li>Your physical permit card usually arrives within <span className="font-medium">2 weeks</span></li>
                    <li>You may be asked to complete the <span className="font-medium">vision test again</span> when getting your learner’s permit card.</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="rounded-2xl">
                <CardContent className="p-4 space-y-2">
                  <div className="font-semibold">Want a REAL ID permit?</div>
                  <p className="text-sm text-gray-600">If you choose REAL ID, you can use your learner’s permit as an ID for domestic flights.</p>
                  <div className="text-sm md:text-base">
                    <div className="font-medium">Extra thing to bring (simple version)</div>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Bring <span className="font-medium">one more proof of address</span> (mail/bank letter with your name + date)</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="rounded-2xl">
              <CardContent className="p-4 space-y-3">
                <div className="font-semibold">REAL ID document checklist (keep it simple)</div>
                <div className="grid md:grid-cols-2 gap-4 text-sm md:text-base">
                  <div className="space-y-1">
                    <div className="font-medium">1) Identity + lawful status</div>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Foreign passport</li>
                      <li>Valid U.S. visa (F-1)</li>
                      <li>I-94</li>
                    </ul>
                  </div>
                  <div className="space-y-1">
                    <div className="font-medium">2) Social Security</div>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>SSN Card (if you have one)</li>
                      <li>OR No SSN Verification Letter</li>
                    </ul>
                  </div>
                  <div className="space-y-1">
                    <div className="font-medium">3) Proof of Missouri residence (2 documents)</div>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Must be from 2 different sources</li>
                      <li>Examples: utility bill, lease, bank mail, government mail</li>
                    </ul>
                  </div>
                  <div className="space-y-1">
                    <div className="font-medium">4) Name change (only if needed)</div>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Marriage certificate, divorce decree, court order, etc.</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-gray-500" />
                <input
                  value={dmvQuery}
                  onChange={(e) => setDmvQuery(e.target.value)}
                  placeholder="Search DMV by name, city, or phone…"
                  className="w-full border rounded-2xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-300 bg-white"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {filteredDmvs.map((d) => (
                  <div key={`${d.name}-${d.phone}`} className="p-4 rounded-2xl border bg-white/60">
                    <div className="font-semibold">{d.name}</div>
                    <div className="text-sm text-gray-700 flex items-center gap-2">
                      <MapPin className="w-4 h-4" /> {d.address}
                    </div>
                    <div className="text-sm text-gray-700 flex items-center gap-2">
                      <Phone className="w-4 h-4" /> {d.phone}
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-xs text-gray-500">Tip: Call ahead for hours and REAL ID processing.</div>
            </div>
          </CardContent>
        </Card>

        {/* STEP 4 */}
        <Card className="rounded-2xl shadow-md bg-white/80">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">Step 4: Take the Driving (Road) Test</h2>

            <Card className="rounded-2xl">
              <CardContent className="p-4 space-y-2">
                <div className="font-semibold">Before you go</div>
                <ul className="list-disc pl-6 space-y-1 text-sm md:text-base">
                  <li>Bring your learner’s permit / ID card</li>
                  <li>If walking in, go <span className="font-medium">early in the morning</span></li>
                  <li>Only take the test if you are fully ready</li>
                  <li>You only get <span className="font-medium">3 total attempts</span></li>
                  <li>If you fail 3 times, you must complete a special driving course before testing again</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardContent className="p-4 space-y-2">
                <div className="font-semibold">Pro Tip</div>
                <p className="text-sm md:text-base">
                  Try to remember the exact route the instructor takes you on. If you fail and need to retake the test, you can practice that same route before your next attempt.
                </p>
                <p className="text-sm text-gray-600">Recommended location: <span className="font-medium">Koch Road</span></p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardContent className="p-4 space-y-3">
                <div className="font-semibold">Extra Driving Test Tips</div>
                <ul className="list-disc pl-6 space-y-2 text-sm md:text-base">
                  <li><span className="font-medium">Koch Road</span> is known for kind and professional examiners. Many students feel more comfortable testing there.</li>
                  <li>Use a car you are <span className="font-medium">very familiar with</span>. The first part of the test checks basic vehicle controls.</li>
                  <li>You may be asked to turn on headlights, left/right signals, hazard lights, windshield wipers, heater, and defroster (including mirror defrost).</li>
                  <li>When parking on a slope, remember to <span className="font-medium">turn your wheels correctly</span> and use the parking brake.</li>
                  <li>When reversing or turning, <span className="font-medium">physically turn your head</span> clearly in the direction you are moving. Do not rely only on mirrors — the examiner must see you checking.</li>
                  <li>Practice <span className="font-medium">parallel parking</span> carefully — this is usually the final part of the test.</li>
                  <li>Always obey the <span className="font-medium">speed limit</span>.</li>
                </ul>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-4">
              {roadTestSites.map((s) => (
                <div key={`${s.name}-${s.phone}`} className="p-4 rounded-2xl border bg-white/60">
                  <div className="font-semibold">{s.name}</div>
                  <div className="text-sm text-gray-700 flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> {s.address}
                  </div>
                  <div className="text-sm text-gray-700 flex items-center gap-2">
                    <Phone className="w-4 h-4" /> {s.phone}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* STEP 5 */}
        <Card className="rounded-2xl shadow-md bg-white/80">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">Step 5: Get Your Driver’s License Card</h2>

            <Card className="rounded-2xl">
              <CardContent className="p-4 space-y-2">
                <div className="font-semibold">What to expect</div>
                <ul className="list-disc pl-6 space-y-1 text-sm md:text-base">
                  <li>Go to a Missouri DMV office</li>
                  <li>Pay about <span className="font-medium">$16–$20</span></li>
                  <li>Cash is recommended (cards may have extra fees)</li>
                  <li>You will receive a <span className="font-medium">temporary paper license</span></li>
                  <li>Your physical driver’s license card usually arrives within <span className="font-medium">2 weeks</span></li>
                  <li>You will take the <span className="font-medium">vision test again</span> before your license is issued.</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardContent className="p-4 space-y-3">
                <div className="font-semibold">What to Know for the Vision Test</div>
                <ul className="list-disc pl-6 space-y-2 text-sm md:text-base">
                  <li>You will read letters or numbers from a vision chart (like an eye doctor test).</li>
                  <li>You may be tested on <span className="font-medium">peripheral vision</span> (seeing from the side).</li>
                  <li>You may be asked to identify some <span className="font-medium">road signs</span>.</li>
                  <li>If you wear glasses or contacts, <span className="font-medium">bring them</span> and use them during the test.</li>
                  <li>If you fail the vision screening, you may need an eye doctor form before your license is issued.</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardContent className="p-4 space-y-2">
                <div className="font-semibold">Want a REAL ID Driver’s License?</div>
                <p className="text-sm text-gray-600">A REAL ID allows you to board domestic flights using only your driver’s license.</p>
                <ul className="list-disc pl-6 space-y-1 text-sm md:text-base">
                  <li>Bring identity documents (passport + visa + I-94 for F-1 students)</li>
                  <li>Bring SSN card OR No SSN letter</li>
                  <li>Bring two different Missouri address documents</li>
                  <li>Bring name change documents if applicable</li>
                </ul>
                <p className="text-xs text-gray-500">Official REAL ID guide: dor.mo.gov/driver-license/issuance/real-id/interactive-guide.html</p>
              </CardContent>
            </Card>

            <div className="text-sm text-gray-600">You can use the same DMV offices listed in Step 3 (searchable list above).</div>
          </CardContent>
        </Card>

        {/* BUY ME A COFFEE */}
        <Card className="rounded-2xl shadow-md border border-purple-100 bg-white/80">
          <CardContent className="p-6 space-y-3">
            <h2 className="text-xl font-semibold text-slate-900">Support This Guide</h2>
            <p className="text-sm text-gray-600">If this guide helped you, you can support future updates (new tips, location changes, and fixes).</p>
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              <a
                href="https://buymeacoffee.com/zedd12"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium bg-amber-500 hover:bg-amber-600 text-white"
              >
                Buy me a coffee ☕
              </a>
              <div className="text-xs text-gray-500">
                Tip: Replace the link with <span className="font-medium">your</span> Buy Me a Coffee page.
              </div>
            </div>
          </CardContent>
        </Card>

        {/* COMMUNITY COMMENTS */}
        <Card className="rounded-2xl shadow-md bg-white/80">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">Community Comments & Suggestions</h2>
            <p className="text-sm text-gray-600">Share feedback to improve this guide or leave helpful tips for other students.</p>
            <CommentSection />
          </CardContent>
        </Card>

        <div className="text-center">
          <Button className="rounded-2xl px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white">Complete Guide</Button>
        </div>

        {/* Basic “tests” (runs only in dev) */}
        {typeof process !== "undefined" && process.env?.NODE_ENV !== "production" ? (
          <div className="hidden">
            {(() => {
              console.assert(
                filterDmvs(permitDmvs, "").length === permitDmvs.length,
                "filterDmvs should return all when query empty"
              );
              console.assert(
                filterDmvs(permitDmvs, "AFTON").some((d) => d.name.includes("AFTON")),
                "filterDmvs should match by name"
              );
              console.assert(
                filterDmvs(permitDmvs, "631-1311").some((d) => d.phone.includes("631-1311")),
                "filterDmvs should match by phone"
              );
              console.assert(
                filterDmvs(permitDmvs, "afton").some((d) => d.name.includes("AFTON")),
                "filterDmvs should be case-insensitive"
              );
              // Added test: address search
              console.assert(
                filterDmvs(permitDmvs, "Gravois").some((d) => d.address.toLowerCase().includes("gravois")),
                "filterDmvs should match by address"
              );
              return null;
            })()}
          </div>
        ) : null}
      </div>
    </div>
  );
}
