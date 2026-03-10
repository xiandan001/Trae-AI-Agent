// Agent Teams Visualizer - 2D Pixel Edition v2.5
// 修复: 消息从头加载、Plan Station 刷新保留选中状态、过滤空消息

let taskId='task-001';
let refreshInterval=null;
let startTime=Date.now();
let lastStateHash='';
let lastMessageCount=-1;
let lastPhase=-1;
let taskCompleted=false;
let lastAgentStatuses={};
let lastSelectedPlan=null;
let lastPlansData=null;

const CONFIG={refreshInterval:2000,statePath:'../state.json',messagesPath:'../messages/',outputsPath:'../outputs/'};
const AGENT_NAMES={'lead':'LEADER','plan':'PLAN','tech_decision':'TECH','business_decision':'BIZ','risk_decision':'RISK','framework':'FRAME','system':'SYSTEM','data':'DATA','ui_ux':'UI/UX','build':'BUILD','device':'DEVICE','code_reviewer':'REVIEW','qa':'QA'};
const MESSAGE_TYPE_ICONS={'message':'📨','vote':'🗳️','broadcast':'📢','task_completion':'✅','review_completed':'🔍','cross_domain_hint':'🔗','error':'❌','warning':'⚠️','phase_transition':'🔄','plan_selected':'📋','agent_start':'🚀','agent_progress':'⏳'};

document.addEventListener('DOMContentLoaded',()=>{
    console.log('[Pixel Visualizer v2.5] Initializing...');
    startTimer();
    loadConfiguration();
    startRealtimeMonitoring();
    initRobotAnimations()
});

function startTimer(){
    const timerEl=document.getElementById('timer');
    if(!timerEl)return;
    setInterval(()=>{
        const elapsed=Date.now()-startTime;
        const hours=Math.floor(elapsed/3600000);
        const minutes=Math.floor((elapsed%3600000)/60000);
        const seconds=Math.floor((elapsed%60000)/1000);
        timerEl.textContent=`${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`
    },1000)
}

function loadConfiguration(){
    const urlParams=new URLSearchParams(window.location.search);
    taskId=urlParams.get('task')||'task-001';
    const taskIdEl=document.getElementById('task-id');
    if(taskIdEl){taskIdEl.textContent=taskId.toUpperCase().replace('TASK-','')}
    console.log('[Pixel Visualizer] Task ID:',taskId)
}

function startRealtimeMonitoring(){
    console.log('[Pixel Visualizer] Starting real-time monitoring...');
    refreshAll();
    refreshInterval=setInterval(refreshAll,CONFIG.refreshInterval)
}

async function refreshAll(){
    try{
        await refreshState();
        await refreshMessages();
        await refreshVotingResults();
        await refreshPlanDetails();
        updateConnectionStatus('connected')
    }catch(error){
        console.error('[Pixel Visualizer] Refresh failed:',error);
        updateConnectionStatus('error')
    }
}

async function refreshState(){
    try{
        const response=await fetch(`${CONFIG.statePath}?t=${Date.now()}`);
        if(!response.ok)throw new Error('State not found');
        const state=await response.json();
        console.log('[Pixel Visualizer] State loaded:',state.current_phase,'progress:',state.progress);
        if(lastPhase!==state.current_phase&&lastPhase!==-1){
            onPhaseChanged(lastPhase,state.current_phase,state)
        }
        lastPhase=state.current_phase;
        updateUI(state)
    }catch(error){
        console.error('[Pixel Visualizer] Failed to load state:',error)
    }
}

function onPhaseChanged(oldPhase,newPhase,state){
    console.log('[Pixel Visualizer] Phase changed:',oldPhase,'->',newPhase);
    const phaseNames={0:'INITIALIZING',1:'LEAD ASSESSMENT',2:'PLANNING',2.5:'VOTING',3:'PARALLEL ANALYSIS',4:'CODE REVIEW',5:'QA TESTING',6:'FINAL DECISION'};
    addSystemMessage('phase_transition',{from:'SYSTEM',to:'all',content:`Phase ${oldPhase} → ${newPhase}: ${phaseNames[newPhase]||'UNKNOWN'}`,summary:`进入 ${phaseNames[newPhase]} 阶段`});
    animatePhaseTransition(newPhase)
}

