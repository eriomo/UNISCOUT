import { useState, useEffect, useRef, useCallback } from 'react';

// ====================== THEMES ======================
const T={dark:{bg:"#0A0E1A",card:"#111827",accent:"#F59E0B",accentDark:"#D97706",accentLight:"#FCD34D",text:"#F1F5F9",textSec:"#CBD5E1",muted:"#94A3B8",border:"#1E293B",success:"#10B981",danger:"#EF4444",info:"#3B82F6",purple:"#8B5CF6",surface:"#0F172A",inputBg:"#0F172A",shadow:"0 4px 24px rgba(0,0,0,0.3)"},light:{bg:"#F8FAFC",card:"#FFFFFF",accent:"#D97706",accentDark:"#B45309",accentLight:"#F59E0B",text:"#0F172A",textSec:"#334155",muted:"#64748B",border:"#E2E8F0",success:"#059669",danger:"#DC2626",info:"#2563EB",purple:"#7C3AED",surface:"#F1F5F9",inputBg:"#FFFFFF",shadow:"0 4px 24px rgba(0,0,0,0.06)"}};

// ====================== SVG LOGO ======================
const Logo=({size=40,color="#F59E0B"})=><svg width={size} height={size} viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="48" fill={color} opacity="0.12"/><circle cx="50" cy="50" r="48" stroke={color} strokeWidth="2.5"/><path d="M50 18L78 35V42L50 55L22 42V35L50 18Z" fill={color}/><path d="M30 44V62C30 62 38 72 50 72C62 72 70 62 70 62V44L50 57L30 44Z" fill={color} opacity="0.7"/><path d="M78 35V58" stroke={color} strokeWidth="3" strokeLinecap="round"/><circle cx="78" cy="61" r="3" fill={color}/><path d="M35 28L50 20L65 28" stroke="#fff" strokeWidth="1.5" opacity="0.5"/></svg>;

// ====================== ICONS ======================
const I=({n,s=20,c})=>{const p={width:s,height:s,viewBox:"0 0 24 24",fill:"none",stroke:c||"currentColor",strokeWidth:"2",style:{display:"inline-flex",flexShrink:0}};const m={
search:<svg {...p}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
school:<svg {...p}><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 1 2 3 6 3s6-2 6-3v-5"/></svg>,
doc:<svg {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
award:<svg {...p}><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>,
chat:<svg {...p}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
calendar:<svg {...p}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
compare:<svg {...p}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
resume:<svg {...p}><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg>,
check:<svg {...p}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
home:<svg {...p}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
arrow:<svg {...p}><polyline points="9 18 15 12 9 6"/></svg>,
back:<svg {...p}><polyline points="15 18 9 12 15 6"/></svg>,
upload:<svg {...p}><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>,
mail:<svg {...p}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
globe:<svg {...p}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
send:<svg {...p}><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
plus:<svg {...p}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
x:<svg {...p}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
dollar:<svg {...p}><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
user:<svg {...p}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
sparkle:<svg width={s} height={s} viewBox="0 0 24 24" fill={c||"currentColor"} style={{display:"inline-flex",flexShrink:0}}><path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"/></svg>,
sun:<svg {...p}><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
moon:<svg {...p}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
checklist:<svg {...p}><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>,
target:<svg {...p}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
clock:<svg {...p}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
mappin:<svg {...p}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
briefcase:<svg {...p}><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>,
menu:<svg {...p}><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
lock:<svg {...p}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
eye:<svg {...p}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
loader:<svg {...p} style={{display:"inline-flex",flexShrink:0,animation:"spin 1s linear infinite"}}><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>,
};return m[n]||null;};

// ====================== UI COMPONENTS ======================
const Badge=({children,color,t:th})=><span style={{background:(color||th.accent)+"1A",color:color||th.accent,padding:"3px 10px",borderRadius:"20px",fontSize:"12px",fontWeight:"600",display:"inline-block",whiteSpace:"nowrap"}}>{children}</span>;
const Btn=({children,onClick,v="primary",style={},icon,small,t:th,disabled,full})=>{const base={padding:small?"8px 16px":"12px 24px",borderRadius:"12px",border:"none",cursor:disabled?"not-allowed":"pointer",fontWeight:"600",fontSize:small?"13px":"15px",display:"inline-flex",alignItems:"center",justifyContent:"center",gap:"8px",transition:"all 0.2s",fontFamily:"inherit",opacity:disabled?0.5:1,width:full?"100%":"auto"};const vs={primary:{background:`linear-gradient(135deg,${th.accent},${th.accentDark})`,color:"#000"},secondary:{background:th.border,color:th.text},ghost:{background:"transparent",color:th.muted,border:`1px solid ${th.border}`},danger:{background:th.danger+"1A",color:th.danger},success:{background:th.success+"1A",color:th.success}};return<button onClick={disabled?undefined:onClick} style={{...base,...vs[v],...style}}>{icon&&<I n={icon} s={small?14:16}/>}{children}</button>};
const Card=({children,style={},onClick,hover,t:th})=><div onClick={onClick} style={{background:th.card,borderRadius:"16px",border:`1px solid ${th.border}`,padding:"24px",cursor:onClick?"pointer":"default",transition:"all 0.25s",boxShadow:th.shadow,...style}} onMouseEnter={e=>{if(hover||onClick){e.currentTarget.style.borderColor=th.accent+"44";e.currentTarget.style.transform="translateY(-2px)"}}} onMouseLeave={e=>{if(hover||onClick){e.currentTarget.style.borderColor=th.border;e.currentTarget.style.transform="translateY(0)"}}}>{children}</div>;
const Inp=({label,value,onChange,placeholder,type="text",options,textarea,t:th})=>{const s={width:"100%",padding:"12px 16px",borderRadius:"12px",border:`1px solid ${th.border}`,background:th.inputBg,color:th.text,fontSize:"15px",fontFamily:"inherit",outline:"none",boxSizing:"border-box"};return<div style={{marginBottom:"16px"}}>{label&&<label style={{display:"block",color:th.muted,fontSize:"13px",fontWeight:"600",marginBottom:"6px",letterSpacing:"0.5px",textTransform:"uppercase"}}>{label}</label>}{options?<select value={value} onChange={e=>onChange(e.target.value)} style={s}><option value="">{placeholder||"Select..."}</option>{options.map(o=>typeof o==='string'?<option key={o} value={o}>{o}</option>:<option key={o.value} value={o.value}>{o.label}</option>)}</select>:textarea?<textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={4} style={{...s,resize:"vertical"}}/>:<input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={s} onFocus={e=>e.target.style.borderColor=th.accent} onBlur={e=>e.target.style.borderColor=th.border}/>}</div>};
const InfoRow=({label,value,icon,color,t:th})=><div style={{display:"flex",justifyContent:"space-between",padding:"12px 0",borderBottom:`1px solid ${th.border}`}}><span style={{color:th.muted,fontSize:"14px",display:"flex",alignItems:"center",gap:"6px"}}>{icon&&<I n={icon} s={14}/>} {label}</span><span style={{color:color||th.text,fontSize:"14px",fontWeight:"600",textAlign:"right",maxWidth:"60%"}}>{value}</span></div>;
const Spinner=({t:th,msg})=><div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"48px",gap:"12px"}}><style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style><div style={{color:th.accent}}><I n="loader" s={32}/></div>{msg&&<p style={{color:th.muted,fontSize:"14px",margin:0}}>{msg}</p>}</div>;
const useIsMobile=()=>{const[m,setM]=useState(window.innerWidth<768);useEffect(()=>{const h=()=>setM(window.innerWidth<768);window.addEventListener('resize',h);return()=>window.removeEventListener('resize',h)},[]);return m};

// ====================== API HELPERS ======================
async function apiFetch(path, body) {
  const res = await fetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data;
}

