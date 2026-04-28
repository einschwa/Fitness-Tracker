import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  set,
  get,
  child,
  remove,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const workoutPlan = {
  "PULL": {
    muscleFocus: "Back, Biceps, Rear Delts, Hamstrings",
    exercises: [
      {
        name: "Conventional Deadlift",
        cues:
          "Hips hinge, bar stays over mid-foot, brace core, drive floor away. Primary strength move — go heavy.",
      },
      {
        name: "Bent-over Barbell Row",
        cues:
          "Hinge ~45°, pull bar to lower chest/upper belly, squeeze shoulder blades at top.",
      },
      {
        name: "Single-arm Dumbbell Row",
        cues:
          "Brace on bench, pull elbow past torso, keep back flat. Log each side separately.",
      },
      {
        name: "Romanian Deadlift (RDL)",
        cues:
          "Soft knees, push hips back, bar stays close to legs. Feel hamstrings stretch at bottom.",
      },
      {
        name: "Dumbbell Bicep Curl",
        cues:
          "Full ROM, slow eccentric (3 sec down), no swinging. Can supinate at top.",
      },
      {
        name: "Rear Delt / Face Pull (DB or Band)",
        cues:
          "Hinge forward, raise arms out/back at shoulder height. High reps, light weight — posture & shoulder health.",
      },
    ],
  },
  "PUSH": {
    muscleFocus: "Chest, Shoulders, Triceps",
    exercises: [
      {
        name: "Overhead Press (Barbell or DB)",
        cues:
          "Press bar overhead, lock out elbows, stack joints. Lower with control. Primary strength move.",
      },
      {
        name: "Bench Press / Floor Press",
        cues:
          "Arch back gently, retract scapula, bar to lower chest. Floor press if no bench — great tricep builder.",
      },
      {
        name: "Dumbbell Incline / Flat Press",
        cues:
          "Use 2 DBs. Keep elbows ~45° from torso. Good chest stretch at bottom.",
      },
      {
        name: "Lateral Raise (DB)",
        cues:
          "Slight forward lean, raise to shoulder height, pinky slightly higher than thumb. Light weight, controlled.",
      },
      {
        name: "Tricep Overhead Extension (DB)",
        cues:
          "Hold one DB overhead with both hands or use one DB each hand. Elbows stay in, full stretch at bottom.",
      },
      {
        name: "Close-Grip / Diamond Push-up",
        cues:
          "Bodyweight finisher. Log reps only. Add weight vest or DB on back when >20 reps feels easy.",
      },
    ],
  },
  "LEG + CORE": {
    muscleFocus: "Quads, Glutes, Hamstrings, Core",
    exercises: [
      {
        name: "Barbell Back Squat / Goblet Squat",
        cues:
          "Brace core, knees track toes, chest tall. Goblet squat if balance is issue. Primary lower strength move.",
      },
      {
        name: "Romanian Deadlift (RDL)",
        cues:
          "Hips back, soft knees, feel hamstring tension. Different focus than Pull Day — use moderate weight.",
      },
      {
        name: "Dumbbell Reverse Lunge",
        cues:
          "Hold 2 DBs at sides. Step back, knee hovers above floor. Easier on knees than forward lunge.",
      },
      {
        name: "Calf Raise (Barbell or DB)",
        cues:
          "Full ROM — stretch at bottom, hold squeeze at top. Use step edge if possible.",
      },
      {
        name: "Plank (Weighted or Standard)",
        cues:
          "Log time in reps column. Neutral spine, glutes squeezed. Add DB on back when 60 sec is easy.",
      },
      {
        name: "Dumbbell Ab Rollout / Pallof Press",
        cues:
          "Rollout: extend arms while keeping core braced. Pallof: anti-rotation hold — great for functional strength.",
      },
    ],
  },
};

const muscleImages = {
  "PULL": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=80",
  "PUSH": "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80",
  "LEG + CORE": "https://images.unsplash.com/photo-1554344058-6f195b2a2cf5?auto=format&fit=crop&w=900&q=80",
};

