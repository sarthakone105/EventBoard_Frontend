
// scores page: list, create
document.addEventListener("DOMContentLoaded", ()=>{
  loadScores();
  document.getElementById("scoreForm").addEventListener("submit", async (ev)=>{
    ev.preventDefault();
    const fd = new FormData(ev.target);
    const body = Object.fromEntries(fd.entries());
    body.event_id = Number(body.event_id); body.player_id = Number(body.player_id); body.judge_id = Number(body.judge_id); body.score = Number(body.score);
    try{
      await fetchJSON("/scores", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body) });
      ev.target.reset();
      bootstrap.Modal.getInstance(document.getElementById('scoreModal')).hide();
      loadScores();
    }catch(e){ alert("Error: "+e.message); }
  });
});

async function loadScores(){
  try{
    const data = await fetchJSON("/scores");
    const tbody = document.querySelector("#scores-table tbody");
    tbody.innerHTML = data.map(s=>`
      <tr>
        <td>${s.score_id}</td>
        <td>${s.event_id}</td>
        <td>${s.player_id}</td>
        <td>${s.judge_id}</td>
        <td>${s.score}</td>
        <td>${s.score_date?new Date(s.score_date).toLocaleString():""}</td>
      </tr>
    `).join("");
  }catch(e){ console.error(e); }
}