// ====================== AUTH / LOGIN PAGE ======================
function AuthPage({t:th,onLogin}){
  const[mode,setMode]=useState("login");const[email,setEmail]=useState("");const[pass,setPass]=useState("");const[name,setName]=useState("");const[showPass,setShowPass]=useState(false);const[error,setError]=useState("");const[loading,setLoading]=useState(false);
  const isMobile=useIsMobile();
  const handleSubmit=()=>{setError("");if(!email||!pass){setError("Please fill in all fields");return}if(mode==="signup"&&!name){setError("Please enter your name");return}if(!email.includes("@")){setError("Please enter a valid email");return}if(pass.length<6){setError("Password must be at least 6 characters");return}setLoading(true);setTimeout(()=>{setLoading(false);onLogin({name:name||email.split("@")[0],email})},800)};
  return<div style={{minHeight:"100vh",background:th.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:"20px",fontFamily:"'DM Sans',-apple-system,sans-serif"}}>
    <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    <div style={{width:"100%",maxWidth:"420px"}}>
      <div style={{textAlign:"center",marginBottom:"32px"}}><Logo size={isMobile?60:72} color={th.accent}/><h1 style={{fontSize:isMobile?"28px":"34px",fontWeight:"800",color:th.text,margin:"16px 0 4px",letterSpacing:"-0.5px"}}>UniScout</h1><p style={{color:th.muted,fontSize:"15px",margin:0}}>Your global university scout</p></div>
      <Card t={th} style={{padding:isMobile?"24px":"32px"}}>
        <h2 style={{color:th.text,fontSize:"22px",fontWeight:"700",marginTop:0,marginBottom:"24px",textAlign:"center"}}>{mode==="login"?"Welcome back":"Create your account"}</h2>
        {error&&<div style={{background:th.danger+"1A",color:th.danger,padding:"10px 14px",borderRadius:"10px",fontSize:"14px",marginBottom:"16px",textAlign:"center"}}>{error}</div>}
        {mode==="signup"&&<Inp t={th} label="Full Name" value={name} onChange={setName} placeholder="Your name"/>}
        <Inp t={th} label="Email" value={email} onChange={setEmail} placeholder="you@email.com" type="email"/>
        <div style={{position:"relative"}}><Inp t={th} label="Password" value={pass} onChange={setPass} placeholder="Min 6 characters" type={showPass?"text":"password"}/><button onClick={()=>setShowPass(!showPass)} style={{position:"absolute",right:"12px",top:"36px",background:"none",border:"none",color:th.muted,cursor:"pointer",padding:"4px"}}><I n="eye" s={18}/></button></div>
        <Btn t={th} onClick={handleSubmit} full disabled={loading} style={{marginTop:"8px",padding:"14px",fontSize:"16px"}}>{loading?(mode==="login"?"Signing in...":"Creating account..."):(mode==="login"?"Sign In":"Create Account")}</Btn>
        <p style={{color:th.muted,fontSize:"14px",textAlign:"center",marginTop:"20px",marginBottom:0}}>{mode==="login"?"Don't have an account? ":"Already have an account? "}<button onClick={()=>{setMode(mode==="login"?"signup":"login");setError("")}} style={{background:"none",border:"none",color:th.accent,cursor:"pointer",fontWeight:"700",fontFamily:"inherit",fontSize:"14px"}}>{mode==="login"?"Sign Up":"Sign In"}</button></p>
      </Card>
      <p style={{color:th.muted,fontSize:"12px",textAlign:"center",marginTop:"20px"}}>No agents. No scams. Apply directly to universities worldwide.</p>
    </div>
  </div>;
}

// ====================== PAGES ======================
function Dashboard({t:th,setPage,setSelectedSchool,profile,savedSchools,applications}){
  const[schools,setSchools]=useState([]);const[loading,setLoading]=useState(true);const mob=useIsMobile();
  const has=profile.course||profile.skills||profile.experience;

  useEffect(()=>{
    setLoading(true);
    apiFetch('/api/recommend',{profile})
      .then(d=>setSchools((d.schools||[]).slice(0,4)))
      .catch(()=>setSchools([]))
      .finally(()=>setLoading(false));
  },[profile.course,profile.country,profile.skills]);

  return<div>
    <h1 style={{fontSize:mob?"24px":"32px",fontWeight:"800",color:th.text,margin:0}}>Welcome{profile.name?`, ${profile.name}`:""} 👋</h1>
    <p style={{color:th.muted,fontSize:mob?"14px":"16px",marginTop:"6px",marginBottom:"20px"}}>{has?"Schools matched to your profile":"Complete your profile for personalized recommendations"}</p>
    {!has&&<Card t={th} style={{marginBottom:"16px",background:`linear-gradient(135deg,${th.accent}15,${th.purple}15)`,borderColor:th.accent+"33"}}><div style={{display:"flex",alignItems:mob?"flex-start":"center",justifyContent:"space-between",flexDirection:mob?"column":"row",gap:"12px"}}><div><h3 style={{color:th.text,margin:"0 0 4px",fontSize:"16px"}}>🎯 Get Personalized Recommendations</h3><p style={{color:th.muted,margin:0,fontSize:"14px"}}>Add your resume and preferences to unlock smart school matching.</p></div><Btn t={th} onClick={()=>setPage("profile")} icon="user" small={mob}>Complete Profile</Btn></div></Card>}
    <div style={{display:"grid",gridTemplateColumns:mob?"repeat(2,1fr)":"repeat(4,1fr)",gap:mob?"10px":"14px",marginBottom:"20px"}}>
      {[{l:"Saved",v:savedSchools.length,i:"school",c:th.accent},{l:"Applications",v:applications.length,i:"doc",c:th.info},{l:"Scholarships",v:"10+",i:"award",c:th.success},{l:"Countries",v:"20+",i:"calendar",c:th.danger}].map((s,i)=><Card key={i} t={th} style={{textAlign:"center",padding:mob?"14px":"18px"}}><div style={{color:s.c,marginBottom:"4px"}}><I n={s.i} s={mob?20:24}/></div><div style={{fontSize:mob?"20px":"26px",fontWeight:"800",color:th.text}}>{s.v}</div><div style={{fontSize:"11px",color:th.muted}}>{s.l}</div></Card>)}
    </div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"12px"}}><h2 style={{fontSize:mob?"18px":"20px",fontWeight:"700",color:th.text,margin:0}}>{has?"🎯 Matched for You":"🌍 Popular Schools"}</h2><Btn t={th} small v="ghost" onClick={()=>setPage("schools")} icon="arrow">All</Btn></div>
    {loading?<Spinner t={th} msg="Finding best matches..."/>:
    <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"repeat(2,1fr)",gap:"12px",marginBottom:"20px"}}>
      {schools.map((s,i)=><Card key={s.id||i} t={th} onClick={()=>{setSelectedSchool(s);setPage("detail")}} hover><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}><div style={{display:"flex",gap:"10px",alignItems:"center"}}><div style={{width:"46px",height:"46px",borderRadius:"12px",background:s.color||"#1E3A5F",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"22px",flexShrink:0}}>{s.photo||"🏛️"}</div><div><div style={{fontWeight:"700",color:th.text,fontSize:"14px"}}>{s.name}</div><div style={{color:th.muted,fontSize:"12px"}}>{s.flag} {s.city}</div></div></div><Badge t={th}>#{s.ranking}</Badge></div><div style={{display:"flex",gap:"6px",marginTop:"8px",flexWrap:"wrap"}}><Badge t={th} color={th.success}>{s.tuition}</Badge></div></Card>)}
    </div>}
    <h2 style={{fontSize:mob?"18px":"20px",fontWeight:"700",color:th.text,marginBottom:"12px"}}>⚡ Quick Actions</h2>
    <div style={{display:"grid",gridTemplateColumns:mob?"repeat(2,1fr)":"repeat(4,1fr)",gap:"10px"}}>
      {[{l:"Scholarships",i:"award",p:"scholarships",c:th.success},{l:"Draft Letter",i:"doc",p:"letters",c:th.info},{l:"Build Resume",i:"resume",p:"resume",c:th.purple},{l:"AI Advisor",i:"chat",p:"advisor",c:th.accent}].map((a,i)=><Card key={i} t={th} onClick={()=>setPage(a.p)} hover style={{padding:"16px",textAlign:"center"}}><div style={{color:a.c,marginBottom:"4px"}}><I n={a.i} s={20}/></div><div style={{color:th.text,fontWeight:"600",fontSize:"12px"}}>{a.l}</div></Card>)}
    </div>
  </div>;
}