const exerciseImages = {
  "PULL": {
    "Conventional Deadlift": "assets/Pull/Deadlift.jpeg",
    "Bent-over Barbell Row": "assets/Pull/Bent Over Row.jpeg",
    "Single-arm Dumbbell Row": "assets/Pull/Single Arm Row.jpeg",
    "Romanian Deadlift (RDL)": "assets/Pull/dumbbell-romanian-deadlift.webp",
    "Dumbbell Bicep Curl": "assets/Pull/Dumbbell Biceps Curl.jpeg",
    "Rear Delt / Face Pull (DB or Band)": "assets/Pull/Rear Delt .jpeg",
  },
  "PUSH": {
    "Overhead Press (Barbell or DB)": "assets/Push/Overhead Press.jpeg",
    "Bench Press / Floor Press": "assets/Push/Floor Press.jpeg",
    "Dumbbell Incline / Flat Press": "assets/Push/Flat Press.png",
    "Lateral Raise (DB)": "assets/Push/Lateral Raise.jpeg",
    "Tricep Overhead Extension (DB)": "assets/Push/Overhead Triceps Extension technigue.jpeg",
    "Close-Grip / Diamond Push-up": "assets/Push/Flat Press.png",
  },
  "LEG + CORE": {
    "Barbell Back Squat / Goblet Squat": "assets/Leg + Core/Goblet Squat.webp",
    "Romanian Deadlift (RDL)": "assets/Leg + Core/dumbbell-romanian-deadlift.webp",
    "Dumbbell Reverse Lunge": "assets/Leg + Core/dumbbell-rear-lunge.webp",
    "Calf Raise (Barbell or DB)": "assets/Leg + Core/dumbbell-standing-calf-raise.webp",
    "Plank (Weighted or Standard)": "assets/Leg + Core/Plank.webp",
    "Dumbbell Ab Rollout / Pallof Press": "assets/Leg + Core/Ab Rollout.jpeg",
  },
};

const categoryButtons = document.getElementById("categoryButtons");
const exerciseSelect = document.getElementById("exerciseSelect");
const exerciseCard = document.getElementById("exerciseCard");
const formStatus = document.getElementById("formStatus");
const weeklyTable = document.getElementById("weeklyTable");
const weekRange = document.getElementById("weekRange");
const loginForm = document.getElementById("loginForm");
const loginName = document.getElementById("loginName");
const loginPassword = document.getElementById("loginPassword");
const loginPasswordConfirm = document.getElementById("loginPasswordConfirm");
const loginStatus = document.getElementById("loginStatus");
const modeSignIn = document.getElementById("modeSignIn");
const modeRegister = document.getElementById("modeRegister");
const confirmPasswordWrap = document.getElementById("confirmPasswordWrap");
const rememberMe = document.getElementById("rememberMe");
const analyticsSessions = document.getElementById("analyticsSessions");
const analyticsVolume = document.getElementById("analyticsVolume");
const analyticsSets = document.getElementById("analyticsSets");
const analyticsTopCategory = document.getElementById("analyticsTopCategory");
const logoutButton = document.getElementById("logoutButton");
const userNameDisplay = document.getElementById("userNameDisplay");
const prevWeekButton = document.getElementById("prevWeekButton");
const nextWeekButton = document.getElementById("nextWeekButton");
const trackWeekLabel = document.getElementById("trackWeekLabel");
const loadRangeSelect = document.getElementById("loadRangeSelect");
const loadCategorySelect = document.getElementById("loadCategorySelect");
const loadChartCanvas = document.getElementById("loadChart");
const loadTypeWeight = document.getElementById("loadTypeWeight");
const loadTypeSetReps = document.getElementById("loadTypeSetReps");

const logForm = document.getElementById("logForm");
const weightInput = document.getElementById("weightInput");
const setsInput = document.getElementById("setsInput");
const repsInput = document.getElementById("repsInput");
const notesInput = document.getElementById("notesInput");

let selectedCategory = "PULL";
let selectedExercise = workoutPlan[selectedCategory].exercises[0];
let currentUserName = null;
let currentUserKey = null;
let authMode = "signin";
let weekOffset = 0;
let currentWeekDates = [];
let allWorkoutData = {};
let loadChartInstance = null;
let loadChartType = "weight"; // "weight" or "setReps"

const firebaseApp = initializeApp(window.firebaseConfig);
const db = getDatabase(firebaseApp);

if (categoryButtons) {
  renderCategoryButtons();
}
if (exerciseSelect) {
  setExerciseOptions();
}
if (exerciseCard) {
  renderExerciseCard();
}
if (weeklyTable) {
  renderWeeklyTable({});
}
if (analyticsSessions) {
  setAnalytics({});
}

boot();

