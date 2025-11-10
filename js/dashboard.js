document.addEventListener("DOMContentLoaded", () => {
  loadSummary();
  loadLeaderboard();
  loadEventChart();
});

async function loadSummary() {
  try {
    const data = await fetchJSON("/stats/summary");
    const el = document.getElementById("summary");
    el.innerHTML = `
      <div class="col-sm-6 col-md-3">
        <div class="card p-3 border-0 shadow-sm">
          <h6 class="text-muted">Players</h6>
          <h2 class="fw-bold">${data.total_players}</h2>
        </div>
      </div>
      <div class="col-sm-6 col-md-3">
        <div class="card p-3 border-0 shadow-sm">
          <h6 class="text-muted">Events</h6>
          <h2 class="fw-bold">${data.total_events}</h2>
        </div>
      </div>
      <div class="col-sm-6 col-md-3">
        <div class="card p-3 border-0 shadow-sm">
          <h6 class="text-muted">Judges</h6>
          <h2 class="fw-bold">${data.total_judges}</h2>
        </div>
      </div>
      <div class="col-sm-6 col-md-3">
        <div class="card p-3 border-0 shadow-sm">
          <h6 class="text-muted">Scores</h6>
          <h2 class="fw-bold">${data.total_scores}</h2>
        </div>
      </div>`;
  } catch (e) {
    console.error("Error loading summary:", e);
  }
}

async function loadLeaderboard() {
  try {
    const data = await fetchJSON("/stats/leaderboard");
    const tbody = document.querySelector("#leaderboard-table tbody");
    tbody.innerHTML = data
      .map(
        (r) => `
        <tr>
          <td>${r.rank}</td>
          <td class="text-start">${r.player}</td>
          <td class="fw-semibold">${r.total_score.toFixed(2)}</td>
        </tr>`
      )
      .join("");
  } catch (e) {
    console.error("Error loading leaderboard:", e);
  }
}

async function loadEventChart() {
  try {
    const data = await fetchJSON("/stats/event-averages");
    const ctx = document.getElementById("eventChart").getContext("2d");

    new Chart(ctx, {
      type: "bar",
      data: {
        labels: data.map((x) => x.event),
        datasets: [
          {
            label: "Average Score",
            data: data.map((x) => x.average_score),
            backgroundColor: "#000",
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: "#eee" },
            ticks: { color: "#333" },
          },
          x: {
            grid: { display: false },
            ticks: { color: "#333" },
          },
        },
        plugins: {
          legend: { display: false },
        },
      },
    });
  } catch (e) {
    console.error("Error loading chart:", e);
  }
}