function SchoolsPage({t:th,setPage,setSelectedSchool,savedSchools,setSavedSchools,profile}){
  const[search,setSearch]=useState("");const[country,setCountry]=useState("");const[schools,setSchools]=useState([]);const[loading,setLoading]=useState(false);const[countries,setCountries]=useState([]);const mob=useIsMobile();

  useEffect(()=>{
    fetch('/api/countries').then(r=>r.json()).then(d=>setCountries(d.countries||[])).catch(()=>{});
    doSearch("","",'');
  },[]);

  const doSearch=async(q,c,profileCtx)=>{
    setLoading(true);
    try{const d=await apiFetch('/api/schools/search',{query:q||"top universities worldwide",country:c,profile:profileCtx});setSchools(d.schools||[]);}
    catch(e){setSchools([]);}
    setLoading(false);
  };

  const handleSearch=()=>doSearch(search,country,profile);

  return<div>
    <h1 style={{fontSize:mob?"24px":"32px",fontWeight:"800",color:th.text,margin:"0 0 12px"}}>Explore Schools</h1>
    <Card t={th} style={{marginBottom:"14px",padding:"16px"}}>
      <div style={{display:"flex",gap:"10px",flexDirection:mob?"column":"row"}}>
        <div style={{flex:2}}><Inp t={th} label="Search" value={search} onChange={setSearch} placeholder="School, program, city, country..."/></div>
        <div style={{flex:1}}><Inp t={th} label="Country" value={country} onChange={setCountry} options={countries}/></div>
      </div>
      <Btn t={th} onClick={handleSearch} icon="search" disabled={loading}>{loading?"Searching...":"Search with AI"}</Btn>
    </Card>
    {loading?<Spinner t={th} msg="AI is searching universities..."/>:
    <>
      <p style={{color:th.muted,fontSize:"14px",marginBottom:"12px"}}>{schools.length} schools found</p>
      <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
        {schools.map((s,i)=><Card key={s.id||i} t={th} hover onClick={()=>{setSelectedSchool(s);setPage("detail")}}>
          <div style={{display:"flex",gap:"12px",alignItems:"flex-start"}}>
            <div style={{width:mob?"50px":"64px",height:mob?"50px":"64px",borderRadius:"14px",background:s.color||"#1E3A5F",display:"flex",alignItems:"center",justifyContent:"center",fontSize:mob?"24px":"32px",flexShrink:0}}>{s.photo||"🏛️"}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",alignItems:"center",gap:"6px",flexWrap:"wrap",marginBottom:"4px"}}><span style={{fontWeight:"700",color:th.text,fontSize:mob?"15px":"17px"}}>{s.name}</span><Badge t={th}>#{s.ranking}</Badge></div>
              <div style={{color:th.muted,fontSize:"13px",marginBottom:"4px"}}>{s.flag} {s.city}, {s.country}</div>
              {!mob&&<p style={{color:th.muted,fontSize:"13px",margin:"0 0 6px",lineHeight:"1.4",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{s.description}</p>}
              <div style={{display:"flex",gap:"6px",flexWrap:"wrap",alignItems:"center"}}>
                <Badge t={th} color={th.success}>{s.tuition}</Badge>
                <Badge t={th} color={th.info}>{s.acceptance}</Badge>
                <Btn t={th} small v={savedSchools.includes(s.id)?"success":"ghost"} onClick={e=>{e.stopPropagation();setSavedSchools(p=>p.includes(s.id)?p.filter(x=>x!==s.id):[...p,s.id])}} icon={savedSchools.includes(s.id)?"check":"plus"}>{savedSchools.includes(s.id)?"Saved":"Save"}</Btn>
              </div>
            </div>
          </div>
        </Card>)}
      </div>
    </>}
  </div>;
}

function SchoolDetail({school:s,t:th,setPage,savedSchools,setSavedSchools,applications,setApplications,profile}){
  const[tab,setTab]=useState("overview");const[visa,setVisa]=useState(null);const[visaLoading,setVisaLoading]=useState(false);const mob=useIsMobile();if(!s)return null;
  const saved=savedSchools.includes(s.id);const applied=applications.some(a=>a.schoolId===s.id);

  const loadVisa=async()=>{
    if(visa)return;
    setVisaLoading(true);
    try{const d=await apiFetch('/api/visa',{country:s.country,nationality:profile?.nationality||'international'});setVisa(d.visa);}
    catch(e){setVisa({type:"N/A",time:"N/A",cost:"N/A",funds:"N/A",docs:["Check official embassy website"],tips:"Please check the official embassy website for the most current requirements."});}
    setVisaLoading(false);
  };

  useEffect(()=>{if(tab==="visa")loadVisa();},[tab]);

  const tabs=[{id:"overview",l:"Overview"},{id:"costs",l:"Costs"},{id:"housing",l:"Housing"},{id:"reqs",l:"Requirements"},{id:"visa",l:"Visa"},{id:"contact",l:"Contact"}];
  return<div>
    <button onClick={()=>setPage("schools")} style={{background:"none",border:"none",color:th.accent,cursor:"pointer",fontSize:"14px",fontWeight:"600",display:"flex",alignItems:"center",gap:"4px",padding:0,marginBottom:"12px",fontFamily:"inherit"}}><I n="back" s={16}/> Back</button>
    <Card t={th} style={{marginBottom:"16px",background:`linear-gradient(135deg,${s.color||"#1E3A5F"}CC,${th.card})`}}>
      <div style={{display:"flex",gap:"14px",alignItems:"center",marginBottom:"12px"}}><div style={{width:mob?"56px":"72px",height:mob?"56px":"72px",borderRadius:"16px",background:"rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:mob?"28px":"38px"}}>{s.photo||"🏛️"}</div><div><h1 style={{fontSize:mob?"20px":"26px",fontWeight:"800",color:"#fff",margin:"0 0 4px"}}>{s.name}</h1><p style={{color:"rgba(255,255,255,0.7)",margin:"0 0 6px",fontSize:"14px"}}>{s.flag} {s.city}, {s.country}</p><div style={{display:"flex",gap:"4px",flexWrap:"wrap"}}><Badge t={th}>#{s.ranking}</Badge><Badge t={th} color={th.success}>{s.acceptance}</Badge></div></div></div>
      <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}><Btn t={th} small v={saved?"success":"secondary"} icon={saved?"check":"plus"} onClick={()=>setSavedSchools(p=>p.includes(s.id)?p.filter(x=>x!==s.id):[...p,s.id])}>{saved?"Saved":"Save"}</Btn>{!applied?<Btn t={th} small icon="doc" onClick={()=>setApplications(p=>[...p,{schoolId:s.id,name:s.name,status:"In Progress",date:new Date().toLocaleDateString(),progress:15,country:s.country}])}>Apply</Btn>:<Btn t={th} small v="success" icon="check">Applied</Btn>}</div>
    </Card>
    <div style={{display:"flex",gap:"2px",marginBottom:"16px",overflowX:"auto",borderBottom:`1px solid ${th.border}`}}>{tabs.map(tb=><button key={tb.id} onClick={()=>setTab(tb.id)} style={{background:"none",border:"none",color:tab===tb.id?th.accent:th.muted,fontSize:"13px",fontWeight:"600",padding:"10px 14px",cursor:"pointer",fontFamily:"inherit",borderBottom:tab===tb.id?`2px solid ${th.accent}`:"2px solid transparent",whiteSpace:"nowrap"}}>{tb.l}</button>)}</div>
    {tab==="overview"&&<div style={{display:"grid",gridTemplateColumns:mob?"1fr":"2fr 1fr",gap:"14px"}}><div><Card t={th} style={{marginBottom:"12px"}}><h3 style={{color:th.text,marginTop:0}}>About</h3><p style={{color:th.muted,lineHeight:1.7,fontSize:"14px"}}>{s.description}</p></Card><Card t={th}><h3 style={{color:th.text,marginTop:0}}>Programs</h3><div style={{display:"flex",flexWrap:"wrap",gap:"6px"}}>{(s.programs||[]).map(p=><Badge key={p} t={th} color={th.purple}>{p}</Badge>)}</div></Card></div><Card t={th}><h3 style={{color:th.text,marginTop:0}}>Quick Facts</h3><InfoRow t={th} label="Tuition" value={s.tuition} icon="dollar" color={th.accent}/><InfoRow t={th} label="Deadline" value={s.deadline} icon="calendar" color={th.danger}/><InfoRow t={th} label="Living Cost" value={s.costOfLiving} icon="home"/><InfoRow t={th} label="Part-Time" value={s.partTime} icon="briefcase"/>{s.language&&<InfoRow t={th} label="Language" value={s.language} icon="globe"/>}{s.employmentRate&&<InfoRow t={th} label="Employment" value={s.employmentRate} icon="target" color={th.success}/>}</Card></div>}
    {tab==="costs"&&<div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:"14px"}}><Card t={th}><h3 style={{color:th.text,marginTop:0}}>💰 Costs</h3>{[{l:"Tuition",v:s.tuition},{l:"Accommodation",v:s.accommodation},{l:"Textbooks",v:s.textbooks},{l:"App Fee",v:s.applicationFee},{l:"Living",v:s.costOfLiving}].map((c,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:`1px solid ${th.border}`}}><span style={{color:th.muted,fontSize:"14px"}}>{c.l}</span><span style={{color:th.accent,fontWeight:"700",fontSize:"14px"}}>{c.v}</span></div>)}</Card><div><Card t={th} style={{marginBottom:"12px"}}><h3 style={{color:th.text,marginTop:0}}>Payment</h3><p style={{color:th.muted,lineHeight:1.7,fontSize:"14px"}}>{s.payment}</p></Card><Card t={th}><h3 style={{color:th.text,marginTop:0}}>📚 Textbooks</h3>{(s.textbookList||[]).map((b,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:i<(s.textbookList||[]).length-1?`1px solid ${th.border}`:"none"}}><div><div style={{color:th.text,fontSize:"13px"}}>{b.name}</div><span style={{color:b.req?th.danger:th.success,fontSize:"11px"}}>{b.req?"Required":"Optional"}</span></div><span style={{color:th.accent,fontWeight:"600",fontSize:"13px"}}>{b.price}</span></div>)}</Card></div></div>}
    {tab==="housing"&&<div style={{display:"grid",gridTemplateColumns:mob?"1fr":"repeat(3,1fr)",gap:"12px"}}>{(s.accommodationOptions||[]).map((a,i)=><Card key={i} t={th}><h3 style={{color:th.text,marginTop:0,fontSize:"16px"}}>🏠 {a.name}</h3><Badge t={th} color={th.purple}>{a.type}</Badge><div style={{marginTop:"12px"}}>{[{l:"Price",v:a.price,c:th.accent},{l:"Meals",v:a.meal},{l:"Amenities",v:a.amenities},{l:"Distance",v:a.distance}].map((f,j)=><div key={j} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${th.border}`}}><span style={{color:th.muted,fontSize:"12px"}}>{f.l}</span><span style={{color:f.c||th.text,fontWeight:f.c?"700":"500",fontSize:"12px",textAlign:"right",maxWidth:"55%"}}>{f.v}</span></div>)}</div></Card>)}</div>}
    {tab==="reqs"&&<Card t={th}><h3 style={{color:th.text,marginTop:0}}>Requirements</h3><div style={{display:"flex",flexDirection:"column",gap:"8px"}}>{(s.requirements||[]).map((r,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:"10px",padding:"10px 14px",background:th.surface,borderRadius:"10px"}}><div style={{width:"24px",height:"24px",borderRadius:"50%",background:th.accent+"1A",color:th.accent,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"12px",fontWeight:"700",flexShrink:0}}>{i+1}</div><span style={{color:th.text,fontSize:"14px"}}>{r}</span></div>)}</div><div style={{marginTop:"14px",display:"flex",gap:"8px",flexWrap:"wrap"}}><Btn t={th} small icon="doc" onClick={()=>setPage("letters")}>Draft Letter</Btn><Btn t={th} small v="secondary" icon="resume" onClick={()=>setPage("resume")}>Build Resume</Btn></div></Card>}
    {tab==="visa"&&<div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:"14px"}}>{visaLoading?<Spinner t={th} msg="Loading visa info..."/>:visa?<><Card t={th}><h3 style={{color:th.text,marginTop:0}}>✈️ Visa — {s.country}</h3><InfoRow t={th} label="Type" value={visa.type} icon="doc"/><InfoRow t={th} label="Processing" value={visa.time} icon="clock"/><InfoRow t={th} label="Cost" value={visa.cost} icon="dollar"/><InfoRow t={th} label="Funds Required" value={visa.funds} icon="dollar" color={th.accent}/></Card><div><Card t={th} style={{marginBottom:"12px"}}><h3 style={{color:th.text,marginTop:0}}>Documents</h3>{(visa.docs||[]).map((d,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:"6px",padding:"5px 0",color:th.muted,fontSize:"14px"}}><span style={{color:th.success}}>✓</span> {d}</div>)}</Card><Card t={th}><h3 style={{color:th.text,marginTop:0}}>💡 Tips</h3><p style={{color:th.muted,lineHeight:1.7,fontSize:"14px"}}>{visa.tips}</p></Card></div></>:<Btn t={th} onClick={loadVisa} icon="globe">Load Visa Info</Btn>}</div>}
    {tab==="contact"&&<Card t={th}><h3 style={{color:th.text,marginTop:0}}>📞 Direct Contact</h3><p style={{color:th.muted,marginBottom:"14px",fontSize:"14px"}}>Contact directly — no agents.</p><div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:"10px"}}>{[{l:"Email",v:s.email,i:"mail"},{l:"Phone",v:s.phone,i:"chat"},{l:"Website",v:s.website,i:"globe"},{l:"Deadline",v:s.deadline,i:"calendar"},{l:"Fee",v:s.applicationFee,i:"dollar"},{l:"Location",v:`${s.city}, ${s.country}`,i:"mappin"}].map((c,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:"10px",padding:"12px",background:th.surface,borderRadius:"10px"}}><div style={{color:th.accent}}><I n={c.i} s={18}/></div><div><div style={{color:th.muted,fontSize:"11px",textTransform:"uppercase"}}>{c.l}</div><div style={{color:th.text,fontWeight:"600",fontSize:"13px",wordBreak:"break-all"}}>{c.v}</div></div></div>)}</Card>}
  </div>;
}

function ScholarshipsPage({t:th,profile}){
  const[scholarships,setScholarships]=useState([]);const[search,setSearch]=useState("");const[filter,setFilter]=useState("");const[loading,setLoading]=useState(false);const[countries,setCountries]=useState([]);const mob=useIsMobile();

  useEffect(()=>{doSearch("","");},[]);

  const doSearch=async(q,c)=>{
    setLoading(true);
    try{const d=await apiFetch('/api/scholarships/search',{query:q||"all scholarships",country:c,profile});setScholarships(d.scholarships||[]);const cs=[...new Set((d.scholarships||[]).map(s=>s.country))].sort();setCountries(cs);}
    catch(e){setScholarships([]);}
    setLoading(false);
  };

  return<div>
    <h1 style={{fontSize:mob?"24px":"32px",fontWeight:"800",color:th.text,margin:"0 0 12px"}}>Scholarships & Funding</h1>
    <Card t={th} style={{marginBottom:"12px",padding:"14px"}}>
      <div style={{display:"flex",gap:"8px",flexDirection:mob?"column":"row"}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search scholarships..." style={{flex:1,padding:"10px 14px",borderRadius:"10px",border:`1px solid ${th.border}`,background:th.inputBg,color:th.text,fontSize:"15px",fontFamily:"inherit",outline:"none",boxSizing:"border-box"}}/>
        <Btn t={th} onClick={()=>doSearch(search,filter)} icon="search" disabled={loading}>{loading?"Searching...":"Search"}</Btn>
      </div>
    </Card>
    <div style={{display:"flex",gap:"6px",marginBottom:"14px",flexWrap:"wrap"}}>{["",...countries].map(c=><Btn key={c} t={th} small v={filter===c?"primary":"ghost"} onClick={()=>{setFilter(c);doSearch(search,c)}}>{c||"All"}</Btn>)}</div>
    {loading?<Spinner t={th} msg="Finding scholarships..."/>:
    <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>{scholarships.map((s,i)=><Card key={s.id||i} t={th}><div style={{display:"flex",alignItems:"center",gap:"6px",marginBottom:"6px",flexWrap:"wrap"}}><span style={{fontWeight:"700",color:th.text,fontSize:mob?"16px":"18px"}}>{s.name}</span><Badge t={th} color={s.type==="Full Ride"?th.success:th.info}>{s.type}</Badge></div><div style={{display:"flex",gap:"12px",marginBottom:"6px",flexWrap:"wrap",fontSize:"13px"}}><span style={{color:th.muted}}>🌍 {s.country}</span><span style={{color:th.accent,fontWeight:"600"}}>💰 {s.amount}</span><span style={{color:th.danger}}>📅 {s.deadline}</span></div><p style={{color:th.textSec,fontSize:"13px",margin:"0 0 4px"}}><strong style={{color:th.text}}>Eligibility:</strong> {s.eligibility}</p><p style={{color:th.textSec,fontSize:"13px",margin:"0 0 8px"}}><strong style={{color:th.text}}>Programs:</strong> {s.programs}</p><div style={{display:"flex",gap:"14px",flexWrap:"wrap",fontSize:"13px"}}><span style={{color:th.info,display:"flex",alignItems:"center",gap:"4px"}}><I n="mail" s={13}/> {s.email}</span><span style={{color:th.info,display:"flex",alignItems:"center",gap:"4px"}}><I n="globe" s={13}/> {s.website}</span></div></Card>)}</div>}
  </div>;
}

function AppTracker({t:th,applications,setApplications,setPage}){
  const sts=["In Progress","Documents","Submitted","Under Review","Accepted","Rejected"];const mob=useIsMobile();
  if(!applications.length)return<div><h1 style={{fontSize:mob?"24px":"32px",fontWeight:"800",color:th.text,margin:"0 0 16px"}}>Applications</h1><Card t={th} style={{textAlign:"center",padding:"48px"}}><div style={{fontSize:"40px",marginBottom:"12px"}}>📋</div><h3 style={{color:th.text}}>No applications yet</h3><Btn t={th} onClick={()=>setPage("schools")} icon="school" style={{marginTop:"12px"}}>Explore Schools</Btn></Card></div>;
  return<div><h1 style={{fontSize:mob?"24px":"32px",fontWeight:"800",color:th.text,margin:"0 0 16px"}}>Applications</h1><div style={{display:"flex",flexDirection:"column",gap:"12px"}}>{applications.map((a,i)=><Card key={i} t={th}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"10px",flexWrap:"wrap",gap:"8px"}}><div><div style={{fontWeight:"700",color:th.text,fontSize:"16px"}}>{a.name}</div><div style={{color:th.muted,fontSize:"12px"}}>{a.date}</div></div><div style={{display:"flex",gap:"6px"}}><select value={a.status} onChange={e=>{const u=[...applications];u[i].status=e.target.value;u[i].progress=Math.min((sts.indexOf(e.target.value)+1)*20,100);setApplications(u)}} style={{padding:"6px 10px",borderRadius:"8px",border:`1px solid ${th.border}`,background:th.inputBg,color:th.text,fontFamily:"inherit",fontSize:"12px"}}>{sts.map(s=><option key={s} value={s}>{s}</option>)}</select><Btn t={th} small v="danger" icon="x" onClick={()=>setApplications(p=>p.filter((_,idx)=>idx!==i))}>Del</Btn></div></div><div style={{height:"6px",borderRadius:"3px",background:th.border}}><div style={{height:"100%",borderRadius:"3px",width:`${Math.min(a.progress,100)}%`,background:`linear-gradient(90deg,${th.accent},${th.accentLight})`,transition:"width 0.4s"}}/></div><div style={{color:th.muted,fontSize:"12px",marginTop:"4px"}}>{Math.min(a.progress,100)}%</div></Card>)}</div></div>;
}

function ComparePage({t:th,savedSchools,setPage,allSchools}){
  const schools=(allSchools||[]).filter(s=>savedSchools.includes(s.id));const mob=useIsMobile();
  const fields=[{l:"Tuition",k:"tuition"},{l:"Ranking",k:"ranking",f:v=>`#${v}`},{l:"Acceptance",k:"acceptance"},{l:"Living Cost",k:"costOfLiving"},{l:"Part-Time",k:"partTime"},{l:"Employment",k:"employmentRate"},{l:"Deadline",k:"deadline"}];
  if(schools.length<2)return<div><h1 style={{fontSize:mob?"24px":"32px",fontWeight:"800",color:th.text,margin:"0 0 16px"}}>Compare</h1><Card t={th} style={{textAlign:"center",padding:"48px"}}><div style={{fontSize:"40px",marginBottom:"12px"}}>⚖️</div><h3 style={{color:th.text}}>Save 2+ schools to compare</h3><Btn t={th} onClick={()=>setPage("schools")} icon="school" style={{marginTop:"12px"}}>Explore</Btn></Card></div>;
  return<div><h1 style={{fontSize:mob?"24px":"32px",fontWeight:"800",color:th.text,margin:"0 0 16px"}}>Compare</h1><div style={{overflowX:"auto",borderRadius:"14px",border:`1px solid ${th.border}`}}><table style={{width:"100%",borderCollapse:"collapse"}}><thead><tr><th style={{padding:"12px",textAlign:"left",color:th.muted,fontSize:"12px",background:th.card,borderBottom:`1px solid ${th.border}`}}></th>{schools.map((s,i)=><th key={i} style={{padding:"12px",textAlign:"center",borderBottom:`1px solid ${th.border}`,background:th.card,minWidth:"150px"}}><div style={{fontSize:"22px"}}>{s.photo||"🏛️"}</div><div style={{color:th.text,fontWeight:"700",fontSize:"13px"}}>{s.name}</div><div style={{color:th.muted,fontSize:"11px"}}>{s.flag}</div></th>)}</tr></thead><tbody>{fields.map((f,i)=><tr key={f.k}><td style={{padding:"10px 12px",color:th.muted,fontWeight:"600",fontSize:"12px",background:i%2===0?th.surface:th.card}}>{f.l}</td>{schools.map((s,j)=><td key={j} style={{padding:"10px",textAlign:"center",color:th.text,fontSize:"12px",background:i%2===0?th.surface:th.card}}>{f.f?f.f(s[f.k]):(s[f.k]||"—")}</td>)}</tr>)}</tbody></table></div></div>;
}

function LetterDrafter({t:th,profile}){
  const[form,setForm]=useState({school:"",program:"",name:profile.name||"",background:profile.education||"",why:"",strengths:profile.skills||"",type:"sop"});
  const[gen,setGen]=useState("");const[loading,setLoading]=useState(false);const set=(k,v)=>setForm({...form,[k]:v});const mob=useIsMobile();
  const generate=async()=>{setLoading(true);try{const d=await apiFetch('/api/letter',form);setGen(d.letter);}catch(err){setGen(`Error: ${err.message}. Try again.`)}setLoading(false)};
  return<div><h1 style={{fontSize:mob?"24px":"32px",fontWeight:"800",color:th.text,margin:"0 0 16px"}}>AI Letter Drafter</h1><div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:"16px"}}><Card t={th}><h3 style={{color:th.text,marginTop:0}}>✍️ Details</h3><Inp t={th} label="Type" value={form.type} onChange={v=>set("type",v)} options={[{value:"sop",label:"Statement of Purpose"},{value:"motivation",label:"Motivation Letter"},{value:"cover",label:"Cover Letter"}]}/><Inp t={th} label="Name" value={form.name} onChange={v=>set("name",v)} placeholder="Full name"/><Inp t={th} label="School" value={form.school} onChange={v=>set("school",v)} placeholder="University of Toronto"/><Inp t={th} label="Program" value={form.program} onChange={v=>set("program",v)} placeholder="Computer Science"/><Inp t={th} label="Background" value={form.background} onChange={v=>set("background",v)} placeholder="Education & experience..." textarea/><Inp t={th} label="Why this school?" value={form.why} onChange={v=>set("why",v)} placeholder="What draws you?" textarea/><Inp t={th} label="Strengths" value={form.strengths} onChange={v=>set("strengths",v)} placeholder="Skills, achievements..."/><Btn t={th} onClick={generate} icon="sparkle" full disabled={loading}>{loading?"Generating...":"Generate with AI"}</Btn></Card><Card t={th}><h3 style={{color:th.text,marginTop:0}}>📄 Result</h3>{gen?<><div style={{background:th.surface,borderRadius:"12px",padding:"16px",maxHeight:"500px",overflowY:"auto",whiteSpace:"pre-wrap",color:th.text,lineHeight:1.7,fontSize:"14px"}}>{gen}</div><div style={{display:"flex",gap:"8px",marginTop:"10px"}}><Btn t={th} small v="secondary" onClick={()=>navigator.clipboard?.writeText(gen)}>Copy</Btn><Btn t={th} small v="ghost" onClick={()=>setGen("")} icon="x">Clear</Btn></div></>:<div style={{textAlign:"center",padding:"48px 16px",color:th.muted}}><div style={{fontSize:"40px",marginBottom:"10px"}}>✨</div><p>Fill in details and generate with real AI.</p></div>}</Card></div></div>;
}

function ResumeBuilder({t:th,profile,setProfile}){
  const[form,setForm]=useState({name:profile.name||"",email:profile.email||"",phone:profile.phone||"",summary:"",education:profile.education||"",experience:profile.experience||"",skills:profile.skills||"",achievements:profile.achievements||"",languages:profile.languages||"",interests:profile.interests||""});
  const[gen,setGen]=useState(false);const[improving,setImproving]=useState(false);const set=(k,v)=>setForm({...form,[k]:v});const mob=useIsMobile();
  const generate=()=>{setGen(true);setProfile(p=>({...p,name:form.name||p.name,email:form.email||p.email,education:form.education||p.education,experience:form.experience||p.experience,skills:form.skills||p.skills,achievements:form.achievements||p.achievements,resumeText:`${form.education} ${form.experience} ${form.skills} ${form.achievements}`}))};
  const aiImprove=async()=>{setImproving(true);try{const d=await apiFetch('/api/resume',form);const lines=d.improved.split('\n');let sec='';const u={...form};lines.forEach(l=>{const t=l.trim();if(t.toUpperCase().includes('SUMMARY'))sec='summary';else if(t.toUpperCase().includes('EDUCATION'))sec='education';else if(t.toUpperCase().includes('EXPERIENCE'))sec='experience';else if(t.toUpperCase().includes('SKILL'))sec='skills';else if(t.toUpperCase().includes('ACHIEVEMENT'))sec='achievements';else if(t&&sec){u[sec]=(u[sec]?u[sec]+'\n':'')+t}});setForm(u);setGen(true);}catch(err){alert('AI error: '+err.message)}setImproving(false)};
  return<div><h1 style={{fontSize:mob?"24px":"32px",fontWeight:"800",color:th.text,margin:"0 0 16px"}}>Resume Builder</h1><div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:"16px"}}><Card t={th}><h3 style={{color:th.text,marginTop:0}}>📝 Info</h3><Inp t={th} label="Name" value={form.name} onChange={v=>set("name",v)} placeholder="Full name"/><Inp t={th} label="Email" value={form.email} onChange={v=>set("email",v)} placeholder="email@example.com"/><Inp t={th} label="Summary" value={form.summary} onChange={v=>set("summary",v)} placeholder="2-3 sentence summary..." textarea/><Inp t={th} label="Education" value={form.education} onChange={v=>set("education",v)} placeholder="BSc CS, MIT, 2024" textarea/><Inp t={th} label="Experience" value={form.experience} onChange={v=>set("experience",v)} placeholder="Intern, Research..." textarea/><Inp t={th} label="Skills" value={form.skills} onChange={v=>set("skills",v)} placeholder="Python, ML..."/><Inp t={th} label="Achievements" value={form.achievements} onChange={v=>set("achievements",v)} placeholder="Dean's List..." textarea/><div style={{display:"flex",gap:"8px"}}><Btn t={th} onClick={generate} icon="sparkle" style={{flex:1}}>Save</Btn><Btn t={th} v="secondary" onClick={aiImprove} disabled={improving} style={{flex:1}}>{improving?"...":"✨ AI Improve"}</Btn></div></Card><Card t={th}><h3 style={{color:th.text,marginTop:0}}>📄 Preview</h3>{gen?<div style={{background:th.surface,borderRadius:"12px",padding:"20px",border:`1px solid ${th.border}`}}><div style={{textAlign:"center",borderBottom:`2px solid ${th.accent}`,paddingBottom:"10px",marginBottom:"12px"}}><h2 style={{margin:0,fontSize:"18px",color:th.text}}>{form.name||"Name"}</h2><div style={{color:th.muted,fontSize:"12px",marginTop:"4px"}}>{[form.email,form.phone].filter(Boolean).join(" | ")}</div></div>{[{l:"SUMMARY",v:form.summary},{l:"EDUCATION",v:form.education},{l:"EXPERIENCE",v:form.experience},{l:"SKILLS",v:form.skills},{l:"ACHIEVEMENTS",v:form.achievements}].filter(s=>s.v).map((s,i)=><div key={i} style={{marginBottom:"10px"}}><h4 style={{color:th.accent,fontSize:"11px",letterSpacing:"1.5px",borderBottom:`1px solid ${th.border}`,paddingBottom:"3px",marginBottom:"5px"}}>{s.l}</h4><div style={{color:th.textSec,fontSize:"12px",lineHeight:1.6,whiteSpace:"pre-wrap"}}>{s.v}</div></div>)}</div>:<div style={{textAlign:"center",padding:"48px 16px",color:th.muted}}><div style={{fontSize:"40px",marginBottom:"10px"}}>📄</div><p>Fill in to preview. Saves to profile for matching!</p></div>}</Card></div></div>;
}