function updateUI(state){
    if(!state)return;
    if(state.status==='completed'){
        taskCompleted=true;
        showTaskCompleted(state)
    }
    if(state.description){
        const logoEl=document.querySelector('.logo-text');
        if(logoEl){
            const desc=typeof state.description==='string'?state.description:(state.description.reproduction_steps||state.description.issue_type||'AGENT TEAMS');
            const shortDesc=desc.length>20?desc.substring(0,20)+'...':desc;
            logoEl.textContent=shortDesc.toUpperCase()
        }
    }
    if(state.agents){
        for(const[agentId,agentData]of Object.entries(state.agents)){
            const status=typeof agentData==='object'?agentData.status:agentData;
            updateRobotStatus(agentId,status);
            if(status==='working'&&lastAgentStatuses[agentId]!=='working'&&lastAgentStatuses[agentId]!==undefined){
                addSystemMessage('agent_start',{from:agentId,to:'lead',content:`${AGENT_NAMES[agentId]||agentId} 开始执行任务`,summary:`${AGENT_NAMES[agentId]||agentId} 启动中...`});
            }
            lastAgentStatuses[agentId]=status
        }
    }
    if(state.progress!==undefined){
        updateProgress(state.progress,getPhaseName(state.current_phase,state.status))
    }
    if(state.current_phase!==undefined){
        updatePhaseIndicator(state.current_phase,state.status,state.agents)
    }
    if(state.selected_plan&&state.selected_plan!==lastSelectedPlan){
        lastSelectedPlan=state.selected_plan;
        highlightSelectedPlan(state.selected_plan);
        updatePlanStation(state.selected_plan);
        addSystemMessage('plan_selected',{from:'LEADER',to:'all',content:`方案 ${state.selected_plan} 获胜！`,summary:'投票结果已确认'})
    }
    if(state.final_decision&&state.status==='completed'){
        showFinalDecision(state.final_decision)
    }
}

function addSystemMessage(type,data){
    const container=document.getElementById('messages');
    if(!container)return;
    const msgId=`sys-${type}-${data.from}`;
    if(container.querySelector(`[data-msg-id="${msgId}"]`))return;
    const div=document.createElement('div');
    div.className='message new';
    div.setAttribute('data-msg-id',msgId);
    if(type==='phase_transition'){div.classList.add('broadcast')}else if(type==='plan_selected'){div.classList.add('vote-message')}
    const icon=MESSAGE_TYPE_ICONS[type]||'📨';
    const time=getTimeString();
    div.innerHTML=`<div class="msg-meta"><span class="msg-time">[${time}]</span><span class="msg-from">${AGENT_NAMES[data.from]||data.from.toUpperCase()}</span><span class="msg-arrow">→</span><span class="msg-to">${data.to==='all'?'📢 ALL':(AGENT_NAMES[data.to]||data.to.toUpperCase())}</span></div><div class="msg-header"><span class="msg-icon">${icon}</span><span class="msg-type">${type.toUpperCase()}</span></div><div class="msg-body"><div>${data.content}</div>${data.summary?`<div style="font-size:5px;color:#8888aa;margin-top:4px;">${data.summary}</div>`:''}</div>`;
    container.appendChild(div);
    container.scrollTop=container.scrollHeight
}

