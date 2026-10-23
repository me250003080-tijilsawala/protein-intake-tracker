import { useEffect, useMemo, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
Chart as ChartJS,
CategoryScale,
LinearScale,
BarElement,
Title,
Tooltip,
Legend,
} from 'chart.js';
import './App.css';

ChartJS.register(
CategoryScale,
LinearScale,
BarElement,
Title,
Tooltip,
Legend
);


const STORAGE_KEY = 'protein-plus-data-v2';

const FOOD_DATABASE = [
{ name: 'Eggs', protein: 6.3, serving: '1 large egg', unit: 'eggs', emoji: '🥚' },
{ name: 'Paneer', protein: 18, serving: '100 g', unit: 'g', emoji: '🧀' },
{ name: 'Milk', protein: 3.3, serving: '100 ml', unit: 'ml', emoji: '🥛' },
{ name: 'Chicken breast', protein: 31, serving: '100 g cooked', unit: 'g', emoji: '🍗' },
{ name: 'Dal', protein: 9, serving: '100 g cooked', unit: 'g', emoji: '🍲' },
{ name: 'Greek yogurt', protein: 10, serving: '100 g', unit: 'g', emoji: '🥣' },
{ name: 'Tofu', protein: 12, serving: '100 g', unit: 'g', emoji: '◻️' },
{ name: 'Peanuts', protein: 25.8, serving: '100 g', unit: 'g', emoji: '🥜' },
{ name: 'Oats', protein: 13.2, serving: '100 g dry', unit: 'g', emoji: '🌾' },
{ name: 'Almonds', protein: 21.2, serving: '100 g', unit: 'g', emoji: '🌰' },
{ name: 'Banana', protein: 1.1, serving: '100 g edible portion', unit: 'g', emoji: '🍌' },
{ name: 'Cooked rice', protein: 2.7, serving: '100 g cooked', unit: 'g', emoji: '🍚' },
{ name: 'Soy chunks', protein: 52, serving: '100 g dry', unit: 'g', emoji: '🌱' },
{ name: 'Chickpeas', protein: 8.9, serving: '100 g cooked', unit: 'g', emoji: '🫘' },
{ name: 'Whole wheat roti', protein: 3, serving: '1 medium roti', unit: 'rotis', emoji: '🫓' },
{ name: 'Whey protein', protein: 24, serving: '1 scoop (30 g)', unit: 'scoops', emoji: '🥤' },
{ name: 'Bread', protein: 3.5, serving: '1 slice', unit: 'slices', emoji: '🍞' },
{ name: 'Peanut butter', protein: 25, serving: '100 g', unit: 'g', emoji: '🥜' },
];