function DocVault({t:th,documents,setDocuments}){
  const defaults=[{name:"Transcript.pdf",type:"Transcript",size:"1.2 MB",icon:"📄"},{name:"IELTS_Cert.pdf",type:"Test Score",size:"0.8 MB",icon:"📊"},{name:"Passport.jpg",type:"ID",size:"3.1 MB",icon:"🛂"},{name:"Reference.pdf",type:"Reference",size:"0.5 MB",icon:"✉️"}];const mob=useIsMobile();
  return<div><h1 style={{fontSize:mob?"24px":"32px",fontWeight:"800",color:th.text,margin:"0 0 16px"}}>Document Vault</h1><Card t={th} style={{marginBottom:"16px",textAlign:"center",padding:"32px",border:`2px dashed ${th.border}`,cursor:"pointer"}} onClick={()=>setDocuments(p=>[...p,{name:`Doc_${p.length+1}.pdf`,type:"Upload",size:`${(Math.random()*3+0.5).toFixed(1)} MB`,icon:"📎"}])}><div style={{color:th.accent}}><I n="upload" s={32}/></div><p style={{color:th.text,fontWeight:"600",marginTop:"8px",marginBottom:"4px"}}>Upload documents</p><p style={{color:th.muted,fontSize:"13px",margin:0}}>Transcripts, certificates, passport, references</p></Card><div style={{display:"grid",gridTemplateColumns:mob?"1fr":"repeat(3,1fr)",gap:"10px"}}>{[...defaults,...documents].map((d,i)=><Card key={i} t={th} style={{padding:"16px"}}><div style={{display:"flex",gap:"10px"}}><div style={{width:"36px",height:"36px",borderRadius:"10px",background:th.accent+"1A",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"16px",flexShrink:0}}>{d.icon}</div><div style={{minWidth:0}}><div style={{color:th.text,fontWeight:"600",fontSize:"13px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{d.name}</div><div style={{color:th.muted,fontSize:"11px"}}>{d.type} • {d.size}</div></div></div></Card>)}</div></div>;
}

function AIAdvisor({t:th,profile}){
  const[msgs,setMsgs]=useState([{role:"ai",text:`Hey${profile.name?` ${profile.name}`:""}! I'm your UniScout advisor. Ask about ANY university worldwide, scholarships, visas, or applications. No agents — just answers.`}]);
  const[input,setInput]=useState("");const[typing,setTyping]=useState(false);const chatEnd=useRef(null);const mob=useIsMobile();
  useEffect(()=>{chatEnd.current?.scrollIntoView({behavior:"smooth"})},[msgs]);
  const send=async()=>{if(!input.trim()||typing)return;const msg=input;setMsgs(p=>[...p,{role:"user",text:msg}]);setInput("");setTyping(true);
    try{const d=await apiFetch('/api/chat',{message:msg,profile,history:msgs.slice(-10)});setMsgs(p=>[...p,{role:"ai",text:d.reply}]);}
    catch(err){setMsgs(p=>[...p,{role:"ai",text:`Connection error: ${err.message}. Try again.`}]);}
    setTyping(false);
  };
  return<div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 120px)"}}><h1 style={{fontSize:mob?"24px":"32px",fontWeight:"800",color:th.text,margin:"0 0 10px"}}>AI Advisor</h1>
    <div style={{display:"flex",gap:"6px",marginBottom:"10px",flexWrap:"wrap"}}>{["Schools for my budget?","Best scholarships?","Visa requirements?","Improve my application?"].map(tip=><button key={tip} onClick={()=>setInput(tip)} style={{padding:"4px 10px",borderRadius:"14px",border:`1px solid ${th.border}`,background:th.surface,color:th.muted,fontSize:"11px",cursor:"pointer",fontFamily:"inherit"}}>{tip}</button>)}</div>
    <Card t={th} style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",padding:0}}><div style={{flex:1,overflowY:"auto",padding:"16px"}}>{msgs.map((m,i)=><div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",marginBottom:"10px"}}>{m.role==="ai"&&<div style={{width:"28px",height:"28px",borderRadius:"50%",background:`linear-gradient(135deg,${th.accent},${th.accentDark})`,display:"flex",alignItems:"center",justifyContent:"center",marginRight:"8px",flexShrink:0}}><Logo size={16} color="#fff"/></div>}<div style={{maxWidth:mob?"85%":"72%",padding:"10px 14px",borderRadius:"14px",lineHeight:1.6,fontSize:"14px",whiteSpace:"pre-wrap",wordBreak:"break-word",background:m.role==="user"?`linear-gradient(135deg,${th.accent},${th.accentDark})`:th.surface,color:m.role==="user"?"#000":th.text}}>{m.text}</div></div>)}{typing&&<div style={{color:th.muted,fontSize:"14px",padding:"6px"}}>Thinking...</div>}<div ref={chatEnd}/></div><div style={{padding:"10px 14px",borderTop:`1px solid ${th.border}`,display:"flex",gap:"8px"}}><input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Ask anything..." style={{flex:1,padding:"10px 14px",borderRadius:"12px",border:`1px solid ${th.border}`,background:th.inputBg,color:th.text,fontSize:"15px",fontFamily:"inherit",outline:"none"}}/><Btn t={th} onClick={send} icon="send" disabled={typing} small>Send</Btn></div></Card></div>;
}