if (logForm) {
  logForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!currentUserKey) {
      formStatus.textContent = "Log in before saving.";
      return;
    }
    if (!selectedExercise) {
      formStatus.textContent = "Pick an exercise before saving.";
      return;
    }

    const payload = {
      userName: currentUserName,
      category: selectedCategory,
      exerciseName: selectedExercise.name,
      cues: selectedExercise.cues,
      muscleFocus: workoutPlan[selectedCategory].muscleFocus,
      weightKg: Number(weightInput.value),
      sets: Number(setsInput.value),
      reps: Number(repsInput.value),
      notes: notesInput.value.trim(),
      createdAt: new Date().toISOString(),
    };

    try {
      await saveWorkout(payload);
      formStatus.textContent = "Saved. Keep Pushing. Keep Lifting. Keep it up!";
      logForm.reset();
      await loadWeeklyData();
    } catch (error) {
      formStatus.textContent = "Save failed. Check Firebase config.";
      console.error(error);
    }
  });
}

async function saveWorkout(payload) {
  const dateKey = toDateKey(new Date());
  const recordRef = push(ref(db, `workouts/${currentUserKey}/${dateKey}/${payload.category}/records`));
  await set(recordRef, payload);
}

async function loadWeeklyData() {
  const snapshot = await get(child(ref(db), `workouts/${currentUserKey}`));
  if (!snapshot.exists()) {
    allWorkoutData = {};
    refreshDashboardData();
    return;
  }
  allWorkoutData = snapshot.val() || {};
  refreshDashboardData();
}

function renderCategoryButtons() {
  if (!categoryButtons) {
    return;
  }
  categoryButtons.innerHTML = "";
  Object.keys(workoutPlan).forEach((category) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = category;
    const isActive = category === selectedCategory;
    button.className = `px-4 py-3 rounded-xl border transition ${
      isActive
        ? "bg-emerald-400 text-slate-950 border-emerald-400"
        : "bg-slate-950 text-slate-200 border-slate-700 hover:border-emerald-300"
    }`;
    button.addEventListener("click", () => {
      selectedCategory = category;
      selectedExercise = workoutPlan[selectedCategory].exercises[0];
      renderCategoryButtons();
      setExerciseOptions();
      renderExerciseCard();
    });
    categoryButtons.appendChild(button);
  });
}

function setExerciseOptions() {
  if (!exerciseSelect) {
    return;
  }
  exerciseSelect.innerHTML = "";
  workoutPlan[selectedCategory].exercises.forEach((exercise, index) => {
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = exercise.name;
    exerciseSelect.appendChild(option);
  });
  exerciseSelect.value = "0";
  exerciseSelect.onchange = (event) => {
    const index = Number(event.target.value);
    selectedExercise = workoutPlan[selectedCategory].exercises[index];
    renderExerciseCard();
  };
}

function renderExerciseCard() {
  if (!exerciseCard) {
    return;
  }
  const categoryData = workoutPlan[selectedCategory];
  if (!selectedExercise) {
    exerciseCard.innerHTML = "<p class=\"text-slate-400\">Pick an exercise to see details.</p>";
    return;
  }
  const imageUrl = getExerciseImage(selectedCategory, selectedExercise.name);
  exerciseCard.innerHTML = `
    <div class="flex flex-col gap-4">
      <img
        src="${imageUrl}"
        alt="${selectedCategory} muscle focus"
        class="w-full h-30 object-cover rounded-xl"
      />
      <div>
        <p class="text-xs uppercase tracking-[0.25em] text-emerald-300">${selectedCategory}</p>
        <h3 class="text-xl font-semibold mt-1">${selectedExercise.name}</h3>
        <p class="text-sm text-slate-300 mt-2"><span class="text-emerald-300">Muscle Focus:</span> ${categoryData.muscleFocus}</p>
        <p class="text-sm text-slate-300 mt-3"><span class="text-emerald-300">Cues:</span> ${selectedExercise.cues}</p>
      </div>
    </div>
  `;
}

function getExerciseImage(category, exerciseName) {
  const path = exerciseImages[category]?.[exerciseName];
  if (!path) {
    return muscleImages[category];
  }
  return encodeURI(path);
}