function todayKey() {
const d = new Date();
return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function loadData() {
try {
return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
} catch {
return {};
}
}

function initialDay() {
return { goal: 120, foods: [] };
}

function formatDate(date) {
return new Date(`${date}T12:00:00`).toLocaleDateString('en-IN', {
weekday: 'short',
day: 'numeric',
month: 'short',
});
}

function App() {
const [data, setData] = useState(loadData);
const [selectedDate, setSelectedDate] = useState(todayKey());
const [search, setSearch] = useState('');
const [selectedFood, setSelectedFood] = useState(null);
const [quantity, setQuantity] = useState('1');
const [customName, setCustomName] = useState('');
const [customProtein, setCustomProtein] = useState('');
const [editingId, setEditingId] = useState(null);
const [showCustom, setShowCustom] = useState(false);

useEffect(() => {
try {
localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
} catch {
alert('Your browser could not save the data. Check available storage.');
}
}, [data]);

const day = data[selectedDate] || initialDay();
const foods = day.foods || [];
const goal = Number(day.goal) || 120;

const totalProtein = foods.reduce((sum, food) => sum + Number(food.protein || 0), 0);
const progress = Math.min((totalProtein / goal) * 100, 100);
const remaining = Math.max(goal - totalProtein, 0);

function updateDay(updater) {
setData(previous => {
const current = previous[selectedDate] || initialDay();
return {
...previous,
[selectedDate]: updater(current),
};
});
}

function addSelectedFood(event) {
event.preventDefault();

 
const amount = Number(quantity);
if (!selectedFood || !Number.isFinite(amount) || amount <= 0) {
  alert('Choose a food and enter a quantity greater than zero.');
  return;
}

const protein = selectedFood.protein * amount / (selectedFood.unit === 'g' || selectedFood.unit === 'ml' ? 100 : 1);

const entry = {
  id: editingId ?? `${Date.now()}-${Math.random()}`,
  name: selectedFood.name,
  quantity: amount,
  unit: selectedFood.unit,
  serving: selectedFood.serving,
  proteinPerServing: selectedFood.protein,
  protein: Math.round(protein * 10) / 10,
  emoji: selectedFood.emoji,
};

updateDay(current => ({
  ...current,
  foods: editingId
    ? current.foods.map(food => food.id === editingId ? entry : food)
    : [...current.foods, entry],
}));

resetForm();
 

}

function addCustomFood(event) {
event.preventDefault();

const name = customName.trim();
const protein = Number(customProtein);
const amount = Number(document.getElementById('customQuantity')?.value || 1);

if (!name || !Number.isFinite(protein) || protein < 0 || !Number.isFinite(amount) || amount <= 0) {
alert('Enter a food name, valid protein content, and quantity greater than zero.');
return;
}

const entry = {
id: editingId ?? `${Date.now()}-${Math.random()}`,
name,
quantity: amount,
unit: 'servings',
serving: 'custom serving',
proteinPerServing: protein,
protein: Math.round(protein * amount * 10) / 10,
emoji: '🍽️',
};

updateDay(current => ({
...current,
foods: editingId
? current.foods.map(food => food.id === editingId ? entry : food)
: [...current.foods, entry],
}));

resetForm();
}


function resetForm() {
setSelectedFood(null);
setQuantity('1');
setCustomName('');
setCustomProtein('');
setEditingId(null);
setShowCustom(false);
}

function editFood(food) {
setEditingId(food.id);

 
if (food.unit === 'serving(s)') {
  setShowCustom(true);
  setCustomName(food.name);
  setCustomProtein(String(food.proteinPerServing));
  setSelectedFood(null);
} else {
  const matchingFood = FOOD_DATABASE.find(item => item.name === food.name);
  setSelectedFood(matchingFood || {
    name: food.name,
    protein: food.proteinPerServing,
    serving: food.serving,
    unit: food.unit,
    emoji: food.emoji || '🍽️',
  });
  setQuantity(String(food.quantity));
  setShowCustom(false);
}

document.getElementById('food-picker')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
 

}

function deleteFood(id) {
updateDay(current => ({
...current,
foods: current.foods.filter(food => food.id !== id),
}));

 
if (editingId === id) resetForm();
 

}

function saveGoal(event) {
event.preventDefault();
const value = Number(event.currentTarget.elements.goal.value);

 
if (!Number.isFinite(value) || value <= 0) {
  alert('Enter a daily target greater than zero.');
  return;
}

updateDay(current => ({ ...current, goal: value }));
 

}

function pickFood(food) {
setSelectedFood(food);
setQuantity('1');
setEditingId(null);
setShowCustom(false);
document.getElementById('food-picker')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

const filteredFoods = useMemo(
() => FOOD_DATABASE.filter(food => food.name.toLowerCase().includes(search.toLowerCase())),
[search]
);

const weekData = useMemo(() => {
const result = [];

 
for (let offset = 6; offset >= 0; offset--) {
  const d = new Date(`${selectedDate}T12:00:00`);
  d.setDate(d.getDate() - offset);

  const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const entry = data[key] || initialDay();
  const total = (entry.foods || []).reduce((sum, food) => sum + Number(food.protein || 0), 0);

  result.push({
    key,
    label: d.toLocaleDateString('en-IN', { weekday: 'short' }),
    total,
    goal: Number(entry.goal) || 120,
  });
}

return result;
 

}, [data, selectedDate]);

const chartData = {
labels: weekData.map(item => item.label),
datasets: [
{
label: 'Protein consumed',
data: weekData.map(item => Number(item.total.toFixed(1))),
backgroundColor: weekData.map(item =>
item.key === selectedDate ? '#386f47' : '#a9ce94'
),
borderRadius: 6,
borderSkipped: false,
maxBarThickness: 30,
},
{
label: 'Daily goal',
data: weekData.map(item => item.goal),
backgroundColor: '#dce8d5',
borderRadius: 4,
borderSkipped: false,
maxBarThickness: 30,
},
],
};

const chartOptions = {
responsive: true,
maintainAspectRatio: false,
interaction: {
mode: 'index',
intersect: false,
},
plugins: {
legend: {
position: 'bottom',
labels: {
usePointStyle: true,
pointStyle: 'circle',
padding: 18,
color: '#728174',
font: {
family: 'DM Sans',
size: 11,
},
},
},
tooltip: {
backgroundColor: '#173b28',
padding: 12,
cornerRadius: 8,
callbacks: {
label: context =>
`${context.dataset.label}: ${Number(context.raw).toFixed(1)} g`,
},
},
},
scales: {
x: {
grid: {
display: false,
},
border: {
display: false,
},
ticks: {
color: '#8a968c',
font: {
family: 'DM Sans',
size: 10,
},
},
},
y: {
beginAtZero: true,
border: {
display: false,
dash: [4, 4],
},
grid: {
color: '#edf1e9',
},
ticks: {
color: '#8a968c',
precision: 0,
callback: value => `${value} g`,
font: {
family: 'DM Sans',
size: 10,
},
},
},
},
};


return ( <div className="app-shell"> <aside className="sidebar"> <a className="brand" href="#overview"> <span className="brand-mark">P+</span> <span>PROTEIN<span className="brand-plus">+</span><small>NUTRITION TRACKER</small></span> </a>

 
    <p className="side-caption">MENU</p>
    <nav className="side-nav">
      <a className="side-link active" href="#overview"><span>▦</span> Overview</a>
      <a className="side-link" href="#food-diary"><span>◷</span> Food diary</a>
      <a className="side-link" href="#weekly"><span>▥</span> Weekly analytics</a>
      <a className="side-link" href="#library"><span>◇</span> Food library</a>
    </nav>

    <div className="sidebar-bottom">
      <div className="sidebar-tip-icon">✦</div>
      <p className="sidebar-tip-title">Consistency wins.</p>
      <p className="sidebar-tip-text">Small choices every day create lasting results.</p>
      <span className="sidebar-tag">YOUR JOURNEY, YOUR PACE</span>
    </div>

    <div className="sidebar-footer">PROTEIN+ <span>•</span> v1.0</div>
  </aside>

  <main className="main-area" id="overview">
    <header className="top-header">
      <div>
        <p className="overline">YOUR PERSONAL NUTRITION SPACE</p>
        <h1>Good food. <span>Great progress.</span></h1>
        <p className="header-subtitle">Make every meal count towards your goals.</p>
      </div>

      <div className="date-control">
        <label htmlFor="date">TRACKING DATE</label>
        <input id="date" type="date" max={todayKey()} value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
      </div>
    </header>

    <section className="hero-card">
      <div className="hero-copy">
        <span className="hero-pill"><span className="live-dot" /> DAILY NUTRITION CHECK-IN</span>
        <h2>Build a stronger<br />you, <em>one meal at a time.</em></h2>
        <p>Know your numbers, stay consistent, and keep moving forward.</p>
        <a href="#food-diary" className="hero-button">Log a meal <span>↗</span></a>
      </div>
      <div className="hero-art" aria-hidden="true">
        <div className="hero-ring ring-one" />
        <div className="hero-ring ring-two" />
        <div className="hero-orbit">✳</div>
        <div className="hero-badge"><span>DAILY FOCUS</span><strong>PROTEIN</strong><small>POWER YOUR DAY</small></div>
        <div className="hero-leaf leaf-one">✦</div>
        <div className="hero-leaf leaf-two">✧</div>
      </div>
    </section>

    <section className="summary-grid">
      <article className="summary-card consumed-card">
        <div className="summary-top"><span>PROTEIN CONSUMED</span><span className="summary-icon">↗</span></div>
        <div className="summary-value">{totalProtein.toFixed(1)}<small>g</small></div>
        <p><span className="status-dot" /> Logged for {formatDate(selectedDate)}</p>
        <div className="mini-track"><span style={{ width: `${progress}%` }} /></div>
      </article>

      <article className="summary-card">
        <div className="summary-top"><span>DAILY TARGET</span><span className="summary-icon pale">◎</span></div>
        <div className="summary-value">{goal}<small>g</small></div>
        <p>Your personal daily goal</p>
        <form className="inline-goal" onSubmit={saveGoal}>
          <input key={`${selectedDate}-${goal}`} name="goal" type="number" min="1" defaultValue={goal} aria-label="Daily protein target in grams" />
          <button type="submit" aria-label="Save protein target">Save</button>
        </form>
      </article>

      <article className="summary-card">
        <div className="summary-top"><span>STILL TO GO</span><span className="summary-icon pale">◷</span></div>
        <div className="summary-value">{remaining.toFixed(1)}<small>g</small></div>
        <p>{remaining === 0 ? 'Amazing! You reached your target.' : `${Math.round(progress)}% of your daily goal completed`}</p>
        <div className="mini-track"><span style={{ width: `${progress}%` }} /></div>
      </article>
    </section>

    <div className="content-grid">
      <section className="content-card progress-card">
        <div className="section-heading">
          <div><p className="overline">YOUR DAILY BREAKDOWN</p><h2>Protein progress</h2></div>
          <span className="soft-tag">{formatDate(selectedDate)}</span>
        </div>

        <div className="progress-layout">
          <div className="donut" style={{ '--progress': `${progress}%` }}>
            <div className="donut-center">
              <strong>{Math.round(progress)}<span>%</span></strong>
              <small>COMPLETED</small>
            </div>
          </div>
          <div className="progress-details">
            <div className="legend-row"><span className="legend-dot green" /><div><strong>Consumed</strong><small>Protein logged today</small></div><b>{totalProtein.toFixed(1)} g</b></div>
            <div className="legend-row"><span className="legend-dot gray" /><div><strong>Remaining</strong><small>To reach your target</small></div><b>{remaining.toFixed(1)} g</b></div>
            <div className="motivation-box"><span>✦</span><p>{remaining === 0 ? 'Goal achieved. Keep building healthy habits!' : `You're ${Math.round(progress)}% there. Every meal is another opportunity.`}</p></div>
          </div>
        </div>
      </section>

      <section className="content-card weekly-card" id="weekly">
        <div className="section-heading">
          <div><p className="overline">THE BIGGER PICTURE</p><h2>Weekly intake</h2></div>
          <span className="chart-badge">7 DAYS</span>
        </div>
        <p className="chart-subtitle">Protein consumed per day · grams</p>
        <div className="chartjs-container">
  <Bar data={chartData} options={chartOptions} />
</div>

        <div className="chart-footnote"><span className="legend-dot green" /> Daily protein intake <span className="chart-footnote-note">Past 7 days</span></div>
      </section>
    </div>

    <section className="content-card diary-card" id="food-diary">
      <div className="section-heading">
        <div><p className="overline">WHAT YOU'VE EATEN</p><h2>Your food diary</h2></div>
        <span className="soft-tag">{foods.length} {foods.length === 1 ? 'ENTRY' : 'ENTRIES'}</span>
      </div>

      <div className="food-table-head"><span>FOOD</span><span>QUANTITY</span><span>PROTEIN</span><span>ACTIONS</span></div>

      {foods.length === 0 ? (
        <div className="diary-empty"><div className="empty-illustration">🥗</div><h3>Your diary starts here</h3><p>No foods logged for this date yet. Add your first meal below.</p><a href="#food-picker">+ Add your first food</a></div>
      ) : foods.map(food => (
        <div className="food-row" key={food.id}>
          <div className="food-row-name"><span className="food-emoji">{food.emoji || '🍽️'}</span><div><strong>{food.name}</strong><small>{food.serving || 'Custom serving'}</small></div></div>
          <span className="food-quantity">{food.quantity} {food.unit}</span>
          <strong className="food-protein">{food.protein.toFixed(1)} g</strong>
          <div className="row-actions"><button type="button" onClick={() => editFood(food)}>Edit</button><button type="button" className="remove-button" onClick={() => deleteFood(food.id)} aria-label={`Delete ${food.name}`}>×</button></div>
        </div>
      ))}
      <div className="diary-total"><span>TOTAL PROTEIN</span><strong>{totalProtein.toFixed(1)} <small>g</small></strong></div>
    </section>

    <section className="content-card library-card" id="library">
      <div className="section-heading library-heading">
        <div><p className="overline">KNOW YOUR FOOD</p><h2>Food library</h2><p className="library-intro">Reference protein values with clearly defined serving sizes.</p></div>
        <div className="food-search"><span>⌕</span><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search foods..." aria-label="Search foods" /></div>
      </div>

      <div className="library-grid">
        {filteredFoods.map(food => (
          <button className={`library-food ${selectedFood?.name === food.name ? 'library-selected' : ''}`} type="button" key={food.name} onClick={() => pickFood(food)}>
            <span className="library-food-icon">{food.emoji}</span>
            <span className="library-food-name">{food.name}</span>
            <strong className="library-protein">{food.protein}<small> g protein</small></strong>
            <span className="library-serving">per {food.serving}</span>
            <span className="library-add">{selectedFood?.name === food.name ? '✓ Selected' : '+ Select food'}</span>
          </button>
        ))}
      </div>
      <p className="nutrition-disclaimer">Nutrition values are estimates and vary by variety, brand, serving size, and cooking method. Dry and cooked weights are not interchangeable. Check product labels for the most accurate values.</p>
    </section>

    <section className="content-card add-food-card" id="food-picker">
      <div className="section-heading">
        <div><p className="overline">TRACK YOUR INTAKE</p><h2>{editingId ? 'Edit food entry' : 'Add to your diary'}</h2></div>
        <span className="soft-tag">STEP 2 · QUANTITY</span>
      </div>

      {!showCustom ? (
        <form className="add-food-form" onSubmit={addSelectedFood}>
          <div className="selected-food-box">
            <span className="selected-food-emoji">{selectedFood?.emoji || '🍽️'}</span>
            <div><small>SELECTED FOOD</small><strong>{selectedFood?.name || 'Choose a food above'}</strong><span>{selectedFood ? `${selectedFood.protein} g protein · ${selectedFood.serving}` : 'Select a food from the library to continue.'}</span></div>
          </div>
          <div className="quantity-field"><label htmlFor="quantity">Quantity ({selectedFood?.unit || 'units'})</label><input id="quantity" type="number" min="0.1" step="0.1" value={quantity} onChange={e => setQuantity(e.target.value)} disabled={!selectedFood} /></div>
          <div className="calculated-field"><small>ESTIMATED PROTEIN</small><strong>{selectedFood && Number(quantity) > 0 ? (selectedFood.protein * Number(quantity) / (selectedFood.unit === 'g' || selectedFood.unit === 'ml' ? 100 : 1)).toFixed(1) : '0.0'} <span>g</span></strong></div>
          <button className="add-submit" type="submit" disabled={!selectedFood}>{editingId ? 'Save changes' : '+ Add food'}</button>
          {editingId && <button className="cancel-edit" type="button" onClick={resetForm}>Cancel</button>}
        </form>
      ) : (
        <form className="add-food-form custom-form" onSubmit={addCustomFood}>
          <div className="quantity-field"><label htmlFor="customName">Food name</label><input id="customName" value={customName} onChange={e => setCustomName(e.target.value)} placeholder="e.g. Homemade smoothie" required /></div>
          <div className="quantity-field"><label htmlFor="customProtein">Protein per serving (g)</label><input id="customProtein" type="number" min="0.1" step="0.1" value={customProtein} onChange={e => setCustomProtein(e.target.value)} required /></div>
          <button className="add-submit" type="submit">{editingId ? 'Save changes' : '+ Add custom food'}</button>
          <button className="cancel-edit" type="button" onClick={resetForm}>Cancel</button>
        </form>
      )}

      {!editingId && <button className="custom-food-link" type="button" onClick={() => { setShowCustom(value => !value); setSelectedFood(null); }}>{showCustom ? '← Choose from food library' : '+ Add a custom food not listed above'}</button>}
    </section>

    <footer className="main-footer"><span>PROTEIN+ © {new Date().getFullYear()}</span><span>Build habits, not restrictions. <b>✦</b></span></footer>
  </main>
</div>
 

);
}

export default App;