function PostAccept({t:th,profile}){
  const[country,setCountry]=useState("");const[checked,setChecked]=useState({});const[checklist,setChecklist]=useState([]);const[loading,setLoading]=useState(false);const[countries,setCountries]=useState(["Canada","Australia","Germany","United Kingdom","Singapore","South Africa","Switzerland","USA","Netherlands","France","Japan","New Zealand"]);const mob=useIsMobile();
  const done=checklist.filter((_,i)=>checked[`${country}-${i}`]).length;

  const loadChecklist=async(c)=>{
    setChecklist([]);setLoading(true);
    try{const d=await apiFetch('/api/checklist',{country:c,level:profile?.level,nationality:profile?.nationality});setChecklist(d.checklist||[]);}
    catch(e){setChecklist(["Error loading checklist. Please try again."]);}
    setLoading(false);
  };

  const selectCountry=c=>{setCountry(c);setChecked({});loadChecklist(c);};

  return<div><h1 style={{fontSize:mob?"24px":"32px",fontWeight:"800",color:th.text,margin:"0 0 12px"}}>Post-Acceptance</h1>
    <div style={{display:"flex",gap:"6px",marginBottom:"14px",flexWrap:"wrap"}}>{countries.map(c=><Btn key={c} t={th} small v={country===c?"primary":"ghost"} onClick={()=>selectCountry(c)}>{c}</Btn>)}</div>
    {country?loading?<Spinner t={th} msg="Generating checklist..."/>:<><Card t={th} style={{marginBottom:"14px",padding:"16px"}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:"6px"}}><span style={{color:th.text,fontWeight:"600"}}>{country}</span><span style={{color:done===checklist.length?th.success:th.accent,fontWeight:"700"}}>{done}/{checklist.length}</span></div><div style={{height:"8px",borderRadius:"4px",background:th.border}}><div style={{height:"100%",borderRadius:"4px",width:`${checklist.length?(done/checklist.length)*100:0}%`,background:th.accent,transition:"width 0.4s"}}/></div></Card><div style={{display:"flex",flexDirection:"column",gap:"6px"}}>{checklist.map((item,i)=>{const ck=checked[`${country}-${i}`];return<div key={i} onClick={()=>setChecked(p=>({...p,[`${country}-${i}`]:!p[`${country}-${i}`]}))} style={{display:"flex",alignItems:"center",gap:"10px",padding:"10px 14px",background:th.card,borderRadius:"10px",border:`1px solid ${ck?th.success+"44":th.border}`,cursor:"pointer",opacity:ck?0.65:1}}><div style={{width:"20px",height:"20px",borderRadius:"5px",border:`2px solid ${ck?th.success:th.border}`,background:ck?th.success:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{ck&&<I n="check" s={12} c="#fff"/>}</div><span style={{color:ck?th.muted:th.text,fontSize:"13px",textDecoration:ck?"line-through":"none"}}>{item}</span></div>})}</div></>
    :<Card t={th} style={{textAlign:"center",padding:"48px"}}><div style={{fontSize:"40px",marginBottom:"10px"}}>✅</div><h3 style={{color:th.text}}>Select a country above</h3></Card>}
  </div>;
}

function ProfilePage({t:th,profile,setProfile}){
  const[saved,setSaved]=useState(false);const set=(k,v)=>setProfile(p=>({...p,[k]:v}));const mob=useIsMobile();
  const save=()=>{setProfile(p=>({...p,resumeText:[p.education,p.experience,p.skills,p.achievements].filter(Boolean).join(" ")}));setSaved(true);setTimeout(()=>setSaved(false),3000)};
  const filled=[profile.name,profile.course,profile.country,profile.level,profile.gpa,profile.budget,profile.education,profile.experience,profile.skills,profile.achievements].filter(Boolean).length;const pct=Math.round((filled/10)*100);
  const COUNTRIES=["Canada","Australia","Germany","United Kingdom","Singapore","South Africa","Switzerland","USA","Netherlands","France","Japan","New Zealand","Ireland","Sweden","Norway","Finland","Denmark","Austria","Belgium","Portugal"];
  return<div><h1 style={{fontSize:mob?"24px":"32px",fontWeight:"800",color:th.text,margin:"0 0 12px"}}>My Profile</h1>
    <Card t={th} style={{marginBottom:"16px",padding:"16px"}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:"6px"}}><span style={{color:th.text,fontWeight:"600"}}>Completeness</span><span style={{color:th.accent,fontWeight:"700"}}>{pct}%</span></div><div style={{height:"8px",borderRadius:"4px",background:th.border}}><div style={{height:"100%",borderRadius:"4px",width:`${pct}%`,background:th.accent,transition:"width 0.5s"}}/></div></Card>
    <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:"14px"}}><Card t={th}><h3 style={{color:th.text,marginTop:0}}>👤 Personal</h3><Inp t={th} label="Name" value={profile.name} onChange={v=>set("name",v)} placeholder="Full name"/><Inp t={th} label="Email" value={profile.email} onChange={v=>set("email",v)} placeholder="email"/><Inp t={th} label="Nationality" value={profile.nationality} onChange={v=>set("nationality",v)} placeholder="e.g. Nigerian"/><Inp t={th} label="Level" value={profile.level} onChange={v=>set("level",v)} options={["High School","Bachelor's","Master's","PhD"]}/></Card>
    <Card t={th}><h3 style={{color:th.text,marginTop:0}}>🎯 Preferences</h3><Inp t={th} label="Course" value={profile.course} onChange={v=>set("course",v)} placeholder="Computer Science..."/><Inp t={th} label="Country" value={profile.country} onChange={v=>set("country",v)} options={COUNTRIES}/><Inp t={th} label="Budget" value={profile.budget} onChange={v=>set("budget",v)} placeholder="$20,000 USD"/><Inp t={th} label="GPA" value={profile.gpa} onChange={v=>set("gpa",v)} placeholder="3.5/4.0"/></Card>
    <Card t={th} style={{gridColumn:mob?"1":"1/-1"}}><h3 style={{color:th.text,marginTop:0}}>📄 Resume <Badge t={th} color={th.accent}>Powers matching</Badge></h3><div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:"14px"}}><div><Inp t={th} label="Education" value={profile.education} onChange={v=>set("education",v)} placeholder="BSc CS, MIT, 2024" textarea/><Inp t={th} label="Experience" value={profile.experience} onChange={v=>set("experience",v)} placeholder="Intern, Research..." textarea/></div><div><Inp t={th} label="Skills" value={profile.skills} onChange={v=>set("skills",v)} placeholder="Python, ML..."/><Inp t={th} label="Achievements" value={profile.achievements} onChange={v=>set("achievements",v)} placeholder="Dean's List..." textarea/><Inp t={th} label="Interests" value={profile.interests} onChange={v=>set("interests",v)} placeholder="AI, Basketball..."/></div></div></Card></div>
    <div style={{marginTop:"14px"}}><Btn t={th} icon="check" onClick={save}>{saved?"✅ Saved!":"Save Profile"}</Btn></div>
  </div>;
}

