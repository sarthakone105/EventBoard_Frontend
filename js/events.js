
// events page: list, create
document.addEventListener("DOMContentLoaded", ()=>{
  loadEvents();
  document.getElementById("eventForm").addEventListener("submit", async (ev)=>{
    ev.preventDefault();
    const fd = new FormData(ev.target);
    const body = Object.fromEntries(fd.entries());
    if(body.event_date) body.event_date = body.event_date;
    try{
      await fetchJSON("/events", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body) });
      ev.target.reset();
      bootstrap.Modal.getInstance(document.getElementById('eventModal')).hide();
      loadEvents();
    }catch(e){ alert("Error: "+e.message); }
  });
});

async function loadEvents(){
  try{
    const data = await fetchJSON("/events");
    const container = document.getElementById("eventsList");
    container.innerHTML = data.map(ev=>`
      <div class="col-md-4">
        <div class="card p-3">
          <h5>${ev.name}</h5>
          <div class="text-muted">${ev.round_name||""} • ${ev.event_date?ev.event_date.split("T")[0]:""}</div>
          <div class="mt-2"><a class="btn btn-sm btn-outline-primary" href="events.html#event-${ev.event_id}">View</a></div>
        </div>
      </div>
    `).join("");
  }catch(e){ console.error(e); }
}