function updatePlanStation(selectedPlan){
    const whiteboard=document.querySelector('.whiteboard .board-content');
    if(!whiteboard)return;
    const planItems=whiteboard.querySelectorAll('.plan-item');
    planItems.forEach((item,index)=>{
        const planLetter=String.fromCharCode(65+index);
        const isSelected=planLetter===selectedPlan;
        const currentIsSelected=item.dataset.selected==='true';
        if(isSelected!==currentIsSelected){
            item.dataset.selected=isSelected?'true':'false';
            if(isSelected){
                item.style.background='rgba(0, 255, 136, 0.3)';
                item.style.borderLeft='3px solid #00ff88';
                item.innerHTML=`✅ Plan ${planLetter} <span style="color:#00ff88">SELECTED</span>`
            }else{
                item.style.background='rgba(0, 0, 0, 0.1)';
                item.style.borderLeft='2px solid #bf00ff';
                item.innerHTML=`Plan ${planLetter}`
            }
        }
    });
    const planRobot=document.querySelector('[data-agent="plan"]');
    if(planRobot){
        const plansEl=planRobot.querySelector('.plans-count');
        if(plansEl&&plansEl.textContent!==`Plan ${selectedPlan} ✓`){
            plansEl.classList.remove('hidden');
            plansEl.textContent=`Plan ${selectedPlan} ✓`;
            plansEl.style.color='#00ff88'
        }
    }
}

async function refreshPlanDetails(){
    try{
        const response=await fetch(`${CONFIG.outputsPath}plan.json?t=${Date.now()}`);
        if(!response.ok)return;
        const planData=await response.json();
        if(planData.plans&&planData.plans.length>0){
            const plansJson=JSON.stringify(planData.plans);
            if(plansJson!==lastPlansData){
                lastPlansData=plansJson;
                updatePlanWhiteboard(planData.plans)
            }
        }
    }catch(e){}
}

function updatePlanWhiteboard(plans){
    const whiteboard=document.querySelector('.whiteboard .board-content');
    if(!whiteboard)return;
    whiteboard.innerHTML=plans.map((plan,index)=>{
        const planLetter=String.fromCharCode(65+index);
        const isSelected=lastSelectedPlan===planLetter;
        if(isSelected){
            return`<div class="plan-item" data-plan="${planLetter}" data-selected="true" style="background:rgba(0,255,136,0.3);border-left:3px solid #00ff88;">✅ Plan ${planLetter} <span style="color:#00ff88">SELECTED</span></div>`
        }
        return`<div class="plan-item" data-plan="${planLetter}" data-selected="false">Plan ${planLetter}: ${plan.name||''}</div>`
    }).join('')
}

function showTaskCompleted(state){
    const progressEl=document.querySelector('.progress-display');
    if(progressEl){progressEl.classList.add('task-completed')}
    const phaseEl=document.getElementById('progress-phase');
    if(phaseEl){
        phaseEl.innerHTML='🎉 MISSION COMPLETE!';
        phaseEl.classList.add('completed')
    }
    const topBar=document.querySelector('.top-bar');
    if(topBar){topBar.style.borderColor='#39ff14'}
    celebrateCompletion();
    addCompletionMessage(state)
}

function celebrateCompletion(){
    const robots=document.querySelectorAll('.robot');
    robots.forEach((robot,index)=>{
        setTimeout(()=>{
            robot.classList.add('celebrating');
            triggerConfetti(robot)
        },index*100)
    })
}

function triggerConfetti(robot){
    const rect=robot.getBoundingClientRect();
    for(let i=0;i<5;i++){
        setTimeout(()=>{
            const confetti=document.createElement('div');
            confetti.className='confetti';
            confetti.style.left=rect.left+rect.width/2+'px';
            confetti.style.top=rect.top+'px';
            confetti.style.background=['#00d4ff','#39ff14','#ffff00','#bf00ff'][i%4];
            document.body.appendChild(confetti);
            setTimeout(()=>confetti.remove(),1000)
        },i*50)
    }
}