// ====================== MAIN APP ======================
const NAV=[{id:"dashboard",l:"Dashboard",i:"home"},{id:"schools",l:"Schools",i:"school"},{id:"scholarships",l:"Scholarships",i:"award"},{id:"tracker",l:"Applications",i:"calendar"},{id:"compare",l:"Compare",i:"compare"},{id:"letters",l:"Letters",i:"doc"},{id:"resume",l:"Resume",i:"resume"},{id:"vault",l:"Documents",i:"upload"},{id:"advisor",l:"AI Advisor",i:"chat"},{id:"postaccept",l:"Checklist",i:"checklist"},{id:"profile",l:"Profile",i:"user"}];

export default function App(){
  const[mode,setMode]=useState(()=>{try{return localStorage.getItem('us-theme')||'dark'}catch{return'dark'}});
  const[user,setUser]=useState(()=>{try{const u=localStorage.getItem('us-user');return u?JSON.parse(u):null}catch{return null}});
  const[page,setPage]=useState("dashboard");const[selSchool,setSelSchool]=useState(null);
  const[allSchools,setAllSchools]=useState([]);
  const[profile,setProfile]=useState(()=>{try{const s=localStorage.getItem('us-profile');return s?JSON.parse(s):{name:"",age:"",nationality:"",level:"",course:"",country:"",budget:"",gpa:"",email:"",phone:"",education:"",experience:"",skills:"",achievements:"",languages:"",interests:"",resumeText:""}}catch{return{name:"",age:"",nationality:"",level:"",course:"",country:"",budget:"",gpa:"",email:"",phone:"",education:"",experience:"",skills:"",achievements:"",languages:"",interests:"",resumeText:""}}});
  const[savedSchools,setSavedSchools]=useState(()=>{try{const s=localStorage.getItem('us-saved');return s?JSON.parse(s):[]}catch{return[]}});
  const[apps,setApps]=useState(()=>{try{const a=localStorage.getItem('us-apps');return a?JSON.parse(a):[]}catch{return[]}});
  const[docs,setDocs]=useState([]);
  const[sidebar,setSidebar]=useState(false);
  const mob=useIsMobile();const th=T[mode];

  useEffect(()=>{try{localStorage.setItem('us-theme',mode)}catch{}},[mode]);
  useEffect(()=>{try{localStorage.setItem('us-user',JSON.stringify(user))}catch{}},[user]);
  useEffect(()=>{try{localStorage.setItem('us-profile',JSON.stringify(profile))}catch{}},[profile]);
  useEffect(()=>{try{localStorage.setItem('us-saved',JSON.stringify(savedSchools))}catch{}},[savedSchools]);
  useEffect(()=>{try{localStorage.setItem('us-apps',JSON.stringify(apps))}catch{}},[apps]);

  // Track all schools seen so Compare can work
  const handleSetSelectedSchool=(school)=>{setSelSchool(school);if(school){setAllSchools(p=>{const exists=p.find(s=>s.id===school.id);return exists?p:[...p,school];});}};
  const handleSetSavedSchools=(updater)=>{setSavedSchools(updater);};

  const onLogin=(u)=>{setUser(u);if(u.name)setProfile(p=>({...p,name:u.name,email:u.email}))};
  const onLogout=()=>{setUser(null);try{localStorage.removeItem('us-user')}catch{}};

  if(!user)return<AuthPage t={th} onLogin={onLogin}/>;

  const props={t:th,setPage,setSelectedSchool:handleSetSelectedSchool,profile,setProfile,savedSchools,setSavedSchools:handleSetSavedSchools,applications:apps,setApplications:setApps,documents:docs,setDocuments:setDocs,allSchools};
  const renderPage=()=>{switch(page){case"dashboard":return<Dashboard {...props}/>;case"schools":return<SchoolsPage {...props}/>;case"detail":return<SchoolDetail school={selSchool} {...props}/>;case"scholarships":return<ScholarshipsPage {...props}/>;case"tracker":return<AppTracker {...props}/>;case"compare":return<ComparePage {...props}/>;case"letters":return<LetterDrafter {...props}/>;case"resume":return<ResumeBuilder {...props}/>;case"vault":return<DocVault {...props}/>;case"advisor":return<AIAdvisor {...props}/>;case"postaccept":return<PostAccept {...props}/>;case"profile":return<ProfilePage {...props}/>;default:return<Dashboard {...props}/>}};

  return<div style={{display:"flex",height:"100vh",background:th.bg,fontFamily:"'DM Sans',-apple-system,sans-serif",color:th.text,overflow:"hidden",transition:"background 0.3s"}}>
    <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    {mob&&sidebar&&<div onClick={()=>setSidebar(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:98}}/>}
    <div style={{width:mob?(sidebar?"260px":"0"):"240px",background:th.card,borderRight:`1px solid ${th.border}`,display:"flex",flexDirection:"column",transition:"width 0.3s",flexShrink:0,overflow:"hidden",position:mob?"fixed":"relative",height:"100vh",zIndex:99}}>
      <div style={{padding:"12px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`1px solid ${th.border}`,minHeight:"56px"}}>
        <div style={{display:"flex",alignItems:"center",gap:"8px"}}><Logo size={30} color={th.accent}/><span style={{fontWeight:"800",fontSize:"17px",color:th.text}}>UniScout</span></div>
        <div style={{display:"flex",gap:"4px"}}>
          <button onClick={()=>setMode(m=>m==='dark'?'light':'dark')} style={{background:th.surface,border:`1px solid ${th.border}`,borderRadius:"8px",width:"32px",height:"32px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:th.accent}}><I n={mode==='dark'?'sun':'moon'} s={14}/></button>
          {mob&&<button onClick={()=>setSidebar(false)} style={{background:th.surface,border:`1px solid ${th.border}`,borderRadius:"8px",width:"32px",height:"32px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:th.muted}}><I n="x" s={14}/></button>}
        </div>
      </div>
      <nav style={{flex:1,padding:"6px",overflowY:"auto"}}>{NAV.map(item=>{const active=page===item.id||(page==="detail"&&item.id==="schools");return<button key={item.id} onClick={()=>{setPage(item.id);if(mob)setSidebar(false)}} style={{width:"100%",display:"flex",alignItems:"center",gap:"10px",padding:"9px 12px",background:active?th.accent+"18":"transparent",border:"none",borderRadius:"8px",cursor:"pointer",color:active?th.accent:th.muted,fontWeight:active?"700":"500",fontSize:"13px",fontFamily:"inherit",marginBottom:"1px",textAlign:"left"}}><I n={item.i} s={17}/>{item.l}</button>})}</nav>
      <div style={{padding:"8px",borderTop:`1px solid ${th.border}`}}><button onClick={onLogout} style={{width:"100%",padding:"8px",border:"none",background:th.danger+"12",color:th.danger,cursor:"pointer",fontSize:"13px",fontFamily:"inherit",borderRadius:"8px",fontWeight:"600"}}>Sign Out</button></div>
    </div>
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      {mob&&<div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 16px",borderBottom:`1px solid ${th.border}`,background:th.card,flexShrink:0}}>
        <button onClick={()=>setSidebar(true)} style={{background:"none",border:"none",color:th.text,cursor:"pointer",padding:"4px"}}><I n="menu" s={22}/></button>
        <div style={{display:"flex",alignItems:"center",gap:"6px"}}><Logo size={22} color={th.accent}/><span style={{fontWeight:"800",fontSize:"16px",color:th.text}}>UniScout</span></div>
        <button onClick={()=>setMode(m=>m==='dark'?'light':'dark')} style={{background:"none",border:"none",color:th.accent,cursor:"pointer",padding:"4px"}}><I n={mode==='dark'?'sun':'moon'} s={18}/></button>
      </div>}
      <div style={{flex:1,overflowY:"auto",padding:mob?"16px":"26px 34px"}}>{renderPage()}</div>
    </div>
  </div>;
}