function renderWeeklyTable(weeklyData) {
  if (!weeklyTable) {
    return;
  }
  weeklyTable.innerHTML = "";
  currentWeekDates.forEach((date) => {
    const key = toDateKey(date);
    const dayName = date.toLocaleDateString(undefined, { weekday: "long" });
    const entry = weeklyData[key] || {};
    const hasEntries = Object.keys(entry).length > 0;

    const row = document.createElement("tr");
    row.className = "border-t border-slate-800";

    const dayCell = document.createElement("td");
    dayCell.className = "py-3 text-slate-200";
    dayCell.textContent = dayName;

    const dateCell = document.createElement("td");
    dateCell.className = "py-3 text-slate-400";
    dateCell.textContent = formatDate(date);

    const completionCell = document.createElement("td");
    completionCell.className = "py-3 overflow-visible";

    const categories = Object.keys(entry);
    if (categories.length === 0) {
      completionCell.innerHTML = "<span class=\"text-slate-500\">No data</span>";
    } else {
      const badgeContainer = document.createElement("div");
      badgeContainer.className = "flex flex-wrap gap-2";
      categories.forEach((category) => {
        const records = entry[category]?.records || {};
        const tooltipContent = buildTooltipContent(records);

        const badge = document.createElement("div");
        badge.className = "tooltip-trigger relative";
        badge.innerHTML = `
          <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/10 text-emerald-300 border border-emerald-400/30">
            ${category} <span class="text-xs uppercase">Done</span>
          </span>
          <div class="tooltip-panel absolute z-50 mt-2 w-64 rounded-2xl bg-slate-950 border border-slate-700 p-3 text-xs text-slate-200 shadow-xl">
            <p class="text-emerald-300 font-semibold mb-2">${category} - Details</p>
            ${tooltipContent}
          </div>
        `;
        badgeContainer.appendChild(badge);
      });
      completionCell.appendChild(badgeContainer);
    }

    row.appendChild(dayCell);
    row.appendChild(dateCell);
    row.appendChild(completionCell);

    const actionCell = document.createElement("td");
    actionCell.className = "py-3 text-right";
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.className = `text-xs px-3 py-1 rounded-full border transition ${
      hasEntries
        ? "border-rose-400/60 text-rose-300 hover:border-rose-300"
        : "border-slate-700 text-slate-600 cursor-not-allowed"
    }`;
    deleteButton.disabled = !hasEntries;
    deleteButton.addEventListener("click", async () => {
      if (!hasEntries) {
        return;
      }
      const ok = window.confirm(`Delete all logs for ${dayName} (${formatDate(date)})?`);
      if (!ok) {
        return;
      }
      await deleteDayEntry(key);
    });
    actionCell.appendChild(deleteButton);

    row.appendChild(actionCell);
    weeklyTable.appendChild(row);
  });
}

async function deleteDayEntry(dateKey) {
  if (!currentUserKey) {
    return;
  }
  try {
    await remove(ref(db, `workouts/${currentUserKey}/${dateKey}`));
    await loadWeeklyData();
  } catch (error) {
    console.error(error);
    if (formStatus) {
      formStatus.textContent = "Delete failed. Check Firebase config.";
    }
  }
}