function addCompletionMessage(state){
    const container=document.getElementById('messages');
    if(!container)return;
    if(container.querySelector('.message.completion-message'))return;
    const div=document.createElement('div');
    div.className='message new completion-message broadcast';
    const decision=state.final_decision||{};
    const decisionText=decision.decision==='approve'?'✅ APPROVED':'❌ REJECTED';
    div.innerHTML=`<div class="msg-meta"><span class="msg-time">[${getTimeString()}]</span><span class="msg-from">🎯 LEADER</span><span class="msg-arrow">→</span><span class="msg-to">📢 ALL</span></div><div class="msg-header"><span class="msg-icon">🎉</span><span class="msg-type">MISSION COMPLETE</span></div><div class="msg-body"><strong>MISSION ACCOMPLISHED!</strong><br>Decision: ${decisionText}<br>Quality: ${decision.code_quality_score||'N/A'} | Coverage: ${decision.test_coverage||'N/A'}</div>`;
    container.appendChild(div);
    container.scrollTop=container.scrollHeight
}

function showFinalDecision(decision){
    let banner=document.getElementById('decision-banner');
    if(!banner)return;
    const icon=document.getElementById('decision-icon');
    const text=document.getElementById('decision-text');
    const quality=document.getElementById('quality-score');
    const coverage=document.getElementById('test-coverage');
    const scope=document.getElementById('approved-scope');
    if(decision.decision==='approve'){
        if(icon)icon.textContent='✅';
        if(text)text.textContent='APPROVED';
        banner.querySelector('.decision-content').classList.remove('rejected')
    }else{
        if(icon)icon.textContent='❌';
        if(text)text.textContent='REJECTED';
        banner.querySelector('.decision-content').classList.add('rejected')
    }
    if(quality)quality.textContent=decision.code_quality_score||'--';
    if(coverage)coverage.textContent=decision.test_coverage||'--';
    if(scope)scope.textContent=decision.approved_for||'--';
    banner.classList.remove('hidden')
}

function getPhaseName(phase,status){
    if(status==='completed')return'🎉 MISSION COMPLETE!';
    const phases={0:'INITIALIZING...',1:'LEADER ASSESSMENT...',2:'PLANNING...',2.5:'VOTING IN PROGRESS...',3:'PARALLEL ANALYSIS...',4:'CODE REVIEW...',5:'QA TESTING...',6:'FINAL DECISION...'};
    return phases[phase]||`PHASE ${phase}`
}

function updateRobotStatus(agentId,status){
    const robot=document.querySelector(`[data-agent="${agentId}"]`);
    if(!robot){
        console.log('[Pixel Visualizer] Robot not found:',agentId);
        return
    }
    robot.classList.remove('completed','working','pending','failed');
    if(status){robot.classList.add(status)}
    const statusEl=robot.querySelector('.robot-status');
    if(statusEl){
        const statusMap={'completed':'✅ DONE','working':'🔄 WORKING','pending':'⏸️ IDLE','failed':'❌ ERROR'};
        statusEl.textContent=statusMap[status]||status||'⏸️ IDLE'
    }
    if(status==='working'){animateRobotWorking(robot)}
    console.log('[Pixel Visualizer] Robot status updated:',agentId,status)
}

function animateRobotWorking(robot){
    const screen=robot.querySelector('.screen-content');
    if(screen){screen.style.animation='screen-working 0.3s linear infinite'}
    const eyes=robot.querySelectorAll('.eye');
    eyes.forEach(eye=>{eye.style.animation='eye-working 0.3s ease-in-out infinite'})
}

function animatePhaseTransition(newPhase){
    const nodes=document.querySelectorAll('.phase-node');
    nodes.forEach(node=>{
        const phaseNum=parseFloat(node.dataset.phase);
        if(Math.abs(phaseNum-newPhase)<0.1){
            node.style.animation='none';
            setTimeout(()=>{node.style.animation='node-pulse 1s ease-in-out infinite'},10)
        }
    })
}

function updateProgress(percent,phase){
    const fill=document.getElementById('progress-fill');
    const label=document.getElementById('progress-percent');
    const phaseEl=document.getElementById('progress-phase');
    if(fill)fill.style.width=`${percent}%`;
    if(label)label.textContent=`${percent}%`;
    if(phaseEl&&!taskCompleted){phaseEl.textContent=phase}
}

