'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { apiClient, ranksApi } from '@/services/api';
import { cn } from '@/lib/utilsnew';
import { Trophy, Users, Share2, CheckCircle, Clock, Star, Download, ArrowRight, Coins } from 'lucide-react';

const RANKS = [
  { level:1, badge:'1', name:'Coordinator',        salary:50,    team:0,    refs:0,    color:'#94A3B8', bg:'rgba(148,163,184,0.08)',  border:'rgba(148,163,184,0.15)' },
  { level:2, badge:'2', name:'Regional Ambassador', salary:120,   team:5,    refs:3,    color:'#22C55E', bg:'rgba(34,197,94,0.08)',    border:'rgba(34,197,94,0.15)' },
  { level:3, badge:'3', name:'Visionary Elite',     salary:280,   team:20,   refs:10,   color:'#8B5CF6', bg:'rgba(139,92,246,0.08)',   border:'rgba(139,92,246,0.15)' },
  { level:4, badge:'Diamond', name:'Legacy Executive',    salary:600,   team:50,   refs:25,   color:'#F59E0B', bg:'rgba(245,158,11,0.08)',   border:'rgba(245,158,11,0.15)' },
  { level:5, badge:'Crown', name:'National Elite',      salary:1200,  team:150,  refs:75,   color:'#EF4444', bg:'rgba(239,68,68,0.08)',    border:'rgba(239,68,68,0.15)' },
  { level:6, badge:'S', name:'Legacy Ambassador',   salary:2400,  team:500,  refs:200,  color:'#3B82F6', bg:'rgba(59,130,246,0.08)',   border:'rgba(59,130,246,0.15)' },
  { level:7, badge:'Flame', name:'Freedom Icon',        salary:4800,  team:1500, refs:500,  color:'#EC4899', bg:'rgba(236,72,153,0.08)',   border:'rgba(236,72,153,0.15)' },
  { level:8, badge:'Zap', name:'Infinity Legend',     salary:9600,  team:5000, refs:1500, color:'#F97316', bg:'rgba(249,115,22,0.08)',   border:'rgba(249,115,22,0.15)' },
];

