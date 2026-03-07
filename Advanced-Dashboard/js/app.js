/**
 * NexBank Advanced Analytics Dashboard
 * 
 * Architecture:
 * - Model: AppStore (Manages State)
 * - View & Controller: UI Manager (Updates DOM and binds events)
 * - Feature: Charting (Chart.js integration)
 * - Feature: CSV Parse engine
 */

class AppStore {
    constructor() {
        this.transactions = [];
        this.listeners = [];
    }

    subscribe(listener) {
        this.listeners.push(listener);
    }

    notify() {
        this.listeners.forEach(fn => fn(this.transactions));
    }

    addTransaction(tx) {
        this.transactions.push({ id: crypto.randomUUID(), ...tx });
        this.notify();
    }

    loadInitialData(data) {
        this.transactions = data;
        this.notify();
    }

    getTotals() {
        let income = 0;
        let expense = 0;
        this.transactions.forEach(tx => {
            if (tx.amount > 0) income += tx.amount;
            else expense += Math.abs(tx.amount);
        });
        return {
            balance: income - expense,
            income,
            expense
        };
    }

    getDailyExpenses() {
        // Returns aggregated expenses for Chart
        const days = { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 };
        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        this.transactions.forEach(tx => {
            if (tx.amount < 0) {
                const date = new Date(tx.date);
                if (!isNaN(date.getDay())) {
                    days[dayNames[date.getDay()]] += Math.abs(tx.amount);
                }
            }
        });
        return days;
    }
}

// Formatters
const formatCurrency = (amt) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amt);
const formatDate = (dateString) => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(dateString));

// --- State Instance ---
const store = new AppStore();

// --- Controllers ---
let analyticsChart = null;

// DOM Elements
const els = {
    balance: document.getElementById('val-balance'),
    income: document.getElementById('val-income'),
    expense: document.getElementById('val-expense'),
    tbody: document.getElementById('tx-tbody'),
    emptyState: document.getElementById('empty-state'),
    uploadZone: document.getElementById('upload-zone'),
    fileInput: document.getElementById('csv-upload'),
    searchInput: document.getElementById('global-search'),
    modal: document.getElementById('tx-modal'),
    btnOpenModal: document.getElementById('btn-add-tx'),
    btnCloseModal: document.getElementById('close-modal'),
    btnCancel: document.getElementById('btn-cancel'),
    form: document.getElementById('tx-form')
};

// UI Re-Renderer
function renderUI(transactionsList) {
    // 1. Update Metrics
    const totals = store.getTotals();
    els.balance.innerText = formatCurrency(totals.balance);
    els.income.innerText = formatCurrency(totals.income);
    els.expense.innerText = formatCurrency(totals.expense);

    // Dynamic UI styling for balance
    document.getElementById('trend-balance').className = totals.balance >= 0 ? "metric-trend positive" : "metric-trend negative";

    // 2. Clear Table
    els.tbody.innerHTML = '';
    const toRender = transactionsList || store.transactions;

    if (toRender.length === 0) {
        els.emptyState.style.display = 'flex';
        els.tbody.parentElement.style.display = 'none';
    } else {
        els.emptyState.style.display = 'none';
        els.tbody.parentElement.style.display = 'table';
        
        // Render rows
        toRender.slice().reverse().forEach(tx => {
            const tr = document.createElement('tr');
            
            // Icon mapping
            const iconMap = { Food: 'hamburger', Transport: 'car', Entertainment: 'film-strip', Utilities: 'lightning', Shopping: 'shopping-cart', Income: 'money' };
            const iconName = iconMap[tx.category] || 'receipt';
            
            const badgeClass = tx.category.toLowerCase();
            const amtClass = tx.amount > 0 ? "text-right amt-positive" : "text-right amt-negative";
            const formattedAmt = formatCurrency(tx.amount);

            tr.innerHTML = `
                <td>${formatDate(tx.date)}</td>
                <td>
                    <div class="tx-name">
                        <div class="tx-icon"><i class="ph ph-${iconName}"></i></div>
                        <span>${tx.name}</span>
                    </div>
                </td>
                <td><span class="badge-cat ${tx.category === 'Income' ? 'income' : 'default'}">${tx.category}</span></td>
                <td class="${amtClass}"><strong>${tx.amount > 0 ? '+' : ''}${formattedAmt}</strong></td>
            `;
            els.tbody.appendChild(tr);
        });
    }

    // 3. Update Chart
    drawChart();
}

// Chart.js Manager
function drawChart() {
    const ctx = document.getElementById('main-analytics-chart').getContext('2d');
    const data = store.getDailyExpenses();
    
    if (analyticsChart) {
        analyticsChart.destroy(); // Prevent overlap
    }

    analyticsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(data),
            datasets: [{
                label: 'Expenses',
                data: Object.values(data),
                backgroundColor: 'rgba(59, 130, 246, 0.8)',
                borderRadius: 4,
                hoverBackgroundColor: '#2563eb'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' } },
                x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
            },
            plugins: {
                legend: { display: false },
                tooltip: { backgroundColor: '#1e293b', titleColor: '#fff', bodyColor: '#94a3b8' }
            }
        }
    });
}

// Search Feature
els.searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = store.transactions.filter(tx => 
        tx.name.toLowerCase().includes(term) || tx.category.toLowerCase().includes(term)
    );
    renderUI(filtered); // Render just what matches
});

// Modal Feature
const toggleModal = (show) => {
    if (show) els.modal.classList.add('active');
    else {
        els.modal.classList.remove('active');
        els.form.reset();
    }
};

els.btnOpenModal.addEventListener('click', () => toggleModal(true));
els.btnCloseModal.addEventListener('click', () => toggleModal(false));
els.btnCancel.addEventListener('click', (e) => { e.preventDefault(); toggleModal(false); });

els.form.addEventListener('submit', (e) => {
    e.preventDefault();
    store.addTransaction({
        date: document.getElementById('input-date').value,
        name: document.getElementById('input-name').value,
        category: document.getElementById('input-category').value,
        amount: parseFloat(document.getElementById('input-amount').value)
    });
    toggleModal(false);
});

// File Upload Feature (The Dropzone)
els.uploadZone.addEventListener('click', () => els.fileInput.click());
els.fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const lines = e.target.result.trim().split('\n');
        const batch = [];
        
        for (let i = 1; i < lines.length; i++) {
            const cols = lines[i].split(',');
            if (cols.length < 4 || !cols[0].trim()) continue;

            const amt = parseFloat(cols[3]);
            if (!isNaN(amt)) {
                batch.push({
                    date: cols[0].trim(),
                    name: cols[1].trim(),
                    category: cols[2].trim(),
                    amount: amt
                });
            }
        }
        store.loadInitialData([...store.transactions, ...batch]);
    };
    reader.readAsText(file);
});

// Setup Initial State & Subscriptions
store.subscribe(renderUI);
store.loadInitialData([
    { id: '1', date: '2024-03-01', name: 'Starting Balance', category: 'Income', amount: 0 }
]);