function updatePhaseIndicator(currentPhase,status,agents){
    const phases=document.querySelectorAll('.phase-node');
    const isCompleted=status==='completed';
    let activeAgents=[];
    if(agents){
        for(const[agentId,agentData]of Object.entries(agents)){
            const agentStatus=typeof agentData==='object'?agentData.status:agentData;
            if(agentStatus==='working'){activeAgents.push(agentId)}
        }
    }
    phases.forEach(phase=>{
        const phaseNum=parseFloat(phase.dataset.phase);
        phase.classList.remove('active','completed');
        const statusEl=phase.querySelector('.node-status');
        if(isCompleted){
            phase.classList.add('completed');
            if(statusEl)statusEl.textContent='✅'
        }else if(phaseNum<currentPhase){
            phase.classList.add('completed');
            if(statusEl)statusEl.textContent='✅'
        }else if(Math.abs(phaseNum-currentPhase)<0.1){
            phase.classList.add('active');
            if(statusEl)statusEl.textContent='🔄'
        }else{
            if(statusEl)statusEl.textContent='⏸️'
        }
    });
    console.log('[Pixel Visualizer] Phase indicator updated:',currentPhase,'active agents:',activeAgents)
}

async function refreshMessages(){
    try{
        const response=await fetch(`${CONFIG.messagesPath}index.json?t=${Date.now()}`);
        if(!response.ok)return;
        const index=await response.json();
        const messages=index.messages||[];
        const messageCount=messages.length;
        if(lastMessageCount===-1){
            for(let i=0;i<messages.length;i++){
                const msgInfo=messages[i];
                try{
                    const msgFile=typeof msgInfo==='object'?msgInfo.file:msgInfo;
                    const msgResponse=await fetch(`${CONFIG.messagesPath}${msgFile}?t=${Date.now()}`);
                    const msg=await msgResponse.json();
                    addMessage(msg,msgFile,msgInfo,false)
                }catch(e){
                    console.error('[Pixel Visualizer] Failed to load message:',msgInfo)
                }
            }
            lastMessageCount=messageCount
        }else if(messageCount>lastMessageCount){
            for(let i=lastMessageCount;i<messages.length;i++){
                const msgInfo=messages[i];
                try{
                    const msgFile=typeof msgInfo==='object'?msgInfo.file:msgInfo;
                    const msgResponse=await fetch(`${CONFIG.messagesPath}${msgFile}?t=${Date.now()}`);
                    const msg=await msgResponse.json();
                    addMessage(msg,msgFile,msgInfo,true)
                }catch(e){
                    console.error('[Pixel Visualizer] Failed to load message:',msgInfo)
                }
            }
            lastMessageCount=messageCount
        }
    }catch(error){
        console.error('[Pixel Visualizer] Failed to refresh messages:',error)
    }
}