export default function RanksPage() {
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState<'progress'|'images'|'leaderboard'|'showcase'>('progress');
  const [toast, setToast] = useState('');
  const showToast = (m: string) => { setToast(m); setTimeout(()=>setToast(''),3000); };

  const { data: rankData } = useQuery({ queryKey:['my-rank'], queryFn: ranksApi.getMyRank });
  const { data: leaderData } = useQuery({ queryKey:['leaderboard'], queryFn: ranksApi.getLeaderboard, enabled:activeTab==='leaderboard' });
  const { data: showcaseData } = useQuery({ queryKey:['showcase'], queryFn: ranksApi.getShowcase, enabled:activeTab==='showcase' });

  const rank = rankData?.data?.data?.rank;
  const images = rankData?.data?.data?.images || [];
  const leaderboard = leaderData?.data?.data || [];
  const showcase = showcaseData?.data?.data || [];
  const unread = images.filter((i: {userAcknowledged:boolean})=>!i.userAcknowledged).length;

  const claimMutation = useMutation({
    mutationFn: (level: number) => ranksApi.claim(level),
    onSuccess: () => { showToast('Rank claim submitted! Admin will upload your certificate.'); qc.invalidateQueries({queryKey:['my-rank']}); },
    onError: (e: {response?:{data?:{message?:string}}}) => showToast(''+( e.response?.data?.message||'Failed')),
  });
  const ackMutation = useMutation({
    mutationFn: (id: string) => ranksApi.acknowledgeImage(id),
    onSuccess: () => qc.invalidateQueries({queryKey:['my-rank']}),
  });
  const shareMutation = useMutation({
    mutationFn: (id: string) => ranksApi.shareImage(id),
    onSuccess: () => { showToast(' Shared to showcase!'); qc.invalidateQueries({queryKey:['my-rank']}); },
  });
  const salaryClaim = useMutation({
    mutationFn: ranksApi.claimSalary,
    onSuccess: () => { showToast('Monthly salary claimed!'); },
    onError: (e: {response?:{data?:{message?:string}}}) => showToast(''+(e.response?.data?.message||'Failed')),
  });

  const currentRankCfg = RANKS.find(r=>r.level===(rank?.currentRank||1)) || RANKS[0];

  return (
    
      <div className="p-5 space-y-5 max-w-5xl mx-auto">
        {/* Toast */}
        <AnimatePresence>
          {toast && (
            <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} exit={{opacity:0}}
              className="fixed top-16 right-5 z-50 px-4 py-3 rounded-xl text-sm shadow-xl"
              style={{background:'#0F1520',border:`1px solid ${!toast.startsWith('[ERR]')||toast.startsWith('Coins')||toast.startsWith('')?'rgba(31,224,128,0.3)':'rgba(255,75,85,0.3)'}`,color:'#E8ECF4'}}
            >
              {toast} <button onClick={()=>setToast('')} className="ml-3 opacity-50">x</button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero rank card */}
        <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}
          className="rounded-2xl p-6 relative overflow-hidden"
          style={{background:currentRankCfg.bg, border:`1px solid ${currentRankCfg.border}`}}
        >
          <div className="absolute right-0 top-0 bottom-0 w-64 overflow-hidden pointer-events-none opacity-20">
            <Image src="/hero-bitcoin-bull.png" alt="rank" width={256} height={180} className="w-full h-full object-cover" />
          </div>
          <div className="relative flex items-center gap-5">
            <div className="text-6xl drop-shadow-xl">{currentRankCfg.badge}</div>
            <div className="flex-1">
              <p className="text-[11px] font-bold uppercase tracking-widest mb-1" style={{color:currentRankCfg.color}}>Current Rank</p>
              <h1 className="font-black text-2xl mb-1" style={{color:'#E8ECF4'}}>{currentRankCfg.name}</h1>
              <p className="text-xs" style={{color:'#8B95A8'}}>Level {rank?.currentRank||1} of 8 · {rank?.teamSize||0} team members · {rank?.directReferrals||0} direct refs</p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="text-xs px-3 py-1 rounded-full font-semibold" style={{background:'rgba(31,224,128,0.1)',color:'#1FE080',border:'1px solid rgba(31,224,128,0.2)'}}>
                  ${currentRankCfg.salary}/month salary
                </span>
                {rank?.claimStatus==='image_pending'
                  ? <span className="text-xs px-3 py-1 rounded-full flex items-center gap-1" style={{background:'rgba(245,183,49,0.1)',color:'#F5B731',border:'1px solid rgba(245,183,49,0.2)'}}>
                      <Clock className="w-3 h-3"/> Certificate pending...
                    </span>
                  : rank?.isEligibleForNextRank && (
                      <button onClick={()=>claimMutation.mutate((rank.currentRank||0)+1)} disabled={claimMutation.isPending}
                        className="text-xs px-3 py-1 rounded-full font-semibold text-white"
                        style={{background:'linear-gradient(135deg,#3182F6,#1a6fd4)'}}
                      >
                        {claimMutation.isPending?'Submitting...':' Claim Next Rank'}
                      </button>
                    )
                }
                <button onClick={()=>salaryClaim.mutate()} disabled={salaryClaim.isPending}
                  className="text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1"
                  style={{background:'rgba(249,115,22,0.1)',color:'#F97316',border:'1px solid rgba(249,115,22,0.2)'}}
                >
                  <Coins className="w-3 h-3"/>
                  {salaryClaim.isPending?'Claiming...':'Claim Monthly Salary'}
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div style={{borderBottom:'1px solid rgba(255,255,255,0.07)'}} className="flex gap-0">
          {([['progress','Progress'],['images',`Certificates${unread>0?` (${unread})`:''}` ],['leaderboard','Leaderboard'],['showcase','Showcase']] as const).map(([t,l])=>(
            <button key={t} onClick={()=>setActiveTab(t)}
              className={cn('px-5 py-2.5 text-xs font-semibold transition-all',
                activeTab===t?'tab-active':'tab-inactive'
              )}
            >{l}</button>
          ))}
        </div>

        {/* PROGRESS TAB */}
        {activeTab==='progress' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {RANKS.map((r,i)=>{
              const isCompleted = (rank?.currentRank||0) >= r.level;
              const isCurrent   = (rank?.currentRank||0) === r.level;
              return (
                <motion.div key={r.level} initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}} transition={{delay:i*0.04}}
                  className="rounded-xl p-4 flex items-center gap-4 transition-all"
                  style={{background:r.bg, border:`1px solid ${r.border}`, opacity:!isCompleted&&!isCurrent?0.55:1}}
                >
                  <div className="text-3xl">{r.badge}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs font-bold" style={{color:r.color}}>{r.name}</span>
                      {isCompleted&&<CheckCircle className="w-3.5 h-3.5" style={{color:'#1FE080'}}/>}
                      {isCurrent&&<span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{background:'rgba(49,130,246,0.15)',color:'#3182F6'}}>CURRENT</span>}
                    </div>
                    <div className="flex items-center gap-3 text-[11px]" style={{color:'#8B95A8'}}>
                      <span>Team: {r.team>0?`${r.team}+`:'—'}</span>
                      <span>Refs: {r.refs>0?`${r.refs}+`:'—'}</span>
                      <span className="font-bold" style={{color:'#1FE080'}}>${r.salary}/mo</span>
                    </div>
                    <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{background:'rgba(255,255,255,0.06)'}}>
                      <div className="h-full rounded-full transition-all duration-700" style={{width:isCompleted?'100%':isCurrent?'60%':'0%',background:r.color}} />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* CERTIFICATES TAB */}
        {activeTab==='images' && (
          <div>
            {images.length===0 ? (
              <div className="rounded-2xl p-12 text-center" style={{background:'#0F1520',border:'1px solid rgba(255,255,255,0.07)'}}>
                <div className="relative w-48 mx-auto mb-5">
                  <Image src="/hero-bull-logo.png" alt="No certs" width={192} height={192} className="w-full h-auto opacity-30" />
                </div>
                <p className="text-sm font-bold mb-2" style={{color:'#E8ECF4'}}>No certificates yet</p>
                <p className="text-xs" style={{color:'#8B95A8'}}>Claim your next rank — admin will issue your certificate!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {images.map((img: {_id:string;imageUrl:string;rankName:string;rankLevel:number;message?:string;userAcknowledged:boolean;sharedToFeed:boolean;createdAt:string})=>{
                  const cfg = RANKS.find(r=>r.level===img.rankLevel)||RANKS[0];
                  return (
                    <motion.div key={img._id} initial={{opacity:0,scale:0.96}} animate={{opacity:1,scale:1}}
                      className="rounded-2xl overflow-hidden"
                      style={{border:`2px solid ${!img.userAcknowledged?cfg.color+'60':'rgba(255,255,255,0.07)'}`}}
                    >
                      {!img.userAcknowledged&&(
                        <div className="px-4 py-2 flex items-center gap-2 text-[11px] font-bold"
                          style={{background:cfg.bg,color:cfg.color}}>
                          <Star className="w-3 h-3 fill-current"/>New rank certificate received!
                        </div>
                      )}
                      <img src={img.imageUrl} alt={img.rankName} className="w-full object-contain" style={{maxHeight:280,background:'#0A0E17'}} />
                      <div className="p-4" style={{background:'#0F1520'}}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">{cfg.badge}</span>
                          <div>
                            <p className="text-sm font-bold" style={{color:cfg.color}}>{img.rankName}</p>
                            <p className="text-[10px]" style={{color:'#5A6478'}}>{new Date(img.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        {img.message&&<p className="text-[11px] mb-3 italic" style={{color:'#8B95A8'}}>"{img.message}"</p>}
                        <div className="flex gap-2">
                          {!img.userAcknowledged&&(
                            <button onClick={()=>ackMutation.mutate(img._id)}
                              className="flex-1 py-2 rounded-lg text-xs font-semibold text-white flex items-center justify-center gap-1"
                              style={{background:'linear-gradient(135deg,#3182F6,#1a6fd4)'}}
                            >
                              <CheckCircle className="w-3 h-3"/> Acknowledge
                            </button>
                          )}
                          {!img.sharedToFeed&&(
                            <button onClick={()=>shareMutation.mutate(img._id)}
                              className="flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1"
                              style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)',color:'#8B95A8'}}
                            >
                              <Share2 className="w-3 h-3"/> Share
                            </button>
                          )}
                          <a href={img.imageUrl} download className="py-2 px-3 rounded-lg text-xs flex items-center gap-1" style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)',color:'#8B95A8'}}>
                            <Download className="w-3 h-3"/>
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* LEADERBOARD TAB */}
        {activeTab==='leaderboard' && (
          <div className="rounded-xl overflow-hidden" style={{background:'#0F1520',border:'1px solid rgba(255,255,255,0.07)'}}>
            <div className="divide-y" style={{borderColor:'rgba(255,255,255,0.05)'}}>
              {leaderboard.length===0 ? (
                <div className="py-12 text-center text-sm" style={{color:'#5A6478'}}>Loading leaderboard...</div>
              ) : leaderboard.map((entry: {_id:string;currentRank:number;teamSize:number;userId:{fullName:string}}, i: number)=>{
                const cfg = RANKS.find(r=>r.level===entry.currentRank)||RANKS[0];
                return (
                  <div key={entry._id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/2 transition-colors">
                    <span className="w-7 text-center text-sm font-black" style={{color:i<3?['#F5B731','#94A3B8','#CD7C2F'][i]:'#5A6478'}}>
                      {i<3?['3','2','1'][i]:i+1}
                    </span>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{background:cfg.bg,color:cfg.color}}>
                      {entry.userId?.fullName?.[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold" style={{color:'#E8ECF4'}}>{entry.userId?.fullName}</p>
                      <p className="text-[10px]" style={{color:'#5A6478'}}>{entry.teamSize} team members</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm">{cfg.badge}</span>
                      <p className="text-[10px] font-bold" style={{color:cfg.color}}>{cfg.name}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SHOWCASE TAB */}
        {activeTab==='showcase' && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {showcase.length===0 ? (
              <div className="col-span-3 py-12 text-center" style={{color:'#5A6478'}}>
                <Image src="/hero-bull-logo.png" alt="empty" width={80} height={80} className="mx-auto mb-3 opacity-20" />
                <p className="text-sm">No shared certificates yet</p>
              </div>
            ) : showcase.map((img: {_id:string;imageUrl:string;rankName:string;rankLevel:number;userId:{fullName:string};createdAt:string})=>{
              const cfg = RANKS.find(r=>r.level===img.rankLevel)||RANKS[0];
              return (
                <motion.div key={img._id} initial={{opacity:0,scale:0.94}} animate={{opacity:1,scale:1}}
                  className="rounded-xl overflow-hidden group cursor-pointer"
                  style={{border:'1px solid rgba(255,255,255,0.07)'}}
                >
                  <div className="aspect-square overflow-hidden" style={{background:'#0A0E17'}}>
                    <img src={img.imageUrl} alt={img.rankName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-3" style={{background:'#0F1520'}}>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{cfg.badge}</span>
                      <div>
                        <p className="text-xs font-semibold" style={{color:'#E8ECF4'}}>{img.userId?.fullName}</p>
                        <p className="text-[10px]" style={{color:cfg.color}}>{img.rankName}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
   
  );
}
