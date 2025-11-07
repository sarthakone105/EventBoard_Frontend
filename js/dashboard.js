
// dashboard specific scripts
document.addEventListener("DOMContentLoaded", ()=>{
  loadSummary(); loadLeaderboard(); loadEventChart();
});

async function loadSummary(){
  try{
    const data = await fetchJSON("/stats/summary");
    const el = document.getElementById("summary");
    el.innerHTML = `
      <div class="col-sm-6 col-md-3"><div class="card p-3"><div class="muted">Players</div><div class="h4 leader">${data.total_players}</div></div></div>
      <div class="col-sm-6 col-md-3"><div class="card p-3"><div class="muted">Events</div><div class="h4 leader">${data.total_events}</div></div></div>
      <div class="col-sm-6 col-md-3"><div class="card p-3"><div class="muted">Judges</div><div class="h4 leader">${data.total_judges}</div></div></div>
      <div class="col-sm-6 col-md-3"><div class="card p-3"><div class="muted">Scores</div><div class="h4 leader">${data.total_scores}</div></div></div>
    `;
  }catch(e){ console.error(e); }
}

async function loadLeaderboard(){
  try{
    const data = await fetchJSON("/stats/leaderboard");
    const tbody = document.querySelector("#leaderboard-table tbody");
    tbody.innerHTML = data.map(r=>`<tr><td>${r.rank}</td><td>${r.player}</td><td>${r.total_score.toFixed(2)}</td></tr>`).join("");
  }catch(e){ console.error(e); }
}

async function loadEventChart(){
  try{
    const data = await fetchJSON("/stats/event-averages");
    const ctx = document.getElementById("eventChart").getContext("2d");
    new Chart(ctx, {
      type: "bar",
      data: { labels: data.map(x=>x.event), datasets:[{ label: "Avg score", data: data.map(x=>x.average_score), backgroundColor: "#d4af37" }] },
      options: { responsive:true, plugins:{legend:{display:false}} }
    });
  }catch(e){ console.error(e); }
}