function buildTooltipContent(records) {
  const entries = Object.values(records);
  if (entries.length === 0) {
    return "<p class=\"text-slate-400\">No exercises logged.</p>";
  }
  return `
    <ul class="space-y-2">
      ${entries
        .map((record) => {
          const notes = record.notes ? `<div class=\"text-slate-400\">Notes: ${record.notes}</div>` : "";
          return `
            <li class="border border-slate-800 rounded-xl p-2">
              <div class="font-semibold">${record.exerciseName}</div>
              <div class="text-slate-300">Sets: ${record.sets} | Reps: ${record.reps} | Weight: ${record.weightKg} kg</div>
              ${notes}
            </li>
          `;
        })
        .join("")}
    </ul>
  `;
}

function getWeekDatesByOffset(offset) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dayIndex = (today.getDay() + 6) % 7;
  const monday = new Date(today);
  monday.setDate(today.getDate() - dayIndex + offset * 7);

  const dates = [];
  for (let i = 0; i < 7; i += 1) {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    dates.push(day);
  }
  return dates;
}

function formatDate(date) {
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const name = loginName.value.trim();
    const password = loginPassword.value.trim();
    if (!name || !password) {
      loginStatus.textContent = "Enter name and password.";
      return;
    }
    if (authMode === "register") {
      const confirmPassword = loginPasswordConfirm.value.trim();
      if (!confirmPassword) {
        loginStatus.textContent = "Confirm your password.";
        return;
      }
      if (confirmPassword !== password) {
        loginStatus.textContent = "Passwords do not match.";
        return;
      }
    }
    loginStatus.textContent = "Checking...";
    try {
      if (authMode === "register") {
        const created = await registerUser(name, password);
        if (!created) {
          loginStatus.textContent = "Name already exists. Use Sign In.";
          return;
        }
      } else {
        const isValid = await validateLogin(name, password);
        if (!isValid) {
          loginStatus.textContent = "Access denied. Check credentials.";
          return;
        }
      }
      currentUserName = name;
      currentUserKey = safeKey(name);
      sessionStorage.setItem("ff_user", currentUserName);
      if (rememberMe && rememberMe.checked) {
        localStorage.setItem("ff_user_persist", currentUserName);
      } else {
        localStorage.removeItem("ff_user_persist");
      }
      window.location.href = "app.html";
    } catch (error) {
      loginStatus.textContent = "Login failed. Check database rules.";
      console.error(error);
    }
  });
}

async function validateLogin(name, password) {
  const userKey = safeKey(name);
  const snapshot = await get(child(ref(db), `login/allowedUsers/${userKey}`));
  if (!snapshot.exists()) {
    return false;
  }
  const record = snapshot.val();
  return record.password === password;
}

async function registerUser(name, password) {
  const userKey = safeKey(name);
  const userRef = ref(db, `login/allowedUsers/${userKey}`);
  const snapshot = await get(userRef);
  if (snapshot.exists()) {
    return false;
  }
  await set(userRef, {
    name,
    password,
    createdAt: new Date().toISOString(),
  });
  return true;
}

function safeKey(value) {
  return value.toLowerCase().replace(/[.#$/\[\]]/g, "_").replace(/\s+/g, "-");
}

function boot() {
  const onLoginPage = Boolean(loginForm);
  const onAppPage = Boolean(weeklyTable);

  if (onLoginPage) {
    const rememberedUser = localStorage.getItem("ff_user_persist");
    if (rememberedUser) {
      sessionStorage.setItem("ff_user", rememberedUser);
      window.location.href = "app.html";
      return;
    }
    setAuthMode("signin");
    return;
  }

  if (onAppPage) {
    const storedUser = localStorage.getItem("ff_user_persist") || sessionStorage.getItem("ff_user");
    if (!storedUser) {
      window.location.href = "login.html";
      return;
    }
    sessionStorage.setItem("ff_user", storedUser);
    currentUserName = storedUser;
    currentUserKey = safeKey(storedUser);
    if (userNameDisplay) {
      userNameDisplay.textContent = currentUserName;
    }
    weekOffset = 0;
    loadWeeklyData();
  }
}

function refreshDashboardData() {
  currentWeekDates = getWeekDatesByOffset(weekOffset);

  if (weekRange && currentWeekDates.length > 0) {
    weekRange.textContent = `${formatDate(currentWeekDates[0])} - ${formatDate(currentWeekDates[6])}`;
  }

  if (trackWeekLabel && currentWeekDates.length > 0) {
    trackWeekLabel.textContent = `${currentWeekDates[0].toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    })} - ${currentWeekDates[6].toLocaleDateString(undefined, { month: "short", day: "numeric" })}`;
  }

  const weeklyData = buildWeeklyDataFromAll(currentWeekDates, allWorkoutData);
  renderWeeklyTable(weeklyData);
  setAnalytics(weeklyData);
  renderLoadChart();
}

function buildWeeklyDataFromAll(weekDates, data) {
  const weeklyData = {};
  weekDates.forEach((date) => {
    const key = toDateKey(date);
    weeklyData[key] = data[key] || {};
  });
  return weeklyData;
}

function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateKey(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function computeRecordLoad(record) {
  const weight = Number(record.weightKg || 0);
  return weight;
}

function renderLoadChart() {
  if (!loadChartCanvas || typeof Chart === "undefined") {
    return;
  }

  const range = loadRangeSelect ? loadRangeSelect.value : "month";
  const category = loadCategorySelect ? loadCategorySelect.value : "ALL";

  let chartData;
  let yLabel;

  if (loadChartType === "weight") {
    chartData = buildLoadSeriesByExercise(range, category);
    yLabel = "Weight (kg)";
  } else {
    chartData = buildSetRepsSeriesByExercise(range, category);
    yLabel = "Sets × Reps";
  }

  if (loadChartInstance) {
    loadChartInstance.destroy();
  }

  loadChartInstance = new Chart(loadChartCanvas, {
    type: "line",
    data: {
      labels: chartData.labels,
      datasets: chartData.datasets,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: "#cbd5e1",
          },
          position: "top",
        },
      },
      scales: {
        x: {
          ticks: {
            color: "#94a3b8",
            maxRotation: 0,
          },
          grid: {
            color: "rgba(148, 163, 184, 0.15)",
          },
        },
        y: {
          beginAtZero: true,
          ticks: {
            color: "#94a3b8",
            callback: (value) => {
              if (loadChartType === "weight") {
                return `${Number(value).toLocaleString()} kg`;
              } else {
                return `${Number(value).toLocaleString()}`;
              }
            },
          },
          grid: {
            color: "rgba(148, 163, 184, 0.15)",
          },
        },
      },
    },
  });
}

function buildLoadSeriesByExercise(range, category) {
  const now = new Date();
  const exerciseColors = [
    "#34d399", // emerald
    "#60a5fa", // blue
    "#f87171", // red
    "#fbbf24", // amber
    "#a78bfa", // violet
    "#fb7185", // rose
  ];

  // Get exercises for the category
  let exercisesInCategory = [];
  if (category === "ALL") {
    Object.values(workoutPlan).forEach((plan) => {
      exercisesInCategory = exercisesInCategory.concat(plan.exercises.map((e) => e.name));
    });
  } else {
    exercisesInCategory = workoutPlan[category].exercises.map((e) => e.name);
  }

  const labels = [];
  const dataByExercise = {};

  // Initialize data structure for each exercise
  exercisesInCategory.forEach((exerciseName) => {
    dataByExercise[exerciseName] = [];
  });

  if (range === "year") {
    for (let i = 11; i >= 0; i -= 1) {
      const bucketDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const keyPrefix = `${bucketDate.getFullYear()}-${String(bucketDate.getMonth() + 1).padStart(2, "0")}`;

      exercisesInCategory.forEach((exerciseName) => {
        let exerciseLoad = 0;
        Object.entries(allWorkoutData).forEach(([dateKey, dateEntry]) => {
          if (!dateKey.startsWith(keyPrefix)) {
            return;
          }
          exerciseLoad += computeExerciseLoadInDay(dateEntry, category, exerciseName);
        });
        dataByExercise[exerciseName].push(Math.round(exerciseLoad));
      });

      labels.push(bucketDate.toLocaleDateString(undefined, { month: "short", year: "2-digit" }));
    }
  } else {
    for (let i = 29; i >= 0; i -= 1) {
      const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const dateKey = toDateKey(day);
      const dayEntry = allWorkoutData[dateKey] || {};

      exercisesInCategory.forEach((exerciseName) => {
        const exerciseLoad = computeExerciseLoadInDay(dayEntry, category, exerciseName);
        dataByExercise[exerciseName].push(Math.round(exerciseLoad));
      });

      labels.push(day.toLocaleDateString(undefined, { month: "short", day: "numeric" }));
    }
  }

  // Convert to datasets format
  const datasets = exercisesInCategory.map((exerciseName, idx) => ({
    label: exerciseName,
    data: dataByExercise[exerciseName],
    borderColor: exerciseColors[idx % exerciseColors.length],
    backgroundColor: exerciseColors[idx % exerciseColors.length] + "33",
    borderWidth: 2,
    fill: true,
    tension: 0.3,
    pointRadius: range === "month" ? 2 : 3,
  }));

  return { labels, datasets };
}

function buildSetRepsSeriesByExercise(range, category) {
  const now = new Date();
  const exerciseColors = [
    "#34d399", // emerald
    "#60a5fa", // blue
    "#f87171", // red
    "#fbbf24", // amber
    "#a78bfa", // violet
    "#fb7185", // rose
  ];

  // Get exercises for the category
  let exercisesInCategory = [];
  if (category === "ALL") {
    Object.values(workoutPlan).forEach((plan) => {
      exercisesInCategory = exercisesInCategory.concat(plan.exercises.map((e) => e.name));
    });
  } else {
    exercisesInCategory = workoutPlan[category].exercises.map((e) => e.name);
  }

  const labels = [];
  const dataByExercise = {};

  // Initialize data structure for each exercise
  exercisesInCategory.forEach((exerciseName) => {
    dataByExercise[exerciseName] = [];
  });

  if (range === "year") {
    for (let i = 11; i >= 0; i -= 1) {
      const bucketDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const keyPrefix = `${bucketDate.getFullYear()}-${String(bucketDate.getMonth() + 1).padStart(2, "0")}`;

      exercisesInCategory.forEach((exerciseName) => {
        let exerciseSetReps = 0;
        Object.entries(allWorkoutData).forEach(([dateKey, dateEntry]) => {
          if (!dateKey.startsWith(keyPrefix)) {
            return;
          }
          exerciseSetReps += computeExerciseSetRepsInDay(dateEntry, category, exerciseName);
        });
        dataByExercise[exerciseName].push(Math.round(exerciseSetReps));
      });

      labels.push(bucketDate.toLocaleDateString(undefined, { month: "short", year: "2-digit" }));
    }
  } else {
    for (let i = 29; i >= 0; i -= 1) {
      const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const dateKey = toDateKey(day);
      const dayEntry = allWorkoutData[dateKey] || {};

      exercisesInCategory.forEach((exerciseName) => {
        const exerciseSetReps = computeExerciseSetRepsInDay(dayEntry, category, exerciseName);
        dataByExercise[exerciseName].push(Math.round(exerciseSetReps));
      });

      labels.push(day.toLocaleDateString(undefined, { month: "short", day: "numeric" }));
    }
  }

  // Convert to datasets format
  const datasets = exercisesInCategory.map((exerciseName, idx) => ({
    label: exerciseName,
    data: dataByExercise[exerciseName],
    borderColor: exerciseColors[idx % exerciseColors.length],
    backgroundColor: exerciseColors[idx % exerciseColors.length] + "33",
    borderWidth: 2,
    fill: true,
    tension: 0.3,
    pointRadius: range === "month" ? 2 : 3,
  }));

  return { labels, datasets };
}

function computeExerciseLoadInDay(dayEntry, category, exerciseName) {
  const categories = category === "ALL" ? Object.keys(dayEntry) : [category];
  return categories.reduce((sum, categoryName) => {
    const records = dayEntry[categoryName]?.records ? Object.values(dayEntry[categoryName].records) : [];
    const exerciseRecords = records.filter((r) => r.exerciseName === exerciseName);
    return sum + exerciseRecords.reduce((recSum, rec) => recSum + Number(rec.weightKg || 0), 0);
  }, 0);
}

function computeExerciseSetRepsInDay(dayEntry, category, exerciseName) {
  const categories = category === "ALL" ? Object.keys(dayEntry) : [category];
  return categories.reduce((sum, categoryName) => {
    const records = dayEntry[categoryName]?.records ? Object.values(dayEntry[categoryName].records) : [];
    const exerciseRecords = records.filter((r) => r.exerciseName === exerciseName);
    return sum + exerciseRecords.reduce((recSum, rec) => {
      const sets = Number(rec.sets || 0);
      const reps = Number(rec.reps || 0);
      return recSum + sets * reps;
    }, 0);
  }, 0);
}

function buildLoadSeries(range, category) {
  const now = new Date();

  if (range === "year") {
    const labels = [];
    const values = [];
    for (let i = 11; i >= 0; i -= 1) {
      const bucketDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const keyPrefix = `${bucketDate.getFullYear()}-${String(bucketDate.getMonth() + 1).padStart(2, "0")}`;
      const totalLoad = Object.entries(allWorkoutData).reduce((sum, [dateKey, dateEntry]) => {
        if (!dateKey.startsWith(keyPrefix)) {
          return sum;
        }
        return sum + computeDayLoad(dateEntry, category);
      }, 0);

      labels.push(bucketDate.toLocaleDateString(undefined, { month: "short", year: "2-digit" }));
      values.push(Math.round(totalLoad));
    }
    return { labels, values };
  }

  const labels = [];
  const values = [];
  for (let i = 29; i >= 0; i -= 1) {
    const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    const dateKey = toDateKey(day);
    const dayEntry = allWorkoutData[dateKey] || {};
    labels.push(day.toLocaleDateString(undefined, { month: "short", day: "numeric" }));
    values.push(Math.round(computeDayLoad(dayEntry, category)));
  }
  return { labels, values };
}

function computeDayLoad(dayEntry, category) {
  const categories = category === "ALL" ? Object.keys(dayEntry) : [category];
  return categories.reduce((categorySum, categoryName) => {
    const records = dayEntry[categoryName]?.records ? Object.values(dayEntry[categoryName].records) : [];
    const categoryLoad = records.reduce((recordSum, record) => recordSum + computeRecordLoad(record), 0);
    return categorySum + categoryLoad;
  }, 0);
}

function setAuthMode(mode) {
  authMode = mode;
  const isRegister = mode === "register";
  if (!modeRegister || !modeSignIn || !confirmPasswordWrap) {
    return;
  }
  modeRegister.classList.toggle("bg-emerald-400", isRegister);
  modeRegister.classList.toggle("text-slate-950", isRegister);
  modeRegister.classList.toggle("text-slate-300", !isRegister);
  modeSignIn.classList.toggle("bg-emerald-400", !isRegister);
  modeSignIn.classList.toggle("text-slate-950", !isRegister);
  modeSignIn.classList.toggle("text-slate-300", isRegister);
  confirmPasswordWrap.classList.toggle("hidden", !isRegister);
  if (loginStatus) {
    loginStatus.textContent = "";
  }
}

function setAnalytics(weeklyData) {
  if (!analyticsSessions || !analyticsVolume || !analyticsSets || !analyticsTopCategory) {
    return;
  }
  let totalSessions = 0;
  let totalSets = 0;
  let totalVolume = 0;
  let recordCount = 0;
  const categoryCounts = {};

  Object.values(weeklyData).forEach((day) => {
    Object.entries(day).forEach(([category, payload]) => {
      const records = payload.records ? Object.values(payload.records) : [];
      if (records.length > 0) {
        totalSessions += 1;
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      }
      records.forEach((record) => {
        const sets = Number(record.sets || 0);
        const reps = Number(record.reps || 0);
        const weight = Number(record.weightKg || 0);
        totalSets += sets;
        totalVolume += weight;
        recordCount += 1;
      });
    });
  });

  const topCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0];

  // Calculate averages
  const avgVolume = recordCount > 0 ? Math.round(totalVolume / recordCount) : 0;
  const avgSets = recordCount > 0 ? Math.round(totalSets / recordCount * 10) / 10 : 0;

  analyticsSessions.textContent = String(totalSessions);
  analyticsSets.textContent = String(avgSets);
  analyticsVolume.textContent = `${avgVolume} kg`;
  analyticsTopCategory.textContent = topCategory ? topCategory[0] : "--";
}

if (modeSignIn) {
  modeSignIn.addEventListener("click", () => setAuthMode("signin"));
}
if (modeRegister) {
  modeRegister.addEventListener("click", () => setAuthMode("register"));
}

if (prevWeekButton) {
  prevWeekButton.addEventListener("click", () => {
    weekOffset -= 1;
    refreshDashboardData();
  });
}

if (nextWeekButton) {
  nextWeekButton.addEventListener("click", () => {
    if (weekOffset < 0) {
      weekOffset += 1;
      refreshDashboardData();
    }
  });
}

if (loadRangeSelect) {
  loadRangeSelect.addEventListener("change", () => {
    renderLoadChart();
  });
}

if (loadCategorySelect) {
  loadCategorySelect.addEventListener("change", () => {
    renderLoadChart();
  });
}

if (loadTypeWeight) {
  loadTypeWeight.addEventListener("click", () => {
    loadChartType = "weight";
    loadTypeWeight.classList.add("bg-emerald-400", "text-slate-950", "border-emerald-400");
    loadTypeWeight.classList.remove("bg-slate-950", "text-slate-300", "border-slate-700");
    loadTypeSetReps.classList.remove("bg-emerald-400", "text-slate-950", "border-emerald-400");
    loadTypeSetReps.classList.add("bg-slate-950", "text-slate-300", "border-slate-700");
    renderLoadChart();
  });
}

if (loadTypeSetReps) {
  loadTypeSetReps.addEventListener("click", () => {
    loadChartType = "setReps";
    loadTypeSetReps.classList.add("bg-emerald-400", "text-slate-950", "border-emerald-400");
    loadTypeSetReps.classList.remove("bg-slate-950", "text-slate-300", "border-slate-700");
    loadTypeWeight.classList.remove("bg-emerald-400", "text-slate-950", "border-emerald-400");
    loadTypeWeight.classList.add("bg-slate-950", "text-slate-300", "border-slate-700");
    renderLoadChart();
  });
}

if (logoutButton) {
  logoutButton.addEventListener("click", () => {
    sessionStorage.removeItem("ff_user");
    localStorage.removeItem("ff_user_persist");
    window.location.href = "login.html";
  });
}