function addMessage(msg,filename,msgInfo,animate){
    const container=document.getElementById('messages');
    if(!container)return;
    const msgFile=typeof msgInfo==='object'?msgInfo.file:filename;
    const msgId=`msg-${msgFile}`;
    if(container.querySelector(`[data-msg-id="${msgId}"]`))return;
    const content=msg.content||msg.summary||'';
    const contentStr=typeof content==='string'?content:JSON.stringify(content);
    if(!contentStr||contentStr.trim()===''||contentStr==='""'||contentStr==='{}'){
        console.log('[Pixel Visualizer] Skipped empty message:',msgFile);
        return
    }
    const div=document.createElement('div');
    div.className='message';
    if(animate){div.classList.add('new')}
    const msgType=msg.type||(msgInfo&&msgInfo.type)||'message';
    if(msgType==='broadcast'){div.classList.add('broadcast')}else if(msgType==='vote'){div.classList.add('vote-message')}else if(msgType==='task_completion'){div.classList.add('completion')}
    let time='';
    if(msg.timestamp){
        time=msg.timestamp.includes('T')?msg.timestamp.split('T')[1]?.substring(0,8)||msg.timestamp:msg.timestamp
    }else if(msgInfo&&msgInfo.timestamp){
        time=msgInfo.timestamp.includes('T')?msgInfo.timestamp.split('T')[1]?.substring(0,8)||msgInfo.timestamp:msgInfo.timestamp
    }else{
        time=getTimeString()
    }
    const from=msg.from||(msgInfo&&msgInfo.from)||'Unknown';
    const to=msg.to||(msgInfo&&msgInfo.to)||'All';
    const icon=MESSAGE_TYPE_ICONS[msgType]||'📨';
    let contentHtml='';
    contentHtml+=`<div class="msg-header">`;
    contentHtml+=`<span class="msg-icon">${icon}</span>`;
    contentHtml+=`<span class="msg-type">${msgType.toUpperCase()}</span>`;
    contentHtml+=`</div>`;
    if(msgType==='vote'&&msg.content&&typeof msg.content==='object'){
        contentHtml+=`<div class="msg-body">`;
        contentHtml+=`<div class="vote-info">`;
        contentHtml+=`<span class="vote-plan">PLAN ${msg.content.selected_plan}</span>`;
        contentHtml+=`<span class="vote-confidence">${Math.round((msg.content.confidence||0)*100)}%</span>`;
        contentHtml+=`</div>`;
        if(msg.summary){contentHtml+=`<div style="font-size:5px;color:#8888aa;margin-top:4px;">${msg.summary}</div>`}
        contentHtml+=`</div>`
    }else if(msgType==='broadcast'){
        contentHtml+=`<div class="msg-body">`;
        contentHtml+=`<div>${typeof content==='string'?content:JSON.stringify(content)}</div>`;
        if(msg.summary){contentHtml+=`<div style="font-size:5px;color:#8888aa;margin-top:4px;">${msg.summary}</div>`}
        contentHtml+=`</div>`
    }else{
        contentHtml+=`<div class="msg-body">`;
        contentHtml+=`"${contentStr.substring(0,100)}${contentStr.length>100?'...':''}"`;
        contentHtml+=`</div>`
    }
    div.setAttribute('data-msg-id',msgId);
    div.innerHTML=`<div class="msg-meta"><span class="msg-time">[${time}]</span><span class="msg-from">${AGENT_NAMES[from]||from.toUpperCase()}</span><span class="msg-arrow">→</span><span class="msg-to">${to==='all'?'📢 ALL':(AGENT_NAMES[to]||to.toUpperCase())}</span></div>${contentHtml}`;
    container.appendChild(div);
    if(animate){container.scrollTop=container.scrollHeight}
}

async function refreshVotingResults(){
    const decisions=['tech_decision','business_decision','risk_decision'];
    const votes={};
    let hasVotes=false;
    for(const decision of decisions){
        try{
            const response=await fetch(`${CONFIG.outputsPath}${decision}.json?t=${Date.now()}`);
            if(response.ok){
                const data=await response.json();
                if(data.vote){
                    votes[decision]=data.vote;
                    hasVotes=true;
                    showVote(decision,data.vote.selected_plan)
                }
            }
        }catch(e){}
    }
    try{
        const response=await fetch(`${CONFIG.outputsPath}decision_vote.json?t=${Date.now()}`);
        if(response.ok){
            const data=await response.json();
            if(data.decision_result){
                updateVotingResult(data.decision_result);
                showVotingPanel()
            }
        }
    }catch(e){}
    if(hasVotes&&Object.keys(votes).length>0){
        showVotingPanel();
        updateVotingProgress(votes)
    }
}

function showVote(agentId,plan){
    const robot=document.querySelector(`[data-agent="${agentId}"]`);
    if(!robot)return;
    const voteEl=robot.querySelector('.vote-badge');
    if(voteEl){
        voteEl.textContent=`🗳️ ${plan}`;
        voteEl.classList.remove('hidden');
        voteEl.classList.add('show')
    }
}

function showVotingPanel(){
    const panel=document.getElementById('voting-display');
    if(panel){panel.classList.remove('hidden')}
}

function updateVotingProgress(votes){
    const voteCount={A:0,B:0,C:0};
    const voteBy={A:[],B:[],C:[]};
    for(const[agent,vote]of Object.entries(votes)){
        const plan=vote.selected_plan;
        if(plan&&voteCount.hasOwnProperty(plan)){
            voteCount[plan]++;
            const agentName=agent.replace('_decision','').toUpperCase();
            voteBy[plan].push(agentName)
        }
    }
    const total=Object.values(voteCount).reduce((a,b)=>a+b,0);
    for(const plan of['A','B','C']){
        const candidate=document.querySelector(`[data-plan="${plan}"]`);
        if(!candidate)continue;
        const count=voteCount[plan];
        const percent=total>0?Math.round((count/total)*100):0;
        const bar=candidate.querySelector(`.vote-bar-${plan}`);
        const countEl=candidate.querySelector('.candidate-count');
        const avatarsEl=candidate.querySelector('.voter-avatars');
        if(bar)bar.style.width=`${percent}%`;
        if(countEl)countEl.textContent=`${count}`;
        if(avatarsEl&&voteBy[plan].length>0){avatarsEl.textContent=voteBy[plan].map(v=>'✅').join(' ')}
    }
}

function updateVotingResult(result){
    if(!result)return;
    if(result.votes){updateVotingProgress(result.votes)}
    const banner=document.querySelector('.vote-result-banner');
    if(banner){
        banner.classList.remove('hidden');
        const textEl=banner.querySelector('.result-text');
        if(textEl&&result.selected_plan){textEl.textContent=`PLAN ${result.selected_plan} WINS!`}
    }
    if(result.selected_plan){
        highlightSelectedPlan(result.selected_plan);
        updatePlanStation(result.selected_plan)
    }
}

function highlightSelectedPlan(planId){
    const candidates=document.querySelectorAll('.vote-candidate');
    candidates.forEach(opt=>{
        opt.classList.remove('winner');
        if(opt.dataset.plan===planId){opt.classList.add('winner')}
    })
}

function updateConnectionStatus(status){
    const dot=document.querySelector('.status-dot');
    const text=document.querySelector('.status-text');
    if(dot){dot.style.background=status==='connected'?'#39ff14':'#ff0040'}
    if(text){
        text.textContent=status==='connected'?'ONLINE':'OFFLINE';
        text.style.color=status==='connected'?'#39ff14':'#ff0040'
    }
}

function getTimeString(){
    const now=new Date();
    return`${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`
}

function refreshData(){
    console.log('[Pixel Visualizer] Manual refresh triggered');
    refreshAll()
}

function toggleAutoRefresh(){
    if(refreshInterval){
        clearInterval(refreshInterval);
        refreshInterval=null;
        console.log('[Pixel Visualizer] Auto refresh paused')
    }else{
        refreshInterval=setInterval(refreshAll,CONFIG.refreshInterval);
        console.log('[Pixel Visualizer] Auto refresh resumed')
    }
}

function initRobotAnimations(){
    const robots=document.querySelectorAll('.robot');
    robots.forEach(robot=>{
        robot.addEventListener('click',()=>{
            robot.style.animation='none';
            setTimeout(()=>{robot.style.animation=''},10)
        })
    })
}

document.addEventListener('keydown',(e)=>{
    if(e.key==='r'||e.key==='R'){refreshData()}
    if(e.key==='p'||e.key==='P'){toggleAutoRefresh()}
});

window.AgentTeamsVisualizer={updateRobotStatus,updateProgress,addMessage,addSystemMessage,showVote,updateVotingResult,updatePlanStation,refreshData,toggleAutoRefresh,showFinalDecision};

console.log('[Pixel Visualizer v2.5] Initialized with fixes:');
console.log('  - Fixed: Messages load from beginning (lastMessageCount=-1)');
console.log('  - Fixed: Plan Station preserves selected state on refresh');
console.log('  - Fixed: Message deduplication with unique msgId');
console.log('  - Fixed: Empty messages ("") are now filtered out');
